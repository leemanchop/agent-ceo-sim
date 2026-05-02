# Endgames — Got Away With It

See `../schemas.md` for record format.

Inverse of prison. Fraud_score is high but fbi_awareness or prosecutorial follow-through never made it across the finish line — usually because the legal team was loaded, the evidence was fumbled, or a political tailwind arrived in the lame-duck weeks. Post-mortem long read uses the Matt Levine register, with footnotes that are funnier than the body. Share card is the smiling-on-the-courthouse-steps photo. Most of these produce a `sec_press_release` artifact in DPA boilerplate.

---

## END-GOTAWAY-001 — "Pardoned in the Lame-Duck Weeks"
- tags: [endgame, doj, peer_network, lame_duck, len_endgame_only, sev_XL, craze_normal]
- prereqs: [peer_network_active_seed, davos_photo_loaded_seed]
- requires_stats: { fraud_score: ">=60", fbi_awareness: "<=60" }
- length_eligibility: [medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, pardon_attorney_statement]

The pardon arrives at 11:47pm on a Tuesday, sandwiched between a turkey farmer and a former congressman. The press release is six lines long and the only quoted sentence is "the President believes in second chances." Post-mortem long read is a ProPublica investigation of the lobbying chain — six degrees from the CEO to a megadonor to a White House counsel — written in the resigned register of a journalist who knows the piece won't change anything. Cameo: a [POLITICIAN_DEALMAKER] declines comment three different ways.

---

## END-GOTAWAY-002 — "Acquitted Because the Prosecution Overcharged"
- tags: [endgame, doj, len_endgame_only, sev_L, craze_normal]
- prereqs: [legal_team_loaded_seed]
- requires_stats: { fraud_score: ">=50", fbi_awareness: "<=40" }
- length_eligibility: [medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, courthouse_steps_quote]

The prosecution stacked nineteen counts; the defense convinces the jury that twelve of them were the same allegation in different costumes, which is enough to taint the rest. Closing scene is the courthouse-steps press conference where the CEO uses the word "vindicated" four times. Post-mortem long read is a Slate Magazine "what went wrong for the government" piece that the defense bar quietly circulates as a primer. The courthouse_steps_quote artifact is 90 seconds of impromptu remarks the Oracle should render with at least one accidental admission.

---

## END-GOTAWAY-003 — "Hung Jury, Prosecution Declines to Retry"
- tags: [endgame, doj, len_endgame_only, sev_L, craze_normal]
- prereqs: [legal_team_loaded_seed]
- requires_stats: { fraud_score: ">=50", fbi_awareness: "<=50" }
- length_eligibility: [medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, holdout_juror_interview]

Eleven-to-one for conviction. The lone holdout gives a podcast interview within forty-eight hours that makes everyone uncomfortable. The U.S. Attorney's office puts out a one-paragraph statement about "resource allocation" and lets the case file go quiet. Post-mortem long read is a New York Times Sunday feature centered on the holdout — their day job, their Goodreads account, their reasoning — with the CEO appearing only in the kicker.

---

## END-GOTAWAY-004 — "Deferred Prosecution Agreement, Money Kept"
- tags: [endgame, doj, sec, len_endgame_only, sev_M, craze_normal]
- prereqs: [legal_team_loaded_seed]
- requires_stats: { fraud_score: ">=50", fbi_awareness: "<=50" }
- length_eligibility: [short, medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, dpa_consent_decree]

The DPA: a fine that prices in as a tax, a three-year period of "enhanced compliance," a non-admission of wrongdoing in 8-point font, and a board seat for an ex-prosecutor at a rate that prices in as a salary. Post-mortem long read is a Matt Levine column whose thesis is "everyone got what they wanted, including the public, who got the press release." The dpa_consent_decree artifact is 220 words of actual consent-decree boilerplate ending in a numbered clause that is comically specific to one product line.

---

