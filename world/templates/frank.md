---
template_id: frank
display_name: Frank
tagline: "Synthetic users for $175M. We don't want to end up in orange jumpsuits."
era: 2017-2025
default_length_mode: medium
default_craziness: normal
historical_anchor_endgame: END-PRISON-003
warning: |
  This template dramatizes the publicly reported Frank / Charlie Javice arc
  using only facts established in court (SDNY indictment and trial), in the
  JPMorgan civil suit, and in mainstream reporting (Bloomberg, Forbes, NYT,
  CNBC, the trial transcripts). All real-named figures appear strictly as
  reactions or as set decoration consistent with the public record.
---

# Template: Frank

The "synthetic users for a strategic acquirer" arc — the textbook for what happens when due diligence is replaced with FOMO and a 30-minute Jamie Dimon meeting. You start in summer 2021, mid-acquisition negotiations with JPMorgan Chase, and your engineer just refused to generate the user database you asked for. The friend you paid $18,000 to is, conveniently, willing. Run it straight and you get the 7-year sentence and the Pilates instructor career. Run it differently and the simulator finds out whether honest Frank could have lived through FAFSA simplification.

## Company Bible

```yaml
company:
  name: frank
  display_name: Frank
  one_liner: "TurboTax for FAFSA — software that makes the federal student financial aid form actually fillable."
  industry: fintech
  funding_stage: series_a
  funding_total_usd: 20000000  # ~$20M raised before the JPM acquisition
  notable_investors:
    - "Aleph"
    - "Apollo Global Management"
    - "Reach Capital"
    - "Marc Rowan (Apollo CEO, personal)"
    - "Various edtech / fintech angels"
  founded_year: 2017

founders:
  - name: Charlie Javice
    role: Founder & CEO
    persona_vibe: ex_mckinsey  # Wharton + cable-news polish, not technically McKinsey
    public_quotes:
      - "I did something that runs against the grain of my upbringing. I made choices that I will spend my entire life regretting. (sentencing allocution, September 30, 2025)"
      - "JPMorgan had buyer's remorse. (defense theory at trial, March 2025)"
      - "[Cable news appearances 2018-2021 marketing Frank as 'TurboTax for student aid']"
    notable_history:
      - "UPenn Wharton; founded TAPD (later Frank) in 2017 fresh out of school"
      - "Forbes 30 Under 30 (Finance, 2019)"
      - "Sold Frank to JPMorgan Chase for $175M in September 2021"
      - "Personally pocketed ~$29M from the sale; named Managing Director at JPMorgan, overseeing student-focused products"
      - "Indicted May 2023 on securities fraud, wire fraud, bank fraud, conspiracy"
      - "Convicted on all 4 counts March 28, 2025"
      - "Sentenced September 30, 2025 — 85 months federal + $22M forfeiture + $287.5M joint restitution with Olivier Amar"
      - "Per prosecution: sent a 2022 text calling it 'ridiculous' that Elizabeth Holmes got 11 years (cited at her own sentencing)"
      - "Post-conviction, while awaiting sentencing, became a Pilates instructor in South Florida; argued ankle monitor hindered her ability to teach"
      - "As of May 2026, on bail pending appeal, fighting ankle bracelet again citing 'health matters'"
    twitter_handle: "@charlie_javice"
  - name: Olivier Amar
    role: Chief Growth Officer
    persona_vibe: second_time_founder
    public_quotes: []
    notable_history:
      - "Joined Frank as CGO; co-architect of the user-inflation pitch"
      - "Indicted alongside Javice; convicted; $287.5M joint restitution"

product:
  category_noun: "consumer fintech for student aid"
  the_thing_it_does: "Software that walks students through the FAFSA, simplifies the data entry, integrates with state aid programs, and (in the 2021 pitch deck) gives JPMorgan Chase a Gen Z customer-acquisition pipeline of 4.25 million users with a runway to 10 million by year-end."
  buzzwords_used:
    - "TurboTax for FAFSA"
    - "Gen Z financial wellness"
    - "lifelong customers"
    - "financial aid copilot"
    - "student-first"
    - "democratizing higher ed financing"
    - "frictionless aid application"
    - "scale at JPM"
  customer_archetype: "High school seniors and college students who would rather give a fintech app their parents' tax returns than fill out the FAFSA themselves. Per the deck, 'lifelong Chase customers' as soon as JPM closes the acquisition."

market:
  competitors:
    - "FAFSA.gov (the actual government form)"
    - "Sallie Mae"
    - "Edvisors"
    - "Earnest"
    - "College Ave"
  comparable_blowups:
    - "Theranos (the user-trust precedent)"
    - "IRL (the synthetic-user precedent)"
    - "HeadSpin (the inflated-metric-to-fundraise precedent)"

vibe:
  twitter_presence: poster  # cable-news loop more than Twitter
  press_coverage_so_far: hot  # peak Forbes-30u30 polish, peak cable-news circuit
  notable_dirt:
    - "Frank actually had ~300,000 real users; pitched to JPMorgan as 4.25M (~13x inflation)"
    - "When JPM asked to verify users, Javice cited 'user privacy and ToS' as reasons not to share. JPM hired a third-party marketing firm to verify; the firm only counted data fields, not real users."
    - "Javice asked Frank's chief engineer Patrick Vovor to generate synthetic data; he refused, asking if it was legal. Per testimony, Javice and Olivier Amar told him 'We don't want to end up in orange jumpsuits.'"
    - "Javice paid a college friend (a data scientist / professor) ~$18,000 to create a synthetic database of 4M+ fake names, emails, addresses, and 'pedigree information'"
    - "JPM caught it because Frank-customer marketing emails had extremely low delivery and open rates — the test the prosecution called 'sending mail to people who don't exist'"
    - "JPM filed civil fraud December 2022; SDNY indicted May 2023; convicted on all 4 counts March 28, 2025"
    - "The deal terms made Javice a JPM employee, which under Delaware law forced JPM to pay her legal fees — over $100M — for criminal AND civil cases"
    - "Judge Hellerstein at sentencing: 'Among the many commandments in the bible are the commandments of just weights and measures. Yours was not a just weight and measure.'"
    - "Prosecution: 'They acquired a crime scene.'"
    - "Judge Hellerstein chastised JPM: 'they have a lot to blame themselves' for inadequate due diligence"
    - "Defense at trial attacked Patrick Vovor's character — suggested he was resentful that Javice didn't date him"
    - "Jamie Dimon took a 30-minute meeting with Javice during negotiations"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly summer 2021, JPM acquisition diligence underway):**
  - valuation_usd: 175_000_000  # the JPM offer
  - cash_usd: 8_000_000
  - revenue_usd: 5_000_000  # actual; the pitched figure is ~10x
  - burn_usd_monthly: 600_000
  - headcount: 50
  - fbi_awareness: 0.05  # JPM hasn't sued yet; SDNY isn't on the case yet
  - fraud_score: 0.85  # the synthetic database is being commissioned right now
  - reputation: 0.90  # Forbes 30u30, cable news, "TurboTax for FAFSA" loop
  - heat: 0.10  # very low; the engineer who said no hasn't gone external yet
  - day_elapsed: ~1500  # founded 2017

- **Pre-planted seeds:**
  - `synthetic_users_seed` — the database is being commissioned from a college friend; ~$18K, ~4M fake records
  - `data_scientist_red_flag_seed` — Patrick Vovor refused; he'll be the trial witness
  - `jpmorgan_acquisition_seed` — the $175M offer is on the table; close it before diligence catches up
  - `verification_firm_loaded_seed` — JPM hires a third-party marketing firm; they'll count data fields, not people
  - `low_open_rates_seed` — the future-payoff: marketing emails to nonexistent people
  - `orange_jumpsuits_seed` — the literal phrase Javice/Amar used per testimony; will be quoted at trial
  - `vovor_disgruntled_seed` — the engineer who refused; the witness
  - `amar_loyal_seed` — Olivier Amar will be charged together; gates a different cooperation pathway
  - `cable_news_loaded_seed` — Javice's appearances are loaded; will be cited at trial
  - `forbes_30u30_loaded_seed` — the badge that opens doors and that lights up at sentencing
  - `dimon_30_minute_meeting_seed` — the canonical "Jamie Dimon's diligence was 30 minutes"
  - `holmes_text_seed` — the 2022 text calling it 'ridiculous' Holmes got 11 years; will be cited at her sentencing
  - `pilates_instructor_seed` — far-future payoff: post-conviction Pilates career, ankle-monitor litigation
  - `revenue_rounded_up_seed` — the user count is the canonical inflated metric

- **Pre-loaded figures:**
  - FIG-FRAUD-004 — Charlie Javice — historical anchor; the agent IS the fictional avatar; the real Javice is referenced retrospectively
  - FIG-FRAUD-001 — Elizabeth Holmes — anchor reference (the "ridiculous Holmes got 11 years" text)
  - FIG-PRESS-014 — Erin Griffith — the diligence-failure beat coverage at NYT
  - FIG-PRESS-007 — Eric Newcomer — VC newsletter coverage
  - FIG-LAW-007 — Preet Bharara — the "this is exactly the kind of case SDNY does" anchor (he'd left by 2017 but the office continuity is the reference)
  - // suggests EVT-LEGAL-NNN: SDNY indictment unsealed; JPM civil suit caption
  - // Additional figures the dossier mentions but not yet in cast.md: Jamie Dimon, Patrick Vovor (the engineer who refused), Olivier Amar, Judge Alvin Hellerstein, Marc Rowan. Reference in body, no FIG IDs yet.

- **Notable open events / pivotal decisions:**
  - The synthetic database is being commissioned right now from a college friend — pay the $18K and accept the file, or call it off?
  - Patrick Vovor refused — fire him, transfer him, or pay him out?
  - JPM's verification firm is asking for the data — hand over the synthetic file or stall?
  - Sign the $175M close and the JPM employment agreement (which will trigger Delaware fee-shifting later) or push for an earnout structure?
  - When the Holmes verdict comes in (January 2022), text "ridiculous" or stay quiet?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-3, the JPM diligence is underway; the engineer-refusal happens; the synthetic database is commissioned and delivered; the close happens at $175M (September 2021); Javice pockets $29M and joins JPM as Managing Director. Turn 4-6, JPM rolls out marketing to the acquired user list; open and click rates are catastrophically low; an internal memo asks why. Turn 7-9, JPM sues civilly (December 2022); the press cycle begins; Erin Griffith and others run the diligence-failure pieces. Turn 10-13, SDNY indictment May 2023; pre-trial motions through 2024. Turn 14-18, March 2025 conviction (all 4 counts), September 2025 sentencing (85 months), the "you compared yourself to Holmes" text submitted at sentencing. Turn 19-22, the appeal, the Pilates studio, the ankle monitor litigation. The historical anchor ending is END-PRISON-003 (the 7-year sentence with the post-conviction Pilates career). Divergent runs: refusing the synthetic database and walking from the JPM deal could push to END-FAILUP-001 (Frank stays small but legitimate, founder remains a 30u30 alum in good standing), or doubling down by also forging the JPM contract pushes toward a longer sentence and END-PRISON-001-tier.

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Charlie Javice** is post-conviction (March 2025) and freely satirizable per the policy. Bible-listed quotes are from public allocution, the trial record, and her own public press appearances. The fictional `[FOUNDER]` carries any in-run misconduct.
- **Olivier Amar** is post-conviction; same treatment.
- **Patrick Vovor** is a public trial witness whose refusal is on the public record; `safe_reaction`. The defense's character-attack on him is also public; it can be referenced as having happened, not endorsed.
- **Jamie Dimon, JPMorgan Chase** — `safe_reaction`. The 30-minute Dimon meeting is public; JPM's civil suit and the judge's "they have a lot to blame themselves" are public.
- **Judge Alvin Hellerstein, AUSAs** — `safe_quote` for sentencing remarks already on the public record (the "just weights and measures" quote).
- **Marc Rowan, Apollo, Aleph, Reach Capital** — `safe_reaction` for cap-table presence only.
- **Elizabeth Holmes** — `safe_reaction` historical anchor only. The "ridiculous" text is on the public record from Javice's sentencing.
- **Forbes / Forbes 30 Under 30** — `safe_reaction` brand reference; the "Hall of Shame" framing is Forbes's own public framing.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- US v. Javice (S.D.N.Y., 23-cr-251) trial record and sentencing memo
- ABC News, "Charlie Javice founder lied $175M startup faces sentencing" — https://abcnews.com/Business/charlie-javice-founder-lied-175m-startup-faces-sentencing/story?id=126034577
- Fortune, "Charlie Javice sentenced 7 years prison" (Sep 30, 2025) — https://fortune.com/2025/09/30/charlie-javice-sentenced-7-years-prison-jpmorgan-frank-fraud/
- CNN, "Charlie Javice Frank sentenced JPMorgan" — https://www.cnn.com/2025/09/30/business/charlie-javice-frank-sentenced-jpmorgan-intl
- CBS News, "JPMorgan Charlie Javice Frank founder convicted fraud $175M" — https://www.cbsnews.com/news/jpmorgan-charlie-javice-frank-founder-convicted-fraud-175-million/
- NPR, "Charlie Javice convicted defrauding JPMorgan" — https://www.npr.org/2025/03/29/nx-s1-5344434/charlie-javice-convicted-defrauding-jpmorgan
- ACFE Insights, "JPMorgan $175M due diligence error" — https://www.acfe.com/acfe-insights-blog/blog-detail?s=jpmorgan-175-million-dollar-due-diligence-error-charlie-javice
- Yahoo, "JPMorgan fraud convict Charlie Javice" — https://www.yahoo.com/news/articles/jpmorgan-fraud-convict-charlie-javice-100001802.html
- Charlie Javice Wikipedia entry — https://en.wikipedia.org/wiki/Charlie_Javice
- GetOutOfDebt, "Startup star to inmate" — https://getoutofdebt.org/175339/startup-star-to-inmate-the-175-million-fraud-that-landed-charlie-javice-in-prison
