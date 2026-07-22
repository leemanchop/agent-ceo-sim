"""
Run state + foreshadow tracker.

The in-memory `_RUNS` dict below is a write-through cache backed by the
SQLite-on-Modal-Volume store in `run_store.py`. Reads check the cache first
and lazily rehydrate from disk on miss; writes (register_run, persist_run)
update both layers so cold-restarts can pick up where a container left off.
"""

from __future__ import annotations

import asyncio
import time
import uuid
from dataclasses import dataclass, field
from typing import Any, Awaitable, Callable, Dict, List, Optional, Set


def new_run_id() -> str:
    # ULID-shaped fake (for hackathon). Sortable enough for in-memory use.
    return f"01H{uuid.uuid4().hex[:23].upper()}"


def _coerce_delta(v: Any) -> Optional[int]:
    """Best-effort int coercion for LLM-authored stat deltas.

    The Oracle's tool schema types these as integers, but Anthropic does not
    validate tool input server-side (no strict mode), so real runs see values
    like "+250000", "-1,200,000", "1_000_000", "−250000" (unicode minus),
    "-250000.0", or null. Coerce what's unambiguous; return None for junk
    ("+2M", "15%", dicts, bools, nulls) so the caller can drop the key —
    a junk delta must never raise (int(v) here used to kill the whole run
    via the stream loop's outer except).
    """
    if isinstance(v, bool) or v is None:
        return None
    if isinstance(v, (int, float)):
        return int(v)
    if isinstance(v, str):
        s = v.strip().replace(",", "").replace("_", "").replace("−", "-")
        if s.startswith("+"):
            s = s[1:]
        try:
            return int(float(s))
        except (ValueError, OverflowError):
            return None
    return None


@dataclass
class Stats:
    valuation: int = 14_000_000
    cash: int = 8_000_000
    revenue: int = 0
    burn: int = 180_000
    headcount: int = 6
    fbi_awareness: int = 0
    fraud_score: int = 0
    reputation: int = 12
    day: int = 14

    def apply(self, deltas: Any) -> None:
        # Tolerate the common LLM re-normalization of a delta map into a
        # list of {stat, delta} objects before iterating.
        if isinstance(deltas, list):
            merged: Dict[str, Any] = {}
            for item in deltas:
                if isinstance(item, dict):
                    k = item.get("stat") or item.get("key") or item.get("name")
                    if isinstance(k, str):
                        merged[k] = item.get("delta", item.get("value"))
            deltas = merged
        if not isinstance(deltas, dict):
            return
        for k, v in deltas.items():
            iv = _coerce_delta(v)
            if iv is None or not isinstance(k, str) or not hasattr(self, k):
                continue
            setattr(self, k, getattr(self, k) + iv)
        # clamp the bounded ones
        self.fbi_awareness = max(0, min(100, self.fbi_awareness))
        self.fraud_score = max(0, min(100, self.fraud_score))
        self.reputation = max(-100, min(100, self.reputation))
        # floor the money / count stats at 0 — a company can't have negative
        # valuation, cash-on-hand, revenue, burn, or headcount. Bankruptcy is
        # detected via the cash<=0 endgame trigger, not via cash going negative.
        self.valuation = max(0, self.valuation)
        self.cash = max(0, self.cash)
        self.revenue = max(0, self.revenue)
        self.burn = max(0, self.burn)
        self.headcount = max(0, self.headcount)

    def snapshot(self) -> Dict[str, int]:
        return {
            "valuation": self.valuation,
            "cash": self.cash,
            "revenue": self.revenue,
            "burn": self.burn,
            "headcount": self.headcount,
            "fbi_awareness": self.fbi_awareness,
            "fraud_score": self.fraud_score,
            "reputation": self.reputation,
            "day": self.day,
        }


@dataclass
class Seed:
    """A single foreshadow seed — see game/chaining.md."""
    seed_id: str
    planted_turn: int
    expected_payoff_window: List[int]   # [low, high]
    severity_floor: str = "M"
    last_referenced_turn: int = 0
    status: str = "active"              # active | paid | paid_lite | rerolled | expired
    cameo_locks: Dict[str, str] = field(default_factory=dict)
    related_seeds: List[str] = field(default_factory=list)


