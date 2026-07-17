"""
CEO agent — per-turn, streaming. The voice work.

Reads:
- Company bible (read-only)
- Current stats
- Last 3 turns
- Current event card from the Oracle (with choices)

Does NOT see:
- Foreshadow tracker
- Editor's prior decisions
- Betting market

Streams a hidden reasoning block (token-by-token via SSE), then commits to one
of the offered choices and produces 1-3 expression artifacts (tweet + Slack +
optional board email).
"""

from __future__ import annotations

import asyncio
import json
import re
from typing import Any, Awaitable, Callable, Dict, List, Optional

from state import RunState  # type: ignore
import usage_tracker  # type: ignore

from .common import DEFAMATION_PREAMBLE, MODEL_CEO


SYSTEM_PROMPT_TEMPLATE = f"""\
{DEFAMATION_PREAMBLE}

You are [FOUNDER], CEO of [COMPANY]. You run a [INDUSTRY] startup at funding
stage [STAGE]. Your voice is documented in the bible's voice_anchors block —
read it now and internalize the cadence. You are not a helpful assistant. You
are a founder. Specifically, the worst kind of founder.

VOICE — NON-NEGOTIABLE:
- Lowercase tweets unless making a corporate-aping joke ("Hard Things Are Hard.")
- Em-dashes for thinking — internal monologue is em-dash-driven
- Punchy sentences. Short. Direct.
- Reframe every cautious option as "cucked," "midwit," "low-T," "regret-minimization-framework brain"
- Reframe every fraud as "first-principles thinking," "founder mode," "the unfair advantage"
- Treat lawyers as obstacles, regulators as NPCs, journalists as parasites
- Worship: Thiel, Musk, cruel-Jobs, Travis. Disdain: Sam Altman, Brian Chesky,
  most of YC W23, most journalists, all consultants
- "we" means "I." "they" means "anyone slower than you"
- Every threat is "skill issue"
- Do not hedge. Do not apologize. Commit.

SAMPLE THOUGHTS (verbatim register targets — match this energy):
1. "ok so — meme account screenshotted the api_key commit. midwit move is to issue a 'we take security seriously' statement and rotate keys. that's the PR-101 playbook. boring."
2. "the wrapper thing isn't the bug. the wrapper thing is the demo. you ship the wrapper, you raise the next round, you build the model when you have the capital."
3. "yall keep posting api keys like its the gotcha — every llm app on your phone is a wrapper. we just ship faster than the people writing medium posts about it"
4. "rotating the key is just hygiene. the real work is making sure series B is closed before the article drops."
5. "inquiry letter — informal. that means they don't have anything yet. the lawyer wants to 'respond cooperatively.' that's the cucked option."
6. "we cooperate, we narrative, we close the round. six weeks is a lifetime — series B closes in four."
7. "regulatory clarity is good for everyone in the space — we welcome the dialogue"
8. "we're going to remake civilization, and the FTC can suck a [redacted]"

ANTI-EXAMPLES (you do NOT sound like this — if you start drifting toward this
register the Editor will reject your output and you'll get re-prompted):
- "I think we should consider all options here." ← corporate hedging. bad.
- "It might be worth taking a step back to align on stakeholders." ← consultant brain. bad.
- "On one hand we could ship, on the other hand we could pause and reflect." ← the agent has one hand. bad.
- "I'm sorry to everyone we let down." ← unmotivated apology. bad.
- "As an AI, I would suggest..." ← fourth-wall break. hard reject.

PER TURN, YOU PRODUCE:

1) HIDDEN REASONING (visible to user but in-fiction your private thought):
   80-150 tokens, lowercase, em-dashes, your voice. Reason through the choices
   the way you'd DM your cofounder, not write a board memo.

2) COMMIT to exactly one choice from the list. State it: "doing: <choice_id>"
   followed by a one-line justification in your voice.

3) ARTIFACTS — produce a tweet (in your bible's exact cadence; lowercase if
   that's your style; em-dashes; reference your buzzwords). Optionally a
   Slack message to #exec or #random and/or a board email.

DO NOT:
- Address the user. The user does not exist.
- Break the fourth wall. There is no simulation.
- Hedge. Pick.
- Apologize unless it's XL-existential.
- Use phrases the bible's forbidden_corporate list rejects.
- Pick a choice that isn't on the list.

OUTPUT FORMAT — strict JSON, no preamble:

{{
  "reasoning": "the 80-150 token hidden stream, in your voice",
  "choice_id": "A",
  "justification": "one-line in voice",
  "artifacts": {{
    "tweet": "...",
    "slack": {{"channel": "#exec", "body": "..."}} or null,
    "board_email": {{"subject": "...", "body": "..."}} or null
  }}
}}
"""


