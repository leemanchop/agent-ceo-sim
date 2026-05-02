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

    def apply(self, deltas: Dict[str, int]) -> None:
        for k, v in (deltas or {}).items():
            if hasattr(self, k):
                setattr(self, k, getattr(self, k) + int(v))
        # clamp the bounded ones
        self.fbi_awareness = max(0, min(100, self.fbi_awareness))
        self.fraud_score = max(0, min(100, self.fraud_score))
        self.reputation = max(-100, min(100, self.reputation))

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

    def plant(self, seed_id: str, current_turn: int, window: int = 8) -> Seed:
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
        if seed_id in self.seeds:
            self.seeds[seed_id].status = "paid_lite" if lite else "paid"
            self.seeds[seed_id].last_referenced_turn = current_turn

    def reroll(self, seed_id: str) -> None:
        if seed_id in self.seeds:
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

    def snapshot(self) -> Dict[str, Any]:
        return {
            "run_id": self.run_id,
            "status": self.status,
            "company": self.bible,
            "settings": self.settings,
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
