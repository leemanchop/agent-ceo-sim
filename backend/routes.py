"""
SSE + REST routes for the per-run hot path.

Mounted onto the FastAPI app from `modal_app.py::_build_fastapi`. Splits cleanly
from the deploy shell so this file stays focused on the run lifecycle:

    POST /run/create
    POST /run/{id}/start            (SSE: researcher → bible → stream.open)
    GET  /run/{id}/stream           (SSE: turn loop)
    POST /run/{id}/decide
    POST /run/{id}/speed
    POST /run/{id}/end
    GET  /run/{id}                  (snapshot)
    GET  /run/{id}/bible

Wire format follows game/api_contracts.md.
"""

from __future__ import annotations

import asyncio
import json
import os
import queue as thread_queue
import random
import re
import traceback
import uuid
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, List, Optional


def install_routes(api: Any) -> None:  # api: FastAPI
    from fastapi import HTTPException
    from fastapi.responses import StreamingResponse

    # Imports at install time so this file is cheap to import without deps.
    from agents.researcher import run_researcher  # type: ignore
    from agents.oracle import run_oracle  # type: ignore
    from agents.ceo import stream_ceo  # type: ignore
    from agents.editor import review as editor_review  # type: ignore
    from agents.post_mortem import stream_post_mortem  # type: ignore
    from state import (  # type: ignore
        FeedEntry,
        TurnRecord,
        create_run,
        get_run,
        persist_run,
    )
    import run_store  # type: ignore

    # Phase 2 scripted engine — optional until showrunner/playback land.
    # Guarded import keeps the live engine fully functional without them,
    # and ACES_SCRIPTED=0 is the kill switch back to the live engine.
    try:
        from showrunner import generate_script  # type: ignore
        from playback import stream_script  # type: ignore
        _scripted_available = True
    except Exception:
        generate_script = None  # type: ignore
        stream_script = None  # type: ignore
        _scripted_available = False

    def _scripted_enabled(state) -> bool:
        if not _scripted_available or state.interactive:
            return False
        if os.environ.get("ACES_SCRIPTED", "1") == "0":
            return False
        return bool((state.settings or {}).get("scripted", True))

    async def _generate_script_events(state) -> AsyncGenerator[str, None]:
        """Run showrunner generation, yielding progress as researcher.*
        SSE lines the existing loading UI already renders. On any failure
        the run falls back to the live engine (state.script stays None)."""
        q: asyncio.Queue = asyncio.Queue()

        async def on_event(kind: str, data: Dict[str, Any]) -> None:
            await q.put((kind, data))

        async def runner():
            try:
                script = await generate_script(
                    state, on_event=on_event,
                    persist_cb=lambda: persist_run(state.run_id),
                )
                state.script = script
                persist_run(state.run_id)
            except Exception:
                traceback.print_exc()
            finally:
                state._script_inflight = False  # type: ignore[attr-defined]
                await q.put(("__done__", None))

        # Reconnect-safety (same disease as the researcher double-billing):
        # a generation is already running for this run — wait on it instead
        # of spawning a second Sonnet episode writer.
        if getattr(state, "_script_inflight", False):
            for _ in range(240):
                await asyncio.sleep(2.0)
                if state.script or not getattr(state, "_script_inflight", False):
                    return
                yield ": ping\n\n"
            return
        state._script_inflight = True  # type: ignore[attr-defined]

        task = asyncio.create_task(runner())
        try:
            while True:
                try:
                    kind, data = await asyncio.wait_for(q.get(), timeout=5.0)
                except asyncio.TimeoutError:
                    yield ": ping\n\n"
                    continue
                if kind == "__done__":
                    break
                if kind == "script.progress":
                    d = data or {}
                    yield sse("researcher.searching", {
                        "query": f"showrunner: {d.get('stage', 'writing')} "
                                 f"{d.get('episode', '')}"
                                 f"{'/' + str(d.get('of')) if d.get('of') else ''}",
                        "step": 5, "of": 6,
                    })
                else:
                    yield sse(kind, data)
        finally:
            if not task.done():
                # generation continues in background (later episodes) — the
                # returned script object is already on state once episode 1
                # lands; do not cancel.
                pass

    def sse(event: str, data: Any) -> str:
        return f"event: {event}\ndata: {json.dumps(data, default=str)}\n\n"

    def _achievement_sse(rec) -> str:
        payload = {
            "achievement_id": rec.id,
            "category": rec.category,
            "rarity": rec.rarity,
            "name": rec.name,
            "description": rec.description,
            "share_text": rec.share_text,
            "icon_hint": rec.icon_hint,
            "unlocked_at": datetime.now(tz=timezone.utc).isoformat(),
        }
        return sse("achievement.unlocked", payload)

    def _emit_achievements(state, *, just_endgame=None):
        """Evaluate the achievement engine and yield SSE strings for any new
        unlocks. Defensive: never let an engine crash kill the run loop."""
        try:
            from achievement_engine import evaluate_triggers  # type: ignore
        except Exception:
            return
        try:
            new_unlocks = evaluate_triggers(state, just_endgame=just_endgame)
        except Exception:
            return
        for rec in new_unlocks:
            # Mirror onto the legacy `state.achievements` list for the snapshot.
            if rec.id not in state.achievements:
                state.achievements.append(rec.id)
            # Best-effort write-through to the run-persistence store. Guarded
            # because the run-persistence module/function may not exist yet.
            try:
                from run_store import append_achievement  # type: ignore
                append_achievement(state.run_id, rec.id)
            except Exception:
                pass
            yield _achievement_sse(rec)

    @api.post("/run/create")
    async def run_create(payload: Dict[str, Any]):
        # `create_run` registers the run in the in-memory cache *and* mirrors
        # it to the on-disk store (run_store.save_run). user_id may live in
        # payload.user_id or payload.settings.user_id — both shapes are
        # accepted for forward-compat with the auth-agent's PR.
        state = create_run(payload)
        return {
            "run_id": state.run_id,
            "status": state.status,
            "bible_url": f"/run/{state.run_id}/bible",
        }

    @api.get("/me/runs")
    async def me_runs(user_id: Optional[str] = None, limit: int = 50):
        """List a user's runs (most recent first). Filtered by user_id when
        provided; otherwise returns all runs (admin/debug surface)."""
        return {"runs": run_store.list_runs(user_id=user_id, limit=limit)}

    @api.get("/archive/trending")
    async def archive_trending(limit: int = 50):
        """Public archive feed — completed runs ordered by ended_at desc."""
        return {"runs": run_store.list_runs(status="completed", limit=limit)}

    @api.get("/run/{run_id}")
    async def run_snapshot(run_id: str):
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        return state.snapshot()

    # TODO: gate behind admin auth before public launch (same as /usage).
    @api.get("/run/{run_id}/script")
    async def run_script_dump(run_id: str):
        """Debug/admin: the full pregenerated RunScript (Phase 2)."""
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        if not state.script:
            raise HTTPException(404, "run has no script (live-engine run?)")
        return {"script": state.script, "cursor": state.script_cursor}

    @api.get("/run/{run_id}/bible")
    async def run_bible(run_id: str):
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        return {"bible": state.bible, "raw_yaml": state.bible_yaml_raw}

    # GET so the frontend can consume via EventSource (which is GET-only).
    # No request body is read; run_id from path is the only input.
    @api.get("/run/{run_id}/start")
    async def run_start(run_id: str):
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        state.status = "researching"

        async def gen() -> AsyncGenerator[str, None]:
            yield sse("stream.handshake", {"version": "1.0.0"})

            # ---- template mode: synthetic researcher progression -------
            # We still emit the researcher.* events so the upload-confirm UI
            # has something to render — but the content comes from the
            # template's pre-baked Company Bible YAML, not a live web search.
            if state.mode == "template" and state.template_id:
                try:
                    bible, raw_yaml = _load_template_bible(state.template_id)
                except Exception as e:  # pragma: no cover
                    yield _system_error_sse(
                        "couldn't unzip the archive — try a different template"
                    )
                    state.status = "abandoned"
                    return
                if bible is None:
                    yield _system_error_sse(
                        "template not found in archive — pick another"
                    )
                    state.status = "abandoned"
                    return

                # Templates are pre-authored — there's no real research to do.
                # We emit a TIGHT synthetic progression so the UI has a
                # one-beat "loading historical record" affordance, then go.
                # Total synthetic budget: ~1.0s. The frontend's first-turn
                # delay is also collapsed to 0.5s for templates.
                yield sse("researcher.searching", {
                    "query": f"loading historical record: {state.template_id}",
                    "step": 1, "of": 2,
                })
                await asyncio.sleep(0.25)
                yield sse("researcher.scraping", {
                    "url": f"world/templates/{state.template_id}.md",
                    "step": 2, "of": 2,
                })
                await asyncio.sleep(0.25)
                # Skip the per-section bible_partial drip for templates —
                # the user already knows it's pre-authored; no value in faking
                # a live-research feel here.
                state.bible = bible
                state.bible_yaml_raw = raw_yaml
                _apply_bible_to_initial_stats(state)
                persist_run(state.run_id)
                yield sse("researcher.bible_complete", {"bible": bible})
                if _scripted_enabled(state) and not state.script:
                    async for chunk in _generate_script_events(state):
                        yield chunk
                state.status = "streaming"
                yield sse("stream.open", {
                    "version": "1.0.0",
                    "first_turn_in_seconds": 0.5,
                })
                return

            # ---- live research path ------------------------------------
            # Idempotency guards: /start is an EventSource target, and
            # EventSources auto-reconnect on any drop. Without these, every
            # reconnect would spawn ANOTHER researcher (an Opus + web_search
            # call, ~$1+ each) for the same run.
            if state.bible:
                # Research already finished — a reconnect just needs the
                # terminal events to proceed to /stream.
                yield sse("researcher.bible_complete", {"bible": state.bible})
                if _scripted_enabled(state) and not state.script:
                    async for chunk in _generate_script_events(state):
                        yield chunk
                state.status = "streaming"
                yield sse("stream.open", {
                    "version": "1.0.0", "first_turn_in_seconds": 2,
                })
                return
            if getattr(state, "_research_inflight", False):
                # Another connection's researcher is mid-flight: wait for it
                # instead of double-billing. Ping to keep the stream alive.
                for _ in range(90):
                    await asyncio.sleep(2.0)
                    if state.bible:
                        yield sse("researcher.bible_complete", {"bible": state.bible})
                        state.status = "streaming"
                        yield sse("stream.open", {
                            "version": "1.0.0", "first_turn_in_seconds": 2,
                        })
                        return
                    if not getattr(state, "_research_inflight", False):
                        break  # first researcher died — fall through to retry
                    yield ": ping\n\n"
                if state.bible:
                    return
            state._research_inflight = True  # type: ignore[attr-defined]

            queue: asyncio.Queue = asyncio.Queue()

            async def on_event(kind: str, data: Dict[str, Any]) -> None:
                await queue.put((kind, data))

            async def runner():
                try:
                    bible = await run_researcher(
                        user_input=state.company_input or {},
                        run_id=state.run_id,
                        on_event=on_event,
                    )
                    state.bible = bible
                    state.bible_yaml_raw = json.dumps(bible, indent=2)
                    _apply_bible_to_initial_stats(state)
                    persist_run(state.run_id)
                    if _scripted_enabled(state) and not state.script \
                            and not getattr(state, "_script_inflight", False):
                        state._script_inflight = True  # type: ignore[attr-defined]
                        async def _fwd(kind: str, data: Dict[str, Any]) -> None:
                            if kind == "script.progress":
                                d = data or {}
                                await queue.put(("researcher.searching", {
                                    "query": f"showrunner: {d.get('stage', 'writing')} "
                                             f"{d.get('episode', '')}"
                                             f"{'/' + str(d.get('of')) if d.get('of') else ''}",
                                    "step": 5, "of": 6,
                                }))
                            else:
                                await queue.put((kind, data))
                        try:
                            state.script = await generate_script(
                                state, on_event=_fwd,
                                persist_cb=lambda: persist_run(state.run_id),
                            )
                            persist_run(state.run_id)
                        except Exception:
                            traceback.print_exc()  # fall back to live engine
                        finally:
                            state._script_inflight = False  # type: ignore[attr-defined]
                    state.status = "streaming"
                    await queue.put(("stream.open", {
                        "version": "1.0.0",
                        "first_turn_in_seconds": 2,
                    }))
                except Exception as e:  # pragma: no cover
                    # In-voice error (no "Internal Server Error" leaks). The
                    # frontend renders this as a fake event in the agent stream.
                    # Mark the run terminal — it used to stay 'researching'
                    # forever in the DB, indistinguishable from a live run.
                    traceback.print_exc()
                    state.status = "abandoned"
                    try:
                        persist_run(state.run_id)
                    except Exception:
                        pass
                    await queue.put(("system.error", {
                        "message": "researcher couldn't dig anything up — going dark",
                        "recoverable": True,
                        "_exc": str(e),
                    }))
                finally:
                    state._research_inflight = False  # type: ignore[attr-defined]
                    await queue.put(("__done__", None))

            task = asyncio.create_task(runner())
            try:
                while True:
                    # NOTE: client-disconnect detection used to live here via
                    # `request.is_disconnected()`, but that required the
                    # `request: Request` parameter which FastAPI was
                    # misinterpreting as a required query field (causing 400s
                    # before the SSE could open). The Anthropic SDK call has
                    # its own timeout; if the browser closes the EventSource,
                    # the next yield will raise and tear the runner down.
                    try:
                        kind, data = await asyncio.wait_for(queue.get(), timeout=30.0)
                    except asyncio.TimeoutError:
                        yield ": ping\n\n"
                        continue
                    if kind == "__done__":
                        break
                    yield sse(kind, data)
            finally:
                # Do NOT cancel the researcher on client disconnect — the
                # tokens are already being paid for, and the result persists
                # to state/DB so the reconnecting client (see the idempotency
                # guards above) picks it up instead of re-billing a fresh
                # research pass. The task self-terminates within ~2 minutes.
                pass

        return StreamingResponse(gen(), media_type="text/event-stream")

    @api.post("/run/{run_id}/decide")
    async def run_decide(run_id: str, payload: Dict[str, Any]):
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        kind = payload.get("kind")
        if kind not in ("prediction", "force_choice"):
            raise HTTPException(400, "kind must be prediction or force_choice")
        state.last_user_decision = payload
        # If the stream loop is awaiting a decision, push it.
        if state.decision_queue is not None:
            await state.decision_queue.put(payload)
        return {"ok": True}

    @api.post("/run/{run_id}/speed")
    async def run_speed(run_id: str, payload: Dict[str, Any]):
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        speed = payload.get("speed")
        if speed not in ("1x", "2x", "4x", "pause"):
            raise HTTPException(400, "invalid speed")
        state.paused = speed == "pause"
        if not state.paused:
            state.speed = speed
        return {"ok": True, "speed": speed}

    @api.post("/run/{run_id}/end")
    async def run_end(run_id: str):
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        state.cancelled = True
        state.status = "abandoned"
        persist_run(run_id)
        return {"ok": True}

    @api.get("/run/{run_id}/stream")
    async def run_stream(run_id: str):
        state = get_run(run_id)
        if not state:
            raise HTTPException(404, "run not found")
        if not state.bible:
            raise HTTPException(409, "bible not ready — call /run/{id}/start first")

        async def gen() -> AsyncGenerator[str, None]:
            yield sse("stream.open", {
                "version": "1.0.0", "first_turn_in_seconds": 1,
            })
            # ---- Phase 2: scripted playback (spectate) ----------------
            # The script was pregenerated at /start; playback just streams
            # it over the same SSE contract. Endgame emission stays here.
            if state.script and _scripted_enabled(state):
                try:
                    async for chunk in stream_script(
                        state,
                        sse=sse,
                        persist_run=persist_run,
                        run_store=run_store,
                        emit_achievements=_emit_achievements,
                        gap_for_speed=_gap_for_speed,
                        feed_event_kind=_feed_event_kind,
                        feed_payload=_feed_payload,
                        founder_handle=_founder_handle,
                        founder_name=_founder_name,
                        system_error_sse=_system_error_sse,
                    ):
                        yield chunk
                except asyncio.CancelledError:
                    return
                except Exception:
                    print(f"[playback] run={state.run_id} died:")
                    traceback.print_exc()
                    yield _system_error_sse(
                        "the projector jammed — the reel is safe, refresh to resume",
                    )
                    return
                if not state.cancelled and state.status not in ("abandoned",):
                    async for chunk in _emit_endgame(state, sse):
                        yield chunk
                return
            try:
                while not state.cancelled and state.turn < state.max_turns():
                    # Pause handling: yield only keepalives until unpaused.
                    if state.paused or state.speed == "pause":
                        yield ": ping\n\n"
                        await asyncio.sleep(2.0)
                        continue

                    # Stat-based endgame check before generating another turn.
                    if _endgame_triggered_by_stats(state):
                        print(
                            f"[endgame] route=stats turn={state.turn} "
                            f"run={state.run_id} stats={state.stats.snapshot()}"
                        )
                        async for chunk in _emit_endgame(state, sse):
                            yield chunk
                        return

                    # ---- per-turn isolation ----------------------------
                    # One bad turn (usually LLM-authored content slipping
                    # past the coercion layer) must not kill the run. Log
                    # loudly, show an in-fiction beat, keep going; three
                    # consecutive crashed turns force a graceful endgame.
                    try:
                        state.turn += 1
                        last_ceo = _last_ceo_commit_for_oracle(state)

                        # ---- 1) Oracle generates the turn ----
                        # If we pre-fetched the next Oracle during the previous
                        # turn's tail (consequences phase), await that task instead
                        # of calling Oracle fresh. Saves ~5-15s of LLM latency
                        # between events.
                        pre = getattr(state, "_next_oracle_task", None)
                        state._next_oracle_task = None  # type: ignore[attr-defined]
                        try:
                            if pre is not None:
                                oracle_out = await pre
                            else:
                                oracle_out = await asyncio.to_thread(
                                    run_oracle, state=state, last_ceo_commit=last_ceo
                                )
                        except Exception as e:  # pragma: no cover
                            # Log the actual exception so we can diagnose Oracle
                            # failures (token-budget, rate-limit, JSON parse, etc.)
                            # — silently swallowing was leaving runs stuck in a
                            # retry loop for 30+ seconds with no visibility.
                            # NOTE: no local `import traceback` here — a local
                            # import makes the name function-local for ALL of
                            # gen(), so handlers that fire before this line
                            # would hit UnboundLocalError (found by chaos test).
                            print(
                                f"[oracle] turn={state.turn} run={state.run_id} "
                                f"failed (consecutive={getattr(state, '_oracle_fail_count', 0) + 1}): {e!r}"
                            )
                            traceback.print_exc()
                            # Cap consecutive failures: 3 strikes → endgame.
                            # Avoids runaway retry loops if the LLM is wedged.
                            fails = getattr(state, "_oracle_fail_count", 0) + 1
                            state._oracle_fail_count = fails  # type: ignore[attr-defined]
                            # Even on persistent LLM failure, never force an endgame
                            # before the user has seen 3 decisions resolve. Let
                            # them sit in error-retry hell instead — they can
                            # always close the tab. Forced-endgame on turn 1 is
                            # worse UX than a clear "agent disconnected" message
                            # that the user can give up on themselves.
                            MIN_DECISIONS = 3
                            if fails >= 3 and state.turn >= MIN_DECISIONS:
                                print(
                                    f"[endgame] route=llm_3_strikes turn={state.turn} "
                                    f"run={state.run_id}"
                                )
                                yield _system_error_sse(
                                    "oracle disconnected. forcing endgame.",
                                )
                                async for chunk in _emit_endgame(state, sse):
                                    yield chunk
                                return
                            yield _system_error_sse(
                                f"the world stuttered ({fails}/3) — recovering",
                            )
                            await asyncio.sleep(2.0 * fails)  # exponential back-off
                            state.turn -= 1
                            continue
                        # Reset the failure counter on any successful turn.
                        state._oracle_fail_count = 0  # type: ignore[attr-defined]
                        event_card = oracle_out.get("event_card", {}) or {}
                        # LLM-authored — tolerate a card emitted as prose/list and
                        # choices items that aren't objects. (Tool input is NOT
                        # schema-validated server-side; see agents/oracle.py.)
                        if not isinstance(event_card, dict):
                            event_card = {}
                        event_card["choices"] = [
                            c for c in (event_card.get("choices") or [])
                            if isinstance(c, dict)
                        ]
                        # Deterministic slot-resolve pass (UX-1): catch any
                        # [FOUNDER]/[COMPANY]/… token the Oracle forgot.
                        slots = _slot_map(state)
                        event_card["title"] = _resolve_slots(event_card.get("title"), slots, state.run_id)
                        event_card["body"] = _resolve_slots(event_card.get("body"), slots, state.run_id)
                        for c in event_card["choices"]:
                            c["label"] = _resolve_slots(c.get("label"), slots, state.run_id)

                        yield sse("turn.start", {
                            "turn": state.turn,
                            "day_elapsed": state.stats.day,
                            "stats": state.stats.snapshot(),
                        })
                        yield sse("event.materialize", {
                            "event_id": event_card.get("id"),
                            "category": event_card.get("category"),
                            "title": event_card.get("title"),
                            "body": event_card.get("body"),
                            "severity": event_card.get("severity"),
                            "tags": event_card.get("tags", []),
                        })
                        atms = oracle_out.get("atmospheric") or []
                        _mini_idx = 0
                        for atm in (atms if isinstance(atms, list) else []):
                            if not isinstance(atm, dict):
                                continue  # model emitted a bare string beat
                            _mini_idx += 1
                            yield sse("turn.mini", {
                                # Stable per-(turn, index) id — the frontend
                                # dedupes timeline rows on it, so SSE
                                # re-delivery after a reconnect no longer
                                # duplicates mini rows (UX-8).
                                "mini_id": f"mini-{state.turn}-{_mini_idx}",
                                "kind": atm.get("kind", "atmospheric"),
                                "headline": _resolve_slots(atm.get("headline", ""), slots, state.run_id),
                                "stat_deltas": atm.get("stat_deltas", {}),
                            })
                        reactions = oracle_out.get("reactions") or []
                        for r in (reactions if isinstance(reactions, list) else []):
                            if not isinstance(r, dict):
                                continue  # model emitted "@handle: text" strings
                            r["body"] = _resolve_slots(r.get("body"), slots, state.run_id)
                            r["name"] = _resolve_slots(r.get("name"), slots, state.run_id)
                            yield sse(_feed_event_kind(r), _feed_payload(r))

                        # ---- 2) CEO streams hidden reasoning ----
                        # Per the SSE contract: thought_token (private) → thought_complete →
                        # choices.appear → deliberation_token (justification, post-commit) →
                        # agent.commit. The CEO call returns reasoning + commit + artifacts
                        # in one shot; we emit them in the contract's order.
                        thought_id = f"thought_{state.turn}"
                        tok_q: thread_queue.Queue = thread_queue.Queue()

                        ceo_task = asyncio.create_task(asyncio.to_thread(
                            _run_ceo_sync, state, event_card, tok_q
                        ))

                        while True:
                            if ceo_task.done() and tok_q.empty():
                                break
                            try:
                                tok = tok_q.get(timeout=0.5)
                                if tok is None:
                                    break
                                yield sse("agent.thought_token", {
                                    "token": tok, "stream_id": thought_id,
                                })
                            except thread_queue.Empty:
                                await asyncio.sleep(0.05)
                                yield ": ping\n\n"
                        try:
                            ceo_out = await ceo_task
                        except Exception as e:  # pragma: no cover
                            print(
                                f"[ceo] turn={state.turn} run={state.run_id} failed: {e!r}"
                            )
                            traceback.print_exc()
                            yield _system_error_sse(
                                "agent went silent. legal team confiscated phone.",
                            )
                            ceo_out = _ceo_fallback(event_card)

                        yield sse("agent.thought_complete", {
                            "stream_id": thought_id,
                            "full_text": _as_str(ceo_out.get("reasoning")),
                        })

                        # choices appear AFTER the private thought, per contract.
                        prediction_window = 30 if not state.interactive else 120
                        yield sse("choices.appear", {
                            "choices": event_card.get("choices", []),
                            "prediction_window_seconds": prediction_window,
                        })
                        deliberation_id = f"deliberation_{state.turn}"

                        # ---- 3) Wait for prediction / force ----
                        state.ensure_decision_queue()
                        state.pending_event_id = event_card.get("id")
                        state.last_user_decision = None
                        user_pred = None
                        user_force = None
                        # Wait for the user's prediction / force-choice, but emit
                        # an SSE keepalive every few seconds so proxies and the
                        # browser's EventSource don't drop the connection during
                        # the (up to 30s spectate / 120s interactive) decision
                        # window. The old code did a single silent wait_for for the
                        # whole window — up to 30s of dead air after choices.appear,
                        # which surfaced to users as "the run just stops / returns
                        # nothing." Timing out the whole window still leaves both
                        # user_pred and user_force None, exactly as before.
                        loop = asyncio.get_event_loop()
                        deadline = loop.time() + float(prediction_window)
                        while True:
                            remaining = deadline - loop.time()
                            if remaining <= 0:
                                break
                            try:
                                decision = await asyncio.wait_for(
                                    state.decision_queue.get(),
                                    timeout=min(5.0, remaining),
                                )
                            except asyncio.TimeoutError:
                                yield ": ping\n\n"
                                continue
                            if decision.get("kind") == "prediction":
                                user_pred = decision.get("predicted_choice")
                            elif decision.get("kind") == "force_choice":
                                user_force = decision.get("choice_id")
                            break

                        chosen_id = user_force or ceo_out.get("choice_id")
                        # CEO output is free-form JSON (no tool forcing) — tolerate
                        # artifacts flattened to a string/list, and non-string
                        # tweets (a dict tweet stored in TurnRecord used to poison
                        # every later Oracle prompt build via `[:140]` slicing).
                        artifacts = ceo_out.get("artifacts", {}) or {}
                        if not isinstance(artifacts, dict):
                            artifacts = {
                                "tweet": artifacts if isinstance(artifacts, str) else None,
                            }
                        _tw = artifacts.get("tweet")
                        artifacts["tweet"] = None if _tw is None else _as_str(_tw)

                        # Drip the justification text as deliberation tokens for
                        # the chip-stream UI before the final commit. Cheap visual
                        # cadence — no extra LLM call.
                        #
                        # Fast-forward: if the user predicted (or force-chose), we
                        # skip the drip and emit the full justification in one
                        # chunk, then commit immediately. The user already saw the
                        # CEO's hidden reasoning during deliberating; once they've
                        # picked, they want the reveal NOW.
                        justification = _as_str(ceo_out.get("justification"))
                        user_acted = user_pred is not None or user_force is not None
                        if user_acted:
                            if justification:
                                yield sse("agent.deliberation_token", {
                                    "token": justification, "stream_id": deliberation_id,
                                })
                        else:
                            for chunk in _chunk_for_stream(justification):
                                yield sse("agent.deliberation_token", {
                                    "token": chunk, "stream_id": deliberation_id,
                                })
                                await asyncio.sleep(0.015)

                        yield sse("agent.commit", {
                            "choice_id": chosen_id,
                            "justification": justification,
                            "stream_id": deliberation_id,
                            "artifact_tweet": artifacts.get("tweet") or "",
                        })

                        # ---- EARLY PREFETCH: kick off the next Oracle NOW ----
                        # Was: this lived after consequences.applied. Moving it
                        # before editor/consequences gives the Oracle ~3-5 extra
                        # seconds of head-start, hiding more of the LLM latency
                        # behind the natural reveal animation. By the time the
                        # user sees the tweet artifact + stat ripples, the next
                        # Oracle is usually already done.
                        if (
                            state.turn + 1 <= state.max_turns()
                            and getattr(state, "_next_oracle_task", None) is None
                        ):
                            early_last_ceo = {
                                "choice_id": chosen_id,
                                "justification": justification,
                                "tweet": artifacts.get("tweet") or "",
                            }
                            try:
                                state._next_oracle_task = asyncio.create_task(  # type: ignore[attr-defined]
                                    asyncio.to_thread(
                                        run_oracle,
                                        state=state,
                                        last_ceo_commit=early_last_ceo,
                                    )
                                )
                                def _ignore_exc_early(t: Any) -> None:
                                    try:
                                        _ = t.exception()
                                    except Exception:
                                        pass
                                state._next_oracle_task.add_done_callback(_ignore_exc_early)  # type: ignore[attr-defined]
                            except Exception:
                                state._next_oracle_task = None  # type: ignore[attr-defined]

                        # ---- 4) Editor pass — fire-and-forget ----
                        # The editor's LLM call (~1-2s) used to block before we
                        # applied consequences. Move it to a background task so
                        # the user sees stats ripple immediately after commit.
                        # The `editor.decision` SSE event still fires when the
                        # task completes; the frontend treats it as informational.
                        editor_task = asyncio.create_task(asyncio.to_thread(
                            editor_review,
                            bible=state.bible or {},
                            oracle_output=oracle_out,
                            ceo_output=ceo_out,
                            run_id=state.run_id,
                        ))

                        # ---- 5) Apply consequences ----
                        deltas = oracle_out.get("stats_deltas", {}) or {}
                        if isinstance(deltas, dict):
                            deltas = _clamp_deltas(dict(deltas), state.stats, event_card)
                        state.stats.apply(deltas)  # coerces junk values internally
                        fs = oracle_out.get("foreshadow_updates", {}) or {}
                        if not isinstance(fs, dict):
                            fs = {}
                        win = _window_for(state)
                        seeds_planted = _seed_id_list(fs.get("plant"))
                        seeds_paid = _seed_id_list(fs.get("paid_off"))
                        seeds_paid_lite = _seed_id_list(fs.get("paid_lite"))
                        for sid in seeds_planted:
                            state.tracker.plant(sid, state.turn, window=win)
                        for sid in seeds_paid:
                            state.tracker.pay_off(sid, state.turn, lite=False)
                        for sid in seeds_paid_lite:
                            state.tracker.pay_off(sid, state.turn, lite=True)
                        for sid in _seed_id_list(fs.get("rerolled")):
                            state.tracker.reroll(sid)
                        state.tracker.expire_stale(state.turn)

                        rec = TurnRecord(
                            turn=state.turn,
                            day=state.stats.day,
                            event_id=(event_card.get("source_event_id")
                                      or event_card.get("id")
                                      or f"EVT-{state.turn:03d}"),
                            event_title=event_card.get("title", ""),
                            event_body=event_card.get("body", ""),
                            severity=event_card.get("severity", "S"),
                            category=event_card.get("category", "PRESS"),
                            choices=event_card.get("choices", []),
                            agent_choice_id=ceo_out.get("choice_id"),
                            user_prediction=user_pred,
                            user_force_choice=user_force,
                            reasoning=_as_str(ceo_out.get("reasoning")),
                            justification=justification,
                            artifact_tweet=artifacts.get("tweet") or "",
                            stat_deltas=deltas if isinstance(deltas, dict) else {},
                            seeds_planted=seeds_planted,
                            seeds_paid_off=seeds_paid + seeds_paid_lite,
                        )
                        state.turns.append(rec)
                        if artifacts.get("tweet"):
                            state.add_feed(FeedEntry(
                                id=str(uuid.uuid4()),
                                source="twitter",
                                handle=_founder_handle(state),
                                name=_founder_name(state),
                                body=artifacts["tweet"],
                                timestamp="now",
                            ))
                            # Mirror to SSE so the right rail keeps populating —
                            # without this the founder's tweets never reach the
                            # browser even though they're persisted server-side.
                            yield sse("feed.tweet", {
                                "handle": _founder_handle(state),
                                "display_name": _founder_name(state),
                                "verified": True,
                                "avatar_seed": _founder_handle(state).lstrip("@"),
                                "body": artifacts["tweet"],
                                "reactions": {"likes": 0, "retweets": 0, "quotes": 0},
                                "ts": _ts_now(),
                            })

                        rationale = _as_str(oracle_out.get("stat_rationale")).strip()
                        chips = []
                        if isinstance(deltas, dict):
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
                        yield sse("consequences.applied", {
                            "stat_deltas": deltas,
                            "effects_summary": chips,
                            "stat_rationale": rationale,
                            "seeds_planted": rec.seeds_planted,
                            "seeds_paid_off": rec.seeds_paid_off,
                            "next_event_in_seconds": _gap_for_speed(state.speed),
                        })

                        # NOTE: pre-fetch was moved to fire IMMEDIATELY after
                        # agent.commit (above), giving Oracle ~3-5s of extra
                        # head-start. By the time we get here, the prefetch task
                        # is already running.

                        # ---- 5b) Editor decision (was kicked off after commit) ----
                        try:
                            editor_decision = await editor_task
                            yield sse("editor.decision", editor_decision)
                        except Exception:  # pragma: no cover
                            pass

                        # ---- 5c) Achievement triggers (post-consequences) ----
                        for ach_evt in _emit_achievements(state):
                            yield ach_evt

                        # ---- Persist turn outcome (decision row + state blob) ----
                        # Write-through: append to run_decisions, then mirror the
                        # cached RunState (with new stats / turn / feed) to disk.
                        try:
                            run_store.append_decision(
                                run_id=state.run_id,
                                turn=state.turn,
                                event_id=rec.event_id,
                                agent_choice=rec.agent_choice_id,
                                user_pred=rec.user_prediction,
                                user_commit=rec.user_force_choice,
                                artifact=rec.artifact_tweet,
                            )
                        except Exception:  # pragma: no cover — never block the loop
                            pass
                        persist_run(state.run_id)

                        # ---- 6) Mid-run secret findings (turns 3, 7, 12) ----
                        if state.turn in (3, 7, 12):
                            finding = _maybe_unseal_finding(state)
                            if finding is not None:
                                state.findings.append(finding["finding_id"])
                                for fk in ("headline", "canon_text_short", "canon_text_long"):
                                    finding[fk] = _resolve_slots(
                                        finding.get(fk), slots, state.run_id
                                    )
                                yield sse("finding.unsealed", finding)

                        # ---- 7) Stat-based endgame check after consequences ----
                        if _endgame_triggered_by_stats(state):
                            print(
                                f"[endgame] route=stats_post turn={state.turn} "
                                f"run={state.run_id} stats={state.stats.snapshot()}"
                            )
                            async for chunk in _emit_endgame(state, sse):
                                yield chunk
                            return

                        await asyncio.sleep(_gap_for_speed(state.speed))
                    except asyncio.CancelledError:
                        raise
                    except Exception:
                        fails = getattr(state, "_turn_fail_count", 0) + 1
                        state._turn_fail_count = fails  # type: ignore[attr-defined]
                        print(
                            f"[turn] run={state.run_id} turn={state.turn} "
                            f"crashed (consecutive={fails}/3):"
                        )
                        traceback.print_exc()
                        yield _system_error_sse(
                            "reality glitched — the simulator skips a beat and keeps going"
                        )
                        if fails >= 3:
                            print(
                                f"[turn] run={state.run_id} three consecutive "
                                f"turn crashes — forcing endgame"
                            )
                            async for chunk in _emit_endgame(state, sse):
                                yield chunk
                            return
                        await asyncio.sleep(1.0)
                        continue
                    else:
                        state._turn_fail_count = 0  # type: ignore[attr-defined]

                # ---- Out-of-turns endgame (no stat trigger fired) ----
                print(
                    f"[endgame] route=max_turns turn={state.turn} "
                    f"run={state.run_id} max_turns={state.max_turns()}"
                )
                async for chunk in _emit_endgame(state, sse):
                    yield chunk
            except asyncio.CancelledError:
                pass
            except Exception:  # pragma: no cover
                # Last resort — per-turn isolation above should catch turn
                # crashes first. This path used to swallow the exception
                # silently (no log line, run stuck at status='streaming'
                # forever); now it leaves evidence and a terminal status.
                print(f"[stream] run={state.run_id} turn={state.turn} died:")
                traceback.print_exc()
                state.status = "abandoned"
                try:
                    persist_run(state.run_id)
                except Exception:
                    pass
                yield _system_error_sse(
                    "the simulator coughed and lost the thread — try /run/{id}/start again",
                )

        return StreamingResponse(gen(), media_type="text/event-stream")


# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------


def _run_ceo_sync(state, event_card, tok_q):
    """Bridge the CEO's async streaming into a worker thread.

    `tok_q` is a stdlib threading queue — safe to push to from any thread.
    We push None as a sentinel when the stream completes so the SSE outer
    loop can break cleanly.
    """
    from agents.ceo import stream_ceo  # type: ignore

    loop = asyncio.new_event_loop()

    async def on_token(tok: str) -> None:
        # threading.Queue.put is sync + thread-safe; await is moot here.
        tok_q.put(tok)

    try:
        out = loop.run_until_complete(
            stream_ceo(state=state, event_card=event_card, on_token=on_token)
        )
    finally:
        tok_q.put(None)
        loop.close()
    return out


def _last_ceo_commit_for_oracle(state):
    if not state.turns:
        return None
    t = state.turns[-1]
    return {
        "turn": t.turn,
        "event_id": t.event_id,
        "choice_id": t.agent_choice_id,
        "justification": t.justification,
        "tweet": t.artifact_tweet,
    }



# Relaxed-cap tags: events where big money swings are the point.
_BIG_SWING_TAGS = {
    "fundraising", "term_sheet", "funding_round", "down_round", "acquisition",
    "ipo", "bank_run", "wipeout", "valuation", "capital",
}