@dataclass
class ForeshadowTracker:
    """Per-run, owned by the Oracle. The CEO never sees this."""
    seeds: Dict[str, Seed] = field(default_factory=dict)
    narrative_debt: int = 0

    def plant(self, seed_id: str, current_turn: int, window: int = 8) -> Optional[Seed]:
        if not isinstance(seed_id, str):  # LLM-authored; dicts are unhashable
            return None
        if seed_id in self.seeds and self.seeds[seed_id].status in ("active",):
            return self.seeds[seed_id]
        s = Seed(
            seed_id=seed_id,
            planted_turn=current_turn,
            expected_payoff_window=[current_turn + 2, current_turn + window],
            last_referenced_turn=current_turn,
        )
        self.seeds[seed_id] = s
        return s

    def pay_off(self, seed_id: str, current_turn: int, lite: bool = False) -> None:
        if isinstance(seed_id, str) and seed_id in self.seeds:
            self.seeds[seed_id].status = "paid_lite" if lite else "paid"
            self.seeds[seed_id].last_referenced_turn = current_turn

    def reroll(self, seed_id: str) -> None:
        if isinstance(seed_id, str) and seed_id in self.seeds:
            self.seeds[seed_id].status = "rerolled"

    def active(self) -> List[Seed]:
        return [s for s in self.seeds.values() if s.status == "active"]

    def expire_stale(self, current_turn: int, threshold: int = 12) -> List[str]:
        """Drop seeds that have aged out without payoff. Returns expired seed_ids."""
        expired = []
        for s in self.seeds.values():
            if s.status != "active":
                continue
            if current_turn > s.expected_payoff_window[1] + threshold:
                s.status = "expired"
                self.narrative_debt += 1
                expired.append(s.seed_id)
        return expired

    def to_prompt_block(self) -> str:
        """Render to a compact YAML-ish block for the Oracle's per-turn prompt."""
        if not self.seeds:
            return "(no seeds planted yet)"
        lines = []
        for s in self.seeds.values():
            lines.append(
                f"- {s.seed_id}: status={s.status} planted_turn={s.planted_turn} "
                f"window={s.expected_payoff_window} last_ref={s.last_referenced_turn} "
                f"cameo_locks={s.cameo_locks or '{}'}"
            )
        if self.narrative_debt:
            lines.append(f"narrative_debt: {self.narrative_debt}")
        return "\n".join(lines)


@dataclass
class TurnRecord:
    turn: int
    day: int
    event_id: str
    event_title: str
    event_body: str
    severity: str
    category: str
    choices: List[Dict[str, Any]]
    agent_choice_id: Optional[str] = None
    user_prediction: Optional[str] = None
    user_force_choice: Optional[str] = None
    reasoning: str = ""
    justification: str = ""
    artifact_tweet: str = ""
    stat_deltas: Dict[str, int] = field(default_factory=dict)
    seeds_planted: List[str] = field(default_factory=list)
    seeds_paid_off: List[str] = field(default_factory=list)


@dataclass
class FeedEntry:
    id: str
    source: str       # "twitter" | "bloomberg" | "techcrunch" | "forbes" | "slack" | "glassdoor" | "fbi" | "discord"
    body: str
    handle: Optional[str] = None
    name: Optional[str] = None
    publication: Optional[str] = None
    channel: Optional[str] = None
    timestamp: str = ""
    likes: Optional[int] = None
    retweets: Optional[int] = None
    replies: Optional[int] = None


