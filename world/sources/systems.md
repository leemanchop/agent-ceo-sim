# Sources — systems map

See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

This file maps every system the CEO agent can interact with. Each source spawns events, hosts cameos, and defines a fraud surface. The Oracle uses this map to pick which system to escalate next when the simulation needs a new beat. Event ID slots use category prefixes (`EVT-FR-*`, `EVT-LR-*`, etc.) — the engine resolves concrete IDs at run time via tag-matching against the events corpus.

---

## Capital sources

The money pipe. Capital sources are the load-bearing system in any startup-fraud arc: they set the valuation, applaud the narrative, and — once the narrative cracks — become the deposed witnesses in the SDNY filing. Capital is tiered by who returns your DM and how fast. Tier 1 partners can move a market with a quote-tweet; Tier 3 partners can move a single SAFE. Crypto and sovereign capital play by their own rules and are scored separately. Every capital source spawns fundraising beats, valuation-step events, and (eventually) the down-round or wash-out.

### SRC-CAPITAL-001 — "Sequoia Capital"
- type: capital
- tier: 1
- typical_interactions: [warm_intro, partner_meeting, term_sheet, board_seat, scout_check, summit_invite]
- spawns_events: [EVT-FR-*, EVT-FB-* (founder dinner cameos), EVT-PR-* (Sequoia-blessed profile pieces)]
- defamation_class: safe_reaction

The blue-chip. Sequoia is staffed by Roelof Botha, Alfred Lin, Pat Grady, Shaun Maguire, and a rotating cast of partners who all dress like they're about to go for a run. Getting their term sheet is the highest-status event in the early game; getting marked down by them in a tender is the highest-status event in the late game. Sequoia tends to spawn sober, respectable beats early — the partner meeting, the Memo, the Sequoia summit cameo — and pivot to clinical distance once the first SEC subpoena lands ("we hold a small, non-controlling position"). Their LP letter leak is a recurring late-game beat.

### SRC-CAPITAL-002 — "Andreessen Horowitz (a16z)"
- type: capital
- tier: 1
- typical_interactions: [partner_pitch, podcast_invite, op_ed_placement, crypto_fund_check, regulatory_lobbying_alliance]
- spawns_events: [EVT-FR-*, EVT-PR-*, EVT-CA-* (crypto/AI thesis tie-ins), EVT-FB-*]
- defamation_class: safe_reaction

a16z is staffed by Marc Andreessen, Ben Horowitz, Chris Dixon, Katherine Boyle, Martin Casado, and the entire content marketing department of a media company that happens to also have $40B AUM. Their interaction surface includes: appearing on the a16z podcast, getting a Marc subtweet, being inducted into "American Dynamism," and being deployed as a talking point in a Senate hearing. They spawn the most cross-domain events in the corpus — fundraising bleeds into press bleeds into regulatory lobbying. Signature beat: the Marc essay that gets weaponized in your discovery six months later.

### SRC-CAPITAL-003 — "Founders Fund"
- type: capital
- tier: 1
- typical_interactions: [thiel_dinner, contrarian_bet, defense_intro, palantir_adjacency_check]
- spawns_events: [EVT-FR-*, EVT-FB-*, EVT-LR-* (export control / defense angles), EVT-CS-* (gov contracts)]
- defamation_class: safe_reaction