def _clamp_deltas(deltas: Dict[str, Any], stats, event_card: Dict[str, Any]) -> Dict[str, int]:
    """Plausibility caps on LLM-authored stat deltas (UX-9: '$1.0B out of
    nowhere'). Proportional to current stats, severity- and tag-aware:
    ordinary events move money stats by tens of percent; only XL or
    fundraising/collapse-tagged events may move them by multiples. Absolute
    floors keep zero-stats movable. reputation/fbi/fraud/day already clamp
    in Stats.apply."""
    if not isinstance(deltas, dict):
        return {}
    sev = (event_card.get("severity") or "S") if isinstance(event_card, dict) else "S"
    tags = set(event_card.get("tags") or []) if isinstance(event_card, dict) else set()
    big = sev == "XL" or bool({t.lower().lstrip("#") for t in tags if isinstance(t, str)} & _BIG_SWING_TAGS)

    def cap(key: str, current: int, lo_mult: float, hi_mult: float,
            lo_big: float, hi_big: float, floor_abs: int) -> None:
        v = deltas.get(key)
        from state import _coerce_delta  # local import; tiny helper
        iv = _coerce_delta(v)
        if iv is None:
            deltas.pop(key, None)
            return
        # Corpus/model convention: tiny magnitudes on money stats are
        # percents, not dollars ("valuation: -40" means -40%, and a -$40
        # delta is meaningless anyway). Scale them before capping.
        if key != "headcount" and 0 < abs(iv) <= 100 and current >= 1000:
            iv = int(current * iv / 100)
        lo_m, hi_m = (lo_big, hi_big) if big else (lo_mult, hi_mult)
        lo = min(int(current * lo_m), -floor_abs)
        hi = max(int(current * hi_m), floor_abs)
        deltas[key] = max(lo, min(hi, iv))

    cap("valuation", stats.valuation, -0.40, 0.40, -0.90, 3.0, 5_000_000)
    cap("cash",      stats.cash,      -0.50, 1.00, -1.00, 10.0, 1_000_000)
    cap("revenue",   stats.revenue,   -0.30, 0.30, -1.00, 2.0, 200_000)
    cap("burn",      stats.burn,      -0.50, 0.50, -1.00, 1.0, 100_000)
    cap("headcount", stats.headcount, -0.50, 0.50, -0.90, 2.0, 5)
    return {k: v for k, v in deltas.items() if isinstance(v, (int, float)) or v is not None}


