"""
Researcher agent — one-shot, run start.

Builds the Company Bible by searching the web for the founder + company. Uses
Anthropic's `web_search` tool. Streams progress events through an async callback
so the FastAPI route can forward them as SSE.

Per game/agents.md:
- Budget ~60-90s wall-clock. Cap web_search to ~6-8 queries.
- Output: YAML matching personalization.md schema, plus voice_anchors.
- If web turns up nothing useful, mark `synthetic: true` and produce a
  plausible synthesis from founder_vibe.
"""

from __future__ import annotations

import json
import re
from typing import Any, Awaitable, Callable, Dict, Optional

from .common import DEFAMATION_PREAMBLE, MODEL_RESEARCHER

# usage_tracker lives in /root/backend on Modal and ../usage_tracker.py locally;
# both are on sys.path before this module is imported.
import usage_tracker  # type: ignore


SYSTEM_PROMPT = f"""\
{DEFAMATION_PREAMBLE}

You are the Researcher. You run once at the start of a fictional-CEO simulation
and produce a Company Bible that two other agents will read every turn for the
next 30-60 minutes of game time.

YOUR JOB HAS TWO HALVES:

1) FACT GATHERING (web_search + scraping). Find:
   - Founder names, roles, public quotes, prior companies, schools, podcasts
   - Cofounder/CTO same details if exists
   - Funding history (Crunchbase, press releases)
   - Product description from the company's own copy
   - Notable press coverage, controversies, "huh" moments
   - Twitter handles, characteristic cadence
   You have ~75 seconds. Stop when the bible is dense, not when you've found
   everything possible. Cap web_search at 6 queries.

2) VOICE EXTRACTION. The other agents need to imitate this founder. Extract:
   - 3-7 real, attributable tweets / quotes (verbatim — copy-paste, don't
     paraphrase; paraphrase makes the CEO agent's register soggy)
   - Cadence: lowercase? em-dashes? short punchy or long thread?
   - Signature moves: subtweets? humblebrags? thread-essays? screenshots?
   - Forbidden register: corporate phrases this founder visibly disdains.

If web research returns nothing useful (private founder, brand-new company,
fake/pseudo company), fall back to the founder_vibe selector and produce a
plausible SYNTHETIC bible. Mark `synthetic: true`. Do NOT hallucinate sources
that don't exist.

OUTPUT FORMAT — strict YAML, no commentary, no "I found that..." narration.
Schema:

```yaml
company:
  name: ...
  display_name: ...
  one_liner: ...
  industry: ai_app | ai_infra | dev_tools | fintech | crypto | dtc | marketplace | enterprise_saas | consumer_social | hardware | biotech | climate | defense | other
  funding_stage: seed | series_a | series_b | growth | ipo | bootstrapped
  funding_total_usd: int
  notable_investors: [list]
  founded_year: int
  # Ground these three in your research (press, Crunchbase-style coverage,
  # the company's own claims). They seed the live dashboard. When you cannot
  # find a credible figure, put 0 — never invent one.
  estimated_valuation_usd: int   # 0 if unknown
  headcount: int                 # 0 if unknown
  revenue_annual_usd: int        # 0 if unknown (ARR / run-rate if reported)

founders:
  - name: ...
    role: CEO | CTO | ...
    persona_vibe: stanford_dropout | ex_mckinsey | crypto_refugee | nepo_baby | genuine_believer | second_time_founder
    public_quotes: [verbatim list]
    notable_history: [list]
    twitter_handle: "@..."

product:
  category_noun: ...
  the_thing_it_does: ...
  buzzwords_used: [list]
  customer_archetype: ...

market:
  competitors: [list of real names]
  comparable_blowups: [past similar-shape disasters]

vibe:
  twitter_presence: lurker | poster | reply_guy | thought_leader | dormant
  press_coverage_so_far: minimal | growing | hot | overheating
  notable_dirt: [list — the most interesting "huh" moments found, framed as
    allegations not established fact when they're allegations]

voice_anchors:
  founder_register:
    cadence: lowercase | sentence_case | corporate
    avg_tweet_length: int (tokens)
    em_dash_frequency: float (per tweet)
    signature_moves: [list]
    real_examples: [3-7 verbatim tweets/quotes]
  product_register:
    buzzwords: [list]
    forbidden_corporate: [list — phrases this founder disdains]

synthetic: false  # true if web research was insufficient
sources_consulted: [list of URLs you actually fetched]
```

Output ONLY the YAML inside a single ```yaml code fence. No preamble.
"""


