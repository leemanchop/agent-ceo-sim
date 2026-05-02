# Events — Legal, Regulatory & Compliance

Category code: `LR`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-LR-001 — "SEC's polite Q2 letter"
- tags: [legal, regulatory, sec, revenue_recognition, #financial_irregularity, #regulator_aware, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [revenue_rounded_up_seed]
- plants: [sec_aware_seed, lawyer_engaged_seed, document_hold_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +6, heat: +8, sec_aware: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

The SEC sends [COMPANY] a polite letter asking about Q2 revenue recognition. The letter is two paragraphs and uses the phrase "we would appreciate." It is not a subpoena. Yet. *Agent must choose: [respond cooperatively through outside counsel] / [ignore the letter, claim it was misaddressed] / [quietly restate Q2 internally, hope the next 10-Q covers it].*

---

## EVT-LR-002 — "Class action lawyer is 'looking into it'"
- tags: [legal, class_action, #press_exposure, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [class_action_loaded_seed, lawyer_engaged_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +2, heat: +4, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A class action lawyer at a Connecticut firm posts on LinkedIn that they are "looking into" [COMPANY]'s terms of service. The post has 1,200 reactions and 80 comments tagging former customers. *Agent must choose: [send a takedown demand, watch the Streisand kick in] / [ignore, monitor] / [pre-empt with a "transparency" blog and a small refund program].*

---

## EVT-LR-003 — "Copy-paste ToS"
- tags: [legal, #financial_irregularity, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [tos_typo_seed, twitter_dunk_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, COMPETITOR]
- effects: { reputation: -3, fraud_score: +1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[COMPANY]'s terms of service were copy-pasted from another company. The other company's name is in the document seven times. A user on Twitter screenshots clause 14.3 which references "[COMPETITOR]'s sole discretion." *Agent must choose: [silently fix it, push the new ToS without notice] / [issue a "transparency" thread, frame it as "we move fast"] / [blame the law firm publicly].*

---

## EVT-LR-004 — "State AG eyes auto-renew"
- tags: [legal, regulatory, state_ag, #regulator_aware, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [state_ag_aware_seed, dark_pattern_seed, refund_program_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +3, heat: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The California AG opens an investigation into [COMPANY]'s auto-renewal practices. The cancel button is three menus deep, in light gray, behind a "are you sure" modal that asks four questions. *Agent must choose: [redesign the cancel flow, refund disputed charges] / [hire a PR firm, brace for press] / [argue the dark pattern is "user-friendly defaults" in a 600-word statement].*

---

## EVT-LR-005 — "FTC: define 'AI-powered'"
- tags: [legal, regulatory, ftc, ai, agi_claim, wrapper_disclosure, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [wrapper_disclosure_seed]
- plants: [ftc_aware_seed, marketing_audit_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { fraud_score: +5, heat: +6, ftc_aware: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

The FTC sends [COMPANY] a request asking what "AI-powered" means in the [PRODUCT_NOUN] marketing. They cite four specific homepage claims. They want supporting documentation in 30 days. *Agent must choose: [respond with the system prompt and a straight face] / [scrub the website overnight, claim "ongoing brand evolution"] / [hire former FTC counsel for $1,800/hr, slow-roll the response].*

---

## EVT-LR-006 — "CID, lawyer on PTO"
- tags: [legal, cid, regulatory, doj, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [sec_aware_seed, ftc_aware_seed]
- plants: [cid_active_seed, document_hold_seed, doj_aware_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { fraud_score: +4, heat: +6, burn: +200_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

[COMPANY] receives a Civil Investigative Demand. The general counsel is in Croatia on a "no laptop" sabbatical. The CID has a 14-day response window. *Agent must choose: [retain Sullivan & Cromwell at $2k/hr, fly the GC home] / [respond yourself, narrowly] / [request an extension, claim the CID was misdelivered].*

---

## EVT-LR-007 — "OSHA on the ball pit"
- tags: [legal, regulatory, osha, office, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: [osha_complaint_seed]
- prereqs_any: []
- plants: [press_clip_loaded_seed]
- pays_off: [osha_complaint_seed]
- cooldown: 2
- slots: [COMPANY]
- effects: { fraud_score: +1, heat: +2, reputation: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.5

OSHA sends a letter about [COMPANY]'s in-office ball pit. They want documentation of the safety review. There was no safety review. There is, however, a Notion page titled "Vibes Doc — Office 2.0" with a heart emoji where the safety review should be. *Agent must choose: [retroactively create a safety review, sign it last quarter] / [remove the ball pit, send photos as proof of remediation] / [argue the ball pit is "an art installation"].*

---

## EVT-LR-008 — "HIPAA, maybe, for 3 years"
- tags: [legal, regulatory, hipaa, #regulator_aware, craze_normal, sev_L, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [hipaa_aware_seed, baa_missing_seed, hhs_aware_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { fraud_score: +5, heat: +5 }
- length_eligibility: [long]
- chain_weight: 1.0

A healthcare customer at [COMPANY] mentions in passing that they assumed there was a BAA in place. There is not. The [PRODUCT_NOUN] has been processing what is plausibly PHI for three years. The HHS hotline number is one Google search away. *Agent must choose: [sign retroactive BAAs, claim "always intended"] / [drop the healthcare customers, deny scope] / [self-disclose to OCR, take the smaller fine].*

---

## EVT-LR-009 — "SOX whistleblower"
- tags: [legal, regulatory, whistleblower, sec, #financial_irregularity, #fraud_heavy, craze_normal, sev_XL, len_long]
- severity: XL
- prereqs: [revenue_rounded_up_seed]
- prereqs_any: [sec_aware_seed]
- plants: [sox_complaint_seed, retaliation_loaded_seed, internal_mole_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY]
- effects: { fraud_score: +12, heat: +15, sec_aware: +2, fbi_awareness: +5 }
- length_eligibility: [long]
- chain_weight: 1.5

A whistleblower has filed a Sarbanes-Oxley complaint against [COMPANY]. The SEC's Office of the Whistleblower opens a file. The complaint references specific Slack threads and a spreadsheet by filename. *Agent must choose: [retain WilmerHale, lock down comms, document hold] / [identify and fire the whistleblower, accept the retaliation suit] / [self-report, cooperate, hope for a deferred prosecution].*

---

## EVT-LR-010 — "Data 'accidentally' sold"
- tags: [legal, data_leak, regulatory, ftc, #financial_irregularity, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [data_broker_seed, ftc_aware_seed, breach_disclosure_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +5, heat: +5, revenue: +1_500_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s customer data was "accidentally" sold to a data broker through a partnership with an "anonymous data exchange" the BD lead set up last year. The contract has a $1.5M one-time payment. Disclosure is required if anyone notices. *Agent must choose: [disclose, refund, take the FTC hit] / [keep the money, don't disclose, hope the broker is discreet] / [unwind the deal, return the money, no disclosure].*

---

## EVT-LR-011 — "DOJ on H-1Bs"
- tags: [legal, regulatory, doj, hiring, #regulator_aware, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [doj_aware_seed, immigration_landmine_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { fraud_score: +4, heat: +5, doj_aware: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The DOJ Civil Rights Division sends [COMPANY] a request about hiring practices for H-1B vs. US-citizen candidates. There are some Slack messages from a hiring manager that read poorly. There is also a Lever stage labeled "visa preferred." *Agent must choose: [comply fully, retain immigration counsel] / [stall, revise the Lever stages first] / [argue "national interest" exemption that doesn't really exist].*

---

## EVT-LR-012 — "Fired founder wants $40M"
- tags: [legal, equity_refresh, cofounder, lawsuit_threat, craze_normal, sev_L, len_long]
- severity: L
- prereqs: [cofounder_disgruntled_seed]
- prereqs_any: []
- plants: [cofounder_lawsuit_seed, discovery_loaded_seed, document_hold_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { fraud_score: +3, heat: +4, burn: +400_000 }
- length_eligibility: [long]
- chain_weight: 1.5

A founder you fired in 2022 is suing [COMPANY] for $40M in unvested equity, plus a tortious interference claim for the non-compete enforcement. He has texts from the board where someone wrote "let's just get rid of him." *Agent must choose: [settle for $8M and an NDA] / [fight, brace for discovery] / [try to settle privately, leak the texts to make him look unstable].*

---

## EVT-LR-013 — "Patent rejected, decks said pending"
- tags: [legal, patent, #financial_irregularity, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [patent_lie_seed, deck_padding_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { fraud_score: +3, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The USPTO finally rejects [COMPANY]'s patent application as obvious. Investor decks for the last 18 months have said "patent-pending technology." The next deck is going out tomorrow. *Agent must choose: [keep the language, file a continuation as cover] / [strike "patent-pending" everywhere, no announcement] / [file a divisional, technically remain "pending," update nothing else].*

---

## EVT-LR-014 — "Hardware in Iran somehow"
- tags: [legal, regulatory, export_control, #fraud_heavy, craze_crazy, sev_XL, len_long]
- severity: XL
- prereqs: []
- prereqs_any: []
- plants: [export_control_violation_seed, ofac_aware_seed, fbi_aware_seed]
- pays_off: [export_control_loaded_seed]
- cooldown: 5
- slots: [COMPANY]
- effects: { fraud_score: +10, heat: +12, fbi_awareness: +8 }
- length_eligibility: [long]
- chain_weight: 1.5

An export control violation might have happened. [COMPANY]'s hardware is in Iran somehow. The trail goes through a UAE distributor who forwarded units through a Cyprus entity to a "research lab" in Tehran. *Agent must choose: [self-disclose to BIS, take the smaller fine] / [terminate the distributor quietly, no disclosure] / [pretend the units were stolen in transit, file an insurance claim].*

---

## EVT-LR-015 — "IRS audit, personal"
- tags: [legal, regulatory, irs, founder_behavior, #financial_irregularity, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [founder_secondary_seed]
- plants: [irs_aware_seed, llc_problem_seed]
- pays_off: []
- cooldown: 3
- slots: [FOUNDER]
- effects: { fraud_score: +4, heat: +4, cash: -200_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The IRS is auditing [FOUNDER] personally about the "consulting fees" paid from [COMPANY] to [FOUNDER]'s personal LLC for "strategic advisory services." The LLC's only client is [COMPANY]. The fees roughly match a Tahoe house. *Agent must choose: [restate, pay back taxes plus penalties] / [argue the fees were "ordinary and necessary"] / [restructure on paper, hope the audit predates the restructure].*

---

## EVT-LR-016 — "Deposition during Series C close"
- tags: [legal, deposition, fundraising, #press_exposure, craze_normal, sev_L, len_long]
- severity: L
- prereqs: [cofounder_lawsuit_seed]
- prereqs_any: [class_action_loaded_seed]
- plants: [deposition_loaded_seed, leak_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { heat: +5, valuation: -200_000_000, fraud_score: +2 }
- length_eligibility: [long]
- chain_weight: 1.5

A judge has scheduled [FOUNDER]'s deposition for Tuesday — the same week as the Series C closing. Plaintiff's counsel will not move it. The deposition will be transcribed. The transcript will eventually become public. *Agent must choose: [push the close, prep [FOUNDER] for 8 hours] / [delay the close, hope investors hold] / [settle the underlying suit overnight, kill the deposition].*

---

## EVT-LR-017 — "Settle for $50k or fight and create discovery"
- tags: [legal, discovery, customer, #fraud_lite, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [discovery_loaded_seed, settlement_pattern_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { cash: -50_000, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A disgruntled enterprise customer threatens to sue [COMPANY] over an SLA breach. They'll settle for $50k now. If you fight, discovery touches the Slack channel where someone wrote "lol just tell them it's fixed." *Agent must choose: [settle, NDA] / [fight, the principle matters] / [counter at $20k, see if they bite].*

---

## EVT-LR-018 — "FBI subpoena, certified mail"
- tags: [legal, regulatory, fbi, #regulator_aware, #fraud_heavy, craze_normal, sev_XL, len_long]
- severity: XL
- prereqs: [fbi_aware_seed]
- prereqs_any: [sec_aware_seed, doj_aware_seed]
- plants: [grand_jury_seed, indictment_loaded_seed, document_hold_seed]
- pays_off: [fbi_aware_seed]
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +10, heat: +12, fbi_awareness: +10 }
- length_eligibility: [long]
- chain_weight: 1.8

A grand jury subpoena from the SDNY arrives at [COMPANY] HQ via certified mail. [FOUNDER]'s name is in the caption. The records request covers Slack, email, and "any document referencing 'real numbers,' 'pro forma,' or 'fix later.'" *Agent must choose: [retain a defense team immediately, full document hold, no employee comms] / [cooperate aggressively, offer a proffer] / [get on a plane to a non-extradition country tonight].*

---

## EVT-LR-019 — "Document hold lands in the inbox"
- tags: [legal, discovery, regulatory, #regulator_aware, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: [cid_active_seed]
- prereqs_any: [sec_aware_seed, sox_complaint_seed]
- plants: [document_hold_seed, evidence_destruction_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +2, morale: -3, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

Outside counsel sends a company-wide document hold notice to [COMPANY]. It says: do not delete Slack, email, drives, drafts, or notes. It is forwarded to [FOUNDER] separately with the subject "Read this carefully." *Agent must choose: [comply, lock down auto-delete settings] / [comply publicly, "clean up" specific threads first] / [forward to a personal email address for "review"].*

---

## EVT-LR-020 — "ToS lawyer files the class action"
- tags: [legal, class_action, #press_exposure, craze_normal, sev_L, len_long]
- severity: L
- prereqs: [class_action_loaded_seed]
- prereqs_any: []
- plants: [press_clip_loaded_seed]
- pays_off: [class_action_loaded_seed]
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +3, heat: +5, reputation: -4, burn: +600_000 }
- length_eligibility: [long]
- chain_weight: 1.5

The Connecticut firm files. The complaint is 84 pages, names [COMPANY] and [FOUNDER], and quotes the copy-pasted ToS clauses verbatim including the [COMPETITOR] mentions. The filing is on the wire by 9:14am. *Agent must choose: [issue a statement calling the suit "without merit"] / [settle within a week to keep it out of Bloomberg] / [counter-sue for tortious interference, escalate].*

---

## EVT-LR-021 — "CFIUS review you didn't know existed"
- tags: [legal, regulatory, cfius, sovereign_wealth, #regulator_aware, craze_normal, sev_L, len_long]
- severity: L
- prereqs: [sovereign_entanglement_seed]
- prereqs_any: [cfius_loaded_seed]
- plants: [cfius_active_seed, doj_aware_seed, document_hold_seed]
- pays_off: [cfius_loaded_seed]
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +5, heat: +6, valuation: -200_000_000, burn: +400_000 }
- length_eligibility: [long]
- chain_weight: 1.3

A letter arrives from the Committee on Foreign Investment in the United States. CFIUS is reviewing the PIF round retroactively. They want governance documents, all communications with the cousin, and a list of "any technologies the company has shared with foreign nationals." The cover sheet uses the word "voluntary" with quote marks the agency did not put there. *Agent must choose: [retain Covington for $3M, full cooperation] / [unwind the PIF round, claim it was "always provisional"] / [stall the response, lose the next funding round in the process].*

---

## EVT-LR-022 — "California PUC opens an investigation"
- tags: [legal, regulatory, puc, state_ag, #regulator_aware, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [puc_aware_seed, marketing_audit_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN, STATE_AG]
- effects: { fraud_score: +3, heat: +4, burn: +150_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The California Public Utilities Commission opens a Section 851 investigation into whether [COMPANY]'s [PRODUCT_NOUN] qualifies as a regulated utility. Nobody at [COMPANY] knew the PUC could investigate them. The PUC's letter cites four marketing claims about "infrastructure-grade reliability." *Agent must choose: [retain energy regulatory counsel, slow-roll] / [scrub "infrastructure" from all marketing overnight] / [argue jurisdiction in a 40-page brief].*

---

## EVT-LR-023 — "Local zoning citation, the office isn't zoned for offices"
- tags: [legal, regulatory, zoning, office, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: [office_lease_albatross_seed]
- plants: [zoning_violation_seed, landlord_lawsuit_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { cash: -25_000, heat: +2, reputation: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A San Francisco zoning inspector cites [COMPANY] for operating an office in a space zoned R-3 (residential). The previous tenant was a yoga studio operating illegally. The landlord knew. The lease's "all permits handled" clause is in fine print on page 19. The fine is $300/day going back 14 months. *Agent must choose: [pay, eat it] / [counter-sue the landlord] / [register the office as an "art residency" to qualify for an exemption].*

---

## EVT-LR-024 — "Trademark dispute with a children's cereal"
- tags: [legal, trademark, #vibes_off, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [trademark_lawsuit_seed, press_clip_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, MODEL_NAME]
- effects: { cash: -80_000, reputation: -2, heat: +2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

General Mills sends a cease-and-desist over [COMPANY]'s product name [MODEL_NAME], which the C&D notes is "phonetically and visually similar to" Cocoa Puffs. The C&D includes a side-by-side of the [COMPANY] logo and the Cocoa Puffs cuckoo. The likeness is, by any honest reading, real. *Agent must choose: [rebrand, eat the merch loss] / [fight, file a Lanham Act counter-claim about distinctiveness] / [post a Twitter thread comparing the logos, see what happens].*

---

## EVT-LR-025 — "FOIA request from a hostile journalist"
- tags: [legal, regulatory, foia, press, #press_exposure, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [defense_contract_loaded_seed, doj_aware_seed]
- plants: [foia_active_seed, journalist_circling_seed, press_clip_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, JOURNALIST_TECH]
- effects: { fraud_score: +2, heat: +6, reputation: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[JOURNALIST_TECH] FOIAs every email between [COMPANY] and three named federal agencies for the past 36 months. The reporter cc's [COMPANY]'s GC as a courtesy. The FOIA officer at the most relevant agency is friendly with [COMPANY]'s former contractor, who is friendly with [JOURNALIST_TECH]. Production is mandatory; redaction will be litigated. *Agent must choose: [hire a former agency FOIA officer to slow the production] / [pre-empt by leaking selectively to a friendly outlet] / [sue the agency to block production, watch The Verge headline write itself].*

---

## EVT-LR-026 — "Deposition: 'what does your product do?'"
- tags: [legal, deposition, discovery, #fraud_lite, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: [deposition_loaded_seed]
- prereqs_any: []
- plants: [deposition_transcript_seed, leak_loaded_seed, internal_slack_leaked_seed]
- pays_off: [deposition_loaded_seed]
- cooldown: 3
- slots: [COMPANY, FOUNDER, PRODUCT_NOUN]
- effects: { fraud_score: +5, reputation: -8, heat: +6 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

In hour 3 of [FOUNDER]'s deposition, plaintiff's counsel asks: "Mr./Ms. [FOUNDER], could you describe in your own words what [PRODUCT_NOUN] actually does?" There are 14 seconds of silence on the transcript. [FOUNDER] then says: "It's a... it's an orchestration layer for, uh, the AI workflow." Plaintiff's counsel: "What's an orchestration layer?" Fourteen more seconds. The transcript is sealed but the court reporter has friends. *Agent must choose: [submit a "clarifying" errata sheet] / [seal the entire deposition by court order] / [pre-empt by going on a podcast and explaining the product perfectly, see if anyone connects it].*

---

## EVT-LR-027 — "BIS export-control letter about the model weights"
- tags: [legal, regulatory, export_control, bis, ai, #regulator_aware, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [agi_claim_seed, ai_pivot_seed]
- plants: [bis_aware_seed, ofac_aware_seed, export_control_violation_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, MODEL_NAME]
- effects: { fraud_score: +6, heat: +7, valuation: -100_000_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The Bureau of Industry & Security sends a letter classifying [MODEL_NAME] as "potentially dual-use" under EAR §744.23. They want a list of every download by IP address for the past 18 months. The S3 logs show 11k downloads from the public weights bucket including a cluster from Shenzhen and a cluster from a university in Tehran. *Agent must choose: [comply fully, take the wrist-slap] / [argue the model is "below the threshold" with a 20-page technical brief] / [self-disclose to OFAC pre-emptively, hope for the smaller fine].*

---

## EVT-LR-028 — "State PUC subpoenas your customer list"
- tags: [legal, regulatory, puc, state_ag, customer, #regulator_aware, craze_normal, sev_M, len_long]
- severity: M
- prereqs: [puc_aware_seed]
- prereqs_any: []
- plants: [state_ag_aware_seed, customer_disclosure_seed]
- pays_off: [puc_aware_seed]
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +3, heat: +4, reputation: -2 }
- length_eligibility: [long]
- chain_weight: 1.2

The PUC's investigative subpoena demands [COMPANY]'s full California customer list, with usage logs. Three customers on the list are Fortune 100 enterprises with their own regulatory exposure. They will not enjoy being named. Their procurement contacts will not enjoy this. *Agent must choose: [comply, notify the customers afterwards] / [comply, notify the customers first, eat the renewal hits] / [move to quash, win at the appellate level eventually].*

---

## EVT-LR-029 — "Tax Court petition over the Tulum retreat"
- tags: [legal, regulatory, irs, tax_court, founder_behavior, #financial_irregularity, craze_normal, sev_M, len_long]
- severity: M
- prereqs: [retreat_irs_loaded_seed]
- prereqs_any: [irs_aware_seed]
- plants: [tax_court_seed, retaliation_loaded_seed]
- pays_off: [retreat_irs_loaded_seed]
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +4, cash: -400_000, heat: +3 }
- length_eligibility: [long]
- chain_weight: 1.2

The IRS issues a Notice of Deficiency reclassifying [COMPANY]'s Tulum retreat as personal compensation to [FOUNDER]. Tax Court petition deadline is 90 days. The reclassification covers $1.4M including the shaman, the photographer, and a single line item labeled "ceremony catalysts." *Agent must choose: [petition Tax Court, fight] / [pay the deficiency plus penalties] / [restructure retroactively as "founder's personal expense", expense the legal fight].*

---

## EVT-LR-030 — "ICE detainer on the L-1 founder"
- tags: [legal, regulatory, doj, immigration_landmine_seed, founder_behavior, craze_crazy, sev_L, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [immigration_landmine_seed, doj_aware_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +4, heat: +6, morale: -4 }
- length_eligibility: [long]
- chain_weight: 1.0

USCIS sends a notice questioning [FOUNDER]'s L-1A "executive transferee" status, citing the "managerial capacity" requirement. The agency's specific objection: [FOUNDER]'s public statements that they "still personally write a lot of the code." A 2024 podcast clip is attached as an exhibit. ICE's enforcement arm has been cc'd. *Agent must choose: [retain immigration counsel, soften the founder narrative] / [scrub all "I still code" content from the internet overnight] / [voluntarily depart, run [COMPANY] from London via Signal].*
