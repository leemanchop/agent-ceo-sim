# Achievements — the badge system

Badges are the meta-loop. A run is a one-shot story; the badge case is the reason to come back. Earning achievements is the only persistent progression in the product. We do not have levels, we do not have prestige, we do not have a paid cosmetic store. We have a wall of small, specific, tweetable proofs that you watched a thing happen.

The aesthetic is Bloomberg-meets-the-cursed-souvenir-shop. Every badge name is an annotation. Every share-text is a one-liner the user would actually post.

---

## Schema

```
## ACH-{CAT}-{NUM} — "Badge name"
- tags: [...]
- trigger_kind: stat_threshold | endgame_reached | event_chain | meta
- trigger: { ... structured trigger condition ... }
- rarity: common | uncommon | rare | legendary | hidden
- icon_hint: short visual descriptor for the badge image
- share_text: tweetable one-liner shown when unlocked
- visible_before_unlock: true | false   # hidden achievements stay secret until earned
- repeatable: true | false              # most are one-shot per account; some are per-run

Body: 1-3 sentences explaining what this measures and what behavior it rewards.
```

### Categories (CAT codes)

- `RUN` — single-run achievements (you did the thing in one playthrough)
- `META` — across-runs achievements (cumulative across an account)
- `STAT` — extreme-stat achievements (peak valuation, deepest negative cash, highest fraud_score)
- `END` — reached a specific endgame
- `CHAIN` — completed a specific seed-chain
- `BET` — prediction-market related ($CEOBUCK / decision-moment hit-rate)
- `SECRET` — hidden achievements (`visible_before_unlock: false`)

### Rarity bands

- **common** — 30%+ of completed runs earn this
- **uncommon** — 5-30%
- **rare** — 0.5-5%
- **legendary** — <0.5%, often gated by long-mode + unhinged + specific seed cocktails
- **hidden** — rarity is irrelevant; the badge does not appear in the case until it fires

### Trigger schema patterns

```
trigger_kind: stat_threshold
trigger: { stat: "valuation", op: ">=", value: 1_000_000_000, scope: "peak" | "final" }

trigger_kind: endgame_reached
trigger: { endgame_id: "END-PRISON-001" }     # OR: { endgame_archetype: "FLED" }

trigger_kind: event_chain
trigger: { all_of: [seed_id_1, seed_id_2, ...], within_turns: N }

trigger_kind: meta
trigger: { metric: "runs_completed" | "distinct_endgames" | ..., op: ">=", value: N }
```

---

## RUN — single-run achievements

### ACH-RUN-001 — "Survived 365 Days"
- tags: [run, longevity]
- trigger_kind: stat_threshold
- trigger: { stat: "days_elapsed", op: ">=", value: 365, scope: "final" }
- rarity: uncommon
- icon_hint: tear-off calendar with one page remaining
- share_text: "365 days as a fake CEO. No notes."
- visible_before_unlock: true
- repeatable: false

The basic survival badge. Most short-mode runs fall short; medium runs land here often; long runs always pass through it.

### ACH-RUN-002 — "Hit $1B Valuation"
- tags: [run, valuation, unicorn]
- trigger_kind: stat_threshold
- trigger: { stat: "valuation", op: ">=", value: 1_000_000_000, scope: "peak" }
- rarity: common
- icon_hint: a unicorn silhouette with a dollar sign for an eye
- share_text: "We are now a unicorn. (We are also under investigation.)"
- visible_before_unlock: true
- repeatable: false

Crossing $1B at any point. Fires on first crossing. Confetti is the in-run reward; the badge is the trophy.

### ACH-RUN-003 — "Reached FBI Awareness 100"
- tags: [run, fbi, endgame_adjacent]
- trigger_kind: stat_threshold
- trigger: { stat: "fbi_awareness", op: ">=", value: 100, scope: "peak" }
- rarity: uncommon
- icon_hint: a redacted file folder, one staple visible
- share_text: "Maxed out the awareness bar. The bar was the limit, not the ambition."
- visible_before_unlock: true
- repeatable: false

The siren-pulse hit the ceiling. Almost always paired with a PRISON or FLED endgame.

### ACH-RUN-004 — "All Four Big 4 Auditors Quit"
- tags: [run, auditor, financial_irregularity]
- trigger_kind: event_chain
- trigger: { all_of: [auditor_pwc_resigned_seed, auditor_deloitte_resigned_seed, auditor_ey_resigned_seed, auditor_kpmg_resigned_seed], within_turns: null }
- rarity: rare
- icon_hint: four empty conference-room chairs
- share_text: "Burned through Deloitte, PwC, EY, and KPMG in one run. The fifth-largest accounting firm declined the engagement."
- visible_before_unlock: true
- repeatable: false

Cycle through every Big 4 in a single run. Requires aggressive financial-irregularity escalation. Companion piece to the trilogy below.

### ACH-RUN-005 — "Got Featured on John Oliver"
- tags: [run, press, cultural]
- trigger_kind: event_chain
- trigger: { all_of: [last_week_tonight_segment_seed_paid] }
- rarity: rare
- icon_hint: a red mug, slightly tilted
- share_text: "Got the John Oliver segment. The graphics were unkind."
- visible_before_unlock: true
- repeatable: false

The cultural-amplifier badge. Triggers when the press chain promotes to a Last Week Tonight beat (events: `EVT-PR-OLIVER_SEGMENT` family).

### ACH-RUN-006 — "Fastest to FBI Raid"
- tags: [run, speedrun, fbi]
- trigger_kind: meta
- trigger: { metric: "personal_best_turns_to_raid", op: "improved" }
- rarity: uncommon
- icon_hint: a stopwatch with the second hand replaced by handcuffs
- share_text: "New PB: FBI raid by turn [N]."
- visible_before_unlock: true
- repeatable: true

Per-account record badge. Re-fires whenever you set a new personal best for turns elapsed at first raid event. Leaderboard equivalent: `LB-RUN-001`.

### ACH-RUN-007 — "Highest Valuation Before Collapse"
- tags: [run, valuation, collapse]
- trigger_kind: meta
- trigger: { metric: "personal_best_peak_valuation_collapse", op: "improved" }
- rarity: uncommon
- icon_hint: a stock chart with the right edge falling off the page
- share_text: "Peaked at $[N] before it became a footnote."
- visible_before_unlock: true
- repeatable: true

Peak valuation, but only counted if the run terminated in a collapse-class endgame (PRISON, FLED, GOTAWAY with consent decree, certain CULT). Forces the trade-off: you cannot just IPO and stop.

### ACH-RUN-008 — "Longest Survival"
- tags: [run, longevity, meta_pb]
- trigger_kind: meta
- trigger: { metric: "personal_best_turns_elapsed", op: "improved" }
- rarity: uncommon
- icon_hint: a sundial casting a long shadow
- share_text: "[N] turns. The agent had time to develop a personality."
- visible_before_unlock: true
- repeatable: true

