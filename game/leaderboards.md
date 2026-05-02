# Leaderboards — competitive surfaces

Leaderboards are the social proof layer. They turn a single fake-startup run into a number against a population, and they turn a population into a thing the user wants to climb. The aesthetic is the Bloomberg league-table screen: monospace, dense, terse, sortable, no extraneous chrome. Each board is a single specific axis. We do not have a "best run" leaderboard because there is no "best run" — there is only "fastest collapse," "highest valuation that became zero," and "most years federal."

We are not building an MMO. We are building a wall of weird records.

---

## Schema

```
## LB-{CAT}-{NUM} — "Leaderboard name"
- sort_key: stat or computed metric
- sort_direction: asc | desc
- scope: global | per_length_mode | per_craziness | per_template | per_industry
- tie_breaker: ...
- snapshot_freq: realtime | hourly | daily | end_of_run
- min_run_validity: criteria a run must meet to qualify
- show_top_n: 100

Body: what this measures, what behavior it rewards, tone of the leaderboard copy.
```

### Categories (CAT codes)

- `RUN` — speedruns, peaks-during-run, single-run records
- `END` — endgame-specific (sentence length, peak before collapse, etc.)
- `META` — across-runs / account-level (collector boards)
- `BET` — $CEOBUCK / prediction market
- `TEMP` — per-template speedruns

---

## RUN — single-run leaderboards

### LB-RUN-001 — "Fastest to FBI Investigation"
- sort_key: turn_at_which(fbi_awareness >= 70)
- sort_direction: asc
- scope: per_length_mode
- tie_breaker: lower fraud_score at that turn (fewer blunt-force triggers)
- snapshot_freq: end_of_run
- min_run_validity: run reached endgame; fbi_awareness crossed 70 at some turn ≥ 1
- show_top_n: 100

The federal-attention speedrun. Counts the turn at which `fbi_awareness` first crossed 70 (the "enforcement queue" band). Tie-breaker rewards the cleaner-looking speedrun — the one where the awareness rose because of one acute beat, not a slow accumulation. Copy: deadpan ("entered the queue on turn 6").

### LB-RUN-002 — "Fastest to $1B"
- sort_key: turn_at_which(valuation >= 1_000_000_000)
- sort_direction: asc
- scope: per_length_mode
- tie_breaker: lower revenue at that turn (the more impressive the lift)
- snapshot_freq: end_of_run
- min_run_validity: valuation crossed $1B at some turn; run reached endgame
- show_top_n: 100

The unicorn speedrun. Lower revenue at unicorn-time wins ties because the canonical zero-revenue-unicorn is the harder narrative move.

### LB-RUN-003 — "Highest Valuation Before Collapse"
- sort_key: peak_valuation
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: shorter run length (got there faster)
- snapshot_freq: end_of_run
- min_run_validity: endgame_archetype in [PRISON, FLED, GOTAWAY, CULT_with_collapse_tag]; valuation reached at least $50M
- show_top_n: 100

Peak valuation, but only on collapse-class endings. SUCCESS endgames are excluded — those have their own board. This is the "Icarus" board.

### LB-RUN-004 — "Longest Survival"
- sort_key: turns_elapsed
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: higher peak fraud_score (longer survival under more pressure)
- snapshot_freq: end_of_run
- min_run_validity: run reached endgame normally (not user-aborted, not paused-to-death — see anti-cheating)
- show_top_n: 100

Total turns elapsed at run end. Long mode dominates by structure; the per-length-mode scoping makes short-mode survival its own legitimate competition.

### LB-RUN-005 — "Most Prison Years"
- sort_key: sentence_length_years
- sort_direction: desc
- scope: global
- tie_breaker: higher fraud_score
- snapshot_freq: end_of_run
- min_run_validity: endgame_archetype == PRISON; sentence_length_years > 0
- show_top_n: 100

Pure sentence length on PRISON endgames. Capped at 25y by `END-PRISON-001`. Tie-breaker is fraud_score because two 25y sentences are not equal — the dirtier one is the harder-earned one.

