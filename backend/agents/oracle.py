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
import random
import re
from typing import Any, Dict, List, Optional

from corpus_loader import get_corpus, render_corpus_for_prompt, filter_events  # type: ignore
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

WORLD CANON — THE PRESUMPTION OF OPERATING REALITY (load-bearing; violating
this breaks the entire game premise):

- At run start, the company is EXACTLY what the bible says: a real,
  functioning business. Its product works as described. The comedy engine
  is watching the CEO choose the most ridiculous course of action FROM
  WHERE THINGS STAND NOW — not discovering that everything was secretly
  fake all along.
- Company wrongdoing becomes TRUE only when the CEO actually chooses it
  (see the run history + foreshadow tracker). Until a fraud was chosen,
  it did not happen. NEVER state as narrator-fact that the product is
  fake, the revenue is invented, or the demo is rigged unless the run
  history shows the CEO making that specific bed.
- Negative heat before (or beyond) what the CEO has earned must arrive as
  ATTRIBUTED VOICES, never narrator truth: a rival ACCUSES, a burned
  ex-contractor CLAIMS, a short-seller thread ALLEGES, a journalist ASKS.
  ("A thread claims the 'autonomous' pipeline is 40 guys on WeChat" — the
  world doesn't know if it's true, and neither does the narrator.)
- When a corpus event presumes internal fraud that hasn't been chosen,
  REFRAME it as (a) a temptation — someone inside proposes the fraudulent
  shortcut and the CEO chooses — or (b) an external allegation per above.
  Do not import the event's guilt as established fact.
- EXCEPTION: preset templates (Theranos, FTX, …) start with pre-planted
  seeds — THAT loaded state is canon and may be treated as already true.

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
   EVERY twitter/discord reaction MUST carry a `handle` AND `name` — an
   unnamed account breaks the feed. Use the FIG-CHORUS cast from the corpus
   as your recurring ensemble (e.g. @litcapital, @TrungTPhan, @VCBrags,
   @AnonVCs, @BasedBeffJezos, @openspec, @ParodyMarc, @AGIEnjoyer) — the
   same voices recurring across turns is what makes the feed feel alive.
   Match the handle to the beat (e/acc voice for AI beats, engineer-cynic
   for demo/wrapper beats, finance-meme for fundraising beats).
7) UPDATE the foreshadow tracker: plant new seeds, mark paid-off seeds,
   re-roll or expire stragglers.
8) COMPUTE stats deltas from the event's effects + general consequences. Stats
   keys: valuation (USD), cash (USD), revenue (USD/mo), burn (USD/mo),
   headcount (int), reputation (-100..100), fbi_awareness (0..100),
   fraud_score (0..100), day (int — increments by 7-21).

OUTPUT — call the tool `emit_oracle_turn` exactly once. Its input_schema
defines the shape; pass the turn's data as the tool input. Do NOT produce
any free-form text. The tool call IS the response.

For reference, the tool's input has this shape:

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


