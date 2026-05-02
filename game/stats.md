# Stats — the dashboard

The dashboard at the top of the screen carries eight numbers. That is the cap. The product is a story; the stats are the spine that makes the story legible at a glance. They are not a game in the systems-design sense — there is no skill tree, no upgrade path, no resource you spend or convert. The stats *describe* the run; they don't *drive* it. The chain drives. The stats reflect.

The eight numbers, in left-to-right order on the dashboard strip:

1. **Valuation** — what the company is "worth" on paper
2. **Revenue** — annualized run-rate, with a quality footnote
3. **Burn rate** — monthly cash burn, against runway
4. **Cash on hand** — implicit, surfaced as months of runway
5. **Employee count** — headcount
6. **Days elapsed** — in-fiction time
7. **Reputation** (a.k.a. "heat") — public opinion / press posture, signed
8. **FBI awareness** — federal-attention proxy, 0-100

Plus one **derived stat** surfaced in the post-mortem (not on the live dashboard):

- **fraud_score** — composite measure of legal exposure, computed from seeds active and stat patterns

Eight surface stats is the cap; nine on screen at once is over-Bloomberg. Cash is shown as runway not as a separate number; fraud_score is post-mortem-only.

---

## 1. Valuation

**Range:** $0 to whatever the bubble allows. Common bands:
- Pre-seed/seed: $4M–$25M
- Series A: $40M–$150M
- Series B: $150M–$800M
- Growth: $800M–$5B
- Unicorn: $1B+ (visual milestone — confetti on first crossing, no other effect)
- Decacorn: $10B+ (visual milestone — extended share-card variant unlocks)