def _slot_map(state) -> Dict[str, str]:
    """Deterministic slot→value map from the bible (UX-1).

    game/personalization.md specifies a slot resolver; historically the
    Oracle LLM was trusted to substitute [FOUNDER]/[COMPANY]/… itself and
    any forgotten token leaked verbatim into the UI. This map backs the
    server-side resolve pass in _resolve_slots. World-corpus slots that
    need casting decisions ([TIER1_VC_PARTNER] etc.) remain the LLM's job."""
    bible = state.bible or {}
    company = bible.get("company") or {}
    founders = bible.get("founders") or []
    primary = founders[0] if founders and isinstance(founders[0], dict) else {}
    product = bible.get("product") or {}
    out: Dict[str, str] = {}
    founder = primary.get("name")
    if isinstance(founder, str) and founder.strip() and not founder.startswith("["):
        out["FOUNDER"] = founder.strip()
    cname = company.get("display_name") or company.get("name")
    if isinstance(cname, str) and cname.strip() and not cname.startswith("["):
        out["COMPANY"] = cname.strip()
    industry = company.get("industry")
    if isinstance(industry, str) and industry.strip():
        out["INDUSTRY"] = industry.strip()
    noun = product.get("category_noun")
    if isinstance(noun, str) and noun.strip():
        out["PRODUCT_NOUN"] = noun.strip()
    for f in founders[1:2]:
        if isinstance(f, dict) and (f.get("role") or "").upper() == "CTO":
            n = f.get("name")
            if isinstance(n, str) and n.strip() and not n.startswith("["):
                out["CTO"] = n.strip()
    return out