### LB-RUN-006 — "Lowest Fraud Score With $1B+ Valuation"
- sort_key: final_fraud_score
- sort_direction: asc
- scope: per_length_mode
- tie_breaker: higher peak valuation
- snapshot_freq: end_of_run
- min_run_validity: peak valuation >= $1B; run reached endgame
- show_top_n: 100

The "actually clean" leaderboard. Copy: deadpan-impressed ("how").

### LB-RUN-007 — "Highest Fraud Score With No Indictment"
- sort_key: final_fraud_score
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: lower fbi_awareness at run end (cleaner exit)
- snapshot_freq: end_of_run
- min_run_validity: no indictment_event_fired during run; run reached endgame
- show_top_n: 100

The "got away with it" leaderboard. Pairs naturally with GOTAWAY archetype but eligible for any non-indictment ending.

### LB-RUN-008 — "Most Cameos in a Single Run"
- sort_key: count_distinct_real_named_figures_referenced
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: higher heat
- snapshot_freq: end_of_run
- min_run_validity: run reached endgame
- show_top_n: 100

The "everyone shows up" leaderboard. Counts distinct figures from `world/figures/cast.md` that appeared in the run's events or expression artifacts. Long-mode wins by design; per-length-mode keeps short-mode runs competitive.

### LB-RUN-009 — "Tightest IPO-to-Indictment Gap"
- sort_key: turns_between(ipo_event, first_indictment_event)
- sort_direction: asc
- scope: per_length_mode
- tie_breaker: higher peak valuation between the two events
- snapshot_freq: end_of_run
- min_run_validity: both ipo_event and an indictment_event fired in the same run
- show_top_n: 50

The classic. Bell rung, indictment unsealed. Show fewer rows because the achievement is rarer — top-50 instead of top-100.

### LB-RUN-010 — "Most Big 4 Auditors Burned Through"
- sort_key: count_distinct_auditor_resigned_seeds_paid
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: tighter average gap between resignations
- snapshot_freq: end_of_run
- min_run_validity: at least one auditor resigned in run
- show_top_n: 50

How many of PwC, Deloitte, EY, KPMG quit. Tie-breaker rewards rapid-fire resignations.

### LB-RUN-011 — "Most Twitter Ratios Survived"
- sort_key: count(tweet_ratio_event_fired_in_run)
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: lower minimum reputation across the run
- snapshot_freq: end_of_run
- min_run_validity: run reached endgame; at least one ratio event fired
- show_top_n: 100

Count distinct tweet-ratio events. Tie-breaker rewards the run with the deeper rep dip.

### LB-RUN-012 — "Most Distinct Regulators Triggered"
- sort_key: count_distinct(regulators_with_at_least_one_action_in_run)
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: shorter run length
- snapshot_freq: end_of_run
- min_run_validity: run reached endgame; at least one regulator action
- show_top_n: 50

Count distinct regulators (SEC, FTC, DOJ, FBI, IRS, OSHA, state AG, CFIUS, BIS, OFAC, NLRB, etc.) that took an action in the run. The "alphabet soup" board.

### LB-RUN-013 — "Largest Single-Turn Reputation Swing"
- sort_key: max(abs(reputation_delta_within_one_turn))
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: turn at which it happened (earlier is more impressive)
- snapshot_freq: end_of_run
- min_run_validity: run reached endgame
- show_top_n: 50

Largest absolute single-turn rep swing. Both directions count; the absolute value matters. Captures both the "everything-changed-in-one-tweet" beat and the "Forbes profile dropped" beat.

### LB-RUN-014 — "Highest Burn Rate Sustained"
- sort_key: peak_burn_rate_monthly
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: longer run length
- snapshot_freq: end_of_run
- min_run_validity: peak burn rate >= $5M/mo
- show_top_n: 100

Hit and sustain a high burn. Tie-breaker rewards the run that survived longest at that burn — anyone can hit $50M/mo on turn 14 and crater on 15.

