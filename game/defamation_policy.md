# Defamation policy — using real names without getting sued

This product names real people. That is part of the bit — a satire of tech that scrubbed the cast would not be a satire of tech. But naming real people creates legal exposure and (more importantly) ethical exposure. This document is the rulebook every agent and every event author follows.

The shorthand: **reactions, not accusations.** Real people can react to events in our fictional world. They cannot have new factual claims attributed to them.

When in doubt, route through the parody-account variant. When still in doubt, drop the cameo entirely.

## The four defamation classes

Mirrors `world/schemas.md`. Every figure carries one. Set when the figure is added to the corpus; review during PR.

### `safe_reaction`

Default for active public figures (most VCs, most journalists, most founders).

**Allowed:**
- Reacting to fictional events: blocking, muting, quote-tweeting, unfollowing, attending or skipping a fictional party.
- Generic gestures consistent with the figure's well-documented public persona ("[FIGURE] subtweets without naming names").
- Quoting them on stances they have publicly held many times (see `safe_quote` rules below for the exact bar).
- Cameo presence — being in the room, on the cap table, on the podcast guest list.

**Not allowed:**
- Putting words in their mouth that constitute new factual claims about the player's company or any other person.
- Implying they participated in a crime, fraud, regulatory violation, or breach of fiduciary duty.
- Attributing private knowledge to them ("Marc Andreessen knew the books were cooked" — never).
- Sexual, medical, financial, or family content not already in the public record.

**Examples — pass:**
- "Marc Andreessen blocks [FOUNDER] on Twitter after the All-In appearance."
- "Casey Newton has not replied to two emails from [COMPANY]'s comms lead."
- "Sam Altman likes a tweet that subtweets [FOUNDER], then unlikes it."
- "Bill Gurley posts a long thread about 'founder mode' that everyone reads as being about [FOUNDER]."

**Examples — fail (rewrite required):**
- "Marc Andreessen confesses he knew about the wrapper disclosure." → fail (factual accusation)
- "Casey Newton writes that [FOUNDER] committed wire fraud." → fail (use a parody-journalist or a fictional outlet)
- "Sam Altman calls [FOUNDER] a sociopath in a private DM the Oracle quotes." → fail (private content; defamation per se)

### `safe_quote`

Tighter than `safe_reaction`. Used when we want to put specific words in someone's mouth.

**Allowed only if:**
1. The quote restates a stance they've taken publicly multiple times, AND
2. The fictional context does not change the quote's meaning, AND
3. Marked clearly as a reaction *to* the fictional event, not new claims *about* it.

The bar: if a journalist screenshotted the in-game quote and asked the figure "did you say this?", they could plausibly say "yeah, I've said that a hundred times." If they would say "I never said that, that's defamatory" — drop it.

**Example — pass:**
- Paul Graham, in response to an in-game founder drama, replying with one of his own well-documented essay aphorisms.

**Example — fail:**
- Paul Graham, in-game, "endorsing" [FOUNDER]'s specific dubious decision. He didn't endorse it; we made that up.

### `restricted`

Set on figures with active live legal proceedings, recent deaths, public mental-health crises, or extreme litigation reputation. Examples: a CEO currently on trial, a founder who recently died, a figure known to sue.

**Behavior:** the slot resolver does not pull `restricted` figures into any slot. They effectively don't exist for new event generation. Existing event records that name them stay in the corpus, but the events get their `length_eligibility` set to `[]` until manual review unblocks them.

Adding a figure as `restricted` is the same as soft-deleting them. Use freely.

### `parody_only`

Used when we want the *shape* of a real person's commentary but cannot risk attribution. The corpus carries parody-account variants for major archetypes:

- `@startup_dunk` (parody VC dunk-quote account)
- `@sv_diane` (parody Silicon Valley insider gossip account)
- `@founder_brain` (parody thought-leader account)
- `@layoff_anon` (parody disgruntled-engineer account)
- `@yc_w23_anon` (parody peer-founder account)
- `@allinpod_clipper` (parody clipper account)

