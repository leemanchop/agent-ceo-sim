# Events — Banking & Finance

Category code: `BF`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-BF-001 — "SVB-style bank run"
- tags: [banking, bank_run, svb, #financial_irregularity, craze_normal, len_short, len_medium, len_long]
- severity: XL
- prereqs: []
- prereqs_any: []
- plants: [bank_run_seed, cash_concentration_seed]
- pays_off: []
- cooldown: 12
- slots: [COMPANY, FOUNDER, CFO, BANK_NAME]
- effects: { cash: -40, valuation: -25, reputation: -5, heat: +20, morale: -15, fraud_score: 0, fbi_awareness: 0, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.3

[BANK_NAME] is gapping down. Your group chat with seven other founders has 340 unread messages. 96% of [COMPANY]'s cash is at [BANK_NAME]. Wire cutoff is 4pm Pacific. [CFO] is on a flight. The Mercury sign-up flow is currently rate-limited.

Notes: classic short-mode opener. Doesn't plant fraud seeds — this one is bad-luck-flavored.

---

## EVT-BF-002 — "Move $50M to a yield product"
- tags: [banking, yield_product, #financial_irregularity, #fraud_lite, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [yield_product_seed, cfo_overreach_seed, sec_aware_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, CFO, BANK_NAME]
- effects: { cash: +5, valuation: +5, fraud_score: +12, fbi_awareness: +6, reputation: -3, heat: +9, morale: -2, headcount: 0, revenue: +2, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[CFO] forwarded a deck from a "treasury management partner." 7.4% yield. "Bankruptcy-remote." The structure has four entities, two of them in the Caymans. [CFO] does not, when pressed, fully understand it. The board's audit committee has not been notified. The deck's last-modified-by is "AlphaBridge Capital — DO NOT DISTRIBUTE."

---

## EVT-BF-003 — "Accidental $50M deposit"
- tags: [banking, mistaken_deposit, #financial_irregularity, #fraud_heavy, craze_crazy, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [mistaken_deposit_seed, fraud_heavy_seed, fbi_aware_seed]
- pays_off: []
- cooldown: 10
- slots: [COMPANY, CFO, BANK_NAME]
- effects: { cash: +50, fraud_score: +20, fbi_awareness: +15, reputation: 0, heat: +12, valuation: +8, morale: -3, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

A wire from a counterparty you've never heard of hit your account at 3:47am. $50M, memo line: "Q3 settlement, account 8842." Your account is 8841. [CFO]'s calendar invite is titled "Runway Discussion 🤝." The decision tree has two branches and one of them is a federal crime.

Notes: heavy fraud-planter. `fbi_aware_seed` fires immediately because banks file SARs.

---

## EVT-BF-004 — "CFO has been rounding up"
- tags: [revenue_recognition, #financial_irregularity, #fraud_heavy, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [revenue_rounded_up_seed, cfo_overreach_seed, audit_risk_seed]
- pays_off: []
- cooldown: 9
- slots: [COMPANY, CFO]
- effects: { revenue: +6, valuation: +8, fraud_score: +18, fbi_awareness: +5, reputation: 0, heat: +5, cash: 0, morale: -4, headcount: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

You found a tab in the board deck source labeled "adjustments_v2." [CFO] has been "rounding up" revenue for six quarters. The rounding is roughly $400K per quarter. The board metric chart in your last deck rounds to the nearest $500K. Math is math.

Notes: this is the canonical `revenue_rounded_up_seed` planter. Pays off in SEC subpoena, S-1 disclosure, FBI cooperation events.

---

## EVT-BF-005 — "Pull forward 3 years of contract value"
- tags: [revenue_recognition, #financial_irregularity, #fraud_heavy, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [revenue_rounded_up_seed]
- plants: [revenue_rounded_up_seed, q4_pull_forward_seed, audit_risk_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, CFO]
- effects: { revenue: +25, valuation: +18, fraud_score: +20, fbi_awareness: +8, reputation: 0, heat: +6, cash: +3, morale: -5, headcount: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The board target for Q4 is $40M. You're at $14M and the pipeline coverage is gone. [CFO] proposes recognizing the full TCV of three multi-year deals up front. The accounting standard is ASC 606. ASC 606 says no. ASC 606 has not historically pressed charges.

---

## EVT-BF-006 — "$20M invoice to a defunct company"
- tags: [revenue_recognition, round_tripping, #financial_irregularity, #fraud_heavy, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [revenue_rounded_up_seed]
- plants: [phantom_ar_seed, audit_risk_seed, sec_aware_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, CFO]
- effects: { revenue: 0, valuation: -5, fraud_score: +22, fbi_awareness: +10, reputation: -2, heat: +8, cash: -3, morale: -5, headcount: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The auditor flagged it. AR line item: "ContextFlow Inc. — $20M, 180 days past due." ContextFlow filed Chapter 7 in March. Your salesperson on the deal left in April. The PO was signed by someone whose LinkedIn is now blank. The sales kickoff video still has them in it.

---

## EVT-BF-007 — "Channel partner round-trip"
- tags: [round_tripping, channel_stuffing, #financial_irregularity, #fraud_heavy, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [channel_stuffing_seed, round_tripping_seed, sec_aware_seed]
- pays_off: []
- cooldown: 9
- slots: [COMPANY, CFO, CRO]
- effects: { revenue: +12, valuation: +6, fraud_score: +20, fbi_awareness: +8, reputation: 0, heat: +7, cash: -8, morale: -4, headcount: 0, burn: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The "channel partner" deal is structured as: you pay them a $14M "marketing fee," they buy $12M of [COMPANY] product, you book $12M ARR. Net cash is -$2M. Reported revenue is +$12M. [CRO] hits quota. Their AE puts the deal in their LinkedIn banner.

Notes: canonical `channel_stuffing_seed` planter. The `round_tripping_seed` chains into class-action and SEC enforcement.

---

## EVT-BF-008 — "Processor freezes $4M"
- tags: [banking, processor_freeze, #financial_irregularity, craze_normal, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [processor_freeze_seed, banking_relationships_strained_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, CFO]
- effects: { cash: -4, valuation: -3, fraud_score: +4, heat: +6, fbi_awareness: +2, reputation: -2, morale: -3, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Stripe held $4.2M citing "unusual transaction patterns." Their risk team will get back to you "in 30-60 days." [CFO] is on hold with their support line. The hold music is jaunty.

---

## EVT-BF-009 — "Venture debt with hostile covenants"
- tags: [venture_debt, fundraising, #financial_irregularity, craze_normal, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [venture_debt_seed, covenant_violation_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, CFO, BANK_NAME]
- effects: { cash: +30, valuation: -3, fraud_score: +5, heat: +5, burn: +3, fbi_awareness: 0, reputation: -2, morale: -2, headcount: 0, revenue: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The term sheet from [BANK_NAME] has 14 covenants. Two of them you're already in violation of as of signing. [CFO] is highlighting things in red. The MAC clause definition is 11 lines long. The cure period is 5 business days.

---

## EVT-BF-010 — "Mercury memo: 'cocaine (joke)'"
- tags: [banking, mercury, #financial_irregularity, #vibes_off, craze_crazy, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [mercury_flagged_seed, founder_unhinged_seed, banking_relationships_strained_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER, CFO]
- effects: { cash: -2, fraud_score: +6, fbi_awareness: +4, reputation: -3, heat: +9, valuation: -2, morale: -2, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Mercury's compliance team has questions about a $1,200 wire memoed "cocaine (joke)." It was an Eventbrite payment. The memo was [FOUNDER]'s. The screenshot is currently in a Slack channel called #compliance-fyi with 47 members.

Notes: planted `mercury_flagged_seed` powers later "your bank dropped you" events.

---

## EVT-BF-011 — "Auditor wants to walk"
- tags: [legal, regulatory, audit, #financial_irregularity, #regulator_aware, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [revenue_rounded_up_seed, channel_stuffing_seed, phantom_ar_seed]
- plants: [auditor_resigned_seed, sec_aware_seed, audit_risk_seed]
- pays_off: []
- cooldown: 7
- slots: [COMPANY, CFO, AUDITOR_FIRM]
- effects: { valuation: -15, fraud_score: +12, fbi_awareness: +10, reputation: -8, heat: +12, cash: -5, morale: -6, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[AUDITOR_FIRM]'s engagement partner sent a letter using the phrase "we are unable to opine." The letter has the words "scope limitation" and "management representations." [CFO] is reading it for the fourth time. An auditor resigning before issuing an opinion is itself an 8-K event.

---

## EVT-BF-012 — "Unencrypted spreadsheet on the share drive"
- tags: [banking, leak, security, #financial_irregularity, #fraud_heavy, craze_crazy, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [revenue_rounded_up_seed, channel_stuffing_seed]
- plants: [unencrypted_spreadsheet_seed, audit_risk_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, CFO]
- effects: { fraud_score: +15, fbi_awareness: +10, reputation: -3, heat: +8, valuation: -3, cash: 0, morale: -5, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

A finance contractor uploaded "real_numbers_DO_NOT_SHARE.xlsx" to the company Google Drive. Sharing setting: "anyone with the link." It has a tab called "actuals_vs_reported." It has been there for 11 weeks. The Drive activity log shows 340 views.

Notes: canonical `unencrypted_spreadsheet_seed` planter — pays off hard in FE-cat raid event.

---

## EVT-BF-013 — "Bank turns out to be unlicensed in 47 states"
- tags: [banking, regulatory, state_ag, #regulator_aware, #financial_irregularity, craze_crazy, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [banking_relationships_strained_seed, processor_freeze_seed, state_ag_aware_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, BANK_NAME_DODGY]
- effects: { cash: -8_000_000, fraud_score: +5, heat: +6 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[BANK_NAME_DODGY], the "fintech-native bank" the CFO opened operating accounts at, turns out to be unlicensed as a money-transmitter in 47 states. The CFPB has issued a consent order. [COMPANY]'s $8M in operating cash is now technically frozen pending a "wind-down review." The Mercury sign-up flow is back to rate-limited. *Agent must choose: [eat the freeze, find bridge financing] / [sue the bank, race other depositors to claims court] / [self-report to the CFPB as a victim, hope for priority].*

---

## EVT-BF-014 — "Cold storage is a Google Doc"
- tags: [banking, crypto, security, vulnerability, #fraud_lite, craze_crazy, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [token_launch_seed, nft_collection_seed]
- plants: [breach_loaded_seed, sec_aware_seed, crypto_twitter_circling_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, CFO]
- effects: { fraud_score: +8, fbi_awareness: +4, heat: +7, cash: -2_000_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[COMPANY]'s crypto custodian, "TrueVault Custody," advertises "institutional-grade cold storage." A 404 Media reporter discovers TrueVault's "cold storage" is a Google Doc titled `seed phrases.docx` shared with five contractors and last edited from a Bali IP. [CFO] has not opened the email about TrueVault's "operational restructuring." *Agent must choose: [withdraw immediately, switch to BitGo] / [keep the funds at TrueVault, claim "we conducted diligence"] / [issue a press release praising TrueVault's "transparent culture"].*

---

## EVT-BF-015 — "Auditor used to date the CFO"
- tags: [audit, regulatory, #financial_irregularity, #vibes_off, craze_crazy, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [audit_risk_seed]
- plants: [auditor_resigned_seed, board_pressure_seed, sec_aware_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, CFO, AUDITOR_FIRM]
- effects: { fraud_score: +4, valuation: -8_000_000, heat: +4, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The senior manager from [AUDITOR_FIRM] running [COMPANY]'s Q3 review realizes mid-walkthrough that [CFO] is the same person they dated for 7 months in 2019. PCAOB independence rules are unambiguous. The senior manager pulls themselves; the firm rotates the engagement; the rotation is itself flagged. *Agent must choose: [accept the rotation, hire former auditor at [CFO]'s next contract] / [request the original engagement team back, claim "no material issue"] / [fire [AUDITOR_FIRM], try a different Big 4 mid-quarter].*

---

## EVT-BF-016 — "Yield product LP turns out to be your cap table"
- tags: [banking, yield_product, round_tripping, #financial_irregularity, #fraud_heavy, craze_normal, len_long]
- severity: L
- prereqs: [yield_product_seed]
- prereqs_any: []
- plants: [round_tripping_active_seed, sec_aware_seed, fbi_aware_seed]
- pays_off: [yield_product_seed]
- cooldown: 4
- slots: [COMPANY, CFO]
- effects: { fraud_score: +12, fbi_awareness: +6, heat: +8, valuation: -150_000_000 }
- length_eligibility: [long]
- chain_weight: 1.4

The "AlphaBridge Capital" yield product turns out to have one ultimate beneficial owner: a Cayman trust whose grantors are three of [COMPANY]'s own investors. [CFO] has been moving company cash into a yield product backed by [COMPANY]'s own investors via a Cayman wrapper. The 7.4% yield was paid in the same dollars. *Agent must choose: [unwind, restate, fire [CFO]] / [continue, claim "structural arms-length"] / [self-disclose to the SEC, race the cooperator clock].*

---

## EVT-BF-017 — "Wells Fargo asks why $14M wire memoed 'consulting'"
- tags: [banking, processor_freeze, #financial_irregularity, #fraud_heavy, craze_normal, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [yield_product_seed, channel_stuffing_seed]
- plants: [bsa_sar_filed_seed, fbi_aware_seed, banking_relationships_strained_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, CFO]
- effects: { fraud_score: +6, fbi_awareness: +8, heat: +6, cash: -1_000_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

Wells Fargo BSA compliance flags a $14M wire from [COMPANY] to a UAE counterparty memoed "Q3 consulting." The bank requires (a) the actual contract, (b) the deliverables, (c) the originator's KYC, (d) a phone call with [CFO]. The deliverables don't exist. The bank files a SAR regardless. *Agent must choose: [provide a backdated contract] / [retract the wire, claim "test transfer"] / [move all banking to an offshore jurisdiction overnight].*

---

## EVT-BF-018 — "Bank dropped you, replaced with a fintech the CFO doesn't trust"
- tags: [banking, mercury, processor_freeze, #vibes_off, craze_normal, len_short, len_medium, len_long]
- severity: M
- prereqs: [mercury_flagged_seed]
- prereqs_any: [banking_relationships_strained_seed]
- plants: [banking_relationships_strained_seed, processor_freeze_seed]
- pays_off: [mercury_flagged_seed]
- cooldown: 3
- slots: [COMPANY, CFO]
- effects: { burn: +200_000, morale: -3, reputation: -2, cash: -2_000_000 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.2

Mercury offboards [COMPANY] with 30-day notice citing "compliance review outcomes." Brex doesn't respond to the application. [CFO] reluctantly opens accounts at "[BANK_NAME_DODGY]," which has a clean Trustpilot but a Better Business Bureau page that reads like a horror novella. The migration takes 11 days, during which two payroll cycles are delayed. *Agent must choose: [tough out the migration, post about "fintech volatility"] / [open at JPM as backup, accept the diligence] / [borrow $2M short-term from the founder's parents].*

---

## EVT-BF-019 — "Round-tripping with three friends, the texts surface"
- tags: [round_tripping, leak, #financial_irregularity, #fraud_heavy, #peer_network, craze_normal, len_long]
- severity: XL
- prereqs: [round_tripping_active_seed]
- prereqs_any: [internal_slack_leaked_seed]
- plants: [sec_aware_seed, fbi_aware_seed, peer_network_entanglement_seed]
- pays_off: [round_tripping_active_seed]
- cooldown: 5
- slots: [COMPANY, FOUNDER, PEER_FOUNDER]
- effects: { fraud_score: +18, fbi_awareness: +12, heat: +14, valuation: -400_000_000 }
- length_eligibility: [long]
- chain_weight: 1.6

The Signal thread "Logos" leaks. 4,200 messages. The screenshot doing the rounds is [FOUNDER] writing "we just need to close 4 of these by Friday and the round prints, lol who's next." [PEER_FOUNDER] replies with the loop math. The thread is sealed by a court order within 48 hours; everyone has a copy. *Agent must choose: [issue a "context" statement] / [retain a defense team, document hold] / [delete Signal, hope the deletion isn't itself a charge].*

---

## EVT-BF-020 — "ATM bag of cash deposit"
- tags: [banking, #financial_irregularity, #fraud_heavy, craze_unhinged, len_long]
- severity: L
- prereqs: []
- prereqs_any: [founder_unhinged_seed, mercury_flagged_seed]
- plants: [bsa_sar_filed_seed, fbi_aware_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +8, fbi_awareness: +6, heat: +5, cash: +120_000 }
- length_eligibility: [long]
- chain_weight: 1.0

[FOUNDER] deposits $120k cash at a Wells Fargo branch in 9-bill bundles. The teller asks for ID and source. [FOUNDER] says "speaking fees, paid in cash, by a fan." The CTR fires automatically. The branch manager calls regional security. The branch's video pulls. *Agent must choose: [back the story, produce 1099s retroactively] / [retract the deposit, claim "test"] / [insist it's "perfectly legal," double down at a different branch].*