# Fictional cast pools for slots the bible can't answer and the Oracle
# forgot to cast (UX-6: "just make some crap up"). All invented people —
# real names never enter via this path (defamation policy). Keyed by slot
# prefix; picks are seeded per (run, slot) so a cast member stays the same
# person for the whole run (personalization.md determinism rule).
_SLOT_POOLS: Dict[str, List[str]] = {
    "FOUNDER": ["Jordan Vance", "Alex Marsh", "Casey Nolan"],
    "COMPANY": ["the company"],
    "CTO": ["Dev Patel", "Marcus Liang", "Sofia Reyes", "Ethan Brandt"],
    "CFO": ["Gregory Foss", "Anita Kapoor", "Daniel Osei", "Lauren Whitmore"],
    "CRO": ["Trent Malloy", "Jessica Duan"],
    "CHIEF_OF_STAFF": ["Madison Clark", "Oliver Chen", "Grace Adeyemi"],
    "INTERN": ["Kyle", "Ananya", "Jordan the intern", "Tyler", "Maddie"],
    "TIER1_VC_PARTNER": [
        "Blake Harmon of Ridgeline Capital", "Priya Anand of Sequency",
        "Cameron Voss of Apex Growth", "Dana Kim of Northwind Ventures",
    ],
    "VC": ["Blake Harmon of Ridgeline Capital", "Dana Kim of Northwind Ventures"],
    "JOURNALIST": ["Maya Lindqvist", "Tom Okafor", "Rachel Mendes", "Aaron Silber"],
    "REPORTER": ["Maya Lindqvist", "Tom Okafor", "Rachel Mendes"],
    "LAWYER": ["Katherine Boyd of Crawford & Hale", "Sam Delgado", "Victor Nguyen"],
    "PEER_FOUNDER": ["Jonah Reiss", "Emily Tao", "Arjun Mehta", "big mike from the group chat"],
    "PARODY_ACCOUNT": ["@litcapital", "@AnonVCs", "@founderhustleculture", "@VCBrags"],
    "CHORUS": ["@litcapital", "@AnonVCs", "@AGIEnjoyer", "@founderhustleculture"],
    "SUBSTACK_HANDLE": ["@rotineconomy", "@thedilutionreport"],
    "REGULATOR": ["the SEC", "FinCEN", "the FTC"],
    "AUSA": ["AUSA Rachel Kim", "AUSA David Moreno", "AUSA Sarah Bloomfield"],
    "AGENT": ["Special Agent Dana Whitfield", "Special Agent Marcus Cole"],
    "BANK_NAME_DODGY": [
        "Silverline Private Bank", "Banco del Sol (Vanuatu)", "Crestway Trust (Cyprus)",
    ],
    "BANK": ["First Meridian Bank", "Coastal Trust", "Heritage National"],
    "AUDITOR": ["Hollis & Grant", "Whitfield Perry LLP", "Marlowe & Associates"],
    "COMPETITOR": ["Parallax AI", "Vantage Systems", "Kestrel Labs", "NimbusStack"],
    "MODEL_NAME": ["GPT-4o", "Claude", "an open-weights Llama"],
    "PRODUCT_NOUN": ["platform"],
    "COMPARABLE_FRAUD": ["Theranos", "FTX", "Enron"],
    "SENATOR": ["Senator Ted Krug (parody)", "Senator Maria Vale (parody)"],
    "POLITICIAN": ["Governor Rick Stone", "Mayor Douglas Pratt"],
    "BHARARA_PARODY": ["@SDNYenjoyer (parody)"],
    "TECH_ELDER": ["Ray Holloway, 40-year Valley veteran"],
}