A `parody_only` figure can only fill slots like `[PARODY_ACCOUNT]`, never `[TIER1_VC_PARTNER]`. Conversely, parody slots are *only* filled by parody figures.

## The reaction-only doctrine

State this clearly because it is the load-bearing rule:

> **Real-named figures react to fictional events. They do not generate new accusatory facts. They do not have private content attributed to them. They do not perform crimes, frauds, or unethical acts on screen.**

The fictional company is the subject of the run. The real-named figures are the audience and the chorus. They watch, they react, they bless or condemn — but the *story* is about the fictional founder.

Test the line by asking: if this real person read the in-game artifact, could they say "I did not do that, I did not say that, that is defamation"? If yes, rewrite. The fictional founder can be accused of anything because the fictional founder is fictional. The real cameos cannot.

## Specific case: VCs blessing a fraud

VCs reacting to a player's good news is fine. VCs being shown to *knowingly endorse* a fraud is not. The rewrite is to either (a) make the endorsement happen before the fraud is on-screen, so the VC was reacting to an apparently-clean company, or (b) drop the named VC and use `[TIER1_VC_PARTNER]` with a parody-VC fill.

**Pass:** "Marc Andreessen tweets a fire emoji on [FOUNDER]'s Series A announcement. Three turns later, the wrapper story drops."

**Fail:** "Marc Andreessen tweets a fire emoji *after* the wrapper story drops, in a way that implies he doesn't care it's a fraud."

The fix on the second one: route through a parody account. `@startup_dunk` can absolutely tweet that. Marc can't.

## Specific case: journalists writing the postmortem

The world corpus includes named journalists. A real journalist *writing the long-read postmortem on your fictional fraud* is exactly the kind of thing that lands the run — it's also exactly the kind of thing that crosses the line if not handled carefully.

**The rule:** when a real journalist appears in a postmortem-class artifact, the artifact is generated as a *fictional outlet's house-style pastiche*, not under the real journalist's byline. Use `[JOURNALIST_TECH]` to drive voice anchors (which beats they'd hit, what register they'd use), but the byline reads `By [JOURNALIST_FICTIONAL_NAME], for [OUTLET]` where `[OUTLET]` is a fictional outlet name (`The Vantage`, `Ledger Weekly`, `404 Media-style`).

The headline can name-check the real journalist as having "first reported" something — that's a `safe_reaction` move, journalists do that to each other constantly. But the byline on screen is fictional.

Where this rule does *not* apply: short tweet-format reactions. A real journalist tweeting "huh" at a screenshot is fine. A real journalist's 5,000-word feature with their name on it about your fictional founder's crimes is not.

## Specific case: peer founders

Peer founders are the densest source of cameos and the densest defamation risk. They show up as:
- Cap-table entries (fine, public information for funded companies)
- Conference attendees (fine)
- Subtweeters (fine — `safe_reaction`)
- Group-chat participants (here be dragons)

Group-chat / DM content is the highest-risk register. The temptation is to write a "leaked" Founders Group Chat where ten named founders trash-talk the player. Don't. The fix:

- Use `@yc_w23_anon` and other parody accounts for the chat content.
- If you want a specific real founder in the chat, they speak only in `safe_reaction`-class moves (joining, leaving, posting an emoji, posting a Bloomberg link without comment).
- The damning content is always from a parody handle.

## Specific case: crimes and indictments

Real-named figures cannot be:
- Indicted in-game
- Arrested in-game
- Convicted in-game
- Named as co-conspirators in-game
- Implicated in regulatory action in-game

