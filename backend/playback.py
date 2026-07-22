"""
PLAYBACK — stream a pregenerated RunScript over the live SSE contract.

Phase 2 of the script architecture (see run_script.py): the showrunner
pregenerates a validated script (skeleton → trajectory → prose) and this
module *performs* it. To the frontend the stream must be drop-in
indistinguishable from the live loop in routes.py::run_stream — same event
kinds, same payload shapes, same keepalive cadence, same decision-window
handling.

Design rules
------------
- Everything from routes.py is INJECTED (sse formatter, feed helpers,
  achievement emitter, ...) — playback.py imports nothing from routes.py,
  which keeps the import graph acyclic.
- Resume-safe by construction: `state.script_cursor` is the single source
  of progress. Each fully-played beat advances the cursor and persists it.
  A reconnecting client replays NOTHING — the frontend keeps its state, and
  late joiners resync off the next `turn.start` stats snapshot. This kills
  the SSE-reconnect duplication class entirely.
- The script's numbers are law: stats_deltas come from the trajectory and
  are applied verbatim through Stats.apply; the beat's `day` pins
  state.stats.day (the script owns the calendar).
- Endgame is the CALLER's job. When beats are exhausted this generator just
  returns; it never emits endgame.reached.

Python 3.9 compatible. State types (TurnRecord, FeedEntry) are imported
lazily inside the beat player.
"""

from __future__ import annotations

import asyncio
import json
import traceback
import uuid
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Callable, Dict, List

# ---------------------------------------------------------------------------
# Pacing knobs — module-level so tests (and ops) can tune/zero them.
# ---------------------------------------------------------------------------

# Sleep between agent.thought_token chunks (scaled by playback speed).
TOKEN_SLEEP = 0.02
# Read pause after a decision resolves (reveal + verdict + stat ripples on
# screen) before the calendar starts ticking again. Scaled by speed.
READ_PAUSE = 6.0
# Sleep between agent.deliberation_token chunks (scaled by playback speed).
DELIB_SLEEP = 0.015
# Spectate-mode prediction window after choices.appear (force_choice is N/A
# in scripted playback, so the interactive 120s window never applies).
PREDICTION_WINDOW_SECONDS = 30.0
# Slice size for the decision wait — each timeout yields an SSE keepalive.
DECISION_POLL_SECONDS = 5.0
# Pause loop cadence (mirrors the live loop's ping+sleep(2.0)).
PAUSE_POLL_SECONDS = 2.0
# Mini beats take a fraction of the full inter-beat gap.
MINI_GAP_FACTOR = 0.5
# Episode gate: poll readiness every 2s, keepalive every 5s, warn in-voice
# once at 120s, give up (persist "abandoned") at 300s.
EPISODE_POLL_SECONDS = 2.0
EPISODE_PING_EVERY = 5.0
EPISODE_WARN_AFTER = 120.0
EPISODE_ABANDON_AFTER = 300.0
# Per-beat crash isolation (mirrors the live loop's 3-strikes rule).
MAX_CONSECUTIVE_BEAT_CRASHES = 3
CRASH_RECOVERY_SLEEP = 1.0
# Days-axis pacing: quiet days tick by visibly between beats (day.tick SSE).
# Interval shrinks for big gaps so a 14-day jump never stalls the run.
DAY_TICK_SLEEP = 0.35
DAY_TICK_MAX_TOTAL = 3.5

_KEEPALIVE = ": ping\n\n"


# ---------------------------------------------------------------------------
# small local helpers (deliberately mirroring routes.py behavior — NOT
# imported from routes.py, to avoid a circular import)
# ---------------------------------------------------------------------------


def _ts_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def _as_str(x: Any) -> str:
    """Coerce a should-be-string field to a plain string (routes._as_str)."""
    if isinstance(x, str):
        return x
    if x is None:
        return ""
    try:
        return json.dumps(x)
    except Exception:
        return str(x)


def _chunk_for_stream(text: Any) -> List[str]:
    """Word-ish chunks for token-stream pastiche (routes._chunk_for_stream)."""
    if not isinstance(text, str):
        text = _as_str(text)
    if not text:
        return []
    return [p + " " for p in text.split(" ") if p]


def _seed_ids(x: Any) -> List[str]:
    """Coerce a script seed list to plain string ids (scripts are validated,
    but a hand-edited or half-generated script must never crash a beat)."""
    if isinstance(x, str):
        return [x]
    if not isinstance(x, list):
        return []
    return [s for s in x if isinstance(s, str)]


