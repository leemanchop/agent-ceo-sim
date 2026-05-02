---
template_id: theranos
display_name: Theranos
tagline: "One drop of blood. Hundreds of tests. Zero working machines."
era: 2003-2018
default_length_mode: long
default_craziness: normal
historical_anchor_endgame: END-PRISON-002
warning: |
  This template dramatizes the publicly reported Theranos arc using only
  facts established in court, in the SEC settlement, and in WSJ reporting
  (John Carreyrou's series, later collected in *Bad Blood*). All real-named
  figures appear strictly as reactions or as set decoration consistent with
  the public record. Per-figure conduct beyond the public record is reserved
  for the fictional `[FOUNDER]` slot.
---

# Template: Theranos

The original "celebrity board, broken machine, Walgreens pilot, WSJ reporter circling" arc. You start in 2014 — post-Series C, $9B paper valuation, the board is full of generals and statesmen, the Edison is mostly running on Siemens analyzers in a back room, and a WSJ reporter just got a tip from a former employee. Run it straight and you get the 11-year sentence. Run it differently and the simulator finds out what would have happened.

## Company Bible

```yaml
company:
  name: theranos
  display_name: Theranos
  one_liner: "A finger-prick blood test that runs hundreds of diagnostic assays from a single drop, on a tabletop device called Edison."
  industry: biotech
  funding_stage: series_c_plus
  funding_total_usd: 700000000
  notable_investors:
    - "Tim Draper (DFJ, family friend, first check)"
    - "ATA Ventures"
    - "Larry Ellison"
    - "Don Lucas"
    - "Rupert Murdoch ($125M, later largest individual loss)"
    - "Walton family"
    - "Cox family"
    - "DeVos family"
    - "Carlos Slim"
  founded_year: 2003

founders:
  - name: Elizabeth Holmes
    role: CEO
    persona_vibe: stanford_dropout
    public_quotes:
      - "First they think you're crazy, then they fight you, and then all of a sudden you change the world. (TEDMED 2014)"
      - "We are creating a new chapter in healthcare. (Theranos corporate video, c. 2014)"
      - "I think a lot of young people have incredible ideas and incredible insights, but sometimes they wait before they go give their life to something that they could do. (Stanford interview, 2014)"
      - "The day my brother could call me up and say his friend had been diagnosed with something that they could have caught earlier — that is the day I'll feel like we did something. (Fortune cover interview, 2014)"
      - "This is the most important thing humanity has ever built. (paraphrased from internal videos quoted in Bad Blood)"
    notable_history:
      - "Stanford 2002, dropped out sophomore year of Chemical Engineering"
      - "Patent for a microfluidic patch (2003) — the original pitch"
      - "Channing Robertson (Stanford ChemE prof) joins board, lends academic legitimacy"
      - "Cover of Fortune, Forbes, Inc., Glamour 'Woman of the Year' 2015"
      - "Time 100 Most Influential 2015"
    twitter_handle: "@eholmes2003"  # actual handle she used at the time
  - name: Ramesh "Sunny" Balwani
    role: President & COO
    persona_vibe: second_time_founder
    public_quotes:
      - "I am the chief evangelist for the company. (deposition, 2017)"
      - "Before I get into specifics, let me share with you that had this email come from anyone else in the company, I would have already held them accountable for the arrogant and patronizing tone and reckless comments. (Sunny Balwani text/WhatsApp response to Tyler Shultz's email about quality control, surfaced at trial)"
    notable_history:
      - "Pakistani-Indian software exec; made ~$40M from CommerceBid.com sale to Commerce One, 1999"
      - "Met Holmes when she was 18 (he was 37); the two were in a concealed romantic relationship for the duration of his Theranos tenure"
      - "Joined Theranos in 2009, served as President/COO until 2016 — concealed romantic relationship with Holmes was hidden from the board"
      - "Convicted on all 12 fraud counts, July 2022"
      - "Sentenced to 12 years 11 months, December 7, 2022; ordered to pay $452M restitution jointly with Holmes ($125M to Murdoch alone)"
      - "Holmes's defense at her separate trial alleged abuse by Balwani — the trials were severed for that reason"
    twitter_handle: null

product:
  category_noun: "blood-diagnostics platform"
  the_thing_it_does: "Run hundreds of clinical lab tests from a single finger-prick of blood, on a tabletop device called Edison, in 30 minutes, in your local Walgreens."
  buzzwords_used:
    - "miniLab"
    - "Edison"
    - "nanotainer"
    - "lab-on-a-chip"
    - "patient-centered"
    - "actionable health data"
    - "the right to know your own information"
    - "transformative"
    - "disruptive"
    - "consumer healthcare"
  customer_archetype: "Walgreens shoppers who would walk in, prick a finger, and walk out with 200 lab results — and the U.S. military medics who Holmes claimed were already using Edison in the field"

market:
  competitors:
    - "Quest Diagnostics"
    - "LabCorp"
    - "Siemens Healthineers"
    - "Roche Diagnostics"
    - "Abbott"
  comparable_blowups:
    - "uBiome (insurance billing collapse, FBI raid)"
    - "Outcome Health (ad-impression fabrication)"
    - "Nikola (rolling-truck demo)"

vibe:
  twitter_presence: dormant
  press_coverage_so_far: overheating
  notable_dirt:
    - "Edison machines in the Walgreens stores reportedly run only a tiny number of assays in-house; the rest are run on modified Siemens commercial analyzers, with finger-prick samples diluted to fit standard machines (per WSJ, Oct 2015)"
    - "Channing Robertson gets paid $500K/year as a consultant; Stanford peer review of the device never published"
    - "Ian Gibbons (chief scientist) dies May 2013, on the day he is to be deposed in a patent suit; family says he was distressed about the technology's gaps (per WSJ and Bad Blood)"
    - "The board is composed almost entirely of statesmen with no diagnostics background: Henry Kissinger (Sec State), George Shultz (Sec State, also Tyler Shultz's grandfather), James Mattis (4-star USMC, future SecDef, personally invested $85,000), William Perry (Sec Def), Sam Nunn (US Senator), Bill Frist (Senate Majority Leader, MD), Richard Kovacevich (Wells Fargo CEO), Riley Bechtel"
    - "Tyler Shultz (George Shultz's 22-year-old grandson) worked at Theranos 8 months 2013-2014 on assay validation; reported quality-control failures internally, was met with hostility, resigned, blew whistle to NY state regulators using an alias, became central anonymous source for John Carreyrou. His grandfather invited him over under false pretenses with Theranos lawyers waiting upstairs; Tyler walked out. His parents spent $400-500K on his legal fees. He bought a burner phone with cash to call Carreyrou. He was on Forbes 30 Under 30 (Healthcare 2017)."
    - "Erika Cheung — lab tech and Tyler's friend; reported to CMS, leading to clinical lab shutdown; co-founded Ethics in Entrepreneurship; testified at Holmes's trial"
    - "Adam Rosendorff — former lab director, critical source for Carreyrou and trial witness"
    - "Theranos has threatened ex-employees with lawsuits via Boies Schiller (David Boies on retainer and on the board); Theranos PIs reportedly followed Tyler Shultz for over a year"
    - "John Carreyrou (WSJ, two-time Pulitzer) tipped by pathologist blogger Adam Clapper; first WSJ piece publishes October 15, 2015 ('Hot Startup Theranos Has Struggled With Its Blood-Test Technology'); his book *Bad Blood* (2018) is the genre-defining text"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly mid-2014, post-Series C close):**
  - valuation_usd: 9_000_000_000
  - cash_usd: 400_000_000
  - revenue_usd: ~100_000  # de minimis; mostly research contracts
  - burn_usd_monthly: 8_000_000
  - headcount: 750
  - fbi_awareness: 0.05  # not on FBI radar yet; CMS will be first
  - fraud_score: 0.65  # high coming in — wrapper is live, board is decoration, demos are scripted
  - reputation: 0.95  # peak press; cover of Forbes 400, Time 100
  - heat: 0.10  # no real journalist circling yet
  - day_elapsed: ~4000  # founded 2003, run starts ~2014

- **Pre-planted seeds:**
  - `wrapper_disclosure_seed` — Edison runs a fraction of the marketed assay menu in-house; the remainder runs on modified Siemens analyzers with diluted samples
  - `demo_brittle_seed` — investor and partner demos are scripted; failed reads are silently dropped from the displayed result
  - `theranos_board_loaded_seed` — board is Kissinger, Shultz, Mattis, Perry, Nunn, Frist, Bechtel; zero diagnostics expertise
  - `walgreens_pilot_loaded_seed` — Wellness Centers signed and rolling out in Phoenix and Palo Alto
  - `military_endorsement_seed` — Holmes has publicly implied DoD field deployment; Mattis on board reinforces the halo
  - `carreyrou_circling_seed` — pre-armed; Adam Clapper (a pathologist blogger) has already flagged inconsistencies and tipped Carreyrou
  - `ex_employee_disgruntled_seed` — Tyler Shultz and Erika Cheung have left, having raised internal concerns
  - `cofounder_disgruntled_seed` — Ian Gibbons situation is in the company's recent past and has not been processed
  - `boies_on_retainer_seed` — Boies Schiller is the standing law firm and uses aggressive ex-employee NDAs
  - `cult_of_personality_seed` — black turtleneck, deep voice, Steve Jobs cosplay is fully calibrated
  - `revenue_rounded_up_seed` — projections shown to investors include the Walgreens national rollout as if it were guaranteed

- **Pre-loaded figures (already on cap table / board / circling at turn 0):**
  - FIG-FRAUD-023 — Theranos Board (Kissinger / Mattis / Shultz) — already on the board
  - FIG-PRESS-001 — John Carreyrou — circling (seeded, not yet published)
  - FIG-LAW-001 — David Boies — on retainer, on the board
  - FIG-FRAUD-001 — Elizabeth Holmes — already named in the bible (the agent IS the fictional avatar; the real Holmes is referenced retrospectively as the historical anchor in flashbacks)

- **Notable open events / pivotal decisions:**
  - Walgreens national rollout is signed (8,000 stores planned) but only Phoenix and Palo Alto are live — the agent can accelerate or stall
  - Safeway pilot is wobbling (stores remodeled in anticipation, no go-live) — kill it or paper over it?
  - Tyler Shultz has resigned and is angry — sue him via Boies (the affidavit ambush at his grandfather's house is on the table), or let him go quiet?
  - The Edison demo for Vice President Biden's October 2015 Newark visit is on the calendar — fake the lab tour or rebuild it for real?
  - Carreyrou has emailed for comment — engage, stonewall, or sic Boies on his sources?
  - Arizona just passed (March 2015) the law Holmes lobbied for, letting people get lab tests without insurance or doctor approval — does the agent expand the marketing while CMS readies the inspection, or pull back?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-4 is the pre-publication golden hour — Forbes covers, Time 100, a Glamour Woman of the Year award, the Walgreens rollout press tour. Turn 5-7, Carreyrou's first call lands (Adam Clapper's tip route); the company's response is to pressure the WSJ via Boies and to lean harder on the celebrity board for cover. Turn 8-10, the October 15, 2015 WSJ piece ("Hot Startup Theranos Has Struggled...") publishes; CMS opens an inspection of the Newark lab. Turn 11-15, the cascade — voided test results, Walgreens shuts 40 testing centers and sues (2016), the SEC investigation opens, the celebrity board departs in waves. Turn 16-20, SEC settles ($500K, 10-year ban from public-company officer roles, 18.9M shares returned), federal grand jury indictment (June 2018). Turn 21-25, the long pre-trial, the severed trials (Holmes's abuse defense), Holmes convicted on 4 investor-fraud counts (acquitted on patient-fraud) January 2022, Balwani convicted on all 12 counts July 2022. November 18, 2022: Holmes sentenced 11 years 3 months. December 7, 2022: Balwani 12 years 11 months. May 30, 2023: Holmes reports to FPC Bryan, Texas. February 2025: 9th Circuit upholds. December 2025: LA Times reports Holmes campaigning for a Trump pardon. The historical anchor ending is END-PRISON-002 (the 11-year sentence). The agent can absolutely diverge — pivoting to a research-only company before Walgreens, going full evidence-destruction Sunny mode and chasing END-FLED, or threading the pardon-arc seed for a late END-CULTURAL-AFTERLIFE / pardon-watch ending.

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Elizabeth Holmes and Sunny Balwani** are post-conviction (Holmes 11y3m, Balwani 12y11m) and freely satirizable per the policy; their bible-listed quotes are from public TED talks, magazine cover interviews, and depositions on the public docket.
- **Theranos board** (FIG-FRAUD-023) — Mattis, Kissinger (deceased), Shultz (deceased) — `safe_reaction` only. They appear in retrospective context only ("the board never asked to see the machine"). No new accusations of knowledge or complicity beyond what is in the public Senate Armed Services testimony and Carreyrou's reporting.
- **John Carreyrou** (FIG-PRESS-001) — `safe_reaction`. He DMs ex-employees and "obtains an internal memo." His byline appears as having "first reported" things. The full long-read postmortem is published under a fictional outlet pastiche per defamation_policy.md.
- **David Boies** (FIG-LAW-001) — `safe_reaction`. His name appearing on a docket is a beat. He does not endorse fraud on screen.
- **Tyler Shultz, Erika Cheung, Ian Gibbons, Channing Robertson, Adam Clapper** are referenced strictly as documented in the WSJ series, the SEC complaint, the indictment, *Bad Blood* (Carreyrou, 2018), and the trial transcripts.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because she is fictional — even if her starting bible draws from the real Holmes' public footprint. The share-card disclaimer makes this explicit.

## Sources

- *Bad Blood: Secrets and Lies in a Silicon Valley Startup* — John Carreyrou, Knopf, 2018
- WSJ, "Hot Startup Theranos Has Struggled With Its Blood-Test Technology" — John Carreyrou, October 16, 2015 — https://www.wsj.com/articles/theranos-has-struggled-with-blood-tests-1444881901
- WSJ Theranos series index — https://www.wsj.com/news/types/theranos
- SEC v. Theranos, Holmes, and Balwani complaint, March 14, 2018 — https://www.sec.gov/litigation/litreleases/2018/lr24069.htm
- DOJ press release, Holmes sentencing, November 18, 2022 — https://www.justice.gov/usao-ndca/pr/elizabeth-holmes-sentenced-more-11-years-defrauding-theranos-investors-hundreds
- DOJ press release, Balwani sentencing, December 7, 2022 — https://www.justice.gov/usao-ndca/pr/ramesh-sunny-balwani-sentenced-nearly-13-years-defrauding-theranos-investors-and
- Holmes TEDMED 2014 talk transcript — https://www.tedmed.com/talks/show?id=293044
- "The Inventor: Out for Blood in Silicon Valley" — HBO documentary, dir. Alex Gibney, 2019
- "The Dropout" podcast (ABC News / Rebecca Jarvis), 2019
- Forbes, "Bloody Amazing" cover story — Matthew Herper, July 2014 — https://www.forbes.com/sites/matthewherper/2014/07/02/bloody-amazing/
- Fortune cover, "This CEO Is Out for Blood" — Roger Parloff, June 2014 — https://fortune.com/2014/06/12/theranos-blood-holmes/
- Senate Armed Services Committee public records (Mattis testimony references)
- People v. Holmes / U.S. v. Holmes trial transcripts (N.D. Cal., docket 5:18-cr-00258-EJD)
