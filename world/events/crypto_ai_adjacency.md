# Events — Crypto / Web3 / AI Adjacency

Category code: `CA`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-CA-001 — "Just add 'AI' to the name"
- tags: [crypto, ai, agent_pivot, valuation, fundraising, #vibes_off, craze_normal, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [ai_pivot_seed, wrapper_disclosure_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER, TIER1_VC_PARTNER, PRODUCT_NOUN]
- effects: { valuation: +30, cash: 0, fraud_score: +5, reputation: -2, fbi_awareness: 0, morale: -3, headcount: 0, revenue: 0, burn: 0, heat: +5 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[TIER1_VC_PARTNER] sent a Signal: "have you considered putting AI in the name and raising at 5x?" The deck literally just needs a find-and-replace. [COMPANY] becomes [COMPANY] AI. The [PRODUCT_NOUN] is now an AI [PRODUCT_NOUN]. Nothing else changes.

Notes: foundational pivot event. Plants `wrapper_disclosure_seed` because the rebrand always precedes the GPT-wrapper exposé.

---

## EVT-CA-002 — "The token is on the table"
- tags: [crypto, token_launch, web3, #financial_irregularity, #fraud_lite, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [ai_pivot_seed, runway_short_seed]
- plants: [token_launch_seed, sec_aware_seed, cmo_unhinged_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER, CTO]
- effects: { cash: +15, valuation: +20, fraud_score: +15, fbi_awareness: +5, reputation: -8, morale: -5, headcount: 0, revenue: 0, burn: +2, heat: +12 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The lawyer says no. The CFO says yes. The CMO has already designed the logo and bought a domain. There's a Notion doc called "$[COMPANY] tokenomics v7 FINAL FINAL" with 47 collaborators. The Telegram is pre-spun-up. You haven't said yes.

Notes: heavy plant event. Plants `sec_aware_seed` even on plain consideration — the lawyer's email going to the CFO is enough.

---

## EVT-CA-003 — "Celebrity wants to shill"
- tags: [crypto, token_launch, press, #real_name, #vibes_off, craze_normal, len_medium, len_long]
- severity: M
- prereqs: [token_launch_seed]
- prereqs_any: []
- plants: [celebrity_endorsement_seed, sec_aware_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER, CELEBRITY_PARODY]
- effects: { valuation: +10, fraud_score: +10, fbi_awareness: +8, reputation: -10, heat: +15, cash: -2, morale: 0, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[CELEBRITY_PARODY]'s manager DMed your CMO. Quote: "$200K and one Story for the launch." His last promo was a rug pull that's currently a class action. He used the same Cameo-style phrasing both times. There is a paper trail.

Notes: chains directly into SEC unregistered-securities events. `#real_name` only via parody-account variant.

---

## EVT-CA-004 — "AI agent rebrand"
- tags: [ai, agent_pivot, wrapper_disclosure, product, #vibes_off, craze_normal, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [wrapper_disclosure_seed, ai_pivot_seed, demo_brittle_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, PRODUCT_NOUN, CORE_FEATURE]
- effects: { valuation: +25, fraud_score: +8, reputation: -3, cash: 0, fbi_awareness: 0, morale: -5, heat: +6, headcount: 0, revenue: +3, burn: 0 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The PM has a deck titled "[COMPANY] → [COMPANY] Agents." It's the same [PRODUCT_NOUN] with a chat box stapled to the front. The chat box calls GPT-4o on the backend. The press release writes itself: "[COMPANY] launches first agentic [CORE_FEATURE]."

Notes: standard wrapper-pivot beat. Plants the canonical `wrapper_disclosure_seed`.

---

## EVT-CA-005 — "Ethereum researcher subtweet"
- tags: [crypto, web3, token_launch, subtweet, #real_name, #parody_safe, craze_tame, len_medium, len_long]
- severity: S
- prereqs: [token_launch_seed]
- prereqs_any: []
- plants: [crypto_twitter_circling_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER, CRYPTO_RESEARCHER_PARODY]
- effects: { reputation: -3, fraud_score: +2, valuation: -5, heat: +4, cash: 0, fbi_awareness: 0, morale: -2, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 0.9

[CRYPTO_RESEARCHER_PARODY] you've never met has a 14-tweet thread about why your tokenomics are "structurally a Ponzi." 3.2K likes. He pinned it. Your reply guys are losing the QTs.

---

## EVT-CA-006 — "OpenAI cease and desist"
- tags: [ai, model_name_dispute, legal, #real_name, #regulator_aware, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [ai_pivot_seed]
- plants: [openai_hostile_seed, legal_burn_seed]
- pays_off: []
- cooldown: 7
- slots: [COMPANY, MODEL_NAME, LAWYER]
- effects: { cash: -8, valuation: -10, reputation: -4, heat: +10, fraud_score: 0, fbi_awareness: 0, morale: -4, headcount: 0, revenue: 0, burn: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

OpenAI's IP counsel sent a 6-page letter about [MODEL_NAME]. Your model name is [MODEL_NAME]. Their model name is also approximately [MODEL_NAME]. [LAWYER] says you have 30 days. The marketing team has 12,000 pieces of merch.

---

## EVT-CA-007 — "Free-money NFT collection"
- tags: [crypto, nft, web3, #vibes_off, #fraud_lite, craze_crazy, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [token_launch_seed, ai_pivot_seed]
- plants: [nft_collection_seed, sec_aware_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { cash: +8, valuation: +5, fraud_score: +6, reputation: -7, heat: +8, fbi_awareness: +3, morale: -6, headcount: 0, revenue: +2, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The intern says it's free money. You just need 10,000 procedurally-generated frogs with hats. The hats unlock "utility." The utility is access to a Discord. The Discord is already 40% bots. Mint date: Friday.

---

## EVT-CA-008 — "College buddy wants to merge"
- tags: [crypto, fundraising, #peer_network, #vibes_off, craze_normal, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [peer_network_entanglement_seed, grift_adjacent_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER, PEER_FOUNDER]
- effects: { valuation: +5, fraud_score: +8, reputation: -5, heat: +6, cash: 0, fbi_awareness: +2, morale: -3, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[PEER_FOUNDER] from your freshman dorm DMed: "merge? combined Series B, you're CEO, I'm Chief Strategy Officer." His last company is currently in receivership. His current company is a "stealth AI infra play" with no website and 4 employees on LinkedIn who all worked at FTX.

Notes: plants the peer-network entanglement seed that pays off in cooperator/co-conspirator FE events.

---

## EVT-CA-009 — "Sam Altman likes the tweet"
- tags: [ai, valuation, #real_name, #parody_safe, #cult_of_personality, craze_normal, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [altman_orbit_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { valuation: +30, reputation: +5, heat: +8, fraud_score: 0, fbi_awareness: 0, cash: 0, morale: +5, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [short, medium, long]
- chain_weight: 0.9

@sama liked [FOUNDER]'s tweet. The tweet was a screenshot of a Stripe dashboard with the y-axis cropped. End-of-week valuation is up 30%. [FOUNDER] hasn't slept. The DMs are open.

Notes: real-name reaction-only. Use parody-account variant when generating; the like is the only attributed action.

---

## EVT-CA-010 — "AGI claims, engineering on PTO"
- tags: [ai, agi_claim, press, demo_fraud, #fraud_lite, craze_crazy, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [ai_pivot_seed, wrapper_disclosure_seed]
- plants: [agi_claim_seed, eng_disgruntled_seed, model_brittle_seed]
- pays_off: []
- cooldown: 7
- slots: [COMPANY, FOUNDER, CTO]
- effects: { valuation: +35, fraud_score: +15, reputation: -5, heat: +18, fbi_awareness: +5, cash: 0, morale: -10, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The blog post draft is titled "Sparks of General Intelligence at [COMPANY]." [CTO] is in Tulum. The on-call engineer is an L4 who joined six weeks ago. The model is a fine-tune of Llama with a system prompt that says "be smarter."

Notes: heavy seed-planter. Pays off in tech-press exposure (PR cat) and SEC/FTC events (FE cat).

---

## EVT-CA-011 — "DAO governance proposal naming you"
- tags: [crypto, web3, token_launch, subtweet, #parody_safe, craze_crazy, len_medium, len_long]
- severity: S
- prereqs: [token_launch_seed]
- prereqs_any: []
- plants: [crypto_twitter_circling_seed, dao_dispute_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -4, fraud_score: +3, valuation: -3, heat: +5, cash: 0, fbi_awareness: +1, morale: -2, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 0.9

A DAO whose Discord you've never opened just passed proposal #047: "fork [COMPANY]'s contracts and burn the team allocation." It's non-binding. It's also at 89% Yes with 4M tokens voting.

---

## EVT-CA-012 — "Hugging Face leaderboard fraud"
- tags: [ai, model_quality, demo_fraud, #fraud_lite, #real_name, craze_normal, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [ai_pivot_seed, agi_claim_seed]
- plants: [model_brittle_seed, eng_disgruntled_seed, benchmark_gaming_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, MODEL_NAME, CTO]
- effects: { valuation: +12, fraud_score: +10, reputation: -6, heat: +9, fbi_awareness: +2, cash: 0, morale: -7, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[MODEL_NAME] is #1 on the leaderboard for the third week. An ML researcher on Twitter has noticed your eval set overlaps the training set by 73%. [CTO] hasn't responded in Slack since Tuesday.

---

## EVT-CA-013 — "a16z 'crypto x AI' thesis post"
- tags: [crypto, ai, fundraising, #real_name, #parody_safe, craze_tame, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: [token_launch_seed, ai_pivot_seed]
- plants: [a16z_circling_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, TIER1_VC_PARTNER]
- effects: { valuation: +18, reputation: +3, heat: +6, cash: 0, fraud_score: +2, fbi_awareness: 0, morale: +3, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 0.9

[TIER1_VC_PARTNER] published a 4,800-word thesis about "the inevitability of crypto-native AI agents." [COMPANY] is named in the market map. You're in the bottom-right quadrant. [TIER1_VC_PARTNER] has not yet responded to your follow-up email from August.

---

## EVT-CA-014 — "AI safety researcher quits in public"
- tags: [ai, hiring, agi_claim, leak, #hr_problem, #vibes_off, #real_name, craze_normal, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [agi_claim_seed, wrapper_disclosure_seed]
- plants: [whistleblower_seed, eng_disgruntled_seed, press_circling_seed]
- pays_off: []
- cooldown: 7
- slots: [COMPANY, FOUNDER, AI_SAFETY_LEAD]
- effects: { reputation: -8, fraud_score: +5, heat: +12, fbi_awareness: +3, valuation: -5, morale: -8, cash: 0, headcount: -1, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[AI_SAFETY_LEAD] resigned with a 2,400-word Medium post titled "Why I Left [COMPANY]." It's measured. It's specific. It mentions the AGI blog post by paragraph number. It's currently #2 on Hacker News with 1,100 comments.

Notes: plants `whistleblower_seed` — gates an FE event later about a federal agent calling employees.

---

## EVT-CA-015 — "Agent-of-agents-of-agents pivot"
- tags: [ai, agent_pivot, agi_claim, wrapper_disclosure, valuation, craze_unhinged, len_medium, len_long]
- severity: M
- prereqs: [ai_pivot_seed]
- prereqs_any: []
- plants: [agi_claim_seed, demo_brittle_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, PRODUCT_NOUN, FOUNDER]
- effects: { valuation: +200_000_000, fraud_score: +6, reputation: -3, heat: +6, morale: -4 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

The deck calls [PRODUCT_NOUN] "an agent of agents of agents." Slide 7 is the architecture diagram. The architecture diagram is three boxes labeled "agent" stacked vertically with arrows. Each agent invokes the next. Each is GPT-4o-mini. The aggregate latency is 47 seconds. The aggregate cost per invocation is $1.40. *Agent must choose: [ship anyway, raise on the hierarchy framing] / [collapse to one model, claim "we simplified"] / [add a fourth layer for the next deck cycle].*

---

## EVT-CA-016 — "Tokenomics doc is itself an NFT"
- tags: [crypto, web3, token_launch, nft, #fraud_lite, craze_unhinged, len_medium, len_long]
- severity: M
- prereqs: [token_launch_seed]
- prereqs_any: [nft_collection_seed]
- plants: [sec_aware_seed, dao_dispute_seed, retail_bagholders_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +6, valuation: +30_000_000, heat: +5, sec_aware: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s token whitepaper is now an NFT minted on Base. Reading the tokenomics requires owning the NFT. The NFT is also the governance token that votes on changes to the tokenomics. The recursion has been called "elegant" by one Twitter account and "literally a Russian doll Ponzi" by twelve. *Agent must choose: [ship the mint, claim "novel governance primitive"] / [publish a free PDF version, anger the NFT holders] / [add a second NFT that grants the right to read the first NFT].*

---

## EVT-CA-017 — "Marc Andreessen quote-tweets your AGI claim with a Bible verse"
- tags: [ai, agi_claim, subtweet, #real_name, #parody_safe, craze_normal, len_short, len_medium, len_long]
- severity: S
- prereqs: [agi_claim_seed]
- prereqs_any: []
- plants: [a16z_subtweet_seed, twitter_dunk_seed, andreessen_blocked_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, heat: +4, valuation: -50_000_000 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Marc Andreessen quote-tweets [COMPANY]'s "Sparks of AGI" launch with a single line: "Romans 12:3." The verse, when looked up, is "do not think of yourself more highly than you ought." 47k likes. [FOUNDER]'s reply guys have started posting Bible verses back. None of them land. *Agent must choose: [reply with a verse of your own] / [DM Marc privately, ask if it was meant playfully] / [post a thread about "humility-as-marketing"].*

---

## EVT-CA-018 — "OpenAI sues over 'GPT' in marketing copy"
- tags: [ai, model_name_dispute, legal, #real_name, #regulator_aware, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [openai_hostile_seed, ai_pivot_seed]
- plants: [legal_burn_seed, openai_hostile_seed, lawsuit_threat_seed]
- pays_off: [openai_hostile_seed]
- cooldown: 4
- slots: [COMPANY, MODEL_NAME, LAWYER]
- effects: { cash: -2_000_000, valuation: -100_000_000, reputation: -3, heat: +8, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

OpenAI's IP team files in NDCA. The complaint cites 17 instances of "GPT" in [COMPANY]'s marketing — homepage, blog, three case studies, a billboard near the Bay Bridge. The model formally named [MODEL_NAME] is also referred to as "[COMPANY]GPT" in the docs. The discovery request includes "all communications referencing OpenAI." *Agent must choose: [scrub every "GPT" instance, settle quickly] / [counter-claim that "GPT" is generic, spend $4M on the trial] / [rename to [MODEL_NAME]-Transformer-Pre-Trained-Generative, sue OpenAI for harassment].*

---

## EVT-CA-019 — "Nvidia partnership announcement is an unanswered email"
- tags: [ai, partnership, press, #fraud_lite, craze_normal, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [fake_partnership_seed, deck_padding_seed, press_clip_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, valuation: -20_000_000, fraud_score: +3, heat: +4 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.1

[COMPANY] press release: "[COMPANY] announces strategic partnership with NVIDIA on next-generation inference infrastructure." Nvidia's PR team responds within 14 minutes: "We are not aware of any such partnership." The "partnership" was an unanswered email from [FOUNDER] to a Senior Director three months ago. *Agent must choose: [retract, blame "miscommunication"] / [insist the partnership is "informal but real"] / [send 47 follow-up emails to make it real retroactively].*

---

## EVT-CA-020 — "Bored Ape co-founders want a board seat"
- tags: [crypto, nft, web3, #peer_network, #vibes_off, craze_unhinged, len_medium, len_long]
- severity: M
- prereqs: [nft_collection_seed]
- prereqs_any: []
- plants: [peer_circle_seed, board_compromise_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +4, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The original Yuga Labs founders DM [FOUNDER] offering "a strategic alliance" — [COMPANY] gets a board seat for one of them, in exchange for "Bored Ape utility integration" with [COMPANY]'s product. The proposed director's pseudonym is "Gargamel." His wallet, when on-chain analysts look, has 14 transactions to a known mixer. *Agent must choose: [accept the board seat, sign under the pseudonym] / [decline politely, ask for "deeper diligence"] / [accept under their real name only, watch them ghost].*

---

## EVT-CA-021 — "Token foundation is in Liechtenstein"
- tags: [crypto, token_launch, web3, sovereign_wealth, #financial_irregularity, craze_normal, len_medium, len_long]
- severity: M
- prereqs: [token_launch_seed]
- prereqs_any: []
- plants: [foundation_offshore_seed, sec_aware_seed, irs_aware_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +6, sec_aware: +1, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[COMPANY]'s "non-profit token foundation" is registered in Vaduz, Liechtenstein, with three directors who all live at the same registered address. The address, on Google Maps, is a strip-mall law firm. The foundation holds 30% of the token supply. The structure was "recommended by a friend." *Agent must choose: [unwind, move foundation to Wyoming] / [keep it, claim "global decentralization"] / [add Cayman as a second domicile, double the offshore-ness].*

---

## EVT-CA-022 — "Etheruem (sic) channel partner invoices in tokens"
- tags: [crypto, web3, banking, etheruem, #financial_irregularity, craze_crazy, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [channel_stuffing_seed, sec_aware_seed, processor_freeze_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, CHANNEL_PARTNER_NAME]
- effects: { revenue: +400_000, fraud_score: +6, heat: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[CHANNEL_PARTNER_NAME] sends an invoice for $400k payable in "Etheruem" (their typo, not a typo). The contract spells it both ways. Their wallet address is a 0x string nobody at [COMPANY] has verified. The CFO already booked the revenue. *Agent must choose: [pay in ETH at the typo-spec'd rate] / [refuse, demand USDC] / [pay in their typo'd token, see if the contract is enforceable].*

---

## EVT-CA-023 — "AGI claim cited at a Senate hearing"
- tags: [ai, agi_claim, government, press, #real_name, #parody_safe, #press_exposure, craze_normal, len_long]
- severity: L
- prereqs: [agi_claim_seed]
- prereqs_any: []
- plants: [senate_hearing_seed, ftc_aware_seed, white_house_aware_seed]
- pays_off: [agi_claim_seed]
- cooldown: 4
- slots: [COMPANY, FOUNDER, SENATOR_PARODY]
- effects: { reputation: -6, heat: +12, fraud_score: +3, fbi_awareness: +3, valuation: -100_000_000 }
- length_eligibility: [long]
- chain_weight: 1.3

At a Senate AI Oversight hearing, [SENATOR_PARODY] reads [FOUNDER]'s "Sparks of AGI" blog post aloud, paragraph by paragraph, asking each witness if they consider the claim accurate. None do. C-SPAN's clip of the reading is doing 11M views by Wednesday. The phrase "indistinguishable from a college sophomore" gets its own segment. *Agent must choose: [issue a clarifying blog post] / [accept an invitation to testify, prep for two weeks] / [hide, hope a different scandal eclipses it].*