def _window_for(state: Any) -> int:
    """Foreshadow payoff window by length mode (mirrors routes._window_for)."""
    try:
        mode = state.length_mode()
    except Exception:
        mode = "medium"
    return {"micro": 2, "short": 3, "medium": 8, "long": 25}.get(mode, 8)


def _speed_factor(gap_for_speed: Callable[[str], float], speed: str) -> float:
    """Scale token-drip sleeps the same way inter-beat gaps scale: 1x → 1.0,
    2x → 0.5, 4x → 0.25 (derived from the injected gap table so playback
    never hardcodes the live loop's numbers)."""
    try:
        base = float(gap_for_speed("1x"))
        if base <= 0:
            return 1.0
        return max(0.0, float(gap_for_speed(speed)) / base)
    except Exception:
        return 1.0


def _build_chips(deltas: Dict[str, Any], rationale: str) -> List[Dict[str, Any]]:
    """Effect chips for consequences.applied — byte-for-byte the construction
    in routes.py::run_stream (label/value/tone + optional why)."""
    chips: List[Dict[str, Any]] = []
    if not isinstance(deltas, dict):
        return chips
    for k, v in deltas.items():
        if k == "day" or not isinstance(v, int) or v == 0:
            continue
        label = k.replace("_", " ")
        val = (f"{'+' if v > 0 else ''}{v/1_000_000:.1f}M"
               if k in ("valuation", "cash", "revenue", "burn")
               and abs(v) >= 1_000_000
               else f"{'+' if v > 0 else ''}{v}")
        chips.append({
            "label": label,
            "value": val,
            "tone": "bad" if (v < 0) == (k not in ("burn", "fbi_awareness", "fraud_score")) else "good",
            **({"why": rationale} if rationale else {}),
        })
    return chips


def _pin_day(state: Any, beat: Dict[str, Any]) -> None:
    """The script owns the calendar: after applying a beat's deltas, the
    beat's absolute `day` overrides whatever the deltas summed to."""
    day = beat.get("day")
    if day is None:
        return
    try:
        state.stats.day = int(day)
    except (TypeError, ValueError):
        pass


# ---------------------------------------------------------------------------
# the playback engine
# ---------------------------------------------------------------------------


