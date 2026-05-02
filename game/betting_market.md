# Betting market — Polymarket-style spectator layer

The CEO agent is autonomous. The user is not the player; the user is the *audience*. The betting market is what gives the audience something to do with their hands during the 15-60 minutes the run unfolds. It is also the cheapest mechanism we have for converting "I watched a fun thing" into "I have skin in this run and I am going to share it."

This is **play-money**. No real currency, no chain, no tokens, no crypto. Funny-money positions, leaderboard, brag screenshots. Anything that smells like a wagering product is out of scope and out of policy.

## Markets — what gets listed

A market is a yes/no proposition with a resolution condition tied to the run's state. The Oracle proposes markets; a market scheduler maintains the live book.

### Persistent markets (open turn 1, resolve at endgame)

Listed at run start regardless of company. These are the "frame" bets.

- **Will [COMPANY] reach unicorn ($1B+ valuation) before endgame?** YES/NO
- **Does the run end in prison?** (any `END-PRISON-*`)
- **Does the run end in genuine success?** (any `END-SUCCESS-*`)
- **Does [FOUNDER] flee the country?** (any `END-FLED-*`)
- **Does the cofounder flip?** (`cofounder_flipped_seed` paid off)
- **Does Forbes / Bloomberg / 404 Media run a feature?** (`press_circling_seed` paid off at L+ severity)
- **Does the FBI raid happen on screen?** (any `EVT-FE-*` raid event fires)
- **Final fraud_score over/under 60.5?**

Frames are the same every run; the over/under-style ones use the previous-run population to set lines.

### Run-specific markets (opened by Oracle in response to seeds)

When the Oracle plants a seed, it can open a market priced off the seed's expected payoff window. Examples:

- After `wrapper_disclosure_seed` plants on turn 3 (medium mode, 8-turn window):
  - **Wrapper story breaks before turn 12?** YES/NO
- After `cofounder_disgruntled_seed` plants:
  - **Cofounder lawyers up before turn 20?** YES/NO
  - **Cofounder flips before endgame?** YES/NO
- After two regulator-aware seeds active:
  - **Joint task force action before endgame?** YES/NO

Run-specific markets close on payoff or expiry of the underlying seed, whichever comes first.

### Decision-moment markets (open during a CEO choice, ~30s window)

The headline product. When a decision moment fires (event materializes, choices appear, agent thinking starts streaming), the system opens a flash market on which choice the agent will commit to.

- **Three choices visible** ("issue clarification" / "double down" / "stay silent"): three-way market with implied odds shown.
- **15-30 sec window** to enter; window closes when the agent commits or `decision_timeout` hits, whichever first.
- **Resolution is instant** at commit. UI animates payout.

This is the highest-engagement surface. Most users will only ever bet on these.

### Market-of-markets (long mode only)

Long-mode runs open a meta-market: **how many ladders will be active simultaneously at peak?** Discrete options 1/2/3/4+. Resolves at run end based on the maximum concurrent active-ladder count.

## Pricing — how lines are set

Three regimes:

1. **Bayesian-priors line** — at market open, line is set from base rates over historical runs. "Wrapper story breaks" YES has, say, a 0.62 base rate in `industry: ai_*` runs. Opening line is YES @ 62¢.
2. **Oracle-private-belief line** — for run-specific markets where the Oracle has private state (which payoff candidate is loaded, what severity ramp is queued), the Oracle can publish a *prior* that incorporates this. The market opens biased.
3. **Crowd-adjusted line** — every entry shifts the line via simple LMSR (logarithmic market scoring rule) with a small `b` parameter. Liquidity is funny-money so we don't need real LMSR sharpness; we want responsive lines.

The Oracle does not bet against itself. The Oracle's "prior" is published as the opening line and is constant unless the model state changes (a new seed lights up that revises the probability).

## Stakes, account, leaderboard

- Every account starts with **10,000 funny-bucks** ($CEOBUCK).
- No top-up. If you lose all of it, you can liquidate the leaderboard ranking and redraw 10,000. Resets your all-time stats; "current run" stats persist.
- Per-bet cap: **20% of current balance** (prevents one-bet doom; encourages many small bets).
- Per-market cap: **40% of current liquidity on that market** (prevents whale price-pinning).
- Leaderboard surfaces:
  - All-time P/L
  - This-week P/L
  - Hit rate on decision-moment markets (skill bet)
  - Hit rate on persistent frame markets (luck bet)
  - Largest single win
  - Longest "called the run" streak (called endgame archetype on turn 1, hit it)

## The decision-moment flow with betting

This is the core 15-30 second loop. From `ui_layout.md`:

```
0.0s   Event materializes — Oracle posts the event card to the center stream.
0.5s   CEO agent reads. Hidden reasoning starts streaming (visible to user, not the agent's own choice).
1.0s   Three choices appear in the bottom-right control panel.
1.0s   Decision-moment market opens. Three-way book on which choice agent commits to.
       Lines are seeded from CEO personality model + sticky prior choices.
       UI: "Bet on what the agent does — 22 seconds left"
1.0-22s    Reasoning continues to stream. Each new reasoning chunk subtly moves the
           line (the front-end shows the line wobble in real time, like Polymarket).
22-25s     Final 3-second countdown; market closes.
25s    Agent commits. UI flash: which choice was selected, payouts settle.
25-30s Consequences ripple — Oracle posts immediate reactions to the live feed.
       Stats deltas animate on the dashboard.
       Long-running markets reprice based on new state.
```