_SLOT_TOKEN_RE = re.compile(r"\[([A-Z][A-Z0-9_]{2,})\]")


def _invent_slot_value(token: str, run_id: str) -> str:
    """Deterministic fictional value for an unresolved slot token.

    Longest-prefix match into _SLOT_POOLS (so PEER_FOUNDER_FINTECH hits the
    PEER_FOUNDER pool); seeded by (run_id, token) so the same slot resolves
    to the same invented figure for the entire run. Unknown slots humanize
    to lowercase prose ("[SHADOW_BOARD]" -> "the shadow board") — awkward
    beats a raw bracket on screen."""
    key = token
    while key and key not in _SLOT_POOLS:
        if "_" not in key:
            key = ""
            break
        key = key.rsplit("_", 1)[0]
    if key:
        pool = _SLOT_POOLS[key]
        return random.Random(f"{run_id}:{token}").choice(pool)
    return "the " + token.replace("_", " ").lower()


def _resolve_slots(text: Any, slots: Dict[str, str], run_id: str = "") -> Any:
    """Replace [FOUNDER]-style tokens the Oracle forgot to fill: first from
    the bible map, then (when run_id given) by inventing a deterministic
    fictional stand-in — no bracket token may survive to the screen.
    Non-strings pass through untouched."""
    if not isinstance(text, str) or "[" not in text:
        return text
    for key, val in (slots or {}).items():
        for variant in (key.upper(), key.capitalize(), key.lower()):
            token = f"[{variant}]"
            if token in text:
                text = text.replace(token, val)
    if run_id and "[" in text:
        text = _SLOT_TOKEN_RE.sub(
            lambda m: _invent_slot_value(m.group(1), run_id), text
        )
    return text


def _as_str(x: Any) -> str:
    """Coerce an LLM-authored should-be-string field to a plain string.
    None -> ""; dicts/lists -> compact JSON; everything else -> str()."""
    if isinstance(x, str):
        return x
    if x is None:
        return ""
    try:
        return json.dumps(x)
    except Exception:
        return str(x)


def _seed_id_list(x: Any) -> List[str]:
    """Coerce an LLM-authored foreshadow entry list into plain seed-id strings.

    Tolerates a bare string (one id — NOT iterated per-character), entries
    wrapped in objects ({"seed_id": ..., "why": ...}), a dict keyed by seed
    id, and junk (dropped)."""
    if isinstance(x, str):
        return [x]
    if isinstance(x, dict):
        x = list(x.keys())
    if not isinstance(x, list):
        return []
    out: List[str] = []
    for item in x:
        if isinstance(item, str):
            out.append(item)
        elif isinstance(item, dict):
            sid = item.get("seed_id") or item.get("id") or item.get("seed")
            if isinstance(sid, str):
                out.append(sid)
    return out


