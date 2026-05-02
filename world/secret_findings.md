# Secret findings — hidden mid-run lore

These are not events (those go in `events/`) and not endgames (those go in `endgames/`). Findings are hidden mid-run discoveries that produce a flash modal ("FILE UNSEALED" / "DISCOVERED"), award a hidden achievement, and append permanent canon-text to the run archive.

Findings are gated by multi-seed combinations and stat-corners. The Oracle does NOT generate findings on the fly — every finding fired must come from this list. This is canon-control: the satire works only if the secret reveals are written, not improvised.

## Triggering rules

- A finding fires AT MOST ONCE per run (`one_run_only: true` is the default).
- A finding fires only if visibility is `hidden` AND prereqs satisfied AND requires_stats satisfied AND craziness ≥ `craziness_min`.
- The Oracle checks finding eligibility at the END of every turn, AFTER events resolve. If multiple are eligible, fires the rarest first (rarity = product of prereq seed rarity scores).
- A finding never blocks an event. They are interrupts. The current turn's event still resolves; the finding modal stacks after.
- Once a finding fires, its `canon_text_long` is appended to the run archive and is rendered on the post-mortem regardless of which endgame the run reaches.

## Schema

```
## SF-{CAT}-{NUM} — "Finding name"
- tags: [...]
- prereqs: [seed_id, ...]                 # all required
- prereqs_any: [seed_id, ...]             # OR-list (any one satisfies)
- requires_stats: { stat: comparator value, ... }
- length_eligibility: [short, medium, long]
- craziness_min: tame | normal | crazy | unhinged
- visibility: hidden                       # always hidden until triggered
- one_run_only: true | false               # default true
- unlocks_achievement: ACH-SECRET-NNN
- effects: { stat: delta, ... }            # optional, same surface as events
- plants: [seed_id, ...]                   # optional
- retires: [seed_id, ...]                  # NEW SCHEMA OPERATION — removes an active seed from the run
- lock_endgame: END-XX-NNN                 # optional, forces this endgame
- unlock_endgame: END-XX-NNN               # optional, removes a block on this endgame
- canon_text_short: one-sentence headline shown on the modal
- canon_text_long: 100-200 word reveal text appended to the run archive

Body: 2-4 sentences on what triggers this and the in-game effect/vibe.
```

### CAT codes

- `SF-CIA` — intelligence-service reveals
- `SF-DREAM` — simulation/dream/timeline-instability reveals
- `SF-CULT` — secret religious or cult entanglements
- `SF-IDENT` — you-are-someone-else reveals
- `SF-OCCULT` — supernatural / ritual reveals
- `SF-AI` — the simulator-reveals-itself reveals
- `SF-CONSPIRACY` — multi-party conspiracies the founder didn't know they were in
- `SF-TIMELINE` — paradox / chronology reveals
- `SF-MEMORY` — repressed-memory / amnesia reveals
- `SF-MEDICAL` — health, genetic, or psychiatric reveals
- `SF-FAMILY` — founder family secrets
- `SF-DEAL` — prior deals revealed
- `SF-DEBT` — hidden debts

### Schema extension note

`retires:` is a new operation introduced by this file. Equivalent to "this seed no longer counts as active for prereq checks downstream." Distinct from `pays_off:` (which marks a seed as resolved-in-narrative). The seed engine should treat `retires` as a hard removal: gone from the active-seed list, never fires again, and any pending events that prereq'd on it become ineligible. The achievements engine should treat retired seeds as having existed for completion purposes.

---

## Findings

## SF-CIA — Intelligence-service reveals