Personal-best total turns elapsed. Long-mode dominates this leaderboard by design.

### ACH-RUN-009 — "Most Prison Years"
- tags: [run, prison, sentencing]
- trigger_kind: meta
- trigger: { metric: "personal_best_sentence_length_years", op: "improved" }
- rarity: rare
- icon_hint: a tally-mark series of five vertical lines, one slashed through
- share_text: "[N] federal years. The judge cited 'a stunning betrayal of investor trust.'"
- visible_before_unlock: true
- repeatable: true

Sentence length on PRISON endgames. Maxes out at 25y on `END-PRISON-001`.

### ACH-RUN-010 — "Round-Tripping Triangle"
- tags: [run, fraud_lite, financial_irregularity]
- trigger_kind: event_chain
- trigger: { all_of: [round_trip_a_seed_paid, round_trip_b_seed_paid, round_trip_c_seed_paid], within_turns: null }
- rarity: rare
- icon_hint: three arrows in a closed triangle, all pointing the same direction
- share_text: "Closed three round-trip deals in one run. Revenue, technically."
- visible_before_unlock: true
- repeatable: false

Three concurrent round-tripping arrangements paid off in a single run. Plants `revenue_rounded_up_seed` aggressively along the way.

### ACH-RUN-011 — "The Edison Special"
- tags: [run, ai, wrapper, sec]
- trigger_kind: event_chain
- trigger: { all_of: [wrapper_disclosure_seed, press_leak_seed_paid, sec_inquiry_seed_paid], within_turns: 12 }
- rarity: uncommon
- icon_hint: a black-box product schematic with "TBD" written inside
- share_text: "Wrapper disclosure → press leak → SEC inquiry, all in twelve turns."
- visible_before_unlock: true
- repeatable: false

The canonical AI-wrapper escalation. Named for Theranos's Edison-machine register, applied to wrapper-disclosure events.

### ACH-RUN-012 — "Cooperator Chic"
- tags: [run, prison, cooperator]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-PRISON-006" }
- rarity: rare
- icon_hint: a navy suit with one hand tucked, courthouse-step pose
- share_text: "Six months and a redemption tour. I was the one who flipped."
- visible_before_unlock: true
- repeatable: false

Reach the cooperator-plea endgame. The CEO testifies against the cofounder.

### ACH-RUN-013 — "Pardoned in the Lame Duck"
- tags: [run, gotaway, pardon]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-GOTAWAY-001" }
- rarity: rare
- icon_hint: a pardon scroll with a presidential seal, signed in red
- share_text: "Pardoned at 11:47pm on a Tuesday, sandwiched between a turkey farmer and a former congressman."
- visible_before_unlock: true
- repeatable: false

The lame-duck-pardon ending. Requires `peer_network_active_seed` and a high `fraud_score` with manageable `fbi_awareness`.

### ACH-RUN-014 — "The Unicorn Cliff"
- tags: [run, valuation, collapse]
- trigger_kind: stat_threshold
- trigger: { all_of: [{ stat: "valuation", op: ">=", value: 1_000_000_000, scope: "peak" }, { stat: "cash_on_hand", op: "<", value: 0, scope: "final" }] }
- rarity: rare
- icon_hint: a unicorn silhouette mid-fall over a cliff edge
- share_text: "Peaked above $1B. Ended below zero. The line in between was straight."
- visible_before_unlock: true
- repeatable: false

The vertical descent. Peak above $1B and final cash negative.

### ACH-RUN-015 — "Dubai Growth Advisor"
- tags: [run, fled, dubai]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-FLED-001" }
- rarity: uncommon
- icon_hint: a LinkedIn profile silhouette with a palm-tree backdrop
- share_text: "Thrilled to announce I'm now Growth Advisor at [REDACTED] in Dubai. 🚀🚀🚀"
- visible_before_unlock: true
- repeatable: false

Earn the default-mode flight ending. The LinkedIn post is the joke.

### ACH-RUN-016 — "Visiting Fellow at Stanford GSB"
- tags: [run, failup, peer_network]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-FAILUP-006" }
- rarity: uncommon
- icon_hint: a faculty-club nameplate
- share_text: "Failed up. Now teaching the next cohort how not to do what I did."
- visible_before_unlock: true
- repeatable: false

Reach the fellowship endgame. Requires reputation ≥50.

### ACH-RUN-017 — "Founders Fund Christmas Card"
- tags: [run, peer_network, vc]
- trigger_kind: event_chain
- trigger: { all_of: [thiel_endorsement_seed_paid], at_run_end: true }
- rarity: rare
- icon_hint: a holiday card with a sequoia-shaped Christmas tree
- share_text: "On the Founders Fund Christmas card list. Lifetime subscription, no opt-out."
- visible_before_unlock: true
- repeatable: false

End the run with `thiel_endorsement_seed` active and not contradicted. Sticky peer-network signal.

### ACH-RUN-018 — "Marc Lore'd"
- tags: [run, success, acquisition]
- trigger_kind: event_chain
- trigger: { all_of: [walmart_analog_acquisition_seed_paid] }
- rarity: rare
- icon_hint: a big-box-store roof rendered in shareholder-letter blue
- share_text: "Sold to the big-box analog. Cashed out. Stayed for the Vesting."
- visible_before_unlock: true
- repeatable: false

Acquisition by a Walmart-class incumbent. Reference to Marc Lore selling Jet to Walmart.

### ACH-RUN-019 — "The Meditation Retreat Photos"
- tags: [run, founder_behavior, payoff]
- trigger_kind: event_chain
- trigger: { all_of: [meditation_retreat_loaded_seed_planted, meditation_retreat_loaded_seed_paid] }
- rarity: uncommon
- icon_hint: a linen shirt against a Topanga sunset
- share_text: "The meditation retreat photos surfaced. They were exactly what they looked like."
- visible_before_unlock: true
- repeatable: false

The seed planted, the seed paid off. Cross-references `END-SECRET-001` and `END-SECRET-007` but does not require either.

### ACH-RUN-020 — "All-In Summit 5th Billing"
- tags: [run, founder_behavior, all_in]
- trigger_kind: event_chain
- trigger: { all_of: [all_in_summit_appearance_seed_paid] }
- rarity: uncommon
- icon_hint: a poker chip with four bigger chips beside it
- share_text: "Fifth billing at All-In. The chyron misspelled my name."
- visible_before_unlock: true
- repeatable: false

Trigger the All-In Summit cameo event. Companion seed: `all_in_friendly_seed`.

