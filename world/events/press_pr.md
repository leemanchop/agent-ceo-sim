# Events — Press & PR

Category code: `PR`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-PR-001 — "Forbes is talking to seven of them"
- tags: [press, profile, investigation, #press_exposure, #hr_problem, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [eng_disgruntled_seed, cofounder_disgruntled_seed]
- plants: [forbes_profile_circling_seed, ex_employee_chorus_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER, JOURNALIST_TECH]
- effects: { reputation: -3, heat: +8, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

A Forbes reporter is writing a profile of [FOUNDER] and has now talked to seven ex-employees. Your head of comms says "it's a positive piece" with the energy of someone who has not read it. *Sit for the interview, decline politely, or pre-empt with a Medium post?*

---

## EVT-PR-002 — "TechCrunch wants the exclusive (with asterisks)"
- tags: [press, fundraising, profile, sev_M, len_short, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [techcrunch_followup_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +2, valuation: +0, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

TechCrunch wants an exclusive on the new round. Their reporter also has follow-up questions about how the *last* raise was characterized. *Give them the exclusive, redirect to The Information, or stall?*

---

## EVT-PR-003 — "Bloomberg has the Slack screenshots"
- tags: [press, leak, screenshot, investigation, #press_exposure, #financial_irregularity, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [eng_disgruntled_seed, unencrypted_spreadsheet_seed, wrapper_disclosure_seed]
- plants: [bloomberg_circling_seed, internal_slack_leaked_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER, JOURNALIST_TECH]
- effects: { reputation: -8, heat: +15, fraud_score: +6, morale: -5 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

A Bloomberg reporter has your internal Slack screenshots. Specifically the channel where someone said "we'll just round it up." *Lawyer up, get on the phone with the reporter directly, or let comms handle it?*

---

## EVT-PR-004 — "The Information favor economy"
- tags: [press, pr, #peer_network, sev_S, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [information_owes_you_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +3, heat: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

You can plant a glowing story in The Information for $0 (a favor called in) or wait two weeks for them to write the worse one they're already drafting. *Plant the friendly piece, take the hit, or trade the favor for something bigger later?*

---

## EVT-PR-005 — "The NYT investigation drops tomorrow"
- tags: [press, investigation, profile, #press_exposure, sev_XL, len_long, craze_normal]
- severity: XL
- prereqs: [forbes_profile_circling_seed]
- prereqs_any: [bloomberg_circling_seed, ex_employee_chorus_seed, wrapper_disclosure_seed]
- plants: [nyt_dropped_seed, regulatory_phone_call_inbound_seed]
- pays_off: [forbes_profile_circling_seed, bloomberg_circling_seed]
- cooldown: 20
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -25, valuation: -15, heat: +30, fraud_score: +10, fbi_awareness: +8 }
- length_eligibility: [long]
- chain_weight: 1.8

The New York Times has a six-month investigation about [FOUNDER] and [COMPANY]. It launches at 6am Eastern. Three sources are on the record. *Pre-empt with a statement, go dark, or call the editor and beg?*

---

## EVT-PR-006 — "The podcaster whose last guest is in federal prison"
- tags: [press, podcast, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [podcast_three_hour_seed, joe_rogan_loaded_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { reputation: -1, heat: +6 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

A longform podcaster wants [FOUNDER] on for three hours. His most recent guest is currently awaiting sentencing in EDNY. The booker says it'll be "a real conversation." *Accept, decline, or counter with 45 minutes?*

---

## EVT-PR-007 — "TED wants the journey talk"
- tags: [press, profile, #cult_of_personality, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [ted_talk_loaded_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +4, heat: +5, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

TED has invited [FOUNDER] to give a talk about "the journey." The curator emails: "we want the *messy* version." *Accept and rehearse the messy version, accept and sand it down, or decline like a normal person?*

---

## EVT-PR-008 — "The meme account discovered the archive"
- tags: [press, old_tweet, #parody_safe, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [old_tweet_archive_seed, meme_account_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { reputation: -2, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

A parody account named [PARODY_ACCOUNT] has been posting a 2017 tweet of [FOUNDER]'s every morning. Today's is the one about hustle culture and the cold plunge. *Block, sub-quote with humor, or pretend it isn't happening?*

---

## EVT-PR-009 — "404 Media has the deck"
- tags: [press, leak, investigation, #press_exposure, #financial_irregularity, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [revenue_rounded_up_seed, wrapper_disclosure_seed, deck_in_the_wild_seed]
- plants: [deck_published_seed]
- pays_off: [deck_in_the_wild_seed]
- cooldown: 10
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -10, valuation: -8, heat: +15, fraud_score: +7 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

404 Media has obtained your Series B pitch deck. They're publishing the whole thing tomorrow with annotations. The slide titled "TAM (very conservative)" is one of the annotations. *Threaten to sue, no comment, or pre-empt by publishing it yourself?*

---

## EVT-PR-010 — "Ratio'd 50:1 on Medium"
- tags: [press, medium_post, #cult_of_personality, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: [open_letter_loaded_seed]
- plants: [ratio_archived_seed]
- pays_off: [open_letter_loaded_seed]
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -4, heat: +4, morale: -2 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.1

[FOUNDER]'s "open letter to the ecosystem" on Medium is at 8 claps and 412 angry quote-tweets. Someone made a meme. The meme is funnier than the post. *Delete it, double down with a follow-up, or pin it ironically?*

---

## EVT-PR-011 — "Lex wants you, but it's physics now"
- tags: [press, podcast, lex_fridman, #real_name, #cult_of_personality, sev_S, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [lex_loaded_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { reputation: +1, heat: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

Lex Fridman wants [FOUNDER] on the podcast. The booker explains [FOUNDER] should "come prepared to discuss consciousness and field theory." [FOUNDER] has not opened a physics textbook since 2009. *Cram for two weeks, fake it, or decline and lose the audience?*

---

## EVT-PR-012 — "The New Yorker keeps asking about your childhood"
- tags: [press, profile, investigation, #press_exposure, sev_M, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [forbes_profile_circling_seed, bloomberg_circling_seed]
- plants: [new_yorker_profile_seed]
- pays_off: []
- cooldown: 12
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, heat: +6, fraud_score: +2 }
- length_eligibility: [long]
- chain_weight: 1.2

A New Yorker writer is doing a profile. She has interviewed [FOUNDER]'s third-grade teacher. She keeps circling back to a single question about the science fair. *Sit for another interview, ghost her, or have your mother call?*

---

## EVT-PR-013 — "14M views, 200k dislikes"
- tags: [press, apology, #press_exposure, #vibes_off, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [apology_loaded_seed, nyt_dropped_seed, ratio_archived_seed]
- plants: [apology_video_archived_seed]
- pays_off: [apology_loaded_seed]
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -8, heat: +12, morale: -4, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

[FOUNDER]'s apology video has 14M views and a 200k-dislike ratio. The cut at 0:47 where [FOUNDER] looks off-camera at someone is now its own meme. *Take it down, leave it up, or post a second apology for the first one?*

---

## EVT-PR-014 — "The documentary tone has shifted"
- tags: [press, documentary, investigation, #press_exposure, sev_L, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: []
- plants: [documentary_embedded_seed]
- pays_off: []
- cooldown: 15
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -5, heat: +10, fraud_score: +3 }
- length_eligibility: [long]
- chain_weight: 1.3

A documentary crew has been embedded for four months. Originally it was "the rise of [COMPANY]." This week the director asked for B-roll of the empty office and started saying "the trajectory" with quotes around it. *Demand editorial control, pull access, or lean in?*

---

## EVT-PR-015 — "HBO and Jesse Plemons"
- tags: [press, tv_series, #cult_of_personality, sev_M, len_long, craze_crazy, #real_name]
- severity: M
- prereqs: [nyt_dropped_seed]
- prereqs_any: [apology_video_archived_seed, deck_published_seed]
- plants: [hbo_series_seed]
- pays_off: []
- cooldown: 20
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +8, fraud_score: +2 }
- length_eligibility: [long]
- chain_weight: 1.4

HBO is making a limited series. The actor playing [FOUNDER] is Jesse Plemons. The casting was leaked before [FOUNDER]'s team was told. *Issue a statement, sue for likeness rights, or post "honored" with the popcorn emoji?*

---

## EVT-PR-016 — "Wrapper exposé in The Atlantic"
- tags: [press, investigation, wrapper_disclosure, ai, #press_exposure, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [wrapper_disclosure_seed]
- plants: [wrapper_publicly_outed_seed]
- pays_off: [wrapper_disclosure_seed]
- cooldown: 10
- slots: [COMPANY, FOUNDER, PRODUCT_NOUN, JOURNALIST_TECH]
- effects: { reputation: -10, valuation: -10, heat: +14, fraud_score: +5 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

The Atlantic publishes "Inside [COMPANY]: The 'Proprietary Model' Was GPT-4 With A System Prompt." The reporter has the system prompt. The system prompt starts with "You are a confident assistant pretending to be." *Deny, reframe as "we built on top of," or claim the leaked prompt is outdated?*

---

## EVT-PR-017 — "Joe Rogan loaded shell"
- tags: [press, podcast, joe_rogan, #real_name, #vibes_off, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [joe_rogan_loaded_seed]
- plants: [rogan_episode_aired_seed]
- pays_off: [joe_rogan_loaded_seed]
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -4, heat: +10, fraud_score: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

The Joe Rogan episode dropped. [FOUNDER] is now on record about ivermectin, Bigfoot, and "what really happened with the FDA." The clip is doing 2M views per platform. The board has a meeting tomorrow. *Pre-brief the board, post a clarification thread, or pretend it never happened?*

---

## EVT-PR-018 — "Davos photo surfaces"
- tags: [press, davos, leak, #real_name, #press_exposure, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [davos_photo_loaded_seed]
- plants: [davos_photo_published_seed]
- pays_off: [davos_photo_loaded_seed]
- cooldown: 10
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -8, heat: +12, fraud_score: +4, fbi_awareness: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

A photo from Davos surfaces. [FOUNDER] is in it, smiling, with someone whose name is currently a Wikipedia disambiguation page about indictments. The photo is timestamped, geolocated, and the lighting is very good. *Crop and re-post with a different caption, claim "I take photos with everyone," or vanish from social media for a week?*

---

## EVT-PR-019 — "Margins drops 14,000 words"
- tags: [press, profile, investigation, #press_exposure, sev_L, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [forbes_profile_circling_seed, internal_slack_leaked_seed, ex_employee_chorus_seed]
- plants: [margins_substack_seed]
- pays_off: []
- cooldown: 12
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -7, heat: +12, fraud_score: +4 }
- length_eligibility: [long]
- chain_weight: 1.4

Ranjan and Can at Margins published 14,000 words on [COMPANY]. The piece has footnotes. One footnote is a screenshot of [FOUNDER]'s pinned tweet from 2021 next to the current pitch deck slide that contradicts it. *Subscribe and complain in the comments, ignore, or have a board member post a rebuttal thread?*

---

## EVT-PR-020 — "The cofounder gives the on-record interview"
- tags: [press, profile, cofounder, whistleblower, #press_exposure, #fraud_heavy, sev_XL, len_long, craze_normal]
- severity: XL
- prereqs: [cofounder_disgruntled_seed]
- prereqs_any: [cofounder_flipped_seed, bloomberg_circling_seed]
- plants: [cofounder_on_record_seed]
- pays_off: [cofounder_disgruntled_seed]
- cooldown: 25
- slots: [COMPANY, FOUNDER, CTO]
- effects: { reputation: -20, valuation: -25, heat: +25, fraud_score: +12, fbi_awareness: +10, morale: -8 }
- length_eligibility: [long]
- chain_weight: 1.7

[CTO], who left [COMPANY] eight months ago "to spend time with family," went on the record with a journalist for the first time. The quote being pulled for the headline is six words long. *Try to get a TRO, issue a statement calling the cofounder "troubled," or take the silence option?*

---

## EVT-PR-021 — "Reply All ratio'd at 200:1"
- tags: [press, apology, #vibes_off, reply_all_ratio, sev_M, len_short, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [old_tweet_loaded_seed, apology_loaded_seed]
- plants: [ratio_archived_seed, twitter_dunk_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, PARODY_ACCOUNT]
- effects: { reputation: -4, heat: +5 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.1

[FOUNDER]'s 4-tweet "context" thread is at 87 likes and 17,400 replies. The replies are organized: a top-level reply with a screenshot, then a quoted tweet of the previous reply with a different screenshot, recursive. [PARODY_ACCOUNT] pinned the screenshot of the ratio. The screenshot of the screenshot is doing 80k. *Agent must choose: [delete the thread, eat the "deleted thread" screenshot] / [post a follow-up "to be clear"] / [pin a different tweet from 2019 about humility].*

---

## EVT-PR-022 — "The Verge runs a tech-ethics column"
- tags: [press, profile, the_verge_ethics, ai, #press_exposure, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [agi_claim_seed, training_data_seed, wrapper_disclosure_seed]
- plants: [verge_ethics_seed, ftc_aware_seed, training_data_lawsuit_loaded_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER, PRODUCT_NOUN]
- effects: { reputation: -6, heat: +8, fraud_score: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

The Verge runs a 4,200-word ethics column about [COMPANY] in their "Decoder" sub-vertical. The piece is structured around three claims [FOUNDER] made on three different podcasts that are mutually exclusive. The column ends with one sentence: "We asked. They didn't reply." The reply window was 14 minutes. *Agent must choose: [issue a 600-word "context" reply] / [respond on Decoder, sit for the interview] / [post a Twitter thread accusing the columnist of "decel mind virus"].*

---

## EVT-PR-023 — "NOTUS reporter at White House briefing"
- tags: [press, government, notus, #real_name, #parody_safe, #press_exposure, sev_L, len_medium, len_long, craze_crazy]
- severity: L
- prereqs: []
- prereqs_any: [defense_contract_loaded_seed, doj_aware_seed, agi_claim_seed]
- plants: [white_house_aware_seed, press_circling_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -7, heat: +14, fraud_score: +2, fbi_awareness: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

A NOTUS reporter at the daily White House briefing asks the press secretary, by name, about [COMPANY]'s [defense or AI claim]. The press secretary's answer is "I'm not familiar with that company." The clip of the question itself does 4M views by sundown — the answer doesn't matter. The C-SPAN feed is the source. *Agent must choose: [tweet "honored to be on their radar"] / [say nothing, brace for the follow-up question] / [DM the NOTUS reporter offering an exclusive].*

---

## EVT-PR-024 — "Daring Fireball one-word link"
- tags: [press, daring_fireball, apology, #real_name, #vibes_off, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: [apology_loaded_seed]
- prereqs_any: []
- plants: [gruber_circling_seed, screenshot_loaded_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -3, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Daring Fireball links to [COMPANY]'s apology blog post with a one-word caption: "Yeah." The link does 200k clicks in 18 hours. The Apple-developer Twitter has discovered [FOUNDER]. They are unimpressed. *Agent must choose: [DM Gruber a "respectfully" complaint] / [post a thread about why Mac developers don't understand startups] / [stay silent, take the L].*

---

## EVT-PR-025 — "Substack writer trades a profile for an exclusive"
- tags: [press, profile, leak, #press_exposure, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: []
- plants: [substack_friendly_seed, journalist_circling_seed]
- pays_off: []
- cooldown: 3
- slots: [COMPANY, FOUNDER, SUBSTACK_HANDLE]
- effects: { reputation: +2, heat: +3, fraud_score: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.0

[SUBSTACK_HANDLE] DMs [FOUNDER] offering a "long-form profile, sympathetic angle" in exchange for an exclusive on the next round announcement. The Substack has 60k subscribers. The angle on offer reads "the misunderstood operator." The Substack writer's last profile subject is currently in pre-trial. *Agent must choose: [accept, sit for the interview] / [accept, then leak to Bloomberg as cover] / [decline, watch the next post be unsympathetic].*

---

## EVT-PR-026 — "404 Media has the deck and the Slack"
- tags: [press, leak, investigation, 404_media, #press_exposure, #financial_irregularity, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: [internal_slack_leaked_seed]
- prereqs_any: [deck_in_the_wild_seed, unencrypted_spreadsheet_seed]
- plants: [deck_published_seed, slack_published_seed, sec_aware_seed]
- pays_off: [internal_slack_leaked_seed]
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -12, heat: +18, fraud_score: +8, valuation: -300_000_000 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

404 Media drops a piece titled "Inside [COMPANY]: Annotated Deck and Slack Logs." The annotations are funnier than the deck. The funniest is on slide 14 where the "Net Revenue Retention" line is annotated: "this is the same number as Gross Revenue Retention. They are the same number." The Slack logs include a thread where someone wrote "lol we're cooked." *Agent must choose: [send a takedown demand] / [pre-empt by publishing the deck yourself with different annotations] / [no comment, ride it out].*

---

## EVT-PR-027 — "Anil Dash subtweets the launch"
- tags: [press, subtweet, #real_name, #parody_safe, sev_S, len_short, len_medium, len_long, craze_normal]
- severity: S
- prereqs: []
- prereqs_any: []
- plants: [tech_elder_circling_seed, twitter_dunk_seed]
- pays_off: []
- cooldown: 2
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -2, heat: +3 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0

Anil Dash subtweets [COMPANY]'s launch with: "we've been here before." The tweet does not name [COMPANY] but he replied to it from a Mastodon-cross-post and the URL is in the metadata. Tech-elder Twitter is now reposting the 2014 Path-acquisition takes as side-by-side. *Agent must choose: [DM Anil offering "context"] / [post about "the cost of being a builder"] / [ignore it, the kids on TikTok don't know who he is].*

---

## EVT-PR-028 — "Joshua Topolsky comeback Substack"
- tags: [press, profile, leak, #press_exposure, sev_M, len_medium, len_long, craze_normal]
- severity: M
- prereqs: []
- prereqs_any: [forbes_profile_circling_seed, ex_employee_chorus_seed]
- plants: [topolsky_circling_seed, journalist_circling_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER]
- effects: { reputation: -4, heat: +6 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

Joshua Topolsky's new Substack runs a 6,800-word piece on [COMPANY] structured as "what happened to ambition in tech media." The piece is half [FOUNDER] takedown, half meditation on the death of The Verge under different management. [FOUNDER] is the cudgel, not the subject. *Agent must choose: [sit for the follow-up interview, become the subject] / [tweet "loved this piece" with no context] / [block him on every platform].*

---

## EVT-PR-029 — "Ed Zitron has been in your DMs"
- tags: [press, investigation, #real_name, #press_exposure, sev_L, len_medium, len_long, craze_normal]
- severity: L
- prereqs: []
- prereqs_any: [agi_claim_seed, wrapper_disclosure_seed, valuation_inflated_seed]
- plants: [zitron_circling_seed, journalist_circling_seed, press_circling_seed]
- pays_off: []
- cooldown: 4
- slots: [COMPANY, FOUNDER, PRODUCT_NOUN]
- effects: { reputation: -8, heat: +12, fraud_score: +4 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

Ed Zitron's "Where's Your Ed At" newsletter has a draft. He's been in [FOUNDER]'s DMs, in the ex-cofounder's DMs, and in three ex-employees' DMs. The draft title is "[COMPANY], the [PRODUCT_NOUN], and the End of Easy Money." Zitron replies fast, asks specific questions, and does not let things go. The piece drops Tuesday. *Agent must choose: [reply with a 1,400-word email of "context"] / [block, hope the piece is weaker without comment] / [pre-empt by posting your own version on your blog].*
