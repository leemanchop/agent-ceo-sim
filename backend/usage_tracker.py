"""
Usage + cost + rate-limit tracker for every Anthropic SDK call.

Every agent (Researcher, CEO, Oracle, Editor, PostMortem) makes its calls
through `tracked_messages_create` (non-streaming) or `tracked_messages_stream`
(streaming). Both wrappers extract the usage block from the final response,
record a row in /tmp/usage.db, and stash the latest rate-limit headers per
model in a module-level dict.

Schema:
    CREATE TABLE usage (
        id            INTEGER PRIMARY KEY,
        ts            TEXT,
        run_id        TEXT,
        agent         TEXT,
        model         TEXT,
        input_tokens  INT,
        output_tokens INT,
        cache_read    INT,
        cache_write   INT,
        cost_usd      REAL
    )

Rates (USD per million tokens, as of 2026-05-02):
    Opus 4.7  : $15  in / $75  out / $1.50 cache-read / $18.75 cache-write
    Sonnet 4.6: $3   in / $15  out / $0.30 cache-read / $3.75  cache-write
    Haiku 4.5 : $1   in / $5   out / $0.10 cache-read / $1.25  cache-write

NOTE on persistence: we write to /tmp/usage.db. On Modal, /tmp is ephemeral
(reset per container). For the hackathon this is fine — the FastAPI app keeps
the latest container's data, and a stop-the-world summary at run-end is good
enough. For production, swap the SQLITE_PATH to a Modal volume mount and add
a periodic S3 export. Search this file for "TODO: persistence" to find the
swap point.
"""

from __future__ import annotations

import logging
import os
import sqlite3
import threading
import time
from contextlib import contextmanager
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Iterator, Optional

try:
    import anthropic  # type: ignore
except Exception:  # pragma: no cover — keeps import-time errors readable in dev
    anthropic = None  # type: ignore


log = logging.getLogger("usage_tracker")


# TODO: persistence — swap to a Modal volume path (e.g. /vol/usage.db) and
# wire an S3 export job before public launch.
SQLITE_PATH = os.environ.get("USAGE_DB_PATH", "/tmp/usage.db")


# ----- pricing -------------------------------------------------------------

# Per-million-token USD rates. Keyed by *model family prefix* so we don't have
# to update this for every minor revision (claude-opus-4-7-20260101 etc.).
_PRICING: Dict[str, Dict[str, float]] = {
    "claude-opus-4-7":   {"in": 15.0, "out": 75.0, "cache_read": 1.50, "cache_write": 18.75},
    "claude-sonnet-4-6": {"in":  3.0, "out": 15.0, "cache_read": 0.30, "cache_write":  3.75},
    "claude-haiku-4-5":  {"in":  1.0, "out":  5.0, "cache_read": 0.10, "cache_write":  1.25},
}


def _rate_for(model: str) -> Dict[str, float]:
    for prefix, rates in _PRICING.items():
        if model.startswith(prefix):
            return rates
    # Unknown model — log loudly, fall back to Sonnet rates so we don't crash.
    log.warning("usage_tracker: unknown model %r, falling back to Sonnet rates", model)
    return _PRICING["claude-sonnet-4-6"]


def compute_cost_usd(
    model: str,
    input_tokens: int,
    output_tokens: int,
    cache_read: int,
    cache_write: int,
) -> float:
    r = _rate_for(model)
    return (
        (input_tokens   / 1_000_000.0) * r["in"]
      + (output_tokens  / 1_000_000.0) * r["out"]
      + (cache_read     / 1_000_000.0) * r["cache_read"]
      + (cache_write    / 1_000_000.0) * r["cache_write"]
    )


# ----- sqlite store --------------------------------------------------------

