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
import queue as thread_queue
import uuid
from datetime import datetime, timezone
from typing import Any, AsyncGenerator, Dict, Optional


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
                state.status = "streaming"
                yield sse("stream.open", {
                    "version": "1.0.0",
                    "first_turn_in_seconds": 0.5,
                })
                return

            # ---- live research path ------------------------------------
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
                    state.status = "streaming"
                    await queue.put(("stream.open", {
                        "version": "1.0.0",
                        "first_turn_in_seconds": 2,
                    }))
                except Exception as e:  # pragma: no cover
                    # In-voice error (no "Internal Server Error" leaks). The
                    # frontend renders this as a fake event in the agent stream.
                    await queue.put(("system.error", {
                        "message": "researcher couldn't dig anything up — going dark",
                        "recoverable": True,
                        "_exc": str(e),
                    }))
                finally:
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
                if not task.done():
                    task.cancel()

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
                        import traceback
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
                    for atm in oracle_out.get("atmospheric") or []:
                        yield sse("turn.mini", {
                            "kind": atm.get("kind", "atmospheric"),
                            "headline": atm.get("headline", ""),
                            "stat_deltas": atm.get("stat_deltas", {}),
                        })
                    for r in oracle_out.get("reactions") or []:
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
                        import traceback
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
                        "full_text": ceo_out.get("reasoning", ""),
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
                    artifacts = ceo_out.get("artifacts", {}) or {}

                    # Drip the justification text as deliberation tokens for
                    # the chip-stream UI before the final commit. Cheap visual
                    # cadence — no extra LLM call.
                    #
                    # Fast-forward: if the user predicted (or force-chose), we
                    # skip the drip and emit the full justification in one
                    # chunk, then commit immediately. The user already saw the
                    # CEO's hidden reasoning during deliberating; once they've
                    # picked, they want the reveal NOW.
                    justification = ceo_out.get("justification", "") or ""
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
                        "artifact_tweet": artifacts.get("tweet", ""),
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
                            "tweet": artifacts.get("tweet", ""),
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
                    state.stats.apply(deltas)
                    fs = oracle_out.get("foreshadow_updates", {}) or {}
                    win = _window_for(state)
                    for sid in fs.get("plant", []) or []:
                        state.tracker.plant(sid, state.turn, window=win)
                    for sid in fs.get("paid_off", []) or []:
                        state.tracker.pay_off(sid, state.turn, lite=False)
                    for sid in fs.get("paid_lite", []) or []:
                        state.tracker.pay_off(sid, state.turn, lite=True)
                    for sid in fs.get("rerolled", []) or []:
                        state.tracker.reroll(sid)
                    state.tracker.expire_stale(state.turn)

                    rec = TurnRecord(
                        turn=state.turn,
                        day=state.stats.day,
                        event_id=event_card.get("id", f"EVT-{state.turn:03d}"),
                        event_title=event_card.get("title", ""),
                        event_body=event_card.get("body", ""),
                        severity=event_card.get("severity", "S"),
                        category=event_card.get("category", "PRESS"),
                        choices=event_card.get("choices", []),
                        agent_choice_id=ceo_out.get("choice_id"),
                        user_prediction=user_pred,
                        user_force_choice=user_force,
                        reasoning=ceo_out.get("reasoning", ""),
                        justification=ceo_out.get("justification", ""),
                        artifact_tweet=artifacts.get("tweet", ""),
                        stat_deltas=deltas,
                        seeds_planted=list(fs.get("plant", []) or []),
                        seeds_paid_off=list((fs.get("paid_off") or []) + (fs.get("paid_lite") or [])),
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

                    yield sse("consequences.applied", {
                        "stat_deltas": deltas,
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


def _founder_handle(state) -> str:
    fs = ((state.bible or {}).get("founders") or [{}])
    return (fs[0].get("twitter_handle") if fs else None) or "@founder"


def _founder_name(state) -> str:
    fs = ((state.bible or {}).get("founders") or [{}])
    return (fs[0].get("name") if fs else None) or "Founder"


def _feed_event_kind(reaction: Dict[str, Any]) -> str:
    src = (reaction.get("source") or "twitter").lower()
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


def _feed_payload(reaction: Dict[str, Any]) -> Dict[str, Any]:
    src = (reaction.get("source") or "twitter").lower()
    if src in ("twitter", "discord"):
        return {
            "handle": reaction.get("handle", "@unknown"),
            "display_name": reaction.get("name", "Unknown"),
            "verified": True,
            "avatar_seed": (reaction.get("handle") or "x").lstrip("@"),
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
    state.stats.valuation = p["valuation"]
    state.stats.cash = max(p["cash"], funding_total // 2 if funding_total else p["cash"])
    state.stats.burn = p["burn"]
    state.stats.headcount = p["headcount"]
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
    """Last-ditch CEO output if the agent crashed mid-stream. Keeps the loop alive."""
    choices = event_card.get("choices") or [{"id": "A"}]
    return {
        "reasoning": "thinking — going with the obvious play",
        "choice_id": choices[0].get("id", "A"),
        "justification": "obvious play",
        "artifacts": {"tweet": "we ship", "slack": None, "board_email": None},
    }


def _chunk_for_stream(text: str):
    """Split a string into word-sized chunks for token-stream pastiche.

    Used to turn the CEO's already-decided justification into a streamy chip
    so the UI's `agent.deliberation_token` channel has motion before commit."""
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
