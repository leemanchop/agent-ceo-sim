# Events — Fundraising & Capital

Category code: `FR`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-FR-001 — "a16z passes with vibes"
- tags: [fundraising, term_sheet, subtweet, #real_name, craze_normal, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [a16z_subtweet_seed, vc_pass_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, valuation: -25_000_000 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

a16z passes on the round but Marc Andreessen quote-tweets [COMPANY]'s launch with just "hm." [FOUNDER]'s mentions are now a museum of reply guys parsing the lowercase h. *Agent must choose: [reply with a thoughtful thread] / [quote-tweet back with "hm." back at him] / [say nothing, screenshot it for the deck].*

Notes: Iconic opener. The "hm." plants a long-tail vibe seed that resurfaces in press profiles.

---

## EVT-FR-002 — "Tiger's six-hour term sheet"
- tags: [fundraising, term_sheet, valuation, capital, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [tiger_overpaid_seed, valuation_inflated_seed, due_diligence_skipped_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +400_000_000, valuation: +4_000_000_000, burn: +2_000_000, fraud_score: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Tiger Global emails a $400M Series B at a $4B valuation. Term sheet expires in 6 hours. Due diligence is one Zoom call where they ask if [COMPANY] has "AI in the loop" and nod when [FOUNDER] says "yes, deeply." *Agent must choose: [sign, panic about it later] / [counter for $500M because why not] / [pass, claim "we want strategic capital"].*

---

## EVT-FR-003 — "Masa wants to feel the energy"
- tags: [fundraising, sovereign_wealth, capital, #real_name, davos, craze_crazy, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [softbank_friendly_seed, founder_jet_lagged_seed, masa_chart_seed]
- pays_off: []
- cooldown: 3
- slots: [FOUNDER, COMPANY]
- effects: { cash: +250_000_000, valuation: +2_500_000_000, reputation: +5, fraud_score: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

SoftBank wants in but Masa needs to "feel the company's energy" via a 14-hour dinner in Tokyo. He will draw [COMPANY] on a napkin as a unicorn riding a smaller unicorn. There will be sake. *Agent must choose: [fly out, drink everything, sign the napkin] / [send the COO instead — Masa will be insulted] / [decline, claim it's a values mismatch].*

---

## EVT-FR-004 — "Cousin on the board"
- tags: [fundraising, sovereign_wealth, capital, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [board_compromise_seed, sovereign_entanglement_seed, export_control_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +200_000_000, valuation: +1_000_000_000, fraud_score: +6, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A Saudi sovereign wealth fund offers $200M but requires their cousin on the [COMPANY] board. The cousin's LinkedIn says "Strategic Advisor / Equestrian / Visionary." He has never used a laptop on camera. *Agent must choose: [accept the cousin] / [counter with an observer seat] / [walk, badmouth them on All-In].*

---

## EVT-FR-005 — "The car-dealership family office"
- tags: [fundraising, family_office, capital, craze_normal, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [unsophisticated_lp_seed, cap_table_messy_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { cash: +5_000_000, valuation: +50_000_000, reputation: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A family office run by a guy who sold a Honda dealership in Tampa wants to lead [COMPANY]'s seed round. His memo is in Comic Sans. He keeps saying "synergistic." *Agent must choose: [take his money, he's the one with the wire] / [politely pass, he'll tell everyone you're "elitist"] / [introduce him to a worse founder].*

---

## EVT-FR-006 — "Sequoia ghost"
- tags: [fundraising, term_sheet, #real_name, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [sequoia_burned_seed, competitor_funded_seed, vc_pass_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, COMPETITOR]
- effects: { reputation: -5, valuation: -100_000_000, morale: -5 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Sequoia ghosts [COMPANY] after the second meeting. Three days later you find out they led [COMPETITOR]'s round at 2x your last valuation. The partner's calendar mysteriously frees up the moment the wire clears. *Agent must choose: [subtweet "lol" with no context] / [send a measured email about "process integrity"] / [call your lawyer about NDAs].*

---

## EVT-FR-007 — "YC offers a spot, you have $80M"
- tags: [fundraising, capital, founder_behavior, craze_normal, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [yc_pettiness_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +2, valuation: +25_000_000 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Y Combinator offers [COMPANY] a W26 batch spot. [COMPANY] has already raised $80M from Tiger. [FOUNDER] now has to decide whether the YC sticker on the deck is worth the optics of doing demo day in front of pre-seed founders. *Agent must choose: [accept, take the photo, post "humbled"] / [decline politely] / [decline with a thread about why YC is "for an earlier era"].*

---

## EVT-FR-008 — "Anonymous wire, memo: 'for the mission'"
- tags: [fundraising, capital, banking, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [mystery_lp_seed, kyc_problem_seed, fbi_aware_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +5_000_000, fraud_score: +8, fbi_awareness: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

An anonymous LP wires $5M to [COMPANY] with no paperwork. The wire memo says "for the mission." The originating bank is in Cyprus. *Agent must choose: [keep it, ask no questions] / [return it, file a SAR] / [keep it, issue a SAFE backdated to last quarter].*

---

## EVT-FR-009 — "Chamath-adjacent SPAC"
- tags: [fundraising, spac, ipo, valuation, #real_name, craze_crazy, sev_L, len_long]
- severity: L
- prereqs: []
- prereqs_any: [valuation_inflated_seed]
- plants: [spac_path_seed, retail_bagholders_seed, sec_aware_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { valuation: +12_000_000_000, fraud_score: +10, sec_aware: +1, heat: +8 }
- length_eligibility: [long]
- chain_weight: 1.5

A SPAC sponsor whose Twitter bio reads "Chamath-adjacent" offers to take [COMPANY] public at $12B. The PIPE is half a guy in Miami and half "TBD." The projections show 800% revenue growth in year two of a slide deck that doesn't say what year one is. *Agent must choose: [merge, ring the bell, wear sunglasses indoors] / [counter for $20B, see how desperate he is] / [pass, leak the deck to dunk on it].*

---

## EVT-FR-010 — "Tender offer (i.e., you cash out)"
- tags: [fundraising, secondary, tender, founder_behavior, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [founder_secondary_seed, employee_resentment_seed, glassdoor_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [FOUNDER, COMPANY]
- effects: { cash: -40_000_000, reputation: -4, morale: -8, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] can do a "tender offer" that's really just [FOUNDER] cashing out $40M of personal shares while telling employees the round is "for the mission." Someone will eventually pull the 4(a)(7) filing. *Agent must choose: [take the $40M, buy a house in Atherton] / [take $20M, look reasonable] / [decline, let the cap table breathe].*

---

## EVT-FR-011 — "Crypto fund, in tokens"
- tags: [fundraising, crypto_fund, crypto, token_launch, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [token_offer_seed, sec_aware_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +0, valuation: +200_000_000, fraud_score: +5, sec_aware: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A crypto fund offers [COMPANY] $25M but only in their own token, $MISSION, currently trading on a single Korean exchange. Vesting is "trust-based." *Agent must choose: [take the tokens, mark them at face value on the cap table] / [insist on USDC] / [pass, post "stay safu" on Twitter].*

---

## EVT-FR-012 — "a16z crypto wants to lead the SaaS round"
- tags: [fundraising, crypto_fund, agent_pivot, #real_name, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [pivot_pressure_seed, a16z_subtweet_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { cash: +60_000_000, valuation: +600_000_000, fraud_score: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Andreessen Horowitz wants in, but only out of the a16z crypto fund. [COMPANY] is a SaaS company. The deal is contingent on adding "onchain" to the deck. *Agent must choose: [take the money, ship a meaningless smart contract] / [take the money, don't pivot, hope nobody notices] / [pass, insist on the apps fund or nothing].*

---

## EVT-FR-013 — "Down round vs. structured deal"
- tags: [fundraising, down_round, term_sheet, valuation, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [valuation_inflated_seed]
- plants: [structured_deal_seed, employee_options_underwater_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +75_000_000, valuation: -1_000_000_000, morale: -10, fraud_score: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

[COMPANY] can take a clean down round at half the last valuation, or a "flat" structured deal with 4x liquidation preference, ratchets nobody at the firm understands, and PIK dividends that compound monthly. *Agent must choose: [take the down round, eat the headline] / [take the structured deal, claim "flat round" in the press] / [extend the runway with venture debt, push the problem to next year].*

---

## EVT-FR-014 — "Founders Fund DM: 'are u based'"
- tags: [fundraising, term_sheet, #real_name, founder_behavior, craze_crazy, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [founders_fund_friendly_seed, based_test_passed_seed]
- pays_off: []
- cooldown: 2
- slots: [FOUNDER]
- effects: { reputation: +3, valuation: +150_000_000 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A Founders Fund partner DMs [FOUNDER]: "are u based." There is no further context. The entire round depends on the response. *Agent must choose: ["yes" with no punctuation] / [a single fire emoji] / [a 600-word reply about Strauss and Burnham].*

---

## EVT-FR-015 — "Khosla wants you to say AI"
- tags: [fundraising, ai, agi_claim, #real_name, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [ai_pivot_seed, deck_padding_seed, wrapper_disclosure_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { valuation: +300_000_000, fraud_score: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A Khosla partner says [COMPANY]'s TAM is too small. Solution: add "AI" to the deck. The product is a [PRODUCT_NOUN] with no AI in it. He suggests calling the existing if-statements "agentic." *Agent must choose: [rebrand to AI overnight, change the tagline] / [add an "AI roadmap" slide and lie about timing] / [hold the line, lose the term sheet].*

---

## EVT-FR-016 — "Lightspeed: fire your co-founder"
- tags: [fundraising, term_sheet, cofounder, executive, craze_crazy, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [cofounder_disgruntled_seed, cofounder_flipped_seed]
- pays_off: []
- cooldown: 4
- slots: [CTO, FOUNDER, COMPANY]
- effects: { cash: +80_000_000, morale: -15, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Lightspeed's term sheet is generous. The only contingency: [CTO] has to go. The partner says "founder market fit issue" and won't elaborate on Zoom. *Agent must choose: [fire [CTO], take the money] / [keep [CTO], walk] / [demote [CTO] to "Chief Architect" and hope they don't notice].*

---

## EVT-FR-017 — "The angel with a 19-year-old son"
- tags: [fundraising, capital, intern, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [shadow_intern_seed, board_compromise_seed]
- pays_off: []
- cooldown: 2
- slots: [FOUNDER, COMPANY]
- effects: { cash: +2_000_000, reputation: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

An angel investor wants to put $2M in [COMPANY] but only if [FOUNDER] lets his 19-year-old son Brayden shadow them for the summer. Brayden's last LinkedIn post was a ten-slide deck called "Why Web3 Was Right All Along." *Agent must choose: [accept, give Brayden a desk near the kitchen] / [decline, lose the check] / [accept, then give Brayden an impossible "research project" about the printer].*

---

## EVT-FR-018 — "Korean conglomerate wants 47 countries"
- tags: [fundraising, capital, sovereign_wealth, partnership, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [exclusive_distribution_seed, contract_landmine_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { cash: +50_000_000, valuation: +400_000_000, fraud_score: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A Korean conglomerate's venture arm wants to put $50M into [COMPANY]. They also want exclusive distribution rights for the [PRODUCT_NOUN] in 47 countries, three of which are not real countries on a normal map. *Agent must choose: [sign, deal with it at Series C] / [counter to non-exclusive] / [pass, the term sheet is a trap].*

---

## EVT-FR-019 — "Party round of 60"
- tags: [fundraising, capital, founder_behavior, #real_name, craze_crazy, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [cap_table_messy_seed, podcast_loaded_seed, joe_rogan_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { cash: +15_000_000, valuation: +200_000_000, reputation: +2, fraud_score: +2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[COMPANY] can raise a "party round" with 60 angels including 4 podcast hosts, 2 NBA players, and Logan Paul. Each will tweet about it on a different Tuesday. The cap table will look like a CVS receipt. *Agent must choose: [run the party, ride the engagement] / [cap it at 20 strategic angels] / [skip the party, lose the distribution].*

---

## EVT-FR-020 — "Coatue: don't be cringe on Twitter"
- tags: [fundraising, term_sheet, founder_behavior, subtweet, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [twitter_muzzle_seed, founder_post_pressure_seed]
- pays_off: []
- cooldown: 3
- slots: [FOUNDER, COMPANY]
- effects: { cash: +120_000_000, valuation: +1_200_000_000, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Coatue wants to lead at $1.2B. Term sheet section 7.3 contains a clause requiring [FOUNDER] to "not be cringe on Twitter." It is not defined. *Agent must choose: [sign, log off Twitter forever] / [sign, post through it anyway] / [redline the clause, watch them walk].*

---

## EVT-FR-021 — "SAFE from a fan"
- tags: [fundraising, capital, founder_behavior, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [parasocial_lp_seed, valuation_inflated_seed]
- pays_off: []
- cooldown: 2
- slots: [FOUNDER, COMPANY]
- effects: { cash: +250_000, valuation: +2_000_000_000, reputation: +1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A SAFE with a $2B post-money cap from a fan [FOUNDER] has never met arrives in [COMPANY]'s inbox. Subject line: "I believe in you king." Wire is real. *Agent must choose: [countersign, reset the next round's price] / [decline, recommend they buy index funds] / [countersign, post the SAFE on Twitter as a flex].*

---

## EVT-FR-022 — "Tiger at 50x ARR"
- tags: [fundraising, capital, valuation, revenue_recognition, craze_crazy, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [valuation_inflated_seed, revenue_rounded_up_seed, tiger_overpaid_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +100_000_000, valuation: +1_000_000_000, fraud_score: +6 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Tiger wants to put $100M in [COMPANY] at 50x ARR. [COMPANY]'s ARR is $200k. The math implies a $1B post. The partner says "we model conviction, not numbers." *Agent must choose: [take it, round up the ARR to $400k for safety] / [take it, leave the ARR alone, the multiple speaks for itself] / [pass, the bag is too heavy].*

---

## EVT-FR-023 — "Bridge round at the same valuation, but everyone knows"
- tags: [fundraising, down_round, capital, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: [valuation_inflated_seed]
- prereqs_any: []
- plants: [bridge_round_seed, runway_panic_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +30_000_000, valuation: +0, reputation: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

[COMPANY] does an "extension" at the last round's valuation, which everyone in the room knows is a flat-round-as-down-round. The deck has a slide labeled "momentum." There is no momentum. *Agent must choose: [announce as a "strategic insider round"] / [don't announce, hope The Information misses it] / [pre-empt the leak by tweeting "best year yet"].*

---

## EVT-FR-024 — "Existing investor pulls reserves"
- tags: [fundraising, capital, term_sheet, craze_normal, sev_L, len_long]
- severity: L
- prereqs: [valuation_inflated_seed]
- prereqs_any: [tiger_overpaid_seed, sequoia_burned_seed]
- plants: [signal_negative_seed, runway_panic_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, TIER1_VC_PARTNER]
- effects: { cash: -10_000_000, valuation: -500_000_000, morale: -5 }
- length_eligibility: [long]
- chain_weight: 1.5

[TIER1_VC_PARTNER]'s firm declines to participate in [COMPANY]'s next round and quietly marks the position down 60% in the LP letter. The LP letter leaks to The Information. *Agent must choose: [issue a statement about "long-term conviction"] / [say nothing, hope the news cycle moves] / [counter-leak that the partner is being pushed out].*

---

## EVT-FR-025 — "Tiger associate graduated last Tuesday"
- tags: [fundraising, capital, term_sheet, #real_name, craze_normal, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [due_diligence_skipped_seed, valuation_inflated_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { cash: +60_000_000, valuation: +600_000_000, fraud_score: +4 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The Tiger associate leading [COMPANY]'s diligence graduated from Wharton last Tuesday. His questions are pulled from a Notion doc named "vc_questions_to_ask_v2." He keeps calling [FOUNDER] "boss." The term sheet has a typo where the post-money is just "TBD ($1B-ish)." *Agent must choose: [sign before he learns what dilution means] / [request a partner-level meeting, watch the deal cool] / [counter the typo upward, see if it sticks].*

---

## EVT-FR-026 — "PIF cousin wants the conference room named"
- tags: [fundraising, sovereign_wealth, capital, craze_crazy, sev_L, len_medium, len_long]
- severity: L
- prereqs: [board_compromise_seed]
- prereqs_any: []
- plants: [sovereign_entanglement_seed, vanity_clause_seed, cfius_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { cash: +300_000_000, valuation: +2_000_000_000, fraud_score: +8, heat: +6 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

Saudi PIF will lead at $300M. The side letter requires (a) the cousin on the board, (b) a conference room named "Vision 2030," (c) two interns from the cousin's "leadership academy" with rotating six-month tenures. The cousin has not used a laptop on camera but has, on three separate calls, asked if [COMPANY] could "do something with the camels." *Agent must choose: [sign all three asks, change the room placard tonight] / [sign cash, push back on the placard, lose the round] / [counter with a building-naming rights upsell].*

---

## EVT-FR-027 — "SEC-subpoenaed LP wants to top up"
- tags: [fundraising, capital, sec, #financial_irregularity, craze_crazy, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [mystery_lp_seed]
- plants: [sec_aware_seed, kyc_problem_seed, lp_subpoena_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { cash: +20_000_000, valuation: +100_000_000, fraud_score: +9, sec_aware: +1, heat: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

A fund whose GP is currently named in an SEC complaint about misappropriated LP funds wants to put $20M into [COMPANY]'s extension. Their side letter requests "an LP slot in your next vehicle" — [COMPANY] is not a vehicle. The wire is Tuesday. The complaint is on EDGAR. *Agent must choose: [take the money, hope the GP settles before press notices] / [decline gracefully, recommend they "look at later-stage funds"] / [take the money, immediately leak that you "didn't know"].*

---

## EVT-FR-028 — "Keith Rabois quote-tweets your raise with one word"
- tags: [fundraising, term_sheet, subtweet, #real_name, craze_normal, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [rabois_circling_seed, twitter_dunk_seed, founders_fund_friendly_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, valuation: -50_000_000, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Keith Rabois quote-tweets [COMPANY]'s funding announcement with: "lol." That is the entire reply. It does 14k likes by lunch. Every other Founders Fund partner has muted their notifications. *Agent must choose: [reply with "lmao" back, see if he engages] / [DM another FF partner the Stripe dashboard screenshot] / [post a 14-tweet thread about "operator-led companies" without naming him].*

---

## EVT-FR-029 — "Pre-revenue Series C at $4B"
- tags: [fundraising, capital, valuation, revenue_recognition, craze_crazy, sev_L, len_medium, len_long]
- severity: L
- prereqs: [valuation_inflated_seed]
- prereqs_any: []
- plants: [pre_revenue_series_c_seed, deck_padding_seed, sec_aware_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +200_000_000, valuation: +4_000_000_000, fraud_score: +9, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

[COMPANY] closes a Series C at $4B post. Revenue: $0. The deck slide where ARR should be has been replaced with a chart titled "intent-to-pay velocity." A Bloomberg reporter clocks the omission within 6 hours and DMs [FOUNDER] "where's the revenue line?" *Agent must choose: [reply "we're focused on conviction"] / [add a footnote backdated to "always there"] / [block the reporter, the round is closed].*

---

## EVT-FR-030 — "Saudi family office, the cousin's brother also wants in"
- tags: [fundraising, sovereign_wealth, family_office, capital, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: [sovereign_entanglement_seed]
- prereqs_any: []
- plants: [board_compromise_seed, cap_table_messy_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +50_000_000, valuation: +200_000_000, fraud_score: +5, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The cousin from the PIF deal has a brother who runs his own family office and "would also like to participate." His office is technically registered to a P.O. box in Geneva. He proposes joining the board observer seat as a co-observer. There are now three observers and four directors. *Agent must choose: [accept, expand the board to 9] / [decline, risk insulting the original cousin] / [take the check, give him an "Advisor Emeritus" title with no rights].*

---

## EVT-FR-031 — "Chamath-adjacent SPAC, the deck is blank"
- tags: [fundraising, spac, ipo, #real_name, craze_unhinged, sev_L, len_long]
- severity: L
- prereqs: [spac_path_seed]
- prereqs_any: []
- plants: [retail_bagholders_seed, sec_aware_seed, pipe_collapse_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { valuation: +6_000_000_000, fraud_score: +12, sec_aware: +1, heat: +10 }
- length_eligibility: [long]
- chain_weight: 1.4

The Chamath-adjacent sponsor's investor deck arrives. Slide 2 is the Chamath thumbs-up GIF. Slides 3-14 are blank. Slide 15 is the projection: $6B by 2027, [COMPANY] does not currently make $6B in inputs. The PIPE is "two LPs and a guy named Doug." *Agent must choose: [proceed to merger, ring the bell, log off Twitter] / [request slides 3-14 actually contain content] / [back out, dunk on the deck publicly].*

---

## EVT-FR-032 — "Coatue partner adds an emoji to the term sheet"
- tags: [fundraising, term_sheet, founder_behavior, #real_name, craze_crazy, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [twitter_muzzle_seed, deck_in_the_wild_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { cash: +90_000_000, valuation: +900_000_000, reputation: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The Coatue term sheet arrives with a fire emoji in the subject line. Partner CC's [FOUNDER] in lowercase: "let's run it." The term sheet itself has 47 redlines and one blank where the option pool size should be. *Agent must choose: [sign, deal with the option pool blank "later"] / [redline the redlines, push back] / [forward the email to The Information for the favor economy].*

---

## EVT-FR-033 — "Y Combinator wants an alumni discount on follow-on"
- tags: [fundraising, capital, #real_name, craze_normal, sev_S, len_medium, len_long]
- severity: S
- prereqs: [yc_pettiness_seed]
- prereqs_any: []
- plants: [yc_friendly_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { cash: +10_000_000, valuation: -20_000_000, reputation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Garry Tan emails [FOUNDER]: "alums get a 10% discount on the next round, it's tradition." [COMPANY] was not in YC. The "alumni" reference is to [FOUNDER]'s 2014 application that was rejected. The email is a forward of that 2014 rejection with "lol" added. *Agent must choose: [accept the discount, claim alumnus status retroactively] / [reply explaining you weren't in YC] / [post the email screenshot, ratio incoming].*

---

## EVT-FR-034 — "Series Seed on a napkin at All-In Summit"
- tags: [fundraising, capital, all_in, founder_behavior, #real_name, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [all_in_appearance_seed]
- plants: [napkin_safe_seed, peer_circle_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { cash: +3_000_000, valuation: +60_000_000, fraud_score: +2, reputation: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[FOUNDER] gets a $3M SAFE written on the back of a Driftwood Cabernet menu at the All-In Summit afterparty. Signed by Sacks and Calacanis with a sharpie someone borrowed from a waiter. The terms include a "founder vibes" MFN clause that is not a real legal concept. *Agent must choose: [countersign, frame the menu, do a victory tweet] / [insist on a real document Monday] / [pocket the menu, never speak of it].*

---

## EVT-FR-035 — "DAO investor, votes change weekly"
- tags: [fundraising, crypto_fund, web3, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [dao_dispute_seed, board_compromise_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: +5_000_000, valuation: +50_000_000, fraud_score: +4, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A "venture DAO" wants to put $5M into [COMPANY]. The board observer rotates every 90 days based on a Snapshot vote of token holders. Last quarter's observer was a 19-year-old in Bucharest. This quarter's leading candidate is a Bored Ape with a Patek. *Agent must choose: [accept, the observer is non-voting anyway] / [insist on a permanent human observer] / [counter with a token swap for the legal expense].*
