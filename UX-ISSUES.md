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

## UX-6 — Placeholder names still leak here and there

> "still some small bugs here and there, mostly around leaving names as
> their placeholder value. just make some crap up if needed"

- Diagnosis: the UX-1 resolver only covered bible-backed slots
  ([FOUNDER]/[COMPANY]/[CTO]/[INDUSTRY]/[PRODUCT_NOUN]). The corpus
  carries ~35 more casting-decision slots ([TIER1_VC_PARTNER],
  [JOURNALIST_TECH], [CFO], [LAWYER], [INTERN_NAME], [AUSA_NAME], …)
  that the Oracle LLM is supposed to cast and sometimes forgets. Secret
  findings also emitted raw corpus markdown unresolved.
- Fix: invention layer — curated fictional pools for every common slot
  (all invented people, defamation-safe), seeded per (run, slot) so a
  cast member stays the same person all run; longest-prefix matching
  (PEER_FOUNDER_FINTECH → PEER_FOUNDER pool); unknown slots humanize to
  lowercase prose. Applied to event cards, choices, atmospherics,
  reactions, and secret findings. CEO prompt defaults de-bracketed.
  Verified: all 677 corpus records sweep clean — zero bracket tokens
  survive resolution.
- Severity: high
- Status: fixed — pending live re-test

## UX-7 — Narrator asserts unearned fraud as fact ("autonomous production is entirely fake")