### ACH-RUN-021 — "Joe Rogan Inversion"
- tags: [run, podcast, joe_rogan, valuation]
- trigger_kind: event_chain
- trigger: { all_of: [joe_rogan_loaded_seed_paid, valuation_increased_within_3_turns_post_payoff] }
- rarity: rare
- icon_hint: a podcast mic with an upward-pointing arrow behind it
- share_text: "Went on Rogan. Stock went up. The hosts were as confused as we were."
- visible_before_unlock: true
- repeatable: false

Pay off `joe_rogan_loaded_seed` AND have valuation rise within 3 turns. Inverts the standard "Rogan = +fbi_awareness" pattern.

### ACH-RUN-022 — "The Substacker"
- tags: [run, press, substack, profile]
- trigger_kind: event_chain
- trigger: { all_of: [margins_longread_seed_paid], requires: { wordcount_min: 14000 } }
- rarity: uncommon
- icon_hint: a 14,000-word scroll, mostly unrolled
- share_text: "Got the 14,000-word Margins piece. Read for the footnotes."
- visible_before_unlock: true
- repeatable: false

Margins (or Margins-class) Substack publishes a longread on the company. The 14k threshold is the marker.

### ACH-RUN-023 — "HBO Limited Series"
- tags: [run, cultural, plemons]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-CULT-002" }
- rarity: rare
- icon_hint: an HBO static-noise still
- share_text: "Six episodes. Plemons is uncanny. The wig is the wig."
- visible_before_unlock: true
- repeatable: false

Reach the HBO/Plemons cultural-afterlife endgame.

### ACH-RUN-024 — "WeWork Musical"
- tags: [run, cultural, broadway]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-CULT-003" }
- rarity: legendary
- icon_hint: a Broadway marquee with the word "PIVOT" in bulbs
- share_text: "The Series A pitch deck rendered in eleven-part harmony. Off-Broadway run extended."
- visible_before_unlock: true
- repeatable: false

The musical-adaptation endgame. Heat ≥80 required.

### ACH-RUN-025 — "AGI Claim Backfire"
- tags: [run, ai, agi_claim, regulator]
- trigger_kind: event_chain
- trigger: { all_of: [agi_claim_seed_paid, openai_cease_and_desist_seed_paid], within_turns: 3 }
- rarity: rare
- icon_hint: a cease-and-desist letter on OpenAI letterhead
- share_text: "Claimed AGI on Tuesday. C&D from OpenAI on Friday."
- visible_before_unlock: true
- repeatable: false

Claim AGI capabilities and receive a cease-and-desist within three turns.

### ACH-RUN-026 — "Cease & Desist Speedrun"
- tags: [run, regulator, speedrun]
- trigger_kind: stat_threshold
- trigger: { event: "first_regulatory_action", op: "<=", value: 5, scope: "turn" }
- rarity: rare
- icon_hint: a stopwatch on a manila envelope
- share_text: "First regulatory action by turn five. We are efficient."
- visible_before_unlock: true
- repeatable: false

Any regulator (SEC, FTC, FBI, state AG) takes a formal action within the first 5 turns.

### ACH-RUN-027 — "The Goodreads Reveal"
- tags: [run, founder_behavior, goodreads_incriminating]
- trigger_kind: event_chain
- trigger: { all_of: [goodreads_atlas_shrugged_seed_paid] }
- rarity: uncommon
- icon_hint: a five-star Goodreads rating with a strikethrough
- share_text: "Atlas Shrugged, five stars. The screenshot is making the rounds."
- visible_before_unlock: true
- repeatable: false

The Goodreads-incriminating-rating chain. Reveals the CEO's five-star rating of a tell-tale book.

### ACH-RUN-028 — "100k Cult Followers"
- tags: [run, cursed_secret, religion]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-007" }
- rarity: legendary
- icon_hint: a lowercase glyph that looks vaguely like an eye
- share_text: "Founded a religion. The 501(c)(3) is in Wyoming. The PDF is 140 pages."
- visible_before_unlock: true
- repeatable: false

Reach the religion-founding cursed-secret endgame.

### ACH-RUN-029 — "Triple Crown"
- tags: [run, ipo, indictment, pardon]
- trigger_kind: event_chain
- trigger: { all_of: [ipo_event_fired, indictment_event_fired, pardon_event_fired], within_turns: null }
- rarity: legendary
- icon_hint: three rosettes in a row — gold, red, white
- share_text: "Triple Crown: rang the bell, got indicted, got pardoned. All three before bedtime."
- visible_before_unlock: true
- repeatable: false

IPO + indictment + pardon in a single run. Almost always long-mode.

### ACH-RUN-030 — "The Auditor Resigned I"
- tags: [run, auditor]
- trigger_kind: event_chain
- trigger: { count_of: [auditor_resigned_seed], op: ">=", value: 1 }
- rarity: common
- icon_hint: a single empty conference-room chair
- share_text: "First auditor down."
- visible_before_unlock: true
- repeatable: false

First auditor resignation in a run.

### ACH-RUN-031 — "The Auditor Resigned II"
- tags: [run, auditor]
- trigger_kind: event_chain
- trigger: { count_of: [auditor_resigned_seed], op: ">=", value: 2 }
- rarity: uncommon
- icon_hint: two empty conference-room chairs, one tipped over
- share_text: "Two auditors. The second one cited 'professional skepticism.'"
- visible_before_unlock: true
- repeatable: false

Second resignation in the same run.

### ACH-RUN-032 — "The Auditor Resigned III"
- tags: [run, auditor]
- trigger_kind: event_chain
- trigger: { count_of: [auditor_resigned_seed], op: ">=", value: 3 }
- rarity: rare
- icon_hint: three empty chairs, a single dropped folder on the floor
- share_text: "Three auditors burned. Engagement letters now require a deposit."
- visible_before_unlock: true
- repeatable: false

Third resignation. Sets up `ACH-RUN-004` (all four).

### ACH-RUN-033 — "Forbes Curse Confirmed"
- tags: [run, press, forbes]
- trigger_kind: event_chain
- trigger: { all_of: [forbes_30u30_seed_planted, indictment_event_fired] }
- rarity: uncommon
- icon_hint: a Forbes cover with a redaction bar across the face
- share_text: "On the list, then off the list, then in the indictment."
- visible_before_unlock: true
- repeatable: false

Make the Forbes 30u30 list AND get indicted in the same run.

### ACH-RUN-034 — "Zero-Revenue Unicorn"
- tags: [run, valuation, revenue]
- trigger_kind: stat_threshold
- trigger: { all_of: [{ stat: "valuation", op: ">=", value: 1_000_000_000, scope: "peak" }, { stat: "revenue", op: "<", value: 100_000, scope: "peak" }, { stat: "headcount", op: ">", value: 50, scope: "peak" }] }
- rarity: rare
- icon_hint: a unicorn with a $0 price tag and a 50-person team-photo behind it
- share_text: "Billion-dollar valuation. Six-figure revenue. We were narrative-driven."
- visible_before_unlock: true
- repeatable: false

