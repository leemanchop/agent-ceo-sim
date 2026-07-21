"""
Persistent run-state storage backed by SQLite on a Modal Volume.

The in-memory `_RUNS` dict in `state.py` is fine for a single-container hot
loop, but Modal containers cold-restart on scale events. To survive that
without losing in-flight runs (and to power /me/runs and /archive feeds),
we mirror RunState into a SQLite DB on a Modal Volume mounted at /data.

DB path resolution:
    - /data/runs.db              (Modal — volume "agent-ceo-sim-runs")
    - /tmp/aces-runs.db          (local dev under `modal serve`)
    - $RUN_DB_PATH override      (escape hatch)

Connections are per-call (sqlite3 connections aren't thread-safe). All writes
go through a module-level lock so we can run alongside the streaming hot loop
without lock-step contention. Eventually-consistent volume sync — the auto-sync
on function exit handles cold-restart durability for completed runs; a periodic
explicit volume.commit() lives in modal_app.py for mid-run safety.

Public API (called from routes.py + state.py):
    init_db()
    save_run(state)
    load_run(run_id) -> Optional[RunState]
    list_runs(user_id=None, *, limit=50, status=None) -> list[dict]
    append_decision(run_id, turn, event_id, agent_choice, user_pred,
                    user_commit, artifact)
    append_achievement(run_id, achievement_id) -> bool
    end_run(run_id, endgame_id)
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
import threading
from dataclasses import asdict
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


log = logging.getLogger("run_store")


# ---- DB path -------------------------------------------------------------


def _resolve_db_path() -> str:
    override = os.environ.get("RUN_DB_PATH")
    if override:
        return override
    # /data is the Modal volume mount point; only present in deployed env.
    if os.path.isdir("/data"):
        return "/data/runs.db"
    return "/tmp/aces-runs.db"


SQLITE_PATH = _resolve_db_path()


_DB_LOCK = threading.Lock()


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(SQLITE_PATH, timeout=10.0)
    conn.row_factory = sqlite3.Row
    # WAL is friendly to concurrent readers + a single writer.
    try:
        conn.execute("PRAGMA journal_mode=WAL")
    except Exception:  # pragma: no cover — read-only filesystems, etc.
        pass
    return conn


# ---- schema --------------------------------------------------------------


_SCHEMA = """
CREATE TABLE IF NOT EXISTS runs (
  run_id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL,
  mode TEXT NOT NULL,
  template_id TEXT,
  company_name TEXT,
  industry TEXT,
  founder_vibe TEXT,
  length_mode TEXT,
  craziness TEXT,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  turns_elapsed INTEGER DEFAULT 0,
  endgame_id TEXT,
  bible_json TEXT,
  state_blob_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_runs_user_id ON runs(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_status ON runs(status);
CREATE INDEX IF NOT EXISTS idx_runs_started_at ON runs(started_at);

CREATE TABLE IF NOT EXISTS run_decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,
  turn INTEGER NOT NULL,
  event_id TEXT,
  agent_choice_id TEXT,
  user_predicted_id TEXT,
  user_committed_id TEXT,
  artifact_tweet TEXT,
  ts TEXT NOT NULL,
  FOREIGN KEY (run_id) REFERENCES runs(run_id)
);
CREATE INDEX IF NOT EXISTS idx_decisions_run_id ON run_decisions(run_id);

CREATE TABLE IF NOT EXISTS run_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL,
  FOREIGN KEY (run_id) REFERENCES runs(run_id),
  UNIQUE(run_id, achievement_id)
);
"""


def init_db() -> None:
    """Open the DB and run schema migrations. Idempotent — safe to call on
    every container boot."""
    with _DB_LOCK:
        conn = _connect()
        try:
            conn.executescript(_SCHEMA)
            conn.commit()
        finally:
            conn.close()
    log.info("run_store: initialized DB at %s", SQLITE_PATH)


# ---- (de)serialization ---------------------------------------------------


# Fields on RunState that don't survive a JSON round-trip. We strip these on
# write and rebind them on load via ensure_decision_queue().
_UNSERIALIZABLE_FIELDS = {"decision_queue"}


def _state_to_blob(state: Any) -> Dict[str, Any]:
    """Serialize RunState minus the bible (which lives in its own column).

    Uses dataclass asdict() so nested Stats / ForeshadowTracker / TurnRecord /
    FeedEntry collapse to plain dicts. asyncio.Queue and the pre-fetched
    Oracle Task contain Futures that can't be deepcopy'd — we null them out
    BEFORE asdict() so the deepcopy walk never touches them, then restore
    afterward so the live run keeps using them.
    """
    saved: Dict[str, Any] = {}
    # Standard unserializable dataclass fields (decision_queue).
    for f in _UNSERIALIZABLE_FIELDS:
        if hasattr(state, f):
            saved[f] = getattr(state, f)
            try:
                setattr(state, f, None)
            except Exception:
                pass
    # Pre-fetched Oracle task is an instance attr (not a dataclass field) —
    # asdict doesn't see it, but defensively null it too in case __dict__
    # walking is involved upstream.
    pre_task = getattr(state, "_next_oracle_task", None)
    if pre_task is not None:
        try:
            state._next_oracle_task = None  # type: ignore[attr-defined]
        except Exception:
            pass
    try:
        blob = asdict(state)
    finally:
        # Restore everything we nulled.
        for f, v in saved.items():
            try:
                setattr(state, f, v)
            except Exception:
                pass
        if pre_task is not None:
            try:
                state._next_oracle_task = pre_task  # type: ignore[attr-defined]
            except Exception:
                pass
    # Defensive: if anything snuck through, drop it from the blob.
    for f in _UNSERIALIZABLE_FIELDS:
        blob.pop(f, None)
    blob.pop("bible", None)
    blob.pop("bible_yaml_raw", None)
    return blob


def _blob_to_state(
    blob: Dict[str, Any],
    bible: Optional[Dict[str, Any]],
    bible_yaml_raw: Optional[str],
) -> Any:
    """Rebuild a RunState from its serialized blob.

    Local imports keep this module importable from places that don't yet have
    the agents/ packages loaded (e.g. raw schema inspection scripts).
    """
    from state import (  # type: ignore
        FeedEntry,
        ForeshadowTracker,
        RunState,
        Seed,
        Stats,
        TurnRecord,
    )

    stats = Stats(**(blob.get("stats") or {}))

    tracker_data = blob.get("tracker") or {}
    seeds_raw = tracker_data.get("seeds") or {}
    tracker = ForeshadowTracker(
        seeds={sid: Seed(**sd) for sid, sd in seeds_raw.items()},
        narrative_debt=int(tracker_data.get("narrative_debt") or 0),
    )

    turns = [TurnRecord(**t) for t in (blob.get("turns") or [])]
    feed = [FeedEntry(**f) for f in (blob.get("feed") or [])]

    state = RunState(
        run_id=blob["run_id"],
        status=blob.get("status", "initialized"),
        mode=blob.get("mode", "uploaded"),
        template_id=blob.get("template_id"),
        company_input=blob.get("company_input") or {},
        settings=blob.get("settings") or {},
        bible=bible,
        bible_yaml_raw=bible_yaml_raw,
        stats=stats,
        tracker=tracker,
        turn=int(blob.get("turn") or 0),
        turns=turns,
        feed=feed,
        achievements=list(blob.get("achievements") or []),
        findings=list(blob.get("findings") or []),
        speed=blob.get("speed", "1x"),
        paused=bool(blob.get("paused", False)),
        interactive=bool(blob.get("interactive", False)),
        pending_event_id=blob.get("pending_event_id"),
        last_user_decision=blob.get("last_user_decision"),
        cancelled=bool(blob.get("cancelled", False)),
        script=blob.get("script"),
        script_cursor=int(blob.get("script_cursor") or 0),
    )
    # decision_queue is rebound lazily inside the streaming loop's event loop.
    return state


# ---- summary-row extraction ---------------------------------------------


def _row_summary(state: Any) -> Dict[str, Any]:
    """Pull the indexed columns off a RunState for the runs row upsert."""
    bible = state.bible or {}
    company = (bible.get("company") or {}) if isinstance(bible, dict) else {}
    founders = (bible.get("founders") or [{}]) if isinstance(bible, dict) else [{}]
    settings = state.settings or {}
    company_input = state.company_input or {}

    company_name = (
        company.get("display_name")
        or company.get("name")
        or company_input.get("name")
    )
    industry = company.get("industry") or company_input.get("industry")
    founder_vibe = (
        (founders[0] or {}).get("vibe")
        if founders else None
    ) or company_input.get("founder_vibe")

    # user_id flows in via /run/create payload.settings.user_id (or .user_id);
    # both surfaces are accepted so the auth-agent can pick whichever shape
    # they prefer without us breaking.
    user_id = settings.get("user_id") or company_input.get("user_id")

    return {
        "user_id": user_id,
        "status": state.status,
        "mode": state.mode,
        "template_id": state.template_id,
        "company_name": company_name,
        "industry": industry,
        "founder_vibe": founder_vibe,
        "length_mode": settings.get("length_mode"),
        "craziness": settings.get("craziness"),
        "turns_elapsed": int(state.turn or 0),
    }


# ---- public API ----------------------------------------------------------


def save_run(state: Any) -> None:
    """Upsert a run by run_id. Serializes RunState to bible_json + state_blob_json.

    Called on register, after every consequence, and at endgame. Cheap enough
    that the streaming loop can call it after every turn without surfacing
    latency (medium runs are <100KB serialized).
    """
    summary = _row_summary(state)
    bible_json = json.dumps(state.bible, default=str) if state.bible else None
    state_blob_json = json.dumps(_state_to_blob(state), default=str)
    now = _now_iso()

    # We need to know if this is a fresh insert (set started_at) or an update
    # (preserve the original started_at).
    with _DB_LOCK:
        conn = _connect()
        try:
            cur = conn.execute(
                "SELECT started_at FROM runs WHERE run_id = ?",
                (state.run_id,),
            )
            existing = cur.fetchone()
            started_at = existing["started_at"] if existing else now

            conn.execute(
                """
                INSERT INTO runs (
                    run_id, user_id, status, mode, template_id,
                    company_name, industry, founder_vibe,
                    length_mode, craziness,
                    started_at, ended_at, turns_elapsed, endgame_id,
                    bible_json, state_blob_json, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, NULL, ?, ?, ?)
                ON CONFLICT(run_id) DO UPDATE SET
                    user_id        = excluded.user_id,
                    status         = excluded.status,
                    mode           = excluded.mode,
                    template_id    = excluded.template_id,
                    company_name   = excluded.company_name,
                    industry       = excluded.industry,
                    founder_vibe   = excluded.founder_vibe,
                    length_mode    = excluded.length_mode,
                    craziness      = excluded.craziness,
                    turns_elapsed  = excluded.turns_elapsed,
                    bible_json     = excluded.bible_json,
                    state_blob_json= excluded.state_blob_json,
                    updated_at     = excluded.updated_at
                """,
                (
                    state.run_id,
                    summary["user_id"],
                    summary["status"],
                    summary["mode"],
                    summary["template_id"],
                    summary["company_name"],
                    summary["industry"],
                    summary["founder_vibe"],
                    summary["length_mode"],
                    summary["craziness"],
                    started_at,
                    summary["turns_elapsed"],
                    bible_json,
                    state_blob_json,
                    now,
                ),
            )
            conn.commit()
        finally:
            conn.close()


def load_run(run_id: str) -> Optional[Any]:
    """Read a run from disk and rebuild RunState. Returns None if not found."""
    with _DB_LOCK:
        conn = _connect()
        try:
            cur = conn.execute(
                "SELECT bible_json, state_blob_json FROM runs WHERE run_id = ?",
                (run_id,),
            )
            row = cur.fetchone()
        finally:
            conn.close()

    if not row:
        return None

    try:
        blob = json.loads(row["state_blob_json"])
    except Exception as e:  # pragma: no cover
        log.error("run_store: failed to decode state blob for %s: %s", run_id, e)
        return None

    bible = None
    bible_yaml_raw = None
    if row["bible_json"]:
        try:
            bible = json.loads(row["bible_json"])
            bible_yaml_raw = json.dumps(bible, indent=2)
        except Exception:  # pragma: no cover
            bible = None

    return _blob_to_state(blob, bible, bible_yaml_raw)


def list_runs(
    user_id: Optional[str] = None,
    *,
    limit: int = 50,
    status: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """Return run summary records. Used by /me/runs and /archive endpoints."""
    clauses: List[str] = []
    params: List[Any] = []
    if user_id is not None:
        clauses.append("user_id = ?")
        params.append(user_id)
    if status is not None:
        clauses.append("status = ?")
        params.append(status)
    where = ("WHERE " + " AND ".join(clauses)) if clauses else ""

    # Completed runs sort by ended_at desc (archive feed); everything else
    # sorts by started_at desc.
    order = "ORDER BY COALESCE(ended_at, started_at) DESC"

    sql = f"""
        SELECT run_id, user_id, status, mode, template_id, company_name,
               industry, founder_vibe, length_mode, craziness,
               started_at, ended_at, turns_elapsed, endgame_id, updated_at
        FROM runs
        {where}
        {order}
        LIMIT ?
    """
    params.append(int(limit))

    with _DB_LOCK:
        conn = _connect()
        try:
            cur = conn.execute(sql, tuple(params))
            rows = cur.fetchall()
        finally:
            conn.close()

    return [dict(r) for r in rows]


def append_decision(
    run_id: str,
    turn: int,
    event_id: Optional[str],
    agent_choice: Optional[str],
    user_pred: Optional[str],
    user_commit: Optional[str],
    artifact: Optional[str],
) -> None:
    """Append to run_decisions after every consequence. Append-only; cheap."""
    with _DB_LOCK:
        conn = _connect()
        try:
            conn.execute(
                """
                INSERT INTO run_decisions
                (run_id, turn, event_id, agent_choice_id,
                 user_predicted_id, user_committed_id, artifact_tweet, ts)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    run_id, int(turn), event_id, agent_choice,
                    user_pred, user_commit, artifact, _now_iso(),
                ),
            )
            conn.commit()
        finally:
            conn.close()


