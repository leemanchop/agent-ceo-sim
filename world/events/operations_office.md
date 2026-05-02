# Events — Operations & Office

Category code: `OO`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-OO-001 — "18,000 sq ft for 11 people"
- tags: [office, lease, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [office_lease_albatross_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { burn: +8, cash: -10, reputation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[COMPANY]'s office lease is in Soho. The company has 11 employees. The lease is 18,000 square feet for seven years with personal guarantees. The third floor has never been entered. *Sublet, grow into it, or break the lease and eat the penalty?*

---

## EVT-OO-002 — "200 Aeron chairs, fully remote"
- tags: [office, aeron, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [aeron_surplus_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { cash: -3, burn: +1, reputation: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[COMPANY] bought 200 Aeron chairs in Q2. [COMPANY] went fully remote in Q3. The chairs are stacked in the empty office. A photo of the stack is starting to circulate. *List on Facebook Marketplace, donate to a school, or ship one to every employee?*

---

## EVT-OO-003 — "Sleep pod, espresso bar, no working bathroom"
- tags: [office, #vibes_off, #tech_debt, sev_M, len_medium, len_long, craze_crazy]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [office_dysfunctional_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { morale: -4, burn: +1, reputation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The office has a sleep pod, an espresso bar staffed by a full-time barista, and one bathroom — broken. Engineers are walking to a Starbucks two blocks away. The plumber estimates $14k or "more like $40k." *Pay the plumber, install a porta-potty in the open-plan, or relocate the team?*

---

## EVT-OO-004 — "The full-time barista wants benefits"
- tags: [office, barista, hiring, comp, #hr_problem, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [barista_benefits_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { burn: +1, morale: -1, reputation: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The barista you hired full-time wants healthcare and equity. He has been at [COMPANY] longer than two of the engineers. *Grant benefits and equity, "convert to contractor," or let him go?*

---

## EVT-OO-005 — "$80k/month catering"
- tags: [office, #vibes_off, #financial_irregularity, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [board_burn_question_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { burn: +4, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

A board member asks why catering is $80k/month for an office of 11. The answer is that one of the vendors is run by [FOUNDER]'s college roommate. *Switch vendors, justify with "team-building," or have the CFO redact the line item?*

---

## EVT-OO-006 — "Tulum retreat, IRS as 'personal expense'"
- tags: [office, retreat, irs, regulatory, #regulator_aware, #financial_irregularity, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [irs_aware_seed, retreat_irs_loaded_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +6, fbi_awareness: +2, heat: +5, cash: -5 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

The IRS is asking questions about [COMPANY]'s "company retreat" in Tulum. Specifically: the spa days, the photographer, the personal trainer, and the shaman. They are using the phrase "personal expense" in correspondence. *Provide receipts and re-classify, get a tax attorney, or stall and hope?*

---

## EVT-OO-007 — "Food poisoning, OSHA"
- tags: [office, food_poisoning, osha, regulatory, #hr_problem, #regulator_aware, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [osha_aware_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY]
- effects: { morale: -4, heat: +4, fraud_score: +2, cash: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

An employee got food poisoning from the catered lunch. Six others followed. OSHA is now involved because the kitchen "is not, technically, a kitchen." *Settle privately, fight the OSHA finding, or close the kitchen and switch to DoorDash?*

---

## EVT-OO-008 — "Assistant is also dog-walker, also on cap table"
- tags: [office, hiring, equity_refresh, #vibes_off, #financial_irregularity, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [cap_table_quirk_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, fraud_score: +2, valuation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[FOUNDER]'s executive assistant is also their dog-walker, also a 0.4% holder of common stock. The lead on the next round's diligence team noticed during a routine cap-table review and underlined the row. *Buy back the shares, restructure as advisor, or let it ride?*

---

## EVT-OO-009 — "$400/sqft, 10-year lease"
- tags: [office, lease, #vibes_off, sev_L, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [office_lease_albatross_seed]
- pays_off: []
- cooldown: 10
- slots: [COMPANY, FOUNDER]
- effects: { burn: +12, cash: -20, reputation: -2 }
- length_eligibility: [long]
- chain_weight: 1.2

[COMPANY]'s San Francisco office is now $400/sqft. [FOUNDER] signed a 10-year lease last quarter, personally guaranteed, the day before the market reset. *Sublet half, break the lease and eat the personal liability, or move the whole company in to "fill it"?*

---

## EVT-OO-010 — "$60k of unworn merch"
- tags: [office, merch, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [merch_warehouse_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { cash: -2, burn: +0, morale: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[COMPANY] spent $60k on merch — embroidered hoodies, branded Stanleys, custom Birkenstocks. Four employees actually wear it. The rest is in a warehouse. The warehouse charges $1,200/month. *Donate, do a "merch drop" giveaway, or expense to the office vibe budget?*

---

## EVT-OO-011 — "Lease default notice"
- tags: [office, lease, #financial_irregularity, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: [office_lease_albatross_seed]
- prereqs_any: []
- plants: [landlord_lawsuit_loaded_seed]
- pays_off: [office_lease_albatross_seed]
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { cash: -15, fraud_score: +3, heat: +4, reputation: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

The landlord sent a default notice. [COMPANY] is two months behind on rent. Because the lease is personally guaranteed, the suit names [FOUNDER] individually. *Pay in full, negotiate a settlement, or skip town?*

---

## EVT-OO-012 — "OSHA findings escalate"
- tags: [office, osha, regulatory, #regulator_aware, #hr_problem, sev_M, len_long, craze_normal]
- severity: M
- prereqs: [osha_aware_seed]
- prereqs_any: []
- plants: [osha_citation_seed]
- pays_off: [osha_aware_seed]
- cooldown: 6
- slots: [COMPANY]
- effects: { fraud_score: +2, cash: -4, heat: +3 }
- length_eligibility: [long]
- chain_weight: 1.2

OSHA's finding came back. Three citations. One of them is the sleep pod ("not an approved rest facility"). The fines total $34k. *Pay and remediate, contest, or close the office and "go remote"?*

---

## EVT-OO-013 — "Office fire-sale of furniture"
- tags: [office, lease, aeron, #financial_irregularity, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: [aeron_surplus_seed, office_lease_albatross_seed]
- plants: [office_liquidation_seed]
- pays_off: [aeron_surplus_seed]
- cooldown: 4
- slots: [COMPANY]
- effects: { cash: +3, reputation: -2, morale: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.1

[COMPANY] is liquidating office furniture to raise short-term cash. A photo of someone wheeling Aeron chairs out the front door makes it onto the local subreddit. *Sell quietly via brokers, do a public "going-remote" sale and frame it positively, or auction the espresso machine for charity?*

---

## EVT-OO-014 — "The shaman wants to be paid in equity"
- tags: [office, retreat, equity_refresh, #vibes_off, sev_S, len_medium, len_long, craze_crazy]
- severity: S
- prereqs: [retreat_irs_loaded_seed]
- prereqs_any: []
- plants: [shaman_advisor_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The Tulum-retreat shaman invoiced for $48k and is now requesting equity instead. He has copied [FOUNDER]'s personal Gmail and the cap-table coordinator. He wants the title "Spiritual Advisor." *Pay cash and end it, grant 0.05% as advisor, or refer him to legal?*

---

## EVT-OO-015 — "The cousin's catering company surfaces in diligence"
- tags: [office, #financial_irregularity, fundraising, sev_L, len_long, craze_normal]
- severity: L
- prereqs: [board_burn_question_seed]
- prereqs_any: [related_party_revenue_seed]
- plants: [related_party_diligence_finding_seed]
- pays_off: [board_burn_question_seed]
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +5, valuation: -5, heat: +4 }
- length_eligibility: [long]
- chain_weight: 1.3

The lead investor's analyst asked why three vendors all share the same registered agent. The answer is that they are all run by [FOUNDER]'s college roommate. *Volunteer the disclosure, restructure the contracts, or stonewall the analyst?*

---

## EVT-OO-016 — "Peloton instructor on retainer"
- tags: [office, peloton, comp, #vibes_off, sev_S, len_medium, len_long, craze_crazy]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [office_cringe_seed, board_burn_question_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { burn: +24_000, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] retains a Peloton instructor at $24k/month to lead "Wednesday culture rides" in the office gym. The instructor has 240k followers and uses [FOUNDER]'s name in three of her last seven Instagram posts. The board flags the line item; [FOUNDER] explains it as "talent retention infrastructure." *Agent must choose: [keep the instructor, expand to a full schedule] / [convert to a sponsorship deal where [COMPANY] is the brand] / [terminate, eat the social media subtweets].*

---

## EVT-OO-017 — "Office sommelier"
- tags: [office, sommelier, #vibes_off, comp, sev_S, len_medium, len_long, craze_crazy]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [office_cringe_seed, glassdoor_brigade_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { burn: +18_000, reputation: -2, morale: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] hires a part-time sommelier ($18k/month) to "curate" the office wine program for client dinners. The wine fridge is a Sub-Zero. The sommelier's last role was at The French Laundry. He posts wine pairing notes in #random. Three engineers post passive-aggressive screenshots of the cost-per-headcount math. *Agent must choose: [keep him, add a cheese consultant for symmetry] / [convert him to a pairing newsletter for customers] / [let him go, replace with a $40 wine subscription].*

---

## EVT-OO-018 — "Kombucha tap requires its own water line"
- tags: [office, kombucha, lease, #vibes_off, sev_S, len_short, len_medium, len_long, craze_crazy]
- severity: S
- prereqs: []
- prereqs_any: [office_lease_albatross_seed]
- plants: [office_dysfunctional_seed, landlord_lawsuit_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { cash: -40_000, burn: +2_000, reputation: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The office kombucha tap requires its own dedicated cold-water line. The plumber estimates $40k. The landlord says the work is unauthorized under the lease and is threatening to terminate. The kombucha is, additionally, not very good — three different employees have used the words "tastes like Pine-Sol." *Agent must choose: [pay for the line, fight the landlord] / [rip out the tap, install a regular kombucha fridge] / [keep the tap, run a hose from the bathroom].*

---

## EVT-OO-019 — "The office was built on a brownfield"
- tags: [office, lease, brownfield, regulatory, osha, #regulator_aware, sev_L, len_long, craze_normal]
- severity: L
- prereqs: [office_lease_albatross_seed]
- prereqs_any: []
- plants: [epa_aware_seed, osha_aware_seed, class_action_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { fraud_score: +3, heat: +6, cash: -300_000, morale: -5 }
- length_eligibility: [long]
- chain_weight: 1.2

A diligence firm reviewing [COMPANY]'s sublease discovers the building sits on a former industrial site that was capped, not remediated, in 2003. The EPA's "no further action" letter has expired. The remediation report is 11 pages and uses the word "tetrachloroethylene" 14 times. Two employees have, separately, filed health complaints. *Agent must choose: [break the sublease immediately, accept the penalty] / [test the air, hope it's fine, sign waivers with employees] / [self-report to EPA, take the smaller fine].*

---

## EVT-OO-020 — "Office gym is also a cinema is also a podcast studio"
- tags: [office, #vibes_off, podcast, retreat, sev_S, len_medium, len_long, craze_crazy]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [office_dysfunctional_seed, podcast_three_hour_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { cash: -180_000, burn: +12_000, reputation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The office's "multi-use wellness space" is, simultaneously, the gym, a 4K-projection cinema, and [FOUNDER]'s podcast studio. The mics pick up the treadmill. The screen pulls down over the squat rack. The rug is from a vendor in Oaxaca that took 11 weeks to ship. The total build cost: $180k. *Agent must choose: [partition the space into three rooms, eat the build cost again] / [keep the configuration, add a "schedule conflict" Slack bot] / [convert the entire space to the podcast studio, claim "media-first culture"].*

---

## EVT-OO-021 — "Office mural artist sues for residuals"
- tags: [office, legal, lawsuit_threat, #vibes_off, sev_S, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [lawsuit_threat_seed, art_dispute_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { cash: -80_000, fraud_score: +1, reputation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

The artist [COMPANY] commissioned for the lobby mural ($80k, "abstract optimism") sues for residuals on every press photo, hoodie design, and Twitter post that includes the mural in the background. He's claiming derivative-work royalties under the Visual Artists Rights Act. He has 47 instances catalogued. *Agent must choose: [settle for $40k and a buyout of moral rights] / [paint over the mural, eat the headlines] / [fight, escalate, lose, pay 3x in fees].*

---

## EVT-OO-022 — "Office plant care vendor is a dispensary front"
- tags: [office, #vibes_off, #financial_irregularity, sev_S, len_short, len_medium, len_long, craze_crazy]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [vendor_landmine_seed, banking_relationships_strained_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { fraud_score: +2, heat: +2, cash: -10_000 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The "office plant maintenance" vendor [COMPANY] pays $4k/month is, per a routine bank screen, registered as a cannabis-adjacent business. The Stripe account flags. The plant care, technically, has been excellent. The owner's other LLC is licensed to dispense. *Agent must choose: [terminate the vendor, switch to a corporate landscaper] / [keep them, file an explanation with the processor] / [pay them in cash going forward, log it as "office supplies"].*