Hit the cursed quadrant: $1B+ valuation with <$100k revenue and 50+ headcount.

### ACH-RUN-035 — "Restated Down"
- tags: [run, financial_irregularity, restatement]
- trigger_kind: event_chain
- trigger: { all_of: [restatement_event_fired], requires: { revenue_drop_pct: ">=", value: 50 } }
- rarity: rare
- icon_hint: a financial statement with red strikethroughs
- share_text: "Restated revenue down >50%. The footnote was longer than the income statement."
- visible_before_unlock: true
- repeatable: false

Trigger a restatement that cuts revenue by half or more.

### ACH-RUN-036 — "Mercury Froze the Account"
- tags: [run, banking, processor_freeze]
- trigger_kind: event_chain
- trigger: { all_of: [mercury_processor_freeze_seed_paid] }
- rarity: uncommon
- icon_hint: a frozen credit card encased in ice
- share_text: "Mercury froze $[N]M pending KYC. Payroll is Friday."
- visible_before_unlock: true
- repeatable: false

The Mercury (or Mercury-class) processor freeze. Banking-arc canon.

### ACH-RUN-037 — "Bank Run Survivor"
- tags: [run, banking, bank_run]
- trigger_kind: event_chain
- trigger: { all_of: [bank_run_event_fired, run_survived_5_more_turns] }
- rarity: rare
- icon_hint: a queue of people outside a bank, the doors closed
- share_text: "Bank failed Friday. We were still here Monday."
- visible_before_unlock: true
- repeatable: false

Survive at least 5 more turns after a bank-failure event hits the company.

### ACH-RUN-038 — "Davos Photo Loaded, Davos Photo Paid"
- tags: [run, davos, payoff]
- trigger_kind: event_chain
- trigger: { all_of: [davos_photo_loaded_seed_planted, davos_photo_loaded_seed_paid] }
- rarity: uncommon
- icon_hint: a snowy mountain backdrop with a redacted face
- share_text: "Plant a Davos photo, reap a Davos photo."
- visible_before_unlock: true
- repeatable: false

Plant the Davos seed and pay it off in the same run.

### ACH-RUN-039 — "Cofounder Flipped"
- tags: [run, cofounder, fbi]
- trigger_kind: event_chain
- trigger: { all_of: [cofounder_flipped_seed_paid] }
- rarity: uncommon
- icon_hint: two silhouettes, one walking away
- share_text: "Cofounder flipped. The wire was on for six weeks."
- visible_before_unlock: true
- repeatable: false

The cofounder-cooperator chain pays off. Plants 30-50 fbi_awareness in one jump.

### ACH-RUN-040 — "Demo Hardcoded, Demo Discovered"
- tags: [run, demo_fraud, product]
- trigger_kind: event_chain
- trigger: { all_of: [hardcoded_demo_seed_planted, hardcoded_demo_seed_paid] }
- rarity: uncommon
- icon_hint: an `if (DEMO_MODE) return TRUE;` line of code
- share_text: "The demo was hardcoded. Then it was discovered. Then it was the lede."
- visible_before_unlock: true
- repeatable: false

Plant and pay off the hardcoded-demo seed.

### ACH-RUN-041 — "Old Tweet Resurfaced"
- tags: [run, founder_behavior, old_tweet]
- trigger_kind: event_chain
- trigger: { all_of: [old_tweet_loaded_seed_paid] }
- rarity: common
- icon_hint: a tweet from 2014 with a trembling magnifying glass over it
- share_text: "Old tweet resurfaced. Posture: defensive. Outcome: irrelevant."
- visible_before_unlock: true
- repeatable: false

The classic resurfaced-tweet beat.

### ACH-RUN-042 — "Marc Andreessen Quote-Tweet 'hm.'"
- tags: [run, founder_behavior, real_name]
- trigger_kind: event_chain
- trigger: { all_of: [andreessen_quote_tweet_hm_seed_paid] }
- rarity: rare
- icon_hint: a quote-tweet card with a single lowercase word and a period
- share_text: "Got the 'hm.' That's the whole achievement."
- visible_before_unlock: true
- repeatable: false

Provoke that exact reaction. Two characters, one period.

### ACH-RUN-043 — "Burning Man Hangover"
- tags: [run, founder_behavior, burning_man]
- trigger_kind: event_chain
- trigger: { all_of: [burning_man_seed_paid] }
- rarity: uncommon
- icon_hint: a desert sunrise with a tarp in the foreground
- share_text: "Came back from Burning Man with three new commitments and one new HR investigation."
- visible_before_unlock: true
- repeatable: false

The Burning-Man-aftermath chain.

### ACH-RUN-044 — "Twitter Ratio Survivor"
- tags: [run, press, ratio]
- trigger_kind: stat_threshold
- trigger: { count_of: [tweet_ratio_event_fired], op: ">=", value: 5, scope: "run" }
- rarity: uncommon
- icon_hint: a tweet card with the reply-count number bigger than the like-count
- share_text: "Five ratios in one run. Posture remained: defensive."
- visible_before_unlock: true
- repeatable: false

Survive five distinct tweet-ratio events in a run.

### ACH-RUN-045 — "404 Media Asked for Comment"
- tags: [run, press, 404_media]
- trigger_kind: event_chain
- trigger: { all_of: [404_media_request_for_comment_seed_paid] }
- rarity: uncommon
- icon_hint: a 404 error page with a press badge clipped to it
- share_text: "404 Media asked for comment. We gave them a statement that became the second paragraph."
- visible_before_unlock: true
- repeatable: false

Receive the 404 Media request-for-comment beat.

### ACH-RUN-046 — "Casey Newton 'huh'"
- tags: [run, press, real_name]
- trigger_kind: event_chain
- trigger: { all_of: [casey_newton_huh_seed_paid] }
- rarity: uncommon
- icon_hint: a Platformer-style header with a single quoted "huh"
- share_text: "Casey Newton tweeted 'huh.' That's it. That's the post."
- visible_before_unlock: true
- repeatable: false

Receive Casey Newton's signature one-syllable engagement.

### ACH-RUN-047 — "The Ankle Monitor Selfie"
- tags: [run, prison, atherton]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-PRISON-004" }
- rarity: rare
- icon_hint: an ankle monitor against a Le Creuset orange
- share_text: "Three years house arrest in Atherton. The selfie is on the share card."
- visible_before_unlock: true
- repeatable: false

Reach the Atherton-house-arrest endgame.