async def stream_script(
    state,                      # RunState with state.script (dict) + state.script_cursor (int)
    *,
    sse,                        # callable(event: str, data: Any) -> str  (SSE formatter)
    persist_run,                # callable(run_id) -> None
    run_store,                  # module with append_decision(...)
    emit_achievements,          # generator fn(state) -> yields SSE strings
    gap_for_speed,              # callable(speed: str) -> float seconds
    feed_event_kind,            # callable(reaction: dict) -> str   (routes._feed_event_kind)
    feed_payload,               # callable(reaction: dict) -> dict  (routes._feed_payload)
    founder_handle,             # callable(state) -> str
    founder_name,               # callable(state) -> str
    system_error_sse,           # callable(msg: str) -> str
) -> AsyncGenerator[str, None]:
    """Play `state.script` from `state.script_cursor`, yielding SSE strings.

    Emits the exact live-loop event sequence per beat; advances + persists
    the cursor after each fully-played beat (resume replays nothing); stops
    gracefully on cancellation, script exhaustion (caller emits the endgame),
    a stuck writers' room, or three consecutive beat crashes.
    """

    def _script() -> Dict[str, Any]:
        # Re-read every time — the showrunner may REPLACE state.script with a
        # prose-filled copy (or bump episodes_ready) while we're mid-stream.
        sc = getattr(state, "script", None)
        return sc if isinstance(sc, dict) else {}

    def _persist() -> None:
        try:
            persist_run(state.run_id)
        except Exception:  # pragma: no cover — persistence is best-effort
            pass

    # ---- beat players (closures over the injected collaborators) ---------

    async def _play_mini(index: int, beat: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """Auto-resolving timeline row. One event, apply numbers, breathe."""
        deltas = beat.get("stats_deltas") or {}
        payload: Dict[str, Any] = {
            "mini_id": beat.get("mini_id") or f"mini-{int(beat.get('turn') or 0)}-{index}",
            "kind": "atmospheric",
            "headline": _as_str(beat.get("title") or beat.get("outcome")).strip(),
            "stat_deltas": deltas if isinstance(deltas, dict) else {},
        }
        if beat.get("timeframe"):
            payload["timeframe"] = beat["timeframe"]
        if beat.get("category"):
            payload["category"] = beat["category"]
        yield sse("turn.mini", payload)

        state.stats.apply(deltas)
        _pin_day(state, beat)
        await asyncio.sleep(MINI_GAP_FACTOR * float(gap_for_speed(state.speed)))

    async def _play_large(beat: Dict[str, Any]) -> AsyncGenerator[str, None]:
        """A full decision moment — the live loop's turn, replayed verbatim."""
        # Lazy import: keeps playback importable without state's module-level
        # side effects mattering at import time (and mirrors the spec).
        from state import FeedEntry, TurnRecord  # type: ignore

        turn = int(beat.get("turn") or (state.turn + 1))
        state.turn = turn
        factor = _speed_factor(gap_for_speed, state.speed)

        # ---- a) turn.start ------------------------------------------------
        beat_day = beat.get("day")
        yield sse("turn.start", {
            "turn": turn,
            "day_elapsed": beat_day if beat_day is not None else state.stats.day,
            "stats": state.stats.snapshot(),
        })

        # ---- b) event.materialize ------------------------------------------
        event_id = beat.get("source_event_id") or f"EVT-SCRIPT-{turn:03d}"
        yield sse("event.materialize", {
            "event_id": event_id,
            "category": beat.get("category"),
            "title": beat.get("title"),
            "body": beat.get("body"),
            "severity": beat.get("severity"),
            "tags": beat.get("tags") or [],
        })

        # ---- c) choices + prediction window (FIRST — the reasoning used to
        # stream before the chips and spoiled the pick; the user now commits
        # blind, then watches the agent think. UX-19.) ------------------
        choices = [c for c in (beat.get("choices") or []) if isinstance(c, dict)]
        window = PREDICTION_WINDOW_SECONDS
        yield sse("choices.appear", {
            "choices": choices,
            "prediction_window_seconds":
                int(window) if float(window).is_integer() else window,
        })
        deliberation_id = f"deliberation_{turn}"

        state.ensure_decision_queue()
        state.pending_event_id = event_id
        state.last_user_decision = None
        user_pred = None
        loop = asyncio.get_running_loop()
        deadline = loop.time() + float(window)
        while True:
            remaining = deadline - loop.time()
            if remaining <= 0:
                break
            try:
                decision = await asyncio.wait_for(
                    state.decision_queue.get(),
                    timeout=min(DECISION_POLL_SECONDS, remaining),
                )
            except asyncio.TimeoutError:
                yield _KEEPALIVE
                continue
            if not isinstance(decision, dict):
                continue
            if decision.get("kind") == "prediction":
                user_pred = decision.get("predicted_choice")
                break
            # force_choice has no meaning in scripted playback — the script
            # owns the CEO's choice. Ignore politely and keep the window open.
            continue

        # ---- d) CEO hidden reasoning — the REVEAL, streamed after the
        # user's prediction locks (or the window expires) ---------------
        thought_id = f"thought_{turn}"
        reasoning = _as_str(beat.get("ceo_reasoning"))
        for chunk in _chunk_for_stream(reasoning):
            yield sse("agent.thought_token", {
                "token": chunk, "stream_id": thought_id,
            })
            if TOKEN_SLEEP * factor > 0:
                await asyncio.sleep(TOKEN_SLEEP * factor)
        yield sse("agent.thought_complete", {
            "stream_id": thought_id,
            "full_text": reasoning,
        })

        # ---- e) prediction grading ------------------------------------------
        # There is no counter to increment: RunState.snapshot() DERIVES
        # predictions {correct, total} from TurnRecord.user_prediction vs
        # agent_choice_id across state.turns. Recording user_pred on the
        # TurnRecord below (step g) is exactly how the live loop grades.

        # ---- f) deliberation drip → commit ---------------------------------
        justification = _as_str(beat.get("justification"))
        if user_pred is not None:
            # Fast-forward: the user already made their call — reveal NOW.
            if justification:
                yield sse("agent.deliberation_token", {
                    "token": justification, "stream_id": deliberation_id,
                })
        else:
            for chunk in _chunk_for_stream(justification):
                yield sse("agent.deliberation_token", {
                    "token": chunk, "stream_id": deliberation_id,
                })
                if DELIB_SLEEP * factor > 0:
                    await asyncio.sleep(DELIB_SLEEP * factor)

        tweet = _as_str(beat.get("artifact_tweet")) if beat.get("artifact_tweet") else ""
        chosen_id = beat.get("ceo_choice")
        yield sse("agent.commit", {
            "choice_id": chosen_id,
            "justification": justification,
            "stream_id": deliberation_id,
            "artifact_tweet": tweet or "",
        })

        # ---- g) apply consequences — the trajectory is law ------------------
        deltas = beat.get("stats_deltas") or {}
        if not isinstance(deltas, dict):
            deltas = {}
        state.stats.apply(deltas)
        _pin_day(state, beat)

        seeds_planted = _seed_ids(beat.get("seeds_planted"))
        seeds_paid = _seed_ids(beat.get("seeds_paid_off"))
        win = _window_for(state)
        for sid in seeds_planted:
            state.tracker.plant(sid, turn, window=win)
        for sid in seeds_paid:
            state.tracker.pay_off(sid, turn, lite=False)

        rec = TurnRecord(
            turn=turn,
            day=state.stats.day,
            event_id=event_id,
            event_title=_as_str(beat.get("title")),
            event_body=_as_str(beat.get("body")),
            severity=beat.get("severity", "S") or "S",
            category=beat.get("category", "PRESS") or "PRESS",
            choices=choices,
            agent_choice_id=chosen_id,
            user_prediction=user_pred,
            user_force_choice=None,
            reasoning=reasoning,
            justification=justification,
            artifact_tweet=tweet or "",
            stat_deltas=deltas,
            seeds_planted=seeds_planted,
            seeds_paid_off=seeds_paid,
        )
        state.turns.append(rec)

        try:
            run_store.append_decision(
                run_id=state.run_id,
                turn=turn,
                event_id=rec.event_id,
                agent_choice=rec.agent_choice_id,
                user_pred=rec.user_prediction,
                user_commit=rec.user_force_choice,
                artifact=rec.artifact_tweet,
            )
        except Exception:  # pragma: no cover — never block the loop
            pass
        _persist()

        # ---- h) consequences.applied ----------------------------------------
        rationale = _as_str(beat.get("stat_rationale")).strip()
        yield sse("consequences.applied", {
            "stat_deltas": deltas,
            "effects_summary": _build_chips(deltas, rationale),
            "stat_rationale": rationale,
            "seeds_planted": rec.seeds_planted,
            "seeds_paid_off": rec.seeds_paid_off,
            "next_event_in_seconds": gap_for_speed(state.speed),
        })

        # ---- i) founder tweet + scripted chorus reactions --------------------
        if tweet:
            state.add_feed(FeedEntry(
                id=str(uuid.uuid4()),
                source="twitter",
                handle=founder_handle(state),
                name=founder_name(state),
                body=tweet,
                timestamp="now",
            ))
            yield sse("feed.tweet", {
                "handle": founder_handle(state),
                "display_name": founder_name(state),
                "verified": True,
                "avatar_seed": _as_str(founder_handle(state)).lstrip("@"),
                "body": tweet,
                "reactions": {"likes": 0, "retweets": 0, "quotes": 0},
                "ts": _ts_now(),
            })
        reactions = beat.get("reactions") or []
        for r in (reactions if isinstance(reactions, list) else []):
            if not isinstance(r, dict):
                continue
            yield sse(feed_event_kind(r), feed_payload(r))

        # ---- j) achievement triggers -----------------------------------------
        for ach_evt in emit_achievements(state):
            yield ach_evt

        # ---- read pause: let the reveal breathe (owner spec) ------------
        pause = READ_PAUSE * factor
        while pause > 0:
            if getattr(state, "cancelled", False):
                return
            step = min(2.0, pause)
            await asyncio.sleep(step)
            pause -= step
            if pause > 0:
                yield ": ping\n\n"

        # Inter-beat breath, same knob as the live loop.
        await asyncio.sleep(float(gap_for_speed(state.speed)))

    # ---- main beat loop ---------------------------------------------------

    cursor = max(0, int(getattr(state, "script_cursor", 0) or 0))

    while True:
        if state.cancelled:
            return

        script = _script()
        beats = script.get("beats") or []
        if cursor >= len(beats):
            # Script exhausted — the CALLER emits the endgame; just return.
            return

        # Pause handling: keepalives only until unpaused (mirrors live loop).
        if state.paused or state.speed == "pause":
            yield _KEEPALIVE
            await asyncio.sleep(PAUSE_POLL_SECONDS)
            continue

        # ---- episode gate: never play prose that isn't written yet --------
        beat = beats[cursor]
        episode = int(beat.get("episode", 1) or 1)
        if episode > int(script.get("episodes_ready", 0) or 0):
            waited = 0.0
            next_ping = EPISODE_PING_EVERY
            warned = False
            while True:
                if state.cancelled:
                    return
                script = _script()
                beats = script.get("beats") or []
                if cursor >= len(beats):
                    return
                beat = beats[cursor]
                episode = int(beat.get("episode", 1) or 1)
                if episode <= int(script.get("episodes_ready", 0) or 0):
                    break
                if waited >= EPISODE_ABANDON_AFTER:
                    # The writers' room never caught up — stop gracefully.
                    state.status = "abandoned"
                    _persist()
                    return
                if waited >= EPISODE_WARN_AFTER and not warned:
                    yield system_error_sse("the writers' room is behind — hold")
                    warned = True
                if waited >= next_ping:
                    yield _KEEPALIVE
                    next_ping = waited + EPISODE_PING_EVERY
                await asyncio.sleep(EPISODE_POLL_SECONDS)
                waited += EPISODE_POLL_SECONDS
            # Fresh references — the showrunner may have swapped the script
            # dict for a prose-filled copy while we waited.
            script = _script()
            beats = script.get("beats") or []
            if cursor >= len(beats):
                return
            beat = beats[cursor]

        # ---- days-axis: tick the calendar through the quiet stretch -------
        # The script owns the calendar; between beats we walk day-by-day so
        # time visibly passes (feed/minis carry the motion), then freeze on
        # the beat itself. Design: the owner's original 'days as the central
        # piece' concept.
        target_day = int(beat.get("day") or 0)
        cur_day = int(getattr(state.stats, "day", 0) or 0)
        if target_day > cur_day:
            gap = target_day - cur_day
            factor = 1.0
            try:
                base = float(gap_for_speed("1x")) or 1.0
                factor = max(0.0, float(gap_for_speed(state.speed)) / base)
            except Exception:
                pass
            interval = min(DAY_TICK_SLEEP, DAY_TICK_MAX_TOTAL / gap) * factor
            for d in range(cur_day + 1, target_day + 1):
                if getattr(state, "cancelled", False):
                    return
                while getattr(state, "paused", False):
                    yield ": ping\n\n"
                    await asyncio.sleep(2.0)
                state.stats.day = d
                yield sse("day.tick", {"day": d, "quiet": True})
                if interval > 0:
                    await asyncio.sleep(interval)

        # ---- play one beat with per-beat crash isolation -------------------
        try:
            player = (_play_mini(cursor, beat) if beat.get("kind") == "mini"
                      else _play_large(beat))
            async for chunk in player:
                yield chunk
        except asyncio.CancelledError:
            raise
        except Exception:
            fails = getattr(state, "_beat_fail_count", 0) + 1
            state._beat_fail_count = fails  # type: ignore[attr-defined]
            print(
                f"[playback] run={state.run_id} beat={cursor} crashed "
                f"(consecutive={fails}/{MAX_CONSECUTIVE_BEAT_CRASHES}):"
            )
            traceback.print_exc()
            yield system_error_sse(
                "reality glitched — the simulator skips a beat and keeps going"
            )
            if fails >= MAX_CONSECUTIVE_BEAT_CRASHES:
                state.status = "abandoned"
                _persist()
                return
            # Skip the cursed beat: advance + persist so a reconnect doesn't
            # replay the crash, then keep going.
            cursor += 1
            state.script_cursor = cursor
            _persist()
            await asyncio.sleep(CRASH_RECOVERY_SLEEP)
            continue
        else:
            state._beat_fail_count = 0  # type: ignore[attr-defined]

        # Beat fully played: advance the cursor and persist — the resume
        # contract ("replay nothing") lives entirely on this line pair.
        cursor += 1
        state.script_cursor = cursor
        _persist()


# ---------------------------------------------------------------------------
# self-test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from types import SimpleNamespace

    import run_script  # type: ignore
    from state import RunState, Stats  # type: ignore

    # Instant pacing for the test.
    TOKEN_SLEEP = 0.0
    READ_PAUSE = 0.0
    DELIB_SLEEP = 0.0
    PREDICTION_WINDOW_SECONDS = 0.25
    PAUSE_POLL_SECONDS = 0.01
    CRASH_RECOVERY_SLEEP = 0.0

    init = Stats().snapshot()

    beats: List[Dict[str, Any]] = [
        {
            "kind": "mini", "turn": 1, "day": init["day"] + 1, "episode": 1,
            "source_event_id": "EVT-MINI-001",
            "category": "OPERATIONS", "severity": "S",
            "title": "an intern refactors the deploy script",
            "body": "nothing breaks. suspicious.",
            "tags": ["ops"],
            "stats_deltas": {"reputation": 1, "day": 1},
            "mini_id": "mini-1-1",
            "outcome": "quietly shipped",
        },
        {
            "kind": "large", "turn": 1, "day": init["day"] + 2, "episode": 1,
            "source_event_id": "EVT-FR-001",
            "category": "FUNDRAISING", "severity": "M",
            "title": "a term sheet appears",
            "body": "Ridgeline Capital wants in at a number with many zeros.",
            "tags": ["fundraising"],
            "choices": [
                {"id": "A", "label": "sign it before they blink", "tone": "based"},
                {"id": "B", "label": "shop it to three other funds", "tone": "cursed"},
            ],
            "ceo_choice": "A",
            "ceo_reasoning": "the number is fake but the wire is real. "
                             "sign, announce, let the announcement become the diligence.",
            "justification": "momentum is the only moat",
            "artifact_tweet": "some personal news: we are so back",
            "reactions": [
                {"source": "twitter", "handle": "@litcapital",
                 "name": "lit capital", "body": "term sheet szn"},
            ],
            "stats_deltas": {"cash": 1_000_000, "day": 1},
            "stat_rationale": "the wire landed; cash up seven figures",
            "seeds_planted": ["SEED-DILIGENCE-BOMB"],
            "seeds_paid_off": [],
        },
        {
            "kind": "large", "turn": 2, "day": init["day"] + 6, "episode": 1,
            "source_event_id": "EVT-PR-002",
            "category": "PRESS", "severity": "L",
            "title": "the diligence bomb goes off",
            "body": "an associate found the spreadsheet tab named FINAL_v2_REAL.",
            "tags": ["press"],
            "choices": [
                {"id": "A", "label": "deny everything", "tone": "cursed"},
                {"id": "B", "label": "post through it", "tone": "based"},
            ],
            "ceo_choice": "B",
            "ceo_reasoning": "denying creates a second story. "
                             "posting through creates a lifestyle.",
            "justification": "the timeline forgives posters",
            "artifact_tweet": None,
            "reactions": [],
            "stats_deltas": {"reputation": -5, "day": 4},
            "stat_rationale": "the screenshot is everywhere",
            "seeds_planted": [],
            "seeds_paid_off": ["SEED-DILIGENCE-BOMB"],
        },
    ]
    running = dict(init)
    for b in beats:
        running = run_script.apply_deltas_to_stats(running, b["stats_deltas"])
        b["stats_after"] = dict(running)

    script = run_script.new_script(
        length_mode="short", endgame_id="END-TEST-001", episodes_total=1,
    )
    script["episodes_ready"] = 1
    script["beats"] = beats
    errs = run_script.validate_script(script, initial_stats=init)
    assert not errs, f"fake script invalid: {errs}"

    state = RunState(run_id="TEST-PLAYBACK")
    state.status = "streaming"
    state.script = script            # type: ignore[attr-defined]
    state.script_cursor = 0          # type: ignore[attr-defined]

    emitted: List[str] = []
    persists: List[str] = []
    decisions: List[Dict[str, Any]] = []

    def fake_sse(kind: str, data: Any) -> str:
        return f"{kind}|{json.dumps(data, default=str)}\n"

    def fake_achievements(_state):
        return
        yield  # pragma: no cover — generator fn that yields nothing

    STREAM_KWARGS = dict(
        sse=fake_sse,
        persist_run=lambda run_id: persists.append(run_id),
        run_store=SimpleNamespace(
            append_decision=lambda **kw: decisions.append(kw)),
        emit_achievements=fake_achievements,
        gap_for_speed=lambda s: 0.0,
        feed_event_kind=lambda r: "feed.tweet",
        feed_payload=lambda r: {
            "handle": r.get("handle") or "@chorus",
            "display_name": r.get("name") or "chorus",
            "verified": True,
            "avatar_seed": (r.get("handle") or "@chorus").lstrip("@"),
            "body": r.get("body") or "",
            "reactions": {"likes": 0, "retweets": 0, "quotes": 0},
            "ts": _ts_now(),
        },
        founder_handle=lambda s: "@testfounder",
        founder_name=lambda s: "Test Founder",
        system_error_sse=lambda m: (
            f"system.error|{json.dumps({'message': m, 'recoverable': True})}\n"
        ),
    )

    async def main() -> None:
        # Pre-load one prediction so the first large beat grades it.
        q = state.ensure_decision_queue()
        await q.put({"kind": "prediction", "predicted_choice": "A"})

        async for chunk in stream_script(state, **STREAM_KWARGS):
            emitted.append(chunk)

        kinds = [e.split("|", 1)[0] for e in emitted if not e.startswith(":")]

        def collapse(seq: List[str]) -> List[str]:
            out: List[str] = []
            for k in seq:
                if not out or out[-1] != k:
                    out.append(k)
            return out

        expected = [
            "turn.mini",
            # large turn 1 — predict-first order (UX-19): chips before the
            # agent's reasoning so the pick can't be spoiled
            "turn.start", "event.materialize", "choices.appear",
            "agent.thought_token", "agent.thought_complete",
            "agent.deliberation_token", "agent.commit",
            "consequences.applied", "feed.tweet",
            # large turn 2 (no prediction; no tweet, no reactions)
            "turn.start", "event.materialize", "choices.appear",
            "agent.thought_token", "agent.thought_complete",
            "agent.deliberation_token", "agent.commit",
            "consequences.applied",
        ]
        kinds = [k for k in kinds if k != "day.tick"]
        got = collapse(kinds)
        assert got == expected, f"event order mismatch:\n got {got}\n exp {expected}"

        # thought tokens actually streamed as multiple chunks
        assert kinds.count("agent.thought_token") > 2, kinds

        mini_payload = json.loads(
            [e for e in emitted if e.startswith("turn.mini|")][0].split("|", 1)[1])
        assert mini_payload["mini_id"] == "mini-1-1", mini_payload
        assert mini_payload["kind"] == "atmospheric", mini_payload

        commits = [json.loads(e.split("|", 1)[1]) for e in emitted
                   if e.startswith("agent.commit|")]
        assert [c["choice_id"] for c in commits] == ["A", "B"], commits
        assert commits[0]["artifact_tweet"] == "some personal news: we are so back"

        cons = [json.loads(e.split("|", 1)[1]) for e in emitted
                if e.startswith("consequences.applied|")]
        assert cons[0]["stat_deltas"] == {"cash": 1_000_000, "day": 1}, cons[0]
        assert cons[0]["effects_summary"][0]["value"] == "+1.0M", cons[0]
        assert cons[0]["seeds_planted"] == ["SEED-DILIGENCE-BOMB"], cons[0]
        assert cons[1]["seeds_paid_off"] == ["SEED-DILIGENCE-BOMB"], cons[1]

        # trajectory applied + day pinned by the script
        assert state.stats.cash == init["cash"] + 1_000_000, state.stats.cash
        assert state.stats.reputation == init["reputation"] + 1 - 5
        assert state.stats.day == init["day"] + 6, state.stats.day

        # prediction grading — derived from TurnRecords by snapshot()
        assert state.snapshot()["predictions"] == {"correct": 1, "total": 1}

        # persistence side-channels
        assert len(decisions) == 2 and decisions[0]["user_pred"] == "A" \
            and decisions[1]["user_pred"] is None, decisions
        assert persists, "persist_run never called"

        # cursor advanced past every beat
        assert state.script_cursor == 3, state.script_cursor

        # ---- resume no-op: a second invocation replays NOTHING -------------
        emitted2: List[str] = []
        async for chunk in stream_script(state, **STREAM_KWARGS):
            emitted2.append(chunk)
        assert emitted2 == [], f"resume replayed {len(emitted2)} events"
        assert state.script_cursor == 3

        print(f"events emitted: {len(emitted)} "
              f"(pings: {sum(1 for e in emitted if e.startswith(':'))})")
        print(f"collapsed kind order OK: {got}")
        print("cursor after run: 3; resume emitted: 0")
        print("predictions:", state.snapshot()["predictions"])
        print("PASS")

    asyncio.run(main())