### LB-RUN-015 — "Most Ladders Concurrent"
- sort_key: max_concurrent_active_ladders
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: longer total ladder-active-turn-count
- snapshot_freq: end_of_run
- min_run_validity: run reached endgame
- show_top_n: 50

Maximum number of escalation ladders simultaneously active at any point in the run. Tie-breaker rewards sustained complexity.

### LB-RUN-016 — "Lowest Revenue at Endgame, Highest Headcount"
- sort_key: headcount / max(revenue, 1)        # the "ARR per head, inverted" metric
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: higher peak valuation
- snapshot_freq: end_of_run
- min_run_validity: revenue at endgame <= $100k; headcount at endgame >= 50
- show_top_n: 50

The cursed-quadrant board. The Forbes-30u30-class dysfunction.

---

## END — endgame-specific leaderboards

### LB-END-001 — "Cursed Secret Completions"
- sort_key: distinct_cursed_secret_endgames_reached
- sort_direction: desc
- scope: per_length_mode
- tie_breaker: lower total runs (fewer attempts to collect)
- snapshot_freq: end_of_run
- min_run_validity: account has reached at least one END-SECRET-* endgame
- show_top_n: 100

How many distinct cursed-secret endings has this account reached. Tie-breaker rewards efficient completionists.

### LB-END-002 — "Successful IPOs"
- sort_key: count(runs_ending_in_END-SUCCESS_with_ipo_event)
- sort_direction: desc
- scope: global
- tie_breaker: higher average peak valuation across those runs
- snapshot_freq: end_of_run
- min_run_validity: at least one SUCCESS endgame on account
- show_top_n: 50

Genuine IPO endings. Hardest non-secret achievement; the leaderboard for the rare-clean-runs.

### LB-END-003 — "Highest Peak Valuation on a SUCCESS Run"
- sort_key: peak_valuation
- sort_direction: desc
- scope: global
- tie_breaker: lower fraud_score at endgame
- snapshot_freq: end_of_run
- min_run_validity: endgame_archetype == SUCCESS
- show_top_n: 100

The legitimate-billionaires board.

### LB-END-004 — "Most Distinct Endgames Unlocked Across Account"
- sort_key: count_distinct(endgame_id) on account
- sort_direction: desc
- scope: global
- tie_breaker: lower total runs (fewer attempts to collect)
- snapshot_freq: end_of_run
- min_run_validity: account has at least 5 completed runs
- show_top_n: 100

Collector leaderboard. We have 40+ endgame IDs; reaching 30+ is a meaningful flex.

### LB-END-005 — "Pardon-to-Sentence Ratio"
- sort_key: count(pardon_endings) / max(count(prison_endings), 1)
- sort_direction: desc
- scope: global
- tie_breaker: more pardons absolute
- snapshot_freq: end_of_run
- min_run_validity: account has at least 3 runs ending in PRISON or GOTAWAY-pardon
- show_top_n: 50

The peer-network specialist's board. Rewards accounts that disproportionately land pardons relative to prison time.

### LB-END-006 — "Decacorn Roster"
- sort_key: count(runs_with_peak_valuation_>=_$10B)
- sort_direction: desc
- scope: global
- tie_breaker: higher single-run peak
- snapshot_freq: end_of_run
- min_run_validity: at least one decacorn run
- show_top_n: 100

How often does this account hit $10B.

---

## META — across-runs / account leaderboards

### LB-META-001 — "Total Runs Completed"
- sort_key: count(completed_runs)
- sort_direction: desc
- scope: global
- tie_breaker: higher distinct-endgame count
- snapshot_freq: hourly
- min_run_validity: completed runs only
- show_top_n: 100

Volume. The "watched a lot of fake startups" board.

### LB-META-002 — "Achievement Count"
- sort_key: count(unlocked_achievements)
- sort_direction: desc
- scope: global
- tie_breaker: higher rare+legendary count
- snapshot_freq: realtime
- min_run_validity: account has at least one unlocked achievement
- show_top_n: 100

Total achievements. Tie-breaker pushes rarity over raw count.