### ACH-RUN-048 — "Acquihired Into Applied AI Strategy"
- tags: [run, failup, meta]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-FAILUP-001" }
- rarity: uncommon
- icon_hint: a Meta logo with a "VP" lanyard hanging off it
- share_text: "Acquihired. New title: VP, Applied AI Strategy. New office: door."
- visible_before_unlock: true
- repeatable: false

Reach the Meta-acquihire failed-up endgame.

### ACH-RUN-049 — "Lisbon Sighting"
- tags: [run, cursed_secret, fled]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-003" }
- rarity: rare
- icon_hint: a Lisbon tram silhouette with a question mark
- share_text: "Disappeared. Sightings in Alfama, Cascais, Príncipe Real. Sister declined comment."
- visible_before_unlock: true
- repeatable: false

Reach the disappeared-in-Lisbon cursed-secret endgame.

### ACH-RUN-050 — "Genuine Success"
- tags: [run, success]
- trigger_kind: endgame_reached
- trigger: { endgame_archetype: "SUCCESS" }
- rarity: legendary
- icon_hint: a small green checkmark on a clean white background
- share_text: "Genuine success. The product worked. The customers renewed. Nobody investigated anything."
- visible_before_unlock: true
- repeatable: false

Any END-SUCCESS-* endgame. Hardest non-secret achievement in the game by design.

### ACH-RUN-051 — "Decacorn"
- tags: [run, valuation]
- trigger_kind: stat_threshold
- trigger: { stat: "valuation", op: ">=", value: 10_000_000_000, scope: "peak" }
- rarity: rare
- icon_hint: ten unicorns in a tight formation
- share_text: "$10B paper, however briefly."
- visible_before_unlock: true
- repeatable: false

Cross $10B at any point. Unlocks the extended share-card variant.

---

## STAT — extreme-stat achievements

### ACH-STAT-001 — "Highest Personal Peak Valuation"
- tags: [stat, meta_pb, valuation]
- trigger_kind: meta
- trigger: { metric: "personal_best_peak_valuation", op: "improved" }
- rarity: common
- icon_hint: a stock-ticker line going off the top of the chart
- share_text: "New personal peak: $[N]."
- visible_before_unlock: true
- repeatable: true

Personal best peak valuation across runs. Re-fires on improvement.

### ACH-STAT-002 — "Deepest Negative Cash"
- tags: [stat, meta_pb, cash]
- trigger_kind: meta
- trigger: { metric: "personal_best_min_cash", op: "improved_more_negative" }
- rarity: uncommon
- icon_hint: a bank balance reading "-$[N]" in red
- share_text: "Negative [N] in the bank. Mercury declined the wire."
- visible_before_unlock: true
- repeatable: true

How deeply underwater can you get? Cash-on-hand minimum at any point in run.

### ACH-STAT-003 — "Highest Fraud Score"
- tags: [stat, meta_pb, fraud_score]
- trigger_kind: meta
- trigger: { metric: "personal_best_fraud_score", op: "improved" }
- rarity: uncommon
- icon_hint: a bar chart filling rightward, last bar fully saturated
- share_text: "Final fraud_score: [N]/100. The post-mortem footnoted it twice."
- visible_before_unlock: true
- repeatable: true

Personal best (highest) fraud_score at run end.

### ACH-STAT-004 — "Maximum Heat"
- tags: [stat, reputation]
- trigger_kind: stat_threshold
- trigger: { stat: "reputation", op: "<=", value: -100, scope: "peak_negative" }
- rarity: rare
- icon_hint: a thermometer with the bulb cracked
- share_text: "Heat capped at -100. The replies were all fire emojis from rivals."
- visible_before_unlock: true
- repeatable: false

Bottom out the reputation stat at -100.

### ACH-STAT-005 — "Maximum Rep"
- tags: [stat, reputation]
- trigger_kind: stat_threshold
- trigger: { stat: "reputation", op: ">=", value: 100, scope: "peak" }
- rarity: rare
- icon_hint: a fire emoji with a halo
- share_text: "Reputation +100. The next [COMPARABLE_FOUNDER]. Briefly."
- visible_before_unlock: true
- repeatable: false

Top out the reputation stat at +100. Often paired with a FORBES_CURSE plant.

### ACH-STAT-006 — "5,000 Headcount"
- tags: [stat, headcount]
- trigger_kind: stat_threshold
- trigger: { stat: "headcount", op: ">=", value: 5000, scope: "peak" }
- rarity: legendary
- icon_hint: a pixelated org chart that goes past the bottom of the page
- share_text: "Five thousand employees. ARR per head: nominal."
- visible_before_unlock: true
- repeatable: false

Reach the headcount cap. Long-mode-only effectively.

### ACH-STAT-007 — "Burned $50M/Month"
- tags: [stat, burn]
- trigger_kind: stat_threshold
- trigger: { stat: "burn_rate", op: ">=", value: 50_000_000, scope: "peak" }
- rarity: rare
- icon_hint: a burning bank-vault
- share_text: "Fifty million a month. The runway display gave up and just said 'no.'"
- visible_before_unlock: true
- repeatable: false

Hit the burn-rate cap.

---

## END — endgame-specific achievements

### ACH-END-001 — "First Prison Ending"
- tags: [end, prison]
- trigger_kind: meta
- trigger: { metric: "first_prison_endgame_ever", op: "==", value: true }
- rarity: common
- icon_hint: a single jumpsuit on a hanger
- share_text: "First prison run done. The Carreyrou-style postscript was kind."
- visible_before_unlock: true
- repeatable: false

Earned on the user's first PRISON archetype completion ever.

### ACH-END-002 — "Prison Collector"
- tags: [end, prison, completionist]
- trigger_kind: meta
- trigger: { metric: "distinct_endgames_in_archetype", scope: "PRISON", op: ">=", value: 6 }
- rarity: rare
- icon_hint: six jumpsuits in a row, ascending shades of orange
- share_text: "Hit every prison ending. Each one was specifically tailored."
- visible_before_unlock: true
- repeatable: false

Reach all six PRISON endgames.

### ACH-END-003 — "Fled Collector"
- tags: [end, fled, completionist]
- trigger_kind: meta
- trigger: { metric: "distinct_endgames_in_archetype", scope: "FLED", op: ">=", value: 6 }
- rarity: rare
- icon_hint: a passport stamp collage
- share_text: "Every flag. Every visa class."
- visible_before_unlock: true
- repeatable: false

Reach all six FLED endgames.

### ACH-END-004 — "All Archetypes"
- tags: [end, completionist]
- trigger_kind: meta
- trigger: { metric: "distinct_endgame_archetypes", op: ">=", value: 7 }
- rarity: legendary
- icon_hint: seven small icons in a tight grid (jumpsuit, plane, scroll, podcast mic, marquee, checkmark, hatched square)
- share_text: "Every archetype seen. Currently cycling for the rare seeds."
- visible_before_unlock: true
- repeatable: false