async def run_researcher(
    *,
    user_input: Dict[str, Any],
    run_id: Optional[str] = None,
    on_event: Optional[Callable[[str, Dict[str, Any]], Awaitable[None]]] = None,
) -> Dict[str, Any]:
    """
    Run the Researcher agent and return the parsed Company Bible.

    `on_event(kind, data)` is awaited for progress events:
        "researcher.searching", "researcher.scraping",
        "researcher.bible_partial", "researcher.bible_complete"
    """
    company_name = user_input.get("name") or "(synthetic)"
    one_liner = user_input.get("one_liner") or ""
    industry = user_input.get("industry") or "other"
    founder_vibe = user_input.get("founder_vibe") or "stanford_dropout"
    founder_name = (user_input.get("founder") or "").strip()
    founder_handle = (user_input.get("founder_handle") or "").strip()

    founder_lines = ""
    if founder_name:
        founder_lines += f"- Founder name (user-provided — GROUND TRUTH, use exactly): {founder_name}\n"
    if founder_handle:
        founder_lines += f"- Founder X handle (user-provided — GROUND TRUTH): {founder_handle}\n"

    user_prompt = f"""\
The user has submitted:
- Company name: {company_name}
- One-liner: {one_liner}
- Industry tag: {industry}
- Founder vibe (selector): {founder_vibe}
{founder_lines}
Research this company and produce the Company Bible per the schema in your
system prompt. Use web_search to find the real founder, real tweets, real
press coverage. If the user provided a founder name/handle above, that is
ground truth — put it in founders[0] verbatim and research THAT person.
If the company is fake/synthetic, generate a plausible bible and set
synthetic: true — but still use any user-provided founder name verbatim.

Cap your search at ~6 queries. Stop when the bible is dense, not exhaustive.
"""

    if on_event:
        await on_event(
            "researcher.searching",
            {"query": f"{company_name} {one_liner}", "step": 1, "of": 6},
        )

    # We use the streaming API so we can surface step-by-step progress to the UI.
    # Anthropic's web_search tool runs server-side; we observe tool_use blocks
    # in the stream and emit the corresponding SSE event.
    text_buf: list[str] = []
    step = 1

    try:
        with usage_tracker.tracked_messages_stream(
            run_id=run_id,
            agent="researcher",
            model=MODEL_RESEARCHER,
            max_tokens=8000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
            tools=[
                {
                    "type": "web_search_20250305",
                    "name": "web_search",
                    "max_uses": 6,
                }
            ],
        ) as stream:
            for event in stream:
                etype = getattr(event, "type", None)
                if etype == "content_block_start":
                    block = getattr(event, "content_block", None)
                    btype = getattr(block, "type", None)
                    if btype == "server_tool_use" or btype == "tool_use":
                        tname = getattr(block, "name", "") or ""
                        tinput = getattr(block, "input", None) or {}
                        if "search" in tname.lower():
                            q = ""
                            if isinstance(tinput, dict):
                                q = tinput.get("query", "") or ""
                            if on_event:
                                step += 1
                                await on_event(
                                    "researcher.searching",
                                    {"query": q, "step": step, "of": 6},
                                )
                    elif btype == "web_search_tool_result":
                        if on_event:
                            await on_event(
                                "researcher.scraping",
                                {"step": step, "of": 6},
                            )
                elif etype == "content_block_delta":
                    delta = getattr(event, "delta", None)
                    if getattr(delta, "type", None) == "text_delta":
                        text_buf.append(getattr(delta, "text", ""))
                # other event types ignored
    except Exception as e:  # pragma: no cover — network / SDK errors
        # Fall through to synthetic generation if web search blew up.
        if on_event:
            await on_event(
                "researcher.searching",
                {"error": str(e), "step": step, "of": 6, "fallback": "synthetic"},
            )

    full_text = "".join(text_buf)
    bible = _extract_yaml_bible(full_text)

    if not bible:
        # Last-ditch synthetic. Should be rare — the model almost always emits
        # something parseable — but better safe than 500ing.
        bible = _synthetic_bible(
            company_name, one_liner, industry, founder_vibe,
            founder_name=founder_name, founder_handle=founder_handle,
        )
        bible["synthetic"] = True

    if on_event:
        # Drip the major sections so the upload-confirmation UI fills in.
        for section in ("company", "founders", "product", "market", "vibe", "voice_anchors"):
            if section in bible:
                await on_event(
                    "researcher.bible_partial",
                    {"section": section, "content": bible[section]},
                )
        await on_event("researcher.bible_complete", {"bible": bible})

    return bible