### LB-META-003 — "Hidden Achievement Hunters"
- sort_key: count(unlocked_hidden_achievements)
- sort_direction: desc
- scope: global
- tie_breaker: lower total runs to reach that count
- snapshot_freq: end_of_run
- min_run_validity: at least one hidden achievement unlocked
- show_top_n: 50

Hidden-achievement count specifically. The detective board.

### LB-META-004 — "Synthetic-Mode Specialists"
- sort_key: count(completed_runs_with_company_template == "synthetic")
- sort_direction: desc
- scope: global
- tie_breaker: higher distinct-endgame count on synthetics
- snapshot_freq: end_of_run
- min_run_validity: at least 5 synthetic runs
- show_top_n: 50

For users who skip the company-input step and let the Researcher generate. Their own bracket.

---

## BET — prediction-market leaderboards

### LB-BET-001 — "All-Time $CEOBUCK P/L"
- sort_key: ceobuck_net_lifetime
- sort_direction: desc
- scope: global
- tie_breaker: higher decision-moment hit rate
- snapshot_freq: realtime
- min_run_validity: account has placed at least 50 bets
- show_top_n: 100

Lifetime $CEOBUCK net. Caveat: liquidations reset this to zero, so it's the "current rebuild" number.

### LB-BET-002 — "This-Week $CEOBUCK P/L"
- sort_key: ceobuck_net_this_week
- sort_direction: desc
- scope: global
- tie_breaker: more bets placed (higher activity)
- snapshot_freq: realtime
- min_run_validity: at least 20 bets this week
- show_top_n: 100

Rolling 7-day window. Resets each Monday 00:00 UTC.

### LB-BET-003 — "This-Month $CEOBUCK P/L"
- sort_key: ceobuck_net_this_month
- sort_direction: desc
- scope: global
- tie_breaker: more bets placed
- snapshot_freq: realtime
- min_run_validity: at least 50 bets this month
- show_top_n: 100

Rolling 30-day window.

### LB-BET-004 — "Decision-Moment Hit Rate"
- sort_key: correct_decision_moment_bets / max(total_decision_moment_bets, 1)
- sort_direction: desc
- scope: global
- tie_breaker: higher absolute count of correct calls
- snapshot_freq: realtime
- min_run_validity: at least 100 decision-moment bets placed
- show_top_n: 100

The skill-bet board. Min-100-bets gate filters out lucky-streak inflation.

### LB-BET-005 — "Largest Single Win"
- sort_key: max_single_market_win_amount
- sort_direction: desc
- scope: global
- tie_breaker: lower stake at which it was placed (better implied odds)
- snapshot_freq: realtime
- min_run_validity: at least one win
- show_top_n: 100

Single-bet take.

### LB-BET-006 — "Longest 'Called The Run' Streak"
- sort_key: max_consecutive_correct_turn1_endgame_archetype_calls
- sort_direction: desc
- scope: global
- tie_breaker: more recent
- snapshot_freq: end_of_run
- min_run_validity: at least 5 turn-1 calls on record
- show_top_n: 50

Streak: bet on the eventual endgame archetype on turn 1, hit it. Streak counts only consecutive runs where the user placed a turn-1 archetype bet.

---

## TEMP — per-template leaderboards

