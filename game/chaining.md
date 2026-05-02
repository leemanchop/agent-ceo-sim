# Chaining — how events become arcs

A single tagged event is texture. A *chain* is what makes the run feel inevitable in retrospect. Chaining is the system that turns the world corpus from a bag of jokes into a Greek tragedy.

The unit of chaining is the **seed**: a snake_case identifier (per `world/tags.md`) that an event can `plant`, `pay_off`, or check as a `prereq`. The Oracle's per-turn job is to keep the seed graph alive — plant early, pay off on schedule, escalate when ladders are loaded, and re-roll when foreshadow goes stale.

## The foreshadow tracker

Per-run state, owned by the Oracle. Lives next to the company bible. Persists across turns.

```yaml
foreshadow:
  - seed: wrapper_disclosure_seed
    planted_turn: 3
    planted_by: EVT-PE-014
    expected_payoff_window: [6, 11]    # turns
    payoff_candidates: [EVT-PR-022, EVT-PR-031, EVT-LR-008]
    severity_floor: M                  # payoff cannot be smaller than this
    last_referenced_turn: 5            # for staleness check
    status: active                     # active | paid | expired | rerolled
    related_seeds: [demo_brittle_seed, model_brittle_seed]
    cameo_locks: { JOURNALIST_TECH: "FIG-PRESS-008" }   # whoever was implied at plant

  - seed: cofounder_disgruntled_seed
    planted_turn: 7
    planted_by: EVT-HP-019
    expected_payoff_window: [12, 22]
    payoff_candidates: [EVT-HP-041, EVT-LR-014, EVT-FE-003]
    severity_floor: L
    status: active
```

**Window math.** The window is `length_mode_foreshadow_window` (3 / 8 / 25 turns from `length_modes.md`) clipped against the current severity ramp. If the window expires unresolved, the seed gets one of three fates:

1. **Re-roll** — Oracle picks a different payoff candidate. Allowed once.
2. **Reference and decay** — payoff is verbally referenced (a journalist tweets about the rumor, then it dies) and the seed expires `paid_lite`. Costs no L/XL slot.
3. **Hard expire** — the seed dies silently. Slight `narrative_debt` penalty applied to next turn's chain_weight rolls; if `narrative_debt > 2`, Oracle is forced to plant a payoff next turn.

**Staleness** = `current_turn - last_referenced_turn`. Above the length-mode threshold (short: 2, medium: 4, long: 8) the seed is "cooling" — chain_weight on its payoff candidates is bumped to keep them in pole position.

## The seven canonical ladders

A *ladder* is a named chain template — a sequence of seed states that produces a recognizable arc. The Oracle doesn't have to follow them, but they're the spine of every recognizable run shape. Each ladder has a domain center, a typical length, and a set of escalation gates.

### 1. Wrapper-disclosure ladder (PE → PR → LR → FE)

The "your AI is GPT-4 in a trench coat" arc. Default for any `industry: ai_app | ai_infra` run unless explicitly suppressed.

```
turn N      EVT-PE-014   "[CTO] commits api_key to public repo"
                         plants: wrapper_disclosure_seed, demo_brittle_seed

turn N+3    EVT-PR-022   "@SoftwareEng_Memes screenshots the commit"
                         pays_off (lite): wrapper_disclosure_seed
                         plants: press_circling_seed

turn N+5    EVT-PR-031   "[JOURNALIST_TECH] DMs [FOUNDER] for comment"
                         requires: press_circling_seed
                         plants: medium_post_loaded_seed

turn N+7    EVT-PR-040   "404 Media: '[COMPANY] is just a Claude wrapper'"
                         pays_off: wrapper_disclosure_seed (full)
                         plants: regulator_aware_seed (low)

turn N+9    EVT-LR-008   "FTC opens informal inquiry into [COMPANY]'s AI claims"
                         requires: regulator_aware_seed
                         plants: ftc_aware_seed
```

The CEO's response choices at each rung determine which branch of the ladder fires next. "Issue a clarification" snuffs the ladder at PR-040 cost. "Double down on agi_claim" promotes the ladder to FE-class (FBI/DOJ) within 4-8 more turns.

### 2. Cofounder-flip ladder (HP → LR → FE)

```
plant         cofounder_disgruntled_seed   (HP turn, e.g. comp dispute)
escalate      cofounder_lawyered_up_seed   (HP/LR turn, e.g. Glassdoor + outside counsel)
escalate      cofounder_flipped_seed       (LR turn, cooperator agreement)
gate          unlocks END-PRISON-* family endgames
```

