---
template_id: outcome_health
display_name: Outcome Health
tagline: "Doctor's office TV. (Just don't ask how many TVs.)"
era: 2006-2024
default_length_mode: long
default_craziness: tame
historical_anchor_endgame: END-PRISON-002
warning: |
  This template dramatizes the publicly reported Outcome Health / Rishi Shah
  / Shradha Agarwal arc using only facts established in court (N.D. Ill.
  trial, conviction April 2023, sentencing 2024), in WSJ reporting (October
  2017 exposé), in the SEC complaint, and in Goldman/CapitalG/Pritzker civil
  filings. All real-named figures appear strictly as reactions or as set
  decoration consistent with the public record.
---

# Template: Outcome Health

The "we billed for screens we didn't install" arc — the adtech-impression-fabrication template, the Chicago version of Theranos. You start in early 2017, fresh off the $487.5M equity round at a $5.5B valuation, with the auditor having signed off on falsified 2015 and 2016 numbers. The new C-suite hire who joined three weeks ago is asking questions you don't want to answer. Run it straight and you get the 7.5-year sentence. Run it differently and the simulator finds out whether the underlying business — which actually worked — could have grown out of the lie.

## Company Bible

```yaml
company:
  name: outcome_health
  display_name: Outcome Health
  one_liner: "Ad-supported TV screens and tablets in doctors' waiting and exam rooms — patient education content paired with pharmaceutical advertising."
  industry: ai_app  # adtech-adjacent; closest tag in the controlled vocab
  funding_stage: growth
  funding_total_usd: 972500000  # $110M debt April 2016 + $375M debt Dec 2016 + $487.5M equity 2017
  notable_investors:
    - "Goldman Sachs Investment Partners"
    - "Alphabet's CapitalG"
    - "Pritzker Group"
    - "Norwest Venture Partners (early)"
    - "Leerink Capital Partners"
  founded_year: 2006

founders:
  - name: Rishi Shah
    role: Co-founder & CEO
    persona_vibe: ex_mckinsey  # Northwestern polish; not literal McKinsey
    public_quotes:
      - "[Public investor-call statements 2014-2017 promoting Outcome's network of installed screens]"
      - "[Press releases citing rapid expansion from 2,200 hospital waiting rooms to a national footprint]"
    notable_history:
      - "Co-founded ContextMedia at Northwestern University in 2006"
      - "Rebranded to Outcome Health 2016 after major debt raises"
      - "May 2017: $487.5M equity round at $5.5B valuation; he owned 80%"
      - "Forbes 400 in 2017 at age 31; net worth $3.6B paper"
      - "Fortune 40 Under 40 (with Agarwal)"
      - "Got naming rights on a downtown Chicago office tower"
      - "Indicted November 2019 for $1B fraud scheme"
      - "Convicted April 11, 2023 on multiple counts"
      - "Sentenced June 25, 2024 — 7.5 years federal prison"
      - "Currently out on bail pending 7th Circuit appeal"
    twitter_handle: null  # not Twitter-active
  - name: Shradha Agarwal
    role: Co-founder & President
    persona_vibe: ex_mckinsey
    public_quotes: []
    notable_history:
      - "Co-founded ContextMedia / Outcome Health with Shah at Northwestern, 2006"
      - "Fortune 40 Under 40"
      - "Convicted April 2023; sentenced 3 years halfway house"
  - name: Brad Purdy
    role: COO / CFO
    persona_vibe: second_time_founder
    public_quotes: []
    notable_history:
      - "Convicted April 2023; sentenced 27 months prison"
  - name: Ashik Desai
    role: Chief Growth Officer (later cooperator)
    persona_vibe: second_time_founder
    public_quotes: []
    notable_history:
      - "Pleaded guilty earlier; cooperated; sentenced 7 months prison"

product:
  category_noun: "ambient health-content adtech network"
  the_thing_it_does: "Install ad-supported TV screens and tablets in doctors' waiting rooms and exam rooms; show patients health content; sell pharmaceutical advertising against those impressions; bill the pharma client per screen-month."
  buzzwords_used:
    - "point-of-care"
    - "patient education"
    - "ambient health intelligence"
    - "the largest healthcare network of its kind"
    - "ROI-positive pharma marketing"
    - "verified placement"
    - "exam-room engagement"
    - "the doctor's office of the future"
  customer_archetype: "Pharmaceutical brand teams at the top 20 pharma companies, who have a media budget, a target patient profile, and a willingness to pay per impression on screens that — per the indictment — were sometimes invoiced as installed when they weren't."

market:
  competitors:
    - "PatientPoint"
    - "AccentHealth"
    - "ContextMedia (its own former name, now overlapping)"
    - "Health Monitor Network"
  comparable_blowups:
    - "Theranos (the healthtech-fraud Pantheon precedent)"
    - "Nikola (the 'we said we made it, we didn't make it' precedent)"

vibe:
  twitter_presence: dormant
  press_coverage_so_far: minimal  # WSJ exposé hasn't dropped at turn 0
  notable_dirt:
    - "From 2011-2017, lied about how many doctors' offices had screens installed; double-billed pharmaceutical clients for ads on screens that didn't exist"
    - "Used inflated revenue to secure $110M debt financing April 2016 (with a $30.2M dividend to Shah)"
    - "Used inflated revenue to secure $375M debt financing December 2016"
    - "Used inflated revenue to secure $487.5M equity financing early 2017 ($225M dividend round to Shah and Agarwal personally)"
    - "Auditor was given falsified data and approved overstated 2015 and 2016 financials"
    - "A new C-suite hire raised internal alarms within weeks of joining and lasted 3 weeks before leaving"
    - "WSJ exposé October 2017: 'U.S. Startup Outcome Health Misled Advertisers by Charging Them for Ads on More Screens Than It Had Installed'"
    - "November 2017: Goldman, CapitalG, Pritzker all sue"
    - "January 2018: Shah and Agarwal step down; reinvest $159M of their dividends back into the company"
    - "Howard Tullman (Chicago tech investor): Outcome Health is 'our version of Theranos'"
    - "Prosecutors: 'Rishi Shah was the architect of a billion-dollar fraud. Brick by brick, lie upon lie, and rationalization after rationalization, Shah built a rotten foundation at Outcome.'"
    - "The underlying business model (ad-supported screens in waiting rooms) was viable; the company exists today under PE ownership doing exactly that"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly Q2 2017, post-$487.5M equity round, six months before WSJ exposé):**
  - valuation_usd: 5_500_000_000
  - cash_usd: 350_000_000
  - revenue_usd: 200_000_000  # claimed; actual is meaningfully smaller
  - burn_usd_monthly: 12_000_000
  - headcount: ~600
  - fbi_awareness: 0.10  # an internal whistleblower will trigger SEC by Q4
  - fraud_score: 0.85  # the auditor has signed off on falsified data; the new exec who's asking questions is on Day 18
  - reputation: 0.85  # Forbes 400, Fortune 40 Under 40, Chicago tower naming rights
  - heat: 0.20  # WSJ tip exists; not yet a story
  - day_elapsed: ~4000  # founded 2006

- **Pre-planted seeds:**
  - `doctor_office_tv_seed` — the screens themselves are the central artifact
  - `inflated_screen_count_seed` — the canonical metric inflation: claimed installations versus actual installations
  - `double_billing_seed` — same screen invoiced to multiple pharma clients
  - `auditor_compromised_seed` — the auditor accepted falsified data in 2015 and 2016
  - `dividend_round_seed` — the $30.2M and $225M dividend rounds; will be central to the indictment's "personal enrichment from fraud-inflated capital" theory
  - `new_exec_concerned_seed` — the C-suite hire who lasted 3 weeks; will be a witness
  - `wsj_circling_seed` — the October 2017 WSJ piece is loaded
  - `goldman_sues_seed` — Goldman, CapitalG, Pritzker lawsuits load on WSJ-publication
  - `chicago_tower_loaded_seed` — the naming rights are a postmortem-photograph artifact
  - `desai_cooperator_seed` — Chief Growth Officer Ashik Desai will plead first
  - `revenue_rounded_up_seed` — the canonical metric inflation
  - `theranos_comparison_seed` — Howard Tullman's "our version of Theranos" line is loaded as the local-press framing

- **Pre-loaded figures:**
  - FIG-FRAUD-021 — Outcome Health Founders — historical anchor; the agent IS the fictional avatar; the real Shah / Agarwal are referenced retrospectively
  - FIG-FRAUD-001 — Elizabeth Holmes — anchor reference (the healthtech / regulated-framework precedent; the explicit "our version of Theranos" comparison)
  - FIG-PRESS-001 — John Carreyrou — anchor reference for the WSJ-investigative-reporter archetype (although Outcome's WSJ coverage was a different reporter)
  - // suggests EVT-PR-NNN: WSJ exposé "Misled Advertisers" front-page drop
  - // suggests EVT-LEGAL-NNN: Goldman/CapitalG/Pritzker civil suit caption; DOJ indictment unsealing
  - // Additional figures the dossier mentions but not yet in cast.md: Howard Tullman, Brad Purdy, Ashik Desai. Reference in body, no FIG IDs yet.

- **Notable open events / pivotal decisions:**
  - The new C-suite hire is on Day 18 and asking questions — fire them, pay them out with NDA, or actually answer the questions?
  - The auditor wants to do a deeper sample for 2017 — give them the real data, give them the falsified data, or change auditors?
  - Take the second dividend ($225M) out of the equity round, or leave the cash in the company?
  - The WSJ has emailed for comment — engage, stonewall, or threaten?
  - Replace COO Brad Purdy and CGO Ashik Desai now (limit the cooperation chain) or keep them?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-3, the post-equity-round victory lap; Forbes 400, Fortune 40 Under 40, Chicago tower naming. Turn 4-6, the WSJ October 2017 exposé drops; Goldman/CapitalG/Pritzker sue within weeks. Turn 7-9, January 2018 founders step down, $159M dividend reinvestment; auditor restates 2015 and 2016 financials. Turn 10-13, November 2019 DOJ indictment; long pre-trial through 2022. Turn 14-17, April 2023 conviction (multi-defendant trial); 2024 sentencings (Shah 7.5y, Agarwal 3y halfway, Purdy 27mo, Desai 7mo as cooperator). Turn 18-20, Shah's 7th Circuit appeal, bail pending. The historical anchor ending is END-PRISON-002 (the 7.5-year sentence). Divergent runs: cleanly restating the financials before the WSJ piece could push to a settlement-only outcome (END-PRISON-005 civil-only) or to END-FAILUP-001 (the legitimate ad-screen business survives, no prison; this is roughly what the actual surviving business — now under PE — looks like).

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Rishi Shah, Shradha Agarwal, Brad Purdy, Ashik Desai** are post-conviction and freely satirizable per the policy. Bible-listed quotes are from the trial record and public press releases. The fictional `[FOUNDER]` carries any in-run misconduct.
- **Goldman Sachs, CapitalG (Alphabet), Pritzker Group** — `safe_reaction` for cap-table presence and the public civil suits.
- **Howard Tullman** (the Chicago tech investor whose "our version of Theranos" quote is widely reported) — `safe_quote`. Restate his actual public quote; do not put new content in his mouth.
- **The auditor** — referenced as having approved overstated financials, which is on the public record from the SEC complaint; do not name the audit firm with new accusations beyond what's in the public filings.
- **WSJ reporters who covered the 2017 piece** — `safe_reaction`; the long-read postmortem in-game runs under a fictional outlet pastiche.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- WSJ, "U.S. Startup Outcome Health Misled Advertisers by Charging Them for Ads on More Screens Than It Had Installed" (October 2017)
- US v. Shah et al. (N.D. Ill.) trial record
- Sixteen-Nine, "Outcome Health Co-founder Rishi Shah Sentenced to 7.5 Years" (July 1, 2024) — https://www.sixteen-nine.net/2024/07/01/outcome-health-co-founder-rishi-shah-sentenced-to-7-5-years-jail-time-for-fraud/
- Axios, "CEO Rishi Shah Outcome Health unicorn guilty of fraud" (April 13, 2023) — https://www.axios.com/2023/04/13/ceo-rishi-shah-outcome-health-unicorn-guilty-of-fraud
- Chicago Sun-Times, "Outcome Health CEO 7.5 years billion-dollar fraud" (June 27, 2024) — https://chicago.suntimes.com/crime/2024/06/27/outcome-health-ceo-7-1-2-years-billion-dollar-fraud
- Finshots, "Rishi Shah Shradha Agarwal Context Media Outcome Health billion-dollar scam" — https://finshots.in/archive/rishi-shah-shradha-agarwal-context-media-outcome-health-billion-dollar-scam/
- Rishi Shah Wikipedia entry — https://en.wikipedia.org/wiki/Rishi_Shah
- Outcome Health Wikipedia entry — https://en.wikipedia.org/wiki/Outcome_Health
- AOL, "Former Outcome Health CEO" — https://www.aol.com/former-outcome-health-ceo-rishi-223600721.html