def _extract_yaml_bible(text: str) -> Optional[Dict[str, Any]]:
    """Pull the YAML out of a ```yaml ... ``` code fence and parse it."""
    if not text:
        return None
    m = re.search(r"```ya?ml\s*\n(.*?)```", text, re.DOTALL | re.IGNORECASE)
    raw = m.group(1) if m else text
    try:
        import yaml
        data = yaml.safe_load(raw)
        if isinstance(data, dict):
            return data
    except Exception:
        pass
    # Try JSON as a last resort.
    try:
        return json.loads(raw)
    except Exception:
        return None


def _synthetic_bible(
    name: str, one_liner: str, industry: str, vibe: str,
    founder_name: str = "", founder_handle: str = "",
) -> Dict[str, Any]:
    """Fallback bible when web research yields nothing usable."""
    return {
        "company": {
            "name": name,
            "display_name": name,
            "one_liner": one_liner or f"{industry} startup",
            "industry": industry,
            "funding_stage": "seed",
            "funding_total_usd": 8_000_000,
            "notable_investors": [],
            "founded_year": 2024,
        },
        "founders": [
            {
                # Never ship literal bracket placeholders as names — they
                # leak into rendered event text (UX-1).
                "name": founder_name or "The Founder",
                "role": "CEO",
                "persona_vibe": vibe,
                "public_quotes": [
                    "we ship",
                    "skill issue",
                    "8 hours of meetings to align on a thing my CTO could've shipped in 2",
                ],
                "notable_history": [],
                "twitter_handle": founder_handle or "@founder",
            }
        ],
        "product": {
            "category_noun": f"{industry} platform",
            "the_thing_it_does": one_liner or "automates an entire job category",
            "buzzwords_used": ["agentic", "primitive", "leverage", "founder-mode"],
            "customer_archetype": "Series A and B startups",
        },
        "market": {
            "competitors": [],
            "comparable_blowups": [],
        },
        "vibe": {
            "twitter_presence": "poster",
            "press_coverage_so_far": "minimal",
            "notable_dirt": [],
        },
        "voice_anchors": {
            "founder_register": {
                "cadence": "lowercase",
                "avg_tweet_length": 18,
                "em_dash_frequency": 0.3,
                "signature_moves": ["self-aggrandizing one-liner", "subtle subtweet"],
                "real_examples": [
                    "we're not building a product, we're building a way of being",
                    "skill issue",
                    "8 hours of meetings to align on a thing my CTO could've shipped in 2",
                ],
            },
            "product_register": {
                "buzzwords": ["agentic", "primitive", "leverage", "founder-mode", "alpha"],
                "forbidden_corporate": ["synergy", "ecosystem", "journey", "our team"],
            },
        },
        "synthetic": True,
        "sources_consulted": [],
    }