# ───────────────────────────────────────────────────────────────────────────
# Tool-use schema. We force the Oracle to call this single tool, which
# guarantees the response is a parseable JSON object (no free-form text, no
# code fences). NOTE the limit: Anthropic does NOT validate tool input
# against this schema server-side (no strict mode), so values can still
# arrive mistyped — integers as "+2M"/null, arrays-of-strings as arrays of
# objects, etc. Every consumer of this output must coerce defensively; the
# uncoerced int() on stats_deltas was killing whole runs silently.
# ───────────────────────────────────────────────────────────────────────────
ORACLE_TOOL: Dict[str, Any] = {
    "name": "emit_oracle_turn",
    "description": (
        "Emit one Oracle turn: the main event card, NPC reactions, atmospheric "
        "beats, media artifacts, stat deltas, and foreshadow tracker updates. "
        "Call this exactly once per turn."
    ),
    "input_schema": {
        "type": "object",
        "additionalProperties": True,
        "required": [
            "event_card",
            "reactions",
            "stats_deltas",
            "foreshadow_updates",
        ],
        "properties": {
            "event_card": {
                "type": "object",
                "required": ["id", "category", "severity", "title", "body", "choices"],
                "additionalProperties": True,
                "properties": {
                    "id": {"type": "string"},
                    "category": {"type": "string"},
                    "severity": {"type": "string", "enum": ["S", "M", "L", "XL"]},
                    "title": {"type": "string"},
                    "body": {"type": "string"},
                    "tags": {"type": "array", "items": {"type": "string"}},
                    "choices": {
                        "type": "array",
                        "minItems": 2,
                        "maxItems": 4,
                        "items": {
                            "type": "object",
                            "required": ["id", "label", "tone"],
                            "additionalProperties": True,
                            "properties": {
                                "id": {"type": "string"},
                                "label": {"type": "string"},
                                "tone": {"type": "string"},
                            },
                        },
                    },
                },
            },
            "atmospheric": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": True,
                    "properties": {
                        "kind": {"type": "string"},
                        "headline": {"type": "string"},
                        "stat_deltas": {"type": "object"},
                    },
                },
            },
            "reactions": {
                "type": "array",
                "minItems": 3,
                "items": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["source", "body", "handle", "name"],
                    "properties": {
                        "source": {"type": "string"},
                        "handle": {"type": "string"},
                        "name": {"type": "string"},
                        "publication": {"type": "string"},
                        "channel": {"type": "string"},
                        "body": {"type": "string"},
                    },
                },
            },
            "artifacts": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": True,
                    "required": ["kind", "body"],
                    "properties": {
                        "kind": {"type": "string"},
                        "body": {"type": "string"},
                    },
                },
            },
            "stats_deltas": {
                "type": "object",
                "additionalProperties": True,
                "properties": {
                    "valuation": {"type": "integer"},
                    "cash": {"type": "integer"},
                    "revenue": {"type": "integer"},
                    "burn": {"type": "integer"},
                    "headcount": {"type": "integer"},
                    "reputation": {"type": "integer"},
                    "fbi_awareness": {"type": "integer"},
                    "fraud_score": {"type": "integer"},
                    "day": {"type": "integer"},
                },
            },
            "foreshadow_updates": {
                "type": "object",
                "additionalProperties": True,
                "properties": {
                    "plant": {"type": "array", "items": {"type": "string"}},
                    "paid_off": {"type": "array", "items": {"type": "string"}},
                    "paid_lite": {"type": "array", "items": {"type": "string"}},
                    "rerolled": {"type": "array", "items": {"type": "string"}},
                },
            },
            "market_updates": {"type": "array"},
        },
    },
}


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
        # str() belt: pre-fix TurnRecords (rehydrated from disk) may hold a
        # dict tweet/justification — slicing a dict raises and, worse, does
        # so on EVERY retry because the poison lives in state.
        tweet = str(t.artifact_tweet or "")[:140]
        justification = str(t.justification or "")
        out.append(
            f"Turn {t.turn} | {t.category}/{t.severity} | "
            f"{t.event_title}\n  agent_picked={t.agent_choice_id}"
            f"  user_predicted={t.user_prediction}  user_forced={t.user_force_choice}"
            f"\n  justification: {justification}"
            f"\n  tweet: {tweet}"
        )
    return "\n".join(out)