`cofounder_flipped_seed` is a one-way valve — once paid off, it cannot un-flip. Several endgames are gated specifically on this seed because "your CTO testified" is the highest-leverage single fact in white-collar fraud.

### 3. Demo-fraud ladder (PE → CS → PR → LR)

The Theranos-shape ladder. Plants `hardcoded_demo_seed` early, escalates through enterprise-customer discovery, peaks at on-stage failure or whistleblower.

### 4. Round-tripping ladder (FR → CS → BF → LR → FE)

The financial-irregularity spine. Most steps are S/M severity but the payoff is XL. Slow-burn; long-mode favorite.

```
plant         revenue_rounded_up_seed      (FR or CS, e.g. weird ARR claim)
plant         related_party_deal_seed      (CS, "we sell to [PEER_FOUNDER]'s company")
escalate      auditor_questioning_seed     (BF, mid-game audit beat)
escalate      restatement_seed             (BF, M severity, foreshadows bigger)
payoff        sec_subpoena_seed            (LR, L severity)
endgame_gate  doj_indictment_seed          (FE, XL)
```

### 5. Regulator-awareness ladder (any → LR → FE)

A meta-ladder. Once any `{regulator}_aware_seed` is planted, that regulator's events have a permanent +0.4 chain_weight bump. Crossing two regulators (e.g., SEC + FBI both aware) flips the run into the "joint task force" mode where FE-class events become eligible regardless of severity ramp.

### 6. Cult-of-personality ladder (FB → PR → CULT-endgame)

The founder-becomes-the-brand ladder. Distinct from fraud ladders — runs in parallel and can resolve into a positive-sum endgame (`END-CULT-*`) or feed any of the fraud ladders by planting `joe_rogan_loaded_seed`, `davos_photo_loaded_seed`, etc.

### 7. Banking-collapse ladder (BF → CS → FR → endgame)

Fast ladder. Compatible with short mode. Can fire as a side-quest or fully consume a run.

```
plant         deposit_concentration_seed   (BF, "all our cash at [BANK]")
trigger       processor_freeze_seed OR svb_style_run_seed
chain         payroll_at_risk_seed         (HP, M)
chain         vendor_unpaid_seed           (CS, M)
endgame_gate  bridge_loan_or_die_seed      (FR, XL)
```

## Chain weight — the per-turn dice

Every event has a `chain_weight` (default 1.0). Per turn the Oracle:

1. Filters events: tags ∩ length_eligibility ∩ craziness_band ∩ severity_ramp ∩ cooldown_clear ∩ prereqs_satisfied.
2. Multiplies chain_weight by stacking modifiers:
   - `+0.6` per active seed in the event's `pays_off` list
   - `+0.3` per active seed in the event's `prereqs` (already gated, but reweights among siblings)
   - `+0.4` for staleness pressure (a cooling seed)
   - `+0.5` for narrative_debt forcing
   - `-0.5` if the event already fired this run and `cooldown` not yet at 2x
   - `+industry_match_bonus` (0.0–0.5)
   - `+vibe_match_bonus` (0.0–0.5)
3. Samples weighted-without-replacement until the turn's event budget is full (length-mode dependent: short=1 main + 0-1 atmospheric, medium=1 main + 1-2 atmospheric, long=1 main + 2-4 atmospheric).

## Escalation gates

Severity climbs are not free. Each domain has a gate ladder — you cannot fire an XL event in that domain without the appropriate prereqs lit.

```
LR domain gate ladder:
  L tier requires:   any one of {sec_aware_seed, ftc_aware_seed, state_ag_aware_seed,
                                 class_action_filed_seed, whistleblower_seed}
  XL tier requires:  L-tier seed AND any one of {discovery_seed, deposition_seed,
                                                 cooperator_seed, raid_seed}

FE domain gate ladder:
  L tier requires:   sec_aware_seed AND any one fraud_heavy seed
  XL tier requires:  L-tier AND (cofounder_flipped_seed OR unencrypted_spreadsheet_seed
                                  OR documentary_loaded_seed)
```

The raid is not random. Someone has to flip first.

## Plant/payoff continuity

When a payoff fires, the slot resolver re-locks any cameo_locks from the plant. If `wrapper_disclosure_seed` was planted with `JOURNALIST_TECH = FIG-PRESS-008` (Cade Metz, say), the payoff Forbes-style headline must use Cade Metz, not a fresh roll. Continuity is the whole product. A run where Casey Newton circles you on turn 6 and Kara Swisher writes the postmortem on turn 47 is broken.

The slot resolver enforces this with **continuity locks** stored on the seed itself (`cameo_locks` field above). The Oracle is hard-prompted: *the people who appear in the payoff must be the same people who appeared in the plant, unless the event explicitly calls `slot_reroll`*.

