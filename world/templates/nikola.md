---
template_id: nikola
display_name: Nikola
tagline: "The truck wasn't running. The truck was rolling."
era: 2014-2024
default_length_mode: medium
default_craziness: normal
historical_anchor_endgame: END-PRISON-004
warning: |
  This template dramatizes the publicly reported Nikola / Trevor Milton arc
  using only facts established in court (S.D.N.Y. trial, October 2022), in
  the Hindenburg Research report of September 10, 2020, in the SEC settlement
  ($125M, December 2021), and in mainstream reporting (Bloomberg, WSJ, CBS,
  TechCrunch). All real-named figures appear strictly as reactions or as set
  decoration consistent with the public record.
---

# Template: Nikola

The "truck rolling downhill" arc — the patron-saint demo-fraud template, the precedent every AI-wrapper company gets compared to in 2025-2026. You start in late summer 2020, mid-celebration of the GM partnership, two days before Hindenburg drops "How to Parlay An Ocean of Lies Into a Partnership With the Largest Auto OEM in America." The Nikola One promo video has been celebrated for two years; the truck in it was towed to the top of a hill and rolled down. Run it straight and you get the 4-year sentence, the (March 2025) Trump pardon, and the 2024 Nikola bankruptcy. Run it differently and the simulator finds out whether hydrogen could have been real.

## Company Bible

