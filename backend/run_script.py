"""
RunScript — the pregenerated spine of a spectate-mode run (Phase 2).

WHY THIS EXISTS
---------------
The live engine had two independent sources of truth: the Oracle wrote
story numbers in prose ("a SAFE at a $2B cap") while a separate stat
engine summed LLM-guessed deltas. No amount of clamping reconciles two
generators. The script architecture inverts the flow:

    skeleton (code)  →  trajectory (math)  →  prose (LLM, FROM the numbers)

Coherence is structural: the dashboard shows the trajectory the story was
written against.

SHAPE
-----
A script is a plain JSON-able dict:

{
  "script_version": 1,
  "generated_at_turn": 0,
  "length_mode": "short",
  "endgame_id": "END-FAILUP-002",         # target chosen up front
  "episodes_total": 2,                     # prose generated in chunks
  "episodes_ready": 1,                     # playback may start before all ready
  "beats": [ <beat>, ... ]                 # ordered; turn numbers 1..N for larges
}

A beat (large = decision moment; mini = auto-resolving timeline row):

{
  "kind": "large" | "mini",
  "turn": 3,                 # larges: 1..N; minis carry the turn they precede
  "day": 41,                 # absolute run day — the days-axis anchor
  "source_event_id": "EVT-FR-002",
  "category": "FUNDRAISING",
  "severity": "M",
  "title": "...",            # adapted to THIS company by the prose pass
  "body": "...",
  "tags": ["fundraising"],
  "choices": [{"id": "A", "label": "...", "tone": "based"}],   # larges only
  "ceo_choice": "A",                                           # larges only
  "ceo_reasoning": "...",    # 40-70 tokens, CEO voice
  "justification": "...",    # one line
  "artifact_tweet": "..." | None,
  "reactions": [{"source": "twitter", "handle": "@...", "name": "...", "body": "..."}],
  "stats_deltas": {"cash": -500000, ...},   # FROM the trajectory (math, not LLM)
  "stats_after": {"valuation": ..., ...},    # full snapshot post-beat
  "stat_rationale": "...",   # one line, written against the real numbers
  "seeds_planted": ["..."], "seeds_paid_off": ["..."],
  "mini_id": "mini-3-1",     # minis only — stable timeline dedup key
  "outcome": "..."           # minis only — one-line auto-resolution
}

INVARIANTS (validate_script enforces)
-------------------------------------
- beats sorted by (day, large-after-mini within a day)
- large beats numbered 1..N with no gaps; N == max_turns for the mode
- every beat's stats_after == previous stats_after + stats_deltas applied
  through Stats.apply semantics (floors/clamps) — the trajectory is law
- every large beat: >= 2 choices, ceo_choice ∈ choice ids
- no source_event_id repeats across beats
- prose fields non-empty on ready episodes; beats of unready episodes may
  carry empty prose (skeleton-only) but MUST have numbers already
"""

from __future__ import annotations

import copy
from typing import Any, Dict, List, Optional, Tuple

from state import Stats  # type: ignore

SCRIPT_VERSION = 1

MONEY_KEYS = ("valuation", "cash", "revenue", "burn")
STAT_KEYS = (
    "valuation", "cash", "revenue", "burn", "headcount",
    "fbi_awareness", "fraud_score", "reputation", "day",
)


def apply_deltas_to_stats(stats_dict: Dict[str, int], deltas: Dict[str, int]) -> Dict[str, int]:
    """Apply deltas with the SAME semantics the live engine uses
    (Stats.apply floors/clamps) so trajectories match dashboard behavior."""
    s = Stats(**{k: int(stats_dict.get(k, 0)) for k in STAT_KEYS})
    s.apply(deltas or {})
    if isinstance(deltas, dict) and deltas.get("day"):
        s.day = int(stats_dict.get("day", 0)) + int(deltas["day"])
    return s.snapshot()


def new_script(*, length_mode: str, endgame_id: str, episodes_total: int) -> Dict[str, Any]:
    return {
        "script_version": SCRIPT_VERSION,
        "generated_at_turn": 0,
        "length_mode": length_mode,
        "endgame_id": endgame_id,
        "episodes_total": int(episodes_total),
        "episodes_ready": 0,
        "beats": [],
    }


def validate_script(script: Dict[str, Any], *, initial_stats: Dict[str, int],
                    require_prose_episodes: Optional[int] = None) -> List[str]:
    """Return a list of violation strings (empty == valid).

    `require_prose_episodes`: how many leading episodes must have complete
    prose (defaults to script['episodes_ready'])."""
    errs: List[str] = []
    if not isinstance(script, dict):
        return ["script is not a dict"]
    beats = script.get("beats")
    if not isinstance(beats, list) or not beats:
        return ["script has no beats"]

    ready = script.get("episodes_ready", 0) if require_prose_episodes is None \
        else require_prose_episodes

    # ordering + turn numbering
    last_day = -1
    expected_turn = 1
    seen_sources = set()
    running = dict(initial_stats)
    for i, b in enumerate(beats):
        where = f"beat[{i}]"
        if b.get("day", -1) < last_day:
            errs.append(f"{where}: day goes backwards ({b.get('day')} < {last_day})")
        last_day = max(last_day, b.get("day", -1))

        sid = b.get("source_event_id")
        if sid:
            if sid in seen_sources:
                errs.append(f"{where}: repeated source_event_id {sid}")
            seen_sources.add(sid)

        if b.get("kind") == "large":
            if b.get("turn") != expected_turn:
                errs.append(f"{where}: turn {b.get('turn')} != expected {expected_turn}")
            expected_turn += 1
            choices = b.get("choices") or []
            ids = [c.get("id") for c in choices if isinstance(c, dict)]
            if len(ids) < 2:
                errs.append(f"{where}: large beat needs >=2 choices")
            episode = b.get("episode", 1)
            if b.get("ceo_choice") not in ids and episode <= ready:
                errs.append(f"{where}: ceo_choice {b.get('ceo_choice')!r} not in {ids}")

        # trajectory law
        after = apply_deltas_to_stats(running, b.get("stats_deltas") or {})
        declared = b.get("stats_after") or {}
        for k in STAT_KEYS:
            if k in declared and int(declared[k]) != int(after[k]):
                errs.append(
                    f"{where}: stats_after[{k}]={declared[k]} != computed {after[k]}"
                )
        running = after

        # prose completeness for ready episodes
        if b.get("episode", 1) <= ready:
            for fld in ("title", "body"):
                if not (b.get(fld) or "").strip():
                    errs.append(f"{where}: empty {fld} in ready episode")
            if b.get("kind") == "large" and not (b.get("ceo_reasoning") or "").strip():
                errs.append(f"{where}: empty ceo_reasoning in ready episode")

    n_large = sum(1 for b in beats if b.get("kind") == "large")
    if expected_turn - 1 != n_large:
        errs.append("large turn numbering inconsistent")
    return errs


def script_cursor_beat(script: Dict[str, Any], cursor: int) -> Optional[Dict[str, Any]]:
    beats = script.get("beats") or []
    if 0 <= cursor < len(beats):
        return beats[cursor]
    return None


def deep_copy_script(script: Dict[str, Any]) -> Dict[str, Any]:
    return copy.deepcopy(script)