## Cross-ladder interference

Seeds plant across ladders. The wrapper-disclosure ladder plants `regulator_aware_seed (low)` which raises the chain_weight floor for the round-tripping ladder. A run where both the AI claims and the books are dirty escalates twice as fast as either alone. This is by design — the cursed runs are the ones where every ladder is loaded.

The Oracle tracks **ladder co-activity**. Two active ladders is a normal medium-mode run. Three active is a "doom spiral" — UI gets a subtle red tint on the timeline, betting market opens new "raid before turn N" lines, and severity ramp accelerates by one tier.

## Atmospheric vs. spine events

Not every event chains. **Atmospheric events** (S severity, no plants, no prereqs) exist to fill dead air and reinforce vibe. They don't move the spine but they do consume narrative real estate, so the Oracle budgets them: at most one atmospheric per main beat in short, two in medium, four in long.

Atmospheric events are tagged `len_*` like everything else but generally lack `plants/pays_off`. Examples:
- "[FOUNDER] tweets 'i'm built different' at 2:47am, ratios self"
- "Office Aeron-chair shipment delayed; engineers on folding chairs for a week"
- "[COMPETITOR] raises $40M Series B — [FOUNDER] subtweets without naming them"

These are the connective tissue. No ladder, no chain — just texture so the spine doesn't feel like a slideshow.

## Sample chain — a 14-turn medium run, condensed

```
T1   FR   "[FOUNDER] closes $12M seed led by [TIER1_VC_PARTNER]"
          plants: tier1_friendly_seed, valuation_loaded_seed
T2   PE   "[CTO] argues for proper eval harness; [FOUNDER] says 'ship it'"
          plants: model_brittle_seed
T3   FB   "[FOUNDER] does All-In Podcast; says AGI is 'maybe 18 months'"
          plants: agi_claim_loaded_seed, all_in_loaded_seed
T4   CS   "First enterprise pilot signed; demo hardcoded for the call"
          plants: hardcoded_demo_seed, revenue_rounded_up_seed
T5   PR   atmospheric — "[COMPANY] in TechCrunch's 'Top 10 to Watch'"
T6   PE   "@SoftwareEng_Memes posts the github commit"
          pays_off (lite): model_brittle_seed
          plants: press_circling_seed, wrapper_disclosure_seed
T7   FB   "[FOUNDER] subtweets the meme account, 'cope and seethe'"
          plants: vibes_off_seed, twitter_loaded_seed
T8   PR   "[JOURNALIST_TECH] DMs [FOUNDER]"
          requires: press_circling_seed
          plants: medium_post_loaded_seed
T9   CS   "Pilot churn; customer demands a real demo"
          requires: hardcoded_demo_seed
          plants: demo_failing_seed
T10  PR   "404 Media drops the wrapper story"
          pays_off (full): wrapper_disclosure_seed
          plants: ftc_aware_seed
T11  HP   "[CTO] starts taking long lunches; lawyer rumored"
          plants: cofounder_lawyered_up_seed
T12  LR   "FTC opens inquiry into [COMPANY]'s AGI claims"
          pays_off: ftc_aware_seed
          plants: discovery_seed
T13  FB   "[FOUNDER] tweets 'we have nothing to hide,' deletes 4 min later"
          screenshots travel; vibes_off_seed escalates
T14  FE   "Pre-dawn FTC + state AG joint action; servers seized"
          pays_off: discovery_seed, demo_failing_seed
          triggers: END-PRISON-* family
```

Every payoff was planted on screen. No deus ex machina. The spine is legible in retrospect — that's the chain working.

## Anti-patterns (do not do)

- **Plant on screen, pay off off-screen.** If the wrapper is the gun on the mantel, the payoff has to fire visibly. No "and three months later, the FTC was investigating, anyway —"
- **Ladder cross-contamination soup.** Three ladders with overlapping seeds = an incomprehensible run. Cap active ladders at 3 and prefer 2.
- **Reach-around payoffs.** A payoff that uses a cameo not on the cameo_lock breaks the bit. Continuity > variety, always.
- **Severity yo-yo.** Once a run hits L, don't drop back to S except via atmospheric. Energy only flows forward.
- **Silent expiry on a major plant.** If the wrapper seed expires unpaid in medium mode, the run feels broken. Force a `paid_lite` reference at minimum.
- **Compulsory ladder execution.** The ladders are templates, not rails. The CEO's choices should be able to break a ladder midway. A run where the CEO actually does the right thing on turn 8 should be allowed to detour into `END-SUCCESS-*` territory — rare, but possible. Otherwise the agent is on a track and the spectator knows it.