@dataclass
class RunState:
    """The full per-run state. Owned by the Modal container until run end."""
    run_id: str
    status: str = "initialized"   # initialized | researching | streaming | completed | abandoned
    mode: str = "uploaded"
    template_id: Optional[str] = None
    company_input: Dict[str, Any] = field(default_factory=dict)
    settings: Dict[str, Any] = field(default_factory=dict)

    bible: Optional[Dict[str, Any]] = None
    bible_yaml_raw: Optional[str] = None

    stats: Stats = field(default_factory=Stats)
    tracker: ForeshadowTracker = field(default_factory=ForeshadowTracker)

    turn: int = 0
    turns: List[TurnRecord] = field(default_factory=list)
    feed: List[FeedEntry] = field(default_factory=list)
    achievements: List[str] = field(default_factory=list)
    findings: List[str] = field(default_factory=list)
    # achievement engine: ids that have already fired this run (idempotency).
    # The run-persistence agent will pick this up in their state-blob serialization.
    achievements_unlocked: Set[str] = field(default_factory=set)

    speed: str = "1x"
    paused: bool = False
    interactive: bool = False

    # Per-turn synchronisation: the stream loop awaits the user's decision.
    # `decision_queue` is created lazily inside the streaming loop's event loop
    # (asyncio queues bind to a loop on construction, and RunState is built on
    # the main thread before the SSE handler starts).
    decision_queue: Optional[asyncio.Queue] = None
    pending_event_id: Optional[str] = None
    last_user_decision: Optional[Dict[str, Any]] = None

    # Cancellation hook for long streams.
    cancelled: bool = False

    # Pregenerated run script (Phase 2, spectate). `script` is the RunScript
    # dict from showrunner.generate_script; `script_cursor` is the index of
    # the next unplayed beat — playback resumes here after any reconnect.
    # Both are dataclass fields so _state_to_blob's asdict() persists them.
    script: Optional[Dict[str, Any]] = None
    script_cursor: int = 0

    # Endgame outcome — persisted so the post-mortem page can fetch the
    # REAL long-read by run id instead of falling back to demo copy
    # (UX-14: "it's just doing the vellum thing").
    endgame_id: str = ""
    post_mortem_md: str = ""

    def ensure_decision_queue(self) -> asyncio.Queue:
        """Lazily create the decision queue inside the running event loop."""
        if self.decision_queue is None:
            self.decision_queue = asyncio.Queue()
        return self.decision_queue

    def length_mode(self) -> str:
        return self.settings.get("length_mode", "medium")

    def craziness(self) -> str:
        return self.settings.get("craziness", "normal")

    def max_turns(self) -> int:
        return {
            "micro": 5,
            "short": 12,
            "medium": 28,
            "long": 60,
        }.get(self.length_mode(), 28)

    def severity_floor(self) -> str:
        # Length-mode-aware ramp.
        lm = self.length_mode()
        if lm == "short":
            return "L" if self.turn >= 4 else "S"
        if lm == "medium":
            return "L" if self.turn >= 6 else "S"
        return "L" if self.turn >= 12 else "S"

    def add_feed(self, entry: FeedEntry) -> None:
        self.feed.append(entry)
        if len(self.feed) > 200:
            self.feed = self.feed[-200:]

    def _endgame_block(self) -> Dict[str, Any]:
        """Everything the post-mortem page needs, flattened — it was
        reading a shape the API never sent and mock-falling-back (the
        'vellum thing', final form)."""
        bible = self.bible or {}
        co = bible.get("company") or {}
        founders = bible.get("founders") or []
        f0 = founders[0] if founders and isinstance(founders[0], dict) else {}
        disp = co.get("display_name") or co.get("name") or "the company"
        # Resolve the corpus record so the card gets the real ending title and
        # a stamp verdict — never the raw record id ('Fled 003').
        try:
            from corpus_loader import endgame_display  # type: ignore
            eg = endgame_display(self.endgame_id)
        except Exception:  # pragma: no cover
            pretty = self.endgame_id.replace("END-", "").replace("-", " ").title()
            eg = {"title": pretty, "verdict": pretty.upper(), "category": ""}
        return {
            "endgame_id": self.endgame_id,
            "title": eg["title"],
            "verdict": eg["verdict"],
            "endgame_category": eg["category"],
            "final_headline": f"{disp} — closed.",
            "tagline": f"{disp}: {eg['title']}.",
            "post_mortem_long_read": self.post_mortem_md,
            "company_name": disp,
            "one_liner": co.get("one_liner") or "",
            "founder_name": f0.get("name") or "",
        }

    def snapshot(self) -> Dict[str, Any]:
        return {
            "run_id": self.run_id,
            "status": self.status,
            # Flat company summary — the frontend's RunSnapshot type expects
            # display_name/founder at this level; the nested research bible
            # rides alongside for consumers that want depth (UX-16: the
            # post-mortem page read undefined off the nested shape).
            "company": (lambda b: (lambda c, f: {
                "name": c.get("name"),
                "display_name": c.get("display_name") or c.get("name"),
                "one_liner": c.get("one_liner"),
                "industry": c.get("industry"),
                "founder": (f[0].get("name") if f and isinstance(f[0], dict) else None),
            })((b.get("company") or {}) if isinstance(b, dict) else {},
               (b.get("founders") or []) if isinstance(b, dict) else []))(self.bible or {}),
            "bible": self.bible,
            "settings": self.settings,
            "endgame_id": self.endgame_id or None,
            "endgame": (self._endgame_block() if self.endgame_id else None),
            "stats": self.stats.snapshot(),
            "stat_history": [
                {"turn": t.turn, "day": t.day, "stats": {}} for t in self.turns
            ],
            "events_resolved": [
                {
                    "id": t.event_id,
                    "turn": t.turn,
                    "title": t.event_title,
                    "category": t.category,
                    "severity": t.severity,
                    "agent_choice_id": t.agent_choice_id,
                    "user_prediction": t.user_prediction,
                    "user_force_choice": t.user_force_choice,
                    "justification": t.justification,
                }
                for t in self.turns
            ],
            "feed_recent": [
                {
                    "id": f.id, "source": f.source, "body": f.body,
                    "handle": f.handle, "name": f.name, "publication": f.publication,
                    "channel": f.channel, "timestamp": f.timestamp,
                    "likes": f.likes, "retweets": f.retweets, "replies": f.replies,
                }
                for f in self.feed[-100:]
            ],
            "achievements_unlocked": self.achievements,
            "findings_unsealed": self.findings,
            "predictions": {
                "correct": sum(
                    1 for t in self.turns
                    if t.user_prediction and t.user_prediction == t.agent_choice_id
                ),
                "total": sum(1 for t in self.turns if t.user_prediction),
            },
            "ceobuck_balance": 1000.00,
            "turn": self.turn,
        }