_DB_LOCK = threading.Lock()


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(SQLITE_PATH, timeout=5.0)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS usage (
            id            INTEGER PRIMARY KEY,
            ts            TEXT NOT NULL,
            run_id        TEXT,
            agent         TEXT,
            model         TEXT,
            input_tokens  INTEGER NOT NULL DEFAULT 0,
            output_tokens INTEGER NOT NULL DEFAULT 0,
            cache_read    INTEGER NOT NULL DEFAULT 0,
            cache_write   INTEGER NOT NULL DEFAULT 0,
            cost_usd      REAL    NOT NULL DEFAULT 0.0
        )
        """
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_usage_run_id ON usage(run_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_usage_ts     ON usage(ts)")
    return conn


def _record(
    *,
    run_id: Optional[str],
    agent: str,
    model: str,
    input_tokens: int,
    output_tokens: int,
    cache_read: int,
    cache_write: int,
) -> float:
    """Write a single usage row. Returns the cost in USD."""
    cost = compute_cost_usd(model, input_tokens, output_tokens, cache_read, cache_write)
    ts = datetime.now(timezone.utc).isoformat()
    with _DB_LOCK:
        conn = _connect()
        try:
            conn.execute(
                "INSERT INTO usage "
                "(ts, run_id, agent, model, input_tokens, output_tokens, "
                " cache_read, cache_write, cost_usd) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    ts, run_id, agent, model,
                    int(input_tokens), int(output_tokens),
                    int(cache_read), int(cache_write),
                    float(cost),
                ),
            )
            conn.commit()
        finally:
            conn.close()
    log.info(
        "usage: run=%s agent=%s model=%s in=%d out=%d cr=%d cw=%d cost=$%.6f",
        run_id, agent, model, input_tokens, output_tokens,
        cache_read, cache_write, cost,
    )
    return cost


# ----- rate-limit headers --------------------------------------------------

# Latest rate-limit snapshot per model. Updated on every response.
_RATE_LIMITS: Dict[str, Dict[str, Any]] = {}
_RATE_LOCK = threading.Lock()

_RL_HEADER_KEYS = (
    "anthropic-ratelimit-requests-remaining",
    "anthropic-ratelimit-requests-reset",
    "anthropic-ratelimit-tokens-remaining",
    "anthropic-ratelimit-tokens-reset",
    "anthropic-ratelimit-input-tokens-remaining",
    "anthropic-ratelimit-input-tokens-reset",
    "anthropic-ratelimit-output-tokens-remaining",
    "anthropic-ratelimit-output-tokens-reset",
)


def _capture_rate_limits(model: str, headers: Any) -> None:
    if not headers:
        return
    snap: Dict[str, Any] = {"observed_at": datetime.now(timezone.utc).isoformat()}
    # `headers` may be httpx.Headers, dict, or None — all support .get().
    getter = getattr(headers, "get", None)
    if not callable(getter):
        return
    for k in _RL_HEADER_KEYS:
        v = getter(k)
        if v is not None:
            # Normalise to the short-name keys the user asked for.
            short = (
                k.replace("anthropic-ratelimit-", "")
                 .replace("-remaining", "_remaining")
                 .replace("-reset", "_reset")
            )
            snap[short] = v
    with _RATE_LOCK:
        _RATE_LIMITS[model] = snap


def current_rate_limits() -> Dict[str, Dict[str, Any]]:
    """Returns latest rate-limit headers per model: requests_remaining,
    tokens_remaining, reset_at (and the input/output variants when present)."""
    with _RATE_LOCK:
        # Return a deep-ish copy so callers can't mutate our state.
        return {m: dict(v) for m, v in _RATE_LIMITS.items()}


# ----- the wrapper ---------------------------------------------------------

def _extract_usage(usage_obj: Any) -> Dict[str, int]:
    """Pull token counts off an Anthropic Usage object (or dict)."""
    def g(name: str) -> int:
        v = getattr(usage_obj, name, None)
        if v is None and isinstance(usage_obj, dict):
            v = usage_obj.get(name)
        return int(v or 0)
    return {
        "input_tokens": g("input_tokens"),
        "output_tokens": g("output_tokens"),
        "cache_read_input_tokens": g("cache_read_input_tokens"),
        "cache_creation_input_tokens": g("cache_creation_input_tokens"),
    }


def _client() -> "anthropic.Anthropic":
    if anthropic is None:
        raise RuntimeError(
            "anthropic SDK not installed. Add `anthropic` to the Modal image."
        )
    # Anthropic SDK has built-in retry; we keep the default (max_retries=2).
    # We just need to log 429s when they happen.
    return anthropic.Anthropic()


def tracked_messages_create(
    *,
    run_id: Optional[str],
    agent: str,
    model: str,
    **kwargs: Any,
) -> Any:
    """
    Wraps `client.messages.create` in a non-streaming way.

    Use `.with_raw_response` so we can read the rate-limit headers off the
    HTTP response, then `.parse()` to get the Anthropic Message object.

    The Anthropic SDK retries 429s automatically (built-in). When a 429
    surfaces here, we log it with run_id + model + retry-after so it's visible.
    """
    client = _client()
    started = time.time()
    try:
        raw = client.messages.with_raw_response.create(model=model, **kwargs)
    except Exception as exc:  # pragma: no cover — we want the trace
        if anthropic is not None and isinstance(exc, anthropic.RateLimitError):
            retry_after = getattr(getattr(exc, "response", None), "headers", {})
            ra = retry_after.get("retry-after") if hasattr(retry_after, "get") else None
            log.error(
                "anthropic 429: run=%s agent=%s model=%s retry_after=%s elapsed=%.2fs",
                run_id, agent, model, ra, time.time() - started,
            )
        raise

    headers = getattr(raw, "headers", None)
    _capture_rate_limits(model, headers)

    msg = raw.parse()
    usage = _extract_usage(getattr(msg, "usage", None))
    _record(
        run_id=run_id, agent=agent, model=model,
        input_tokens=usage["input_tokens"],
        output_tokens=usage["output_tokens"],
        cache_read=usage["cache_read_input_tokens"],
        cache_write=usage["cache_creation_input_tokens"],
    )
    return msg


@contextmanager
def tracked_messages_stream(
    *,
    run_id: Optional[str],
    agent: str,
    model: str,
    **kwargs: Any,
) -> Iterator[Any]:
    """
    Wraps `client.messages.stream` — yields the stream context.

    We can't read response headers cleanly off a streaming response in the
    Python SDK, but `stream.get_final_message()` gives us the Usage block at
    the end. Caller iterates events normally:

        with tracked_messages_stream(run_id=rid, agent="ceo", model=M, **kw) as s:
            for evt in s:
                ...
    """
    client = _client()
    started = time.time()
    try:
        with client.messages.stream(model=model, **kwargs) as stream:
            yield stream
            # On normal completion, pull final message for the usage block.
            final = stream.get_final_message()
            usage = _extract_usage(getattr(final, "usage", None))
            _record(
                run_id=run_id, agent=agent, model=model,
                input_tokens=usage["input_tokens"],
                output_tokens=usage["output_tokens"],
                cache_read=usage["cache_read_input_tokens"],
                cache_write=usage["cache_creation_input_tokens"],
            )
            # Best-effort: try to grab headers off the underlying response.
            resp = getattr(stream, "response", None)
            if resp is not None:
                _capture_rate_limits(model, getattr(resp, "headers", None))
    except Exception as exc:  # pragma: no cover
        if anthropic is not None and isinstance(exc, anthropic.RateLimitError):
            log.error(
                "anthropic 429 (stream): run=%s agent=%s model=%s elapsed=%.2fs",
                run_id, agent, model, time.time() - started,
            )
        raise


# ----- summarisation -------------------------------------------------------

def summarize(run_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Aggregate usage rows.

    If run_id is given, scope by_agent/by_model totals to that run; otherwise
    aggregate across the whole DB. last_24h_cost is always global.
    current_run_cost is the per-run total (or None when run_id is omitted).
    """
    with _DB_LOCK:
        conn = _connect()
        try:
            cur = conn.cursor()

            # Scoped totals.
            if run_id:
                cur.execute(
                    "SELECT COALESCE(SUM(cost_usd),0), COUNT(*) "
                    "FROM usage WHERE run_id = ?",
                    (run_id,),
                )
            else:
                cur.execute("SELECT COALESCE(SUM(cost_usd),0), COUNT(*) FROM usage")
            total_cost, calls_count = cur.fetchone()

            # by_agent.
            if run_id:
                cur.execute(
                    "SELECT agent, COUNT(*), COALESCE(SUM(cost_usd),0), "
                    "       COALESCE(SUM(input_tokens),0), COALESCE(SUM(output_tokens),0) "
                    "FROM usage WHERE run_id = ? GROUP BY agent",
                    (run_id,),
                )
            else:
                cur.execute(
                    "SELECT agent, COUNT(*), COALESCE(SUM(cost_usd),0), "
                    "       COALESCE(SUM(input_tokens),0), COALESCE(SUM(output_tokens),0) "
                    "FROM usage GROUP BY agent"
                )
            by_agent = {
                (row[0] or "unknown"): {
                    "calls": row[1],
                    "cost_usd": round(row[2], 6),
                    "input_tokens": row[3],
                    "output_tokens": row[4],
                }
                for row in cur.fetchall()
            }

            # by_model.
            if run_id:
                cur.execute(
                    "SELECT model, COUNT(*), COALESCE(SUM(cost_usd),0), "
                    "       COALESCE(SUM(input_tokens),0), COALESCE(SUM(output_tokens),0), "
                    "       COALESCE(SUM(cache_read),0), COALESCE(SUM(cache_write),0) "
                    "FROM usage WHERE run_id = ? GROUP BY model",
                    (run_id,),
                )
            else:
                cur.execute(
                    "SELECT model, COUNT(*), COALESCE(SUM(cost_usd),0), "
                    "       COALESCE(SUM(input_tokens),0), COALESCE(SUM(output_tokens),0), "
                    "       COALESCE(SUM(cache_read),0), COALESCE(SUM(cache_write),0) "
                    "FROM usage GROUP BY model"
                )
            by_model = {
                (row[0] or "unknown"): {
                    "calls": row[1],
                    "cost_usd": round(row[2], 6),
                    "input_tokens": row[3],
                    "output_tokens": row[4],
                    "cache_read": row[5],
                    "cache_write": row[6],
                }
                for row in cur.fetchall()
            }

            # last_24h is always global.
            since = (datetime.now(timezone.utc) - timedelta(hours=24)).isoformat()
            cur.execute(
                "SELECT COALESCE(SUM(cost_usd),0) FROM usage WHERE ts >= ?",
                (since,),
            )
            (last_24h_cost,) = cur.fetchone()

            # current_run_cost.
            current_run_cost: Optional[float]
            if run_id:
                current_run_cost = round(total_cost, 6)
            else:
                current_run_cost = None
        finally:
            conn.close()

    return {
        "run_id": run_id,
        "total_cost_usd": round(total_cost, 6),
        "calls_count": calls_count,
        "by_agent": by_agent,
        "by_model": by_model,
        "last_24h_cost": round(last_24h_cost, 6),
        "current_run_cost": current_run_cost,
    }


def dump_rows(run_id: Optional[str] = None, limit: int = 1000) -> list[dict]:
    """Raw row dump — used by the `modal run ::dump_usage` entrypoint."""
    with _DB_LOCK:
        conn = _connect()
        try:
            cur = conn.cursor()
            if run_id:
                cur.execute(
                    "SELECT id, ts, run_id, agent, model, input_tokens, "
                    "       output_tokens, cache_read, cache_write, cost_usd "
                    "FROM usage WHERE run_id = ? ORDER BY id DESC LIMIT ?",
                    (run_id, limit),
                )
            else:
                cur.execute(
                    "SELECT id, ts, run_id, agent, model, input_tokens, "
                    "       output_tokens, cache_read, cache_write, cost_usd "
                    "FROM usage ORDER BY id DESC LIMIT ?",
                    (limit,),
                )
            cols = [c[0] for c in cur.description]
            return [dict(zip(cols, row)) for row in cur.fetchall()]
        finally:
            conn.close()
