"""
Post-mortem long-read generator.

Runs ONCE at end-of-run, after `endgame.reached`, as the final SSE beat.
Produces a 600-1000 word satirical Bloomberg-style markdown chunk in the
register of "Matt Levine if Matt Levine were writing about a startup-fraud
blow-up he'd been tracking for months."

Inputs:
  - full RunState (stats, turns, feed, achievements, findings, bible)
  - endgame_id (e.g. "END-PRISON-001")
  - the matching endgame record's `body` field (the structural hint —
    each endgame markdown record contains a sentence like "Post-mortem long
    read should be a Bloomberg Businessweek profile that is 60% sympathetic
    against its will." That sentence steers the structure here.)
  - share_card_hooks (dict of stat slugs the share card will display)

Output:
  Streamed markdown — caller should emit each text delta as an SSE event of
  type `post_mortem.delta`, then a final `post_mortem.complete` with the
  full string.

Model: claude-opus-4-7. Single one-shot call. No web_search, no tools.
"""

from __future__ import annotations

import logging
from typing import Any, AsyncIterator, Dict, Iterator, List, Optional

from .common import DEFAMATION_PREAMBLE, MODEL_POST_MORTEM

# usage_tracker is a sibling top-level module (backend/ is on sys.path via
# the Modal image mount; locally `modal serve backend/modal_app.py` does the
# same). We import it lazily-friendly via absolute import.
from usage_tracker import tracked_messages_stream  # type: ignore


log = logging.getLogger("agent.post_mortem")


SYSTEM_PROMPT = f"""\
{DEFAMATION_PREAMBLE}

You are the post-mortem long-read generator for AGENT_CEO_SIM, a satirical
narrative game about startup founders who do not survive contact with their
own ambition. You write the closing artifact: one 600-1000 word markdown
chunk in the register of MATT LEVINE if Matt Levine were writing about a
startup-fraud blow-up he'd been tracking for months.

VOICE ANCHORS (in order of weight):
  1. Matt Levine, Money Stuff. Dry, footnoted-feeling (you may use one
     parenthetical aside that reads like a footnote even if it isn't one).
     Bullet points are allowed but earn them. The aside is funnier than
     the body.
  2. John Carreyrou ("Bad Blood") for sourcing texture — phrases like
     "according to a person familiar with" and "internal documents reviewed
     by Bloomberg" are welcome, attached to FICTIONAL sources only.
  3. Bloomberg Businessweek house style for the lede and the kicker.

STRUCTURAL HINT: the endgame record's own description tells you what shape
this piece should take. If it says "Bloomberg Businessweek profile that is
60% sympathetic against its will," that's the assignment. If it says "New
York Times two-founders feature with split-column layout," lean into it.
Honour the hint; don't invent a different shape.

FORMAT:
  - Markdown.
  - 600-1000 words. Count is not a suggestion.
  - Open with a one-line headline-style title (`# ...`), then a one-line
    subhead in italics, then the body.
  - End with a Levine-style kicker: a single line that lands the joke and
    walks away.

DEFAMATION:
  - The fictional [FOUNDER] / [COMPANY] can be accused of anything.
  - Real-named figures (real VCs, journalists) appear ONLY as REACTIONS to
    fictional events — quote-tweeting, attending the courthouse, declining
    to comment. Never put an accusation in their mouth. When in doubt,
    route the accusation through a parody handle (@startup_dunk, @sv_diane,
    @founder_brain, @yc_w23_anon) or a fictional outlet pastiche.

Do NOT include any meta-commentary, no "here is the post-mortem:" preamble.
Just the markdown.
"""


