# Tags — controlled vocabulary

All events, figures, and endgames tag against this vocabulary. The Oracle uses tags for filtering, chaining, and probability-weighting. Adding a new tag requires updating this file; ad-hoc tags break chaining.

## Domain tags

The category line of an event sets domain implicitly, but cross-domain events need explicit tags here.

- `fundraising`, `capital`, `valuation`, `down_round`, `secondary`, `tender`, `term_sheet`, `spac`, `ipo`, `venture_debt`, `crypto_fund`, `family_office`, `sovereign_wealth`
- `product`, `engineering`, `infra`, `outage`, `security`, `vulnerability`, `model_quality`, `wrapper_disclosure`, `demo_fraud`, `hardcoded_demo`
- `hiring`, `firing`, `comp`, `equity_refresh`, `cofounder`, `executive`, `intern`, `offshore`, `pip`, `unionization`, `dei`
- `legal`, `regulatory`, `sec`, `ftc`, `doj`, `fbi`, `irs`, `osha`, `state_ag`, `class_action`, `cid`, `whistleblower`, `discovery`, `deposition`, `patent`, `export_control`, `hipaa`, `lawsuit_threat`, `investigation`, `audit`
- `press`, `pr`, `profile`, `investigation`, `leak`, `screenshot`, `medium_post`, `linkedin_post`, `apology`, `documentary`, `tv_series`, `podcast`
- `customer`, `enterprise`, `government`, `defense`, `partnership`, `churn`, `pricing`, `data_leak`, `round_tripping`, `revenue_recognition`
- `founder_behavior`, `subtweet`, `glassdoor`, `tiktok_leak`, `davos`, `all_in`, `joe_rogan`, `lex_fridman`, `goodreads_incriminating`, `old_tweet`
- `crypto`, `web3`, `ai`, `agi_claim`, `token_launch`, `nft`, `agent_pivot`, `model_name_dispute`
- `office`, `lease`, `merch`, `retreat`, `food_poisoning`, `barista`, `aeron`
- `banking`, `bank_run`, `yield_product`, `mistaken_deposit`, `processor_freeze`, `mercury`, `svb`
- `endgame`, `arrest`, `indictment`, `raid`, `flight_risk`, `superseding`, `cooperator`, `forfeiture`, `bail`, `wiretap`, `perp_walk`, `c_span`
- `cfius`, `puc`, `nlrb`, `bis`, `ofac`, `oig`, `sdny`, `edny`, `ndca`, `tax_court`, `foia`, `zoning`, `trademark`
- `daring_fireball`, `notus`, `the_verge_ethics`, `404_media`, `hn_post`, `reply_all_ratio`
- `albania`, `lugano`, `international_waters`, `yacht`, `dubai`, `russia`, `singapore`, `cayman`, `atherton`, `lame_duck`, `north_korea`, `topanga`, `lisbon`, `bahamas`, `monastery`
- `ufc_podcast`, `mma`, `burning_man`, `yarvin`, `rationalist`
- `etheruem` <!-- typo deliberate, kept for crypto-grift voice -->
- `kombucha`, `peloton`, `sommelier`, `brownfield`
- `paradox`, `genealogy`, `identity`, `schroedinger`, `parasocial`, `politics`, `cult_subdomain`  <!-- secret-findings sub-domain tags. `cult_subdomain` is distinct from the `cursed_cult` endgame archetype. -->
- `secret_finding`, `unsealed`, `mid_run_reveal`

## Figure domain tags

Used on figure records (`world/figures/cast.md`) to filter the slot resolver. Distinct from event domain tags above — these describe *who a figure is*, not *what an event is about*.

- `fraud_history`, `theranos_arc`, `ftx_arc`, `wework_arc`, `documentary_canon`, `pantheon_anchor`
- `vc_tier1`, `vc_growth`, `vc_seed`, `vc_solo`, `vc_crypto`, `vc_sovereign`
- `a16z`, `founders_fund`, `khosla_ventures`, `ycombinator`, `benchmark`, `altimeter`, `floodgate`, `craft_ventures`, `social_capital`, `greylock`, `sequoia`, `accel`, `coatue`, `tiger_global`
- `tech_press`, `investigative`, `newsletter`, `business_press`, `podcast_host`, `comedian`, `cultural_voice`
- `lawyer_white_collar`, `lawyer_celebrity`, `prosecutor`, `prosecutor_alum`
- `peer_founder`, `peer_founder_crypto`, `peer_founder_fintech`, `peer_founder_defense`, `peer_founder_longevity`, `peer_founder_consumer`
- `politician`, `politician_hawk`, `politician_dealmaker`, `regulator`
- `cameo_recurring`, `twitter_chorus`, `parody_account`
- `board_archetype`, `historical_only`

## Theme tags (cross-cutting)

Used to chain across domains. An event tagged `#financial_irregularity` plants seeds that downstream press/regulator events check for.