def append_achievement(run_id: str, achievement_id: str) -> bool:
    """Insert into run_achievements (uniqueness-enforced).

    Returns True if newly inserted, False if already present (idempotent).
    The parallel achievement_engine.py module calls this after consequences.
    """
    with _DB_LOCK:
        conn = _connect()
        try:
            try:
                conn.execute(
                    """
                    INSERT INTO run_achievements (run_id, achievement_id, unlocked_at)
                    VALUES (?, ?, ?)
                    """,
                    (run_id, achievement_id, _now_iso()),
                )
                conn.commit()
                return True
            except sqlite3.IntegrityError:
                # UNIQUE constraint hit — already unlocked, no-op.
                return False
        finally:
            conn.close()


def end_run(run_id: str, endgame_id: str) -> None:
    """Mark a run as completed and stamp ended_at."""
    now = _now_iso()
    with _DB_LOCK:
        conn = _connect()
        try:
            conn.execute(
                """
                UPDATE runs
                SET status = 'completed',
                    endgame_id = ?,
                    ended_at = ?,
                    updated_at = ?
                WHERE run_id = ?
                """,
                (endgame_id, now, now, run_id),
            )
            conn.commit()
        finally:
            conn.close()


def list_decisions(run_id: str) -> List[Dict[str, Any]]:
    """Replay-friendly: every decision row for a run, oldest-first."""
    with _DB_LOCK:
        conn = _connect()
        try:
            cur = conn.execute(
                """
                SELECT turn, event_id, agent_choice_id, user_predicted_id,
                       user_committed_id, artifact_tweet, ts
                FROM run_decisions
                WHERE run_id = ?
                ORDER BY turn ASC, id ASC
                """,
                (run_id,),
            )
            return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()


def list_achievements(run_id: str) -> List[Dict[str, Any]]:
    """Every achievement unlocked on a run."""
    with _DB_LOCK:
        conn = _connect()
        try:
            cur = conn.execute(
                """
                SELECT achievement_id, unlocked_at
                FROM run_achievements
                WHERE run_id = ?
                ORDER BY unlocked_at ASC
                """,
                (run_id,),
            )
            return [dict(r) for r in cur.fetchall()]
        finally:
            conn.close()