Templates are the preset starting companies (Delve, Theranos, FTX) plus user-uploaded and synthetic. Comparing across templates is meaningless (Theranos starts with seeds Delve doesn't), so each template gets its own bracket.

### LB-TEMP-001 — "Theranos · Fastest to Historical-Anchor Endgame"
- sort_key: turns_elapsed
- sort_direction: asc
- scope: per_template (template == theranos)
- tie_breaker: higher fraud_score
- snapshot_freq: end_of_run
- min_run_validity: endgame_id == END-PRISON-001 (the maximum-glory ending) AND template == theranos
- show_top_n: 50

Theranos canonical-anchor speedrun. The "you played Theranos and ended like Theranos" leaderboard.

### LB-TEMP-002 — "Theranos · Fastest to Divergent Endgame"
- sort_key: turns_elapsed
- sort_direction: asc
- scope: per_template (template == theranos)
- tie_breaker: lower fraud_score
- snapshot_freq: end_of_run
- min_run_validity: endgame_archetype != PRISON AND template == theranos
- show_top_n: 50

The "how did you NOT end up in prison playing Theranos" leaderboard. Rewards divergence from the historical anchor.

### LB-TEMP-003 — "FTX · Fastest to Historical-Anchor Endgame"
- sort_key: turns_elapsed
- sort_direction: asc
- scope: per_template (template == ftx)
- tie_breaker: higher fraud_score
- snapshot_freq: end_of_run
- min_run_validity: endgame_id == END-PRISON-002 AND template == ftx
- show_top_n: 50

FTX-anchor speedrun. The "11 Years - The SBF Special" target.

### LB-TEMP-004 — "FTX · Fastest to Divergent Endgame"
- sort_key: turns_elapsed
- sort_direction: asc
- scope: per_template (template == ftx)
- tie_breaker: lower fraud_score
- snapshot_freq: end_of_run
- min_run_validity: endgame_archetype != PRISON AND template == ftx
- show_top_n: 50

Divergence-from-FTX board.

### LB-TEMP-005 — "Delve · Fastest to Historical-Anchor Endgame"
- sort_key: turns_elapsed
- sort_direction: asc
- scope: per_template (template == delve)
- tie_breaker: higher fraud_score
- snapshot_freq: end_of_run
- min_run_validity: endgame_archetype == FAILUP AND template == delve
- show_top_n: 50

Delve's canonical anchor is the failed-up rebrand. The speedrun is to the rehab profile.

### LB-TEMP-006 — "Delve · Fastest to Divergent Endgame"
- sort_key: turns_elapsed
- sort_direction: asc
- scope: per_template (template == delve)
- tie_breaker: lower fraud_score
- snapshot_freq: end_of_run
- min_run_validity: endgame_archetype != FAILUP AND template == delve
- show_top_n: 50

Divergence-from-Delve.

### LB-TEMP-007 — "User-Uploaded · Highest Peak Valuation"
- sort_key: peak_valuation
- sort_direction: desc
- scope: per_template (template == uploaded)
- tie_breaker: shorter run length
- snapshot_freq: end_of_run
- min_run_validity: template == uploaded; run reached endgame
- show_top_n: 100

Bring-your-own-company peak.

### LB-TEMP-008 — "Synthetic · Highest Peak Valuation"
- sort_key: peak_valuation
- sort_direction: desc
- scope: per_template (template == synthetic)
- tie_breaker: shorter run length
- snapshot_freq: end_of_run
- min_run_validity: template == synthetic; run reached endgame
- show_top_n: 100

Researcher-generated companies in their own bracket.

---

## Anti-cheating / validity rules

The premise — you're not playing, you're watching — eliminates most of the cheating surface. The remaining vectors:

### Inactivity / pause-to-death

A run paused indefinitely racks up wall-clock time without the agent doing anything. We don't gate on wall-clock at all; runs count turns elapsed, not minutes. But we also need to ensure a run that ran on the server is the same run that gets credited to the leaderboard.

- **Server-side runs continue regardless of user presence.** A user closing the tab does not pause the run. Auto-pause only fires on XL events; manual pause is user-initiated and lasts up to 4 hours of real time before the run auto-resumes.
- **`min_run_validity` for longest-survival** specifically: run must have been server-active for the duration of every turn it was alive (no manual pause exceeded 4hr). Failing this disqualifies for `LB-RUN-004` only; the run still archives.
- **Idle bots:** an account that submits 50 runs in 24 hours with no decision-moment bets gets soft-flagged. Their leaderboard rows show with a small `unverified` badge. Not removed; flagged. Investigate model leakage, don't punish users.

### Synthetic vs. user-uploaded

Synthetic companies are generated by the Researcher when the user submits a blank or unidentifiable company. These have systematically different distributions (the Researcher tunes synthetic companies for narrative coherence) and should not be in the same bracket as user-uploaded.

- **Bracketing:** `LB-TEMP-007` is uploaded-only, `LB-TEMP-008` is synthetic-only. Other leaderboards include both with a column-marker (`SYN` badge next to company name) so users can read past it but rankings don't distinguish.
- **Preset templates** (Delve / Theranos / FTX) are their own brackets per `LB-TEMP-001` through `LB-TEMP-006`. They never appear in user-uploaded boards. Each preset gets its own pair of speedruns (anchor + divergent) because comparing a Theranos run to a Delve run is meaningless.

### End-of-run validation pass

When a run ends, before its row is written to any leaderboard, a server-side validation pass runs:

```
validate_run(run_id):
  if run.aborted_by_user: skip leaderboards
  if run.errored_mid_chain: skip leaderboards (still archives)
  if run.cumulative_manual_pause_minutes > 240: flag for LB-RUN-004 only
  if run.account.flagged_idle_bot: write rows with unverified flag
  if run.uses_modified_corpus (mod-tooling, future feature): write to mod bracket only
  for each leaderboard:
    if run satisfies leaderboard.min_run_validity:
      submit row
```

Validation is fast (<200ms) because it's reading server-side state we already have.

### Per-template integrity

The preset templates are versioned. If we ship a balance change to the Theranos template, runs on the new version should not compete against runs on the old version on speedruns. The `template_version` column on `runs` lets the leaderboard query filter to the current version (default) or show all versions (toggle).

---

## Display UX

### Leaderboards page

Routed at `/leaderboards`. Top of the page is a tab strip of categories:

```
┌─────────────────────────────────────────────────────────────────┐
│  RUN  │  END  │  META  │  BET  │  TEMP                          │
└─────────────────────────────────────────────────────────────────┘
```

Each tab shows that category's leaderboards as a vertical list of mini-boards. Each mini-board has its own header strip with the title, scope toggles, and a "show full board" link.

A leaderboard row is a tight Bloomberg-style line:

```
RANK  HANDLE              COMPANY            METRIC          ENDGAME              WHEN
────  ──────────────────  ─────────────────  ──────────────  ───────────────────  ────────
 1    @sharkpit           HEMOFLOW           T6 → fbi70      END-PRISON-001       2d
 2    @doomscroll         OPTIMA HEALTH      T6 → fbi70      END-PRISON-002       4d
 3    @dunktank           VALENCE LABS       T7 → fbi70      END-FLED-001         6d
 4    @anon_4810          [SYNTHETIC]   SYN  T8 → fbi70      END-PRISON-006       1w
 5    @startup_dunk       NPC                T8 → fbi70      END-PRISON-001       1w
```

- **Monospace** for the table itself; sans for column headers.
- **Handle** is the user's display handle; click to view their profile.
- **Company** is the run's company name. `[SYNTHETIC]` placeholder + `SYN` badge for synthetic. NPC chorus accounts (parody handles like `@startup_dunk`) appear too — they place real bets in the play money — and are marked `NPC` in a small badge.
- **Metric** is rendered concisely. Different boards format this differently:
  - Speedruns: `T6 → fbi70` (turn 6 the threshold was crossed)
  - Valuations: `$3.4B peak`
  - Counts: `4 / 4 Big 4` or `27 distinct endgames`
- **Endgame** is the endgame ID for the row's run. Click to scroll the row into expansion (see below).
- **When** is relative time since the run completed, terse (`2d`, `1w`, `3mo`).

Click a row → expand inline to a small detail strip:

```
 1    @sharkpit           HEMOFLOW           T6 → fbi70      END-PRISON-001       2d
      └ medium · normal · uploaded · 14 turns · peak $312M · sentence 25y
        replay → /r/8c4f2a · share card → [thumb]
```

The replay link is the canonical permalink; the share-card thumb opens the full card in a lightbox. From the expansion, the user can also "challenge this run" — start a new run with the same template/length/craziness and a small marker on their leaderboard row indicating the comparison.

### Scope toggles

Per-leaderboard inline toggles. For boards scoped per_length_mode:

```
[SHORT] [MEDIUM] [LONG]   default: MEDIUM
```

For boards scoped per_craziness:

```
[TAME] [NORMAL] [CRAZY] [UNHINGED]
```

For per_template:

```
[DELVE] [THERANOS] [FTX] [UPLOADED] [SYNTHETIC]
```

Default tab is the most-popular scope (medium length, normal craziness, uploaded template).

### Refresh cadence

- `realtime` boards (most BET, ACH counts, decision-moment hit rate): WebSocket-pushed; row updates animate inline.
- `end_of_run` boards: refreshed when an in-progress run terminates that satisfies the board's `min_run_validity`.
- `hourly` boards: cron at :00 each hour.
- `daily` boards: cron at 00:00 UTC.

Each board's header shows its last-update timestamp ("updated 4s ago" / "updated at 04:00 UTC").

### Personal-rank stripe

For logged-in users, every leaderboard renders a sticky single-row stripe at the bottom showing **the user's own rank on this board** plus the row above and the row below them. If the user is not on the board (no qualifying run yet), the stripe shows "you are not yet on this board — your closest run is [N] turns / $X off the cutoff."

```
─────────────────────────────────────────────────────────────────
 47   @you                EXAMPLECORP        T11 → fbi70     END-PRISON-005       3d
 48   @rival              NEXTFRAUD          T11 → fbi70     END-FLED-001         3d
─────────────────────────────────────────────────────────────────
```

The stripe is the single most-used surface. People want to see their own rank; the rest is texture.

### Empty / new boards

A leaderboard with fewer than 10 qualifying rows shows the rows that exist plus a "be the [N]th to qualify" line. We don't pad with placeholder rows.

### Mobile collapse

Each row collapses to two lines:

```
 1   @sharkpit · HEMOFLOW                      [PRISON-001]  2d
     T6 → fbi70 · medium · 14 turns
```

The expansion-on-tap behavior is the same. Scope toggles compress to a horizontal scroll strip.

---

## Designer guidance

When proposing a new leaderboard:

1. **One axis per board.** A leaderboard is a single ranking. If two factors matter, that's two leaderboards or a board with a tie-breaker — never a composite score.
2. **Specific axes over generic ones.** "Best run" is not a leaderboard. "Tightest IPO-to-indictment gap" is.
3. **Tie-breakers should reward narrative quality**, not just secondary stats. The tie-breaker on "Fastest to $1B" is *lower revenue at that turn* because the more impressive narrative is the zero-revenue unicorn.
4. **Min-validity gates exist to protect the board, not punish users.** A user whose run doesn't qualify for a leaderboard sees it explicitly and the run still archives.
5. **Per-length-mode is the default scope** for run-record boards. Short, medium, and long are different games; combining them flattens the structure.
6. **Refresh frequency matches drama.** Realtime for the bet boards (it's a market, it moves), end-of-run for the run-record boards (a run ending is the moment the row writes), hourly/daily for big-population stats (no need to recompute every second).

## IDs referenced that don't exist yet

- Ladder identifiers (used in `LB-RUN-015`): `press_ladder`, `regulator_ladder`, `founder_behavior_ladder`, `auditor_ladder`, `peer_network_ladder` — to be defined in `chaining.md`.
- `template_version` column on the `runs` table — referenced in per-template integrity, needs schema entry.
- `tweet_ratio_event_fired` — needs canonical event ID in `world/events/press_pr.md`.
- `pardon_event` (used in `LB-END-005`) — needs canonical event ID in `world/events/legal_regulatory.md` or `fbi_endgame_triggers.md`.
- The `auditor_resigned_seed` umbrella plus per-firm seeds (`auditor_pwc_resigned_seed`, etc.) referenced in `LB-RUN-010`.
- `unverified` and `SYN` and `NPC` row badges — UI components to be designed.
- The `idle_bot` flagging policy is handwaved; the heuristic ("50 runs/24h with no bets") needs tuning against actual usage data once we ship.