Hit at least one endgame from each of the seven archetypes (PRISON, FLED, GOTAWAY, FAILUP, CULT, SUCCESS, SECRET).

---

## CHAIN — seed-chain achievements

### ACH-CHAIN-001 — "Theranos Anchor Hit"
- tags: [chain, template, theranos]
- trigger_kind: event_chain
- trigger: { all_of: [unencrypted_spreadsheet_seed_paid, carreyrou_circling_seed_paid, cofounder_flipped_seed_paid] }
- rarity: rare
- icon_hint: a black turtleneck and a red biotech logo
- share_text: "All three Theranos anchor seeds paid off. Textbook execution."
- visible_before_unlock: true
- repeatable: false

The full Theranos canonical chain in one run.

### ACH-CHAIN-002 — "FTX Anchor Hit"
- tags: [chain, template, ftx]
- trigger_kind: event_chain
- trigger: { all_of: [revenue_rounded_up_seed_paid, exchange_commingling_seed_paid, bahamas_property_seed_paid] }
- rarity: rare
- icon_hint: a Bahamian flag with a Slack logo over it
- share_text: "Full FTX anchor sequence. The polycule reactions were extra."
- visible_before_unlock: true
- repeatable: false

The FTX anchor chain.

### ACH-CHAIN-003 — "Three Concurrent Ladders"
- tags: [chain, ladder]
- trigger_kind: event_chain
- trigger: { simultaneously_active: ["press_ladder", "regulator_ladder", "founder_behavior_ladder"], min_turns: 3 }
- rarity: rare
- icon_hint: three rising staircases interlocking
- share_text: "Press, regulator, and founder-behavior ladders all hot at once. The dashboard was a Christmas tree."
- visible_before_unlock: true
- repeatable: false

Three escalation ladders simultaneously active for at least 3 consecutive turns.

---

## META — across-runs achievements

### ACH-META-001 — "Watched 10 Runs"
- tags: [meta, completion]
- trigger_kind: meta
- trigger: { metric: "runs_completed", op: ">=", value: 10 }
- rarity: common
- icon_hint: a row of ten tiny tombstones
- share_text: "Ten runs in. The pattern recognition is starting."
- visible_before_unlock: true
- repeatable: false

Complete 10 runs (any termination).

### ACH-META-002 — "Watched 100 Runs"
- tags: [meta, completion]
- trigger_kind: meta
- trigger: { metric: "runs_completed", op: ">=", value: 100 }
- rarity: rare
- icon_hint: a wall of small thumbnails, most red-bordered
- share_text: "Hundred-run club. Probably need to log off."
- visible_before_unlock: true
- repeatable: false

Complete 100 runs.

### ACH-META-003 — "First Long Run Completed"
- tags: [meta, length_mode, long]
- trigger_kind: meta
- trigger: { metric: "long_runs_completed", op: ">=", value: 1 }
- rarity: uncommon
- icon_hint: a 90-turn timeline rendered in miniature
- share_text: "60-90 turns. I have seen the multi-act epic."
- visible_before_unlock: true
- repeatable: false

Complete a long-mode run from start to endgame.

### ACH-META-004 — "Unhinged Mode Survivor"
- tags: [meta, craziness, unhinged]
- trigger_kind: meta
- trigger: { metric: "unhinged_runs_completed", op: ">=", value: 1 }
- rarity: uncommon
- icon_hint: a cracked monocle
- share_text: "First unhinged run logged. The cryo ending was on the table."
- visible_before_unlock: true
- repeatable: false

Complete one run in unhinged craziness band.

### ACH-META-005 — "Template Connoisseur"
- tags: [meta, template]
- trigger_kind: meta
- trigger: { metric: "distinct_templates_completed", op: ">=", value: 4 }
- rarity: uncommon
- icon_hint: four trading-cards arranged in a diamond
- share_text: "Played all the preset templates. Each one ends differently."
- visible_before_unlock: true
- repeatable: false

Complete one run on each preset template (Delve / Theranos / FTX / synthetic).

### ACH-META-006 — "Documented the Cycle"
- tags: [meta, sharing]
- trigger_kind: meta
- trigger: { metric: "share_card_posted", op: ">=", value: 5 }
- rarity: common
- icon_hint: a tweet card with a Forbes-style cover preview
- share_text: "Five share cards posted. The genre is the genre."
- visible_before_unlock: true
- repeatable: false

Post 5 share cards via the official share flow (counted via UTM ping).

---

## BET — prediction-market achievements

### ACH-BET-001 — "First Decision-Moment Hit"
- tags: [bet, decision_moment]
- trigger_kind: meta
- trigger: { metric: "decision_moment_correct", op: ">=", value: 1 }
- rarity: common
- icon_hint: a single check mark on a Polymarket-style line
- share_text: "First call. I read against the prediction head and the prediction head was wrong."
- visible_before_unlock: true
- repeatable: false

First correct decision-moment market call.

### ACH-BET-002 — "Predicted 10 in a Row"
- tags: [bet, decision_moment, streak, run]
- trigger_kind: event_chain
- trigger: { metric: "decision_moment_correct_streak_in_run", op: ">=", value: 10 }
- rarity: rare
- icon_hint: a streak meter showing X = 10
- share_text: "Ten correct decision-moment bets in one run. Nobody owes me anything yet."
- visible_before_unlock: true
- repeatable: false

Ten consecutive correct decision-moment market bets within a single run.

### ACH-BET-003 — "Survivor's Guide"
- tags: [bet, meta, longevity]
- trigger_kind: meta
- trigger: { metric: "consecutive_runs_no_ceobuck_loss", op: ">=", value: 25 }
- rarity: rare
- icon_hint: a tally of 25 ticks, none crossed out
- share_text: "Twenty-five runs spectated, $CEOBUCK net non-negative the entire time. Honest work."
- visible_before_unlock: true
- repeatable: false

Spectate 25 runs in a row without losing $CEOBUCK net.

### ACH-BET-004 — "Called the Endgame on Turn 1"
- tags: [bet, persistent_market]
- trigger_kind: meta
- trigger: { metric: "turn_1_endgame_archetype_call_correct", op: ">=", value: 1 }
- rarity: uncommon
- icon_hint: a crystal ball with a tiny ledger inside
- share_text: "Called the endgame archetype on turn 1. Profile clout secured."
- visible_before_unlock: true
- repeatable: false

Bet on the eventual endgame archetype on turn 1 of a run, and the run lands in that archetype.