def _founder_handle(state) -> str:
    fs = ((state.bible or {}).get("founders") or [{}])
    return (fs[0].get("twitter_handle") if fs else None) or "@founder"


def _founder_name(state) -> str:
    fs = ((state.bible or {}).get("founders") or [{}])
    return (fs[0].get("name") if fs else None) or "Founder"


def _feed_event_kind(reaction: Dict[str, Any]) -> str:
    src = reaction.get("source") or "twitter"
    src = src.lower() if isinstance(src, str) else "twitter"
    return {
        "twitter": "feed.tweet",
        "slack": "feed.slack_leak",
        "glassdoor": "feed.glassdoor",
        "fbi": "feed.headline",
        "techcrunch": "feed.headline",
        "bloomberg": "feed.headline",
        "forbes": "feed.headline",
        "discord": "feed.tweet",
    }.get(src, "feed.tweet")


# Fallback chorus voices for reactions the Oracle emitted without a handle —
# rotating known cast beats "@unknown" popping up in the feed. Keep in sync
# with world/figures/cast.md FIG-CHORUS-*.
_CHORUS_FALLBACK = [
    ("@litcapital", "lit capital"),
    ("@AnonVCs", "Anonymous VC"),
    ("@readthecommit", "read the commit"),
    ("@AccelDaemon", "Accel Daemon (e/acc)"),
    ("@founderhustleculture", "Founder Hustle Culture"),
    ("@AGIEnjoyer", "AGI Enjoyer"),
]


def _feed_payload(reaction: Dict[str, Any]) -> Dict[str, Any]:
    src = reaction.get("source") or "twitter"
    src = src.lower() if isinstance(src, str) else "twitter"
    if src in ("twitter", "discord"):
        handle = reaction.get("handle")
        name = reaction.get("name")
        if not isinstance(handle, str) or not handle.strip():
            # Deterministic per-body pick so retries don't reshuffle voices.
            fh, fn = _CHORUS_FALLBACK[
                len(_as_str(reaction.get("body"))) % len(_CHORUS_FALLBACK)
            ]
            handle = fh
            if not isinstance(name, str) or not name.strip():
                name = fn
        if not isinstance(name, str) or not name.strip():
            name = handle.lstrip("@")
        return {
            "handle": handle,
            "display_name": name,
            "verified": True,
            "avatar_seed": _as_str(handle).lstrip("@"),
            "body": reaction.get("body", ""),
            "reactions": {"likes": 0, "retweets": 0, "quotes": 0},
            "ts": _ts_now(),
        }
    if src == "slack":
        return {
            "channel": reaction.get("channel", "#random"),
            "author": reaction.get("name", "anon"),
            "body": reaction.get("body", ""),
            "reactions": [],
            "ts": _ts_now(),
        }
    if src == "glassdoor":
        return {
            "stars": 1,
            "title": reaction.get("name", "Mid"),
            "body": reaction.get("body", ""),
            "ts": _ts_now(),
        }
    return {
        "publication": reaction.get("publication") or src.title(),
        "headline": reaction.get("body", ""),
        "url_slug": "",
        "ts": _ts_now(),
    }


def _ts_now() -> str:
    return datetime.now(tz=timezone.utc).isoformat()


def _gap_for_speed(speed: str) -> float:
    # Inter-event gap. With Oracle pre-fetch happening during the previous
    # turn's tail, the LLM call latency is already absorbed — this is just
    # a brief visual breath so consequences have time to ripple before the
    # next event card slides in.
    return {"1x": 0.6, "2x": 0.3, "4x": 0.15}.get(speed, 0.6)


def _window_for(state) -> int:
    return {"micro": 2, "short": 3, "medium": 8, "long": 25}.get(state.length_mode(), 8)


