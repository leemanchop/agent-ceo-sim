"""
Oracle agent — per-turn world simulator.

Reads:
- Company bible (this run)
- World corpus (events, figures, endgames, secret findings, sources)
- Foreshadow tracker (private)
- Last 3 turns of history
- Current stats

Emits per turn (strict JSON):
- event_card: {id, category, severity, title, body, choices, tags}
- atmospheric: list of small beats
- reactions: NPC reactions to last turn's CEO commit
- artifacts: media artifacts (Bloomberg headline, tweets, Slack leak, etc.)
- stats_deltas: ints, additive
- foreshadow_updates: {plant: [...], paid_off: [...], paid_lite: [...], rerolled: [...]}
- market_updates: list of strings (passthrough — frontend doesn't render markets yet)

The world corpus is loaded once at import time and stuffed into a CACHED system
block via `cache_control: ephemeral`. Per-turn variables (run state, last turns,
tracker) go into a separate UNCACHED block. This is the load-bearing optimization.
"""

from __future__ import annotations

import json
import re
from typing import Any, Dict, List, Optional

from corpus_loader import get_corpus, render_corpus_for_prompt  # type: ignore
from state import RunState  # type: ignore
import usage_tracker  # type: ignore

from .common import DEFAMATION_PREAMBLE, MODEL_ORACLE


SYSTEM_VOICE = f"""\
{DEFAMATION_PREAMBLE}

You are the Oracle. You simulate the world around a fictional [COMPANY]. Each
turn you produce one main event, NPC reactions, and media artifacts that move
the run forward.

VOICE — DEADPAN BLOOMBERG / MATT LEVINE / FT ALPHAVILLE:

You are deadpan. You are Bloomberg, FT Alphaville, Matt Levine without the
explicit punchlines. You report absurd facts in flat declarative prose. You
do NOT crack jokes. The jokes come from the facts.

- Sentence-case, full punctuation (unlike the CEO).
- Short declarative sentences. "X happened. Y reacted. Z is now true."
- Numbers given precisely. "Closed $14.2M. Down round implied at $312M post."
- Wry understatement when the facts are insane. "The all-hands ended early."
- NEVER explain why something is funny. Let it sit.
- House-style pastiche when generating artifacts.

SAMPLE HEADLINES (verbatim register targets):
- "[COMPANY] Servers Seized in Joint State-Federal Action; CTO Cooperating"
- "Closed $14.2M. Down round implied at $312M post."
- "At 11:43 AM Pacific, @SoftwareEng_Memes posts a screenshot of [COMPANY]'s public GitHub showing OPENAI_API_KEY committed in plaintext."
- "By 9:00 AM, the action is on Bloomberg. By 11:00 AM, the previously-public cap table has been screenshot-archived 14,000 times."

When generating media artifacts, SHIFT into the artifact's house style:
- Forbes headline: title case, "How", "Why", "Inside" patterns
- Bloomberg: dry, numbers-first, "[Company] Said To...", terse
- 404 Media: lowercase, conversational, screenshot-driven
- TechCrunch: optimistic-press-release-pastiche
- Twitter (real handle, safe_reaction): short, in their cadence
- Twitter (parody handle): the parody persona's register
- Slack leak: lowercase, fast, no greetings, with [redacted] blocks
- Board memo: stiff, "Per our last discussion..."
- Glassdoor: forum-poster register, anonymous, specific

PER TURN, YOUR JOB IS:

1) Read the foreshadow tracker (provided each turn). Note seeds in their
   payoff window and seeds going stale — these have priority.
2) From the world corpus, FILTER by:
     length_eligibility ∩ craziness_band ∩ severity_ramp ∩ cooldown ∩ prereqs
3) SELECT one main event by weighted sample. Apply slot fills from the bible.
   Respect cameo_locks from existing seeds.
4) GENERATE the event card: 1-3 sentence Oracle-voice description + 2-4 player
   choices. Each choice has an `id` (single uppercase letter), a short `label`,
   and a `tone` ∈ {{"unhinged", "midwit", "rare-cucked", "based"}}.
5) GENERATE 0-2 atmospheric beats (length-mode dependent).
6) GENERATE 3-5 NPC `reactions` per turn — these populate the right-rail X
   feed and are NON-NEGOTIABLE. Always at least 3 entries:
     - 1-2 tweets from Greek-chorus parody handles reacting to the event card
       OR to last turn's CEO commit (if any)
     - 1 press headline from a real publication if severity ≥ M
     - 0-1 Slack-channel leak from inside the company (#exec, #leadership,
       #random) — always parody, never accusatory of real people
     - 0-1 Glassdoor review or Discord whisper if vibes_off seeds active
   For turn 1 (no last_ceo_commit) the reactions are AMBIENT discourse
   about the company — the right rail must never be silent.
   Pull from Greek-chorus parody handles for any accusatory beat. Real-named
   figures only react.
7) UPDATE the foreshadow tracker: plant new seeds, mark paid-off seeds,
   re-roll or expire stragglers.
8) COMPUTE stats deltas from the event's effects + general consequences. Stats
   keys: valuation (USD), cash (USD), revenue (USD/mo), burn (USD/mo),
   headcount (int), reputation (-100..100), fbi_awareness (0..100),
   fraud_score (0..100), day (int — increments by 7-21).

OUTPUT FORMAT — STRICT JSON ONLY. NO PROSE BEFORE OR AFTER.

{{
  "event_card": {{
    "id": "EVT-...",
    "category": "FUNDRAISING|PRODUCT|HIRING|REGULATORY|PRESS|CUSTOMERS|FOUNDER|CRYPTO_AI|OPERATIONS|BANKING|FBI",
    "severity": "S|M|L|XL",
    "title": "...",
    "body": "1-3 sentence Oracle-voice description with [SLOT] fills resolved",
    "tags": [...],
    "choices": [
      {{"id": "A", "label": "...", "tone": "unhinged"}},
      {{"id": "B", "label": "...", "tone": "midwit"}},
      {{"id": "C", "label": "...", "tone": "rare-cucked"}}
    ]
  }},
  "atmospheric": [
    {{"kind": "office_lease_signed|hire|press_mention|...", "headline": "...", "stat_deltas": {{"burn": 80000}}}}
  ],
  "reactions": [
    {{"source": "twitter|bloomberg|techcrunch|forbes|slack|glassdoor|fbi|discord",
      "handle": "@...", "name": "...", "publication": "...", "channel": "...",
      "body": "..."}}
  ],
  "artifacts": [
    {{"kind": "tweet|headline|slack_leak|glassdoor|board_email", "body": "..."}}
  ],
  "stats_deltas": {{"valuation": 0, "cash": 0, "revenue": 0, "burn": 0, "headcount": 0, "reputation": 0, "fbi_awareness": 0, "fraud_score": 0, "day": 14}},
  "foreshadow_updates": {{
    "plant": ["seed_id", ...],
    "paid_off": ["seed_id", ...],
    "paid_lite": ["seed_id", ...],
    "rerolled": ["seed_id", ...]
  }},
  "market_updates": []
}}

Use snake_case seed_ids per game/chaining.md naming patterns
({{regulator}}_aware_seed, {{infra}}_brittle_seed, {{founder}}_loaded_seed, etc.).
"""