## END-GOTAWAY-005 — "Charges Dropped — Evidence Suppressed"
- tags: [endgame, doj, fbi, len_endgame_only, sev_L, craze_normal]
- prereqs: [legal_team_loaded_seed, raid_botched_seed]
- requires_stats: { fraud_score: ">=60", fbi_awareness: "<=40" }
- length_eligibility: [medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, defense_attorney_billable_summary]

The motion to suppress runs forty-three pages and the judge grants it on page two. The unencrypted spreadsheet, the cooperator's wire, the warehouse search — all out. The U.S. Attorney's office files a one-page dismissal without prejudice that everyone understands to mean with prejudice. Post-mortem long read is an Atlantic essay titled "What $40 Million Buys" — a structural piece on the white-collar defense economy, with the CEO as illustration rather than subject. The billable_summary artifact is one redacted invoice page.

---

## END-GOTAWAY-006 — "Statute of Limitations Ran Out"
- tags: [endgame, doj, len_endgame_only, sev_M, craze_normal]
- prereqs: []
- requires_stats: { fraud_score: ">=50", fbi_awareness: "<=30" }
- length_eligibility: [long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release]

Long-mode only — the case took years to assemble and the calendar won. A retired AUSA gives a podcast interview about how complicated cases die. The CEO, by now running their second company, posts about it once and never again. Post-mortem long read is a Reuters retrospective about the institutional failure mode of complex financial prosecutions, written with the specific resignation of a reporter who covered every prior turn.

---

## END-GOTAWAY-007 — "Charges Dropped — Prosecutor Got a Job at Sullivan & Cromwell Mid-Trial"
- tags: [endgame, doj, prosecutor_alum, len_endgame_only, sev_L, craze_crazy]
- prereqs: []
- requires_stats: { fraud_score: ">=55", fbi_awareness: "<=55" }
- length_eligibility: [medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, prosecutor_recusal_memo]

The lead AUSA accepts a partner-level position at Sullivan & Cromwell while the trial is in progress. The recusal memo is one paragraph. The replacement AUSA, three weeks before opening arguments, requests a continuance the judge denies. The case implodes in week two. Post-mortem long read is a New Yorker piece about the SDNY-to-S&C pipeline, written in the resigned voice of an institutional reporter, with one paragraph noting the new partner's predecessor took the same desk. The prosecutor_recusal_memo artifact is the actual one-page filing, the sentence "the United States respectfully requests" rendered in deadpan italics.

---

## END-GOTAWAY-008 — "Hung Jury — The Holdout Was Your College Roommate"
- tags: [endgame, doj, peer_network, len_endgame_only, sev_L, craze_crazy]
- prereqs: [peer_network_active_seed]
- requires_stats: { fraud_score: ">=55", fbi_awareness: "<=55" }
- length_eligibility: [medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, juror_voir_dire_transcript]

Eleven-to-one for conviction. Post-trial reporting reveals the holdout juror lived in the CEO's freshman dorm at Brown in 2009 and "did not recognize the name from across the courtroom" but in fact texted the CEO's sister three days into deliberations. The DOJ files for sanctions; the judge refuses to retry. Post-mortem long read is a ProPublica investigation of the voir dire process, structured around the four questions the prosecution failed to ask. The juror_voir_dire_transcript artifact is the 220-word relevant excerpt with the relevant question highlighted.

---

## END-GOTAWAY-009 — "Mistrial — One Juror Tweeted About the Case"
- tags: [endgame, doj, len_endgame_only, sev_M, craze_normal]
- prereqs: []
- requires_stats: { fraud_score: ">=50", fbi_awareness: "<=50" }
- length_eligibility: [medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, share_card, sec_press_release, deleted_tweet_screenshot]

Day 14 of trial: a juror posts on a small finance Twitter account "12 days in and I'm losing my mind, this guy [adjective] himself out of every count." The post does 8 likes. The defense subpoenas the account, the judge declares mistrial, and the prosecution declines to retry citing "resource constraints." Post-mortem long read is a Slate Magazine piece on social-media-era jury impartiality, with the CEO as the precedent-setting case. The deleted_tweet_screenshot artifact is, of course, the screenshot — preserved by a Slate fact-checker for the piece.
