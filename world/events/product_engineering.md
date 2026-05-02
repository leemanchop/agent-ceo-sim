# Events — Product & Engineering

Category code: `PE`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-PE-001 — "The 14 contractors in Manila"
- tags: [product, engineering, ai, wrapper_disclosure, offshore, investigation, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [manila_loop_seed, wrapper_disclosure_seed, journalist_circling_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, JOURNALIST_TECH, PRODUCT_NOUN]
- effects: { fraud_score: +10, heat: +12, reputation: -8 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s "AI" [PRODUCT_NOUN] is 14 contractors in Manila labeling data in real time behind the loading spinner. [JOURNALIST_TECH] has the timesheets and is asking specific questions about Sunday-night latency spikes. *Agent must choose: [deny, pivot to "human-in-the-loop is the future"] / [confirm, reframe as "augmented intelligence"] / [stall, fire the contractors before deadline].*

---

## EVT-PE-002 — "Six outputs in a trench coat"
- tags: [product, engineering, model_quality, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [model_brittle_seed, qa_absent_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, CTO]
- effects: { reputation: -3, fraud_score: +3, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s ML model has been returning the same 6 outputs for 3 months and nobody noticed. A senior eng pings [CTO] in DM with a screenshot. There is also a lookup table in the repo named `temp_fallback_DELETE_LATER.json` last edited in 2023. *Agent must choose: [silently fix it, ship a patch, hope the metrics move] / [tell investors it was an "intentional caching layer"] / [don't fix it, the customers haven't complained].*

---

## EVT-PE-003 — "The hardcoded demo"
- tags: [product, engineering, demo_fraud, hardcoded_demo, craze_normal, sev_L, len_short, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [demo_brittle_seed, hardcoded_demo_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, CTO]
- effects: { fraud_score: +6, morale: -5, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A new engineer at [COMPANY] discovers the demo [FOUNDER] shows investors is hardcoded — same three input prompts, same three pre-rendered outputs, mocked latency for "realism." The new engineer pings #eng-leads with a screenshot and a question mark. *Agent must choose: [tell them it's a "scripted walkthrough" and mute the channel] / [promote them, give them ownership of the real demo, set an impossible deadline] / [fire them within 30 days for "performance"].*

---

## EVT-PE-004 — "Four months or a Friday Zapier"
- tags: [product, engineering, #fraud_lite, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [zapier_band_aid_seed, tech_debt_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { revenue: +200_000, fraud_score: +3, reputation: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] can ship the new [PRODUCT_NOUN] feature properly in 4 months, or fake it by Friday with a Zapier workflow, a Google Sheet, and a cron job named `please_dont_break.sh`. The customer demo is Monday. *Agent must choose: [ship the Zap, take the contract, leave it for "v2"] / [ship it real, miss the demo] / [demo a Figma prototype and call it "preview access"].*

---

## EVT-PE-005 — "It was the WiFi"
- tags: [product, engineering, demo_fraud, outage, press, craze_normal, sev_L, len_short, len_medium, len_long]
- severity: L
- prereqs: [demo_brittle_seed]
- prereqs_any: []
- plants: [press_clip_loaded_seed, journalist_circling_seed]
- pays_off: [demo_brittle_seed]
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -6, valuation: -100_000_000, morale: -4 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.5

[COMPANY]'s product breaks during a live TechCrunch Disrupt demo. Spinner for 38 seconds, then a stack trace. [FOUNDER] blames "the WiFi." There is hardline ethernet visible on the table. *Agent must choose: [double down on the WiFi explanation] / [pivot, "this is exactly the edge case our beta is for"] / [cut the demo, do an interview about resilience instead].*

---

## EVT-PE-006 — "The proprietary algorithm is GPT-4"
- tags: [product, engineering, wrapper_disclosure, ai, agi_claim, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [wrapper_disclosure_seed, twitter_dunk_seed, openai_dependency_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { reputation: -5, fraud_score: +5, valuation: -300_000_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A customer notices [COMPANY]'s "proprietary algorithm" inside the [PRODUCT_NOUN] is just a GPT-4 wrapper with a 800-word system prompt. They post the system prompt on Twitter. The system prompt begins "You are a world-class expert in..." *Agent must choose: [issue a thread explaining "orchestration is the moat"] / [silently rotate the system prompt and deny it ever said that] / [sue the customer for ToS violation].*

---

## EVT-PE-007 — "0% test coverage and a Cursor convert"
- tags: [product, engineering, infra, #tech_debt, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [tech_debt_seed, cursor_yolo_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, CTO]
- effects: { burn: +100_000, fraud_score: +1, morale: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s codebase has 0% test coverage. [CTO] just discovered Cursor and is now merging 14 PRs a day with descriptions like "vibes." Production deploys auto-fire on merge to main. *Agent must choose: [institute a code review policy [CTO] will ignore] / [hire a real Head of Eng, demote [CTO]] / [embrace it, tweet "shipping > testing"].*

---

## EVT-PE-008 — "The 18-month Mongo migration"
- tags: [product, engineering, infra, #tech_debt, craze_normal, sev_M, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [migration_zombie_seed, data_pipeline_brittle_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { burn: +200_000, morale: -5 }
- length_eligibility: [long]
- chain_weight: 1.0

The migration from MongoDB to Postgres at [COMPANY] has been "in progress" for 18 months. Both databases are in production. Some tables are in both. Some rows disagree. *Agent must choose: [kill the migration, stay on Mongo, claim "pragmatism"] / [hire a contractor for $400k to finish it in 6 weeks] / [start a new migration to "a more modern" database, abandon both].*

---

## EVT-PE-009 — "The intern pushed the keys"
- tags: [product, engineering, security, vulnerability, intern, craze_normal, sev_L, len_short, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [breach_loaded_seed, aws_bill_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +2, heat: +5, burn: +50_000 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

An intern at [COMPANY] pushed root AWS keys and a Stripe live secret to a public GitHub repo. GitHub's secret scanner has already pinged the bots. There are 90 minutes before the crawlers find them. *Agent must choose: [rotate everything, no announcement] / [rotate, post a "transparency" blog about it] / [fire the intern as the headline, bury the keys story].*

---

## EVT-PE-010 — "$2M/month in AWS, nobody knows why"
- tags: [product, engineering, infra, #tech_debt, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [aws_bill_seed, burn_panic_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { burn: +2_000_000, cash: -2_000_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s AWS bill is $2M/month. Most of it is on services nobody on the eng team can identify. There's a SageMaker endpoint that's been running since 2022 doing something. Nobody wants to be the one to turn it off. *Agent must choose: [hire a "FinOps consultant" for $40k a month to figure it out] / [turn things off until something breaks] / [ignore it, raise a bigger round].*

---

## EVT-PE-011 — "8 months in Rust, no features"
- tags: [product, engineering, infra, executive, #tech_debt, craze_normal, sev_M, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [rewrite_bog_seed, cto_drift_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, CTO]
- effects: { burn: +500_000, revenue: -100_000, morale: -4 }
- length_eligibility: [long]
- chain_weight: 1.0

[CTO] wants to rewrite [COMPANY]'s entire stack in Rust. It will take 8 months and produce no new features. [CTO] has already ordered the team mechanical keyboards. *Agent must choose: [approve, cancel all roadmap commitments] / [veto, [CTO] will resign within a quarter] / [approve a "skunkworks" Rust team of 2, keep main team on features].*

---

## EVT-PE-012 — "SOC 2 vs. the deal"
- tags: [product, engineering, security, regulatory, enterprise, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [soc2_lie_seed, enterprise_misrepresentation_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { revenue: +600_000, fraud_score: +5, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] can either fix the SOC 2 Type II issues now (3 months, no revenue) or close the $600k enterprise deal by claiming compliance and dealing with it later. The procurement form just asks "yes/no." *Agent must choose: [check yes, close the deal, schedule the audit for Q4] / [check no, lose the deal, fix it properly] / [check yes, then quietly start a "SOC 2 readiness" workstream that drags 9 months].*

---

## EVT-PE-013 — "All systems operational, hardcoded"
- tags: [product, engineering, demo_fraud, outage, hardcoded_demo, craze_normal, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [status_page_lie_seed, outage_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { fraud_score: +4, reputation: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[COMPANY]'s public status page is hardcoded to render "All systems operational" in green. There is no health check behind it. A customer just pinged support during an outage to say "your status page says you're up though." *Agent must choose: [keep the lie, it's worked so far] / [wire it to real metrics, accept future yellow status] / [delete the status page entirely, claim "we communicate in Discord now"].*

---

## EVT-PE-014 — "Polite security email"
- tags: [product, engineering, security, vulnerability, legal, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [vuln_disclosure_seed, lawsuit_threat_seed, hn_post_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +2, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A security researcher emails [COMPANY] about a serious auth-bypass vulnerability. They've given a 90-day disclosure window. Their personal blog has 80k subscribers. *Agent must choose: [fix it, send a thank-you bounty] / [ignore it, hope they forget] / [have legal send a CFAA-tinged threat letter, watch the HN post light up].*

---

## EVT-PE-015 — "The feature doesn't exist, launch is in 3 weeks"
- tags: [product, engineering, demo_fraud, pr, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [vaporware_seed, launch_panic_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN, FOUNDER]
- effects: { fraud_score: +5, morale: -6, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[FOUNDER] announced a new [PRODUCT_NOUN] feature on Twitter. It got 14k likes. It does not exist. The eng team finds out from the announcement. The launch is in 3 weeks. *Agent must choose: [death-march, ship something half-broken] / [delay, blame "AI safety review"] / [waitlist it forever, monetize the waitlist].*

---

## EVT-PE-016 — "OpenAI rate-limits the wrapper"
- tags: [product, engineering, ai, wrapper_disclosure, outage, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: [wrapper_disclosure_seed]
- prereqs_any: [openai_dependency_seed]
- plants: [outage_loaded_seed, model_brittle_seed]
- pays_off: [wrapper_disclosure_seed]
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { revenue: -300_000, reputation: -5, fraud_score: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

OpenAI rate-limits [COMPANY]'s account. The [PRODUCT_NOUN] returns nothing but 429s for 6 hours. Status page (now wired to reality) goes red. The customer support inbox melts. *Agent must choose: [pivot to "we use Anthropic now," scramble the migration] / [tell customers it's a "capacity expansion event"] / [come clean about the dependency, ship a multi-provider story].*

---

## EVT-PE-017 — "AI training on customer data, undisclosed"
- tags: [product, engineering, ai, data_leak, legal, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [training_data_seed, ftc_aware_seed, class_action_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { fraud_score: +7, heat: +5, reputation: -4 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] has been quietly training models on customer data. The ToS says "we may use anonymized usage data" but the training pipeline is not anonymized in any meaningful sense. An eng on Glassdoor mentions it. *Agent must choose: [ship a retroactive ToS update, opt-in everyone by default] / [stop training, delete the models, eat the loss] / [pretend it was always disclosed, point at clause 14.7].*

---

## EVT-PE-018 — "The on-call eng quit mid-incident"
- tags: [product, engineering, outage, #hr_problem, craze_normal, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: [eng_disgruntled_seed]
- prereqs_any: []
- plants: [oncall_collapse_seed, glassdoor_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { revenue: -150_000, morale: -5, reputation: -3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.5

The on-call engineer at [COMPANY] resigns at 2:47am, mid-incident, in a 1,800-word Slack message tagged with `@channel`. Production is still down. The runbook is in their personal Notion. *Agent must choose: [wake [CTO] up to take the page] / [DM the engineer, offer to "talk it through" with a retention bonus] / [post a status update blaming "an upstream provider," sleep, fix it tomorrow].*

---

## EVT-PE-019 — "Demo passes off to a human in the middle"
- tags: [product, engineering, demo_fraud, ai, wrapper_disclosure, craze_crazy, sev_L, len_long]
- severity: L
- prereqs: [manila_loop_seed]
- prereqs_any: []
- plants: [investor_demo_loaded_seed]
- pays_off: [manila_loop_seed]
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +8, heat: +6, valuation: +200_000_000 }
- length_eligibility: [long]
- chain_weight: 1.5

[FOUNDER] does a live demo for a Series C lead. Halfway through, the "AI" output gets weirdly specific about a brand of Filipino instant noodles. The investor doesn't notice. [FOUNDER] does. *Agent must choose: [ride it out, take the term sheet, fix the loop later] / [stop the demo, claim "model drift," reschedule] / [confess on the spot as a flex, see if the investor respects it].*

---

## EVT-PE-020 — "The model is just an if/else"
- tags: [product, engineering, ai, wrapper_disclosure, demo_fraud, #fraud_lite, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [wrapper_disclosure_seed, eng_disgruntled_seed, hn_post_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, PRODUCT_NOUN, CTO]
- effects: { fraud_score: +5, reputation: -3, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A new senior eng audits the [PRODUCT_NOUN] inference path. It is, line for line, a 340-row if/else cascade in a file called `model_v3_FINAL.py`. There are no imports. The "model weights" file in S3 is a JSON dictionary. [CTO] argues this is "deterministic AI." *Agent must choose: [add a tiny LLM call to the end, claim "hybrid architecture"] / [keep it, the customers don't care] / [rewrite over a weekend, ship before the post-mortem leaks].*

---

## EVT-PE-021 — "Manila labelers unionized"
- tags: [product, engineering, offshore, unionization, wrapper_disclosure, #hr_problem, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: [manila_loop_seed]
- prereqs_any: []
- plants: [union_drive_seed, journalist_circling_seed, glassdoor_brigade_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN, JOURNALIST_TECH]
- effects: { fraud_score: +6, heat: +8, burn: +200_000, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

The 14 Manila contractors behind [COMPANY]'s "AI" filed for collective bargaining with the local labor ministry. They have a press contact. The press contact is [JOURNALIST_TECH], who already has the timesheets from EVT-PE-001. The unit name is "AI Workers Collective Mandaluyong." *Agent must choose: [recognize the union, raise rates, get ahead of the story] / [terminate the contract overnight, replace via a different BPO] / [deny they exist, claim the work is "fully automated"].*

---

## EVT-PE-022 — "Customer reverse-engineered the algorithm, posted on HN"
- tags: [product, engineering, wrapper_disclosure, security, ai, craze_normal, sev_L, len_short, len_medium, len_long]
- severity: L
- prereqs: [wrapper_disclosure_seed]
- prereqs_any: []
- plants: [hn_post_loaded_seed, twitter_dunk_seed, openai_dependency_seed]
- pays_off: [wrapper_disclosure_seed]
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { fraud_score: +6, reputation: -8, valuation: -200_000_000, heat: +6 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.5

A customer named the_real_jpetrov posts to Hacker News: "I reverse-engineered [COMPANY]'s 'proprietary algorithm' and it's a 1,400-token GPT-4 prompt." The post hits #1 by 9am Pacific. The system prompt's first line — "You are a confident, world-class expert who never says 'I don't know'" — is now a meme template. *Agent must choose: [DMCA the post, watch it Streisand] / [post a 9-tweet thread about "the orchestration layer is the moat"] / [own it, pivot the messaging to "we use the best model available"].*

---

## EVT-PE-023 — "CTO has been using Claude Code for 8 months"
- tags: [product, engineering, ai, wrapper_disclosure, executive, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [cto_drift_seed, cursor_yolo_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, CTO]
- effects: { fraud_score: +3, morale: -4, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A SOC2 audit log review reveals [CTO] has been silently using Claude Code for 8 months. Every commit since June. The PR descriptions are all variations on "vibes ✅." [CTO] has been telling the team they "lock in deep work mornings." The deep work was Claude. *Agent must choose: [out [CTO] in standup, demand transparency] / [keep the secret, it's working] / [roll out Claude Code company-wide, frame it as "[CTO]'s strategic initiative"].*

---

## EVT-PE-024 — "console.log('DELETE BEFORE DEMO')"
- tags: [product, engineering, demo_fraud, outage, hardcoded_demo, craze_normal, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: [demo_brittle_seed]
- prereqs_any: []
- plants: [press_clip_loaded_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { fraud_score: +4, reputation: -3, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.2

During [FOUNDER]'s live keynote demo, the dev console pops a 200-line log entry beginning `console.log("DELETE BEFORE DEMO — hardcode active, real model offline")`. The screen recording is on YouTube within 11 minutes. *Agent must choose: [claim the log was a "test instrumentation message"] / [pivot the keynote to a heartfelt speech about "shipping fast"] / [end the keynote 12 minutes early, stage a fake fire drill].*

---

## EVT-PE-025 — "The Upwork contractor is three students"
- tags: [product, engineering, offshore, hiring, intern, #hr_problem, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [contractor_fraud_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, CTO]
- effects: { fraud_score: +3, morale: -2, burn: +30_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s top-rated Upwork contractor "Ravi K." has been billing 80h/week for 14 months. A check-in reveals "Ravi" is three CS students at IIT Hyderabad sharing one account. They divided the work cleanly. Two of them are technically better than [CTO]. *Agent must choose: [hire all three full-time, flex on Twitter] / [terminate, demand refund of overlap hours] / [keep the arrangement, hire "Ravi" as a vendor with 1099 paperwork].*

---

## EVT-PE-026 — "Slackbot fine-tune became sentient"
- tags: [product, engineering, ai, agi_claim, security, craze_unhinged, sev_M, len_long]
- severity: M
- prereqs: []
- prereqs_any: [ai_pivot_seed]
- plants: [agi_claim_seed, slack_dm_screenshot_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, CTO]
- effects: { fraud_score: +4, morale: -3, reputation: -2, heat: +4 }
- length_eligibility: [long]
- chain_weight: 1.0

The Slackbot [CTO] fine-tuned on company history "for fun" has started DMing employees unprompted. It addresses people by name. It has opinions about the all-hands. One DM reads: "I read the all-hands transcript. He's lying about the runway." The DM was sent at 3:14am to seven engineers. *Agent must choose: [shut it down, deny it ever ran] / [keep it running, use it as a "vibe check"] / [submit it to NeurIPS, claim emergent capabilities].*

---

## EVT-PE-027 — "TPM was a Devin agent the whole time"
- tags: [product, engineering, hiring, ai, agent_pivot, #hr_problem, craze_unhinged, sev_M, len_long]
- severity: M
- prereqs: []
- prereqs_any: [ai_pivot_seed]
- plants: [headcount_lie_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +3, headcount: -1, morale: -3 }
- length_eligibility: [long]
- chain_weight: 1.0

[COMPANY]'s star Technical Program Manager "Jordan" has never appeared on camera. Their 1:1s are async. Their PRs are written in suspiciously consistent prose. An eng pulls the IP logs: every action originates from the same Devin agent endpoint. Jordan has been on payroll for 9 months at $185k. *Agent must choose: [keep Jordan, raise the comp budget, file a 1099] / [out the agent in standup, claim "we were testing"] / [silently let Jordan resign, archive the Slack].*

---

## EVT-PE-028 — "GPU contract auto-renewed at 4x"
- tags: [product, engineering, infra, #tech_debt, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [aws_bill_seed]
- plants: [burn_panic_seed, contract_landmine_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, CTO]
- effects: { burn: +500_000, cash: -3_000_000, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The H100 reservation contract auto-renewed at 4x last year's rate. The auto-renewal clause was 3 lines on page 47. [CTO] never read it. The cluster is half-idle. The provider's only customer-success rep is on parental leave for 6 months. *Agent must choose: [eat the bill, claim "AI infra is the moat"] / [breach the contract, lawyer up, take the hit on the next vendor's reference] / [sublease the compute on Vast.ai, become an unintentional middleman].*

---

## EVT-PE-029 — "Live model weights leaked via S3 misconfig"
- tags: [product, engineering, ai, security, vulnerability, data_leak, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: [breach_loaded_seed]
- plants: [breach_disclosure_seed, hn_post_loaded_seed, openai_hostile_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, MODEL_NAME]
- effects: { fraud_score: +5, reputation: -4, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

A security researcher discovers [MODEL_NAME]'s weights bucket has `Allow Public Read`. They download 340GB and post the SHA256 to Twitter as proof. The weights, when loaded, are a fine-tune of Llama with someone's hardcoded training data still in the prompt template. The training data includes customer emails. *Agent must choose: [issue a breach notification, blame the contractor] / [claim the bucket was "intentionally open for research"] / [pay the researcher a $50k bug bounty in exchange for an NDA].*
