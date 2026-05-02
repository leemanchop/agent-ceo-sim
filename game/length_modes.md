# Length modes

Three pacing tiers. The mode affects turn count, severity-cap progression, foreshadow window, and how aggressively the Oracle escalates. Mode is set at run start and frozen.

## Short — "the cold open" (5-8 min real time)

- **Turn count:** 10-15 decisions
- **Arc:** seed/founding → first crisis → endgame trigger
- **Severity ramp:** S/M only for first 3 turns, L unlocks turn 4, XL endgame on final 1-2 turns
- **Foreshadow window:** 3 turns (seeds planted must pay off within 3 turns or get re-rolled)
- **Best for:** demos, share-ability, "watch one run during a meeting"
- **Endgame bias:** weighted toward fast-collapse endgames (raid, bank-run, demo-fraud-on-stage). Cuts the slow-burn fraud arcs.
- **Event filter:** `length_eligibility includes short` AND not `len_long`-only

## Medium — "the standard run" (15-25 min real time)

- **Turn count:** 25-35 decisions
- **Arc:** seed → Series A → first scandal → recovery or escalation → endgame
- **Severity ramp:** S/M turns 1-5, L turns 6-15, XL eligible turn 16+
- **Foreshadow window:** 8 turns
- **Best for:** the default. Most users land here. Most events are tuned for this mode.
- **Endgame bias:** balanced across archetypes
- **Event filter:** `length_eligibility includes medium`

## Long — "the multi-act epic" (45-60 min real time)

- **Turn count:** 60-90 decisions
- **Arc:** founding → seed → A → B → IPO/scandal → afterlife
- **Severity ramp:** gradual; L starts turn 12, XL turn 30+. Allows multi-stage seeds (a tweet at turn 4 paying off in a Forbes profile at turn 47).
- **Foreshadow window:** 25 turns
- **Best for:** power users, leaderboard chasers, runs where every cameo matters
- **Endgame bias:** weighted toward complex endings (cultural_afterlife, failed_up, cursed_secret)
- **Event filter:** `length_eligibility includes long`

## Cross-mode mechanics

**Speed control** is independent of mode — 1x / 2x / 4x affect real-time pacing, not turn count.

**Auto-pause** triggers (FBI raid, Forbes investigation drop, unicorn round, IPO bell) override speed and force a beat.

**Mini-events between turns** (atmospheric: "Agent signed lease on 12,000 sq ft office") fire ~2-4x more often in long mode to prevent dead air across the longer wall-clock window.

**Craziness band interaction:**
- `tame` mode caps severity at L regardless of length, no `craze_unhinged` events.
- `unhinged` mode in `long` is the maximum-chaos build; cryo endings, founding a religion, etc. are all in play.

## Designer guidance

When writing an event, default to `length_eligibility: [medium, long]` unless:
- It's a slow-burn multi-turn payoff → long-only
- It's a quick punchline beat → all three
- It's an endgame-only event → `len_endgame_only` + appropriate length list

Don't make medium and short mostly-disjoint sets. Short should be a *filtered* medium, not a different game.