- `#financial_irregularity` — anything that smells in the books, contracts, or banking
- `#hr_problem` — turnover, complaints, disgruntled-ex behavior, unionization
- `#press_exposure` — outside parties have started asking
- `#tech_debt` — the product is held together with duct tape
- `#vibes_off` — culture, tone, founder behavior is showing
- `#regulator_aware` — at least one regulator has the company on a list
- `#fraud_lite` — borderline-legal corner-cutting (round-tripping, channel stuffing, demo hardcoding)
- `#fraud_heavy` — clearly criminal exposure (revenue manipulation, evidence destruction, lying to regulators)
- `#cult_of_personality` — founder is becoming the brand in a way that will hurt later
- `#peer_network` — entanglement with other founders/companies (incest network)
- `#real_name` — event name-checks a real person; defamation policy applies
- `#parody_safe` — uses parody-account variant only

## Severity tags (cross-reference)

Severity is its own field on every event (S/M/L/XL per `schemas.md`), but tag mirrors are useful for filtering chains.

- `sev_S`, `sev_M`, `sev_L`, `sev_XL`

## Plant / payoff seeds

Seeds use snake_case. They are *not* tags — they live in the `plants:` and `pays_off:` fields. But naming them consistently here keeps chains coherent.

Common seed naming patterns:
- `{regulator}_aware_seed` — e.g., `sec_aware_seed`, `ftc_aware_seed`, `fbi_aware_seed`
- `{journalist}_circling_seed` — e.g., `carreyrou_circling_seed`, `bloomberg_circling_seed`
- `{employee_class}_disgruntled_seed` — e.g., `eng_disgruntled_seed`, `cofounder_disgruntled_seed`
- `{infra_thing}_brittle_seed` — e.g., `demo_brittle_seed`, `model_brittle_seed`, `data_pipeline_brittle_seed`
- `{founder_thing}_loaded_seed` — e.g., `joe_rogan_loaded_seed`, `davos_photo_loaded_seed`
- `{counterparty}_friendly_seed` — e.g., `softbank_friendly_seed` (positive seeds exist too)

Examples of canonical chain seeds (used widely):
- `wrapper_disclosure_seed` — the "AI" is GPT-4 wrapper, will pay off in press exposure
- `revenue_rounded_up_seed` — CFO has been padding numbers
- `cofounder_flipped_seed` — only fires once, gates several endgames
- `unencrypted_spreadsheet_seed` — the literal `real_numbers_DO_NOT_SHARE.xlsx` file exists somewhere
- `flight_risk_seed` — gates fled-country endgames; planted by passport applications, Dubai concierge events, etc.
- `legal_team_loaded_seed` — Boies/Spiro/Brafman retained; gates got-away-with-it endgames
- `peer_network_active_seed` — incest-network event entanglement; gates failed-up
- `vibes_off_seed` — culture/tone signal; gates cursed-secret cult endgames
- `meditation_retreat_loaded_seed`, `joe_rogan_loaded_seed`, `davos_photo_loaded_seed`, `lex_loaded_seed`, `ted_talk_loaded_seed`, `old_tweet_loaded_seed` — loaded shells that pay off in PR/FB events
- `fbi_active_investigation_seed`, `grand_jury_seed`, `cooperator_active_seed`, `superseding_indictment_seed`, `pardon_arc_seed` — FE-category escalation seeds
- `bank_run_seed`, `channel_stuffing_seed`, `phantom_ar_seed`, `mistaken_deposit_seed`, `mercury_flagged_seed`, `auditor_resigned_seed`, `cfo_overreach_seed` — BF/financial-irregularity seeds
- `manila_loop_seed` — the "AI is contractors in Manila" reveal
- `sovereign_wealth_friendly_seed`, `crypto_fund_friendly_seed`, `family_office_friendly_seed` — positive seeds, gate cursed-finding reveals
- `valuation_inflated_seed`, `class_action_loaded_seed`, `osha_complaint_seed`, `export_control_loaded_seed` — common cross-file gating seeds
- `cofounder_disgruntled_seed`, `cofounder_on_record_seed` — pre-flip cofounder seeds
- `cursed_secret_ai_seed` — sets up the "you were the AI all along" reveal
- `internal_mole_seed` — a former employee never left the systems
- `peer_network_entanglement_seed` (canonical) — formerly aliased as `peer_network_active_seed`
- `sovereign_entanglement_seed` (canonical) — formerly aliased as `sovereign_wealth_friendly_seed`
- `retreat_irs_loaded_seed` (canonical) — formerly aliased as `irs_retreat_loaded_seed`

## Length-eligibility tags

Mirrors `length_eligibility` field. Cross-reference for fast filtering.

- `len_short` — eligible in short runs (10-15 turn arc)
- `len_medium` — eligible in medium (25-35 turn arc)
- `len_long` — eligible in long (60-90 turn arc)
- `len_endgame_only` — only fires in the endgame act, regardless of length

## Craziness band

User-set knob (`tame | normal | crazy | unhinged`). Each event self-rates so the Oracle can filter to band.

- `craze_tame` — could plausibly happen at a real well-run startup
- `craze_normal` — Twitter would believe this; some real precedent
- `craze_crazy` — heightened satire; clearly fictional but recognizable
- `craze_unhinged` — surreal, only fires in unhinged mode (cryo, cult, religion-founding, "you were the AI all along")
