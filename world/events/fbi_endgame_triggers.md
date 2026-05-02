# Events — FBI / Endgame Triggers

Category code: `FE`. See `../schemas.md` for record format. See `../tags.md` for tag vocabulary.

---

## EVT-FE-001 — "Federal agent calling employees"
- tags: [fbi, doj, whistleblower, endgame, #regulator_aware, #fraud_heavy, craze_normal, len_medium, len_long, len_endgame_only]
- severity: L
- prereqs: [fbi_aware_seed]
- prereqs_any: [whistleblower_seed, eng_disgruntled_seed, cofounder_disgruntled_seed]
- plants: [fbi_active_investigation_seed, lawyer_burning_seed]
- pays_off: [fbi_aware_seed]
- cooldown: 10
- slots: [COMPANY, FOUNDER, AGENT_NAME, LAWYER]
- effects: { fbi_awareness: +25, fraud_score: +8, reputation: -10, heat: +20, valuation: -20, morale: -20, cash: -3, headcount: -1, revenue: 0, burn: +1 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

Three employees got the same call: "This is Special Agent [AGENT_NAME] with the FBI, do you have a minute to talk about [COMPANY]?" The eng manager forwarded the voicemail to the all-hands Slack before [LAWYER] could intercept. Two of the calls were from a 415 number. One was from DC.

Notes: chain economy event. Requires `fbi_aware_seed` already planted, plus an OR-list of disgruntled-class seeds.

---

## EVT-FE-002 — "6am raid, footage on Twitter"
- tags: [fbi, raid, endgame, arrest, #fraud_heavy, #press_exposure, craze_crazy, len_short, len_medium, len_long, len_endgame_only]
- severity: XL
- prereqs: [fbi_active_investigation_seed]
- prereqs_any: [unencrypted_spreadsheet_seed, revenue_rounded_up_seed, channel_stuffing_seed]
- plants: [raid_seed, evidence_seized_seed, press_circling_seed]
- pays_off: [fbi_active_investigation_seed]
- cooldown: 15
- slots: [COMPANY, FOUNDER, JOURNALIST_TECH]
- effects: { fbi_awareness: +35, fraud_score: +20, reputation: -30, heat: +40, valuation: -50, morale: -25, cash: -10, headcount: 0, revenue: -5, burn: 0 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.5

6:14am. 11 agents. Windbreakers. [FOUNDER]'s Ring footage uploaded itself to the cloud and a neighbor's parody account already has it. [JOURNALIST_TECH] tweeted "lol" with the link 8 minutes after the door came off. The agents took 4 laptops, 11 phones, and a Pelican case labeled "OFFSITE BACKUP."

Notes: signature short-mode endgame. Pays off `fbi_active_investigation_seed` and lights up the press cycle.

---

## EVT-FE-003 — "SDNY grand jury convened"
- tags: [doj, fbi, indictment, endgame, #fraud_heavy, #regulator_aware, craze_normal, len_medium, len_long, len_endgame_only]
- severity: XL
- prereqs: [fbi_active_investigation_seed]
- prereqs_any: [revenue_rounded_up_seed, channel_stuffing_seed, phantom_ar_seed]
- plants: [grand_jury_seed, indictment_imminent_seed]
- pays_off: []
- cooldown: 12
- slots: [COMPANY, FOUNDER, LAWYER]
- effects: { fbi_awareness: +30, fraud_score: +10, reputation: -20, heat: +30, valuation: -35, morale: -20, cash: -8, headcount: -2, revenue: 0, burn: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

A grand jury convened in the Southern District of New York. The docket entry is sealed. [LAWYER] heard from a former colleague at SDNY. [LAWYER] has stopped using your name in emails and started using "the client." [FOUNDER]'s passport has been "noted" at the FBI's request, which is not the same as "flagged," [LAWYER] keeps emphasizing.

---

## EVT-FE-004 — "Preet Bharara is tweeting"
- tags: [press, doj, endgame, #real_name, #parody_safe, #press_exposure, craze_normal, len_medium, len_long, len_endgame_only]
- severity: M
- prereqs: []
- prereqs_any: [grand_jury_seed, indictment_imminent_seed, raid_seed]
- plants: [bharara_circling_seed, press_circling_seed]
- pays_off: []
- cooldown: 7
- slots: [COMPANY, FOUNDER, BHARARA_PARODY]
- effects: { reputation: -10, heat: +20, fbi_awareness: +5, valuation: -10, fraud_score: +3, cash: 0, morale: -5, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.1

[BHARARA_PARODY] tweeted: "Watching the [COMPANY] situation closely. Reminds me of a case from '14." He's not even at SDNY anymore. The tweet has 14K likes. The replies are screenshots of his old wins, lined up in a thread. [BHARARA_PARODY] subtweets are a leading indicator.

Notes: real-name reaction event. Generate via parody-account variant. Defamation safe — quoting public stance only.

---

## EVT-FE-005 — "Cooperating witness wearing a wire"
- tags: [fbi, cooperator, endgame, #fraud_heavy, craze_normal, len_medium, len_long, len_endgame_only]
- severity: L
- prereqs: [fbi_active_investigation_seed]
- prereqs_any: [eng_disgruntled_seed, cofounder_disgruntled_seed, peer_network_entanglement_seed]
- plants: [cooperator_active_seed, paranoia_seed]
- pays_off: []
- cooldown: 9
- slots: [COMPANY, FOUNDER]
- effects: { fbi_awareness: +20, fraud_score: +10, reputation: -5, heat: +15, valuation: -15, morale: -15, cash: 0, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.3

[LAWYER] used the phrase "the assumption you should be operating under" in a sentence ending with "is wired." Someone in the last six months of dinners is. [FOUNDER] has stopped saying anything specific within 30 feet of another human. The Signal disappearing-message setting is now 5 minutes.

---

## EVT-FE-006 — "Lawyer resigns 4 days before indictment"
- tags: [legal, endgame, indictment, #fraud_heavy, craze_normal, len_medium, len_long, len_endgame_only]
- severity: L
- prereqs: []
- prereqs_any: [grand_jury_seed, indictment_imminent_seed, lawyer_burning_seed]
- plants: [lawyer_gone_seed, indictment_imminent_seed]
- pays_off: [lawyer_burning_seed]
- cooldown: 8
- slots: [COMPANY, FOUNDER, LAWYER]
- effects: { fbi_awareness: +10, fraud_score: +6, reputation: -8, heat: +18, valuation: -20, cash: -15, morale: -12, headcount: 0, revenue: 0, burn: +3 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

[LAWYER] sent a one-paragraph email at 11:48pm citing "personal circumstances." [LAWYER]'s firm has scrubbed [COMPANY] from their representative-clients page. The 6-K replacement-counsel filing is going to be Sullivan & Cromwell or Quinn Emanuel — neither is cheap. The trial date hasn't even been set.

---

## EVT-FE-007 — "Non-extradition decision, 14 hours"
- tags: [endgame, flight_risk, #fraud_heavy, craze_crazy, len_medium, len_long, len_endgame_only]
- severity: XL
- prereqs: [indictment_imminent_seed]
- prereqs_any: [grand_jury_seed, raid_seed]
- plants: [flight_risk_seed]
- pays_off: []
- cooldown: 15
- slots: [COMPANY, FOUNDER]
- effects: { fbi_awareness: +20, fraud_score: +15, reputation: -25, heat: +35, valuation: -40, cash: -25, morale: -20, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

A "consultant" your college roommate vouched for sent a one-line email: "wheels up Cabo, 14 hours, do not pack the laptop, do not call your wife from the airport." [FOUNDER]'s passport is at home. The travel ban hasn't dropped yet. There's a non-extradition list. [FOUNDER] has fourteen hours to decide what kind of life this is.

Notes: gates the FLED endgame archetype.

---

## EVT-FE-008 — "Laptop seized, the spreadsheet is on it"
- tags: [fbi, raid, endgame, #fraud_heavy, craze_normal, len_medium, len_long, len_endgame_only]
- severity: XL
- prereqs: [raid_seed, unencrypted_spreadsheet_seed]
- prereqs_any: []
- plants: [evidence_seized_seed, indictment_imminent_seed]
- pays_off: [unencrypted_spreadsheet_seed]
- cooldown: 12
- slots: [COMPANY, FOUNDER, CFO]
- effects: { fbi_awareness: +30, fraud_score: +25, reputation: -15, heat: +25, valuation: -30, cash: 0, morale: -15, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

The seized laptop is [FOUNDER]'s personal Mac. The desktop has a folder called "real stuff." Inside the folder: real_numbers_DO_NOT_SHARE.xlsx, last opened 9 days ago. FileVault was disabled in 2022 because it was "annoying for screen-sharing." The forensic image will be cited by exhibit number for the rest of [FOUNDER]'s life.

Notes: signature payoff event. Requires both `raid_seed` AND `unencrypted_spreadsheet_seed`.

---

## EVT-FE-009 — "Superseding indictment, 14 new charges"
- tags: [doj, indictment, superseding, endgame, #fraud_heavy, craze_normal, len_long, len_endgame_only]
- severity: XL
- prereqs: [indictment_imminent_seed]
- prereqs_any: [cooperator_active_seed, evidence_seized_seed]
- plants: [superseding_indictment_seed]
- pays_off: [indictment_imminent_seed]
- cooldown: 10
- slots: [COMPANY, FOUNDER, LAWYER]
- effects: { fbi_awareness: +15, fraud_score: +12, reputation: -15, heat: +25, valuation: -25, cash: -20, morale: -15, headcount: 0, revenue: 0, burn: +4 }
- length_eligibility: [long]
- chain_weight: 1.4

The superseder adds 14 new counts. Wire fraud (4), securities fraud (3), conspiracy (1), false statements (4), obstruction (2). Each count carries 5-20 years. The DOJ press release uses [FOUNDER]'s middle name. The middle name appears nowhere in any company document. Someone gave it to them.

---

## EVT-FE-010 — "Co-founder flipped, you read it on the docket"
- tags: [doj, cooperator, cofounder, endgame, #fraud_heavy, craze_normal, len_medium, len_long, len_endgame_only]
- severity: XL
- prereqs: [cofounder_disgruntled_seed]
- prereqs_any: [grand_jury_seed, fbi_active_investigation_seed]
- plants: [cofounder_flipped_seed, indictment_imminent_seed]
- pays_off: [cofounder_disgruntled_seed]
- cooldown: 12
- slots: [COMPANY, FOUNDER, CTO]
- effects: { fbi_awareness: +25, fraud_score: +18, reputation: -20, heat: +30, valuation: -35, morale: -25, cash: -5, headcount: -1, revenue: 0, burn: 0 }
- length_eligibility: [medium, long]
- chain_weight: 1.5

PACER alert at 4:11pm: "United States v. [CTO], plea agreement, document 47." [CTO] pleaded to one count of conspiracy. The plea agreement has a cooperation paragraph. Paragraph 14, subsection (b). Subsection (b) is "all individuals associated with [COMPANY], known and unknown." [FOUNDER] finds out from a Bloomberg push notification.

Notes: canonical `cofounder_flipped_seed` planter. This is the moment.

---

## EVT-FE-011 — "SEC subpoenas the co-founder about revenue rec"
- tags: [sec, regulatory, deposition, endgame, #fraud_heavy, #regulator_aware, craze_normal, len_long, len_endgame_only]
- severity: L
- prereqs: [sec_aware_seed, revenue_rounded_up_seed, cofounder_disgruntled_seed]
- prereqs_any: []
- plants: [sec_enforcement_seed, deposition_pending_seed]
- pays_off: [sec_aware_seed]
- cooldown: 9
- slots: [COMPANY, FOUNDER, CTO, CFO]
- effects: { fbi_awareness: +18, fraud_score: +10, reputation: -10, heat: +18, valuation: -22, cash: -8, morale: -10, headcount: 0, revenue: 0, burn: +1 }
- length_eligibility: [long]
- chain_weight: 1.5

The SEC's enforcement division served [CTO] with a subpoena duces tecum. They want every email, every Slack DM, every text mentioning revenue, contracts, "the number," or "Q4." [CTO] has been collecting receipts since the second board meeting they were excluded from. [CTO]'s lawyer is, separately, very good.

Notes: triple-prereq chain economy event. Pays off the multi-stage fraud arc.

---

## EVT-FE-012 — "Senate hearing scheduled"
- tags: [doj, sec, press, endgame, #real_name, #parody_safe, #press_exposure, craze_normal, len_long, len_endgame_only]
- severity: L
- prereqs: [indictment_imminent_seed]
- prereqs_any: [superseding_indictment_seed, cofounder_flipped_seed]
- plants: [senate_hearing_seed, press_circling_seed]
- pays_off: []
- cooldown: 10
- slots: [COMPANY, FOUNDER, SENATOR_PARODY]
- effects: { reputation: -15, heat: +30, fbi_awareness: +10, valuation: -15, fraud_score: +5, cash: -10, morale: -8, headcount: 0, revenue: 0, burn: +2 }
- length_eligibility: [long]
- chain_weight: 1.2

Senate Banking subcommittee, 10am Tuesday. [SENATOR_PARODY]'s staff prepped 47 questions. The first three are about [FOUNDER]'s 2021 podcast appearance where they said "compliance is a creativity tax." The clip is queued. C-SPAN is the only press [FOUNDER]'s communications team can't manage.

Notes: real-name reaction-only via parody. The senator is the Greek-chorus stand-in.

---

## EVT-FE-013 — "FTC + state AG joint action"
- tags: [ftc, state_ag, regulatory, endgame, #regulator_aware, #fraud_heavy, craze_normal, len_medium, len_long, len_endgame_only]
- severity: L
- prereqs: []
- prereqs_any: [sec_aware_seed, channel_stuffing_seed, agi_claim_seed]
- plants: [ftc_action_seed, state_ag_action_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER, REGULATOR]
- effects: { fbi_awareness: +12, fraud_score: +8, reputation: -10, heat: +15, valuation: -18, cash: -12, morale: -8, headcount: 0, revenue: -3, burn: +2 }
- length_eligibility: [medium, long]
- chain_weight: 1.2

The FTC and the [REGULATOR] from New York filed a joint complaint about deceptive AI claims. Count one cites your blog post by paragraph. Count two cites your launch tweet by URL. Count three cites a Twitter Space [FOUNDER] did at 1am where they said the model was "indistinguishable from human intelligence in every measurable way."

---

## EVT-FE-014 — "Pardon discussion, off-the-record"
- tags: [endgame, doj, #real_name, #parody_safe, craze_unhinged, len_long, len_endgame_only]
- severity: XL
- prereqs: [superseding_indictment_seed]
- prereqs_any: [senate_hearing_seed, flight_risk_seed]
- plants: [pardon_arc_seed]
- pays_off: []
- cooldown: 15
- slots: [COMPANY, FOUNDER, POLITICAL_FIXER_PARODY]
- effects: { reputation: +5, heat: +25, fbi_awareness: +10, valuation: -10, fraud_score: +5, cash: -50, morale: +5, headcount: 0, revenue: 0, burn: 0 }
- length_eligibility: [long]
- chain_weight: 1.3

A consultant who only takes meetings at the Hay-Adams sat down with [FOUNDER]'s remaining lawyer. The retainer is $5M up front. The deliverable is "a conversation with the right people about the list." The list is the pardon list. There is a list. Whether [FOUNDER] gets on the list depends on whether [FOUNDER] has, in the consultant's phrasing, "a story we can tell."

Notes: gates the FAILUP / GOTAWAY endgame. Long-only, unhinged-band-friendly.

---

## EVT-FE-015 — "DOJ presser, the cooperator's face is on C-SPAN"
- tags: [doj, fbi, cooperator, press, c_span, endgame, #fraud_heavy, #press_exposure, craze_normal, len_long, len_endgame_only]
- severity: XL
- prereqs: [cooperator_active_seed]
- prereqs_any: [grand_jury_seed, indictment_imminent_seed]
- plants: [press_circling_seed, paranoia_seed, cooperator_outed_seed]
- pays_off: [cooperator_active_seed]
- cooldown: 6
- slots: [COMPANY, FOUNDER, CTO, AUSA_NAME]
- effects: { fbi_awareness: +20, fraud_score: +10, reputation: -15, heat: +25, valuation: -25_000_000, morale: -15 }
- length_eligibility: [long]
- chain_weight: 1.5

[AUSA_NAME] holds a press conference. They thank "a cooperating witness whose substantial assistance led to today's charges." The cooperator is in the room — the C-SPAN camera pans, the cooperator realizes mid-pan that they are on the feed, ducks. By the time their lawyer texts "DON'T LOOK UP" the clip is on Twitter. The cooperator's identity, by quitting time, is known. *Agent must choose: [no comment, accept the leverage shift] / [issue a statement that "the cooperator's accusations are unverified"] / [DM the cooperator privately offering a "side conversation"].*

---

## EVT-FE-016 — "Wiretap transcript leaks to The Information"
- tags: [fbi, wiretap, leak, endgame, #fraud_heavy, #press_exposure, craze_normal, len_long, len_endgame_only]
- severity: XL
- prereqs: []
- prereqs_any: [cooperator_active_seed, fbi_active_investigation_seed]
- plants: [wiretap_loaded_seed, press_circling_seed, indictment_imminent_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER, JOURNALIST_TECH]
- effects: { fbi_awareness: +18, fraud_score: +14, reputation: -22, heat: +28, valuation: -35_000_000, morale: -12 }
- length_eligibility: [long]
- chain_weight: 1.4

The Information publishes a partial wiretap transcript from a Title III intercept of [FOUNDER]'s personal cell. The transcript is 47 pages. Page 14 has [FOUNDER] saying "the SEC can suck a dick" to a board observer. Page 31 has [FOUNDER] negotiating a Q3 round-trip. The transcript was filed under seal; somebody unsealed it. *Agent must choose: [issue a "doctored transcript" denial] / [no comment, full document hold] / [hold a press conference to "contextualize" individual quotes].*

---

## EVT-FE-017 — "Bail hearing, prosecutor reads the tweets out loud"
- tags: [doj, bail, press, c_span, endgame, #fraud_heavy, craze_normal, len_long, len_endgame_only]
- severity: XL
- prereqs: [indictment_imminent_seed]
- prereqs_any: [superseding_indictment_seed]
- plants: [bail_conditions_seed, press_circling_seed, old_tweet_viral_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER, AUSA_NAME]
- effects: { fbi_awareness: +12, fraud_score: +8, reputation: -25, heat: +30, cash: -2_000_000, valuation: -15_000_000 }
- length_eligibility: [long]
- chain_weight: 1.5

At the bail hearing, [AUSA_NAME] reads thirty-four of [FOUNDER]'s tweets aloud as evidence of flight risk. The judge has not heard of "based" before. The court reporter spells "looksmaxxing" three different ways. [FOUNDER]'s mother is in the gallery. The bail is set at $25M, passport surrendered, monitored. *Agent must choose: [sell two properties to make bail] / [post bail via a friendly LP, structure the loan] / [decline bail terms, fight pretrial detention].*

---

## EVT-FE-018 — "Asset forfeiture seizes the podcast network"
- tags: [doj, forfeiture, endgame, podcast, #fraud_heavy, craze_crazy, len_long, len_endgame_only]
- severity: L
- prereqs: [indictment_imminent_seed]
- prereqs_any: [evidence_seized_seed, raid_seed]
- plants: [forfeiture_seed, asset_freeze_seed]
- pays_off: []
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { cash: -8_000_000, fraud_score: +6, heat: +12, reputation: -8, valuation: -10_000_000 }
- length_eligibility: [long]
- chain_weight: 1.3

The DOJ files an asset-forfeiture motion targeting (a) [FOUNDER]'s personal residence, (b) the Atherton car collection, (c) the Aspen ski-in, and (d) the small podcast network [FOUNDER] founded as a "media platform for builders." The podcast network has 14 shows and four active hosts. The hosts find out from the docket. *Agent must choose: [fight every asset on innocent-owner grounds] / [voluntarily surrender the residence to keep the podcasts] / [transfer the podcast network to a sibling 12 hours before the motion files].*

---

## EVT-FE-019 — "FBI raid leaked to TMZ first"
- tags: [fbi, raid, leak, press, endgame, #fraud_heavy, #press_exposure, craze_crazy, len_short, len_medium, len_long, len_endgame_only]
- severity: XL
- prereqs: [fbi_active_investigation_seed]
- prereqs_any: []
- plants: [raid_seed, press_circling_seed, evidence_seized_seed]
- pays_off: [fbi_active_investigation_seed]
- cooldown: 10
- slots: [COMPANY, FOUNDER]
- effects: { fbi_awareness: +30, fraud_score: +15, reputation: -25, heat: +35, valuation: -45_000_000, morale: -20 }
- length_eligibility: [short, medium, long]
- chain_weight: 1.5

TMZ posts a photo of [FOUNDER] in pajamas, mid-yawn, with eight FBI agents behind them. The photo is 14 minutes old. The headline is "EXCLUSIVE: TECH CEO RAIDED IN ATHERTON, BARELY AWAKE." Bloomberg confirms the raid 90 minutes later. The agents are still in the house when the TMZ link drops. *Agent must choose: [refuse to comment to TMZ, watch the photo become canonical] / [release a "more flattering" photo of the same morning] / [sue TMZ for the photo source, watch the source emerge as a neighbor's Ring camera].*

---

## EVT-FE-020 — "Plea hearing on Zoom, the cat walks through"
- tags: [doj, indictment, endgame, #fraud_heavy, craze_unhinged, len_long, len_endgame_only]
- severity: L
- prereqs: [indictment_imminent_seed]
- prereqs_any: [superseding_indictment_seed]
- plants: [plea_entered_seed, press_circling_seed]
- pays_off: [indictment_imminent_seed]
- cooldown: 6
- slots: [COMPANY, FOUNDER]
- effects: { fbi_awareness: +5, fraud_score: +5, reputation: -10, heat: +14, cash: -3_000_000 }
- length_eligibility: [long]
- chain_weight: 1.3

The plea hearing is on Zoom because the courthouse HVAC is broken. [FOUNDER] is in their kitchen, suit jacket over a t-shirt the camera doesn't quite hide. A cat walks across the laptop. The judge says "could you please remove the cat." The clip is on every late-night show by Wednesday. The plea — three counts, capped at 7 years — is entered with the cat still meowing offscreen. *Agent must choose: [issue a humanizing thread about "the cat is named Latency"] / [no comment, the cat works in your favor] / [request the hearing be redone in person to scrub the clip].*

---

## EVT-FE-021 — "Sentencing memo footnotes the Tulum shaman"
- tags: [doj, indictment, sentencing, endgame, #fraud_heavy, craze_normal, len_long, len_endgame_only]
- severity: L
- prereqs: []
- prereqs_any: [superseding_indictment_seed, plea_entered_seed]
- plants: [sentencing_memo_seed, press_circling_seed]
- pays_off: []
- cooldown: 5
- slots: [COMPANY, FOUNDER, AUSA_NAME]
- effects: { fbi_awareness: +5, fraud_score: +3, reputation: -8, heat: +10 }
- length_eligibility: [long]
- chain_weight: 1.2

[AUSA_NAME]'s 84-page sentencing memo argues the upward variance. Footnote 47 references the Tulum shaman invoice. Footnote 51 references the "ceremony catalysts" line item. Footnote 73 references a 2022 Slack message where [FOUNDER] wrote "we are basically running a Ponzi but Slack-pilled." The memo recommends 14 years. *Agent must choose: [submit a defense memo emphasizing "youthful entrepreneurial idealism"] / [write a personal letter to the judge, in lowercase] / [request a continuance, hope the judge retires].*

---

## EVT-FE-022 — "Perp walk, the suit is from Express"
- tags: [doj, fbi, perp_walk, press, endgame, #fraud_heavy, #press_exposure, craze_normal, len_medium, len_long, len_endgame_only]
- severity: XL
- prereqs: [indictment_imminent_seed]
- prereqs_any: [grand_jury_seed]
- plants: [press_circling_seed, perp_walk_aired_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER, JOURNALIST_TECH]
- effects: { fbi_awareness: +10, fraud_score: +5, reputation: -18, heat: +25, valuation: -20_000_000, morale: -8 }
- length_eligibility: [medium, long]
- chain_weight: 1.4

The perp walk is broadcast live. [FOUNDER]'s suit is from Express — a fashion forensics account on Twitter clocks it within 30 seconds. The cuffs are zip-tied because the federal building doesn't issue metal cuffs for non-violent. [FOUNDER]'s expression on the still photo will be on Wikipedia for the rest of [FOUNDER]'s life. *Agent must choose: [smile during the walk, hope it reads as confidence] / [look at the ground, accept the photo] / [speak directly to the press, watch the lawyer wince offscreen].*

---

## EVT-FE-023 — "Bahamas yacht warrant"
- tags: [fbi, flight_risk, yacht, international_waters, endgame, #fraud_heavy, craze_unhinged, len_long, len_endgame_only]
- severity: XL
- prereqs: [flight_risk_seed]
- prereqs_any: []
- plants: [warrant_arrest_seed, international_complications_seed]
- pays_off: []
- cooldown: 8
- slots: [COMPANY, FOUNDER]
- effects: { fbi_awareness: +25, fraud_score: +10, reputation: -20, heat: +25, cash: -5_000_000 }
- length_eligibility: [long]
- chain_weight: 1.4

[FOUNDER] is on a chartered yacht in international waters when the warrant unseals. The captain has been instructed to remain >12nm offshore. The Coast Guard is, technically, not the FBI. The State Department is, technically, on the phone. The yacht has Starlink. *Agent must choose: [stay at sea indefinitely, ride out a storm front] / [dock at a non-extradition port (Bahamas, the wrong direction)] / [sail back, surrender, frame it as "honoring the process"].*