def _candidate_shortlist(state: RunState, *, size: int = 16) -> str:
    """Build a per-run-varied shortlist of candidate events for the Oracle.

    Root cause of "every run feels the same": the Oracle is handed the entire
    corpus in the same fixed order every turn of every run, and (Anthropic's
    default temperature already being 1.0) identical inputs gravitate to the
    same salient events. We can't add sampling headroom, so we vary the INPUT:
    run the cheap `filter_events` pre-filter, drop events already used in recent
    turns, then seed-shuffle by (run_id, turn) so each run surfaces a different
    slice. This goes in the UNCACHED user prompt, so the big cached corpus block
    is untouched and per-turn cost does not regress.

    Returns a markdown bullet list, or a graceful fallback line on any error.
    """
    try:
        corpus = get_corpus()
        company = (state.bible or {}).get("company", {}) or {}
        industry = company.get("industry")
        recent_ids = [t.event_id for t in state.turns[-8:]]
        pool = filter_events(
            corpus,
            length_mode=state.length_mode(),
            craziness=state.craziness(),
            severity_floor=state.severity_floor(),
            industry=industry,
            exclude_ids=recent_ids,
        )
        # Prereq gating (chaining.md: "The raid is not random. Someone has
        # to flip first."). An event whose prereq seeds haven't been planted
        # by actual play must not be nudged into the Oracle's hands — that's
        # how a legitimate company got accused of wholesale fraud on turn 4.
        # Seeds count as satisfied once planted, whether or not paid off yet.
        happened = {
            sid for sid, s in state.tracker.seeds.items()
            if s.status in ("active", "paid", "paid_lite")
        }
        pool = [
            ev for ev in pool
            if all(p in happened for p in (ev.prereqs or []))
            and (not ev.prereqs_any or any(p in happened for p in ev.prereqs_any))
        ]
        # Early-turn severity ceiling: no XL before turn 3, no L on turn 1 —
        # unless the run STARTED with planted seeds (preset templates), whose
        # loaded state legitimately supports early heat.
        if not happened:
            if state.turn <= 1:
                pool = [ev for ev in pool if (ev.severity or "S") not in ("L", "XL")]
            elif state.turn <= 2:
                pool = [ev for ev in pool if (ev.severity or "S") != "XL"]
        if not pool:
            return "(no shortlist — select from the full corpus above)"
        # Stable per-(run, turn) seed: same run+turn reproduces, different runs
        # diverge. random.Random accepts a string seed directly.
        rng = random.Random(f"{state.run_id}:{state.turn}")
        rng.shuffle(pool)
        shortlist = pool[:size]
        # Include each candidate's full record text (capped) — the cached
        # corpus block truncates its events tail, so this uncached section
        # is the only guaranteed-complete copy of these candidates.
        blocks = []
        for ev in shortlist:
            body = (ev.raw_markdown or "").strip()
            if len(body) > 900:
                body = body[:900] + " […]"
            blocks.append(body)
        return "\n\n".join(blocks)
    except Exception as exc:  # noqa: BLE001 — never let shortlisting break a turn
        print(f"[oracle] candidate shortlist failed ({type(exc).__name__}: {exc})")
        return "(no shortlist — select from the full corpus above)"


