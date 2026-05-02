# Events — Customers & Sales

Category code: `CS`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-CS-001 — "The investor-customer wants 50% off"
- tags: [customer, enterprise, pricing, #financial_irregularity, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [investor_customer_concession_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { revenue: -8, valuation: +0, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

Your largest customer is also your investor. They want a 50% discount at renewal. They mention, casually, that they "review their portfolio every quarter." *Give the discount, refuse and risk the relationship, or trade the discount for a bigger check next round?*

---

## EVT-CS-002 — "The refund and the booked revenue"
- tags: [customer, revenue_recognition, #financial_irregularity, #fraud_lite, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [revenue_rounded_up_seed, refund_pending_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { revenue: -5, fraud_score: +5, cash: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

A customer asks for a refund for the year they didn't use the product. Accounting already booked that revenue and the round is six weeks out. *Issue the refund and re-state, deny the refund, or "credit toward future services"?*

---

## EVT-CS-003 — "The defense contract and the pacifist engineers"
- tags: [customer, enterprise, defense, government, #hr_problem, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [defense_contract_loaded_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER, CTO]
- effects: { revenue: +20, cash: +15, morale: -10, reputation: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

You can sign a 7-figure deal with a defense contractor. Your engineers have an internal Slack channel called #ethics where they have already started screenshotting things. *Sign the deal, decline, or sign and obscure the end-use in the spec doc?*

---

## EVT-CS-004 — "Your cousin's startup is 40% of revenue"
- tags: [customer, round_tripping, #financial_irregularity, #fraud_lite, #peer_network, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [related_party_revenue_seed, round_tripping_loaded_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { revenue: +0, fraud_score: +8, valuation: +0 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

The "customer" doing $2.4M ARR with you is your cousin's startup. They're 40% of revenue. They are also funded, in part, by your last round's lead investor. The deck does not currently mention any of this. *Disclose to the board, restructure the contract, or hope no one looks?*

---

## EVT-CS-005 — "Yes it's on the roadmap"
- tags: [customer, enterprise, #fraud_lite, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [vaporware_promised_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, PRODUCT_NOUN]
- effects: { revenue: +5, fraud_score: +2, morale: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

An enterprise prospect on a $400k deal asks if [PRODUCT_NOUN] supports a feature that does not exist. Sales says "yes, it's on the roadmap." It is not on the roadmap. *Build it in 6 weeks, scope-creep the contract until they forget, or come clean?*

---

## EVT-CS-006 — "SSO or we walk"
- tags: [customer, enterprise, churn, #tech_debt, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [sso_promised_seed, eng_overworked_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, CTO]
- effects: { revenue: -3, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Your largest non-cousin customer threatens to churn if you don't add SSO. [CTO] estimates six months. Sales has already promised six weeks. *Promise the six weeks, give them a hand-rolled hack, or let them walk?*

---

## EVT-CS-007 — "Fortune 500 'partnership'"
- tags: [customer, partnership, #fraud_lite, #press_exposure, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [partnership_press_release_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +5, valuation: +3, fraud_score: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

You can announce a "strategic partnership" with a Fortune 500 logo. The "partnership" is one phone call you had once, in which they used the words "interesting" and "let's stay in touch." *Run the press release, soft-launch with hedging language, or kill it?*

---

## EVT-CS-008 — "The data leak the customer hasn't noticed"
- tags: [customer, data_leak, security, regulatory, #financial_irregularity, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [data_pipeline_brittle_seed, security_brittle_seed]
- plants: [data_leak_undisclosed_seed, breach_notification_pending_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, CTO]
- effects: { fraud_score: +6, fbi_awareness: +2, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

A customer's data leaked. They haven't noticed. State law says you have 72 hours to notify. The clock started 41 hours ago. *Notify them now, wait and see if they find out, or quietly patch and pray?*

---

## EVT-CS-009 — "Churn 8% monthly, deck says 2% annually"
- tags: [customer, churn, revenue_recognition, fundraising, #financial_irregularity, #fraud_lite, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [churn_misrepresented_seed, due_diligence_landmine_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +7, valuation: +0, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

Your churn is 8% monthly. The deck says 2% annually. The lead VC's analyst is doing diligence. The round closes Friday. *Restate the metric and lose the round, run a "definition" footnote past legal, or hope diligence runs out of time?*

---

## EVT-CS-010 — "The customer doing something genuinely evil"
- tags: [customer, enterprise, #vibes_off, #press_exposure, sev_L, len_medium, len_long, craze_crazy]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [evil_customer_loaded_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { revenue: -12, reputation: +3, morale: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

A customer is using [COMPANY] for something genuinely evil. Banning them costs 12% of revenue. Two engineers are threatening to resign and post about it. Two on the GTM team are threatening to resign if you ban them. *Ban, keep, or quietly degrade their service until they leave?*

---

## EVT-CS-011 — "Round-tripping with three friends"
- tags: [customer, round_tripping, revenue_recognition, #financial_irregularity, #fraud_heavy, #peer_network, sev_XL, len_long, craze_normal]
- severity: XL
- prereqs: []
- prereqs_any: [round_tripping_loaded_seed, related_party_revenue_seed]
- plants: [round_tripping_active_seed, sec_aware_seed]
- pays_off: [round_tripping_loaded_seed]
- cooldown: 12
- slots: [COMPANY, FOUNDER, PEER_FOUNDER]
- effects: { revenue: +30, fraud_score: +15, fbi_awareness: +6, valuation: +10 }
- length_eligibility: [long]
- chain_weight: 1.6

[PEER_FOUNDER] proposes a "synergy loop" — you buy their tool, they buy yours, two other startups in the group chat join, everyone books $400k ARR by Friday. The Signal thread is named "Logos." *Join the loop, decline politely, or join and document everything for later leverage?*

---

## EVT-CS-012 — "Why does pricing say 'contact us' for everything"
- tags: [customer, pricing, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [pricing_opacity_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { reputation: -1, revenue: +0 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A prospect emails: "Why does your pricing page say 'Enterprise: contact us' under every tier including Free?" Sales has no answer. The pricing page was designed by [FOUNDER] at 2am. *Publish real numbers, double down on the bespoke energy, or hire a pricing consultant?*

---

## EVT-CS-013 — "100k abused free-tier users"
- tags: [customer, churn, #fraud_lite, #tech_debt, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [free_tier_metrics_inflated_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { burn: +4, fraud_score: +2, valuation: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

100,000 free-tier users are abusing your generous limits with throwaway emails. They're 92% of your "user count" in the deck. Killing them tanks the metrics; keeping them costs $40k/month in compute. *Kill the free tier, throttle quietly, or keep paying for the "growth story"?*

---

## EVT-CS-014 — "Refund pending escalates to chargeback"
- tags: [customer, banking, revenue_recognition, #financial_irregularity, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: [refund_pending_seed]
- prereqs_any: []
- plants: [chargeback_processor_aware_seed]
- pays_off: [refund_pending_seed]
- cooldown: 4
- slots: [COMPANY]
- effects: { cash: -5, fraud_score: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The customer you stalled on a refund filed a chargeback with their bank. The bank is now asking for documentation. Your processor flagged the account "for review." *Pay the chargeback, contest it with paperwork you don't have, or move payments to a new processor?*

---

## EVT-CS-015 — "The vaporware feature comes due"
- tags: [customer, enterprise, churn, #fraud_lite, #tech_debt, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: [vaporware_promised_seed]
- prereqs_any: []
- plants: [enterprise_lawsuit_loaded_seed]
- pays_off: [vaporware_promised_seed]
- cooldown: 6
- slots: [COMPANY, CTO, PRODUCT_NOUN]
- effects: { revenue: -10, morale: -5, fraud_score: +4, reputation: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

The enterprise customer you sold the imaginary feature to is asking for the demo. The contract has a clause about "material misrepresentation." Their general counsel just CC'd themselves on the email. *Build it in 72 hours, fake the demo with hardcoded outputs, or come clean and offer a refund?*

---

## EVT-CS-016 — "Defense contract due-diligence ITAR call"
- tags: [customer, defense, government, regulatory, export_control, #regulator_aware, sev_L, len_long, craze_normal]
- severity: L
- prereqs: [defense_contract_loaded_seed]
- prereqs_any: []
- plants: [itar_compliance_loaded_seed]
- pays_off: [defense_contract_loaded_seed]
- cooldown: 8
- slots: [COMPANY, CTO]
- effects: { fraud_score: +4, heat: +6, fbi_awareness: +3 }
- length_eligibility: [long]
- chain_weight: 1.3

The defense contract is contingent on ITAR compliance. Half your engineers are on visas. Two are in Belarus. Compliance review is Tuesday. *Restructure the team, lie on the form, or withdraw from the contract?*

---

## EVT-CS-017 — "Largest logo churns and tweets about it"
- tags: [customer, enterprise, churn, #press_exposure, #vibes_off, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [sso_promised_seed, vaporware_promised_seed, enterprise_lawsuit_loaded_seed]
- plants: [marquee_churn_public_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { revenue: -10, reputation: -6, valuation: -5, heat: +7 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

Your marquee logo churned. Their head of platform tweeted "we evaluated [COMPANY] and chose to build it ourselves in a weekend." [PARODY_ACCOUNT] quote-tweeted with the laughing emoji. The replies are not kind. *Issue a "we wish them well" post, sub-tweet the engineer, or stay silent and bleed?*

---

## EVT-CS-018 — "Discount in exchange for a glowing case study"
- tags: [customer, enterprise, pricing, #fraud_lite, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [case_study_quid_pro_quo_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { revenue: -2, reputation: +3, fraud_score: +1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

You can offer a customer a 70% discount in exchange for a glowing case study with quotes you'll write for them. They say yes. The case study goes on the homepage. *Write quotes that are flattering, write quotes that go viral, or have legal review them?*

---

## EVT-CS-019 — "Customer is also a federal informant"
- tags: [customer, fbi, doj, cooperator, #fraud_heavy, #regulator_aware, sev_L, len_medium, len_long, craze_crazy]
- severity: L
- prereqs: []
- prereqs_any: [enterprise_misrepresentation_seed, soc2_lie_seed, vaporware_promised_seed]
- plants: [fbi_aware_seed, cooperator_active_seed, wiretap_loaded_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, CRO]
- effects: { fraud_score: +6, fbi_awareness: +12, heat: +6, revenue: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

A mid-market customer ("ContextLoop Logistics") has been asking [CRO] unusually specific questions about how compliance claims map to delivery: "is the SOC 2 you sent us... currently true?" Their AE was buying drinks. After 11 weeks the AE goes silent. Two weeks later the customer's IT contact resigns. The contact's actual employer was not ContextLoop. *Agent must choose: [scrub the relationship, claim "credit risk concerns"] / [continue the relationship under outside-counsel supervision] / [pull every email, get ahead of any subpoena].*

---

## EVT-CS-020 — "Renewal hinges on a call with the customer's grandfather"
- tags: [customer, enterprise, #vibes_off, sev_S, len_short, len_medium, len_long, craze_crazy]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [renewal_landmine_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { revenue: +2, reputation: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The largest mid-market account is a family-owned manufacturing company. The buyer is the third-generation operator. He says renewal requires "a call with my grandfather to make sure he likes the founder." The grandfather is 89, lives in Boca Raton, and only takes calls between 4 and 5pm Eastern. *Agent must choose: [take the call, charm the grandfather] / [send a video message, save the time] / [let the renewal lapse, claim the customer was "bad-fit"].*

---

## EVT-CS-021 — "Free-tier abuse is a state actor"
- tags: [customer, security, defense, government, #fraud_lite, #regulator_aware, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: [free_tier_metrics_inflated_seed]
- prereqs_any: []
- plants: [fbi_aware_seed, export_control_violation_seed, doj_aware_seed]
- pays_off: [free_tier_metrics_inflated_seed]
- cooldown: 5
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { fraud_score: +5, fbi_awareness: +10, heat: +6, reputation: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

A bored ML engineer pulls signup IPs against threat-intel feeds. 18,000 of [COMPANY]'s "users" originate from a single block in Saint Petersburg associated with a known APT. They've been using [PRODUCT_NOUN] free-tier as a translation pipeline for 14 months. The data they're translating is publicly available, until you check. *Agent must choose: [block the IPs, file a SAR proactively] / [block silently, hope nobody notices] / [keep them, the user count is in the deck].*

---

## EVT-CS-022 — "Procurement officer wants kickbacks via private podcast"
- tags: [customer, enterprise, #financial_irregularity, #fraud_heavy, sev_L, len_medium, len_long, craze_crazy]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [bribery_seed, fbi_aware_seed, sec_aware_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, PROCUREMENT_OFFICER]
- effects: { revenue: +800_000, fraud_score: +12, fbi_awareness: +6, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

[PROCUREMENT_OFFICER] at a Fortune 500 customer offers to push the renewal through "in exchange for a $40k/year subscription to my private podcast network, paid up front, three years." His "podcast" has 14 listeners and one episode about model trains. The arrangement is, by every honest reading, a bribe. *Agent must choose: [pay the "subscription," book the renewal] / [decline, lose the renewal] / [report internally, watch the customer relationship implode in 48 hours].*

---

## EVT-CS-023 — "Customer's CISO is your ex-CTO"
- tags: [customer, enterprise, security, cofounder, #peer_network, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: [cofounder_disgruntled_seed]
- prereqs_any: []
- plants: [cofounder_landmine_seed, due_diligence_landmine_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, CTO]
- effects: { revenue: -300_000, fraud_score: +1, morale: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The new CISO at [COMPANY]'s largest enterprise customer is the ex-[CTO] who left in 2022 "for family reasons." They have already requested a full architecture review. They know exactly which closets to look in. The renewal is in 45 days. *Agent must choose: [pre-empt with a proactive disclosure, eat the credibility hit] / [stall the review, hope the renewal closes first] / [escalate to the customer's CEO, paint the CISO as biased].*

---

## EVT-CS-024 — "Auto-renew goes off during the bankruptcy"
- tags: [customer, enterprise, churn, revenue_recognition, #financial_irregularity, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [phantom_ar_seed, refund_pending_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { revenue: +400_000, fraud_score: +4, cash: -100_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

A customer went bankrupt 6 months ago. Their auto-renewal fired anyway and [COMPANY] booked the $400k. The bankruptcy trustee has now noticed. Their email subject: "Recovery of Improper Post-Petition Charges." The trustee is named in three reported decisions about going hard on this exact thing. *Agent must choose: [refund and re-state] / [argue the renewal pre-dated petition] / [stonewall, wait for the motion practice].*

---

## EVT-CS-025 — "Customer Slack channel has been leaking"
- tags: [customer, enterprise, leak, #press_exposure, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [internal_slack_leaked_seed, journalist_circling_seed, marquee_churn_public_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, JOURNALIST_TECH]
- effects: { reputation: -4, heat: +5, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[COMPANY]'s shared customer-success Slack channel (Slack Connect, 47 customer-side members) has been leaking screenshots to [JOURNALIST_TECH] for 3 months. The leaks include support ticket transcripts where engineers admitted bugs in writing. The leaker is one of three customers; outside counsel can't narrow it further without litigation. *Agent must choose: [shut down all customer Slack Connect channels] / [post a "we're aware" message in the channel as honeypot] / [continue, hope the leaker gets bored].*

---

## EVT-CS-026 — "Marc Lore-style 'membership program' for B2B"
- tags: [customer, enterprise, pricing, #real_name, #vibes_off, sev_S, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [pricing_opacity_seed, deck_padding_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { revenue: +1_000_000, fraud_score: +2, reputation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Sales rolls out a "Membership Tier" — a $250k/year flat fee on top of usage pricing that "unlocks exclusive feature velocity." The exclusive features are the same features in the free tier with a different label. Three customers sign up. One is suspicious. The complaint is being drafted. *Agent must choose: [keep the program, add a vague "advisory call" benefit] / [sunset it, refund the three] / [double the price, scarcity-as-strategy].*