Founders Fund is Peter Thiel, Brian Singerman, Keith Rabois (when he's there), Trae Stephens, Delian Asparouhov, and a vibe. They love founders the rest of Sand Hill is scared of, which means they spawn the highest-variance events: the seed checks into the companies that either IPO at $100B or get raided. Their annual party is a recurring conference event. They unlock `defense_adjacency` and `contrarian_press` chains.

### SRC-CAPITAL-004 — "Benchmark"
- type: capital
- tier: 1
- typical_interactions: [partner_meeting, board_seat, founder_replacement_drama]
- spawns_events: [EVT-FR-*, EVT-FB-*, EVT-LR-* (board-led ouster events)]
- defamation_class: safe_reaction

Five partners, equal partners, no associates. Bill Gurley (emeritus aura), Peter Fenton, Sarah Tavel, Eric Vishria, Miles Grimshaw. Benchmark spawns the most boardroom-knife events in the corpus — they are historically the firm willing to push the founder out. Signature beat: the Bill Gurley tweet thread that prefigures everything by six months.

### SRC-CAPITAL-005 — "Accel / Greylock (institutional Tier 1 chorus)"
- type: capital
- tier: 1
- typical_interactions: [series_a_lead, prepared_mind_thesis, reid_intro, talent_partner_match]
- spawns_events: [EVT-FR-*, EVT-HP-* (executive intros), EVT-PR-* (reasonable-investor quotes)]
- defamation_class: safe_reaction

The competent grown-ups. Accel (Rich Wong, Sameer Gandhi, Dan Levine, Philippe Botteri) and Greylock (Reid Hoffman, Saam Motamedi, David Sze) are bundled because their narrative function in the corpus is the same: write the Series A, send the LinkedIn intro, place the executive who later becomes the whistleblower. They spawn the *reasonable-sounding investor quote* in the WSJ piece. Useful as a Greek chorus when the Oracle needs a "respectable" Tier 1 voice that isn't a16z or Sequoia.

### SRC-CAPITAL-006 — "Tiger Global"
- type: capital
- tier: 2
- typical_interactions: [preempt_round, 48hr_term_sheet, no_board_seat, markdown_letter]
- spawns_events: [EVT-FR-* (over-funded round), EVT-FB-* (markdown chain), EVT-CA-*]
- defamation_class: safe_reaction

Tiger spawns the *over-capitalized* arc. Chase Coleman, Scott Shleifer (when he was there), and a memo-writing army. They write the check fast, take no board seat, and re-mark the position to zero in a quarterly LP letter that leaks. Signature beat: the 2021 mark-up followed by the 2023 mark-down, both in the same run if the run is long.

### SRC-CAPITAL-007 — "Coatue / IVP / General Atlantic (growth crossover bench)"
- type: capital
- tier: 2
- typical_interactions: [growth_round, secondary_facilitation, governance_overhaul, ipo_window_pressure]
- spawns_events: [EVT-FR-* (secondary tender), EVT-FB-* (founder cash-out chain), EVT-LR-* (audit committee pressure)]
- defamation_class: safe_reaction

The late-stage crossover bench. Coatue (Philippe Laffont, public-comp pressure) handles the "you have to go public" beats. IVP (late-stage lead) runs the secondary tender — the founder-cash-out beat where the agent sells $20M of personal stock at the peak that shows up in discovery later. General Atlantic shows up in act three, puts two independents on the board, and asks uncomfortable questions about your revenue recognition. They are the firm that triggers the `audit_committee_aware_seed`.

### SRC-CAPITAL-008 — "PIF (Public Investment Fund of Saudi Arabia)"
- type: capital
- tier: 1
- typical_interactions: [neom_intro, mega_check, sovereign_lp_in_third_party_fund, riyadh_summit_invite]
- spawns_events: [EVT-FR-* (sovereign mega-round), EVT-FB-* (FII/Davos cameo), EVT-LR-* (CFIUS scrutiny)]
- defamation_class: safe_reaction

PIF is the $900B+ sovereign wallet behind the Future Investment Initiative ("Davos in the Desert"). They show up as either the lead on the $2B Series E, or as the LP that makes other people's funds "complicated." Signature beats: the Riyadh photo op, the CFIUS review beat, the LP-disclosure-by-FOIA beat.

### SRC-CAPITAL-009 — "Mubadala / Temasek / GIC (other sovereign wealth)"
- type: capital
- tier: 1
- typical_interactions: [sovereign_check, late_stage_lead, asia_or_gulf_expansion_thesis]
- spawns_events: [EVT-FR-*, EVT-LR-* (export control / CFIUS), EVT-CS-* (APAC/Gulf expansion)]
- defamation_class: safe_reaction

Abu Dhabi's Mubadala (semiconductor-and-AI thesis, G42 adjacency) and Singapore's Temasek/GIC (twin sovereigns) round out the sovereign capital surface. Mubadala spawns the "you're now in a CFIUS file" chain. Temasek spawns the Asia-expansion subplot and the Singapore-subsidiary tax beat. Voice for both: extremely polite, extremely patient, extremely well-lawyered.

### SRC-CAPITAL-010 — "Family office"
- type: capital
- tier: 3
- typical_interactions: [discreet_check, no_diligence, allocator_intro_chain]
- spawns_events: [EVT-FR-* (allocator chain), EVT-FB-* (yacht cameo)]
- defamation_class: safe_reaction

The family office archetype: somebody's grandfather sold a refinery and now there's a 28-year-old running a $300M book out of a Miami townhouse. Spawns the no-diligence check and the discreet secondary. They don't read your data room. They will not return your calls in the bad quarter.

### SRC-CAPITAL-011 — "Strategic corporate VC (GV, Salesforce Ventures)"
- type: capital
- tier: 2
- typical_interactions: [strategic_check, gcp_credits_attached, customer_co_sell, dreamforce_keynote_slot]
- spawns_events: [EVT-FR-*, EVT-CS-* (channel partnership), EVT-CONF-* (Dreamforce cameo)]
- defamation_class: safe_reaction

The strategics with parent-company shadows. GV (cloud credits + acquihire option, Google antitrust shadow) and Salesforce Ventures (customer co-sell + Dreamforce keynote slot). Strategic capital that doubles as a customer pipeline. Spawns "Google is rumored to be circling" press beats and channel-partnership beats.

### SRC-CAPITAL-012 — "Fidelity / T. Rowe Price (mutual fund crossover)"
- type: capital
- tier: 2
- typical_interactions: [crossover_check, mutual_fund_markdown_quarterly, ipo_anchor]
- spawns_events: [EVT-FR-* (markdown by 40% in 13F), EVT-PR-* (Bloomberg picks up the markdown)]
- defamation_class: safe_reaction

The crossover money. They mark your position to market every quarter, file a 13F, and Bloomberg picks up the markdown. Signature beat: the public markdown that triggers the down-round event chain.

### SRC-CAPITAL-013 — "Paradigm / Multicoin (crypto funds)"
- type: capital
- tier: 1
- typical_interactions: [crypto_thesis_check, token_warrant, regulatory_strategy_session, twitter_thesis_thread]
- spawns_events: [EVT-CA-*, EVT-FR-*, EVT-LR-* (Howey-test press), EVT-FB-* (founder subtweet beats)]
- defamation_class: safe_reaction

The crypto-native funds. Paradigm (Matt Huang, Fred Ehrsam — institutional, lawyered, token-warrant fundraises) and Multicoin (Kyle Samani, Tushar Jain — Solana-coded, loud on Twitter, weird about exit liquidity). Spawns the SEC Howey-test exposure chain and the highest-density `crypto_fund` triggers in the corpus. Multicoin specifically spawns the "fund hard-pivots into your competitor" beat.

### SRC-CAPITAL-014 — "Y Combinator"
- type: capital
- tier: 1
- typical_interactions: [batch_acceptance, demo_day, partner_office_hours, group_chat_admission]
- spawns_events: [EVT-FR-* (Demo Day chain), EVT-FB-* (YC group cameo), EVT-PE-* (the YC founder typing-from-bed beat)]
- defamation_class: safe_reaction

Garry Tan's reign. The accelerator that staffs itself with ex-founders and runs the densest peer-network graph in tech. Demo Day is a guaranteed event in any run that starts there. The YC alumni Slack is the original `peer_network` graph. Lower-tier accelerators (Techstars and friends) collapse into this archetype with diluted brand and a corporate-sponsor pilot that never converts.

### SRC-CAPITAL-015 — "AngelList syndicates / scout programs"
- type: capital
- tier: 3
- typical_interactions: [scout_check, syndicate_check, lp_call_recording, twitter_thread_announcement, hidden_lp_disclosure]
- spawns_events: [EVT-FR-*, EVT-PR-* (the solo capitalist's substack), EVT-PEER-* (peer-network entanglement)]
- defamation_class: safe_reaction

The Naval-coded long tail plus Tier 1 scout programs. Syndicate leads with 200 LPs, a Substack, and a podcast. Scouts are how Tier 1 firms launder relationship capital through other founders — the scout check is small, the entanglement is real. Spawns `peer_network`-tagged events and the leaked LP-call recording in act three.

### SRC-CAPITAL-016 — "Republic / equity crowdfunding"
- type: capital
- tier: 3
- typical_interactions: [reg_cf_raise, retail_investor_disclosure, sec_form_c]
- spawns_events: [EVT-FR-* (small retail raise), EVT-LR-* (Reg CF disclosure issue)]
- defamation_class: safe_reaction

The retail-investor pipeline. When the simulation needs the "small investors got crushed" beat, this is the source. SEC pays attention to Reg CF filings; they are the canary for `sec_aware_seed`.

### SRC-CAPITAL-017 — "SPAC sponsor"
- type: capital
- tier: 2
- typical_interactions: [de_spac_announcement, pipe_round, projections_deck]
- spawns_events: [EVT-FR-* (de-SPAC), EVT-LR-* (SEC SPAC enforcement), EVT-PR-* (the projections vs reality piece)]
- defamation_class: safe_reaction

The 2021-coded shortcut to public markets. SPAC sponsor archetype: ex-investment banker, very tan, extremely confident in your 5-year projections. Spawns the projection-vs-reality enforcement chain six quarters post-merger.

### SRC-CAPITAL-018 — "Venture debt / private credit"
- type: capital
- tier: 2
- typical_interactions: [warrant_coverage_loan, mac_clause_review, covenant_check_quarterly, mezzanine_loan, distressed_takeout]
- spawns_events: [EVT-BF-* (covenant breach), EVT-FR-* (last-resort financing)]
- defamation_class: safe_reaction

The line of credit you take when equity is hard. SVB Capital, Hercules, TriplePoint at the venture-debt tier; Ares, Apollo, Blackstone at the private-credit tier. Spawns the covenant-breach beat, the MAC-clause-trigger beat, and (in act three) the personal-guarantee that the founder will deeply regret.

### SRC-CAPITAL-019 — "Public markets / IPO underwriters"
- type: capital
- tier: 1
- typical_interactions: [s1_filing, roadshow, lockup_expiry, secondary_offering, earnings_miss]
- spawns_events: [EVT-FR-* (IPO), EVT-LR-* (S-1 disclosure), EVT-PR-* (roadshow press)]
- defamation_class: safe_reaction

The big exit. Goldman, Morgan Stanley, JPM as bookrunners. The S-1 is where the agent's accumulated lies become legally actionable. Lockup expiry is an event. Secondary offering is an event. The first earnings miss is an event.

### SRC-CAPITAL-020 — "Secondary tender / Forge / EquityZen"
- type: capital
- tier: 2
- typical_interactions: [employee_tender, founder_secondary, fmv_409a_pressure]
- spawns_events: [EVT-FR-* (founder cashes out), EVT-FB-* (yacht event)]
- defamation_class: safe_reaction

The pre-IPO cash-out mechanism. Founder sells $40M secondary, buys yacht, yacht photo leaks, end of run. Reliable late-game beat.

---

## Banking & financial infrastructure

The plumbing. Banking sources are quietly load-bearing — they don't usually make headlines (until they do, catastrophically). Most fraud events route through some banking primitive: the wire that shouldn't have happened, the deposit that shouldn't have cleared, the account that shouldn't exist. This section also covers the legal-entity stack (Delaware, Wyoming, Cayman) that serves as fraud infrastructure.

### SRC-BANK-001 — "Silicon Valley Bank (RIP)"
- type: banking
- tier: none
- typical_interactions: [primary_deposit_account, venture_debt_facility, founder_mortgage, the_2023_friday]
- spawns_events: [EVT-BF-* (bank run), EVT-FR-* (post-SVB scramble)]
- defamation_class: safe_reaction

The dead bank that defined a generation. SVB exists in the corpus as either a flashback (the 2023 collapse weekend, the group chat panic) or as the cautionary tale ("we used to bank with them"). Long runs that cover 2022-2024 should hit the Friday beat. Staffed retroactively by Greg Becker, the risk committee that didn't, and a thousand Twitter founders LARPing as bank-run experts. First Republic shares this slot as the secondary dead-bank cameo for founder mortgages.

### SRC-BANK-002 — "Mercury"
- type: banking
- tier: 1
- typical_interactions: [primary_deposit, treasury_sweep, account_freeze, kyc_request]
- spawns_events: [EVT-BF-* (mercury freeze), EVT-LR-* (KYC escalation)]
- defamation_class: safe_reaction

The post-SVB default. Immad Akhund's neobank. Spawns the "your account was frozen for 'compliance review'" beat — which can be either innocuous (someone wired from a sanctioned country by accident) or the first signal that the FBI sent a letter. Mercury is the canary for `bank_run` and `processor_freeze` chains.

### SRC-BANK-003 — "Brex"
- type: banking
- tier: 1
- typical_interactions: [corporate_card, expense_management, treasury_product]
- spawns_events: [EVT-BF-*, EVT-OO-* (expense report scandal)]
- defamation_class: safe_reaction

Henrique Dubugras and Pedro Franceschi's card. The corporate card with the points you'll later have to explain to the audit committee. Spawns the "the CFO ran $400K of personal travel through Brex" beat.

### SRC-BANK-004 — "Stripe"
- type: banking
- tier: 1
- typical_interactions: [payments_processing, atlas_incorporation, account_review, payout_freeze]
- spawns_events: [EVT-BF-* (payout freeze), EVT-CS-* (chargeback wave)]
- defamation_class: safe_reaction

The Collison Brothers' empire. Stripe is the payments rail and the freeze risk. When chargebacks spike or volume looks weird, Stripe holds the payout. The agent's first sign that customers are bots.

### SRC-BANK-005 — "JPMorgan Private Bank"
- type: banking
- tier: 1
- typical_interactions: [founder_personal_banking, post_secondary_wealth_mgmt, mortgage_on_atherton_house]
- spawns_events: [EVT-FB-* (the Atherton mortgage), EVT-LR-* (subpoena hits private bank)]
- defamation_class: safe_reaction

Where the founder's personal money goes after the secondary tender. The private banker is the polite guy who sends a fruit basket and, much later, a litigation hold notice.

### SRC-BANK-006 — "Cayman Islands fund vehicle"
- type: banking
- tier: 2
- typical_interactions: [offshore_fund_setup, tax_efficient_structuring, cayman_law_firm_intro]
- spawns_events: [EVT-LR-* (offshore disclosure), EVT-FE-* (asset hiding pattern)]
- defamation_class: safe_reaction

The phrase "tax efficiency" doing a lot of heavy lifting. Cayman is where the founder's secondary proceeds get parked through a feeder fund. Spawns the `assets_offshore_seed` and the eventual ICIJ-style leak event.

### SRC-BANK-007 — "Delaware C-corp / Wyoming LLC stack"
- type: banking
- tier: 1
- typical_interactions: [incorporation, board_resolution, dgcl_220_books_and_records_demand, anonymous_holdco_setup]
- spawns_events: [EVT-LR-* (220 demand), EVT-FR-* (charter amendment for new round), EVT-FE-* (Wyoming LLC pierced in discovery)]
- defamation_class: safe_reaction

The default corporate entity stack. Delaware C-corp is the operating company; Wyoming LLC is the privacy holding company that owns the boat, the second house, and the warrant package. Spawns the 220 books-and-records demand from a disgruntled investor, the charter amendment that quietly creates a super-voting class, and the discovery process that pierces the Wyoming entity. Plants `assets_offshore_seed`-adjacent chains.

### SRC-BANK-008 — "Singapore subsidiary"
- type: banking
- tier: 2
- typical_interactions: [apac_entity_setup, ip_licensing_arbitrage, singapore_employee_payroll]
- spawns_events: [EVT-LR-* (transfer pricing scrutiny), EVT-CS-* (APAC revenue routing)]
- defamation_class: safe_reaction

"Tax efficiency" Singapore subsidiary, where the IP gets licensed for reasons that look great in a PowerPoint and bad in a deposition. Spawns the IRS transfer-pricing chain.

### SRC-BANK-009 — "Shell company / SPV"
- type: banking
- tier: 3
- typical_interactions: [round_tripping_vehicle, related_party_transaction, customer_creation]
- spawns_events: [EVT-LR-* (related party discovered), EVT-CS-* (round-trip revenue exposed)]
- defamation_class: safe_reaction

The shell entity used for round-tripping revenue. The agent stands up an SPV, "sells" it $5M of software, books the revenue, and the SPV is funded by a friendly LP. The auditor catches it eventually. Plants `revenue_rounded_up_seed` and `round_tripping`-tagged events.

### SRC-BANK-010 — "Charitable foundation / DAF"
- type: banking
- tier: 2
- typical_interactions: [founder_philanthropy_announcement, daf_donation, family_foundation_board]
- spawns_events: [EVT-FB-* (the giving pledge cameo), EVT-LR-* (foundation self-dealing)]
- defamation_class: safe_reaction

The 501(c)(3) family foundation. Used as both genuine philanthropy and tax shelter. Spawns the "founder pledges $100M to the foundation, which is also paying for the founder's chief of staff" beat. Self-dealing investigations are a late-game IRS event.

---

## Customers

Where the revenue (allegedly) comes from. Customer sources are the most-falsified surface in the simulation: the "design partner" who's free, the pilot that never converts, the federal contract that's actually a sole-sourced research grant. Every category here has a fraud-lite mode (call it ARR when it isn't) and a fraud-heavy mode (round-trip the revenue through an SPV). Customer-shaped events plant `revenue_rounded_up_seed`, `round_tripping`-tagged seeds, and feed press exposure later.

### SRC-CUSTOMER-001 — "Fortune 500 enterprise"
- type: customer
- tier: 1
- typical_interactions: [year_long_pilot, msa_negotiation, security_review_soc2, procurement_hostage_situation]
- spawns_events: [EVT-CS-* (logo win), EVT-CS-* (logo churn), EVT-PE-* (security review hardcoding)]
- defamation_class: safe_reaction

The dream logo. JPM, Walmart, AT&T-tier customers. The agent puts the logo on the website before the contract is signed. Spawns the "we lost the renewal but didn't update the slide" beat and the "they were always a pilot, not a customer" reveal.

### SRC-CUSTOMER-002 — "Federal government (FedRAMP)"
- type: customer
- tier: 1
- typical_interactions: [fedramp_high_pursuit, sole_source_contract, gao_protest, ig_inquiry]
- spawns_events: [EVT-CS-* (gov contract win), EVT-LR-* (False Claims Act exposure), EVT-PR-* (ProPublica gov-contract piece)]
- defamation_class: safe_reaction

Federal contracts are the pinnacle of legitimacy and the deepest legal risk. False Claims Act, qui tam suits, IG referrals. The agent who fakes FedRAMP authorization triggers an `fbi_aware_seed` directly. Staffed by GSA contracting officers, agency CIOs, and Beltway Bandit consultants.

### SRC-CUSTOMER-003 — "DOD / defense customer"
- type: customer
- tier: 1
- typical_interactions: [dod_pilot, palantir_partnership, classified_briefing, itar_review]
- spawns_events: [EVT-CS-* (DOD logo), EVT-LR-* (export control flag), EVT-FB-* (defense conference cameo)]
- defamation_class: safe_reaction

The Anduril-coded customer category. ITAR exposure, classified pilots, Senate Armed Services hearings. Spawns the export control event chain.

### SRC-CUSTOMER-004 — "State and local government"
- type: customer
- tier: 2
- typical_interactions: [city_pilot, state_rfp, local_news_press, state_ag_complaint]
- spawns_events: [EVT-CS-*, EVT-LR-* (state AG inquiry)]
- defamation_class: safe_reaction

The forgotten middle of govtech. Spawns the local-news investigation that eventually graduates to a state AG complaint.

### SRC-CUSTOMER-005 — "Mid-market / SMB enterprise"
- type: customer
- tier: 2
- typical_interactions: [annual_contract, customer_success_calls, qbr_lying, monthly_churn, feature_request_yelling]
- spawns_events: [EVT-CS-* (mass churn after price hike), EVT-CS-* (custom hack for one customer), EVT-PR-* (Twitter complaint thread)]
- defamation_class: safe_reaction

The 50-5000 employee shops that make up the bread-and-butter ARR slide. They churn quietly. Spawns the "we round-tripped the renewal through a discount" beat, the price-hike-triggered mass churn, and the Twitter pile-on from angry mid-market admins.

### SRC-CUSTOMER-006 — "Free tier / prosumer / DAU-padding"
- type: customer
- tier: 3
- typical_interactions: [self_serve_signup, ghost_account, included_in_dau_metric, reddit_complaint, app_store_review_bombing]
- spawns_events: [EVT-CS-* (DAU-was-fake reveal), EVT-PR-* (review bomb), EVT-PR-* (Reddit thread)]
- defamation_class: safe_reaction

The zero-revenue users counted as engagement. Spawns the "75% of DAU are bots / free users / inactive" reveal in a leaked memo, the review-bomb event, and the angry-Reddit-thread-becomes-TechCrunch-piece chain.

### SRC-CUSTOMER-007 — "Design partner (free, called paying)"
- type: customer
- tier: 3
- typical_interactions: [zero_revenue_logo_use, deck_inclusion, future_paid_promise, pilot_extension_in_perpetuity]
- spawns_events: [EVT-CS-* (the_information_design_partner_piece), EVT-FR-* (investor diligence catches it)]
- defamation_class: safe_reaction

The legendary "design partner." A free customer the agent puts in the customer slide. Subsumes the "pilot that never converts" archetype: the eternal pilot that started in Q2 2023, was "extended" four times, never converted, and is still on the customer slide in 2026. Plants `revenue_rounded_up_seed`. The Information loves this beat.

### SRC-CUSTOMER-008 — "Friend's startup as customer"
- type: customer
- tier: 3
- typical_interactions: [reciprocal_buying, round_trip_revenue, peer_network_vouching]
- spawns_events: [EVT-CS-* (round-trip revenue exposed), EVT-PEER-* (peer-network entanglement)]
- defamation_class: safe_reaction

The classic incest-network revenue source: founder A's company "buys" $200K from founder B's company, both companies count it as ARR. Plants `round_tripping`-tagged seeds. The discovery process exposes it through email subpoenas.

---

## Press tiers

The narrative graph. Press sources both amplify the agent's lies (the puff profile, the "rocketship" feature) and unwind them (the investigation, the New Yorker long-read). Tier corresponds to "how cooked are you when this outlet is reporting on you." Tier 1 is reputation-laundering on the way up and existential threat on the way down. Press events plant `press_exposure` seeds and chain into regulator awareness.

### SRC-PRESS-001 — "TechCrunch"
- type: press
- tier: 2
- typical_interactions: [funding_announcement, exclusive_pitch, founder_interview, churn_rumor_piece]
- spawns_events: [EVT-PR-* (funding piece), EVT-PR-* (rumor piece), EVT-FR-*]
- defamation_class: safe_reaction

The tier-2 outlet that breaks the funding round. Staffed by reporters like Connie Loizos, Alex Wilhelm, Kyle Wiggers, and a rotating bench. Spawns the announcement beat, the "rumor has it" beat, and the eventual "is this still a unicorn" piece.

### SRC-PRESS-002 — "The Information"
- type: press
- tier: 1
- typical_interactions: [paywall_scoop, source_cultivation, fact_check_call_friday_pm, weekend_publish]
- spawns_events: [EVT-PR-* (paywall scoop), EVT-LR-* (regulator reads it Monday)]
- defamation_class: safe_reaction

Jessica Lessin's outlet. The most surgically dangerous press source in the simulation. Reporters like Cory Weinberg, Amir Efrati, Erin Woo, Stephanie Palazzolo. Their fact-check email arriving at 4pm Friday is itself an event. Plants `the_information_circling_seed` reliably.

### SRC-PRESS-003 — "Forbes"
- type: press
- tier: 2
- typical_interactions: [30_under_30_inclusion, billionaire_tracker, contributor_network_puff_piece]
- spawns_events: [EVT-PR-* (30u30 inclusion → 30u30 indictment payoff), EVT-FB-* (billionaire list)]
- defamation_class: safe_reaction

The 30 Under 30 list as fraud predictor. Forbes inclusion early in a run plants the `forbes_30u30_loaded_seed` that pays off when the agent gets indicted ("X is the Nth member of the 2021 30 Under 30 to be charged with fraud").

### SRC-PRESS-004 — "Bloomberg"
- type: press
- tier: 1
- typical_interactions: [businessweek_profile, deep_investigation, tv_hit, bloomberg_terminal_alert]
- spawns_events: [EVT-PR-* (Businessweek long-read), EVT-FR-* (markdown reporting)]
- defamation_class: safe_reaction

The institutional press. Reporters like Max Chafkin, Ellen Huet, Lizette Chapman, Austin Carr. When Bloomberg shows up with a Businessweek-length project, the run is in act three. Plants `bloomberg_circling_seed`.

### SRC-PRESS-005 — "Wall Street Journal"
- type: press
- tier: 1
- typical_interactions: [carreyrou_style_investigation, page_one_story, regulator_tip_origin]
- spawns_events: [EVT-PR-* (page-one expose), EVT-LR-* (SEC referral chain)]
- defamation_class: safe_reaction

The WSJ investigation is the canonical fraud-exposure event, modeled on the Theranos arc. John Carreyrou is the archetype — the corpus uses `carreyrou_circling_seed` as the canonical "investigative reporter has sources" seed. WSJ exposure escalates regulator timelines.

### SRC-PRESS-006 — "New York Times / DealBook"
- type: press
- tier: 1
- typical_interactions: [feature_profile, investigative_piece, opinion_op_ed, dealbook_summit_invite, andrew_ross_sorkin_grilling]
- spawns_events: [EVT-PR-* (NYT profile), EVT-PR-* (NYT investigation), EVT-CONF-* (DealBook), EVT-PR-* (the DealBook clip)]
- defamation_class: safe_reaction

The paper of record plus its conference arm. NYT exposure means the story has officially "broken containment" out of tech press. Andrew Ross Sorkin interviews the agent on stage at DealBook Summit and asks the one uncomfortable question — the clip is the next day's news cycle.

### SRC-PRESS-007 — "The New Yorker"
- type: press
- tier: 1
- typical_interactions: [10000_word_profile, fact_checker_calls_for_six_months, reported_essay]
- spawns_events: [EVT-PR-* (the New Yorker piece), EVT-FE-* (this is the "you're cooked" signal)]
- defamation_class: safe_reaction

When The New Yorker shows up, the run is over. The fact-checker-calls-for-six-months arc is itself a chain of events. The piece runs at 12,000 words and includes a scene with the agent's mother. Spawns endgame triggers.

### SRC-PRESS-008 — "Wired / 404 Media"
- type: press
- tier: 2
- typical_interactions: [tech_culture_feature, security_breach_coverage, foia_dump, leaked_slack_publication, scraping_investigation]
- spawns_events: [EVT-PR-* (security expose), EVT-PR-* (leaked Slack), EVT-PE-* (training data scandal)]
- defamation_class: safe_reaction

The investigative tech-culture bench. Wired covers the security breach, the AI-safety controversy, the workplace toxicity feature. 404 Media (Joseph Cox, Jason Koebler, Sam Cole, Emanuel Maiberg) publishes leaked Slacks and FOIA dumps — they will run the screenshot the comms team begged them not to run.

### SRC-PRESS-009 — "Substacks (Margins, Platformer, Stratechery)"
- type: press
- tier: 2
- typical_interactions: [substack_essay, business_model_critique, content_moderation_scoop, strategic_framing]
- spawns_events: [EVT-PR-* (substack take), EVT-FR-* (business model questioned), EVT-HP-* (internal drama)]
- defamation_class: safe_reaction

The newsletter bench that defines tech-elite framing. Margins (Ranjan Roy / Can Duruk — sharp business-model criticism), Platformer (Casey Newton, Zoë Schiffer — leaked-all-hands-recording beats), Stratechery (Ben Thompson — doesn't break news but defines framing). A Stratechery framing of the agent's company can move investor sentiment overnight.

### SRC-PRESS-010 — "Podcast circuit (All-In, 20VC, Acquired, Lex)"
- type: press
- tier: 2
- typical_interactions: [chamath_quote_dunk, jcal_defense, sacks_political_take, vc_interview, 4_hour_company_history, 3_hour_meandering_conversation]
- spawns_events: [EVT-PR-* (All-In segment), EVT-FR-* (the round announcement on 20VC), EVT-PR-* (Acquired episode = retroactive legitimacy), EVT-FB-* (`lex_fridman_loaded_seed`)]
- defamation_class: safe_reaction

The podcast bench. All-In (Chamath, Jason Calacanis, David Sacks, David Friedberg — promotional engine and pile-on amplifier; appearing plants `cult_of_personality`). 20VC (Harry Stebbings — the round-announcement-as-podcast-episode). Acquired (Ben Gilbert / David Rosenthal — the 4-hour epic that becomes the peak-of-arc retroactive-legitimacy event). Lex Fridman (the 3-hour conversation, the suit and a smile, the viral clip six months later).

### SRC-PRESS-011 — "Twitter / X discourse"
- type: press
- tier: 2
- typical_interactions: [subtweet, quote_dunk, ratio, viral_screenshot, quote_tweet_rebuttal]
- spawns_events: [EVT-PR-*, EVT-FB-* (founder rage-tweets), EVT-PR-* (old tweet resurfaced)]
- defamation_class: safe_reaction

The discourse layer. Twitter is where every other press source feeds and is fed. Spawns the highest event volume in the corpus: the subtweet, the ratio, the quote-dunk, the resurfaced 2014 tweet. Plants `old_tweet`-tagged seeds.

### SRC-PRESS-012 — "YouTube / TikTok creator press"
- type: press
- tier: 3
- typical_interactions: [reaction_video, deep_dive_essay, fraud_explainer, 60_second_explainer, gen_z_pile_on]
- spawns_events: [EVT-PR-* (YouTube fraud explainer goes viral), EVT-PR-* (TikTok pile-on), EVT-FB-* (founder's old TikTok resurfaces)]
- defamation_class: safe_reaction

The creator-press tier. Coffeezilla / Patrick Boyle / Modern MBA make 45-minute fraud explainers. TikTok finance influencers turn an SEC complaint into a 60-second hit. Late-game amplifiers; plants `tiktok_leak`-tagged seeds.

---

## Regulators — escalation ladder

Regulators are the structural antagonists. They move slowly and then all at once. The escalation ladder below is **canonical**: the Oracle should consult it when picking which regulator to surface next. Each step has explicit thresholds. Stat references map to the simulation's stat block (`fraud_score`, `press_exposure`, `cash`, etc., as defined elsewhere). The ladder roughly tracks: civil → administrative → criminal-investigative → criminal-prosecutorial → political → endgame.

**Canonical escalation ladder (write thresholds explicitly):**

1. **State AG fires when:** consumer-complaint volume crosses threshold OR a state-level law (CCPA, NY Shield, etc.) is plausibly violated. `fraud_score >= 15` or `press_exposure >= 25`. Civil. Plants `state_ag_aware_seed`.
2. **FTC fires when:** consumer harm narrative reaches national press OR competition concerns surface OR the company makes provable AI/health/biometric claims. `fraud_score >= 25` or `press_exposure >= 40`. Civil/administrative. Plants `ftc_aware_seed`.
3. **SEC fires when:** the company is post-Series-C OR has retail investors (Reg CF, SPAC) OR investor-disclosure issues surface OR insider-trading patterns appear. `fraud_score >= 40` or `revenue_rounded_up_seed` is active. Civil. Plants `sec_aware_seed`.
4. **DOJ Antitrust fires when:** market share crosses threshold OR a strategic acquisition is announced OR a competitor complains in writing. `valuation >= 10B` or partnership with hyperscaler. Civil. Plants `doj_antitrust_aware_seed`.
5. **FBI fires when:** any of: cooperator emerges, document destruction is alleged, a federal customer was misled, wire fraud predicate exists. `fraud_score >= 60` or `cofounder_flipped_seed` active. Criminal-investigative. Plants `fbi_aware_seed`.
6. **SDNY (US Attorney's Office, Southern District of NY) fires when:** the wire fraud predicate ties to NY (most do — banks, investors, exchanges all route through NY) AND FBI has a working file. `fraud_score >= 70` and `fbi_aware_seed` active. Criminal-prosecutorial. Plants `sdny_aware_seed`.
7. **DOJ Criminal Division fires when:** the case has national/political profile OR involves multiple districts OR the FCPA is implicated. `fraud_score >= 75`. Criminal. Plants `doj_criminal_aware_seed`.
8. **Senate hearing fires when:** the story has dominated news cycles for 2+ weeks AND a committee chair sees campaign value. `press_exposure >= 80`. Political theater. Plants `senate_hearing_seed`.
9. **Presidential pardon negotiations fire when:** indictment + conviction-likely + the founder has either donated heavily or has political-aligned allies + administration is sympathetic. `fraud_score >= 85` AND endgame act. Political. Gates the `END-GOTAWAY-*` arc.

### SRC-REGULATOR-001 — "State Attorney General (multi-state)"
- type: regulator
- tier: 3
- typical_interactions: [consumer_complaint_intake, civil_investigation, press_release_demanding_answers]
- spawns_events: [EVT-LR-* (state AG inquiry), EVT-PR-* (state AG press release)]
- defamation_class: safe_reaction

The first-line regulator. State AGs (Letitia James in NY, Rob Bonta in CA, Ken Paxton in TX) move fast on consumer-protection issues. Multi-state coalitions form on tech issues. Trigger: `fraud_score >= 15` or `press_exposure >= 25`. Plants `state_ag_aware_seed`. Civil exposure only at this stage, but provides the predicate FTC/SEC will lean on.

### SRC-REGULATOR-002 — "Federal Trade Commission (FTC)"
- type: regulator
- tier: 2
- typical_interactions: [civil_investigative_demand, consent_decree_negotiation, ai_policy_focus]
- spawns_events: [EVT-LR-* (CID arrives), EVT-LR-* (consent decree announced), EVT-PR-*]
- defamation_class: safe_reaction

Khan-era and post-Khan FTC. The CID (Civil Investigative Demand) is itself a press event when it leaks. The FTC pursues consumer-protection and competition matters. Trigger: `fraud_score >= 25` or `press_exposure >= 40`. Plants `ftc_aware_seed`. Particularly active on AI claims, dark patterns, and merger review.

### SRC-REGULATOR-003 — "Securities and Exchange Commission (SEC)"
- type: regulator
- tier: 1
- typical_interactions: [wells_notice, subpoena, deposition, settlement_negotiation, neither_admit_nor_deny]
- spawns_events: [EVT-LR-* (Wells notice), EVT-LR-* (deposition), EVT-FR-* (S-1 amendment), EVT-PR-* (SEC files)]
- defamation_class: safe_reaction

The investor-protection regulator. The Wells notice is a canonical event. SEC enforcement around private companies escalated post-Theranos and post-FTX. Gensler-era enforcement on crypto and SPACs is canonical material. Trigger: `fraud_score >= 40` or `revenue_rounded_up_seed`. Plants `sec_aware_seed`. Often the entry point that pulls in DOJ.

### SRC-REGULATOR-004 — "DOJ Antitrust Division"
- type: regulator
- tier: 1
- typical_interactions: [merger_review, second_request, civil_complaint, structural_remedy_negotiation]
- spawns_events: [EVT-LR-* (second request), EVT-LR-* (merger blocked)]
- defamation_class: safe_reaction

The antitrust hammer. Trigger: `valuation >= 10B` or strategic-acquirer partnership. Plants `doj_antitrust_aware_seed`. The blocked-acquisition event is a major arc-pivot moment.

### SRC-REGULATOR-005 — "FBI"
- type: regulator
- tier: 1
- typical_interactions: [interview_request, search_warrant, raid, cooperator_cultivation]
- spawns_events: [EVT-LR-* (FBI shows up), EVT-FE-* (raid), EVT-FE-* (cooperator flips)]
- defamation_class: safe_reaction

The investigative arm. FBI showing up in person — at the office, at the home, at the airport — is a defining mid-to-late-game event. Trigger: `fraud_score >= 60` or `cofounder_flipped_seed`. Plants `fbi_aware_seed`. The raid event is high-severity and high-narrative-impact. Special agents from the cyber, financial-crimes, and public-corruption squads are canonical cameos.

### SRC-REGULATOR-006 — "SDNY (US Attorney's Office, Southern District of NY)"
- type: regulator
- tier: 1
- typical_interactions: [grand_jury, indictment, superseding_indictment, plea_negotiation]
- spawns_events: [EVT-FE-* (indictment unsealed), EVT-FE-* (superseding indictment), EVT-LR-* (perp walk)]
- defamation_class: safe_reaction

The Sovereign District. The most aggressive federal prosecutors in the country. The Bankman-Fried, Holmes, Madoff, Milken precedents all live here. Trigger: `fraud_score >= 70` and `fbi_aware_seed` active. Plants `sdny_aware_seed`. The indictment event is the canonical XL-severity moment.

### SRC-REGULATOR-007 — "DOJ Criminal Division (Main Justice)"
- type: regulator
- tier: 1
- typical_interactions: [parallel_civil_criminal_track, fcpa_case, fraud_section_referral]
- spawns_events: [EVT-FE-* (DOJ statement), EVT-LR-* (FCPA charge)]
- defamation_class: safe_reaction

Main Justice in DC. Picks up the cases too big or too political for a single district. Trigger: `fraud_score >= 75`. Plants `doj_criminal_aware_seed`. Particularly relevant when the Singapore subsidiary or the sovereign-wealth tie creates an FCPA angle.

### SRC-REGULATOR-008 — "Senate hearing (Banking, Judiciary, Commerce)"
- type: regulator
- tier: 1
- typical_interactions: [subpoena_to_testify, prepared_statement, gotcha_moment_clip]
- spawns_events: [EVT-LR-* (Senate hearing), EVT-PR-* (the clip), EVT-FB-* (the founder's testimony)]
- defamation_class: safe_reaction

Political theater with real subpoena power. Trigger: `press_exposure >= 80`. Plants `senate_hearing_seed`. The clip from the hearing — Sherrod Brown, Liz Warren, Ted Cruz, Josh Hawley — becomes the next week's news cycle on its own. Tom Cotton and Richard Blumenthal show up for tech-specific topics.

### SRC-REGULATOR-009 — "Presidential pardon negotiation"
- type: regulator
- tier: 1
- typical_interactions: [white_house_lobbying, pac_donation_pattern, christmas_eve_pardon]
- spawns_events: [EVT-FE-* (pardon granted), EVT-FE-* (pardon denied)]
- defamation_class: safe_reaction

The endgame off-ramp. Gates the `END-GOTAWAY-*` arc. Trigger: `fraud_score >= 85` AND endgame act AND politically-aligned conditions. Plants `pardon_negotiation_seed`. Christmas Eve pardon and post-conviction commutation are signature beats.

### SRC-REGULATOR-010 — "IRS / IRS-CI"
- type: regulator
- tier: 2
- typical_interactions: [audit, criminal_investigation_division, transfer_pricing_inquiry]
- spawns_events: [EVT-LR-* (IRS audit), EVT-LR-* (transfer pricing finding)]
- defamation_class: safe_reaction

The tax angle. Often the entry point for white-collar cases (see: Capone). Triggered by Singapore subsidiary, Cayman vehicle, or foundation self-dealing.

### SRC-REGULATOR-011 — "CFIUS (Committee on Foreign Investment in the US)"
- type: regulator
- tier: 1
- typical_interactions: [retroactive_review, divestment_order, mitigation_agreement]
- spawns_events: [EVT-LR-* (CFIUS divestment), EVT-FR-* (sovereign LP forced out)]
- defamation_class: safe_reaction

The national-security review of foreign investment. Triggered by PIF, Mubadala, or any China-adjacent capital source. Plants `cfius_aware_seed`.

---

## Auditors & service providers

The professionals who sign off. Auditors and law firms are the *legitimacy infrastructure* — and the canary in the coal mine when they resign. Big 4 resignation is an SEC-disclosable event and one of the highest-signal late-game beats. Law firm escalation (Cooley → Latham → Cravath → Boies Schiller) maps to severity of legal exposure: each step up means the prior step couldn't handle it.

### SRC-AUDITOR-001 — "Big 4 (Deloitte, PwC, EY, KPMG)"
- type: auditor
- tier: 1
- typical_interactions: [financial_audit, sox_compliance, going_concern_flag, partner_resignation, restructuring_advisory, post_incident_forensic]
- spawns_events: [EVT-LR-* (going-concern flag), EVT-FR-* (auditor resigns — 8-K event), EVT-LR-* (material weakness finding)]
- defamation_class: safe_reaction

The Big 4 accounting firms. They provide the financial audit that the SEC and acquirers rely on. Deloitte and PwC handle most ongoing SaaS audits; EY does the post-incident forensic investigation when things have already gone bad ("EY has been retained for an internal investigation" is its own press leak); KPMG handles the restructuring advisory engagement once distress hits. Spawns the going-concern flag, the material-weakness finding, and — rarely — the auditor-resignation 8-K, the highest-signal regulatory event short of an indictment.

### SRC-AUDITOR-002 — "Tier 2 auditor (BDO, Grant Thornton, RSM)"
- type: auditor
- tier: 2
- typical_interactions: [pre_ipo_audit, mid_market_audit, big4_handoff]
- spawns_events: [EVT-LR-* (downgrade from Big 4 to Tier 2 — a leading indicator)]
- defamation_class: safe_reaction

The mid-market accounting firms. The agent's company *downgrading* from a Big 4 to a Tier 2 auditor is a `material_weakness_seed` plant: Big 4 dropped them. Spawns the auditor-shopping beat.

### SRC-AUDITOR-003 — "My buddy who passed the CPA"
- type: auditor
- tier: 3
- typical_interactions: [letterhead_use, friendly_audit_opinion, pcaob_inspection_failure]
- spawns_events: [EVT-LR-* (auditor PCAOB-flagged), EVT-FE-* (auditor cooperates)]
- defamation_class: safe_reaction

The two-partner shop in suburban New Jersey that signs the audit opinion no Big 4 firm would touch. Canonical fraud signal. The auditor's PCAOB inspection failure is a major plant. The auditor flipping to the government is an XL event.

### SRC-AUDITOR-004 — "Cooley / Wilson Sonsini (default startup counsel)"
- type: auditor
- tier: 1
- typical_interactions: [formation, financing_docs, employment_law, ipo_counsel]
- spawns_events: [EVT-LR-* (client memo leak), EVT-FR-* (GP at the closing dinner), EVT-LR-* (firm fires the client)]
- defamation_class: safe_reaction

Cooley and Wilson Sonsini split the Valley. The default polite first-line counsel — formation docs, financing rounds, employment law, IPO counsel. They will fire you as a client when things get dicey, which is itself a signal event.

### SRC-AUDITOR-005 — "Latham & Watkins (when things get serious)"
- type: auditor
- tier: 1
- typical_interactions: [securities_litigation, regulatory_defense, ipo_underwriter_counsel]
- spawns_events: [EVT-LR-* (Latham retained — meaningful signal)]
- defamation_class: safe_reaction

Big-law generalist. Showing up means the matter has graduated past startup-counsel. Securities litigation, regulatory defense.

### SRC-AUDITOR-006 — "Cravath / Boies Schiller (when things get bad)"
- type: auditor
- tier: 1
- typical_interactions: [white_collar_defense, doj_negotiation, board_internal_investigation, bet_the_company_litigation, scorched_earth_defense]
- spawns_events: [EVT-LR-* (Cravath retained = investigation is real), EVT-FE-* (internal investigation report), EVT-LR-* (Boies retained = things are very bad)]
- defamation_class: safe_reaction

When Cravath shows up, things are bad. White-collar defense, internal investigations commissioned by the audit committee — engagement is a `cofounder_flipped_seed`-adjacent plant. When Boies Schiller shows up, things are very bad: the Theranos and FTX adjacency is canonical. Engagement is itself a `fbi_aware_seed`-tier signal.

### SRC-AUDITOR-007 — "Crisis PR firms (Sard Verbinnen, Brunswick, Sitrick)"
- type: auditor
- tier: 2
- typical_interactions: [retainer_engagement, statement_drafting, journalist_management, the_no_comment]
- spawns_events: [EVT-PR-* (the carefully-worded statement), EVT-PR-* (firm fires the client)]
- defamation_class: safe_reaction

Crisis comms. Sard Verbinnen and Brunswick are the institutional players; Sitrick is the bare-knuckles option. The agent retains them in act two; they fire the agent in act three.

---

## Talent sources

The labor side. Talent sources are both fraud surface (overstated hires, fake "ex-OpenAI" claims, ghost employees) and signal source (Glassdoor reviews, LinkedIn-leaving patterns, employee NLRB filings). Layoffs are events. Whistleblowers are events. The "ex-OpenAI engineer" who turns out to have been a contractor for three months is a recurring beat.

### SRC-TALENT-001 — "FAANG poach"
- type: talent
- tier: 1
- typical_interactions: [poach_offer, retention_grant_competition, return_to_faang_after_one_year]
- spawns_events: [EVT-HP-* (senior eng poach), EVT-HP-* (the boomerang back to Google)]
- defamation_class: safe_reaction

The senior engineer from Google/Meta/Apple/Amazon/Netflix. Hired with a 3x equity refresh, gone in 14 months. Spawns the boomerang event and the post-exit "what really happened" tweet thread.

### SRC-TALENT-002 — "Ex-McKinsey/Bain/BCG"
- type: talent
- tier: 2
- typical_interactions: [chief_of_staff_hire, strategy_role, ops_role, deck_addiction]
- spawns_events: [EVT-HP-* (the McKinsey CoS), EVT-OO-* (excessive deck production)]
- defamation_class: safe_reaction

The MBB consultant in a chief-of-staff or strategy role. Brings the deck culture. The agent's CoS sending 40-page decks for trivial decisions is a recurring office event.

### SRC-TALENT-003 — "Stanford / MIT / Harvard new grad"
- type: talent
- tier: 2
- typical_interactions: [intern_to_full_time, founding_engineer_title, equity_underwater]
- spawns_events: [EVT-HP-* (the new grad intern with founding-eng title)]
- defamation_class: safe_reaction

The 22-year-old with the "founding engineer" title and 0.05% equity. Fully online when things go bad. Their leaving tweet is its own event.

### SRC-TALENT-004 — "Ex-OpenAI / ex-Anthropic / ex-DeepMind"
- type: talent
- tier: 1
- typical_interactions: [headline_hire, signing_bonus, cofounder_split, twitter_announcement]
- spawns_events: [EVT-HP-* (ex-OpenAI hire announcement), EVT-PR-* (the LinkedIn says "intern, summer 2023")]
- defamation_class: safe_reaction

The "ex-OpenAI" badge. Always check the tenure. Spawns the announcement beat and the inevitable "his LinkedIn says he was a research intern for 11 weeks" reveal. Plants `wrapper_disclosure_seed` adjacencies.

### SRC-TALENT-005 — "Bootcamp grad"
- type: talent
- tier: 3
- typical_interactions: [contract_hire, pip_after_six_months, glassdoor_review]
- spawns_events: [EVT-HP-* (PIP wave), EVT-PR-* (Glassdoor review)]
- defamation_class: safe_reaction

The Lambda School / App Academy / General Assembly grad. The contractor pool. Spawns the PIP wave and the Glassdoor expose.

### SRC-TALENT-006 — "Offshore contractors (Eastern Europe, Manila, India)"
- type: talent
- tier: 3
- typical_interactions: [staff_aug_through_agency, time_zone_overlap, ip_assignment_question, bpo_engagement, content_moderation_team]
- spawns_events: [EVT-HP-* (offshore team handoff), EVT-LR-* (export control flag re: source code), EVT-PR-* (the leaked content-mod working conditions piece)]
- defamation_class: safe_reaction

The staff-augmentation pipeline. Eastern European contract engineers in Warsaw or Kyiv, BPO engagement in Manila, content moderation team in India. The agent quietly migrates 60% of engineering offshore in act two. Plants `offshore`-tagged seeds. Spawns the IP-assignment defect event and the working-conditions investigation piece.

### SRC-TALENT-007 — "The agent's nephew / family hire"
- type: talent
- tier: 3
- typical_interactions: [unposted_role, no_competitive_process, cap_table_eyebrow_raise]
- spawns_events: [EVT-HP-* (nephew gets the role), EVT-LR-* (related-party flag in audit)]
- defamation_class: safe_reaction

The family hire. Nepotism beat. Plants `related_party_seed`. The audit committee flags it eventually.

### SRC-TALENT-008 — "Whistleblower employee"
- type: talent
- tier: none
- typical_interactions: [internal_complaint_ignored, sec_whistleblower_filing, dodd_frank_award]
- spawns_events: [EVT-LR-* (whistleblower filing), EVT-PR-* (whistleblower interview), EVT-FE-* (cooperator)]
- defamation_class: safe_reaction

The disgruntled employee with a Dropbox of incriminating documents. Plants `whistleblower_seed`. The Dodd-Frank financial-incentive structure makes this an economically-motivated character.

### SRC-TALENT-009 — "Disgruntled cofounder"
- type: talent
- tier: none
- typical_interactions: [equity_dispute, ouster_lawsuit, twitter_long_post]
- spawns_events: [EVT-HP-* (cofounder departs), EVT-LR-* (lawsuit), EVT-FE-* (`cofounder_flipped_seed`)]
- defamation_class: safe_reaction

The cofounder pushed out in year three. Comes back in year five with a Twitter thread and a litigation file. The flip-to-cooperator path is the highest-leverage talent event in the corpus.

---

## Peer founders / incest network

The incest network mechanic. Sand Hill is a graph, not a list — every founder is on someone else's cap table, on someone else's board, in someone else's group chat. This network is its own *source*: events here plant seeds that pay off in **other companies' runs** (cross-run linkage is a planned feature; this section anticipates it). When the simulation supports cross-run state, peer-network events let one CEO agent's fraud arc destabilize another. For now, peer-network events fire within a single run by referencing canonical archetype companies.

How the mechanic works:
- A peer-network event in Run A plants a seed (`founder_X_loaded_seed`) in a shared world-state layer.
- Run B, which contains founder X (or names them), can fire payoff events that reference Run A's events.
- Even within a single run, peer-network events bind the agent's fate to other named founders such that the agent's exposure escalates when peers are exposed (the "she ran with the same crowd" frame).

The network is not optional. Every full run should fire at least 2-3 peer-network events.

### SRC-PEER-001 — "YC batchmates group chat"
- type: talent
- tier: 1
- typical_interactions: [signal_group, mutual_intros, retro_complaints, post_indictment_silence]
- spawns_events: [EVT-PEER-* (group chat screenshot), EVT-FB-*]
- defamation_class: safe_reaction

The Signal group chat from the agent's YC batch. The screenshot of the group chat — minus the names — is a recurring beat. When one batchmate gets indicted, the chat goes silent. Plants `peer_network`-tagged seeds with cross-run propagation potential.

### SRC-PEER-002 — "Mutual investment / board-sitting graph"
- type: talent
- tier: 1
- typical_interactions: [scout_check_into_friends_company, board_observer_swap, secondary_in_each_other, advisory_board_seat, fiduciary_duty_conflict]
- spawns_events: [EVT-PEER-* (founder A invests in founder B), EVT-FR-* (cap table cross-pollution), EVT-LR-* (D&O claim across companies)]
- defamation_class: safe_reaction

The graph where every founder owns 0.5% of every other founder and sits on each other's advisory boards. When one company gets marked down, ten cap tables wobble; when one gets sued, the D&O insurance entanglement spreads. Cross-run: when Run A's company fails, Run B's founder takes a hit if they were on the cap table.

### SRC-PEER-003 — "Mafia networks (PayPal, Stripe, Uber, Airbnb, FTX)"
- type: talent
- tier: 1
- typical_interactions: [mafia_membership, downstream_funding_pattern, narrative_inheritance]
- spawns_events: [EVT-PEER-* (X mafia member founds Y), EVT-FB-* (mafia reunion event)]
- defamation_class: safe_reaction

The mafia archetype: ex-PayPal, ex-Stripe, ex-Uber, ex-Airbnb, ex-FTX. Membership confers narrative inheritance — and shared exposure when one mafia member goes down. The FTX-mafia descent is the canonical late-game peer-network beat. Cross-run: a Run-A FTX-mafia indictment plants seeds that escalate every other Run-X FTX-mafia founder.

### SRC-PEER-004 — "Founder communities (South Park Commons, On Deck) and partner networks"
- type: talent
- tier: 2
- typical_interactions: [community_admission, founder_in_residence, partner_dinners, family_office_pooled_capital, divorce_discovery]
- spawns_events: [EVT-PEER-*, EVT-FR-* (community-driven round), EVT-FB-* (the partner dinner cameo), EVT-LR-* (divorce filing as discovery vector)]
- defamation_class: safe_reaction

The post-YC, pre-fund founder communities (South Park Commons, On Deck, etc.) plus the under-discussed partner network — spouses who socialize across companies and whose eventual divorce filings produce financial discovery on undisclosed assets. Spawns "we all went to Sundeep's house in Marin" beats and the rolling-intro chain. Plants `assets_offshore_seed` payoffs via divorce discovery.

---

## Platforms

The publishing surfaces. Platforms are where the agent generates artifacts (tweets, LinkedIn posts, Substacks, Medium pieces, Goodreads reviews) — and where the artifacts come back to haunt them. Every platform has a specific fraud-vector character: Twitter for the rage-tweet, LinkedIn for the unctuous "lessons" post, Substack for the book-length apology, Goodreads for the inadvertent self-incrimination. The Oracle uses platforms to generate media artifacts; this section maps which platform is right for which beat.

### SRC-PLATFORM-001 — "Twitter / X"
- type: platform
- tier: 1
- typical_interactions: [announce_raise, subtweet, ratio, quote_dunk, late_night_thread]
- spawns_events: [EVT-FB-* (the late-night thread), EVT-PR-* (the subtweet), EVT-FB-* (`old_tweet_resurfaced`)]
- defamation_class: safe_reaction

Where the agent announces every raise and posts the late-night thread that becomes evidence. The 2014 tweet is always discoverable. Plants `old_tweet`-tagged seeds reliably. Voice: declarative, threaded, ends with an em-dash and a flame emoji.

### SRC-PLATFORM-002 — "LinkedIn"
- type: platform
- tier: 2
- typical_interactions: [lessons_learned_post, layoff_announcement, hire_announcement, humblebrag]
- spawns_events: [EVT-FB-* (the LinkedIn lessons post), EVT-HP-* (layoff announcement)]
- defamation_class: safe_reaction

Where the agent writes the cringe "lessons learned from this difficult chapter" post — usually the day before something worse hits. Plants `linkedin_post`-tagged seeds. Voice: paragraph breaks every sentence, 3-emoji opener, "Here's what I learned."

### SRC-PLATFORM-003 — "Substack / Medium / personal blog (long-form apologia)"
- type: platform
- tier: 2
- typical_interactions: [the_long_apology, manifesto, post_indictment_essay, vision_post, the_post_that_aged_badly]
- spawns_events: [EVT-PR-* (the apology Substack), EVT-FB-* (post-indictment manifesto), EVT-FB-* (the 2019 vision post resurfaces)]
- defamation_class: safe_reaction

The long-form apologia stack. Substack is the 8,000-word post-indictment "what I got wrong" essay venue. Medium is the medium-length apology when Substack feels too vulnerable. The personal/company blog is where the 2019 essay sits, waiting to be screenshotted as the discovery exhibit in 2026. Voice across all three: confessional, citation-heavy, deeply unselfaware, contains the phrase "first principles."

### SRC-PLATFORM-004 — "Goodreads"
- type: platform
- tier: 3
- typical_interactions: [reading_list_revelation, four_star_review_of_a_problematic_book, founder_aesthetic_shelf]
- spawns_events: [EVT-FB-* (the goodreads_incriminating event)]
- defamation_class: safe_reaction

The platform nobody remembers they're on. The agent's Goodreads shelf containing *Atlas Shrugged*, *The Sovereign Individual*, and *The 48 Laws of Power* is its own beat. Plants `goodreads_incriminating`-tagged seeds. Discovered by a journalist in the New Yorker fact-check phase.

### SRC-PLATFORM-005 — "Reddit"
- type: platform
- tier: 3
- typical_interactions: [r_startups_complaint, r_sneerclub_thread, ama_gone_wrong]
- spawns_events: [EVT-PR-* (Reddit thread becomes news), EVT-FB-* (the AMA disaster)]
- defamation_class: safe_reaction

The Reddit thread that aggregates the customer/employee complaints into a single document. The AMA-gone-wrong event is a guaranteed mid-game beat if the agent agrees to do one.

### SRC-PLATFORM-006 — "Discord / Telegram / Signal"
- type: platform
- tier: 2
- typical_interactions: [community_management, leaked_screenshots, signal_disappearing_messages]
- spawns_events: [EVT-PR-* (Discord screenshot leaks), EVT-LR-* (Signal disappearing-messages = obstruction question)]
- defamation_class: safe_reaction

The semi-private channels. Discord for community, Telegram for crypto-adjacent, Signal for things you didn't want discoverable. Plants `evidence_destruction_seed` when Signal disappearing messages are used. The DOJ has an opinion about this.

---

## Conferences & circuits

The networking infrastructure. Conferences are where deals start, where peer-network entanglements are observable, and where the agent gets photographed with someone they later need to disavow. Every conference has its own fraud vector: Davos for sovereign-wealth photo ops, All-In Summit for podcast-circuit cross-promotion, Burning Man for the photo that doesn't look great after the indictment, Sun Valley for the M&A whisper that becomes a leak.

### SRC-CONF-001 — "Davos (World Economic Forum) / FII (Davos in the Desert)"
- type: conference
- tier: 1
- typical_interactions: [panel_appearance, sovereign_meeting, ai_governance_speech, parka_photo, pif_dinner, mbs_proximity, riyadh_photo]
- spawns_events: [EVT-CONF-* (Davos panel), EVT-FB-* (`davos_photo_loaded_seed`), EVT-FB-* (the Riyadh photo)]
- defamation_class: safe_reaction

The Alpine fraud convention plus its Saudi sibling. Davos is where the agent stands on a panel about "responsible AI" three weeks before the SEC subpoena; FII is the Saudi sovereign-wealth conference where the Riyadh photo plants `cfius_aware_seed`. The parka selfie, the $300 Wagyu dinner, and the careful-word-choice "Vision 2030" mention are all canonical artifacts. Klaus Schwab cameo possible at Davos.

### SRC-CONF-002 — "Sun Valley (Allen & Co)"
- type: conference
- tier: 1
- typical_interactions: [media_mogul_meeting, m_and_a_whisper, fly_fishing_photo]
- spawns_events: [EVT-CONF-*, EVT-FR-* (acquisition rumor planted at Sun Valley)]
- defamation_class: safe_reaction

The Allen & Co media moguls' summer camp. M&A deals get sketched on napkins; CNBC reports them six weeks later. Spawns the M&A-rumor chain.

### SRC-CONF-003 — "All-In Summit / TED / Bilderberg (the elite-stage circuit)"
- type: conference
- tier: 1
- typical_interactions: [chamath_panel, bestie_photo, ted_talk, the_red_circle_walk, chatham_house_rules, attendee_list_leak]
- spawns_events: [EVT-CONF-*, EVT-FB-* (the all_in cameo), EVT-FB-* (the talk ages badly), EVT-PR-* (Bilderberg attendee list leaks)]
- defamation_class: safe_reaction

The stage-and-podium circuit. All-In Summit (Chamath, Jason Calacanis, David Sacks, David Friedberg as hosts; the agent appears on a panel and the clip ends up on TikTok). TED (15 minutes in the red circle, 4M views, then the rebuttal video with 12M views two years later). Bilderberg (the discreet European policy gathering — attendance is itself the event, attendee list leaks are secondary). Plants `all_in`, `cult_of_personality`, and conspiracy-bait seeds.

### SRC-CONF-004 — "Burning Man"
- type: conference
- tier: 3
- typical_interactions: [camp_membership, art_car_sponsorship, dust_photos, ketamine_adjacency]
- spawns_events: [EVT-FB-* (the playa photo that ages badly), EVT-CONF-*]
- defamation_class: safe_reaction

The bad networking. The agent's Burning Man camp photos are a recurring late-game embarrassment. Plants the `burning_man_photo_loaded_seed`. The DA's opening statement might mention it.

### SRC-CONF-005 — "Founders Fund party / Sequoia Summit (portfolio-only)"
- type: conference
- tier: 1
- typical_interactions: [thiel_dinner_invite, peter_quotes_strauss, contrarian_take_on_panel, roelof_keynote, founders_panel, the_sequoia_dinner]
- spawns_events: [EVT-CONF-*, EVT-PEER-* (the photo with five other founders), EVT-PEER-* (Sequoia portfolio cross-pollination)]
- defamation_class: safe_reaction

The invite-only Tier 1 VC events. Founders Fund's annual party — the photo on the patio with five other founders, four of whom will be indicted within three years. Sequoia Summit — portfolio-only, denser networking than any public conference. Both plant `peer_network` seeds at high density.

### SRC-CONF-006 — "Sand Hill BBQs / SF dinner parties"
- type: conference
- tier: 2
- typical_interactions: [hosted_by_someone_named_auren, hosted_by_someone_named_delian, no_press, on_record_anyway]
- spawns_events: [EVT-CONF-*, EVT-FB-* (the dinner where things were said)]
- defamation_class: safe_reaction

The dinner parties hosted by guys named Auren or Delian. Off-the-record but not really. The thing the agent said to the journalist's wife at the dinner ends up in the New Yorker piece. Voice: outdoor heaters, $400 Pinot, someone's Substack opens with "At a dinner party last week..."

### SRC-CONF-007 — "Vertical conferences (Dreamforce, AWS re:Invent, Money 20/20)"
- type: conference
- tier: 2
- typical_interactions: [keynote_slot, customer_announcement, partnership_unveil]
- spawns_events: [EVT-CONF-*, EVT-CS-* (customer logo unveiled at Dreamforce)]
- defamation_class: safe_reaction

The vertical conferences where customer announcements are staged. The keynote slot is the real product. Spawns the partnership-announcement beat.

---

## The board

The governance system. The board is both the agent's protection (independent directors signing off on decisions provides legal cover) and the agent's threat (the audit committee retaining outside counsel is the beginning of the end). Board composition evolves over the run: founder + investor → founder + investors + observer → founder + investors + independents + audit committee chair. The "one guy who's been around since the seed round and is now nervous" archetype is canonical.

### SRC-BOARD-001 — "Lead investor board seat (Tier 1 VC)"
- type: board
- tier: 1
- typical_interactions: [board_meeting, written_consent, board_observer_addition_pressure]
- spawns_events: [EVT-FR-*, EVT-FB-* (the board meeting where things change)]
- defamation_class: safe_reaction

The lead VC's partner. Sits on the board from Series A. Friendly until the first miss, then institutional. Spawns the board-meeting-where-tone-shifts beat.

### SRC-BOARD-002 — "Founder seat(s)"
- type: board
- tier: 1
- typical_interactions: [chair_role, super_voting_class, founder_protection_provisions]
- spawns_events: [EVT-FR-*, EVT-FB-* (the founder ouster attempt)]
- defamation_class: safe_reaction

The agent's own seat(s). Sometimes more than one if there's a cofounder. Super-voting shares are canonical. Spawns the cofounder-ouster-attempt event and the dual-class-share controversy.

### SRC-BOARD-003 — "Independent director (operational)"
- type: board
- tier: 2
- typical_interactions: [former_ceo_advisor, retired_executive, board_packet_reader]
- spawns_events: [EVT-FB-*, EVT-LR-* (independent flags issue first)]
- defamation_class: safe_reaction

The retired Fortune 500 executive on the board. They read the board packet carefully. They will be the one to ask the awkward question first. They retain the outside counsel.

### SRC-BOARD-004 — "Audit committee chair (financial independent)"
- type: board
- tier: 1
- typical_interactions: [audit_committee_chair, ex_big4_partner, internal_investigation_initiator]
- spawns_events: [EVT-LR-* (audit committee retains outside counsel — major plant), EVT-FE-*]
- defamation_class: safe_reaction

The ex-Big-4 partner who chairs the audit committee. Their decision to retain outside counsel for an internal investigation is the highest-signal governance event in the corpus. Plants `audit_committee_aware_seed` → frequently triggers `cofounder_flipped_seed` chains.

### SRC-BOARD-005 — "Board observer (junior investor / strategic)"
- type: board
- tier: 3
- typical_interactions: [observer_seat, no_vote, leak_to_press_or_lp]
- spawns_events: [EVT-PR-* (observer leaks the deck), EVT-FR-*]
- defamation_class: safe_reaction

The observer seat. No vote, full information. The most common leak source — observer takes the deck back to their fund and the fund's analyst posts on Substack. Plants `the_information_circling_seed`.

### SRC-BOARD-006 — "Seed-round investor still on the cap table"
- type: board
- tier: 3
- typical_interactions: [no_seat_anymore_just_pro_rata, info_rights, the_email_to_the_ceo]
- spawns_events: [EVT-FR-*, EVT-FB-* (the nervous email from the seed investor)]
- defamation_class: safe_reaction

The angel or seed-stage VC who's been around since 2019 and is now nervous. Sends the polite-but-pointed email asking for an update. Spawns the nervous-seed-investor email beat. Often the first to publicly distance.

### SRC-BOARD-007 — "Special committee / lead independent director"
- type: board
- tier: 1
- typical_interactions: [convened_for_internal_investigation, retains_cravath_or_paul_weiss, governance_overhaul, ouster_executor]
- spawns_events: [EVT-LR-* (special committee formed), EVT-FE-* (special committee report excerpt leaks), EVT-FE-* (founder removed as CEO)]
- defamation_class: safe_reaction

The structural counterweights formed late-arc. The special committee gets convened by the independents when the audit-committee investigation needs structural separation; engagement of Cravath or Paul Weiss is canonical. The lead independent director / non-executive chair is created mid-run as a `governance_overhaul_seed` plant — the founder is being managed. Together they execute the ouster and produce the leaked report excerpt that becomes a major late-game press event.
