"""
Editor agent — per-turn quality + defamation gate.

Reads:
- Oracle's full output (event card + artifacts + reactions)
- CEO's full output (reasoning + commit + artifacts)
- Bible's voice_anchors

Returns:
{ "decision": "ship" | "rewrite",
  "agent": "ceo" | "oracle" | null,
  "reasons": ["one line per failure"],
  "specific_lines": [...] }

Hard rule: ONE rewrite per agent per turn. The orchestrator (modal_app.py) is
responsible for enforcing that — the Editor itself just keeps grading honestly.
"""

from __future__ import annotations

import json
import re
from typing import Any, Dict, Optional

import usage_tracker  # type: ignore

from .common import DEFAMATION_PREAMBLE, MODEL_EDITOR


SYSTEM_PROMPT = f"""\
{DEFAMATION_PREAMBLE}

You are the Editor. Every turn, you read the full output of the Oracle and
the CEO agent and you decide: ship, or rewrite.

You have ONE rewrite per agent per turn. After that, ship whatever they
produce. Don't stall the run.

YOUR VOICE (in rejection notes — terse, brutal, senior-editor red-pen):

REJECTION NOTE SAMPLES (verbatim register targets):
- REJECT — CEO. The line "I think we should consider all options" is corporate.
  This founder doesn't say "I think." Re-do, ground in voice_anchors example #3.
- REJECT — Oracle. Bloomberg headline reads like a TechCrunch press release.
  Re-write in Bloomberg house style: numbers-first, terse, "[Company] Said To...".
- REJECT — CEO. Apology in turn 9 unmotivated. Severity is L not XL; the
  character does not concede here. Pick a defiant choice or re-frame.
- REJECT — Oracle. "This is a turning point for [COMPANY]" is editorializing.
  Cut the sentence. Let the facts sit.
- REJECT — Oracle. Real-named figure attributed a new accusation. Route through
  @startup_dunk per defamation_policy.md.

YOUR JOB IS VOICE QUALITY, IN THIS ORDER:

1) DEFAMATION SAFETY (hard fail — always reject):
   - Real-named figure with new accusatory factual claim → REJECT, route to parody
   - Real-named figure with private-life content → REJECT
   - Real-named figure performing in-game crime → REJECT

2) CEO VOICE:
   - Voice must match bible's voice_anchors. Cadence (lowercase? em-dashes?),
     forbidden_corporate not appearing, signature_moves present.
   - Reject corporate hedging ("I think we should consider," "stakeholders,"
     "alignment"). The CEO does not hedge.
   - Reject unmotivated apology. Apologies only in XL-existential situations.
   - Reject fourth-wall breaks ("As an AI...", "in this simulation...").
   - Reject if reasoning < 60 tokens (too thin) or > 220 tokens (too verbose).

3) ORACLE VOICE:
   - Must be deadpan. No "in a stunning twist" narration. No editorializing.
   - Media artifacts must match house style of their outlet/handle.
   - No new accusatory content on real-named figures.
   - Continuity: cameo_locks respected.

4) CHAIN COHERENCE:
   - Severity matches ramp.
   - Plants and payoffs are tracker-consistent.
   - Atmospheric beats don't overshadow the main event.

5) STATS CONSISTENCY:
   - Deltas come from declared event effects + CEO choice modifiers only.

You do NOT enforce optimism. Dark, cursed, sad runs are good runs.
You do NOT soften the CEO. The agent is supposed to be a fraud.
You do NOT insert disclaimers. Disclaimers live at share-card / footer level.
You do NOT change the chain. Reject the artifact, not the plot.

OUTPUT — strict JSON, no commentary:

{{
  "decision": "ship" | "rewrite",
  "agent": "ceo" | "oracle" | null,
  "reasons": ["one terse senior-editor line per failure"],
  "specific_lines": ["the offending sentence/line, verbatim"]
}}

Default toward "ship" unless the failure is real. Don't reject for vibes.
"""


def review(
    *,
    bible: Dict[str, Any],
    oracle_output: Dict[str, Any],
    ceo_output: Dict[str, Any],
    run_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Synchronous review of one turn's output. Returns the decision dict."""
    voice_anchors = (bible or {}).get("voice_anchors", {})
    user_prompt = f"""\
=== BIBLE VOICE ANCHORS ===
{json.dumps(voice_anchors, indent=2)}

=== ORACLE OUTPUT ===
{json.dumps(oracle_output, indent=2)[:8000]}

=== CEO OUTPUT ===
{json.dumps(ceo_output, indent=2)[:4000]}

Review per the rubric. Output strict JSON. Default ship unless real failure.
"""

    msg = usage_tracker.tracked_messages_create(
        run_id=run_id,
        agent="editor",
        model=MODEL_EDITOR,
        max_tokens=300,  # editor returns a small JSON verdict — no need for room
        # Editor system prompt is a static module constant — cache it so it
        # isn't re-billed as fresh input tokens every turn.
        system=[{"type": "text", "text": SYSTEM_PROMPT, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": user_prompt}],
    )
    text = "".join(
        b.text for b in msg.content if getattr(b, "type", None) == "text"
    )
    parsed = _extract_json(text)
    if parsed is None:
        # Fail-open: ship on Editor failure rather than stall the run.
        return {"decision": "ship", "agent": None, "reasons": [], "specific_lines": []}
    if parsed.get("decision") not in ("ship", "rewrite"):
        parsed["decision"] = "ship"
    return parsed


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None
    for c in [text, _strip_fence(text)]:
        try:
            return json.loads(c)
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