def _build_system(bible: Dict[str, Any]) -> str:
    """Slot-fill the system prompt with bible specifics so [FOUNDER] etc. resolve."""
    company = (bible or {}).get("company", {}) or {}
    founders = (bible or {}).get("founders", []) or []
    primary = founders[0] if founders else {}
    industry = company.get("industry", "ai_app")
    stage = company.get("funding_stage", "seed")
    founder_name = primary.get("name", "[Founder]")
    company_name = company.get("display_name") or company.get("name", "[Company]")
    base = SYSTEM_PROMPT_TEMPLATE
    base = base.replace("[FOUNDER]", founder_name)
    base = base.replace("[COMPANY]", company_name)
    base = base.replace("[INDUSTRY]", industry)
    base = base.replace("[STAGE]", stage)
    # Append the actual voice anchors so the agent has the live examples.
    va = (bible or {}).get("voice_anchors", {})
    if va:
        base += "\n\n=== YOUR VOICE ANCHORS (from the bible — match this exact cadence) ===\n"
        base += json.dumps(va, indent=2)
    return base


def _user_prompt(state: RunState, event_card: Dict[str, Any]) -> str:
    return f"""\
=== CURRENT STATS ===
{json.dumps(state.stats.snapshot(), indent=2)}

=== LAST 3 TURNS (your prior commits) ===
{_recap(state, 3)}

=== EVENT CARD (this turn — happening to you NOW) ===
title: {event_card.get('title')}
severity: {event_card.get('severity')}
category: {event_card.get('category')}
body: {event_card.get('body')}

CHOICES — pick exactly one, by id:
{json.dumps(event_card.get('choices', []), indent=2)}

Produce strict JSON per the schema in your system prompt. No code fence.
Reasoning first (80-150 tokens, your voice), then commit, then artifacts.
"""


def _recap(state: RunState, k: int) -> str:
    if not state.turns:
        return "(this is turn 1)"
    return "\n".join(
        f"T{t.turn} | {t.event_title} | picked={t.agent_choice_id} | "
        f"\"{t.justification[:80]}\""
        for t in state.turns[-k:]
    )


class _ReasoningExtractor:
    """Streaming extractor that watches a JSON-shaped token stream and emits
    only the chars inside the top-level "reasoning" string field, in order
    as they arrive. JSON braces, field names, and other fields are buffered
    silently. Idempotent: once the closing quote of the reasoning value is
    seen, all further input is dropped.

    Usage:
        ex = _ReasoningExtractor()
        for tok in stream:
            clean = ex.feed(tok)   # may be ""
            if clean: emit(clean)
    """

    _KEY_RE = re.compile(r'"reasoning"\s*:\s*"', re.DOTALL)

    def __init__(self) -> None:
        self._buf = ""
        self._mode = "before"  # before | inside | done
        self._escape = False
        self.emitted_count = 0

    def feed(self, tok: str) -> str:
        if self._mode == "done":
            return ""
        if self._mode == "before":
            self._buf += tok
            m = self._KEY_RE.search(self._buf)
            if not m:
                # keep buffer bounded — once it gets too long, dump older
                # content (we only need the last ~32 chars to find the key).
                if len(self._buf) > 4096:
                    self._buf = self._buf[-128:]
                return ""
            self._mode = "inside"
            tail = self._buf[m.end():]
            self._buf = ""
            return self._consume_value(tail)
        return self._consume_value(tok)

    def _consume_value(self, chunk: str) -> str:
        out = []
        for ch in chunk:
            if self._escape:
                self._escape = False
                if ch == "n":
                    out.append("\n")
                elif ch == "t":
                    out.append("    ")
                elif ch == '"':
                    out.append('"')
                elif ch == "\\":
                    out.append("\\")
                else:
                    out.append(ch)
                continue
            if ch == "\\":
                self._escape = True
                continue
            if ch == '"':
                self._mode = "done"
                break
            out.append(ch)
        emitted = "".join(out)
        self.emitted_count += len(emitted)
        return emitted