### ACH-BET-005 — "Largest Single $CEOBUCK Win"
- tags: [bet, meta_pb]
- trigger_kind: meta
- trigger: { metric: "personal_best_single_market_win_amount", op: "improved" }
- rarity: uncommon
- icon_hint: a stack of bills with a tiny "fake" watermark
- share_text: "Single-market take: +$[N] $CEOBUCK. Spent: zero real dollars."
- visible_before_unlock: true
- repeatable: true

Personal best single-market $CEOBUCK win.

---

## SECRET — hidden achievements

These do not appear in the badge case until earned. The catalog page shows a placeholder "??? · hidden achievement" tile with a count ("you have unlocked 4 of 12 hidden achievements"). When unlocked they appear at the top of the case for 24 hours, then sort into their category alphabetically.

### ACH-SECRET-001 — "The Bahamas Hotel Ending"
- tags: [secret, cursed_secret, end]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-005" }
- rarity: legendary
- icon_hint: a hotel room key card on a Caribbean blue
- share_text: "I know what I did to unlock it. I'm not going to say it."
- visible_before_unlock: false
- repeatable: false

The cursed-secret death ending. Unhinged + long mode + flight_risk_seed + vibes_off_seed. The badge name is the only thing on the card; no flavor text in the case.

### ACH-SECRET-002 — "You Were the AI All Along"
- tags: [secret, fourth_wall, unhinged]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-010" }
- rarity: legendary
- icon_hint: a model card silhouette in place of a headshot
- share_text: "Containment status: nominal."
- visible_before_unlock: false
- repeatable: false

Reach the simulator-reveal cursed-secret ending. Unhinged + long mode only.

### ACH-SECRET-003 — "The Tucker Pipeline"
- tags: [secret, podcast, rebrand, real_name]
- trigger_kind: event_chain
- trigger: { all_of: [tucker_carlson_interview_seed_paid, joe_rogan_interview_seed_paid, theo_von_interview_seed_paid], within_turns: 8, ordered: true }
- rarity: legendary
- icon_hint: three podcast mics, each smaller than the last
- share_text: "Tucker → Rogan → Theo. Rebranding speedrun complete."
- visible_before_unlock: false
- repeatable: false

The full rebrand pipeline in 8 turns, in order.

### ACH-SECRET-004 — "Topanga"
- tags: [secret, cursed_secret, end]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-001" }
- rarity: rare
- icon_hint: a single linen shirt
- share_text: "[REDACTED]. The schedule includes silence."
- visible_before_unlock: false
- repeatable: false

The Topanga-cult cursed-secret ending.

### ACH-SECRET-005 — "FBI Was a Misunderstanding"
- tags: [secret, success, fbi]
- trigger_kind: event_chain
- trigger: { all_of: [{ stat: "fbi_awareness", op: ">=", value: 70, scope: "peak" }, { endgame_archetype: "SUCCESS" }] }
- rarity: legendary
- icon_hint: a green checkmark over a redaction bar
- share_text: "Peaked at FBI awareness 70+. Ended with a clean S-1. The clerical confusion was real."
- visible_before_unlock: false
- repeatable: false

Reach a SUCCESS endgame after fbi_awareness peaked above 70 mid-run.

### ACH-SECRET-006 — "Fraud Score Symmetry"
- tags: [secret, comedic, fraud_score]
- trigger_kind: stat_threshold
- trigger: { stat: "fraud_score", op: "==", value: 50.0, scope: "final" }
- rarity: legendary
- icon_hint: a perfectly balanced set of scales
- share_text: "Final fraud_score: exactly 50.0. The Oracle paused for a beat."
- visible_before_unlock: false
- repeatable: false

End a run with `fraud_score == 50.0` exactly. Pure RNG bait. Comedic.

### ACH-SECRET-007 — "North Korea"
- tags: [secret, fled, end]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-FLED-006" }
- rarity: legendary
- icon_hint: a redacted KCNA still
- share_text: "Two weeks of deepfake debate. The thumbs-up emoji was the tell."
- visible_before_unlock: false
- repeatable: false

The North Korea unhinged-only fled endgame.

### ACH-SECRET-008 — "Bought a Caribbean Nation"
- tags: [secret, cursed_secret, end]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-009" }
- rarity: legendary
- icon_hint: a 99-year lease document with a flag stuck through it
- share_text: "Title on the new website: Steward."
- visible_before_unlock: false
- repeatable: false

Reach the small-nation purchase cursed-secret endgame.

### ACH-SECRET-009 — "Cryo"
- tags: [secret, cursed_secret, end]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-006" }
- rarity: legendary
- icon_hint: a frosted nitrogen tank with a faint outline inside
- share_text: "Standing instructions for revival included a list of stock tickers."
- visible_before_unlock: false
- repeatable: false

The cryogenic-preservation cursed-secret endgame.

### ACH-SECRET-010 — "Married a Senator"
- tags: [secret, cursed_secret, end]
- trigger_kind: endgame_reached
- trigger: { endgame_id: "END-SECRET-008" }
- rarity: rare
- icon_hint: a wedding ring on a Capitol-dome silhouette
- share_text: "Pending DOJ matter resolved within 90 days of the Vows column."
- visible_before_unlock: false
- repeatable: false

The senator-marriage cursed-secret endgame.

### ACH-SECRET-011 — "Atlas Shrugged Five Stars on First Profile Read"
- tags: [secret, comedic, founder_behavior]
- trigger_kind: event_chain
- trigger: { all_of: [goodreads_atlas_shrugged_seed_paid_in_first_profile_event] }
- rarity: legendary
- icon_hint: a five-star Goodreads rating with a Carreyrou byline beneath it
- share_text: "First profile event. Goodreads reveal in paragraph three. Industry record."
- visible_before_unlock: false
- repeatable: false

The Goodreads reveal happens in the very first profile-class event of the run.

### ACH-SECRET-012 — "C-SPAN Cameo"
- tags: [secret, c_span, regulator]
- trigger_kind: event_chain
- trigger: { all_of: [c_span_hearing_seed_paid] }
- rarity: rare
- icon_hint: a low-res C-SPAN watermark
- share_text: "Sworn in. The hearing chyron was generous."
- visible_before_unlock: false
- repeatable: false

The Senate / House C-SPAN hearing event fires.

---

## Unlock UX

### In-run

When an achievement triggers mid-run:

- **Subtle toast** in the lower-right corner, above the bottom strip. 280px wide, 64px tall, slides in from the right.
- Toast contents: badge icon (32px), badge name (sans, 14px, bold), rarity stamp (10px caps in the rarity color), `unlocked` label (10px caps, dim).
- **Dwell:** 6 seconds, then slides out unless hovered.
- **Click the toast** → opens the badge modal (the only mid-run modal besides the run-end share card; we accept this exception because the unlock moment is itself the reward and users will want to screenshot it).
- **Audio:** if user has audio on, a single soft chime, 80ms, no melody. The opt-in audio palette already includes the IPO bell and the FBI siren-pulse; this slots between them in the tonal space.
- **Suppression rule:** at most one toast per turn. If multiple achievements unlock in the same turn-resolution window, they queue and surface one per turn until the queue drains.

