# Events — Founder/CEO Personal Behavior

Category code: `FB`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-FB-001 — "Seven things your lawyer is concerned about"
- tags: [founder_behavior, podcast, #vibes_off, #press_exposure, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [podcast_three_hour_seed, rogan_episode_aired_seed]
- plants: [podcast_legal_review_seed, lawyer_alarmed_seed]
- pays_off: [podcast_three_hour_seed]
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, fraud_score: +2, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[FOUNDER]'s podcast appearance had seven statements your outside counsel is "concerned about." She used the word "concerned" four times in one email. *Issue clarifications, do nothing, or post a thread re-contextualizing each one?*

---

## EVT-FB-002 — "The 40k-like subtweet"
- tags: [founder_behavior, subtweet, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [vc_beef_loaded_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { reputation: -2, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A junior VC subtweeted [FOUNDER] yesterday with "I've seen this movie before, it's called Theranos." 40k likes. Quote-tweeted by [PARODY_ACCOUNT]. *Block, reply with a "lol," or DM the partner at his fund?*

---

## EVT-FB-003 — "Open letter to my haters"
- tags: [founder_behavior, linkedin_post, medium_post, #cult_of_personality, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [open_letter_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +5, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

LinkedIn is suggesting [FOUNDER] post an "open letter to my haters." The draft is 2,400 words long and contains the phrase "the arena." Engagement metrics on similar posts have been described as "enormous and regrettable." *Post it, save to drafts, or have the comms team rewrite?*

---

## EVT-FB-004 — "Ex-employee TikTok at 2.4M views"
- tags: [founder_behavior, tiktok_leak, #hr_problem, #press_exposure, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [eng_disgruntled_seed, cofounder_disgruntled_seed]
- plants: [ex_employee_chorus_seed, glassdoor_brigade_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -7, morale: -4, heat: +8 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

An ex-employee posted a TikTok titled "what it was like working for [FOUNDER]." 2.4M views and growing. The quiet bit at 0:23 about the all-hands "vision" speech is the part being clipped. *Issue a statement, contact the platform, or DM the ex-employee an offer?*

---

## EVT-FB-005 — "Glassdoor: microwaves fish"
- tags: [founder_behavior, glassdoor, #hr_problem, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [glassdoor_brigade_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -1, morale: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Anonymous Glassdoor review: "CEO microwaves fish in shared kitchen. Three stars." It is the third such review. *Have HR encourage positive reviews, ignore, or dispute the review formally?*

---

## EVT-FB-006 — "Davos photo, you should not be in this photo"
- tags: [founder_behavior, davos, #vibes_off, #press_exposure, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [davos_photo_loaded_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +4, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[FOUNDER] is photographed at Davos with someone they should absolutely not be photographed with. The photo is on the WEF official feed. The hand on the shoulder is unambiguous. *Crop and re-post, claim "we just met," or pull the photo via WEF contacts?*

---

## EVT-FB-007 — "Goodreads has been found"
- tags: [founder_behavior, goodreads_incriminating, old_tweet, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [goodreads_archived_seed, ayn_rand_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { reputation: -2, heat: +4 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[FOUNDER]'s Goodreads has been found. It shows Atlas Shrugged rated 5 stars three separate times. The Fountainhead is also 5 stars. The Bell Jar is 1 star with the review "didn't get it." [PARODY_ACCOUNT] is screencapping. *Delete the account, claim it isn't yours, or own it?*

---

## EVT-FB-008 — "2014 tweet trending"
- tags: [founder_behavior, old_tweet, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: [old_tweet_archive_seed]
- plants: [old_tweet_viral_seed]
- pays_off: [old_tweet_archive_seed]
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, heat: +4 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A 2014 tweet of [FOUNDER]'s is trending. The tweet is bad in a way that requires no context. The tweet has 18k quote-retweets and counting. *Apologize, claim the account was hacked in 2014, or delete and hope no one screenshotted (too late)?*

---

## EVT-FB-009 — "Tweet-deleter service, screenshots already exist"
- tags: [founder_behavior, old_tweet, #fraud_lite, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [tweet_deletion_service_used_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -1, fraud_score: +1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

You can pay $400 for a service that bulk-deletes [FOUNDER]'s old tweets. Of course, the screenshots already exist. Of course, the service has a public client list. *Pay it, do it manually, or leave the tweets up like a person with conviction?*

---

## EVT-FB-010 — "All-In Summit, fifth billing"
- tags: [founder_behavior, all_in, #real_name, #cult_of_personality, sev_S, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [all_in_appearance_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +1, heat: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[FOUNDER] is invited to All-In Summit. Fifth billing under Chamath, Sacks, Friedberg, and Calacanis. The panel topic is "AI: Bubble or Renaissance." [FOUNDER]'s name appears in 14pt below their 24pt names. *Accept, decline and post about declining, or counter-demand fourth billing?*

---

## EVT-FB-011 — "The dinner that became a salon that became a cult meeting"
- tags: [founder_behavior, #cult_of_personality, #peer_network, #vibes_off, sev_M, len_medium, len_long, craze_crazy]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [salon_loaded_seed, peer_circle_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER, PEER_FOUNDER]
- effects: { reputation: -2, heat: +6, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[FOUNDER] hosted a dinner. Attendees, in their tweet recaps, are calling it "a salon." Non-attendees, on Reddit, are calling it "a cult meeting." [PEER_FOUNDER] live-tweeted the toast. *Lean into "salon," post a denial, or host another one?*

---

## EVT-FB-012 — "Costa Rica retreat, the photos are bad"
- tags: [founder_behavior, retreat, #vibes_off, #press_exposure, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [retreat_photos_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[FOUNDER]'s "meditation retreat" in Costa Rica was photographed by a long-lens paparazzo. The photos are not what one would call dignified. The captions write themselves. *Buy the rights to the photos, ride it out, or own it with a tweet captioned "presence"?*

---

## EVT-FB-013 — "Margins published 14,000 words"
- tags: [founder_behavior, profile, investigation, #press_exposure, sev_L, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [forbes_profile_circling_seed, ex_employee_chorus_seed]
- plants: [margins_substack_seed]
- pays_off: []
- cooldown: 12
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -6, heat: +10, fraud_score: +3 }
- length_eligibility: [long]
- chain_weight: 1.3

A Substacker named Margins published 14,000 words about [FOUNDER]. The piece footnotes everything. Footnote 47 is a screenshot from a Slack channel that should not have screenshots leaving it. *Subscribe and comment, ignore, or threaten legal action that will only Streisand it?*

---

## EVT-FB-014 — "Twitter beef with a bigger founder"
- tags: [founder_behavior, subtweet, #peer_network, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [peer_beef_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER, PEER_FOUNDER]
- effects: { reputation: -2, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[FOUNDER] started beefing on Twitter with [PEER_FOUNDER], whose company is 14x bigger and whose pinned tweet has more likes than [FOUNDER]'s entire account. The replies are taking sides. *Escalate, deescalate with a self-deprecating tweet, or DM-truce?*

---

## EVT-FB-015 — "Marc Andreessen blocked you"
- tags: [founder_behavior, #real_name, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [andreessen_blocked_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, valuation: -3, heat: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

Marc Andreessen blocked [FOUNDER] on Twitter after [FOUNDER] reply-guyed too hard on five separate posts in one week. The screenshot is being passed around the group chats. *Tweet through it, DM another a16z partner, or take a week off?*

---

## EVT-FB-016 — "Paul Graham subtweet"
- tags: [founder_behavior, subtweet, #real_name, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [pg_subtweet_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

Paul Graham tweeted: "the founders who succeed are the ones who don't [the exact thing [FOUNDER] just did]." The tweet does not name [FOUNDER]. Everyone knows. The replies all know. *Reply with an essay, sub-quote with humility, or vanish for a week?*

---

## EVT-FB-017 — "Joe Rogan, ivermectin, opinions"
- tags: [founder_behavior, joe_rogan, podcast, #real_name, #vibes_off, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [joe_rogan_loaded_seed, lawyer_alarmed_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -5, heat: +10, fraud_score: +2, morale: -3 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

[FOUNDER] went on Joe Rogan. [FOUNDER] now has opinions about ivermectin, the moon landings, and "what they don't tell you about the FDA." The clip-out is at 1.4M views. *Issue a clarification, double down on Twitter, or accept that the podcast is now [FOUNDER]'s personality?*

---

## EVT-FB-018 — "Lex Fridman, four hours, physics"
- tags: [founder_behavior, lex_fridman, podcast, #real_name, #cult_of_personality, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: [lex_loaded_seed]
- prereqs_any: []
- plants: [lex_episode_aired_seed]
- pays_off: [lex_loaded_seed]
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, heat: +4, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The Lex Fridman episode aired. Four hours and seventeen minutes. [FOUNDER] said the words "consciousness," "field," and "love" 47 times combined. The clip being passed around is the seven-second pause after Lex asked what an electron is. *Pin the clip ironically, ignore, or post a follow-up explainer thread?*

---

## EVT-FB-019 — "The cofounder won't return your texts"
- tags: [founder_behavior, cofounder, #hr_problem, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [cofounder_disgruntled_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER, CTO]
- effects: { morale: -3, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[CTO] hasn't responded to [FOUNDER]'s texts in 11 days. Their last message ended in a period. They were last seen having coffee with a Bloomberg reporter. *Send another text, escalate via the board, or assume the worst?*

---

## EVT-FB-020 — "Reply-guy too hard at the wrong VC"
- tags: [founder_behavior, subtweet, #vibes_off, #real_name, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [vc_grudge_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, valuation: -1 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[FOUNDER] reply-guyed a Tier-1 partner's tweet at 1:47am with the words "respectfully, this is wrong." The partner has 340k followers. The partner is the lead on your next round. *Delete and hope, double down with a thread, or DM an apology?*

---

## EVT-FB-021 — "TED talk loaded shell"
- tags: [founder_behavior, profile, #cult_of_personality, sev_M, len_long, craze_normal]
- severity: M
- prereqs: [ted_talk_loaded_seed]
- prereqs_any: []
- plants: [ted_talk_aired_seed]
- pays_off: [ted_talk_loaded_seed]
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +3, heat: +5, fraud_score: +2 }
- length_eligibility: [long]
- chain_weight: 1.2

[FOUNDER]'s TED talk goes live. The title is "On Building." The standing ovation is 22 seconds long. By Tuesday, three threads have appeared dissecting the slide where the chart's y-axis was unlabeled. *Pin the standing-O clip, address the y-axis discourse, or stay silent?*

---

## EVT-FB-022 — "Open letter and the ratio"
- tags: [founder_behavior, medium_post, linkedin_post, #cult_of_personality, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: [open_letter_loaded_seed]
- prereqs_any: []
- plants: [ratio_archived_seed]
- pays_off: [open_letter_loaded_seed]
- cooldown: 4
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { reputation: -4, heat: +6, morale: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

[FOUNDER] published the open letter. It is 2,400 words and contains the phrase "the arena" twice. The ratio is 50:1. [PARODY_ACCOUNT] has already screencapped the worst sentence and the screenshot is doing 80k likes. *Delete, edit and re-post, or stand by every word?*

---

## EVT-FB-023 — "Founder started reading Yarvin"
- tags: [founder_behavior, #vibes_off, yarvin, rationalist, #cult_of_personality, sev_M, len_medium, len_long, craze_crazy]
- severity: M
- prereqs: []
- prereqs_any: [goodreads_archived_seed, ayn_rand_loaded_seed]
- plants: [yarvin_pilled_seed, peer_circle_seed, glassdoor_brigade_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -4, morale: -4, heat: +5, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[FOUNDER] has started using the word "sovereign" in Slack. Three of [FOUNDER]'s liked tweets this week were Curtis Yarvin retweets. The team Notion has a new doc titled "Some Thoughts on Governance" that nobody is allowed to comment on, only react to. The first emoji is a crown. *Agent must choose: [stage an intervention via the board] / [post the doc publicly, claim "open intellectual project"] / [ignore it, watch [CHIEF_OF_STAFF] start using "patchwork" unironically].*

---

## EVT-FB-024 — "Founder quote-tweeted himself from 2014"
- tags: [founder_behavior, old_tweet, #cult_of_personality, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [old_tweet_archive_seed, twitter_dunk_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { reputation: -2, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

[FOUNDER] quote-tweeted their own 2014 tweet ("just shipped my first side project, lfg") with the caption "11 years later, the lesson holds." [PARODY_ACCOUNT] immediately quote-tweets the QT with another 2014 [FOUNDER] tweet that is racist in a way that requires no context. The 2014 tweet is now also trending. *Agent must choose: [delete both tweets, hope the screenshots fade] / [apologize for the 2014 one, keep the 2025 one pinned] / [delete the 2025 one, leave the 2014 one up as a "show I've grown" move].*

---

## EVT-FB-025 — "Burning Man spiritual awakening, 4am DMs"
- tags: [founder_behavior, burning_man, #vibes_off, #cult_of_personality, sev_M, len_medium, len_long, craze_crazy]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [founder_unhinged_seed, lawyer_alarmed_seed, salon_loaded_seed, meditation_retreat_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER, TIER1_VC_PARTNER]
- effects: { reputation: -3, morale: -3, heat: +5, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[FOUNDER] returns from Burning Man with a "spiritual awakening" and starts DMing investors at 4am. The DM that's circulating is a 600-word stream-of-consciousness to [TIER1_VC_PARTNER] that ends "the playa is the real product market." [TIER1_VC_PARTNER] screenshots and forwards to two other partners. *Agent must choose: [issue a "founder is recharging" statement, mute [FOUNDER]'s phone] / [lean into it, post a thread about "presence-led leadership"] / [check [FOUNDER] into a 30-day silence retreat, hope the round closes first].*

---

## EVT-FB-026 — "Ratio'd by your own intern"
- tags: [founder_behavior, intern, subtweet, tiktok_leak, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [intern_revolt_seed, glassdoor_brigade_seed, twitter_dunk_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER, INTERN_NAME]
- effects: { reputation: -3, morale: -2, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.1

[FOUNDER] subtweeted "kids these days don't want to work." [INTERN_NAME], an unpaid summer intern at [COMPANY], replied: "i make $0/hr at your company and you've never spoken to me." The reply does 80k likes. The subtweet does 1,400. [INTERN_NAME] is suddenly tech-Twitter-famous. *Agent must choose: [hire [INTERN_NAME] full-time at $200k, pin the reply ironically] / [terminate [INTERN_NAME], deal with the Glassdoor brigade] / [DM [INTERN_NAME] a long apology, watch them screenshot it].*

---

## EVT-FB-027 — "UFC podcast appearance"
- tags: [founder_behavior, podcast, ufc_podcast, mma, #vibes_off, sev_M, len_medium, len_long, craze_crazy]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [ufc_podcast_seed, lawyer_alarmed_seed, joe_rogan_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +6, fraud_score: +1, morale: -2 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[FOUNDER] goes on a UFC fighter's podcast for two hours. Topics covered: ayahuasca, "the energetics of capital allocation," and a 14-minute monologue about why "fighters and founders are the same." A specific clip about "the cuck regulators" hits 8M views on TikTok. The board has, separately, called an emergency meeting. *Agent must choose: [post a clarification about "metaphor"] / [double down with a Substack post] / [delete the appearance from all platforms, lawyer up about edit rights].*

---

## EVT-FB-028 — "Jet Bracelet Twitter beef"
- tags: [founder_behavior, subtweet, founder_behavior, peer_circle, #peer_network, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [peer_circle_seed]
- plants: [peer_beef_loaded_seed, twitter_dunk_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, PEER_FOUNDER]
- effects: { reputation: -3, heat: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[FOUNDER] and [PEER_FOUNDER] are beefing on Twitter about whose private aviation choice is more "first principles." [FOUNDER] flies NetJets. [PEER_FOUNDER] just bought a fractional Gulfstream. The thread devolves into a screenshot war of fuel-burn calculations. The replies are unanimously calling for both companies to be shorted. *Agent must choose: [delete every tweet, claim the account was "accessed"] / [pivot to a thread about "team culture matters more than jet class"] / [escalate, post the actual hourly rate].*

---

## EVT-FB-029 — "Founder appeared on a UFC podcast and said the C-word about regulators"
- tags: [founder_behavior, podcast, lawyer_alarmed_seed, #vibes_off, sev_L, len_medium, len_long, craze_crazy]
- severity: L
- prereqs: [ufc_podcast_seed]
- prereqs_any: []
- plants: [ftc_aware_seed, regulator_aware_seed, podcast_legal_review_seed, board_pressure_seed]
- pays_off: [ufc_podcast_seed]
- cooldown: 3
- slots: [COMPANY, FOUNDER, REGULATOR]
- effects: { reputation: -7, heat: +12, fraud_score: +3, fbi_awareness: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

The clip surfaces. [FOUNDER] on the UFC podcast, three drinks in: "honestly the [REGULATOR] commissioners are a bunch of [unprintable]." Twitter is screenshotting. The [REGULATOR] press office has, on background, called the clip "noted." [FOUNDER]'s outside counsel has used the phrase "spectacularly inadvisable" in a 9-line email. *Agent must choose: [issue a video apology directly to [REGULATOR]] / [refuse to apologize, double down] / [have a board member apologize on [FOUNDER]'s behalf without consent].*

---

## EVT-FB-030 — "Founder DM'd a journalist 'do you know who I am'"
- tags: [founder_behavior, leak, #press_exposure, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [forbes_profile_circling_seed, bloomberg_circling_seed, journalist_circling_seed]
- plants: [journalist_circling_seed, screenshot_loaded_seed, slack_dm_screenshot_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, JOURNALIST_TECH]
- effects: { reputation: -5, heat: +7, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

[FOUNDER] DMed [JOURNALIST_TECH] at 1:14am: "do you know who i am? my LP base could buy your publication twice." [JOURNALIST_TECH] screenshots, posts publicly with the caption "guess." 200k likes by morning. The DM contains a typo where "publication" is spelled "publcation." *Agent must choose: [issue an apology] / [claim the account was hacked] / [stand by it, post that "the press has gotten too comfortable"].*
