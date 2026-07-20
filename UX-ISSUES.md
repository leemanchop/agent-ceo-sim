# UX Issues Ledger

Format: the reporter's words verbatim → code diagnosis → severity → status.
Reported by Nathan playing real-LLM runs locally (2026-07-20).

---

## UX-1 — [FOUNDER] placeholder leaks; initial stats not grounded in the real company

> "the scraper needs to get a bit better? for instance, [founder] is the
> placeholder when in reality it should be the founder's name. Maybe we
> should just have this be uploaded at the start. Additionally, the
> valuation, headcount, etc. should be as close to accurate as possible
> based on the company uploaded. If you can't find it then it's ok to put 0."

- Diagnosis:
  - The design doc (game/personalization.md) specifies a deterministic
    "slot resolver" — **it was never built**. Slot substitution is left
    entirely to the Oracle LLM (oracle.py:83), so any turn it forgets,
    raw `[FOUNDER]`/`[COMPANY]` reaches the UI verbatim (routes.py emits
    event bodies unmodified). The researcher's no-results fallback also
    ships a literal `"[Founder]"` as the founder's *name*.
  - Initial stats: `_apply_bible_to_initial_stats` (routes.py:932) always
    uses hardcoded presets keyed on funding_stage; the bible schema has
    **no valuation/headcount/revenue fields at all**, so researched
    reality can't flow in even though the researcher does web-search.
- Fix: deterministic slot resolver applied server-side before emit;
  researcher schema gains estimated_valuation_usd / headcount /
  revenue_usd_annual (0 = unknown); routes prefers researched values for
  uploaded companies; onboarding form gains an optional founder name +
  @handle field treated as ground truth.
- Severity: high
- Status: fixed (430ee15) — pending live re-test

## UX-2 — Feed: unnamed X accounts; wants real startup-twitter cynic cast; merge tabs

> "the feed probably needs a bit more work as well - you can't have unnamed
> X accounts popping up. it would be really cool to have real startup
> twitter cynics like openspec, based beff bezos, etc. as accounts. You can
> also get rid of the tabs 'following' and 'press' and put it all under one
> 'feed' category"

- Diagnosis (two buried bugs found):
  1. **The 166-figure cast NEVER reaches the Oracle.** The corpus parser
     only matches `## ` headings; cast.md (and secret_findings.md and
     sources/systems.md) use `### ` → **parse to zero records**. And even
     if parsed, the prompt render truncates at 160K chars — the figures
     section would start at ~265K. (~40% of events are silently truncated
     too.)
  2. Reaction `handle`/`name` are optional in the Oracle tool schema, so
     the model omits them → frontend shows the `"@unknown"` defaults from
     routes.py `_feed_payload`.
  - Tabs: hardcoded array in live-feed.tsx:8-13; they filter nothing
    (cosmetic only) — merging is a pure UI edit.
- Fix: parser accepts `##`/`###`; corpus render reorders (figures before
  events) so the cast survives the cap; shortlisted events now carry
  their full text in the uncached block; reaction schema requires handle;
  Greek-chorus pool named in the prompt; new parody cynic personas added
  to cast.md (reaction-only per game/defamation_policy.md); "@unknown"
  fallback replaced with a rotating chorus handle; tabs merged to
  Feed + FBI.
- Severity: medium-high
- Status: fixed (430ee15) — pending live re-test

## UX-3 — CEO explanations too long for the 30s prediction window

> "you can also probably shorten the agent explanations. Hard to read all
> of it in 30s"

- Diagnosis: the CEO's hidden reasoning is prompted at **80-150 tokens**
  (ceo.py:76 and :148) and is exactly what's on screen when the 30s
  prediction window opens — ~110 words ≈ ~28s of reading, consuming the
  whole window. The one-line justification streams after commit and is
  fine.
- Fix: prompt to 40-70 tokens ("two short lines max"), both places.
  max_tokens stays 700 (lowering it risks truncating the JSON envelope).
- Severity: medium
- Status: fixed (430ee15) — pending live re-test

## UX-4 — Run timeline font doesn't match the main font

> "Change the run timeline font to be the same as the main font."

- Diagnosis: the timeline's row titles/outcomes already use the body font
  (Special Elite); the mismatch is the metadata line (`D 001 · T3`) and
  header, which use JetBrains Mono via `font-mono`/`.tag`
  (timeline.tsx:28,90). Pills are a shared app-wide class.
- Fix: switch the timeline row-meta line and header to the body font;
  leave the shared pill class alone (used app-wide, and the mono there is
  per the design spec's "machine output" rule).
- Severity: low
- Status: fixed (430ee15) — pending live re-test

## UX-5 — Post-mortem shows the wrong company (Vellum.ai)

> "the post mortem doesn't save anything properly - it just shows Vellum.ai
> instead of the company we picked"

- Diagnosis: two independent paths both land on mock data ("Vellum"):
  1. The post-mortem page's server fetch uses the URL slug as the run id;
     the backend keys runs by ULID → 404 → silently renders MOCK_ENDGAME.
  2. The client handoff (localStorage) is written by an `onEndgame`
     callback that captured `liveBible` in a **stale closure** (created
     once at mount, when the bible was still the mock) — so it persists
     "Vellum" even though the live header showed the right company all
     run (that state updates; the closure doesn't).
- Fix: mirror liveBible into a ref (same pattern as liveEventRef) and
  hand off `liveBibleRef.current`; the handoff takes precedence on the
  post-mortem screen, which corrects the displayed company.
- Severity: high
- Status: fixed (430ee15) — pending live re-test
