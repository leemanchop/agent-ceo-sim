---
template_id: headspin
display_name: HeadSpin
tagline: "Real devices, real networks, real ARR. Two out of three."
era: 2015-2024
default_length_mode: medium
default_craziness: tame
historical_anchor_endgame: END-PRISON-005
warning: |
  This template dramatizes the publicly reported HeadSpin / Manish Lachwani
  arc using only facts established in court (N.D. Cal. plea and sentencing,
  April 2024), in the SEC and DOJ complaints (August 2021), in The Information
  reporting (August 2020 recapitalization), in TechCrunch coverage of the
  PE sale (July 2024), and in mainstream coverage. All real-named figures
  appear strictly as reactions or as set decoration consistent with the
  public record.
---

# Template: HeadSpin

The "classic ARR inflation" arc — the textbook B2B SaaS revenue-recognition fraud, the example every late-stage VC's diligence team got asked about for two years after. You start in late 2019, post-Series C close at a $1.16B "unicorn" valuation, with Tiger Global on the cap table and the CEO personally controlling invoicing and revenue recognition. The board has been told to expect roughly $15M ARR; the deck the new investors saw said something larger. Run it straight and you get the 18-month sentence, the $1M fine, and the cents-on-the-dollar PE sale. Run it differently and the simulator finds out whether the actual product (which existed and worked) could have grown into the marketing.

## Company Bible

