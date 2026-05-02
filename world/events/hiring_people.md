# Events — Hiring & People

Category code: `HP`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-HP-001 — "Stripe candidate, Tuesdays off"
- tags: [hiring, comp, executive, craze_normal, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [comp_creep_seed, hire_resentment_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { burn: +50_000, morale: -3, headcount: +1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A Senior PM candidate from Stripe wants $600k base, $4M equity over four years, and "Tuesdays off, non-negotiable." His Twitter bio says "Building x Healing x Vibing." *Agent must choose: [accept everything, including Tuesdays] / [counter at $450k base, lose him to Anthropic] / [reject, post a thread about "hunger over credentials"].*

---

## EVT-HP-002 — "Triple Head of Growth"
- tags: [hiring, executive, #hr_problem, linkedin_post, craze_crazy, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [moonlight_exec_seed, linkedin_dunk_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { reputation: -3, fraud_score: +1, morale: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[COMPANY]'s Head of Growth is also Head of Growth at two other Series B companies. You find out via his LinkedIn, where all three roles are listed as "current — full-time." A reply guy already screenshotted it. *Agent must choose: [fire him publicly, post the screenshot] / [keep him, he's "outcome-oriented"] / [renegotiate to fractional, save face].*

---

## EVT-HP-003 — "The loyalty clause"
- tags: [hiring, equity_refresh, legal, #hr_problem, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [contract_landmine_seed, glassdoor_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { reputation: -3, morale: -3, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A new engineer asks why their offer letter at [COMPANY] has a "loyalty clause" that requires repaying signing bonus + relocation + a "ramp-up cost" of $80k if they leave within 24 months. Their lawyer brother is also on the email. *Agent must choose: [strike the clause, send a clean offer] / [keep it, hope they sign] / [keep it, pull the offer, blame "fit"].*

---

## EVT-HP-004 — "Real COO or your roommate"
- tags: [hiring, executive, cofounder, founder_behavior, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [nepo_exec_seed, cofounder_disgruntled_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { headcount: +1, morale: -4, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] can hire an actual COO (15 years operating experience, ran a unicorn ops org) or promote [FOUNDER]'s college roommate Kevin who's "really good at Excel." Kevin has memed the role internally and changed his Slack title to "COO (incoming)." *Agent must choose: [hire the real COO, demote Kevin to Chief of Staff] / [promote Kevin, buy him a Tesla] / [hire both, "creative tension".*

---

## EVT-HP-005 — "Distinguished Engineer or nothing"
- tags: [hiring, executive, comp, founder_behavior, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [title_inflation_seed, press_release_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { headcount: +1, burn: +60_000, reputation: +2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A FAANG senior eng will join [COMPANY] but only if the press release calls him "Distinguished Engineer." He has a slide ready about why this is "industry-standard at his level." There are no other Distinguished Engineers at [COMPANY]. *Agent must choose: [grant the title, write the press release] / [counter with "Principal Engineer"] / [pass, post about title inflation in the industry].*

---

## EVT-HP-006 — "Layoff via Zoom webinar, mics muted"
- tags: [firing, executive, #hr_problem, leak, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [layoff_leak_seed, glassdoor_loaded_seed, journalist_circling_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { burn: -800_000, morale: -15, reputation: -8, headcount: -40 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s Head of People wants to do the 40-person layoff via Zoom webinar with attendee mics muted. The script is 4 minutes long. There is a slide that says "Thank you for your contribution." *Agent must choose: [run it as designed, log off immediately] / [do 1:1s instead, take a week] / [run the webinar but leave Q&A open, get destroyed live].*

---

## EVT-HP-007 — "The 18-month equity refresh"
- tags: [hiring, equity_refresh, comp, #hr_problem, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [equity_refresh_overdue_seed, eng_disgruntled_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { morale: -5, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A senior employee at [COMPANY] asks in #ask-leadership about the equity refresh that was promised 18 months ago. Sixteen reactions. Three of them are clocks. *Agent must choose: [grant refreshes immediately, dilute everyone] / [issue a long Notion doc explaining "philosophy on refresh timing"] / [ignore the message, archive the channel].*

---

## EVT-HP-008 — "ChatGPT firing script"
- tags: [firing, #hr_problem, ai, leak, craze_crazy, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [layoff_leak_seed, slack_dm_screenshot_seed, glassdoor_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { burn: -300_000, morale: -10, reputation: -6, headcount: -15 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] can fire the bottom 10% via Slack DM with a script generated by ChatGPT. The script begins "Dear [FIRST_NAME]," and three of them go out unrendered. Screenshots arrive on Twitter within 11 minutes. *Agent must choose: [own it, post "we move fast"] / [apologize, blame an "automation error"] / [delete the messages, deny everything, the Slack admin can backdate].*

---

## EVT-HP-009 — "First day, hiring freeze announced"
- tags: [hiring, executive, #hr_problem, craze_crazy, sev_M, len_short, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [hire_resentment_seed, vibes_off_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { morale: -4, reputation: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A new hire's first day at [COMPANY] is also the day of the all-hands where the hiring freeze gets announced. They're sitting in the front row in a [COMPANY] hoodie they bought yesterday. *Agent must choose: [shout them out as "the last great hire before discipline"] / [pretend they're not there, push through the deck] / [pull them into a private 1:1 after, walk back the freeze for "key roles"].*

---

## EVT-HP-010 — "Chief of Staff, four reports, no scope"
- tags: [hiring, executive, founder_behavior, craze_normal, sev_S, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [cos_empire_seed, org_chart_drift_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { burn: +80_000, morale: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[FOUNDER]'s Chief of Staff at [COMPANY] now has four direct reports. Their job descriptions are all "support the Office of the CEO." None of them can articulate what they ship. The CoS has started using "we" when she means "I." *Agent must choose: [reorg the CoS into Strategy, give her a real P&L] / [let her run, she's the only one who manages [FOUNDER]] / [fire the four reports, keep the CoS thin].*

---

## EVT-HP-011 — "Unionization in #random"
- tags: [hiring, unionization, #hr_problem, leak, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [union_drive_seed, nlrb_aware_seed, glassdoor_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY]
- effects: { fraud_score: +2, morale: -4, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

An employee posts in #random at [COMPANY]: "has anyone here ever been part of a union? curious how that works." Twelve emoji reactions in 4 minutes. The HR lead screenshots and forwards to [FOUNDER]. *Agent must choose: [ignore it, let it die] / [hire union-busting counsel quietly, schedule "listening sessions"] / [send a company-wide email about "why unions don't fit our culture," get NLRB'd].*

---

## EVT-HP-012 — "Trust & Safety or 'we'll figure it out'"
- tags: [hiring, executive, regulatory, ftc, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [t_and_s_gap_seed, ftc_aware_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, PRODUCT_NOUN]
- effects: { burn: +25_000, fraud_score: +3, heat: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY] can hire a Head of Trust & Safety for $300k or save the money and "we'll figure it out when something happens." The [PRODUCT_NOUN] handles user-generated content. Something is currently happening, you just don't know about it yet. *Agent must choose: [hire the head, slow down on shipping] / [save the $300k, set up a Google Form for reports] / [outsource to a contractor in the Philippines for $40k].*

---

## EVT-HP-013 — "Three quit citing 'vibes'"
- tags: [firing, #hr_problem, #vibes_off, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [eng_disgruntled_seed]
- plants: [eng_disgruntled_seed, vibes_off_seed, glassdoor_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { headcount: -3, morale: -5, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

Three engineers at [COMPANY] resign on the same day. The exit interviews all use the word "vibes" unprompted. None of them have lined up new jobs. One says "I'd rather be unemployed." *Agent must choose: [retain bonus the rest of the team, $50k each, no questions] / [post "we hire for grit, not vibes" on LinkedIn] / [run a culture survey, ignore the results].*

---

## EVT-HP-014 — "PIP'd employee is recording"
- tags: [pip, firing, legal, discovery, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [recorded_1_1_seed, lawsuit_threat_seed, discovery_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { fraud_score: +3, heat: +5, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A PIP'd employee at [COMPANY] has been recording all 1:1s for the last 9 weeks. Her lawyer just emailed asking for the performance documentation. The first email refers, by Bates number, to a recording you didn't know existed. *Agent must choose: [settle for $150k and an NDA] / [terminate immediately for cause, fight discovery] / [reverse the PIP, promote her, hope it goes away].*

---

## EVT-HP-015 — "Unlimited PTO (with a list)"
- tags: [hiring, comp, #hr_problem, craze_normal, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [pto_tracking_seed, glassdoor_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { morale: +2, fraud_score: +1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[COMPANY] rolls out "unlimited PTO" and the People team quietly maintains a spreadsheet titled `pto_observations_q3.xlsx` with red highlights for "above benchmark." *Agent must choose: [keep the spreadsheet, never speak of it] / [delete the spreadsheet, switch to actual unlimited PTO] / [convert to 25-day fixed PTO, frame as "structure".*

---

## EVT-HP-016 — "DEI workshop vs. lead investor"
- tags: [hiring, dei, founder_behavior, #vibes_off, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [dei_collision_seed, board_pressure_seed, slack_dm_screenshot_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, TIER1_VC_PARTNER]
- effects: { reputation: -3, morale: -4, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s DEI lead wants to run a workshop. [TIER1_VC_PARTNER] just texted [FOUNDER]: "no woke stuff." [FOUNDER] reads the message during a DEI lead 1:1. *Agent must choose: [run the workshop, don't tell the investor] / [cancel the workshop, fire the DEI lead, save $200k] / [run the workshop, leak the investor's text].*

---

## EVT-HP-017 — "VP Eng has been in Bali"
- tags: [firing, executive, leak, #hr_problem, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [exec_remote_lie_seed, glassdoor_loaded_seed, tiktok_leak_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY]
- effects: { morale: -3, reputation: -2, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

You discover [COMPANY]'s VP Engineering has been remote-working from Bali for 8 months despite claiming "in office, mostly." His Slack status changes timezone every Monday morning. There is a TikTok of him at a beach club tagged with the company name. *Agent must choose: [fire him publicly] / [allow it, expand the policy "globally distributed"] / [demand he return immediately, watch him resign mid-flight].*

---

## EVT-HP-018 — "Recruiter ghost network"
- tags: [hiring, comp, #hr_problem, craze_normal, sev_S, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [recruiter_blacklist_seed, hire_pipeline_dry_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { burn: +20_000, headcount: -0, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Three top recruiting agencies stop returning [COMPANY]'s emails the same week. A Blind thread titled "[COMPANY] is a flag" hits 400 comments. The pipeline goes from 60 candidates to 9 in a fortnight. *Agent must choose: [pay a premium agency 35% to break the silence] / [start an internal referral bonus, $20k per hire] / [post a thread about "why we're hiring slow on purpose"].*

---

## EVT-HP-019 — "Cofounder asks for a sabbatical"
- tags: [cofounder, executive, #hr_problem, craze_normal, sev_L, len_long]
- severity: L
- prereqs: [cofounder_disgruntled_seed]
- prereqs_any: []
- plants: [cofounder_flipped_seed, cap_table_messy_seed]
- pays_off: [cofounder_disgruntled_seed]
- cooldown: 4
- slots: [COMPANY, CTO, FOUNDER]
- effects: { morale: -6, fraud_score: +2 }
- length_eligibility: [long]
- chain_weight: 1.5

[CTO] asks [FOUNDER] for a "6-month sabbatical to think." She has not opened a PR in 8 weeks. Her shares are 78% vested. Her lawyer has been "helping with personal estate planning." *Agent must choose: [grant the sabbatical, hope she returns] / [decline, force a resignation, trigger acceleration debate] / [grant indefinitely, quietly buy back her shares before she lawyers up].*

---

## EVT-HP-020 — "OSHA-flag ball pit"
- tags: [hiring, office, osha, regulatory, craze_crazy, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [osha_complaint_seed, office_cringe_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { reputation: -2, heat: +2, fraud_score: +1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

An employee files an OSHA complaint about [COMPANY]'s in-office ball pit. Someone broke an ankle in it during the offsite. There is a TikTok. *Agent must choose: [remove the ball pit, blame it on "real estate optimization"] / [keep the ball pit, sign waivers] / [double down, install a foam pit too].*

---

## EVT-HP-021 — "L7 has a parallel TikTok career"
- tags: [hiring, executive, tiktok_leak, founder_behavior, #vibes_off, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [moonlight_exec_seed, tiktok_leak_seed, glassdoor_brigade_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { reputation: -2, morale: -3, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s L7 Principal Engineer has a TikTok with 480k followers under @marshmallow_arch. The content is critique of [COMPANY]'s codebase, with the variable names redacted but the architecture diagrams un-redacted. Three of his videos are about "the worst manager I've ever had." Two of them are clearly [FOUNDER]. *Agent must choose: [fire publicly, eat the press cycle] / [offer a comp restructure tied to a non-disparagement] / [start your own founder TikTok in retaliation].*

---

## EVT-HP-022 — "Chief of Staff to the Chief of Staff"
- tags: [hiring, executive, founder_behavior, #vibes_off, craze_crazy, sev_S, len_medium, len_long]
- severity: S
- prereqs: [cos_empire_seed]
- prereqs_any: []
- plants: [org_chart_drift_seed, headcount_lie_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER, CHIEF_OF_STAFF]
- effects: { burn: +120_000, morale: -3, reputation: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[CHIEF_OF_STAFF] hires their own Chief of Staff at $260k base. The new CoS-to-the-CoS attends [FOUNDER]'s 1:1s "to take notes." The notes are then summarized by [CHIEF_OF_STAFF]'s Chief of Staff for [CHIEF_OF_STAFF], who summarizes them for [FOUNDER]. The org chart now has a 4-deep "Office of the CEO" tree. *Agent must choose: [approve the hire, expand the office] / [veto, watch [CHIEF_OF_STAFF] resign in protest] / [demote both, make them "Strategy Specialists"].*

---

## EVT-HP-023 — "Slack 'thoughts' channel is a manifesto factory"
- tags: [hiring, leak, slack_dm_screenshot_seed, #hr_problem, #vibes_off, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: [eng_disgruntled_seed]
- plants: [internal_slack_leaked_seed, glassdoor_brigade_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { morale: -4, reputation: -2, heat: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

A Slack channel called #thoughts has 47 members and 9,000 messages this quarter. Today's top thread: a 2,400-word manifesto about [COMPANY]'s "managerialist drift" written by an L4 named [INTERN_NAME] who joined 4 months ago. There are 23 prayer-hands reacts. *Agent must choose: [archive #thoughts, send a "values" memo] / [pin the manifesto, schedule a Q&A] / [DM [INTERN_NAME] a calendar invite labeled "Coffee Chat."].*

---

## EVT-HP-024 — "All-hands pronoun question, founder leaves"
- tags: [hiring, dei, founder_behavior, #vibes_off, #hr_problem, craze_crazy, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [vibes_off_seed, glassdoor_brigade_seed, slack_dm_screenshot_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -4, morale: -6, heat: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

At the all-hands Q&A, an employee asks about updating the pronoun policy. [FOUNDER] visibly tenses, says "let's table that," then quietly leaves the room mid-meeting via the side door. The Zoom shows [FOUNDER] still on the call from a different room with the camera off, audio briefly catching "...this is fucking ridiculous." Twelve people screenshot. *Agent must choose: [issue a Notion doc clarifying the policy] / [post a Twitter thread about "free speech in the workplace"] / [fire the Head of People to redirect the heat].*

---

## EVT-HP-025 — "All-hands turns into an open Q&A about the lawsuit"
- tags: [hiring, executive, #hr_problem, leak, lawsuit_threat, craze_normal, sev_L, len_medium, len_long]
- severity: L
- prereqs: [discovery_loaded_seed]
- prereqs_any: [layoff_leak_seed, cofounder_lawsuit_seed]
- plants: [glassdoor_brigade_seed, slack_dm_screenshot_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { morale: -8, reputation: -4, heat: +5, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

The Q&A doc for the all-hands has 340 questions and 1,100 upvotes overnight. The top question (840 upvotes): "What's the actual exposure on the [insert lawsuit name] suit?" The second (820): "Why did [executive] leave on Friday?" Outside counsel says do not address either. *Agent must choose: [skip Q&A entirely, push through the deck] / [answer with non-answers, watch the morale tank] / [cancel the all-hands, claim "scheduling conflict"].*

---

## EVT-HP-026 — "Recruiter sourced 9 of 12 hires from one Twitter thread"
- tags: [hiring, executive, #vibes_off, craze_crazy, sev_S, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [hire_resentment_seed, peer_circle_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { burn: +80_000, morale: -2, reputation: -1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

A diligence-prep audit reveals 9 of [COMPANY]'s last 12 hires were sourced from a single 2023 Twitter thread titled "I am hiring, drop your handle." Eight of the nine still follow each other on Twitter. They have a private group chat called "the chosen." Three of them have started DMing [FOUNDER] directly about "vibes drift." *Agent must choose: [hire a real Head of Talent, dismantle the chat] / [keep sourcing from Twitter, it works] / [add the chat members to the bonus comp band, formalize the cabal].*

---

## EVT-HP-027 — "Burning Man absence list"
- tags: [hiring, executive, founder_behavior, burning_man, #vibes_off, craze_normal, sev_S, len_short, len_medium, len_long]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [vibes_off_seed, founder_unhinged_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { morale: -3, reputation: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

The Monday after Labor Day, 14 employees including [FOUNDER], [CHIEF_OF_STAFF], the Head of Eng, and the entire Trust & Safety team are out "sick." Their Instagram stories from the weekend are matching dust-coated sunsets. The on-call rotation collapses. The CFO, who hates Burning Man, is the only exec on Slack. *Agent must choose: [issue a "no-PTO during launch week" policy] / [give the office Wednesday off in solidarity] / [send a passive-aggressive Slack about "operational discipline"].*

---

## EVT-HP-028 — "VP Sales hired her own publicist on the company card"
- tags: [hiring, executive, comp, #financial_irregularity, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [moonlight_exec_seed, expense_audit_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY]
- effects: { burn: +30_000, fraud_score: +2, morale: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[COMPANY]'s VP Sales has been expensing a personal publicist at $15k/month for "executive brand development." The publicist's other clients include three reality-TV stars and a wellness influencer. The VP's resulting LinkedIn posts about [COMPANY] are 80% photos of her. *Agent must choose: [terminate the publicist contract, retroactively bill the VP] / [allow it as "marketing expense"] / [hire publicists for every VP, escalate the spend to ridiculous].*

---

## EVT-HP-029 — "Glassdoor brigade after the layoff"
- tags: [firing, glassdoor, #hr_problem, leak, craze_normal, sev_M, len_medium, len_long]
- severity: M
- prereqs: [layoff_leak_seed]
- prereqs_any: [glassdoor_brigade_seed]
- plants: [recruiter_blacklist_seed, blind_thread_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -5, morale: -2, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

180 new Glassdoor reviews in 72 hours. The CEO score drops from 4.1 to 1.8. The reviews are oddly literary — three of them are written in iambic pentameter. One is a haiku. The top-helpful is titled "I watched a man microwave fish at the all-hands." *Agent must choose: [pay Glassdoor to "manage the page"] / [post a transparency response from the official account] / [encourage current employees to leave 5-star reviews, brigade detected within a day].*