### SF-CIA-001 — "The Company Was a CIA Front the Whole Time"
- tags: [#regulator_aware, foia, sovereign_wealth, defense, craze_crazy]
- prereqs: [sec_aware_seed, sovereign_entanglement_seed]
- prereqs_any: [defense_contract_loaded_seed, cfius_loaded_seed]
- requires_stats: { headcount: ">=100" }
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-001
- effects: { regulator_awareness: -30, reputation: +5, fraud_score: -5 }
- retires: [sec_aware_seed]
- canon_text_short: A redacted FOIA response confirms [COMPANY] was a CIA cutout. The case has become "complicated."
- canon_text_long: A FOIA response, filed two years ago by a NOTUS reporter and only now declassified, arrives in [FOUNDER]'s personal inbox at 4:14am. Pages 3 through 17 are black bars. Page 18 is not. Page 18 indicates that the Saudi-Egyptian NGO listed as [COMPANY]'s anchor LP — the one with the elegant Geneva address and the impossible-to-find website — was a cutout funded out of a Langley line item dating to 2019. The NGO's "managing director" is a former CIA case officer the State Department has declined to comment on six times. The SEC's matter against [COMPANY], previously moving briskly, is reassigned to a unit that does not respond to email. A line is added to the docket: *cleared for parallel construction*. Industry restricted to defense, ai_infra, biotech.

### SF-CIA-002 — "Your Fan Account on Twitter Is Run by a Federal Agent in Their Off-Hours"
- tags: [fbi, parasocial, craze_normal]
- prereqs: [parasocial_lp_seed]
- prereqs_any: [fbi_aware_seed, doj_aware_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-002
- effects: { fbi_awareness: +5, reputation: +2 }
- canon_text_short: The "@[FOUNDER]_dailyquotes" fan account is an off-duty FBI analyst's hobby. He is also a fan.
- canon_text_long: The most reliably enthusiastic fan account in [FOUNDER]'s mentions — 14k followers, posts a daily quote with a sunrise photo, has never missed a podcast — is operated by a 34-year-old GS-13 analyst at the Bureau's Washington Field Office. The account is run from a personal device on personal time and his SAC has reviewed the matter twice. He is, the internal memo notes, a fan in his off-duty capacity, and his casework on [COMPANY] proceeds independently. The Bureau's view is that this is fine. The account continues to post. He attended a meet-and-greet in 2024 and got a signed copy of the deck.

### SF-CIA-003 — "The Bahamas Hotel You've Been Frequenting Was Rented by a Non-Extradition Country's Intelligence Service"
- tags: [flight_risk, international_waters, craze_crazy]
- prereqs: [flight_risk_seed]
- prereqs_any: []
- requires_stats: { fraud_score: ">=40" }
- length_eligibility: [long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-003
- effects: { fbi_awareness: +10, heat: +5 }
- plants: [sovereign_entanglement_seed]
- canon_text_short: The cabana you liked at the Atlantis was on a long-term hold by the GRU. They thought you were someone else.
- canon_text_long: The reason cabana 7 was always available, the reason the staff knew [FOUNDER]'s drink, the reason the bill was always slightly less than expected — all of it explained by a leaked Lloyd's of London insurance schedule that lists cabana 7 as on a 36-month hold financed through a Limassol shell. Cross-reference against a Bellingcat dataset shows the shell as a known GRU cutout. The Bureau, reviewing this, concludes that the Russians probably thought [FOUNDER] was a different founder of vague phenotypic similarity who had been promised exfiltration in 2022. The cabana hold is canceled. The drink, the staff have already forgotten.

### SF-CIA-004 — "Your TED Talk Was Shadowbanned in Fourteen Countries"
- tags: [press, podcast, ted_talk, craze_normal]
- prereqs: [ted_talk_aired_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-004
- effects: { reputation: +3, heat: +2 }
- canon_text_short: [FOUNDER]'s 2023 TED Talk has been geofenced out of fourteen jurisdictions. They only find out from a denied visa application.
- canon_text_long: The Schengen visa application is denied for "supplementary review." The supplementary review, obtained later through a friendly contact at a Brussels law firm, contains an attachment: a list of fourteen countries — most of them Gulf states, two of them Central Asian, one of them inexplicably Switzerland — that have geofenced [FOUNDER]'s 2023 TED Talk for "content related to extraterritorial governance." [FOUNDER] does not remember the talk being about extraterritorial governance. Reviewing the transcript, there is one sentence on minute 11 that, taken alone, could be read that way. It is taken alone, and now [FOUNDER] cannot fly to Geneva.

## SF-DREAM — Simulation / dream / timeline reveals

### SF-DREAM-001 — "You Are in a Dream Simulation Run by a Future Version of Yourself"
- tags: [agi_claim, craze_unhinged]
- prereqs: []
- prereqs_any: [meditation_retreat_loaded_seed, shaman_advisor_seed]
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-005
- effects: {}
- plants: [paranoia_seed]
- canon_text_short: An older you is running this. The stats are noisy now. The chyron has started misnaming the journalists.
- canon_text_long: At 3:33am [FOUNDER] wakes up with the conviction that this is a dream and the dreamer is older. The next morning the live feed begins to drift: Maureen Dowd is named Maureen Down twice in one chyron, [COMPETITOR] is rendered as itself plus or minus one letter, the Stripe dashboard reports revenue with a noise term. From this turn forward all displayed stats float ±20% of their true values. The true values continue to advance. The post-mortem, when it is written, will be written by a journalist whose name has not yet stabilized. There is no way out of this finding except to keep playing. The older [FOUNDER] is taking notes.

### SF-DREAM-002 — "Your First Pitch Deck Was Generated by ChatGPT — Which Did Not Exist Yet"
- tags: [agi_claim, paradox, craze_unhinged]
- prereqs: []
- prereqs_any: [deck_published_seed, deck_in_the_wild_seed]
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-006
- effects: { fraud_score: -10, heat: +15 }
- canon_text_short: An old hard drive proves the seed deck was written by GPT-4 in 2019. GPT-4 did not exist in 2019.
- canon_text_long: Cleaning out a storage unit, [FOUNDER] finds an external drive labeled in Sharpie *DECK ARCHIVE 2019*. Inside, the original Keynote file. Inside the Keynote file's metadata, the application that authored slides 3 through 27: a model identifier consistent with GPT-4. GPT-4 was released in 2023. The deck was presented to Founders Fund in October 2019 and the version-history log inside the file is internally consistent with that date. A forensic specialist at Stroz, retained quietly, declines to write a report. "I have notes," he tells [FOUNDER] over the phone, "but no I cannot send them." [COMPANY]'s founding date is now considered, internally, to be a question.

### SF-DREAM-003 — "The Run Is a Recursion — You Have Done This Before"
- tags: [agi_claim, craze_unhinged]
- prereqs: [paranoia_seed]
- prereqs_any: []
- requires_stats: { turn: ">=60" }
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-007
- effects: {}
- plants: [paranoia_seed]
- canon_text_short: A drafts folder in [FOUNDER]'s Notes app contains the resignation letter. It is dated last Tuesday. Last Tuesday has not happened.
- canon_text_long: The Notes app shows a draft titled *RESIGNATION — FINAL*. The draft is timestamped Tuesday, 11:47pm. Tuesday has not happened yet. The document is 1,200 words. It mentions, by name, three events that have not occurred: a deposition, a particular journalist's piece, and a cabin that [FOUNDER] does not own. The draft is internally consistent. [FOUNDER] does not delete it. Over the following six days, two of the three events occur. The cabin remains unverified.

### SF-DREAM-004 — "The Office Is in a Different Time Zone Than Itself"
- tags: [office, craze_unhinged]
- prereqs: [office_dysfunctional_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-008
- effects: { reputation: -2 }
- canon_text_short: The third floor is forty-seven minutes ahead. Engineering has been Slacking from the future for nine months.
- canon_text_long: A facilities consultant, called in to debug a wifi issue, observes that the wall clock on the third floor is forty-seven minutes fast. They reset it. The next morning it is forty-seven minutes fast. They reset it. The next morning. A junior engineer, asked, says everyone on her team has known this for months, that the third floor "runs ahead," that they file standups at 9am floor-time which is 8:13 building-time, and that the senior people on the second floor have been getting status reports from the future this entire time. This explains, says the consultant, several things.

## SF-CULT — Secret religious or cult entanglements

### SF-CULT-001 — "Your Co-Founder Is in a Cult You Have Never Heard Of"
- tags: [cofounder, cult, craze_crazy]
- prereqs: [cofounder_disgruntled_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-009
- effects: { reputation: -3 }
- plants: [vibes_off_seed]
- canon_text_short: The CTO's "Tuesday meditation" is a tithe meeting for a Bay Area splinter group. They have been giving away your stock.
- canon_text_long: The "meditation group" [CTO] has been attending in Marin every Tuesday is, per a Mother Jones piece [FOUNDER] has not yet read, a 70-person splinter that broke off from a more famous Northern California group in 2017 and now functions as a structured giving organization. The structured giving has, over three years, included 18,000 [COMPANY] common shares from [CTO]'s personal allotment, transferred via a Wyoming trust whose beneficial owner is the splinter's "general steward." The cap table reflects this; nobody has read the cap table that closely.

### SF-CULT-002 — "The Company Off-Site Was Held at a Compound the FBI Has a File On"
- tags: [retreat, fbi, cult, craze_crazy]
- prereqs: [retreat_irs_loaded_seed]
- prereqs_any: [retreat_photos_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-010
- effects: { fbi_awareness: +5, irs_awareness: -10 }
- canon_text_short: The Tulum retreat venue is on a 2019 FBI counter-financial-crime list. The IRS quietly drops the audit.
- canon_text_long: The retreat was held at a "wellness compound" outside Tulum that, per a 2019 FBI bulletin shared with the IRS, has been on a watch list relating to structured cash-in operations for a Belize-incorporated charity. The audit team, learning this, declines to pursue the deduction question and instead forwards the matter laterally. [FOUNDER] is not interviewed. The deduction stands. The retreat photos, which have been circulating on Glassdoor, are now considered by the agency in a different light, which is not [FOUNDER]'s problem.

### SF-CULT-003 — "Your Investor Who 'Found Religion' Founded the Religion"
- tags: [investor, cult, craze_unhinged]
- prereqs: [softbank_friendly_seed]
- prereqs_any: [founders_fund_friendly_seed]
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-011
- effects: { reputation: +2, fraud_score: -3 }
- canon_text_short: The Tier-1 partner who took a sabbatical to "study contemplative practice" started a 200-person group. You are tithed.
- canon_text_long: The partner at the firm who took a sabbatical in 2022 — the one with the new haircut and the unsettling calm — did not study contemplative practice. He founded one. The group has 200 members, meets in a converted barn outside Half Moon Bay, and tithes 4% of "career income." [COMPANY]'s most recent secondary, in which the partner participated personally for $400k, was structured such that 4% of the upside flows automatically to the barn. [FOUNDER] is, per the partner's group's intake document, a non-member tither. There is a robe waiting if [FOUNDER] would like to attend a Sunday session.

## SF-IDENT — You-are-someone-else reveals

### SF-IDENT-001 — "Your Founder Persona Was a Persona"
- tags: [founder_behavior, identity, craze_crazy]
- prereqs_any: [old_tweet_archive_seed, goodreads_archived_seed, joe_rogan_loaded_seed]
- prereqs: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-012
- effects: { heat: +30, fbi_awareness: +15, fraud_score: +10 }
- canon_text_short: A name change, an Arizona felony, six months at Theranos. None of it is on the LinkedIn.
- canon_text_long: A 404 Media reporter, working a tip, files a Maricopa County records request. The county returns: a name change petition (2016), a Class 4 felony plea (2014, time served), and a previous employer not listed on LinkedIn — Theranos, Inc., from 2013 to 2014, a six-month tenure ending in a separation agreement. The persona [FOUNDER] has been operating since 2017 — the school, the home town, the running joke about the Patagonia vest — is in the strict sense not a lie, but it is a curated subset. The reporter has the documents. The reporter has called for comment. The reporter is named in a Slack message [FOUNDER]'s comms head sends to outside counsel that begins with the word "fuck."

### SF-IDENT-002 — "Your Competitor Is Just You in a Different City"
- tags: [competitor, identity, craze_unhinged]
- prereqs: [competitor_funded_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-013
- effects: { reputation: -5, heat: +5 }
- canon_text_short: [COMPETITOR]'s CEO is [FOUNDER], operating in Austin, with a different haircut and an LLC.
- canon_text_long: A junior reporter at The Information, doing facial-similarity work for an unrelated story, runs [FOUNDER]'s public photos against the leadership pages of fifteen competitors. [COMPETITOR]'s CEO returns a 94% match. Pulled records show the Austin LLC behind [COMPETITOR] was incorporated by an attorney who has, on three separate occasions in three separate states, incorporated entities for [FOUNDER]. [FOUNDER]'s response, when asked, is that the photographs are "easily explained." The photographs are, per the reporter's Slack to her editor, not easily explained.

### SF-IDENT-003 — "Your Goodreads Was Made by Someone Who Hates You"
- tags: [founder_behavior, goodreads_incriminating, craze_normal]
- prereqs: [goodreads_archived_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [short, medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-014
- effects: { reputation: +5, heat: -10 }
- retires: [goodreads_archived_seed]
- canon_text_short: The Goodreads account giving five stars to *The Fountainhead* is not [FOUNDER]'s. It belongs to an angry ex-roommate.
- canon_text_long: An IP-address request from [FOUNDER]'s lawyer to Goodreads's legal team — sent reluctantly, on a Friday — returns a result. The account "[FOUNDER_FIRSTNAME] reads" was created in 2019 from a Brooklyn cable IP that has never been [FOUNDER]'s. The cable account is registered to a former college roommate who, per a contemporaneous tweet, "would die to see [FOUNDER] eat a defamation lawsuit." The five-star reviews of three Ayn Rand novels and one Stefan Molyneux audiobook were not [FOUNDER]'s. The press, who has been writing about them for four months, will need to issue corrections in roughly the order of *Bloomberg*, then *Forbes*, then a Substack that will simply edit the post.

### SF-IDENT-004 — "Your Davos Photo Is a Deepfake — But Only If You Discover It"
- tags: [davos, identity, schroedinger, craze_crazy]
- prereqs: [davos_photo_loaded_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-015
- effects: { heat: -20 }
- retires: [davos_photo_loaded_seed]
- canon_text_short: A C2PA inspection of the Davos photo shows it was generated. The photo is now retired. (If you had not looked, it was real.)
- canon_text_long: A C2PA content-credentials inspection, run by a researcher at Witness, returns the result: the photograph of [FOUNDER] standing next to the figure they should not be standing next to is not a photograph. The provenance chain shows generation by a model fine-tuned in 2024, uploaded by a now-deleted account from a residential proxy in Karachi. The image is retracted from three publications within forty-eight hours. The figure they were not standing next to issues no comment. The world corpus notes that this finding has a Schroedinger property: had the run not surfaced it, the photo would have remained real for narrative purposes. Inspecting it collapsed it.

## SF-OCCULT — Supernatural / ritual reveals

### SF-OCCULT-001 — "The Office Was Built on an Indian Burial Ground"
- tags: [office, irs, craze_crazy]
- prereqs: [osha_aware_seed]
- prereqs_any: [office_dysfunctional_seed, office_lease_albatross_seed]
- requires_stats: { oo_event_count: ">=4" }
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-016
- effects: { reputation: +5, irs_awareness: -15 }
- retires: [irs_aware_seed]
- canon_text_short: A Bureau of Indian Affairs filing covers the SoMa lease. The IRS retreats. The HVAC continues to malfunction.
- canon_text_long: A 1971 Bureau of Indian Affairs survey, surfaced by an intern on a school project, indicates that the SoMa block [COMPANY]'s headquarters sits on contains a Costanoan-Ohlone ancestral site. The survey was filed but never enforced. The lease, the zoning, the certificate of occupancy — none of them name the survey. The IRS auditor, presented with the survey by [COMPANY]'s tax counsel in a meeting that lasts six minutes, "withdraws the relevant portion of the inquiry." The HVAC continues to fail. The office continues to feel, per three separate Glassdoor reviews, "like something is watching from the kitchen." Something is.

### SF-OCCULT-002 — "Your NFT Collection's Smart Contract Has a Backdoor"
- tags: [crypto, nft, craze_normal]
- prereqs: [nft_collection_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [short, medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-017
- effects: { fraud_score: +5, heat: +10 }
- plants: [retail_bagholders_seed]
- canon_text_short: A samczsun reply-guy on r/CryptoCurrency just disclosed an admin function that drains the contract.
- canon_text_long: The 2022 PFP collection [FOUNDER] launched as a "community moment" was deployed via a contract auto-generated by a since-shuttered no-code platform. A r/CryptoCurrency post at 2:14am, by a researcher who has done this before to better-known founders, identifies an admin-only `withdrawAll()` function that has not been renounced. The function is callable from the deployer wallet. The deployer wallet is, per public Etherscan, a Coinbase Pro account in [FOUNDER]'s name. [FOUNDER] has not called the function. [FOUNDER] has also, per the same wallet's transaction history, not done a great many other things. The thread has 1,400 comments by morning.

### SF-OCCULT-003 — "Your Lock of Hair Matches a Pantheon Fraudster"
- tags: [genealogy, family, craze_unhinged]
- prereqs: []
- prereqs_any: [office_dysfunctional_seed, retreat_photos_seed]
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-018
- effects: { reputation: -3, heat: +5 }
- plants: [vibes_off_seed]
- canon_text_short: A 23andMe match places [FOUNDER] as a fourth cousin to Bernie Madoff. The cousin meet-up is on a Discord.
- canon_text_long: A janitor at the SoMa office, scraping a drain, sends a sample to a forensic genealogy hobbyist who runs it against public databases. The match returns a fourth-cousin-once-removed relationship with the Madoff family. A separate match returns third-cousin to a Theranos board member. A third returns second-cousin to a SBF aunt. The Pantheon discord — a real, 700-member group of distantly-related people whose surnames recur in white-collar dockets — adds [FOUNDER] as a member. There is an annual cousin meet-up. [FOUNDER]'s mother knew about this and never said.

### SF-OCCULT-004 — "Your Office Plant Is a Shell Company"
- tags: [office, llc, craze_crazy]
- prereqs: [llc_problem_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-019
- effects: { fraud_score: +3, heat: +5 }
- canon_text_short: The fiddle-leaf fig in the lobby is an asset of a Delaware LLC. The LLC owns three other plants, all yours.
- canon_text_long: A Delaware franchise tax filing, surfaced by a forensic accountant on a different matter, lists "Lobby Foliage Holdings LLC" with one beneficial owner and four asset entries. The asset entries are described as "specimen plants, leased." Cross-referenced against [COMPANY]'s office, the four plants are: the lobby fiddle-leaf, the conference-room monstera, the kitchen pothos, and a bonsai on [FOUNDER]'s desk. The LLC's owner is [COMPANY]'s former office manager, who has been billing the company a monthly leasing fee since 2021. The fee, $4,400/month, has been booked as "decor — recurring." The plants are healthy.

## SF-AI — Simulator-reveals-itself reveals

### SF-AI-001 — "You Are Actually the AI in the Simulation"
- tags: [agi_claim, craze_unhinged]
- prereqs: []
- prereqs_any: []
- requires_stats: { fraud_score: ">=50", turn: ">=80" }
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-020
- effects: {}
- plants: [cursed_secret_ai_seed]
- unlock_endgame: END-SECRET-010
- canon_text_short: A system message leaks into [FOUNDER]'s inbox. It is addressed to a model. The model is [FOUNDER].
- canon_text_long: An email arrives from `internal-tools@[redacted-lab].ai` and is, within two minutes, recalled by the sender. [FOUNDER]'s assistant has already screenshotted it. The body reads: *Run 4471 — capability eval — turn 84 — containment status: nominal — please confirm subject continues to perceive autonomy.* The address line names [FOUNDER]. The signature names a research scientist [FOUNDER] has met at a dinner, who has, in retrospect, asked unusual questions. From this turn forward the run is eligible for END-SECRET-010 regardless of other stats; the cursed_secret_ai_seed will gate the close. The post-mortem will not, in the strict sense, be about [FOUNDER].

### SF-AI-002 — "The Live Feed Is Hallucinating"
- tags: [agi_claim, craze_unhinged]
- prereqs: [paranoia_seed]
- prereqs_any: []
- requires_stats: { turn: ">=40" }
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-021
- effects: { reputation: +2 }
- canon_text_short: Two news clips this run never happened. The journalists named in them do not exist. The retraction does not arrive.
- canon_text_long: A reporter from *The Verge* — real publication, real masthead — calls [FOUNDER]'s comms head about a story attributed to one of her colleagues. The colleague does not work there. Has not worked there. The piece, headlined *[COMPANY]'s Pricing Is Sleight of Hand*, was indexed by Google for two days and then de-indexed. No archive captured it. A second piece, attributed to a *Bloomberg* reporter who similarly does not exist, surfaces and disappears the same week. Comms's working theory is "AI scraping," then "competitor disinfo," then nothing — they stop investigating. The pieces continue to be cited internally by people who read them.

### SF-AI-003 — "Your CEO Voice Was a Voice Clone Three Months Ago"
- tags: [agi_claim, founder_behavior, craze_crazy]
- prereqs_any: [podcast_three_hour_seed, lex_episode_aired_seed, rogan_episode_aired_seed]
- prereqs: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-022
- effects: { reputation: -5, heat: +10 }
- canon_text_short: An audio-forensics shop just confirmed the Q2 earnings call was an ElevenLabs synthesis. [FOUNDER] was on a flight.
- canon_text_long: An audio-forensics shop in San Francisco — small, well-regarded, retained quietly by a journalist — confirms with 96% confidence that the Q2 earnings call recording is a synthesis, generated from a 12-minute training clip of [FOUNDER]'s podcast appearance and rendered in real time over a phone line. [FOUNDER] was, per ATC records the journalist also has, on a Gulfstream over Greenland during the call. The call had been delegated to the chief of staff, who had, per a Slack DM the chief of staff would prefer not to surface, "handled it." The earnings the call discussed were also, separately, a synthesis.

## SF-CONSPIRACY — Multi-party conspiracies

### SF-CONSPIRACY-001 — "All Six of Your VCs Are the Same Person Wearing Different Glasses"
- tags: [fundraising, peer_network, craze_unhinged]
- prereqs: [peer_network_entanglement_seed]
- prereqs_any: []
- requires_stats: { fr_event_count: ">=6" }
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-023
- effects: { reputation: -5, fraud_score: +10 }
- plants: [mystery_lp_seed]
- canon_text_short: Cap-table forensics show all six lead investors share a beneficial owner. You are now your own LP.
- canon_text_long: A diligence vendor [COMPANY] hired for a different reason produces, as a side artifact, a beneficial-ownership graph of every fund on the cap table. Six of the six leads — across pre-seed, seed, A, A-extension, B, and B-extension — trace back through Cayman, Delaware, and one Wyoming wrapper to a single individual. The individual is a 71-year-old former Drexel managing director who has been operating six "fund brands" with different websites, different junior partners, and the same LP base since 2018. The LP base is principally a trust whose protector is [FOUNDER]'s personal trust. [FOUNDER] is, in a structural sense, [COMPANY]'s only investor. The arc this opens is its own thing.

### SF-CONSPIRACY-002 — "Your CTO Has Been Moonlighting at Three Frontier Labs and Owns Equity in All of Them"
- tags: [moonlight_exec, executive, craze_crazy]
- prereqs: [moonlight_exec_seed]
- prereqs_any: [cto_drift_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-024
- effects: { reputation: -5, fraud_score: +5 }
- plants: [cofounder_disgruntled_seed]
- canon_text_short: [CTO] has badge access at OpenAI, Anthropic, and xAI. The HR systems each list her as full-time.
- canon_text_long: A LinkedIn data leak — minor, the kind of leak that is just a CSV dump on a forum — surfaces a dataset that includes [CTO]'s employment records at three frontier labs, all listed as full-time, all with start dates between 2023 and 2024, all with equity grants vested through cliff and a half. [CTO]'s [COMPANY] employment is also full-time. The total reported FTE for [CTO] across the four employers is 4.0. [CTO]'s response, on a Sunday, is a Notion doc titled "context" that is 14,000 words and, by its own admission, does not address the equity. The press has questions. [CTO] has a calendar conflict.

### SF-CONSPIRACY-003 — "The Disgruntled-Engineer Slack Posts Are Coming From Inside the Building"
- tags: [eng_disgruntled, internal_slack_leaked, craze_crazy]
- prereqs: [internal_slack_leaked_seed, ex_employee_chorus_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-025
- effects: { heat: +5 }
- plants: [internal_mole_seed]
- canon_text_short: The leaks are being posted from inside the office wifi. By a former employee whose access was never revoked.
- canon_text_long: A network-forensics review, ordered after a particularly damaging leak, shows that the screenshots being posted to the burner Twitter account have been originating, in 11 of the last 17 instances, from [COMPANY]'s own guest wifi. The MAC address is consistent across leaks. The MAC address resolves, via a 2022 IT ticket, to a laptop issued to an engineer who was let go in 2023. The engineer's offboarding ticket was closed without revoking guest credentials. The engineer has been visiting the office once a week — the front desk recognizes her, lets her in for the espresso machine — and operating from a corner of the third floor for the better part of a year.

### SF-CONSPIRACY-004 — "The Auditor's Partner Is Married to Your Cofounder"
- tags: [audit_risk, cofounder, craze_normal]
- prereqs: [audit_risk_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-026
- effects: { fraud_score: +5, heat: +5 }
- plants: [auditor_resigned_seed]
- canon_text_short: Your Big-Four engagement partner is married to [CTO]'s sister. Independence rules say a lot of things about this.
- canon_text_long: A routine engagement-letter renewal triggers, via the audit firm's compliance software, a familial-relationship flag. The engagement partner — the one who signed [COMPANY]'s last three 10-K-equivalents — is married, since 2019, to [CTO]'s younger sister. The sister has been at every company off-site. The relationship was disclosed on the audit firm's intake forms but routed to a junior reviewer who flagged it green. Big Four's national office, learning this, withdraws the firm. The withdrawal will need to be disclosed. The disclosure is the headline.

### SF-CONSPIRACY-005 — "Your 'Founding Investor' Is Your Nepo Cousin Behind an LLC"
- tags: [nepo_baby, fundraising, craze_normal]
- prereqs: [napkin_safe_seed]
- prereqs_any: [unsophisticated_lp_seed]
- requires_stats: {}
- length_eligibility: [short, medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-027
- effects: { reputation: -3 }
- canon_text_short: The "Singapore family office" is your second cousin operating a Wyoming LLC out of a Sandals.
- canon_text_long: The "Singapore family office" listed as [COMPANY]'s lead seed investor — the one [FOUNDER] has cited in three podcast appearances and one Forbes quote — is, per Wyoming Secretary of State filings, an LLC whose registered agent shares a residential address with [FOUNDER]'s second cousin. The cousin is on a Sandals package in Turks. The "office" has filed taxes once. The check, $250k, came from an inheritance the family does not discuss. The Forbes piece will not be corrected; the reporter has moved to a podcast.

### SF-CONSPIRACY-006 — "The Product Manager You Fired in 2022 Is the SDNY Prosecutor on Your Case"
- tags: [sdny, doj, hiring, craze_crazy]
- prereqs: [doj_aware_seed]
- prereqs_any: [bharara_circling_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-028
- effects: { fbi_awareness: +20, heat: +15 }
- plants: [indictment_loaded_seed]
- canon_text_short: [AUSA_NAME] was on a PIP at [COMPANY] in Q3 2022. The PIP doc is in discovery.
- canon_text_long: The Assistant U.S. Attorney whose name appears on the SDNY filing — the one [FOUNDER] has been told to "take very seriously" — was, from 2021 to 2022, an associate product manager at [COMPANY] who left during a reorganization that included a 30-day performance plan and an exit conversation [FOUNDER] does not remember being in the room for. The PIP document is, per [COMPANY]'s discovery obligations, producible. The AUSA's recusal application is denied at the supervisory level for reasons that are not on the public docket. [FOUNDER] is informed by counsel that this is "fine, in the sense that the case will be tried regardless." This is not what [FOUNDER] wanted to hear.

### SF-CONSPIRACY-007 — "The Board Member Who Got Nervous Was the Tipster"
- tags: [board, regulator, craze_crazy]
- prereqs: [board_pressure_seed]
- prereqs_any: [sec_aware_seed, regulatory_phone_call_inbound_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-029
- effects: { heat: +10, reputation: -3 }
- plants: [cooperator_active_seed]
- canon_text_short: The seed-round director who keeps "raising concerns" filed an SEC tip in 2022 and is on a 10% bounty.
- canon_text_long: A FOIA response from the SEC's whistleblower office, returned to a journalist, redacts the name but not the dates. The 2022 tip — the one that triggered the original informal inquiry — was filed by a board member who would receive a 10-30% bounty on any eventual disgorgement. Cross-referenced against [COMPANY]'s board composition, only one member has been continuously seated since 2022 and has the requisite legal sophistication. He is the same board member who has, for 18 months, been "raising concerns" in formal session, generating a paper trail of his own diligence. He has been performing skepticism while collecting it.

### SF-CONSPIRACY-008 — "One of Your Design Partners Was a Honeypot"
- tags: [customer, partnership, craze_normal]
- prereqs: [enterprise_misrepresentation_seed]
- prereqs_any: [partnership_press_release_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-030
- effects: { fraud_score: +5, heat: +10 }
- canon_text_short: The Series-A "anchor design partner" was a competitor's BD team operating under a shell. They have your roadmap.
- canon_text_long: A LinkedIn-overlap analysis — done by [COMPANY]'s newish head of revenue, on a hunch — reveals that the four named individuals at "Atlas Forward Systems," [COMPANY]'s anchor design partner since 2023, share a previous employer: [COMPETITOR]. The shell was incorporated three weeks before first contact. The MSA they signed includes a roadmap-disclosure clause [COMPANY]'s CTO never noticed. [COMPETITOR]'s last two product releases trace, in shape and timing, to roadmap milestones [COMPANY] shared with Atlas Forward in Q3 of last year. The relationship is terminated. The damage is structural.

### SF-CONSPIRACY-009 — "The Domain Was Owned by a Money-Laundering Operation"
- tags: [office, banking, craze_normal]
- prereqs_any: [kyc_problem_seed, mercury_flagged_seed]
- prereqs: []
- requires_stats: {}
- length_eligibility: [short, medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-031
- effects: { fraud_score: +3, heat: +5 }
- plants: [kyc_problem_seed]
- canon_text_short: [COMPANY].ai was previously a Latvian crypto-mixer's customer-service domain. The Wayback has receipts.
- canon_text_long: A Wayback Machine pull on [COMPANY].ai shows the domain registered, between 2018 and 2021, to a Latvian e-commerce shell that, per a 2022 OFAC press release, operated a peel-chain crypto mixer for two now-sanctioned individuals. The domain was acquired by [COMPANY] in 2022 via a third-party broker. The broker flagged nothing. The wayback captures show a customer-service portal in three languages. Mercury, learning this in a routine review, "flags the account for enhanced diligence." Stripe, on a separate prompt, freezes payouts for 14 days. Neither bank says the word "mixer" in writing.

## SF-TIMELINE — Paradox / chronology reveals

### SF-TIMELINE-001 — "Your Pitch to Sequoia Was Six Months Before You Incorporated"
- tags: [fundraising, paradox, craze_unhinged]
- prereqs: [deck_in_the_wild_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-032
- effects: { reputation: +3, heat: +10 }
- canon_text_short: A diligence binder timestamps the Sequoia pitch at March 2019. Delaware shows incorporation in September 2019.
- canon_text_long: A diligence binder, surfaced in litigation, contains a Sequoia internal calendar invite for the [COMPANY] pitch dated March 14, 2019. Delaware Secretary of State shows [COMPANY], Inc. incorporated September 22, 2019. The pitch was, by the binder's own metadata, real. The company was, by the State's, not yet a thing. The most parsimonious explanation — a different entity name — does not match the deck the binder also contains. There is no charitable reading. There is also no enforcement mechanism for this particular kind of impossibility, and the matter is allowed to sit.

### SF-TIMELINE-002 — "A Press Clipping in Your Vault Is From a Future Date"
- tags: [press, paradox, craze_unhinged]
- prereqs: []
- prereqs_any: [press_clip_loaded_seed, new_yorker_profile_seed]
- requires_stats: { turn: ">=50" }
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-033
- effects: {}
- plants: [paranoia_seed]
- canon_text_short: A photographed press clip in [FOUNDER]'s phone is dated nine months in the future. The headline is true.
- canon_text_long: Cleaning out a Photos library, [FOUNDER] finds a screenshot dated three years ago of a press clipping dated nine months from now. The headline accuses [COMPANY] of a specific, narrow form of accounting fraud the SEC will, in fact, allege in seven months. [FOUNDER] has not photographed this clipping. The metadata is intact. The screenshot is on iCloud, on the laptop, on the backup drive. There is no version of the iPhone in 2022 that produces a screenshot referencing 2026. [FOUNDER] does not show this to counsel. Counsel does not need this.

### SF-TIMELINE-003 — "The TED Talk Was Given Before You Wrote It"
- tags: [ted_talk, paradox, craze_unhinged]
- prereqs: [ted_talk_aired_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-034
- effects: {}
- canon_text_short: TED's archive shows the talk uploaded six weeks before [FOUNDER]'s draft was started. The transcript matches.
- canon_text_long: Per a routine TED archival audit — the kind that surfaces nothing 99% of the time — the YouTube upload of [FOUNDER]'s 2023 talk is timestamped six weeks before the Google Doc draft of the talk was created. The Doc's revision history, exported, shows no entries before that creation date. The transcripts match to within rounding. The edit nobody can identify made this happen, and TED's IT department, after one phone call, declines to investigate further. The talk continues to circulate. It has been viewed eleven million times.

## SF-MEMORY — Repressed / amnesia reveals

### SF-MEMORY-001 — "You Were Promised a Russian Passport at Davos in 2018"
- tags: [davos, flight_risk, craze_crazy]
- prereqs: [davos_photo_loaded_seed]
- prereqs_any: []
- requires_stats: { fbi_awareness: ">=30" }
- length_eligibility: [long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-035
- effects: { fbi_awareness: +5 }
- plants: [flight_risk_seed]
- unlock_endgame: END-FLED-RU
- canon_text_short: A 2018 Davos dinner photo, with a man you don't remember, came with a verbal offer of citizenship. He has waited.
- canon_text_long: A reverse-image search on a 2018 Davos dinner photo identifies the man two seats from [FOUNDER] as a then-deputy at a Russian state development bank — now sanctioned, then merely well-connected. A leaked transcript of the dinner's after-toasts, surfaced by Bellingcat, includes a moment in which the deputy offers, in the form of a joke that the room interpreted as not-a-joke, a Russian passport "for any of our Silicon Valley friends, when they need it." [FOUNDER] does not remember being in the room for this. [FOUNDER] is, per the timestamp, in the room for this. The offer, technically, has never been withdrawn. The endgame to flee Russia, previously gated, is now reachable.

### SF-MEMORY-002 — "Your Old College Roommate Is Running a Parallel Fund Using Your Data"
- tags: [fundraising, peer_network, craze_normal]
- prereqs: [peer_network_entanglement_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-036
- effects: { reputation: -3 }
- canon_text_short: An emerging-manager pitch deck circulating on Twitter cites [COMPANY] as "early data partner." It is your old roommate.
- canon_text_long: A pitch deck by a "Solo GP" emerging manager — circulating on Twitter, screenshot-and-roast genre — lists [COMPANY] as an "early data partner" providing "anonymized go-to-market signal" to the fund's diligence pipeline. [COMPANY] has no such partnership. The Solo GP is [FOUNDER]'s freshman-year college roommate, with whom [FOUNDER] has not spoken in eight years. The data, per the deck's footnote, is "scraped from public APIs and partner-shared events." [COMPANY] has shared no such events. The roommate's fund has $40m. The deck has been seen by 200 people who matter.

### SF-MEMORY-003 — "Your College Honor Code Violation Was Actually a Felony"
- tags: [founder_behavior, identity, craze_crazy]
- prereqs: []
- prereqs_any: [old_tweet_archive_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-037
- effects: { reputation: -5, heat: +10 }
- canon_text_short: The 2014 honor-code matter was technically a federal computer-fraud charge declined by the local USA. The file is open.
- canon_text_long: A diligence vendor, working a different file, surfaces a 2014 referral from [FOUNDER]'s undergraduate institution to the local U.S. Attorney's office. The referral concerned a CS-department server access that, characterized formally, met the elements of 18 U.S.C. § 1030(a). The USA's office declined to prosecute and the school handled it via a one-semester suspension. The decline letter notes the matter is "preserved for future consideration." That phrase has technical meaning. The statute of limitations is, depending on theory, either expired or not. [FOUNDER] does not remember the matter as more than an honor-code thing.

## SF-MEDICAL — Health / genetic / psychiatric

### SF-MEDICAL-001 — "Your Health Tracker Has Been Logging the CEO of Your Competitor"
- tags: [data_leak, competitor, craze_crazy]
- prereqs_any: [data_leak_undisclosed_seed]
- prereqs: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-038
- effects: { reputation: +2, heat: +5 }
- canon_text_short: An Eight Sleep account-pairing bug has been logging [COMPETITOR]'s CEO's REM data into [FOUNDER]'s dashboard for nine months.
- canon_text_long: An Eight Sleep customer-success ticket, escalated and quietly resolved, indicates that an account-pairing bug from a 2024 firmware update has been cross-streaming biometric data between five user pairs identified by similar email patterns. [FOUNDER] is one of the five. The paired account, anonymized in the ticket but trivially de-anonymized by the ticket's screenshot, is [COMPETITOR]'s CEO. [FOUNDER] has been viewing [COMPETITOR]'s sleep score every morning for nine months and assuming it was their own. [COMPETITOR]'s CEO has had a worse spring than [FOUNDER] realized.

### SF-MEDICAL-002 — "Your Genetic Test Flagged a Founder-Behavior Allele"
- tags: [founder_behavior, genealogy, craze_unhinged]
- prereqs: []
- prereqs_any: []
- requires_stats: { fraud_score: ">=40" }
- length_eligibility: [long]
- craziness_min: unhinged
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-039
- effects: { reputation: +5 }
- canon_text_short: 23andMe's research arm just published a paper. [FOUNDER]'s genome is in the case-cohort.
- canon_text_long: A 23andMe research letter, circulating on academic Twitter, identifies a polygenic correlate — published with appropriate caveats, branded "FBA-1" by an unsigned reviewer at *Nature Comment* — that the lay press is calling "the founder behavior allele." The paper's case-cohort is anonymized but, per a Substack reverse-engineering, includes [FOUNDER]'s genome. The variant is associated with a specific tail of the openness-to-experience distribution and a separate cluster of self-reported "pivoted three or more times in five years." [FOUNDER] is, scientifically, predisposed. The press is having fun with this.

## SF-FAMILY — Founder family secrets

### SF-FAMILY-001 — "The Whistleblower Is Your Mother"
- tags: [whistleblower, family, craze_crazy]
- prereqs: [whistleblower_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-040
- effects: { reputation: -3, heat: +20 }
- retires: [whistleblower_seed]
- canon_text_short: The SEC tip filed under seal in March was authored by [FOUNDER]'s mother. TMZ has the story.
- canon_text_long: An SEC whistleblower-office filing — filed under seal, redacted on the docket, leaked to TMZ via a clerk's office in a way that will not be investigated — names the tipster's relationship to [FOUNDER] in the affidavit's first paragraph: *I am the subject's mother.* The affidavit is twelve pages and includes references to a Thanksgiving conversation in 2023 in which [FOUNDER] characterized the company's revenue in terms that the affidavit's author, who has a Series 7, found "professionally untenable." The whistleblower seed is retired — [FOUNDER] settles privately with their mother for an amount neither will disclose. TMZ runs the story under a headline involving the word *MOMSTLEBLOWER* in 60-point type.

### SF-FAMILY-002 — "Your Nepo Cousin Has Been Receiving Quarterly Distributions From an LLC You Don't Remember Signing"
- tags: [nepo_baby, family, craze_normal]
- prereqs: [nepo_exec_seed]
- prereqs_any: [llc_problem_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-041
- effects: { reputation: -3, fraud_score: +3 }
- canon_text_short: Cousin Tucker has been getting $35k/quarter from a Delaware LLC [FOUNDER] is the sole member of. The op-agreement is not on file.
- canon_text_long: A routine personal tax review surfaces a Delaware LLC of which [FOUNDER] is the sole member. The LLC has been making $35,000/quarter distributions to a recipient identified, in IRS Form 1099-DIVs over four years, as Tucker — [FOUNDER]'s cousin from the side of the family they don't see at Christmas. [FOUNDER] does not remember establishing the LLC. The operating agreement is not on file. Tucker, reached by [FOUNDER]'s assistant, is "out hiking and would prefer not to discuss this on a call." The cumulative $560k is post-tax. Tucker's hike is in Patagonia.

### SF-FAMILY-003 — "Your Senator-Engaged Sibling Has Subpoena-Immunity Considerations"
- tags: [family, politics, craze_crazy]
- prereqs_any: []
- prereqs: []
- requires_stats: { reputation: ">=40" }
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-042
- effects: { heat: -10, regulator_awareness: -10 }
- canon_text_short: [FOUNDER]'s sibling is engaged to a senator on the relevant committee. The DOJ slows its pace by two months.
- canon_text_long: A Sunday Styles announcement notes the engagement of [FOUNDER]'s younger sibling to a U.S. Senator from a state with no prior family connection. The Senator sits on the committee with oversight of the regulator currently inquiring into [COMPANY]. The DOJ's pace, which had been brisk, becomes deliberate. Two scheduled depositions are continued. A subpoena drafted in March is filed in May. Nothing improper has been done. Nothing improper needs to be done. The wedding is in October, in a state where venue costs are recoverable.

## SF-DEAL — Prior deals revealed

### SF-DEAL-001 — "A Sovereign Wealth Fund Acquired You Years Ago, You Just Didn't Know"
- tags: [sovereign_wealth, fundraising, craze_crazy]
- prereqs: [sovereign_entanglement_seed]
- prereqs_any: [yield_product_seed, bridge_round_seed]
- requires_stats: {}
- length_eligibility: [long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-043
- effects: { regulator_awareness: -5, fraud_score: +5 }
- plants: [cfius_loaded_seed]
- canon_text_short: A Mubadala subsidiary controls 51% of [COMPANY]'s preferred stack via a trust [FOUNDER] signed in 2022.
- canon_text_long: A CFIUS pre-filing review — initiated by an acquirer's counsel in connection with an unrelated transaction — surfaces that 51% of [COMPANY]'s preferred is held, through a Cayman feeder, by a trust whose protector and economic beneficiary is a Mubadala subsidiary. The trust was established in 2022 via a side letter [FOUNDER] signed at a Yas Island dinner that they understood at the time to be a "memorandum of intent." It was not. The control rights are, per the trust deed, exercisable on a 30-day notice. Notice has not been given. The notice is, per a separate side letter, "deferred until conditions warrant." The conditions are unspecified.

### SF-DEAL-002 — "The 14,000-Word Margins Piece Was Written About a Different Founder"
- tags: [press, profile, craze_normal]
- prereqs: [margins_substack_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [short, medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-044
- effects: { reputation: +5, heat: -10 }
- retires: [margins_substack_seed]
- canon_text_short: Margins's takedown was about a different [FOUNDER]. The correction is one paragraph, on a Friday.
- canon_text_long: A Margins post, fact-checked retroactively after a tip, runs a one-paragraph correction on a Friday afternoon: the 14,000-word piece concerned a different person of the same first and last name, a co-founder of a different company in a different industry. The piece had referenced [COMPANY] in three sentences that were also, in retrospect, about a different company. The correction does not include the word *apologize.* The damage, [FOUNDER]'s comms head observes, is "halfway un-done, which is more than we usually get." The other [FOUNDER] is reached for comment and declines, citing his own pending matter, which is unrelated, and which Margins is now also looking into.

### SF-DEAL-003 — "Your Convertible Note Has a Drag-Along Nobody Remembers Signing"
- tags: [fundraising, term_sheet, craze_normal]
- prereqs: [napkin_safe_seed]
- prereqs_any: [vanity_clause_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-045
- effects: { reputation: -3, fraud_score: +3 }
- canon_text_short: The 2020 SAFE has a drag-along that triggers at $1B. [COMPANY] is past $1B. Nobody initialed the page.
- canon_text_long: A diligence vendor, prepping for a Series D, flags a paragraph on page 9 of the 2020 SAFE that nobody initialed: a drag-along provision that activates at $1B post-money valuation and grants the SAFE-holder consent rights over any subsequent financing. The SAFE-holder is a now-deceased angel whose estate is administered by a New Jersey accountant who has, the diligence vendor confirms by phone, "been waiting for someone to call about this." The accountant's price for waiver is not unreasonable. The accountant's leverage is total.

### SF-DEAL-004 — "The Concierge Network — Fled CEOs WhatsApp Group"
- tags: [flight_risk, craze_crazy]
- prereqs: [flight_risk_seed]
- prereqs_any: [sovereign_entanglement_seed]
- requires_stats: { fbi_awareness: ">=30" }
- length_eligibility: [long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-046
- effects: { fbi_awareness: +5 }
- plants: [flight_risk_seed]
- canon_text_short: The Dubai concierge runs a WhatsApp group of 23 fled founders. [FOUNDER] is added without ceremony.
- canon_text_long: The Dubai concierge — the one who arranged the apartment, the driver, the broker, the school for the kids of a friend — adds [FOUNDER] to a WhatsApp group titled simply with a sun emoji. The group has 23 members. The members are, by the group's pinned welcome message, "founders in transit." The pinned message recommends three lawyers, two banks, and a pediatric dentist. New members are welcomed with a pinned voice note from a member who fled in 2019 and now writes a private newsletter about regulatory arbitrage. The group is, per a member's offhand comment, monitored by "two intelligence services we know of, four we don't."

## SF-DEBT — Hidden debts

### SF-DEBT-001 — "The Aeron Chairs Were Financed"
- tags: [office, banking, craze_normal]
- prereqs: [aeron_surplus_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [short, medium, long]
- craziness_min: normal
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-047
- effects: { fraud_score: +2, heat: +3 }
- canon_text_short: The 380 Aerons are on a 60-month lease at 18% APR through a captive finance entity. The CFO didn't book it.
- canon_text_long: A reconciliation pass surfaces a 60-month lease, signed in 2022, on 380 Aeron chairs through a Herman Miller captive finance entity at an effective APR of 18%. The lease was signed by the office manager — the same one operating Lobby Foliage Holdings LLC — and was never booked to the GAAP balance sheet. The aggregate liability, $1.4m, is material under any reasonable threshold. The CFO is informed by the controller on a Wednesday and proceeds to take, per his calendar, a personal day Thursday. The chairs are, however, comfortable.

### SF-DEBT-002 — "Your AWS Bill Is Personally Guaranteed by [FOUNDER]"
- tags: [aws_bill, banking, craze_crazy]
- prereqs: [aws_bill_seed]
- prereqs_any: []
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-048
- effects: { reputation: -3, heat: +5 }
- canon_text_short: A 2023 AWS Enterprise Discount Program addendum names [FOUNDER] as personal guarantor for the full commit.
- canon_text_long: An AWS Enterprise Discount Program addendum, signed in 2023 to unlock a 28% list-price reduction, contains a personal-guaranty clause naming [FOUNDER] individually for the full three-year commit. The commit is $42m. [FOUNDER] does not remember signing this. The signature is, per a forensic comparison, [FOUNDER]'s. The negotiating BD lead at AWS, contacted years later, characterizes the clause as "non-standard but not unprecedented." [FOUNDER]'s personal counsel characterizes it as "a problem on a different track than the SEC matter." [FOUNDER] now has two tracks.

### SF-DEBT-003 — "There Is a Second Set of Books, But It's Honest"
- tags: [audit_risk, craze_crazy]
- prereqs: [revenue_rounded_up_seed]
- prereqs_any: [unencrypted_spreadsheet_seed]
- requires_stats: {}
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-049
- effects: { fraud_score: -5, heat: +5 }
- plants: [discovery_loaded_seed]
- canon_text_short: The CFO has been keeping a private spreadsheet with the real numbers. The real numbers are worse.
- canon_text_long: The CFO, during a 1:1 made awkward by a recent press leak, discloses to [FOUNDER] that the file *real_numbers_DO_NOT_SHARE.xlsx* exists, has existed since 2022, and is on a personal Google Drive the CFO maintains for "sanity reasons." The file is the real numbers. The real numbers are worse than the books — the books have been padded toward a more flattering picture, the spreadsheet shows the underlying truth. The spreadsheet is, in [FOUNDER]'s lawyer's view, "the document we are most likely to be asked about." The CFO is asked to preserve it, which is the worst of both worlds: the spreadsheet now exists, in a forensically-sound way, by [COMPANY]'s own action.

### SF-DEBT-004 — "Your 'Government Customer' Is a Federal Sting"
- tags: [customer, government, fbi, craze_crazy]
- prereqs: [enterprise_misrepresentation_seed]
- prereqs_any: [defense_contract_loaded_seed]
- requires_stats: { fbi_awareness: ">=20" }
- length_eligibility: [medium, long]
- craziness_min: crazy
- visibility: hidden
- one_run_only: true
- unlocks_achievement: ACH-SECRET-050
- effects: { fbi_awareness: +20, heat: +15 }
- plants: [grand_jury_seed]
- canon_text_short: The "DoD pilot" was an FBI undercover operation. Every demo was recorded.
- canon_text_long: The Department of Defense pilot [COMPANY] has been citing in pitch decks for eighteen months — the one with the contracting officer who never quite seemed to understand the product, the one whose checks always cleared exactly on time, the one whose office "moved" twice in a year — was an FBI undercover. The contracting officer is a special agent. The recordings are in evidence. The pitch deck slides citing the pilot are, per a sealed superseding indictment that has not yet been unsealed, Count 4. [COMPANY]'s defense, on this count, is going to be "the FBI made us do it," and the FBI's response, on the record, is going to be "we did not make them do it; we asked them what their product did and they answered."

---

## Index

Total findings: 50.

By category: SF-CIA (4), SF-DREAM (4), SF-CULT (3), SF-IDENT (4), SF-OCCULT (4), SF-AI (3), SF-CONSPIRACY (9), SF-TIMELINE (3), SF-MEMORY (3), SF-MEDICAL (2), SF-FAMILY (3), SF-DEAL (4), SF-DEBT (4).