> "i don't want the story to basically insult the company - for instance i'm
> seeing something now that says 'everything is fake'. we have to remember
> that we are taking the most ridiculous course of action from what we have
> NOW - you cannot assume that the company is already fraudulent"
> (observed on nologo.com run, turn ~4: narrator stated "autonomous
> production is entirely fake" as world-fact)

- Diagnosis: a game-setup problem, per the reporter. The Oracle had no
  concept of CANON — nothing told it the company starts as a real,
  functioning business whose wrongdoing becomes true only via the CEO's
  committed choices. The offending line was model-INVENTED (not corpus
  text). Secondary: 144 of 296 events carry `prereqs:` seed-gates that
  the corpus loader never parsed, so the shortlist could nudge
  locked escalation events early.
- Fix:
  - "Presumption of operating reality" doctrine in the Oracle system
    prompt + per-turn canon reminder: unearned negativity must arrive as
    ATTRIBUTED VOICES (a thread claims / an ex-contractor alleges), never
    narrator fact; fraud-presuming corpus events get reframed as
    temptations or allegations; preset templates keep pre-seeded guilt.
  - Editor rubric gains a CANON DISCIPLINE check.
  - corpus_loader parses prereqs/prereqs_any; the Oracle shortlist
    excludes events whose seed-gates aren't satisfied by actual play,
    plus an early-turn severity ceiling (no L/XL on turn 1, no XL before
    turn 3) for runs without pre-planted seeds.
  - Verified: clean-run turn-1 shortlist contains zero locked/federal
    events; planting FBI/SEC seeds unlocks exactly the events they gate
    (106 -> 108 eligible of 180).
- Severity: high (storytelling premise + defamation posture for real
  uploaded companies)
- Status: fixed — pending live re-test

## UX-8 — Run timeline always creates a duplicate log

> "the run timeline always creates a duplicate log"

- Diagnosis: mini-action timeline rows are deduped by an id minted as
  `mini-${kind}-${Date.now()}` in the SSE adapter — every wire re-delivery
  (EventSource auto-reconnect; the backend keeps no Last-Event-ID) gets a
  fresh timestamp, so the dedup guard never matches and the row appends
  again. Large-event rows key on the stable backend event_id and never
  duplicated.
- Fix: backend emits a stable `mini_id` (turn + index) on every turn.mini;
  the adapter prefers it; the existing dedup guard now works.
- Severity: high (also inflated the perceived event repetition)
- Status: fixed — pending live re-test

## UX-9 — Valuation makes no sense ("randomly shows 1.0B without context")

> "the valuation never really makes a ton of sense - it will randomly show
> 1.0B without any context given"
> (ground truth: nologo.com run went $14M → $1,193,999,920 in 12 turns)

- Diagnosis: stat deltas were 100% LLM-invented magnitudes with no bounds
  (Stats.apply just adds); the authored `effects:` blocks on all 296
  events were parsed nowhere; and the corpus is unit-inconsistent
  (banking events use percents, hiring uses absolute USD). Bonus: the
  server emitted the RAW delta in consequences.applied while applying a
  clamped one — client dashboard drifted from server truth mid-turn.
- Fix: effects parsed + unit-normalized per event (heat folds into
  reputation; morale dropped); shortlist candidates now carry "AUTHORED
  EFFECTS (anchor)" the Oracle must match in sign/magnitude; code-side
  plausibility clamps (valuation ±40%/turn, ±3x only on XL/fundraising-
  tagged events; proportional caps on cash/revenue/burn/headcount with
  absolute floors); clamped deltas are what gets emitted; Oracle now
  emits a one-line stat_rationale rendered under the RIPPLES chips.
- Severity: high
- Status: fixed — pending live re-test

## UX-10 — Oracle events very repeated

> "the oracle generated events are very repeated"

- Diagnosis: the repetition guard was structurally dead — nothing told
  the Oracle to echo the corpus record id, so TurnRecord stored invented
  ids and `exclude_ids` never matched anything. Exclusion also only
  looked back 8 turns. Late-game: the hard severity floor + prereq gates
  collapsed the eligible pool to ~a dozen events. (DB ground truth showed
  stored events were distinct — the FELT repetition is partly UX-8's
  duplicate rows and partly same-category streaks.)
- Fix: Oracle must set source_event_id = exact corpus id (schema +
  prompt); TurnRecord stores it; exclusion is now run-wide by id AND
  normalized title; severity floor became a soft scoring preference;
  explicit variety rule (never repeat an event/arc; rotate categories).
- Severity: high
- Status: fixed — pending live re-test

## UX-11 — Setup choices don't influence the run; runs don't feel customized

> "the top bar ... need to be better correlated with the events ... the
> setup in the beginning - when we select the type of founder, company,
> etc. it should genuinely influence the types of events that occur ...
> it still doesn't really make a ton of sense/feel deeply customized"

- Diagnosis: industry had ZERO effect on selection (the filter keys on
  industry_* tags that don't exist anywhere in the corpus — a no-op);
  founder_vibe was never referenced in selection at all; craziness was
  the only working lever. The Oracle also copies corpus event bodies
  near-verbatim instead of adapting them to the company.
- Fix: affinity scoring in the shortlist — industry maps through event
  categories/tags, founder_vibe through a vibe→tags map (crypto_refugee
  → crypto/banking/offshore, ex_mckinsey → board/governance, …);
  mandatory ADAPTATION doctrine (corpus events are skeletons: product
  noun, customers, rivals, buzzwords must be THIS company's); stat
  changes correlate with events via UX-9's anchors + rationale line.
  Feed chorus made fully fictional (@AccelDaemon, @readthecommit replace
  real-person handles) per owner's either/or.
- Severity: high
- Status: fixed — pending live re-test

## UX-13 — Blank founder-tweet box; misaligned founder fields on setup

> "every time the agent makes a decision, the founder tweet box pops up at
> the bottom even if it's blank, which probably shouldn't be the case. also
> in the setup page the founder name and founder twitter urls are misaligned"

- Diagnosis: (1) the tweet artifact card rendered on phase alone —
  no check that artifact_tweet is non-empty; (2) the Field component
  adds mt-4 via `first:mt-0` to all-but-first children — inside the
  founder two-column grid row that pushed only the right column down.
- Fix: tweet card gated on a non-empty artifact; grid row neutralizes
  the Field margin (`[&>label]:mt-0`) and top-aligns items.
- Severity: low
- Status: fixed — pending live re-test

## UX-14 — Post-mortem still "doing the vellum thing"

> "i don't think the post mortem is accurate, it's just doing the vellum
> thing."

- Diagnosis: UX-5's localStorage handoff only works for the exact
  browser+slug that played the run — archive links route by ULID
  (different key), the long-read streams AFTER endgame.reached (click
  through too early → missing), and the post-mortem markdown was never
  persisted server-side, so every fallback path landed on demo copy.
- Fix: endgame_id + post_mortem_md persist on the run and surface in the
  snapshot's `endgame` block; the ULID/server fetch path now returns the
  real long-read; the client hydration fetches by ULID when the handoff
  lacks the markdown.
- Severity: high (the post-mortem is the shareable payoff)
- Status: fixed — pending live re-test

## UX-15 — Make all modes a bit crazier

> "make all the modes just a bit crazier in terms of potential events and
> the choices that the agent makes."

- Fix (script generator): endgame weights one notch spicier per band
  (normal now sends ~25% of runs to PRISON/FLED); L/XL severities unlock
  earlier in every mode AND the severity preference is now a hard
  restriction when satisfiable (runs previously came out all-S/M —
  verified 26/72 larges land L/XL post-fix); events from one craziness
  band UP are eligible with a score bonus (normal runs catch crazy
  events — verified 1-4 per short run); events that plant seeds score
  higher so the gated back-half unlocks; CEO pick-tone cycle leans
  unhinged (6/12 picks) and the prose doctrine adds "THE CEO IS RISK-ON".
- Status: shipped — tune further after play