def _apply_bible_to_initial_stats(state) -> None:
    company = (state.bible or {}).get("company") or {}
    stage = (company.get("funding_stage") or "seed").lower()
    funding_total = int(company.get("funding_total_usd") or 0)
    presets = {
        "seed":      dict(valuation=14_000_000, cash=8_000_000,  burn=180_000,  headcount=6),
        "series_a":  dict(valuation=80_000_000, cash=20_000_000, burn=600_000,  headcount=22),
        "series_b":  dict(valuation=400_000_000, cash=80_000_000, burn=2_000_000, headcount=80),
        "growth":    dict(valuation=1_500_000_000, cash=200_000_000, burn=8_000_000, headcount=300),
        "ipo":       dict(valuation=4_000_000_000, cash=400_000_000, burn=12_000_000, headcount=600),
        "bootstrapped": dict(valuation=4_000_000, cash=500_000, burn=40_000, headcount=4),
    }
    p = presets.get(stage, presets["seed"])

    def _researched(field: str):
        """Researcher-grounded value: int when the bible carries the field
        (0 = 'couldn't find it' per UX-1 — surfaced as 0, not a fake preset);
        None when the field is absent entirely (pre-UX-1 bibles, templates)."""
        v = company.get(field)
        if v is None:
            return None
        try:
            return max(0, int(v))
        except (TypeError, ValueError):
            return None

    rv = _researched("estimated_valuation_usd")
    rh = _researched("headcount")
    rr = _researched("revenue_annual_usd")
    state.stats.valuation = rv if rv is not None else p["valuation"]
    state.stats.headcount = rh if rh is not None else p["headcount"]
    if rr is not None:
        state.stats.revenue = rr
    state.stats.cash = max(p["cash"], funding_total // 2 if funding_total else p["cash"])
    state.stats.burn = p["burn"]
    state.stats.day = 14
    state.stats.fbi_awareness = 0
    state.stats.fraud_score = 0
    state.stats.reputation = 12


# ---------------------------------------------------------------------------
# template loading + endgame + findings
# ---------------------------------------------------------------------------


def _load_template_bible(template_id: str):
    """Pull the bible YAML out of `world/templates/{id}.md` (under the
    `## Company Bible` heading). Returns (bible_dict, raw_yaml) or (None, None)."""
    import re
    from pathlib import Path

    candidates = [
        Path("/world") / "templates" / f"{template_id}.md",
        Path(__file__).resolve().parent.parent / "world" / "templates" / f"{template_id}.md",
    ]
    text = None
    for p in candidates:
        if p.exists():
            text = p.read_text(encoding="utf-8")
            break
    if not text:
        return None, None
    m = re.search(
        r"##\s*Company Bible\s*.*?```ya?ml\s*\n(.*?)```",
        text, re.DOTALL | re.IGNORECASE,
    )
    if not m:
        return None, None
    raw = m.group(1)
    try:
        import yaml  # type: ignore
        bible = yaml.safe_load(raw)
        if isinstance(bible, dict):
            return bible, raw
    except Exception:
        return None, None
    return None, None


def _system_error_sse(message: str) -> str:
    """In-voice system.error SSE event. Stays in fiction; no '500 Internal' leaks."""
    return (
        "event: system.error\n"
        f"data: {json.dumps({'message': message, 'recoverable': True})}\n\n"
    )


def _ceo_fallback(event_card):
    """Last-ditch CEO output if the agent crashed mid-stream. Keeps the loop alive.

    Must never raise itself — it runs inside an except handler, where a
    second fault (e.g. non-dict choices from a malformed Oracle card) used
    to propagate straight to the stream's outer handler and kill the run."""
    choices = [
        c for c in (event_card.get("choices") or []) if isinstance(c, dict)
    ]
    cid = (choices[0].get("id") if choices else None) or "A"
    return {
        "reasoning": "thinking — going with the obvious play",
        "choice_id": cid,
        "justification": "obvious play",
        "artifacts": {"tweet": "we ship", "slack": None, "board_email": None},
    }


def _chunk_for_stream(text: str):
    """Split a string into word-sized chunks for token-stream pastiche.

    Used to turn the CEO's already-decided justification into a streamy chip
    so the UI's `agent.deliberation_token` channel has motion before commit."""
    if not isinstance(text, str):
        text = _as_str(text)
    if not text:
        return []
    parts = text.split(" ")
    return [p + " " for p in parts if p]


def _endgame_triggered_by_stats(state) -> bool:
    """Hard endgame triggers. Gated by a minimum-turn threshold so a run can
    never terminate before the user has seen at least 3 decisions resolve —
    runs that flame out on turn 1 are unsatisfying as drama and prevent the
    user from trying out the prediction loop.

    Thresholds are tuned to fire within ~6–15 turns in medium mode given
    typical Oracle stat deltas (+5..+15 per bad decision). Earlier tuning
    required fbi_awareness AND fraud_score to BOTH cross 95/85, which in
    practice meant the run never terminated and the loop just cycled through
    ambient phases until max_turns. The new triggers are OR-gated and the
    levels are loosened so most natural runs reach a satisfying endgame.
    """
    MIN_DECISIONS_BEFORE_ENDGAME = 3
    if state.turn < MIN_DECISIONS_BEFORE_ENDGAME:
        return False

    s = state.stats
    # PRISON path — either heat OR fraud being terminal is enough.
    if s.fbi_awareness >= 80:
        return True
    if s.fraud_score >= 85:
        return True
    # BANKRUPTCY / FAILURE paths.
    # Cash is now floored at 0 in Stats.apply, so "out of runway" == cash hits 0.
    if s.cash <= 0:
        return True
    if s.reputation <= -75:
        return True
    # POSITIVE / CULTURAL exit — runaway success terminates the run too.
    if s.valuation >= 5_000_000_000:
        return True
    # Compound collapse — any two pressure signals at moderate levels.
    pressure = sum([
        1 if s.fbi_awareness >= 60 else 0,
        1 if s.fraud_score >= 60 else 0,
        1 if s.reputation <= -50 else 0,
        1 if s.cash <= 0 else 0,
    ])
    if pressure >= 2:
        return True
    return False


def _maybe_unseal_finding(state):
    """Pick a Secret Finding to unseal at a checkpoint turn (3 / 7 / 12).

    Cheap rotation through the corpus so each run shows up to three findings."""
    try:
        from corpus_loader import get_corpus  # type: ignore
        corpus = get_corpus()
    except Exception:
        return None
    findings = list(corpus.secret_findings)
    if not findings:
        return None
    already = set(state.findings)
    pool = [f for f in findings if f.record_id not in already]
    if not pool:
        return None
    pick = pool[state.turn % len(pool)]
    return {
        "finding_id": pick.record_id,
        "headline": f"FILE UNSEALED: {pick.title}",
        "canon_text_short": pick.title,
        "canon_text_long": pick.raw_markdown[:1500],
        "achievement_unlocked": None,
        "stat_deltas": {},
    }


def _pick_endgame(state):
    """Pick an endgame record from the corpus that fits the current stats.

    Coarse selector: which corner of the matrix are we in? The post-mortem
    long read uses the picked record's `raw_markdown` as its structural hint,
    so the Bloomberg/Levine voice has something to anchor to."""
    try:
        from corpus_loader import get_corpus  # type: ignore
        corpus = get_corpus()
    except Exception:
        return ("END-FALLBACK-001",
                "The run ended quietly. The chorus moved on.")
    # Scripted runs chose their destination up front — honor it so the
    # post-mortem matches the story that was actually told.
    script = getattr(state, "script", None)
    if isinstance(script, dict) and script.get("endgame_id"):
        target = script["endgame_id"]
        for eg in corpus.endgames:
            if eg.record_id == target:
                return (eg.record_id, eg.raw_markdown)
    if not corpus.endgames:
        return ("END-FALLBACK-001",
                "The run ended quietly. The chorus moved on.")

    s = state.stats
    if s.fbi_awareness >= 80 and s.fraud_score >= 75:
        category_pref = "PRISON"
    elif s.fbi_awareness >= 50:
        category_pref = "FLED"
    elif s.reputation <= -50:
        category_pref = "CURSED"
    elif s.valuation >= 1_000_000_000:
        category_pref = "FAILED"
    else:
        category_pref = "CULTURAL"

    candidates = [e for e in corpus.endgames if category_pref in e.record_id]
    if not candidates:
        candidates = corpus.endgames
    pick = candidates[0]
    return (pick.record_id, pick.raw_markdown)


async def _emit_endgame(state, sse):
    """Emit `endgame.reached` then stream the post-mortem long read.

    The post-mortem generator is sync (it's an SDK streaming context manager
    under the hood); we drive it on a worker thread and pipe each delta back
    through an asyncio queue so the SSE generator can stay in its event loop.
    """
    from agents.post_mortem import stream_post_mortem  # type: ignore

    endgame_id, endgame_body = _pick_endgame(state)
    state.status = "completed"
    # Persist endgame_id + ended_at + completed status. Both calls are
    # idempotent — end_run() flips the row, persist_run() flushes the latest
    # in-memory snapshot (final stats, achievements, etc.) to the state blob.
    try:
        from state import persist_run as _persist_run  # type: ignore
        import run_store as _run_store  # type: ignore
        _run_store.end_run(state.run_id, endgame_id)
        _persist_run(state.run_id)
    except Exception:  # pragma: no cover
        pass
    company = (state.bible or {}).get("company") or {}
    yield sse("endgame.reached", {
        "endgame_id": endgame_id,
        "title": endgame_id,
        "final_headline": (company.get("display_name", "") + " — closed.").strip(),
        "share_card_url": f"/run/{state.run_id}/card.png",
        "achievements_summary": list(state.achievements),
    })

    # ---- Achievement triggers tied to endgame (END-* + final-scope stats) ----
    # Defensive: never let the engine crash the post-mortem stream.
    try:
        from achievement_engine import evaluate_triggers as _eval_ach  # type: ignore
        from datetime import datetime as _dt, timezone as _tz
        new_unlocks = _eval_ach(state, just_endgame=endgame_id)
        for _rec in new_unlocks:
            if _rec.id not in state.achievements:
                state.achievements.append(_rec.id)
            try:
                from run_store import append_achievement as _append_ach  # type: ignore
                _append_ach(state.run_id, _rec.id)
            except Exception:
                pass
            yield sse("achievement.unlocked", {
                "achievement_id": _rec.id,
                "category": _rec.category,
                "rarity": _rec.rarity,
                "name": _rec.name,
                "description": _rec.description,
                "share_text": _rec.share_text,
                "icon_hint": _rec.icon_hint,
                "unlocked_at": _dt.now(tz=_tz.utc).isoformat(),
            })
    except Exception:
        pass

    q: asyncio.Queue = asyncio.Queue()
    SENTINEL = object()
    loop = asyncio.get_running_loop()

    def producer():
        try:
            for ev in stream_post_mortem(
                run_id=state.run_id,
                run_state=state,
                endgame_id=endgame_id,
                endgame_body=endgame_body,
                share_card_hooks=state.stats.snapshot(),
            ):
                loop.call_soon_threadsafe(q.put_nowait, ev)
        except Exception as e:  # pragma: no cover
            loop.call_soon_threadsafe(q.put_nowait, {
                "type": "system.error", "message": "post-mortem ghosted",
                "_exc": str(e),
            })
        finally:
            loop.call_soon_threadsafe(q.put_nowait, SENTINEL)

    import threading
    threading.Thread(target=producer, daemon=True).start()

    while True:
        ev = await q.get()
        if ev is SENTINEL:
            break
        if ev.get("type") == "post_mortem.delta":
            yield sse("post_mortem.delta", {"text": ev.get("text", "")})
        elif ev.get("type") == "post_mortem.complete":
            yield sse("post_mortem.complete", {
                "markdown": ev.get("markdown", ""),
                "endgame_id": endgame_id,
            })
        elif ev.get("type") == "system.error":
            yield _system_error_sse(ev.get("message", "post-mortem failed"))
