---
template_id: wework
display_name: WeWork
tagline: "We dedicate this to the energy of We. (And to the $47B that energy briefly was.)"
era: 2010-2023
default_length_mode: long
default_craziness: crazy
historical_anchor_endgame: END-FAILUP-001
warning: |
  This template dramatizes the publicly reported WeWork / Adam Neumann arc
  using only facts established in WSJ reporting (Eliot Brown, Maureen Farrell,
  later collected as *The Cult of We*), the company's S-1, the SoftBank
  rescue terms, public Vanity Fair / WSJ profiles, and the 2023 bankruptcy
  filings. Real-named figures appear strictly as reactions or as set
  decoration consistent with the public record.
---

# Template: WeWork

The "elevate the world's consciousness" arc — the 2010s most expensive lesson in why a real-estate-arbitrage business is not a tech company. You start in summer 2019, post-SoftBank top-up, $47B paper valuation, the S-1 is being drafted by Skadden, the founder is barefoot, the kombucha-and-tequila taps in the office are flowing, and JPMorgan is about to lose its patience. Run it straight and you get the IPO implosion and the $1.7B golden parachute. Run it differently and the simulator finds out whether WeGrow could have been the long-term tail.

## Company Bible

```yaml
company:
  name: wework
  display_name: WeWork
  one_liner: "A tech-enabled community-as-a-service platform that elevates the world's consciousness — and also leases office space."
  industry: enterprise_saas  # the company called itself this; it was real estate
  funding_stage: growth
  funding_total_usd: 22000000000  # ~$20B from SoftBank alone
  notable_investors:
    - "SoftBank Vision Fund / Masayoshi Son (~$20B across rounds)"
    - "Benchmark"
    - "JPMorgan Chase"
    - "T. Rowe Price"
    - "Fidelity"
    - "Goldman Sachs"
    - "Wellington Management"
  founded_year: 2010

founders:
  - name: Adam Neumann
    role: CEO & Co-founder
    persona_vibe: genuine_believer
    public_quotes:
      - "We dedicate this to the energy of We — greater than any of us, but inside each of us. (WeWork S-1, August 14, 2019)"
      - "Elevate the world's consciousness. (WeWork mission statement, S-1 prospectus)"
      - "The valuation made us feel like we were right, which made me feel that whatever style I was leading at was a correct style at the time. (CNBC interview, November 2021)"
      - "[Aspires to] live forever, become the world's first trillionaire, expand WeWork to Mars, become Israel's prime minister, and become president of the world. (publicly reported in WSJ, Vanity Fair, September 2019)"
    notable_history:
      - "Israeli-American, served in the Israeli Navy"
      - "6'5\", long hair, walks the office barefoot"
      - "Co-founded WeWork in NYC 2010 with Miguel McKelvey"
      - "Trademarked 'We' personally and sold the rights to the company for $5.9M (later returned post-S-1 backlash)"
      - "Bought multiple buildings personally and leased them to WeWork"
      - "Bought a $60M Gulfstream private jet while company posted 9-figure losses"
      - "Smoked weed on a private jet to Israel — cabin crew put on oxygen masks; the jet's owners worried about international drug-trafficking charges (per *The Cult of We*)"
      - "After firing 7% of staff in 2016, brought out Run-DMC's Darryl McDaniels to perform; passed out plastic shot glasses of tequila"
      - "Per Vanity Fair Sept 2019: claimed to have convinced Rahm Emanuel to run for U.S. President, used Jamie Dimon as personal banker, convinced MBS to 'improve the standing of women in Saudi Arabia,' and was 'working with Jared Kushner on the Trump administration's peace plan for the Israeli–Palestinian conflict'"
      - "Sold $700M+ in personal stock pre-IPO"
      - "Exit package post-ouster: estimated ~$1.7B (loans, stock, consulting fees)"
      - "Founded Flow (residential real estate) 2022 with $350M from a16z at $1B pre-launch valuation"
    twitter_handle: "@adamneumann"
  - name: Miguel McKelvey
    role: Co-founder
    persona_vibe: genuine_believer
    public_quotes: []
    notable_history:
      - "Architect; co-founded WeWork with Neumann in NYC, 2010"
      - "Lower-profile co-founder; left in 2020"
    twitter_handle: null
  - name: Rebekah Neumann
    role: Founder, WeGrow / Chief Brand & Impact Officer
    persona_vibe: genuine_believer
    public_quotes: []
    notable_history:
      - "Adam's wife; cousin of Gwyneth Paltrow"
      - "Ran WeGrow, a WeWork-owned primary school with $36K tuition that taught yoga, meditation, and farming alongside conventional curriculum"
      - "Per the S-1, would help select Adam's successor in the event of his death"
    twitter_handle: null

product:
  category_noun: "community-as-a-service platform"
  the_thing_it_does: "Sign 15-year leases on commercial real estate, retrofit with reclaimed-wood-and-Edison-bulb aesthetics, sublet short-term to startups, freelancers, and small companies — call it a tech company because there's an app to book a conference room."
  buzzwords_used:
    - "elevate the world's consciousness"
    - "community-adjusted EBITDA"
    - "the energy of We"
    - "physical social network"
    - "space-as-a-service"
    - "WeLive"
    - "WeGrow"
    - "WeMRKT"
    - "Powered by We"
    - "tech-enabled real estate"
  customer_archetype: "A pre-seed founder who needs an address, a freelance designer who needs a Wi-Fi signal, an AmLaw 50 firm using a WeWork floor as a satellite office, and one Fortune 500 enterprise tenant per location whose presence makes the location 'verticalized'"

market:
  competitors:
    - "Regus / IWG"
    - "Industrious"
    - "Knotel"
    - "Convene"
    - "Spaces"
  comparable_blowups:
    - "Theranos (founder-cult precedent)"
    - "Uber pre-Khosrowshahi (governance-fix precedent)"
    - "MoviePass (subsidize-the-customer-forever precedent)"

vibe:
  twitter_presence: dormant  # Neumann mostly off Twitter pre-IPO
  press_coverage_so_far: hot
  notable_dirt:
    - "Operating expenses 189% of revenue at peak; margins permanently negative; the entire model is real-estate arbitrage with extra steps"
    - "S-1 invents 'community-adjusted EBITDA' as a metric — removes not just interest, taxes, depreciation, amortization but also rent, marketing, and most other operating costs (mocked across financial Twitter immediately)"
    - "First mention of profit in the S-1 is on page 130"
    - "Adam trademarked 'We' personally and sold the rights to the company for $5.9M (returned after public backlash)"
    - "Adam owned at least four buildings personally and leased them to WeWork (related-party transactions)"
    - "Cousin Adam Kimmel was head of brand"
    - "Tequila is the company beverage. Tequila shots at all-hands meetings, tequila in the office, tequila during job interviews. Kombucha-and-tequila dispenser in some offices."
    - "'Summer Camp' company retreat southeast of London, music-festival format, 'bartenders handed out free rosé by the bottle'"
    - "Masayoshi Son committed $4.4B at a $20B valuation after a 12-MINUTE meeting in 2017; told Neumann 'In a fight, who wins, the smart guy or the crazy guy?' 'The crazy guy.' 'You are not crazy enough.'"
    - "Dual-class share structure gives Neumann supervoting control; the S-1 lists his wife as someone who would help select his successor in the event of his death (later removed)"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly summer 2019, S-1 in final drafting, IPO targeted for September):**
  - valuation_usd: 47_000_000_000
  - cash_usd: 2_500_000_000
  - revenue_usd: 1_820_000_000  # 2018 reported; growing fast
  - burn_usd_monthly: ~150_000_000
  - headcount: 12_500
  - fbi_awareness: 0.02  # this is a governance / SEC-disclosure problem, not a criminal one
  - fraud_score: 0.30  # not criminal — related-party self-dealing and EBITDA invention; the SEC's review of the S-1 is the pressure
  - reputation: 0.85  # peak hype; six months from public-mockery
  - heat: 0.30  # WSJ has been on the related-party deals for a year; about to escalate
  - day_elapsed: ~3300  # founded April 2010

- **Pre-planted seeds:**
  - `vibes_based_valuation_seed` — the $47B is two SoftBank Vision Fund top-ups stacked on a real-estate spread
  - `softbank_friendly_seed` — Masa is in the tank ("you are not crazy enough"); will swing violently in October
  - `salad_bowl_seed` — kombucha-and-tequila dispensers, ball pits, in-office bars; the office artifacts that journalists will photograph for the postmortem
  - `tequila_dispenser_seed` — tequila in the office is a metonym; pours-during-interviews, post-layoff Run-DMC tequila ceremony
  - `messianic_founder_seed` — the live-forever / president-of-the-world / Mars / Israel-PM Vanity Fair quotes are loaded
  - `related_party_seed` — Neumann owns buildings he leases to the company; trademarked "We" sold to the company for $5.9M
  - `wegrow_loaded_seed` — wife runs $36K-tuition primary school; is itself an exhibit
  - `wegrow_succession_seed` — S-1 lists Rebekah as helping pick the successor; will be the most-mocked sentence in the document
  - `s1_disclosure_seed` — the S-1 itself is the time bomb; "community-adjusted EBITDA" is the buzzword that ends it
  - `dimon_circling_seed` — Jamie Dimon at JPMorgan is the Neumann "personal banker" who will, in the end, be the one who tells him to step down
  - `summer_camp_loaded_seed` — the company retreat (rosé-by-the-bottle, bands) is loaded; documentary B-roll
  - `eliot_brown_circling_seed` — WSJ's Eliot Brown has been reporting for a year; *The Cult of We* is downstream
  - `cousin_payroll_seed` — Adam Kimmel as head of brand; nepotism-on-paper
  - `tom_brady_at_summer_camp_seed` — celebrity-friend cameo loaded; not central but loaded
  - `revenue_rounded_up_seed` — the S-1 numbers will be challenged by every analyst on the street

- **Pre-loaded figures:**
  - FIG-FRAUD-003 — Adam Neumann — historical anchor (the agent IS the fictional avatar; the real Neumann is referenced retrospectively, including the post-WeWork Flow chapter)
  - FIG-VC-001 — Marc Andreessen — pre-loaded as future a16z-funds-Flow-for-$350M reference for END-FAILUP runs
  - FIG-PRESS-013 — Kate Clark / The Information — financial-press scrutiny voice
  - FIG-PRESS-009 — Matt Levine — the Money Stuff "community-adjusted EBITDA" reaction is loaded
  - FIG-CHORUS-005 — @VCBrags — the parody chorus voice for the S-1 dunks
  - // suggests EVT-PR-NNN: Matt Levine Money Stuff column on community-adjusted EBITDA
  - // suggests EVT-LEGAL-NNN: a Schedule 13D filing showing Neumann personally owns the buildings he leases to the company
  - // Additional figures the dossier mentions but not yet in cast.md as their own FIG IDs: Masayoshi Son (the SoftBank patron), Miguel McKelvey, Rebekah Neumann, Jamie Dimon. Reference in body, no FIG IDs yet.

- **Notable open events / pivotal decisions:**
  - The S-1 is in final drafting — strip "community-adjusted EBITDA" or keep it?
  - Strip the "Rebekah picks successor" clause or leave it?
  - Pull the IPO and take the SoftBank rescue, or push through and take the public mockery?
  - Sell the "We" trademark back to the company or keep the $5.9M?
  - Sell the personal real estate back to the company at fair value or keep the related-party leases?
  - Take the Jamie Dimon "you should step down" call or refuse it?
  - Disclose the weed-on-jet incident or wait for *The Cult of We*?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-3, S-1 drafted and filed (August 14, 2019); the rosé-by-the-bottle Summer Camp happens; Neumann does the cover interviews. Turn 4-7, the public reaction is immediate and brutal — "community-adjusted EBITDA" mocked, conflicts dissected by every business outlet; valuation expectations dropped from $47B to $20B to $15B to $10B over six weeks; Eliot Brown's WSJ pieces compound. Turn 8-10, board pressure mounts; Jamie Dimon makes the call; Neumann is ousted (September 22-24, 2019). Turn 11-13, SoftBank rescue (October 2019, ~$10B at $7-8B valuation); Neumann's exit package estimated $1.7B; the surrender of voting control. Turn 14-17, the cultural afterlife — *The Cult of We* (Brown & Farrell, 2021), HBO doc, Apple TV+ "WeCrashed" with Jared Leto. Turn 18-20, October 2021 SPAC IPO (BowX) at $9B; November 2023 Chapter 11. The historical anchor ending is END-FAILUP-001 (Neumann walks away rich and lands a16z's $350M Flow check at $1B in 2022). Divergent runs: stripping "community-adjusted EBITDA" from the S-1 and pulling the IPO before the mockery cycle could push to END-CULT-001 or END-FAILUP-002. Doubling down on the related-party deals could push toward an actual SEC enforcement action and a different ending entirely.

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Adam Neumann** is `safe_reaction`. He has not been criminally charged; the WeWork story is governance/civil. The bible draws strictly from the S-1, public WSJ / Vanity Fair / CNBC interviews, *The Cult of We*, and the SoftBank rescue terms (which are in the public record). His Flow company is a real ongoing entity; do not generate new accusations about Flow.
- **Rebekah Neumann, Miguel McKelvey, Adam Kimmel** — `safe_reaction` for cameo presence (S-1 listings, public roles). No new claims about private conduct. Rebekah is referenced strictly via her public WeGrow role and the S-1 succession clause.
- **Masayoshi Son** — `safe_reaction`. The "in a fight, who wins, the smart guy or the crazy guy" exchange is widely reported and may be quoted; the May 2020 SoftBank earnings "It was foolish of me. I was wrong." is on the public record.
- **Jamie Dimon** — `safe_reaction`. The "Dimon was the one who finally convinced him to step down" framing is in the WSJ public reporting. No new content.
- **Marc Andreessen** — `safe_reaction`. His blog post justifying the Flow investment is widely mocked and on the public record.
- **WSJ / Eliot Brown / Maureen Farrell, *The Cult of We*** — `safe_reaction`. References as having "first reported" things; the long-read postmortem in-game runs under a fictional outlet pastiche.
- **Tom Brady, Run-DMC's Darryl McDaniels, the celebrity Summer Camp cameos** — set decoration only; they appeared in real public events.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- WeWork S-1 prospectus, August 14, 2019 — https://www.sec.gov/Archives/edgar/data/1533523/000119312519220499/d781982ds1.htm
- Eliot Brown & Maureen Farrell, *The Cult of We: WeWork, Adam Neumann, and the Great Startup Delusion*, Crown, 2021
- "WeWork: or the Making and Breaking of a $47 Billion Unicorn" — Hulu documentary, 2021
- "WeCrashed" — Apple TV+ series with Jared Leto and Anne Hathaway, 2022
- WeWork Wikipedia entry (with citations) — https://en.wikipedia.org/wiki/WeWork
- Adam Neumann Wikipedia entry — https://en.wikipedia.org/wiki/Adam_Neumann
- CNN, "WeWork's Adam Neumann's wildest moments" (Nov 11, 2023) — https://www.cnn.com/2023/11/11/tech/wework-adam-neumann-wildest-moments/index.html
- Forward, "Adam Neumann profile" — https://forward.com/fast-forward/431698/we-work-adam-neumann/
- Fortune, "WeWork going concern" (Aug 9, 2023) — https://fortune.com/2023/08/09/wework-going-concern-bankruptcy-risk-47-billion-valuation-adam-neumann/
- 2727 Coworking, "WeWork History, IPO, Bankruptcy" — https://2727coworking.com/articles/wework-history-ipo-bankruptcy
- StartupStash, "WeWork: The $47B Illusion" — https://blog.startupstash.com/wework-the-47-billion-illusion-that-burned-through-capital-and-credibility-6c5768815496
- CNBC, "Ousted WeWork CEO" (Nov 9, 2021) — https://www.cnbc.com/amp/2021/11/09/ousted-wework-ceo-adam-neumann-47-billion-valuation-went-to-his-head.html
- a16z, "Adam Neumann's Flow announcement" — Marc Andreessen blog post (2022)