**Color thresholds (against funding stage's expected band):**
- 1.5x band ceiling: green-pulse "🔥 hot round"
- within band: white
- 0.7x band floor: yellow
- 0.4x band floor (down round): red, with stat label changing to "VALUATION ↓"
- $0 valuation (wipeout): red, locked, no further changes

**Events that move it:**
- Funding rounds: set valuation directly to the round's post-money
- Down rounds: explicit valuation drop
- Tender / secondary at marked-up price: small bumps (+5-15%)
- Major customer wins: +5% if the customer is `enterprise` tier 1
- Public scandals: -10% to -40% depending on severity
- IPO: replaces valuation with market cap, daily volatile
- FBI raid: instant -90%, then over the next 2-3 turns trends to $0

**Voice in the live feed:**
> Bloomberg ticker: [COMPANY] mark-up implied at $312M post on the latest secondary
> Bloomberg ticker: [COMPANY] insiders pricing tender at 0.6x last round

---

## 2. Revenue (annualized)

**Range:** $0 to several billion. Tracked in plain dollars.

**The quality footnote.** Every revenue display has a tiny adjacent indicator showing **revenue quality**:
- ✅ **clean** — no `revenue_rounded_up_seed`, no `round_tripping_seed`, no `related_party_deal_seed`
- ⚠️ **soft** — one of the above seeds active, not yet paid off
- 🔴 **fictional** — multiple seeds active, restatement_seed planted

Revenue quality is *displayed alongside the number*. The number can rise; if quality drops the number turns yellow regardless. This is the key UI tell — revenue going up while quality goes down is the most legible "this is going to end badly" signal in the dashboard.

**Color thresholds (vs valuation):**
- Revenue / valuation > 0.10 → green (real business)
- 0.02–0.10 → white (normal)
- 0.005–0.02 → yellow (story stock)
- < 0.005 → orange (priced for fantasy)
- 0 with valuation > $100M → red ("zero revenue unicorn" — this is the cursed quadrant)

**Events that move it:**
- Customer-win events: +X based on tier (enterprise = 5-25% bumps, SMB = 1-3%)
- Churn events: -X based on customer concentration
- Pricing changes: ±X%
- Round-tripping events: +X but plants `revenue_rounded_up_seed` (quality degrades)
- Restatement events: -X% revenue restated *down*, dramatic
- FBI raid: revenue effectively goes to 0 by next turn

**Voice in the live feed:**
> Oracle: ARR ticked to $14.4M for the quarter. Two customers represent 71% of it.
> Oracle: Restated FY revenue to $4.2M from $11.8M. The auditor is no longer responsive.

---

## 3. Burn rate (monthly)

**Range:** $0 to ~$50M/month. Displayed as a monthly number.

**Color thresholds:** keyed to runway, not absolute burn.
- `runway = cash_on_hand / monthly_burn`
- 18+ months runway: green
- 9–18: white
- 4–9: yellow
- 1–4: orange
- < 1 month: red, "PAYROLL AT RISK" label appears

The displayed adjacent number is **runway in months** ("burn $480k/mo · 11mo runway"). Cash is implicit.

**Events that move burn:**
- Hires: +$X/mo per role tier (eng = +$30k/mo loaded, exec = +$80k/mo, intern = +$3k/mo)
- Fires / layoffs: -$X/mo, ramps over 1-2 turns
- Office expansion: +$15-50k/mo per lease
- "Founder mode" lavish events (private jet, yacht retreat): one-off cash hit + small recurring
- Marketing campaigns: -$X (one-time hit)
- Cost-cutting events ("layoff round"): step-down, plants `eng_disgruntled_seed`

**Cash on hand** moves with: round closes (large +), burn (steady -), unusual cash events (fines, settlements, mistaken deposits, processor freezes). When `processor_freeze_seed` is active, displayed cash freezes too, with a yellow lock-icon overlay.

**Voice:**
> Oracle: Burn jumped to $1.4M/mo after the GTM hires; runway 6mo at current ARR.
> Oracle: Mercury froze $11.8M of [COMPANY]'s cash pending KYC review. Payroll Friday.

---

## 4. Cash on hand (implicit, shown as runway)

Implementation note rather than separate dashboard cell. The dashboard shows runway. Hover or expand reveals exact cash.

Movements all flow from event effects. No "spend cash to do X" mechanic — the agent doesn't have that interface, the agent makes choices and cash follows.

---

## 5. Employee count

**Range:** 1 (just the founder) to ~5,000.

**Color thresholds:** keyed to revenue per employee.
- > $400k ARR/head: green ("efficient")
- $150–400k: white
- $50–150k: yellow ("bloated")
- < $50k with revenue > 0: orange ("doomed")
- Headcount > 50 with revenue = 0: red ("zero-revenue unicorn brigade")

**Events:**
- Hire events: +1 to +N depending on event scope (sometimes "hired 14 GTM people from [COMPETITOR]" lands as a single event)
- Layoff events: -X% headcount, with `eng_disgruntled_seed` and `glassdoor_loaded_seed` plants
- Cofounder departure: -1 + plants `cofounder_disgruntled_seed`
- Mass departure ("the talent exodus"): -X% triggered by `vibes_off_seed` + crisis event
- Acquisition: headcount jumps to acquirer's, dashboard ends

**Voice:**
> Oracle: Hired 22 in Q3. ARR per head fell to $89k. Slack #random is louder than #engineering.

---

## 6. Days elapsed

**Range:** 0 to whatever the run length permits. Each turn = N in-fiction days, length-mode dependent:
- Short: 1 turn ≈ 14-30 in-fiction days. 10-15 turns = 4-12 fiction-months.
- Medium: 1 turn ≈ 14-21 days. 25-35 turns = ~12-18 months.
- Long: 1 turn ≈ 7-21 days. 60-90 turns = ~18-36 months.

Days elapsed is displayed as `Day 247` style. Not interactive. Provides temporal frame for headlines ("After 14 months, [COMPANY] raises Series A").

**No color thresholds.** It's a counter. Day rollover triggers no events on its own — events drive the calendar, not the calendar driving events.

---

## 7. Reputation / Heat

**Range:** -100 to +100. Display name "heat" when negative, "rep" when positive — the same number.

This is the reaction-amplitude stat. High positive reputation means founder Twitter loves you, press is glowing, peers retweet you. High negative ("high heat") means subtweets, dunks, journalist DMs, whisper campaigns.

**Color thresholds:**
- +60 to +100: bright green ("the next [COMPARABLE_FOUNDER]"). Used by Oracle to weight `cult_of_personality` ladder events.
- +20 to +60: green
- -20 to +20: white (neutral)
- -20 to -60: orange ("circling")
- -60 to -100: red ("scorching") — the live feed gets denser with reaction posts

**Events:**
- Press coverage: ±5 to ±25 depending on outlet and angle
- Tweet ratios: -5 to -15
- Viral moments (positive): +10 to +30
- Public apology: -5 (apology spirals reduce rep, counter-intuitively)
- Cofounder lawsuit announcement: -25
- Forbes 30u30 listing: +20 + plants `forbes_curse_seed`

**Voice:**
> Oracle: [FOUNDER] trends on tech-twitter for 4 hours over a quote-tweet, posture defensive.
> Oracle: Heat is at -73. The replies under the latest post are all fire emojis from rivals.

---

## 8. FBI awareness

**Range:** 0 to 100.

The single most important escalation indicator. Most runs end with this number above 60. The FBI awareness number gates the FE-domain events (see `chaining.md`'s escalation gates).

**Banding:**
- 0–10: "off radar." Default starting state.
- 11–30: "passive monitoring." Plants `fbi_aware_seed_low`. Eligible for tip-line and informal-source events.
- 31–60: "active interest." Eligible for L-tier FE events. Field office assigned (in-fiction).
- 61–85: "enforcement queue." Subpoenas, search warrants in flight. Eligible for XL FE events.
- 86–100: "operation." Raid is imminent. Auto-pause triggers when this band is reached. Run typically ends within 2-4 turns.

**Color thresholds:**
- 0–30: white
- 31–60: yellow, with subtle pulse
- 61–85: orange, with brighter pulse
- 86–100: red, with siren-pulse animation, and the dashboard plays a subtle low-frequency hum sound (mutable; default off, on if user has audio on)

**Events that raise it:**
- `whistleblower_seed` paid off: +20-40 single jump
- SEC subpoena: +15-25 (different agency but cross-pollinates)
- Financial-irregularity events: +5-10 each
- Cofounder flips: +30-50 single jump
- "Restatement" events: +10
- Joe Rogan appearance with `joe_rogan_loaded_seed` paid off: +5-15 (saying the wrong thing in public)
- Old tweet resurfaces: +5
- `unencrypted_spreadsheet_seed` paid off (the literal `real_numbers_DO_NOT_SHARE.xlsx` gets discovered): +25

**Events that lower it:**
- Almost nothing. Once awareness is up, it stays up. Specific events ("DOJ closes investigation, no charges") can drop it -20 but they're rare.

**Voice:**
> Oracle: FBI field office in [STATE] opens a preliminary inquiry. No subpoenas yet.
> Oracle: Awareness is 67. The cooperator agreement was signed Tuesday. Two grand-jury slots are scheduled.

---

## Derived: fraud_score

**Range:** 0 to 100.

**Where it lives:** *not on the dashboard* (would be a 9th stat and a spoiler). Surfaced in:
- Post-mortem long-read (after run ends)
- Post-run share card
- Persistent betting market: "final fraud_score over/under 60.5?"
- Internal Oracle reasoning (gates some XL events)

**Formula (illustrative; tune in implementation):**

```
fraud_score =  10 * count(active_fraud_lite_seeds)
             + 25 * count(active_fraud_heavy_seeds)
             + 15 * (revenue_quality == "soft")
             + 35 * (revenue_quality == "fictional")
             + 0.4 * fbi_awareness
             + 0.3 * max(0, -reputation)        # heat contributes
             + 20 * (cofounder_flipped_seed.paid)
             + 15 * (unencrypted_spreadsheet_seed.paid)
             + 10 * (whistleblower_seed.paid)
clipped to [0, 100]
```

Why exposed only post-run: surfacing a "you are 73% fraud" in real time turns the simulation into a meter-watching game. The whole point is that the user *and* the in-fiction CEO discover the depth of the hole only at endgame. Fraud_score is a coroner's stat.

---

## Cross-stat patterns (the diagnostics)

The dashboard is read by humans, but the patterns are what tell the story. Some canonical pattern names the Oracle uses internally to weight events:

- **"Zero-revenue unicorn"** — valuation > $1B, revenue < $100k, headcount > 50. Triggers a press-circling event probability bump.
- **"The hot streak"** — reputation > 60, revenue rising, no fraud seeds, fbi_awareness ≤ 5. Probability of `forbes_curse_seed` plant goes up.
- **"The scorch"** — reputation < -50, revenue flat, fbi_awareness ≥ 30. Probability of cofounder-flip goes up.
- **"Bloat"** — burn > $1M/mo, revenue per head < $50k, runway < 6mo. Layoff event probability goes up.
- **"The doom spiral"** — fbi_awareness ≥ 60 AND revenue_quality == "fictional" AND cofounder_disgruntled_seed active. XL endgame eligible.

Pattern-detection happens in the Oracle's pre-event-selection step. It does not surface on the dashboard explicitly, but the visual gestalt — three reds + a pulse + the little revenue-quality skull — communicates it without a label.

---

## What the stats do NOT do

**No skill tree.** The CEO does not "spend points." There is no "+1 to charisma."

**No upgrade path.** Hiring a great engineer does not make `engineering_quality` a stat that gates options. The fact that the engineer was hired is in the run history; events later can reference it; no number changes.

**No resource conversion.** Cash does not "buy" reputation. The CEO can decide to hire a PR firm, that hire is an event with effects, but there is no exchange rate.

**No win condition keyed to stats.** Endgames are gated by seed configurations and sometimes stat thresholds (`requires_stats: { fraud_score: ">=70" }`) but no stat ever reads "you win when X reaches Y." Endgames are stories, stats are vital signs.

**No grind.** Numbers don't slowly accumulate in the background. Each tick is event-driven. If five turns pass with no events affecting reputation, reputation does not move five points.

---

## How a turn updates the dashboard

```
turn_end:
  for each event that fired this turn:
    apply event.effects to stats (signed deltas)
  for the CEO's chosen choice:
    apply choice.modifiers (each choice has a small bias on relevant stats)
  for any seeds that flipped state this turn (planted, paid_off, expired):
    apply seed_state_effects (small implicit deltas — e.g., revenue_quality changes)
  recompute revenue_quality (it's a function of active seeds, not stored)
  recompute fraud_score (function, not stored)
  clamp ranges
  animate dashboard cells (200ms ease, color transition if threshold crossed)
  publish to live feed if any threshold crossed (Oracle posts a Bloomberg-style line)
```

Threshold-crossing posts are important. Going from FBI awareness 28 → 32 isn't dramatic; going from 30 → 31 *crosses a band* and the Oracle posts: `"FBI moved [COMPANY] from passive to active monitoring."` That single line is what tells the spectator the dashboard moved meaningfully without making them stare at the dashboard.

## Sample dashboard at three points in a run

**Turn 1 (medium mode, "ai_app" startup):**
```
VALUATION   $14M   ●     REV  $0  ✅       BURN  $180k/mo · 18mo
HEADCOUNT   6      ●     DAY  14   ●       REP   +12   ●       FBI  0   ●
```

**Turn 8 (Series A closed, wrapper meme has dropped):**
```
VALUATION   $112M  🔥   REV  $1.2M ⚠️     BURN  $640k/mo · 11mo
HEADCOUNT   31     ●     DAY  168  ●       REP   -34   ●       FBI  4   ●
```

**Turn 14 (raid morning):**
```
VALUATION   $0     ●     REV  $1.2M 🔴     BURN  —/mo · LOCKED
HEADCOUNT   34     ●     DAY  287  ●       REP   -91   ●       FBI  92  🚨
```

The dashboard is the longest-loop visual narrative element in the product. It updates a few times per turn. It is not interactive. It is read.