```yaml
company:
  name: nikola
  display_name: Nikola Motor
  one_liner: "Hydrogen fuel-cell electric semi-trucks for long-haul trucking — ground-up engineered with proprietary battery and hydrogen technology."
  industry: hardware
  funding_stage: ipo  # SPAC'd via VectoIQ June 2020
  funding_total_usd: 1500000000  # SPAC + equity raises pre-collapse
  notable_investors:
    - "VectoIQ (SPAC merger partner, June 2020)"
    - "General Motors (announced 11% stake, scaled back)"
    - "ValueAct"
    - "Various long-only public-market funds post-SPAC"
    - "Iveco / CNH Industrial (early strategic)"
  founded_year: 2014

founders:
  - name: Trevor Milton
    role: Founder & Executive Chairman
    persona_vibe: genuine_believer
    public_quotes:
      - "We are not Tesla. We are not even close to Tesla. We are doing something completely different. (multiple investor calls, 2018-2020)"
      - "Hydrogen-electric. (the literal stencil on the side of a vehicle that was actually powered by natural gas)"
      - "[Twitter / podcast appearances 2018-2020 talking up production capability that did not exist]"
    notable_history:
      - "Founded Nikola Motor in 2014 in a Utah basement, named after Tesla's 'other' namesake"
      - "Took Nikola public via SPAC merger with VectoIQ, June 2020 — at peak briefly worth more than Ford"
      - "Resigned as Executive Chairman September 20, 2020, ten days after Hindenburg's report"
      - "Federal grand jury indicted on 3 counts of fraud, July 2021"
      - "Convicted October 2022 on 1 count securities fraud, 2 counts wire fraud"
      - "Sentenced December 18, 2023 — 4 years prison + $1M fine + $168M restitution"
      - "Pardoned by President Trump, March 2025"
      - "Per public reporting: restitution remains largely unpaid"
      - "Was on early Forbes lists pre-collapse"
    twitter_handle: "@nikolatrevor"

product:
  category_noun: "hydrogen fuel-cell trucking platform"
  the_thing_it_does: "Build hydrogen-fueled long-haul trucks (Nikola One, Two, Tre) and an in-house hydrogen production network; build the Badger pickup truck with GM; sell the trucks to fleet customers under a bundled fuel + maintenance contract."
  buzzwords_used:
    - "hydrogen-electric"
    - "ground-up engineered"
    - "proprietary battery technology"
    - "in-house hydrogen production"
    - "zero-emissions trucking"
    - "the Tesla of trucking"
    - "the Badger" # the GM pickup
    - "the Nikola One"
    - "the Nikola Tre"
    - "fuel-cell range"
  customer_archetype: "Long-haul fleet operators (Anheuser-Busch was the announced canonical customer) who would buy hydrogen trucks bundled with hydrogen fuel via Nikola's announced (nonexistent) production network"

market:
  competitors:
    - "Tesla Semi"
    - "Daimler Trucks"
    - "Volvo Trucks / Renault"
    - "Hyzon Motors"
    - "Hyundai (Xcient)"
    - "Cummins (engine baseline)"
  comparable_blowups:
    - "Theranos (the demo-fraud / wrapper-disclosure precedent)"
    - "Lordstown Motors (parallel-era SPAC EV blowup)"
    - "Faraday Future (parallel-era hardware vapor)"

vibe:
  twitter_presence: poster
  press_coverage_so_far: hot
  notable_dirt:
    - "Hindenburg Research, September 10, 2020 — published 'How to Parlay An Ocean of Lies Into a Partnership With the Largest Auto OEM in America' two days after the GM deal announcement"
    - "Hindenburg: the 'Nikola One in motion' video (December 2018) was filmed by towing a non-functional prototype to the top of a hill and letting it roll down by gravity"
    - "Hindenburg: 'Hydrogen-electric' was stenciled on the side of a vehicle that was actually powered by natural gas"
    - "Hindenburg: Milton claimed Nikola was producing its own hydrogen at a fraction of industry cost — there was no production"
    - "Hindenburg: Milton claimed proprietary batteries — they were bought from another company"
    - "Hindenburg: the Badger pickup was a render"
    - "September 8, 2020: Nikola announced GM partnership (GM would manufacture the Badger and take an 11% stake); two days later, Hindenburg dropped"
    - "Milton resigned September 20, 2020, 10 days after Hindenburg"
    - "GM scaled back the partnership massively in 2021"
    - "Nikola paid $125M settlement to SEC, December 2021"
    - "Federal grand jury indicted Milton on 3 counts of fraud, July 2021"
    - "Convicted October 2022; sentenced 4 years December 18, 2023"
    - "Judge Edgardo Ramos: 'Over the course of many months, you used your considerable social media skills to tout your company in ways that were materially false.'"
    - "Nikola itself filed for bankruptcy in 2024"
    - "Trump pardoned Milton in March 2025"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly September 9, 2020 — one day after the GM deal announcement, one day before Hindenburg drops):**
  - valuation_usd: 30_000_000_000  # peak post-GM-deal market cap
  - cash_usd: 700_000_000  # post-SPAC corporate cash
  - revenue_usd: 100_000  # de minimis; mostly research / pre-orders
  - burn_usd_monthly: 25_000_000
  - headcount: ~300
  - fbi_awareness: 0.05  # not yet
  - fraud_score: 0.85  # demo fraud is in the public videos, the GM diligence cycle is about to fail
  - reputation: 0.92  # post-GM-deal peak, pre-Hindenburg
  - heat: 0.40  # short-seller chatter has begun; financial Twitter is sniffing
  - day_elapsed: ~2300  # founded 2014

- **Pre-planted seeds:**
  - `truck_rolling_downhill_seed` — the December 2018 Nikola One video is the canonical demo-fraud artifact; the gravity-on-a-hill beat
  - `hindenburg_research_seed` — Nathan Anderson's report is two days out; the catalyst-publication seed
  - `gm_deal_loaded_seed` — the September 8 GM partnership announcement; will be partially unwound within months
  - `natural_gas_stencil_seed` — the "hydrogen electric" sticker on a natural-gas-powered vehicle; physical evidence
  - `hydrogen_production_imaginary_seed` — the in-house hydrogen network exists in slides only
  - `proprietary_battery_imaginary_seed` — the batteries are bought; "ground-up engineered" is wrong
  - `badger_render_seed` — the GM pickup truck is a 3D render
  - `social_media_promotion_seed` — Milton's Twitter and podcast posts are the source documents the indictment will cite (Judge Ramos: 'considerable social media skills')
  - `spac_proceeds_loaded_seed` — VectoIQ-merger cash means the company is funded for years; gates the long-arc decisions
  - `pardon_arc_seed` — far-future payoff: Trump pardons Milton March 2025
  - `cofounder_disgruntled_seed` — internal employees who watched the demos get filmed will be witnesses
  - `revenue_rounded_up_seed` — the pre-orders pipeline is the inflated metric
  - `valuation_inflated_seed` — peak-of-SPAC-cycle market cap

- **Pre-loaded figures:**
  - FIG-FRAUD-005 — Trevor Milton — historical anchor; the agent IS the fictional avatar; the real Milton is referenced retrospectively
  - FIG-FRAUD-001 — Elizabeth Holmes — anchor reference (the demo-fraud Pantheon precedent in healthtech)
  - FIG-PRESS-009 — Matt Levine — Money Stuff "the truck was rolling" coverage is loaded
  - FIG-VC-013 — Chamath Palihapitiya — peer-SPAC-cycle voice; the All-In monologue voice for "the SPAC era was a mistake actually"
  - // suggests EVT-PR-NNN: Hindenburg report drop ("How to Parlay An Ocean of Lies...")
  - // suggests EVT-LEGAL-NNN: SEC $125M settlement filing; SDNY indictment unsealing
  - // Additional figures the dossier mentions but not yet in cast.md: Nathan Anderson (Hindenburg Research), Judge Edgardo Ramos, Mary Barra (GM CEO). Reference in body, no FIG IDs yet. (Note: Hindenburg Research dissolved in 2025 per the dossier.)

- **Notable open events / pivotal decisions:**
  - Hindenburg drops in 24 hours — pre-empt with a self-disclosure ("the truck rolled, here's the new build plan"), or stay silent and try to ride out the report?
  - GM's diligence team has more questions — give them the actual prototype access, or keep them on slides?
  - The Badger render is on the website — replace with a "concept image" disclaimer or leave it?
  - Resign now, or fight? (Milton resigned 10 days after Hindenburg in real life)
  - Pay the SEC $125M now, or fight to settle later?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-2, the GM deal celebration; the cap-table peaks. Turn 3, Hindenburg drops; financial Twitter is on fire within the hour; the stock halves in 48 hours. Turn 4-6, internal investigation; Milton resigns September 20 (10 days post-Hindenburg). Turn 7-9, the SEC investigation opens; July 2021 federal indictment; civil settlement at the company level ($125M, December 2021). Turn 10-13, October 2022 conviction (1 count securities fraud, 2 counts wire fraud); December 2023 sentencing (4 years + $1M + $168M restitution). Turn 14-16, the appeal, the (March 2025) Trump pardon, the 2024 company bankruptcy. The historical anchor ending is END-PRISON-004 (the 4-year sentence with the pardon kicker — the dossier explicitly notes pardons are now a viable post-conviction strategy). Divergent runs: pre-empting Hindenburg with a self-disclosure could push to END-CULT-001 (the documentary, no prison) or END-FAILUP-002. Pivoting hard to a legitimate hardware company with an honest 2-3 year roadmap could thread to END-GENUINE.

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Trevor Milton** is post-conviction (October 2022), post-pardon (March 2025), and freely satirizable per the policy. Bible-listed quotes are from public investor calls, podcasts, the Hindenburg report's quoted material, and the trial record. The fictional `[FOUNDER]` carries any in-run misconduct.
- **Hindenburg Research / Nathan Anderson** — `safe_reaction`. The report is a public document and may be quoted as having "first reported" things. (Note: per the dossier, Hindenburg Research dissolved in 2025; treat them as historical at this point.)
- **General Motors / Mary Barra** — `safe_reaction` for the public partnership announcement and the public unwinding. No new claims about GM internal conduct.
- **Judge Edgardo Ramos, the SDNY AUSAs** — `safe_quote` for sentencing remarks already on the public record.
- **President Trump** — `safe_reaction` for the public pardon (March 2025), which is a presidential public act.
- **Anheuser-Busch, the announced fleet customer** — `safe_reaction`; the canceled order is on the public record.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- Hindenburg Research, "Nikola: How to Parlay An Ocean of Lies Into a Partnership With the Largest Auto OEM in America" (September 10, 2020) — archived at hindenburgresearch.com
- US v. Milton (S.D.N.Y., 21-cr-478) trial record
- DOJ press release, Milton sentencing (December 18, 2023)
- TechCrunch, "Nikola founder Trevor Milton sentenced to 4 years for securities fraud" — https://techcrunch.com/2023/12/18/nikola-founder-trevor-milton-sentenced-to-4-years-for-securities-fraud/
- CBS News, "Trucks fraud investors Trevor Milton Nikola electric" — https://www.cbsnews.com/news/trucks-fraud-investors-trevor-milton-nikola-electric-zero-emissions/
- Trevor Milton Wikipedia entry — https://en.wikipedia.org/wiki/Trevor_Milton
- Prisonpedia, Trevor Milton — https://prisonpedia.com/wiki/Trevor_Milton
- SEC settlement order (SEC v. Nikola, December 2021) — sec.gov