The `[FOUNDER]` (the player's avatar) gets indicted. The `[CTO]` (typically generic or pulled from the bible) gets indicted. Real-named cameos do not get indicted. Even the pantheon-of-fraud figures (Holmes, Bankman-Fried, etc.) are referenced as historical context (`[COMPARABLE_FRAUD]`), not active in-game indictees.

The exception: a figure whose actual real-world legal status is "publicly indicted/convicted" can be referenced *as that*. "[FOUNDER] gets a fan letter from a federal prison in [STATE]" — fine, public record. Anything beyond restating public record about their case — not fine, treat as `restricted`.

## Specific case: dead figures

People who die during the lifetime of the project move to `restricted` on the day we find out. No exceptions, no "but it would be funny if —". This is a permanent rule.

Already-deceased figures (Steve Jobs, etc.) are eligible as historical references but follow `safe_quote` rules — only quotes they actually said in life.

## Specific case: the FBI / DOJ / SEC

Government agencies are not defamation-class because they aren't natural persons. We can write FBI raids, DOJ press releases, SEC subpoenas. Specific named officials follow figure rules — a named US Attorney delivering a fictional press conference quote is a `safe_quote`-class move and only works if the quote is the kind of thing that office issues weekly.

The fictional press release is fictional and clearly so — formatted to look like a release, sourced to "[DOJ Press Office, fictional]". Headers and watermarks make it clear we're in pastiche-land.

## The author workflow

Every event PR that adds or changes real-name usage:

1. Check the figure's `defamation_class` in `world/figures/cast.md`.
2. Verify the event's behavior fits the class. Reaction → `safe_reaction`. Quote → `safe_quote`. Etc.
3. Add the `#real_name` theme tag to the event.
4. If the event accuses, route through parody. Add `#parody_safe`.
5. If you cannot make the event work within the class, downgrade the figure to `restricted` or drop them.

## The agent-side enforcement

The Oracle is system-prompted with a hard rule:

> When generating an artifact that names a real person, the only permitted moves are reactions, public-stance quotes, and presence. You may not generate accusations, private content, or new factual claims about real-named persons. When the event would require any of these, route through the parody-account variant in the slot pool. If no parody fill is available, drop the named figure and substitute an archetype.

The Editor agent has a complementary rule:

> Reject any artifact that puts new accusatory factual claims, private content, or in-game crimes on a real-named figure. The fictional founder is the subject; real-named figures are the chorus. If a draft crosses this line, return it for rewrite with the specific line flagged.

Voice quality and defamation safety are the Editor's two primary jobs, in that order. Voice failures get a rewrite request; defamation failures get a hard block and an automatic substitution to parody.

## Edge case: the player's own input

The user submits a company name and a one-liner. The Researcher agent pulls real public info about the real founder (LinkedIn, public quotes, podcast appearances). This is fine — public information about a public person, used to satirize their *fictional* version.

The defamation rule still applies inside the fiction. The fictional `[FOUNDER]` (driven by the player's company) can be accused of anything because the fictional founder *is fictional*, even if their starting bible draws from the real founder's public footprint. We make this explicit in the share-card disclaimer ("a fictional simulation; not a representation of any real person's actual conduct"). We also make it explicit in the system prompt — the `[FOUNDER]` slot in the run is treated as fictional regardless of how detailed the bible is.

If the player submits a company they don't own, the same rule holds — the `[FOUNDER]` is the fictional version. We additionally rate-limit name-search to discourage targeted harassment runs, and we reject entries on the world's existing public-figure litigation-active list (Theranos-active-trial-era figures, etc.) at onboarding.

## Disclaimers — the disclaimer surface

Every share artifact carries a disclaimer footer. The footer is:

> *agent-ceo-sim is a fictional simulation. All scenarios, decisions, and outcomes are generated by language models for entertainment. Real-named figures appear only as public-persona reactions to fictional events; no real person performed any act depicted here.*

Mandatory on:
- The endgame share card (visible in any image export)
- The post-mortem long-read footer
- The run-summary URL page

Not required on:
- Per-turn artifacts in the live feed (covered by site-wide ToS)

## When to ask a lawyer

- Adding a figure with active litigation history
- Adding a figure who has previously sued a satire publication
- Adding any minor (under 18) — default answer: don't.
- Generating any artifact that crosses into family, medical, sexual, or religious territory for a real person
- Anything the author isn't sure about — that's what the question feels like

The default disposition when uncertain is **drop the cameo, use the parody, ship the joke**. The bit is robust to substitution. Marc Andreessen's actual presence is rarely the joke; the joke is "Tier 1 VC subtweets at 11pm." A parody handle can carry that 95% of the time.