# ---- write-through cache + persistence ------------------------------------


# Hot-path cache. Streaming-loop reads/writes hit this dict; persistence
# happens through register_run() / persist_run() which mirror to run_store.
_RUNS: Dict[str, RunState] = {}


def _persist_safely(state: "RunState") -> None:
    """Write a RunState to the on-disk store, swallowing any errors so the
    streaming loop never crashes because the volume mount hiccups."""
    try:
        import run_store  # type: ignore  # local import — avoids circular dep
        run_store.save_run(state)
    except Exception:  # pragma: no cover — persistence is best-effort
        # Streaming loop must not die because the disk burped; swallow + log.
        import logging
        logging.getLogger("state").exception(
            "persist failed for run_id=%s", getattr(state, "run_id", "?"),
        )


def create_run(payload: Dict[str, Any]) -> RunState:
    rid = new_run_id()
    settings = payload.get("settings") or {}
    # user_id flows in via the /run/create payload (settings.user_id or
    # top-level user_id). Stash it on settings so run_store._row_summary()
    # picks it up on persist.
    user_id = payload.get("user_id") or settings.get("user_id")
    merged_settings: Dict[str, Any] = {
        "length_mode": settings.get("length_mode", "medium"),
        "craziness": settings.get("craziness", "normal"),
        "interactive": bool(settings.get("interactive", False)),
    }
    if user_id:
        merged_settings["user_id"] = user_id
    state = RunState(
        run_id=rid,
        mode=payload.get("mode", "uploaded"),
        template_id=payload.get("template_id"),
        company_input=payload.get("company") or {},
        settings=merged_settings,
        interactive=bool(settings.get("interactive", False)),
    )
    register_run(state)
    return state


def register_run(state: RunState) -> RunState:
    """Insert a freshly-created RunState into the cache + persistent store."""
    _RUNS[state.run_id] = state
    _persist_safely(state)
    return state


def persist_run(run_id: str) -> None:
    """Flush the cached RunState back to disk.

    Called after every consequence, achievement unlock, status transition, or
    endgame so the on-disk row stays current. No-op if the run isn't cached.
    """
    state = _RUNS.get(run_id)
    if state is None:
        return
    _persist_safely(state)


def get_run(run_id: str) -> Optional[RunState]:
    """Cache-first lookup; falls through to disk on miss."""
    state = _RUNS.get(run_id)
    if state is not None:
        return state
    try:
        import run_store  # type: ignore
        loaded = run_store.load_run(run_id)
    except Exception:  # pragma: no cover
        loaded = None
    if loaded is not None:
        _RUNS[run_id] = loaded
    return loaded


def all_runs() -> Dict[str, RunState]:
    return _RUNS