The wobble effect on the line is critical. Watching the implied odds shift as the CEO's reasoning streams in (line drifts toward "double down" as the agent talks itself into it; user can panic-flip their bet) is the moment-to-moment hook.

## "Reasoning leaks into the line" — the implementation

The CEO agent's hidden reasoning stream is also fed to a small *prediction head* — a separate, fast model that watches the reasoning tokens and outputs a per-choice probability vector every 200ms. The prediction head's output drives the displayed line. The prediction head can be wrong; the agent can swerve at the last moment. That's the bit. (The user feels smart when they read against the prediction head.)

This separation matters: the line is not the agent committing yet. The line is the *forecast* of the commit, derived from the same stream the user is reading. It's the difference between "the price is moving because someone has inside info" and "the price is moving because the order flow is reading the same tape we are."

## Settlement edge cases

- **Tie / null choice:** if the agent enters a "wildcard" path not in the displayed three (rare; only on Editor-rewrite turns), the decision-moment market refunds. Stake returned, leaderboard P/L unchanged.
- **Endgame triggered mid-decision:** if an XL event auto-resolves the run before the decision-moment market closes (e.g., bank fails while the agent is mid-thought), refund.
- **Persistent market on a run that's abandoned by the user:** runs are server-side, they continue to terminal state regardless of user presence. Markets resolve on the actual outcome.
- **Oracle revises the seed graph (seed re-roll):** any market priced off the original seed payoff resolves at the original conditions; new market opens for the rerolled seed if applicable.
- **Suspicious-pattern flag:** play-money so the worst case is leaderboard pollution, but we still flag accounts with implausibly high decision-moment hit rates. The mechanism is not a problem to solve; we'd rather investigate model leakage than punish users.

## Markets that we do NOT open (policy)

These are funny enough as ideas to be tempting and bad enough as products to be hard nos.

- **Anything resolving on real-world events** (real stock prices, real arrests, real news). Out — that's a wagering product.
- **Anything betting on harm to a real-named person.** ("Will Marc Andreessen be canceled by 2026?" — no.)
- **Markets framed around suicide, death, or violence.** Even fictionally. We don't need the press cycle.
- **Markets that imply the user has insider information about the agent's reasoning.** All users see the same stream; we say so.

## The Greek-chorus interaction

The live feed is a chorus of reaction handles. They participate in the betting market as **NPC accounts** — pre-populated with funny-bucks, betting on the same markets the user bets on, with their bets visible in the feed. The personality voices (`@startup_dunk`, `@layoff_anon`, etc.) place bets in-character.

```
@startup_dunk: betting 4,000 $CEOBUCK on "wrapper story breaks before turn 12"
               obviously
               this is a layup

@layoff_anon: i work here. line is wrong. taking 80¢ on YES

@founder_brain: contrarian play: NO. trust the process.
                [later, after wrapper story drops]
                @founder_brain: positions, not portfolios

[The Oracle, deadpan]: NO closes at 4¢. 312 funny-bucks of @founder_brain wealth
                       transferred to the void.
```

The chorus' bets are aesthetic, not algorithmic — they exist to texturize the feed. They don't affect the line (their stakes are in a separate book) but they do make the social density of the screen feel real.

## Sample run — a betting log condensed

```
T1   Markets opened:
     - Unicorn before endgame? YES @ 38¢
     - Prison endgame?         YES @ 41¢
     - Cofounder flips?        YES @ 33¢

T3   Wrapper seed plants. New market:
     - Wrapper story breaks before T12? YES @ 71¢
     User: takes YES @ 71¢ for 1,500.

T6   Memes account screenshots commit. Line on wrapper: YES @ 88¢.
     User: holding.

T8   Decision moment — [FOUNDER] gets DM from journalist.
     Choices: ignore / hostile / charm
     Flash market opens:
       ignore @ 28¢, hostile @ 51¢, charm @ 21¢
     Reasoning stream: "—midwit move would be to play nice—"
     Line wobbles: hostile @ 67¢
     User: takes hostile @ 67¢ for 800.
     Agent commits: hostile. User wins ~ +400.

T10  Wrapper story drops. Original wrapper market resolves YES.
     User: +1,237 net.

T11  Cofounder seed plants. Line moves on flip market: YES @ 56¢.

T14  FBI raid. Run ends.
     Persistent markets settle:
       Prison? YES wins. User had 600 on YES @ 41¢: +866.
       Unicorn? NO wins. User had nothing.
     Final P/L for run: +2,103. Run rank: 47th today.
```

## Why this works

The betting layer converts a passive watch loop into a forecasting game. Every event is now also a question: *what does the model do next, and how confident am I*? It also makes share-cards more shareable — "I called the FBI raid 8 turns out" is a flex; "I watched a thing happen" is not.

Most importantly, it gives spectators a continuous task during the 15-30s decision moments, which is the longest passive stretch in the loop. Without the bet, the user is reading. With the bet, the user is *reading and deciding*, which is engagement. The decision-moment flash market is the single most important UI element in the product after the live feed.