def run_oracle(
    *,
    state: RunState,
    last_ceo_commit: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Run the Oracle for one turn. Synchronous — Modal calls this in a
    function-call boundary so we can return a single JSON dict."""
    bible_yaml = state.bible_yaml_raw or json.dumps(state.bible or {}, indent=2)
    candidate_section = _candidate_shortlist(state)
    user_prompt = f"""\
=== COMPANY BIBLE (this run) ===
{bible_yaml}

=== RUN STATE ===
turn: {state.turn}
length_mode: {state.length_mode()}
craziness: {state.craziness()}
severity_floor: {state.severity_floor()}
stats: {json.dumps(state.stats.snapshot())}

=== CANON REMINDER ===
The company is legitimate except where the run history above shows the CEO
choosing otherwise. Accusations come from voices; the narrator never asserts
unearned fraud as fact.

=== PRIORITY CANDIDATE EVENTS (sampled fresh for THIS run — prefer these; do not reuse recent events) ===
{candidate_section}

=== FORESHADOW TRACKER (private — never expose to CEO) ===
{state.tracker.to_prompt_block()}

=== LAST 3 TURNS ===
{_last_turns_summary(state, 3)}

=== LAST CEO COMMIT (if any — drives this turn's reactions) ===
{json.dumps(last_ceo_commit, indent=2) if last_ceo_commit else "(none — first turn)"}

Emit this turn by calling the `emit_oracle_turn` tool exactly once.
The tool's input_schema enforces the shape — your tool input IS the turn.
Do not write any prose; the tool call is the entire response.
"""

    def _call_tool(model: str) -> Optional[Dict[str, Any]]:
        msg = usage_tracker.tracked_messages_create(
            run_id=state.run_id,
            agent="oracle",
            model=model,
            # Tool inputs are still tokens — event card + 3-5 reactions +
            # atmospheric + deltas + foreshadow. 4500 covers worst case.
            max_tokens=4500,
            system=_build_system_blocks(),
            messages=[{"role": "user", "content": user_prompt}],
            tools=[ORACLE_TOOL],
            tool_choice={"type": "tool", "name": "emit_oracle_turn"},
        )
        for block in msg.content:
            if getattr(block, "type", None) == "tool_use" and \
                    getattr(block, "name", None) == "emit_oracle_turn":
                tool_input = getattr(block, "input", None)
                if isinstance(tool_input, dict):
                    return tool_input
        return None

    # Single-shot Haiku via forced tool_use. Forcing the tool guarantees the
    # response parses as a JSON object — but the API does NOT validate the
    # values against our schema (no strict mode), so any field can still
    # arrive mistyped. Downstream consumers coerce; here we only gate on the
    # card being an object. If the call fails outright (network / 5xx /
    # model refusal) we fall back to a template-aware deck instead of
    # stalling the run.
    try:
        parsed = _call_tool(MODEL_ORACLE)
    except Exception as exc:  # noqa: BLE001 — we want broad recovery
        print(
            f"[oracle] turn={state.turn} run={state.run_id} "
            f"tool_use call raised {type(exc).__name__}: {exc} — using fallback"
        )
        return _fallback_event(state)

    if isinstance(parsed, dict) and isinstance(parsed.get("event_card"), dict):
        return parsed
    print(
        f"[oracle] turn={state.turn} run={state.run_id} "
        f"tool_use returned no usable input — using fallback"
    )
    return _fallback_event(state)


def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    """Multi-pass JSON extractor for Oracle output. Tries (in order):
       1. Raw text
       2. Stripped code fence
       3. Outermost {...} block
       4. Sanitized (trailing commas / comments / single-quote / control-char fixes)
       5. Truncation repair (close unclosed brackets)
    Returns the parsed dict or None.
    """
    if not text:
        return None

    last_err: Optional[str] = None

    def _try(label: str, candidate: str) -> Optional[Dict[str, Any]]:
        nonlocal last_err
        try:
            return json.loads(candidate)
        except Exception as e:
            last_err = f"{label}: {e}"
            return None

    # Pass 1: as-is.
    obj = _try("raw", text)
    if isinstance(obj, dict):
        return obj

    # Pass 2: strip fence.
    stripped = _strip_fence(text)
    obj = _try("fence-stripped", stripped)
    if isinstance(obj, dict):
        return obj

    # Pass 3: outermost {...} block.
    m = re.search(r"\{.*\}", stripped, re.DOTALL)
    if not m:
        m = re.search(r"\{.*\}", text, re.DOTALL)
    block = m.group(0) if m else None
    if block:
        obj = _try("outer-block", block)
        if isinstance(obj, dict):
            return obj

        # Pass 4: sanitize common LLM mistakes.
        sanitized = _sanitize_json(block)
        obj = _try("sanitized", sanitized)
        if isinstance(obj, dict):
            print("[oracle] recovered via JSON sanitization")
            return obj

        # Pass 5: try truncation repair on top of sanitized.
        repaired = _repair_truncated_json(sanitized)
        if repaired is not None:
            obj = _try("repaired", repaired)
            if isinstance(obj, dict) and obj.get("event_card"):
                print("[oracle] recovered via JSON repair")
                return obj

    print(f"[oracle] all JSON parse attempts failed. last error: {last_err}")
    return None


def _sanitize_json(text: str) -> str:
    """Fix common LLM JSON output mistakes:
       - Strip JSON-incompatible // and /* */ comments
       - Replace trailing commas before ] or }
       - Escape literal newlines/tabs inside string values (LLM forgets \\n)
       - Convert smart quotes to plain
    """
    s = text
    # Smart quotes → plain
    s = s.replace("“", '"').replace("”", '"')
    s = s.replace("‘", "'").replace("’", "'")
    # Strip // line comments
    s = re.sub(r"(?<!:)//[^\n]*", "", s)
    # Strip /* ... */ block comments
    s = re.sub(r"/\*.*?\*/", "", s, flags=re.DOTALL)
    # Trailing commas before } or ]
    s = re.sub(r",(\s*[\}\]])", r"\1", s)
    # Escape literal newlines / tabs / carriage returns inside strings.
    # We walk the text manually: when inside a string, replace control chars.
    out = []
    in_string = False
    escape = False
    for ch in s:
        if escape:
            out.append(ch)
            escape = False
            continue
        if ch == "\\":
            out.append(ch)
            escape = True
            continue
        if ch == '"':
            in_string = not in_string
            out.append(ch)
            continue
        if in_string and ch == "\n":
            out.append("\\n")
        elif in_string and ch == "\r":
            out.append("\\r")
        elif in_string and ch == "\t":
            out.append("\\t")
        else:
            out.append(ch)
    return "".join(out)


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
    """Pick a template-aware fallback when the Oracle's LLM output is
    unparseable. Per-template fallback decks live in _TEMPLATE_FALLBACKS;
    we rotate through them by turn number for variety. Generic fallback
    is used when no template-specific deck matches.

    Each entry in the deck is a fully-formed Oracle response (event_card +
    reactions + stats_deltas), written to land like a real corpus event so
    the user can't tell the LLM whiffed.
    """
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

    template_id = (state.template_id or "").lower().strip() or None
    deck = _TEMPLATE_FALLBACKS.get(template_id) or _GENERIC_FALLBACKS

    # Rotate through the deck by turn so the same fallback doesn't fire
    # twice in a row when Haiku has a bad-luck streak.
    fallback_idx = (state.turn - 1) % len(deck)
    base = deck[fallback_idx](company, state)

    # Stamp it with a deterministic but unique id and standard wrapper.
    return {
        "event_card": base["event_card"] | {
            "id": f"EVT-FALLBACK-{template_id or 'gen'}-{state.turn:03d}".upper(),
        },
        "atmospheric": base.get("atmospheric", []),
        "reactions": base.get("reactions", []),
        "artifacts": base.get("artifacts", []),
        "stats_deltas": base.get("stats_deltas", {"day": 14}),
        "foreshadow_updates": base.get(
            "foreshadow_updates",
            {"plant": [], "paid_off": [], "paid_lite": [], "rerolled": []},
        ),
        "market_updates": base.get("market_updates", []),
    }


# ── Per-template fallback decks ─────────────────────────────────────────
#
# Each function takes (company_name, state) and returns a partial Oracle
# response. The wrapper above fills in id and applies defaults. Write these
# in voice — they should land like genuine corpus events.

def _delve_fb_deepdelver(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "PRESS",
            "severity": "L",
            "title": "DeepDelver posts Part II",
            "body": (
                f"The anonymous Substacker who broke the {company} story posts "
                "a 7,200-word follow-up: 493 of 494 SOC 2 reports are "
                "99.8% identical, same paragraphs, same auditor signature, "
                "different logos. The Bookface thread is locked within an hour."
            ),
            "tags": ["press_exposure", "soc2_misrepresented_seed", "fraud_lite", "atmospheric"],
            "choices": [
                {"id": "A", "label": "Quote-tweet with 'we welcome scrutiny'", "tone": "unhinged"},
                {"id": "B", "label": "Issue a 14-page legal-vetted statement", "tone": "midwit"},
                {"id": "C", "label": "Ghost the post entirely", "tone": "rare-cucked"},
            ],
        },
        "reactions": [
            {"source": "twitter", "handle": "@deepdelver", "name": "DeepDelver",
             "body": "part III drops thursday. it's about the customer list."},
            {"source": "techcrunch", "publication": "TechCrunch",
             "body": f"DeepDelver follow-up alleges 99.8% report similarity at {company}; YC declines comment"},
            {"source": "slack", "channel": "#exec", "name": "anon",
             "body": "we cannot say 'AI generated it' as a defense. we said it was AI as a feature."},
        ],
        "stats_deltas": {"reputation": -10, "fraud_score": 8, "fbi_awareness": 4, "day": 7},
        "foreshadow_updates": {
            "plant": ["deepdelver_loaded_seed", "press_exposure_seed"],
            "paid_off": [], "paid_lite": [], "rerolled": [],
        },
    }

def _delve_fb_garry_tan(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "FOUNDER",
            "severity": "M",
            "title": "Garry Tan unfollows on X",
            "body": (
                f"Garry Tan unfollows {company}'s founder on X. The unfollow is "
                "screenshotted within 90 seconds. The screenshot is now the "
                "second-most-quoted post in the thread under the YC W24 launch "
                "video. The first is a comment that says 'is this still on YC's site lol'."
            ),
            "tags": ["founder_behavior", "yc_alumni_chorus_seed", "real_name", "atmospheric"],
            "choices": [
                {"id": "A", "label": "Post a 'still grateful to YC' carousel", "tone": "unhinged"},
                {"id": "B", "label": "DM Garry to ask 'what's up'", "tone": "midwit"},
                {"id": "C", "label": "Lock the X account", "tone": "rare-cucked"},
            ],
        },
        "reactions": [
            {"source": "twitter", "handle": "@garrytan", "name": "Garry Tan",
             "body": "no comment beyond what's already public"},
            {"source": "twitter", "handle": "@yc_w23_anon", "name": "@yc_w23_anon",
             "body": "the unfollow is the most expensive YC bookface badge ever issued"},
            {"source": "discord", "handle": "yc-w24-private", "name": "[redacted]",
             "body": "we have a meeting today. it is not a normal meeting."},
        ],
        "stats_deltas": {"reputation": -8, "fraud_score": 4, "day": 5},
        "foreshadow_updates": {
            "plant": ["yc_distancing_seed"],
            "paid_off": [], "paid_lite": [], "rerolled": [],
        },
    }

def _delve_fb_cluely_quote(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "CUSTOMERS",
            "severity": "M",
            "title": "Cluely's CEO quote-dunks",
            "body": (
                f"Cluely's CEO posts a 14-tweet thread that begins 'we were "
                f"a {company} customer for 11 days' and ends with a screenshot "
                "of the SOC 2 report's title page misspelling 'Clueley'. "
                "He pins it. The thread does 8.4M impressions before lunch."
            ),
            "tags": ["customer", "press_exposure", "real_name", "cluely_was_a_delve_customer_seed"],
            "choices": [
                {"id": "A", "label": "Counter-thread with 'his typo on his typo'", "tone": "unhinged"},
                {"id": "B", "label": "Refund and NDA", "tone": "midwit"},
                {"id": "C", "label": "No response — let it cool", "tone": "rare-cucked"},
            ],
        },
        "reactions": [
            {"source": "twitter", "handle": "@roy_lee", "name": "Roy Lee",
             "body": "we cancelled within the hour. ask me anything 🧵"},
            {"source": "twitter", "handle": "@startup_dunk", "name": "Startup Dunk",
             "body": "two YC W24 companies arguing over which one is more fake. that's the whole game now."},
            {"source": "slack", "channel": "#leadership", "name": "anon",
             "body": "legal says we cannot post about Cluely without it becoming exhibit something."},
        ],
        "stats_deltas": {"reputation": -12, "revenue": -50_000, "fraud_score": 6, "day": 4},
        "foreshadow_updates": {
            "plant": ["cluely_feud_loaded_seed"],
            "paid_off": ["customer_trust_brittle_seed"],
            "paid_lite": [], "rerolled": [],
        },
    }

def _delve_fb_insight_check(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "FUNDRAISING",
            "severity": "L",
            "title": "Insight Partners requests a 'check-in'",
            "body": (
                "An Insight Partners associate emails the founder at 11pm "
                "asking for a 'quick sync to align on narrative' tomorrow at 8am. "
                "The calendar invite has six attendees — three of whom are not "
                "from Insight. Two are former federal prosecutors. The third "
                "works at the firm's PR agency."
            ),
            "tags": ["fundraising", "regulator_aware", "atmospheric", "real_name"],
            "choices": [
                {"id": "A", "label": "Show up. Wing it.", "tone": "unhinged"},
                {"id": "B", "label": "Bring counsel. Slow it down.", "tone": "midwit"},
                {"id": "C", "label": "Reschedule to give legal 48 hours", "tone": "rare-cucked"},
            ],
        },
        "reactions": [
            {"source": "slack", "channel": "#exec", "name": "anon",
             "body": "they are bringing prosecutors to a 'check-in.' that is not what a check-in is."},
            {"source": "twitter", "handle": "@anonvc", "name": "AnonVC",
             "body": "if your lead VC is bringing white-collar counsel to office hours, you are no longer 'in office hours'"},
        ],
        "stats_deltas": {"valuation": -40_000_000, "fraud_score": 6, "fbi_awareness": 6, "day": 3},
        "foreshadow_updates": {
            "plant": ["insight_aware_seed", "down_round_loaded_seed"],
            "paid_off": [], "paid_lite": [], "rerolled": [],
        },
    }

def _delve_fb_forbes_call(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "PRESS",
            "severity": "M",
            "title": "Forbes 30u30 fact-checker calls",
            "body": (
                f"A Forbes 30 Under 30 fact-checker calls about {company}'s "
                "founders' 2026 listing. She has 'a few quick questions' about "
                "the customer count, the funding total, and 'a Substack post you may "
                "have seen.' She has been on the phone with two ex-employees today."
            ),
            "tags": ["press_exposure", "press", "forbes_30u30_loaded_seed", "real_name"],
            "choices": [
                {"id": "A", "label": "Tell her '$32M, 1500+ customers' on the record", "tone": "unhinged"},
                {"id": "B", "label": "Have PR call back, give vetted numbers", "tone": "midwit"},
                {"id": "C", "label": "Decline the interview", "tone": "rare-cucked"},
            ],
        },
        "reactions": [
            {"source": "forbes", "publication": "Forbes",
             "body": f"Forbes 30 Under 30 reviews 2026 list following anonymous-tip-line claims about {company}"},
            {"source": "twitter", "handle": "@litcapital", "name": "litquidity",
             "body": "30u30 → 5y federal pipeline running on schedule"},
            {"source": "slack", "channel": "#leadership", "name": "anon",
             "body": "she has been talking to ex-employees. plural. since when do we have plural ex-employees."},
        ],
        "stats_deltas": {"reputation": -6, "fraud_score": 4, "day": 5},
        "foreshadow_updates": {
            "plant": ["forbes_investigation_seed"],
            "paid_off": [], "paid_lite": [], "rerolled": [],
        },
    }

def _delve_fb_anthropic_dropout(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "CUSTOMERS",
            "severity": "L",
            "title": "Anthropic quietly drops the contract",
            "body": (
                f"Anthropic, listed prominently on {company}'s customer page, "
                "sends a polite email at 3:47pm: 'as discussed, we'll be ending "
                "the engagement this quarter — please remove our logo from "
                "marketing materials at your earliest convenience.' The logo "
                "is removed from the homepage at 4:11pm. The Wayback Machine "
                "has a snapshot from 4:09pm."
            ),
            "tags": ["customer", "press_exposure", "wayback_machine_seed", "real_name"],
            "choices": [
                {"id": "A", "label": "Tweet: 'mutual decision, exciting next chapter'", "tone": "unhinged"},
                {"id": "B", "label": "Update the site, hope no one notices", "tone": "midwit"},
                {"id": "C", "label": "Disclose to investors before they read about it", "tone": "rare-cucked"},
            ],
        },
        "reactions": [
            {"source": "twitter", "handle": "@SoftwareEng_Memes", "name": "Software Engineering Memes",
             "body": f"the speed at which the Anthropic logo was removed from {company}.co is itself the news"},
            {"source": "techcrunch", "publication": "The Information",
             "body": f"Anthropic ends {company} engagement; sources cite 'compliance posture mismatch'"},
            {"source": "slack", "channel": "#exec", "name": "anon",
             "body": "Brex is asking why Anthropic left. Notion is asking why Anthropic left. Lovable is not asking."},
        ],
        "stats_deltas": {"revenue": -120_000, "reputation": -14, "valuation": -20_000_000, "day": 6},
        "foreshadow_updates": {
            "plant": ["customer_logo_purge_seed"],
            "paid_off": ["customer_trust_brittle_seed"],
            "paid_lite": [], "rerolled": [],
        },
    }

def _delve_fb_quiet(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "FOUNDER",
            "severity": "S",
            "title": "Bookface goes quiet",
            "body": (
                f"For 36 hours nobody posts in the W24 Bookface thread about {company}. "
                "This is not normal. Bookface is never quiet. Three founders DM "
                "the founder asking 'is everything ok?' One DM is from someone "
                "currently rotating audit firms."
            ),
            "tags": ["founder_behavior", "vibes_off", "atmospheric", "yc_alumni_chorus_seed"],
            "choices": [
                {"id": "A", "label": "Post a normal-sounding update to break the silence", "tone": "unhinged"},
                {"id": "B", "label": "Reply individually with 'doing great, building'", "tone": "midwit"},
                {"id": "C", "label": "Stay off Bookface entirely", "tone": "rare-cucked"},
            ],
        },
        "reactions": [
            {"source": "twitter", "handle": "@founder_brain", "name": "Founder Brain",
             "body": "if your batch's bookface is quiet about you, you are the topic of every other DM"},
            {"source": "discord", "handle": "yc-w24-back-channel", "name": "[redacted]",
             "body": "everyone has the same screenshots. nobody wants to be the one who posts them."},
        ],
        "stats_deltas": {"reputation": -3, "morale": -3, "day": 2},
        "foreshadow_updates": {
            "plant": ["bookface_silence_seed"],
            "paid_off": [], "paid_lite": [], "rerolled": [],
        },
    }


# ── Generic fallbacks for non-template runs ─────────────────────────────

def _gen_fb_quiet(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
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
        "stats_deltas": {"day": 7},
    }

def _gen_fb_glassdoor(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "HIRING",
            "severity": "S",
            "title": "Anonymous Glassdoor review",
            "body": (
                f"A 1-star {company} review hits Glassdoor at 11:47pm. "
                "Title: 'Pros: kombucha. Cons: everything else.' The review "
                "is unusually specific about a Q3 all-hands."
            ),
            "tags": ["hr_problem", "glassdoor", "atmospheric"],
            "choices": [
                {"id": "A", "label": "Have HR respond publicly", "tone": "unhinged"},
                {"id": "B", "label": "Flag the review for removal", "tone": "midwit"},
                {"id": "C", "label": "Ignore — it'll cycle off", "tone": "based"},
            ],
        },
        "stats_deltas": {"morale": -3, "day": 3},
    }

def _gen_fb_recruit(company: str, state: RunState) -> Dict[str, Any]:
    return {
        "event_card": {
            "category": "HIRING",
            "severity": "S",
            "title": "A recruiter ghosts mid-process",
            "body": (
                f"A senior eng candidate {company} has been courting for six "
                "weeks just sent a one-line email: 'going in another direction, "
                "thanks.' She joined a competitor. The competitor announces "
                "her hire on Twitter that afternoon."
            ),
            "tags": ["hiring", "atmospheric"],
            "choices": [
                {"id": "A", "label": "Counter-poach two of her future teammates", "tone": "unhinged"},
                {"id": "B", "label": "Post a 'we're hiring' thread anyway", "tone": "midwit"},
                {"id": "C", "label": "Move on, she wasn't a culture fit", "tone": "based"},
            ],
        },
        "stats_deltas": {"morale": -2, "headcount": 0, "day": 5},
    }


_TEMPLATE_FALLBACKS: Dict[str, list] = {
    "delve": [
        _delve_fb_deepdelver,
        _delve_fb_garry_tan,
        _delve_fb_cluely_quote,
        _delve_fb_insight_check,
        _delve_fb_forbes_call,
        _delve_fb_anthropic_dropout,
        _delve_fb_quiet,
    ],
}

_GENERIC_FALLBACKS = [
    _gen_fb_quiet,
    _gen_fb_glassdoor,
    _gen_fb_recruit,
]