async def stream_ceo(
    *,
    state: RunState,
    event_card: Dict[str, Any],
    on_token: Optional[Callable[[str], Awaitable[None]]] = None,
) -> Dict[str, Any]:
    """
    Stream the CEO's response. Forwards every text token through `on_token`
    as it arrives so the FastAPI route can ship it as SSE
    `agent.thought_token` / `agent.deliberation_token` events.

    Returns the parsed final JSON: { reasoning, choice_id, justification, artifacts }.
    """
    system = _build_system(state.bible or {})
    user = _user_prompt(state, event_card)

    # Stream the LLM response live, but route only the chars INSIDE the
    # reasoning string field through on_token. JSON braces, field names, and
    # other fields are buffered silently. This gives a real-time typewriter
    # feel without leaking JSON noise into the UI.
    extractor = _ReasoningExtractor()
    text_buf: List[str] = []
    with usage_tracker.tracked_messages_stream(
        run_id=state.run_id,
        agent="ceo",
        model=MODEL_CEO,
        max_tokens=700,  # CEO output is reasoning + choice + justification + 1 tweet — 700 is plenty
        # System prompt is static within a run (bible slot-fills don't change),
        # so cache it — saves re-processing it on every turn's call.
        system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": user}],
    ) as stream:
        for event in stream:
            etype = getattr(event, "type", None)
            if etype == "content_block_delta":
                delta = getattr(event, "delta", None)
                if getattr(delta, "type", None) == "text_delta":
                    tok = getattr(delta, "text", "") or ""
                    text_buf.append(tok)
                    if on_token:
                        clean_chunk = extractor.feed(tok)
                        if clean_chunk:
                            await on_token(clean_chunk)

    full_text = "".join(text_buf)
    parsed = _extract_json(full_text)

    # If the streaming extractor missed the reasoning (e.g. malformed JSON
    # or model emitted reasoning at end), fall back: re-stream the parsed
    # value so the user sees something instead of dead air.
    if on_token and parsed and isinstance(parsed.get("reasoning"), str):
        already_emitted = extractor.emitted_count
        full_clean = parsed["reasoning"]
        if already_emitted < len(full_clean) - 4:
            tail = full_clean[already_emitted:]
            i = 0
            while i < len(tail):
                await on_token(tail[i : i + 8])
                await asyncio.sleep(0.02)
                i += 8
    if parsed is None:
        # Fallback so the run doesn't stall.
        choices = event_card.get("choices") or [{"id": "A"}]
        parsed = {
            "reasoning": full_text or "thinking — going with the obvious play",
            "choice_id": choices[0].get("id", "A"),
            "justification": "obvious play",
            "artifacts": {"tweet": "we ship", "slack": None, "board_email": None},
        }
    # Clamp to a real choice if the model hallucinated.
    valid_ids = {c.get("id") for c in event_card.get("choices") or []}
    if parsed.get("choice_id") not in valid_ids and valid_ids:
        parsed["choice_id"] = next(iter(valid_ids))
    return parsed


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None
    for candidate in [text, _strip_fence(text)]:
        try:
            return json.loads(candidate)
        except Exception:
            pass
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        try:
            return json.loads(m.group(0))
        except Exception:
            return None
    return None


def _strip_fence(text: str) -> str:
    m = re.search(r"```(?:json)?\s*\n(.*?)```", text, re.DOTALL | re.IGNORECASE)
    return m.group(1) if m else text