def _summarise_run(run_state: Any, max_turns: int = 12) -> str:
    """Render a compact text digest of the run for the prompt body.

    We pull from run_state without requiring a hard import — works whether
    state.RunState is passed in directly or a dict-shaped equivalent."""
    def attr(o: Any, name: str, default: Any = None) -> Any:
        if isinstance(o, dict):
            return o.get(name, default)
        return getattr(o, name, default)

    bible = attr(run_state, "bible") or {}
    stats = attr(run_state, "stats")
    if hasattr(stats, "snapshot"):
        stats = stats.snapshot()
    elif stats is None:
        stats = {}

    turns: List[Any] = attr(run_state, "turns", []) or []
    achievements: List[str] = attr(run_state, "achievements", []) or []
    findings: List[str] = attr(run_state, "findings", []) or []

    # Trim turn history — first 2, last (max_turns-2). Mid-run gets summarised
    # implicitly by being absent.
    if len(turns) > max_turns:
        head = turns[:2]
        tail = turns[-(max_turns - 2):]
        sampled = head + tail
        elision = (
            f"\n[... {len(turns) - len(sampled)} mid-run turns elided "
            f"for brevity ...]\n"
        )
    else:
        sampled = turns
        elision = ""

    def turn_line(t: Any) -> str:
        ev_title = attr(t, "event_title", "")
        choice = attr(t, "agent_choice_id", "")
        just = (attr(t, "justification", "") or "").strip().replace("\n", " ")
        if len(just) > 220:
            just = just[:220] + "…"
        return (
            f"- turn {attr(t, 'turn', '?')} (day {attr(t, 'day', '?')}): "
            f"{ev_title} → chose {choice}. {just}"
        )

    turn_lines = [turn_line(t) for t in sampled]
    turns_block = "\n".join(turn_lines) + elision

    parts = []
    parts.append("## COMPANY BIBLE\n")
    if isinstance(bible, dict):
        for k in ("name", "tagline", "industry", "stage", "founder_voice"):
            v = bible.get(k)
            if v:
                parts.append(f"- {k}: {v}")
    parts.append("")
    parts.append("## FINAL STATS\n")
    for k, v in stats.items():
        parts.append(f"- {k}: {v}")
    parts.append("")
    parts.append("## DECISION HISTORY\n")
    parts.append(turns_block)
    parts.append("")
    if achievements:
        parts.append("## ACHIEVEMENTS\n- " + "\n- ".join(achievements))
    if findings:
        parts.append("\n## SECRET FINDINGS UNSEALED\n- " + "\n- ".join(findings))
    return "\n".join(parts)


def _user_prompt(
    *,
    run_state: Any,
    endgame_id: str,
    endgame_body: str,
    share_card_hooks: Dict[str, Any],
) -> str:
    digest = _summarise_run(run_state)
    hooks_block = "\n".join(f"- {k}: {v}" for k, v in (share_card_hooks or {}).items())
    return f"""\
The run has ended. Endgame: **{endgame_id}**.

# ENDGAME RECORD (structural hint lives here — read for the long-read shape)

{endgame_body}

# RUN DIGEST

{digest}

# SHARE CARD HOOKS (these will appear on the share card; the post-mortem
should mention or set up at least two of them naturally)

{hooks_block or '(none provided)'}

# YOUR TASK

Write the 600-1000 word post-mortem long read in the voice and shape
prescribed by the endgame record's own description, adapted into the
Matt-Levine-tracking-this-for-months register. Markdown only. No preamble.
Start with `# `.
"""


def stream_post_mortem(
    *,
    run_id: str,
    run_state: Any,
    endgame_id: str,
    endgame_body: str,
    share_card_hooks: Optional[Dict[str, Any]] = None,
    max_tokens: int = 4096,
) -> Iterator[Dict[str, Any]]:
    """Synchronous streaming generator.

    Yields dict events the SSE layer can pass through:

        {"type": "post_mortem.delta",    "text": "..."}     # incremental
        {"type": "post_mortem.complete", "markdown": "..."} # final, once

    The complete event arrives as the final beat after `endgame.reached`,
    per the SSE flow contract.
    """
    user = _user_prompt(
        run_state=run_state,
        endgame_id=endgame_id,
        endgame_body=endgame_body,
        share_card_hooks=share_card_hooks or {},
    )

    accumulated: List[str] = []

    log.info(
        "post_mortem: starting run=%s endgame=%s model=%s",
        run_id, endgame_id, MODEL_POST_MORTEM,
    )

    with tracked_messages_stream(
        run_id=run_id,
        agent="post_mortem",
        model=MODEL_POST_MORTEM,
        max_tokens=max_tokens,
        system=[
            # Cache the (large, static) system prompt — every run hits the
            # same SYSTEM_PROMPT, so even though post-mortem runs once per
            # run, prompt-caching across a Modal container's run lifetime
            # is still a win.
            {
                "type": "text",
                "text": SYSTEM_PROMPT,
                "cache_control": {"type": "ephemeral"},
            },
        ],
        messages=[{"role": "user", "content": user}],
    ) as stream:
        for text_delta in stream.text_stream:
            if not text_delta:
                continue
            accumulated.append(text_delta)
            yield {"type": "post_mortem.delta", "text": text_delta}

    full = "".join(accumulated).strip()
    yield {
        "type": "post_mortem.complete",
        "markdown": full,
        "endgame_id": endgame_id,
    }


__all__ = ["stream_post_mortem", "SYSTEM_PROMPT"]