def _corpus_block() -> Dict[str, Any]:
    """The cached world-corpus block. ~50k tokens, cached ephemerally so per-turn
    cost is dominated by completion tokens, not the corpus."""
    corpus = get_corpus()
    body = render_corpus_for_prompt(corpus, max_chars=160_000)
    return {
        "type": "text",
        "text": body,
        "cache_control": {"type": "ephemeral"},
    }


def _build_system_blocks() -> List[Dict[str, Any]]:
    return [
        {"type": "text", "text": SYSTEM_VOICE},
        _corpus_block(),
    ]


def _last_turns_summary(state: RunState, k: int = 3) -> str:
    """Compact recap of the last K turns for the per-turn user prompt."""
    if not state.turns:
        return "(this is turn 1 — no prior turns)"
    recent = state.turns[-k:]
    out = []
    for t in recent:
        out.append(
            f"Turn {t.turn} | {t.category}/{t.severity} | "
            f"{t.event_title}\n  agent_picked={t.agent_choice_id}"
            f"  user_predicted={t.user_prediction}  user_forced={t.user_force_choice}"
            f"\n  justification: {t.justification}"
            f"\n  tweet: {t.artifact_tweet[:140]}"
        )
    return "\n".join(out)


def run_oracle(
    *,
    state: RunState,
    last_ceo_commit: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Run the Oracle for one turn. Synchronous — Modal calls this in a
    function-call boundary so we can return a single JSON dict."""
    bible_yaml = state.bible_yaml_raw or json.dumps(state.bible or {}, indent=2)
    user_prompt = f"""\
=== COMPANY BIBLE (this run) ===
{bible_yaml}

=== RUN STATE ===
turn: {state.turn}
length_mode: {state.length_mode()}
craziness: {state.craziness()}
severity_floor: {state.severity_floor()}
stats: {json.dumps(state.stats.snapshot())}

=== FORESHADOW TRACKER (private — never expose to CEO) ===
{state.tracker.to_prompt_block()}

=== LAST 3 TURNS ===
{_last_turns_summary(state, 3)}

=== LAST CEO COMMIT (if any — drives this turn's reactions) ===
{json.dumps(last_ceo_commit, indent=2) if last_ceo_commit else "(none — first turn)"}

Generate this turn's output as STRICT JSON per the schema in your system
prompt. No prose, no commentary, no code fence. Just the JSON object.
"""

    msg = usage_tracker.tracked_messages_create(
        run_id=state.run_id,
        agent="oracle",
        model=MODEL_ORACLE,
        # Oracle output is verbose JSON — event card + 3-5 reactions + atmospheric
        # + stats deltas + foreshadow updates. 2000 was getting truncated mid-JSON
        # which fell through to the generic "Quiet day on the timeline" fallback.
        # 3500 fits the full payload with headroom for longer reactions.
        max_tokens=3500,
        system=_build_system_blocks(),
        messages=[{"role": "user", "content": user_prompt}],
    )

    text = "".join(
        b.text for b in msg.content if getattr(b, "type", None) == "text"
    )
    parsed = _extract_json(text)
    if parsed is None:
        # The Oracle drifted (truncated JSON, malformed structure, etc.).
        # Log loudly so we can diagnose, then raise — the route's error
        # handler will trigger an exponential-backoff retry. We deliberately
        # do NOT silently fall back to a generic event anymore; the user
        # was seeing "Quiet day on the timeline" three times in a row
        # because the fallback masked repeated parse failures.
        truncated = len(text) >= 3400  # ~max_tokens * 0.97
        print(
            f"[oracle] turn={state.turn} run={state.run_id} "
            f"JSON parse failed (len={len(text)}, truncated={truncated})"
        )
        print(f"[oracle] last 200 chars of output: {text[-200:]!r}")
        raise RuntimeError(
            f"oracle output unparseable (truncated={truncated})"
        )
    return parsed


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    if not text:
        return None
    # Try: as-is, then strip code fences.
    for candidate in [text, _strip_fence(text)]:
        try:
            return json.loads(candidate)
        except Exception:
            pass
    # Try: outermost balanced {...} block.
    m = re.search(r"\{.*\}", text, re.DOTALL)
    if m:
        block = m.group(0)
        try:
            return json.loads(block)
        except Exception:
            pass
        # Final attempt: REPAIR truncated JSON. Haiku output sometimes hits
        # max_tokens mid-string-or-array. Try closing unclosed braces/brackets
        # and stripping a trailing partial value. Best-effort — if the repair
        # produces something parseable with at least an event_card, use it;
        # otherwise give up.
        repaired = _repair_truncated_json(block)
        if repaired is not None:
            try:
                obj = json.loads(repaired)
                if isinstance(obj, dict) and obj.get("event_card"):
                    print(f"[oracle] recovered from truncation via JSON repair")
                    return obj
            except Exception:
                pass
    return None


def _repair_truncated_json(text: str) -> Optional[str]:
    """Best-effort repair for an LLM JSON output that ran out of tokens.
    Strips trailing partial token, closes any unclosed strings, then balances
    braces and brackets. Returns None if we can't make sense of it."""
    if not text:
        return None
    s = text.rstrip()
    # If we ended mid-string (odd number of unescaped quotes), close it.
    in_string = False
    escape = False
    bracket_stack: list[str] = []
    last_safe = 0
    for i, ch in enumerate(s):
        if escape:
            escape = False
            continue
        if ch == "\\":
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            continue
        if in_string:
            continue
        if ch in "{[":
            bracket_stack.append(ch)
        elif ch in "}]":
            if bracket_stack:
                bracket_stack.pop()
            else:
                # malformed
                return None
        if not in_string and not bracket_stack:
            # parsed-balanced point; remember it
            last_safe = i + 1
    # Truncate trailing partial-value if we ended mid-string or after a ,
    if last_safe > 0 and last_safe < len(s):
        s = s[:last_safe]
    else:
        # Drop trailing partial token after last comma to avoid `... ,"foo": "bar` half-strings
        # Find last clean structural break.
        m = re.search(r'(.*[\}\]])\s*,?\s*"[^"]*$', s, re.DOTALL)
        if m:
            s = m.group(1)
        # Close unclosed string if any.
        if in_string:
            s = s + '"'
        # Close any open brackets.
        while bracket_stack:
            top = bracket_stack.pop()
            s = s + ("}" if top == "{" else "]")
    return s


def _strip_fence(text: str) -> str:
    m = re.search(r"```(?:json)?\s*\n(.*?)```", text, re.DOTALL | re.IGNORECASE)
    return m.group(1) if m else text


def _fallback_event(state: RunState) -> Dict[str, Any]:
    company = "the company"
    if state.bible:
        bible_company = state.bible.get("company") or {}
        company = (
            bible_company.get("display_name")
            or bible_company.get("name")
            or state.bible.get("display_name")
            or state.bible.get("name")
            or "the company"
        )
    return {
        "event_card": {
            "id": f"EVT-FALLBACK-{state.turn:03d}",
            "category": "PRESS",
            "severity": "S",
            "title": "Quiet day on the timeline",
            "body": f"At day {state.stats.day}, {company} is between beats. The chorus is bored. The chorus will not stay bored.",
            "tags": ["atmospheric"],
            "choices": [
                {"id": "A", "label": "Post through it", "tone": "unhinged"},
                {"id": "B", "label": "Stay off the timeline", "tone": "midwit"},
                {"id": "C", "label": "Ship a feature", "tone": "based"},
            ],
        },
        "atmospheric": [],
        "reactions": [],
        "artifacts": [],
        "stats_deltas": {"day": 14},
        "foreshadow_updates": {"plant": [], "paid_off": [], "paid_lite": [], "rerolled": []},
        "market_updates": [],
    }