```yaml
company:
  name: headspin
  display_name: HeadSpin
  one_liner: "A remote service letting customers test mobile apps on real devices, on real networks, in real cities around the world."
  industry: enterprise_saas
  funding_stage: growth
  funding_total_usd: 117000000  # $11M A + $24.7M convertible + $20M B + ~$60M C
  notable_investors:
    - "Tiger Global Management (lead, Series C)"
    - "Dell Technologies Capital"
    - "Iconiq Capital"
    - "Battery Ventures"
    - "Comcast Ventures"
  founded_year: 2015

founders:
  - name: Manish Lachwani
    role: Co-founder & CEO
    persona_vibe: second_time_founder
    public_quotes:
      - "[Public investor-call statements 2018-2020 promoting HeadSpin's enterprise customer footprint]"
      - "[2020 Forbes profile material framing HeadSpin as a 'unicorn without the notoriety']"
    notable_history:
      - "Co-founded HeadSpin in 2015 with Brien Colwell (ex-Palantir, ex-Quora)"
      - "Pleaded guilty April 2024 to defrauding investors"
      - "Sentenced April 2024 — 18 months federal prison + $1M fine"
      - "Personally controlled invoicing and revenue recognition during the fraud window (per SEC complaint)"
      - "Personally sold $2.5M of his own shares in a secondary"
    twitter_handle: null
  - name: Brien Colwell
    role: Co-founder & CTO
    persona_vibe: second_time_founder
    public_quotes: []
    notable_history:
      - "Ex-Palantir, ex-Quora; co-founded HeadSpin with Lachwani 2015"
      - "Not charged"

product:
  category_noun: "device-and-network testing platform"
  the_thing_it_does: "Spin up real iPhones and Android handsets in real networks — Verizon in San Francisco, Vodafone in Mumbai, KT in Seoul — and run automated mobile-app QA against them; surface latency, packet loss, and crash data; replace internal device labs with a SaaS API."
  buzzwords_used:
    - "real device, real network"
    - "global device cloud"
    - "performance intelligence"
    - "AI-powered QA"
    - "carrier-grade testing"
    - "5G test labs"
    - "ARR" # the central inflated metric
    - "logo expansion"
    - "net revenue retention 130%+"
  customer_archetype: "Enterprise mobile teams at Fortune 500 companies (banks, retailers, gaming, streaming) who need to test their app on a Samsung S20 in São Paulo at 4 AM and would rather pay HeadSpin than maintain an internal device lab."

market:
  competitors:
    - "BrowserStack"
    - "Sauce Labs"
    - "Perfecto (Perforce)"
    - "Kobiton"
    - "AWS Device Farm"
  comparable_blowups:
    - "Theranos (the public-record-fraud Pantheon precedent)"
    - "Outcome Health (the inflated-billings parallel)"
    - "Frank (the inflated-metric-during-acquisition-diligence parallel)"

vibe:
  twitter_presence: dormant
  press_coverage_so_far: minimal  # The Information's August 2020 recap is loaded
  notable_dirt:
    - "Per SEC complaint: 'at least 2018' through early 2020, Lachwani inflated ARR by $51-55M"
    - "Booked revenue from prospects who inquired but never signed"
    - "Booked revenue from past customers who'd churned"
    - "Booked inflated revenue from current customers (claiming far more business than they actually had)"
    - "Maintained personal control over invoicing and revenue recognition"
    - "Created fake invoices"
    - "Sold $2.5M of his own shares in a secondary during the inflation window"
    - "March 2020: HeadSpin board told to expect $15M ARR rather than the much higher figure being told to investors"
    - "May 2020: Lachwani quietly replaced as CEO; the change went unreported for months"
    - "August 2020: The Information (Cory Weinberg) reported HeadSpin recapitalizing — Series C value lowered 80%, $95M returned to investors, valuation from $1.16B to ~$300M"
    - "August 2021: SEC files civil charges; DOJ arrests Lachwani"
    - "April 2024: Lachwani sentenced 18 months prison + $1M fine after pleading guilty"
    - "July 2024: HeadSpin fire-sold to PE firm PartnerOne; employees' options 'underwater' and canceled 'for no consideration'; sale was 'cents on the dollar' of the unicorn valuation"
    - "Tiger Global is famously cash-heavy and diligence-light; the Lachwani case became the textbook example"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly Q4 2019 / Q1 2020 — Series C just closed at $1.16B, internal ARR vs. board ARR is diverging):**
  - valuation_usd: 1_160_000_000
  - cash_usd: 75_000_000
  - revenue_usd: 15_000_000  # actual ARR per board telling
  - burn_usd_monthly: 3_000_000
  - headcount: ~140
  - fbi_awareness: 0.10  # SEC will be involved in 18 months
  - fraud_score: 0.85  # the inflation is fully in place; the cooperator-active seed is downstream
  - reputation: 0.80  # Forbes, "unicorn without the notoriety," Tiger Global blessed
  - heat: 0.10  # The Information has tipsters but no story yet
  - day_elapsed: ~1700  # founded 2015

- **Pre-planted seeds:**
  - `arr_inflation_seed` — the central metric inflation; $51-55M of fictitious ARR
  - `cooperator_active_seed` — internal employees aware the numbers don't match are pre-armed; one will become the SEC's first cooperator
  - `personal_control_invoicing_seed` — Lachwani personally signs invoices; auditor flag waiting
  - `fake_invoices_seed` — actual fake invoices in the books
  - `secondary_sale_seed` — Lachwani sold $2.5M during the inflation window; this is the personal-enrichment hook
  - `weinberg_circling_seed` — Cory Weinberg at The Information has tipsters; the August 2020 recap piece is loaded
  - `tiger_diligence_light_seed` — Tiger Global's cap-table presence is itself a tell about the diligence environment
  - `board_told_different_seed` — board sees $15M, investors see ~$70M; the diff is the indictment
  - `cofounder_clean_seed` — Brien Colwell was not charged; gates a clean-cofounder cooperation pathway
  - `partnerone_loaded_seed` — far-future payoff: the PE firefire-sale of HeadSpin July 2024
  - `revenue_rounded_up_seed` — canonical
  - `unicorn_status_seed` — the $1.16B Forbes "unicorn without the notoriety" framing

- **Pre-loaded figures:**
  - FIG-FRAUD-008 — Manish Lachwani — historical anchor; the agent IS the fictional avatar
  - FIG-PRESS-013 — Kate Clark / The Information — paywalled-scoop voice (although the actual HeadSpin reporter was Cory Weinberg)
  - // suggests EVT-PR-NNN: The Information August 2020 recap piece by Cory Weinberg
  - // suggests EVT-LEGAL-NNN: SEC complaint (August 2021); DOJ arrest
  - // suggests EVT-LEGAL-NNN: PartnerOne PE firefire-sale (July 2024)
  - // Additional figures the dossier mentions but not yet in cast.md: Cory Weinberg (The Information). Reference in body, no FIG IDs yet. (Note: Tiger Global / Chase Coleman is in the supporting-cast section of the dossier as "the super-investor who got burned" archetype.)

- **Notable open events / pivotal decisions:**
  - The board is asking for a Q1 ARR reconcile against the deck — produce the deck number, produce the board number, or produce a third compromise number?
  - A senior salesperson is asking why their commission is being computed off a number that doesn't match what's in Salesforce — promote them, transfer them, fire them?
  - The audit firm's senior is doing sample customer confirmations — pre-call the customers, intercept the confirmations, or change auditors?
  - Sell the personal $2.5M secondary now or wait?
  - When the Information emails for comment, engage, stonewall, or pre-empt with a recap announcement?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-3, the Series C victory lap; Forbes "unicorn without the notoriety"; the inflation continues. Turn 4-6, March 2020 — the board is told a different ARR than the investors; an internal review begins. Turn 7-9, May 2020 Lachwani quietly replaced; The Information's Cory Weinberg files in August 2020 — the recap and 80% valuation cut, $95M returned. Turn 10-12, August 2021 SEC civil charges and DOJ arrest. Turn 13-15, the long pre-trial; April 2024 plea and 18-month sentence. Turn 16-18, July 2024 PartnerOne firesale of HeadSpin for cents on the dollar; option-cancellation of employees. The historical anchor ending is END-PRISON-005 (the relatively short 18-month sentence; lighter than Holmes/Shah/Watson because of an early plea). Divergent runs: voluntarily restating revenue and offering investors a buyback before The Information story could push to END-CULT-001 / END-FAILUP-002 (settlement-only). Doubling down by also forging the customer-confirmation responses to the auditor pushes toward END-PRISON-001-tier exposure.

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Manish Lachwani** is post-plea (April 2024) and freely satirizable per the policy. Bible-listed quotes are paraphrases of Forbes profile material and SEC-complaint factual allegations.
- **Brien Colwell** was not charged; he is `safe_reaction` only. Treat as a co-founder presence in the bible; do not put new accusatory content on him.
- **Tiger Global Management, Dell Technologies Capital, Iconiq Capital, etc.** — `safe_reaction` cap-table presence. The "Tiger Global is diligence-light" framing is widely reported as a pattern, not as a specific accusation in any individual deal.
- **Cory Weinberg / The Information** — `safe_reaction`. Weinberg's August 2020 piece is on the public record and may be referenced as having "first reported" things. The long-read postmortem in-game runs under a fictional outlet pastiche.
- **PartnerOne (the PE acquirer)** — `safe_reaction`. The July 2024 firesale is on the public record; do not generate new accusations about PartnerOne's conduct.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- DOJ press release, Lachwani arrest (Aug 2021) — https://www.justice.gov/usao-ndca/pr/co-founder-and-former-ceo-palo-alto-based-start-technology-company-headspin-charged
- TechCrunch, "SEC and DOJ just charged this startup CEO with fraud, saying he lied to Tiger and others" (Aug 25, 2021) — https://techcrunch.com/2021/08/25/the-sec-and-the-doj-just-charged-this-startup-ceo-with-fraud-saying-he-lied-to-tiger-and-others/
- CNBC, "SEC and DOJ charge former HeadSpin CEO with misstating financials" (Aug 26, 2021) — https://www.cnbc.com/2021/08/26/sec-and-doj-charge-former-headspin-ceo-with-misstating-financials.html
- CFO.com, "Ex-HeadSpin CEO charged with lying to investors" (Aug 2021) — https://www.cfo.com/fraud/2021/08/ex-headspin-ceo-charged-with-lying-to-investors/
- Axios, "Manish Lachwani HeadSpin prison fraud" (April 22, 2024) — https://www.axios.com/2024/04/22/silicon-valley-manish-lachwani-headspin-prison-fraud
- TechCrunch, "HeadSpin sold to PE firm for cents on the dollar" (July 12, 2024) — https://techcrunch.com/2024/07/12/headspin-whose-founder-in-prison-for-fraud-sold-to-pe-firm-for-cents-on-the-dollar-sources-say/
- CFO Dive, "HeadSpin returning $95M after review finds irregularities" — https://www.cfodive.com/news/headspin-said-to-be-returning-95m-after-review-finds-irregularities/582875/
- Business of Business, "Manish Lachwani HeadSpin arrest fraud" — https://www.businessofbusiness.com/articles/Manish-Lachwani-headspin-arrest-fraud/
- The Information (Cory Weinberg) HeadSpin recap coverage (August 2020, paywalled)