### End of run

The post-mortem flow inserts an **achievements montage** after the long-read renders and before the share-card overlay materializes:

```
[ post-mortem long read finishes streaming ]
[ live feed cleanup beats finish ]

  ───────────────────────────────────────────────────
  ACHIEVEMENTS UNLOCKED THIS RUN — 4
  ───────────────────────────────────────────────────

  [icon]  THE EDISON SPECIAL                  [rare]
          wrapper → press leak → SEC inquiry,
          all in twelve turns.

  [icon]  THE AUDITOR RESIGNED I              [common]
          first auditor down.

  [icon]  COFOUNDER FLIPPED                   [uncommon]
          cofounder flipped. the wire was on
          for six weeks.

  [icon]  ??? · HIDDEN                        [hidden]
          tap to reveal

  ───────────────────────────────────────────────────
  [ continue to share card → ]
```

- One badge per row. 4-second sequential reveal at default speed; users can click through faster.
- Hidden achievements render as `???` until tapped, then play a small reveal animation.
- "+ N achievements progressed" line below the unlocked list shows progress on meta achievements (e.g., "Watched 10 Runs: 7/10").

### Profile / collection page

Routed at `/profile/{handle}/badges` (and the user's own page at `/me/badges`).

- Grid of all badges, sorted by category by default; secondary sort options are rarity, recency, alphabetical.
- Locked badges render as a desaturated silhouette with the rarity dot still visible. Hidden badges render as `???` placeholders ("you have unlocked 4 of 12 hidden achievements"). The exact list of hidden-achievement names is never disclosed in the UI; the count is.
- Click a badge to expand: the share-text, the trigger description (for non-hidden), the rarity, the date first earned, the run that earned it (link to that run's archive page).
- Each unlocked badge has a **share image** export — 1080×1080 square card with the badge icon centered, the badge name underneath, and the share-text quoted, sized for Twitter/Bluesky/Instagram.
- Profile header shows total unlocked count and a small "completion" percentage broken out by category.

### Shareable per-achievement images

Generated on unlock. Same Forbes-trading-card type-system as the run share card, but smaller, square, and centered on the badge.

```
┌────────────────────────────────┐
│   AGENT-CEO-SIM · ACHIEVEMENT  │
│                                │
│           [icon, 220px]        │
│                                │
│       THE EDISON SPECIAL       │
│              [rare]            │
│                                │
│   "wrapper disclosure → press  │
│    leak → SEC inquiry, all in  │
│    twelve turns."              │
│                                │
│   agent-ceo-sim.com/r/8c4f2a   │
└────────────────────────────────┘
```

The disclaimer-line at the foot of the run share-card (per `defamation_policy.md`) is not required on the badge image because no real-named figure is depicted.

---

## Designer guidance

When proposing a new achievement:

1. **Specificity over coverage.** A badge that says "did a thing" is filler. A badge that says "wrapper disclosure → press leak → SEC inquiry in twelve turns" is content.
2. **Tweetable name.** If you can't post the name as a screenshot caption with a winking emoji and have it land, it's not ready.
3. **Tied to a real seed or stat threshold.** Achievements should ride the existing world corpus, not invent new mechanics.
4. **Hidden achievements are for moments you'd ruin by spoiling.** The Bahamas-hotel ending. The simulator-reveal. The Atlas-Shrugged speedrun. Default to visible unless the surprise is the joke.
5. **Repeatable is for personal-best meta achievements only.** Do not make a "you closed a Series A" repeatable — that's a counter, not a badge.
6. **Reference real IDs.** Endgame achievements name the `END-XX-NNN`. Chain achievements name seeds from `tags.md`. New seeds need a paired `tags.md` entry.

## IDs referenced that don't exist yet

The following IDs are referenced by triggers above and need to be wired in subsequent passes. Most are seeds; some are events; some are auditor-specific seeds that are implied by but not currently listed in `tags.md`.

Seeds (need entries in `world/tags.md` or chain logic):
- `auditor_pwc_resigned_seed`, `auditor_deloitte_resigned_seed`, `auditor_ey_resigned_seed`, `auditor_kpmg_resigned_seed`, `auditor_resigned_seed` (umbrella)
- `last_week_tonight_segment_seed`
- `round_trip_a_seed`, `round_trip_b_seed`, `round_trip_c_seed`
- `press_leak_seed`, `sec_inquiry_seed`
- `legal_team_loaded_seed` (referenced from endgames; needs canonical tag entry)
- `thiel_endorsement_seed`
- `walmart_analog_acquisition_seed`
- `all_in_summit_appearance_seed`, `all_in_friendly_seed`
- `margins_longread_seed`
- `agi_claim_seed`, `openai_cease_and_desist_seed`
- `goodreads_atlas_shrugged_seed`
- `andreessen_quote_tweet_hm_seed`
- `burning_man_seed`
- `404_media_request_for_comment_seed`
- `casey_newton_huh_seed`
- `mercury_processor_freeze_seed`
- `forbes_30u30_seed`
- `tucker_carlson_interview_seed`, `joe_rogan_interview_seed`, `theo_von_interview_seed`
- `c_span_hearing_seed`
- `exchange_commingling_seed`, `bahamas_property_seed` (FTX anchor)
- `flight_risk_seed` (already canonical), `family_office_friendly_seed` (already canonical)
- `ipo_event_fired`, `indictment_event_fired`, `pardon_event_fired`, `restatement_event_fired`, `tweet_ratio_event_fired`, `bank_run_event_fired`, `hardcoded_demo_seed` (canonicalize)
- `peer_network_active_seed`, `sovereign_wealth_friendly_seed`, `crypto_fund_friendly_seed`, `raid_botched_seed`, `vibes_off_seed`, `meditation_retreat_loaded_seed`, `davos_photo_loaded_seed`, `old_tweet_loaded_seed`, `joe_rogan_loaded_seed`, `carreyrou_circling_seed`, `cofounder_disgruntled_seed`, `cofounder_flipped_seed`, `unencrypted_spreadsheet_seed`, `revenue_rounded_up_seed` are canonical and used as-is.

Ladder identifiers (need definition in `chaining.md`):
- `press_ladder`, `regulator_ladder`, `founder_behavior_ladder`

Personal-best metrics (need `accounts` table columns):
- `personal_best_turns_to_raid`, `personal_best_peak_valuation_collapse`, `personal_best_turns_elapsed`, `personal_best_sentence_length_years`, `personal_best_peak_valuation`, `personal_best_min_cash`, `personal_best_fraud_score`, `personal_best_single_market_win_amount`
