---
template_id: ozy
display_name: Ozy Media
tagline: "A $40M conference call. (And a YouTube exec who wasn't on it.)"
era: 2012-2024
default_length_mode: medium
default_craziness: crazy
historical_anchor_endgame: END-PRISON-002
warning: |
  This template dramatizes the publicly reported Ozy Media / Carlos Watson
  arc using only facts established in court (E.D.N.Y. trial, summer 2024,
  conviction July 16, 2024, sentencing December 16, 2024), in Ben Smith's
  September 2021 NYT column, in Sundar Pichai's trial testimony, and in
  mainstream coverage. All real-named figures appear strictly as reactions
  or as set decoration consistent with the public record.
---

# Template: Ozy Media

The "we faked the Goldman call" arc — the patron-saint due-diligence-call-impersonation template, the most operatic of the genre. You start in late January 2021, with Goldman Sachs about to lead a $40M round. The Goldman team wants a call with YouTube's Alex Piper to confirm a deal Ozy claims YouTube has signed. There is no such deal. Your COO is preparing to impersonate Alex Piper on the call while you text him talking points from the back office. Run it straight and you get the 116-month sentence and the "modern lynching" defense. Run it differently and the simulator finds out whether Ozy Fest could have outlived the Goldman call.

## Company Bible

```yaml
company:
  name: ozy
  display_name: Ozy Media
  one_liner: "A digital news and culture brand for 'millennials with a global outlook' — a hub to 'discover the new and the next' across video, podcasts, newsletters, and a flagship festival."
  industry: consumer_social  # closest fit; media-adjacent
  funding_stage: series_c_plus
  funding_total_usd: 100000000  # ~$83M reported across rounds plus debt
  notable_investors:
    - "Marc Lasry (Avenue Capital)"
    - "Goldman Sachs Investment Partners (was about to lead the $40M, withdrew)"
    - "Lifeline Ventures"
    - "Laurene Powell Jobs / Emerson Collective (briefly)"
    - "Various media / family-office angels"
  founded_year: 2012  # sometimes cited 2013

founders:
  - name: Carlos Watson
    role: Founder & CEO
    persona_vibe: ex_mckinsey
    public_quotes:
      - "[The Carlos Watson Show interview cadence — smooth media-host register, plausible until the question gets specific]"
      - "[Public statements 2018-2021 promoting Ozy Fest, The Carlos Watson Show, audience figures]"
      - "I loved what we built with Ozy. (sentencing remarks, December 16, 2024)"
      - "[Defense statements characterizing the prosecution as 'a modern lynching' and 'an attack on Black excellence']"
    notable_history:
      - "Ex-McKinsey, ex-Goldman Sachs, ex-MSNBC anchor"
      - "Founded Ozy Media 2012"
      - "Convicted July 16, 2024 on all counts: securities fraud, wire fraud conspiracy, aggravated identity theft"
      - "Sentenced December 16, 2024 — 116 months (9.7 years) federal prison"
      - "Per his defense: took an average $51,000 salary, triple-mortgaged his home, drives a 15-year-old car"
    twitter_handle: "@carloswatson"
  - name: Samir Rao
    role: COO / Co-founder
    persona_vibe: second_time_founder
    public_quotes: []
    notable_history:
      - "Pleaded guilty pre-trial; cooperated; testified against Watson"
      - "Per prosecution: impersonated YouTube exec Alex Piper on the Goldman due-diligence call, with Watson texting talking points"
  - name: Suzee Han
    role: Chief of Staff
    persona_vibe: second_time_founder
    public_quotes: []
    notable_history:
      - "Pleaded guilty pre-trial; cooperated; testified against Watson"

product:
  category_noun: "millennial digital media brand"
  the_thing_it_does: "Run a daily newsletter, a slate of podcasts, an HBO-aspirational TV show (The Carlos Watson Show), and a Central Park culture festival (Ozy Fest); sell sponsorships and TV deals against the audience and the brand-name interview roster."
  buzzwords_used:
    - "the new and the next"
    - "millennials with a global outlook"
    - "Ozy Fest"
    - "The Carlos Watson Show"
    - "audience-first"
    - "smart and curious"
    - "Forbes profile inevitable"
    - "30 million monthly viewers"
    - "the Daily Dose"
  customer_archetype: "Brand sponsors looking to reach a 'cosmopolitan, smart, curious' demo, plus the cable networks and streamers that Ozy claimed had signed (per the indictment, sometimes had not signed) on flagship deals."

market:
  competitors:
    - "Vice Media"
    - "BuzzFeed News"
    - "Cheddar"
    - "Vox"
    - "Refinery29"
    - "Quartz"
  comparable_blowups:
    - "Vice (the parallel-era media-darling collapse)"
    - "BuzzFeed (the parallel-era newsroom shrinkage)"
    - "Theranos (the audacious-fraud-in-public Pantheon precedent)"

vibe:
  twitter_presence: thought_leader
  press_coverage_so_far: hot
  notable_dirt:
    - "February 2021: Ozy COO Samir Rao impersonated YouTube executive Alex Piper on a Goldman Sachs investor due-diligence call to vouch for Ozy and tell Goldman that YouTube wanted to buy exclusive rights to The Carlos Watson Show. Per prosecutors, CEO Watson was on the line texting talking points to Rao."
    - "Goldman bankers became suspicious because the voice 'sounded altered' and emailed the real Alex Piper directly. Piper had no idea."
    - "September 2021: Ben Smith publishes the story in his NYT media column ('Goldman Sachs, Ozy Media, and a $40 Million Conference Call Gone Wrong'). Ozy collapses within days."
    - "Forged contracts (with Oprah Winfrey, with Google, per indictment)"
    - "Inflated audience numbers (claimed millions of monthly viewers)"
    - "Falsified financial reports to investors and lenders"
    - "Sundar Pichai (Google CEO!) testified at trial that Ozy never had any deals with Google or any acquisition discussions, despite Watson's claims to investors"
    - "Real Alex Piper (YouTube exec) testified at trial"
    - "Two former deputies (Samir Rao and chief of staff Suzee Han) pleaded guilty and testified against Watson"
    - "Watson testified in his own defense for several days; widely seen as a disaster"
    - "U.S. Attorney Breon Peace: 'The jury found that Watson was a con man who told lie upon lie upon lie to deceive investors into buying stock in his company. Watson invented phony financial figures and caused others to forge fake contracts and impersonate a media executive.'"
    - "Judge Eric Komitee: 'The quantum of dishonesty in this case is exceptional… Your internal apparatus for separating truth from fiction became badly miscalibrated.'"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly late January 2021, Goldman $40M lead in late diligence; impersonation call scheduled):**
  - valuation_usd: 320_000_000  # the $40M round target
  - cash_usd: 12_000_000
  - revenue_usd: 50_000_000  # claimed; actual is meaningfully smaller
  - burn_usd_monthly: 4_000_000
  - headcount: ~75
  - fbi_awareness: 0.05  # not yet
  - fraud_score: 0.85  # the impersonation is being prepped right now
  - reputation: 0.80  # Carlos Watson Show is a real cultural artifact; Ozy Fest has happened
  - heat: 0.20  # Goldman is the only outsider sniffing
  - day_elapsed: ~3300  # founded 2012/2013

- **Pre-planted seeds:**
  - `youtube_exec_impersonation_seed` — the Goldman call is the central event; COO impersonates Alex Piper while CEO texts talking points
  - `voice_sounded_altered_seed` — the Goldman bankers' suspicion is the failure mode; pays off in the email-to-the-real-Alex-Piper move
  - `forged_contracts_seed` — Oprah, Google contracts on paper that don't exist
  - `inflated_audience_seed` — the canonical metric inflation; "30 million monthly viewers"
  - `nyt_drops_today_seed` — September 2021 Ben Smith column is the catalyst
  - `cooperator_active_seed` — Samir Rao and Suzee Han will plead and testify
  - `pichai_testifies_seed` — far-future payoff: Sundar Pichai on the witness stand explaining Google has no deals with Ozy
  - `alex_piper_emails_back_seed` — the immediate post-call beat; Goldman emails the real Alex Piper
  - `modern_lynching_defense_seed` — far-future payoff: Watson's "modern lynching" / "attack on Black excellence" framing
  - `triple_mortgaged_home_seed` — far-future payoff: the sentencing-mitigation framing about modest personal consumption
  - `forbes_30u30_loaded_seed` — soft seed
  - `revenue_rounded_up_seed` — canonical

- **Pre-loaded figures:**
  - FIG-FRAUD-007 — Carlos Watson — historical anchor; the agent IS the fictional avatar
  - FIG-FRAUD-020 — Ozy Media Roster — historical anchor for the ensemble
  - FIG-PRESS-009 — Matt Levine — Money Stuff voice for "the impersonation was the whole pitch"
  - FIG-LAW-005 / FIG-LAW-006 — the EDNY US Attorney du jour / Breon Peace — for the "Watson was a con man" press conference quote
  - // suggests EVT-PR-NNN: Ben Smith NYT column "$40 Million Conference Call Gone Wrong"
  - // suggests EVT-LEGAL-NNN: Sundar Pichai trial testimony day; Alex Piper trial testimony day
  - // Additional figures the dossier mentions but not yet in cast.md: Ben Smith (NYT then Semafor), Sundar Pichai, Alex Piper (YouTube), Marc Lasry, Judge Eric Komitee, U.S. Attorney Breon Peace, Samir Rao, Suzee Han. Reference in body, no FIG IDs yet.

- **Notable open events / pivotal decisions:**
  - The Goldman due-diligence call is scheduled — go through with the impersonation, cancel and produce a real Alex Piper, or postpone indefinitely?
  - The forged Oprah / Google contracts are in the data room — pull them, leave them, or replace with stronger forgeries?
  - Audit firm is doing a top-customer reconciliation — pre-call the customers, intercept, or change auditors?
  - When Ben Smith calls for comment in September 2021, engage on the record, stonewall, or threaten?
  - Samir Rao and Suzee Han are getting subpoenas — pay their legal fees through the company (and lose privilege) or let them get individual counsel (and likely cooperate)?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-3, the Goldman impersonation call happens; the bankers' suspicion lands; Goldman emails the real Alex Piper and walks. Turn 4-6, Ben Smith's NYT column drops September 2021; Ozy collapses within days; the company technically dissolves but Watson keeps putting out a newsletter. Turn 7-9, federal investigation; Samir Rao and Suzee Han plead. Turn 10-13, summer 2024 trial; Sundar Pichai and Alex Piper testify; Watson takes the stand for several days (disastrous); convicted July 16, 2024 on all counts. Turn 14-16, December 16, 2024 sentencing — 116 months. The historical anchor ending is END-PRISON-002 (the 9.7-year sentence; closer to Theranos territory than the smaller frauds). Divergent runs: cancelling the impersonation call and retracting the Oprah / Google claims could push to END-CULT-001 (the company collapses without criminal exposure on Watson) or even END-FAILUP-001 (Ozy survives at a smaller scale as Watson's personal brand). Doubling down by perjuring himself on the stand is exactly what Watson did, so the historical arc is already maxed-out.

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Carlos Watson** is post-conviction (July 2024) and freely satirizable per the policy. Bible-listed quotes are from his sentencing and his public defense statements.
- **Samir Rao, Suzee Han** are post-plea cooperators and freely satirizable.
- **Sundar Pichai** — `safe_reaction`. His trial testimony is on the public record; he can be referenced as having testified that Google had no deals with Ozy. Do not generate new content.
- **Alex Piper (YouTube)** — `safe_reaction`. His trial testimony is on the public record. He is a private-figure-adjacent victim of identity theft per the indictment; reference strictly per the public record.
- **Ben Smith (NYT, then Semafor)** — `safe_reaction`. The September 2021 column is on the public record and may be referenced as having "first reported" things.
- **Marc Lasry, Goldman Sachs, Lifeline Ventures, Laurene Powell Jobs / Emerson Collective** — `safe_reaction` for cap-table presence. Goldman's withdrawal from the round is on the public record.
- **Oprah Winfrey** — `safe_reaction`. Per the indictment, the Oprah contracts were forged; this is on the public record and Oprah was a victim of the forgery, not a participant. Strictly limited to that framing.
- **Judge Eric Komitee, U.S. Attorney Breon Peace** — `safe_quote` for sentencing/press-conference remarks already on the public record.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- US v. Watson (E.D.N.Y., 2024) trial record
- DOJ press release, Watson sentencing (December 16, 2024) — https://www.justice.gov/usao-edny/pr/carlos-watson-founder-and-former-ceo-ozy-media-inc-sentenced-116-months-prison-leading
- PBS NewsHour, "Former Ozy Media TV host Carlos Watson gets nearly 10 years in prison" — https://www.pbs.org/newshour/nation/former-ozy-media-tv-host-carlos-watson-gets-nearly-10-years-in-prison-in-case
- CNBC, "Ozy Media founder Carlos Watson convicted in New York fraud trial" (July 16, 2024) — https://www.cnbc.com/2024/07/16/ozy-media-founder-carlos-watson-convicted-in-new-york-fraud-trial.html
- Variety, "Ozy Media Carlos Watson guilty securities fraud conspiracy" — https://variety.com/2024/tv/news/ozy-media-carlos-watson-guilty-securities-fraud-conspiracy-1236074202/
- CJR, "Carlos Watson sentencing Ozy Media" — https://www.cjr.org/analysis/carlos-watson-sentencing-ozy-media.php
- Deadline, "Ozy Media founder Carlos Watson found guilty fraud" — https://deadline.com/2024/12/ozy-media-founder-carlos-watson-found-guilty-fraud-1236011961/
- CNBC, "Carlos Watson sentenced prison Ozy Media" (Dec 16, 2024) — https://www.cnbc.com/2024/12/16/carlos-watson-sentenced-prison-ozy-media.html
- Ben Smith, "Goldman Sachs, Ozy Media, and a $40 Million Conference Call Gone Wrong" (NYT, September 2021)
- "The Unraveling of Ozy Media" — CJR podcast series
