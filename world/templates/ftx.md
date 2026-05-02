---
template_id: ftx
display_name: FTX
tagline: "The most trusted name in crypto. (For about eighteen months.)"
era: 2019-2022
default_length_mode: long
default_craziness: normal
historical_anchor_endgame: END-PRISON-001
warning: |
  This template dramatizes the publicly reported FTX / Alameda Research arc
  using only facts established in court, in the SDNY indictment and trial,
  in the bankruptcy filings of the FTX Debtors, and in mainstream reporting
  (NYT, WSJ, Bloomberg, Reuters, Vox, Coindesk, the Levine Money Stuff
  columns). Real-named figures appear strictly as reactions or as set
  decoration consistent with the public record.
---

# Template: FTX

The "Sequoia profile, Super Bowl ad, Bahamas penthouse, Alameda spreadsheet" arc. You start in early 2022 — post-Series C extension, ~$32B paper valuation, the Larry David ad has aired, Tom Brady is on the cap table, Caroline runs Alameda from the same office complex, and there's a particular Excel file that no one has ever encrypted. Run it straight and you get the 25-year sentence. Run it differently and we find out what the EA forum would have thought.

## Company Bible

```yaml
company:
  name: ftx
  display_name: FTX
  one_liner: "A crypto derivatives exchange built by quant traders, for quant traders, with a U.S.-facing retail platform (FTX.US) and a global Bahamas-licensed flagship (FTX International)."
  industry: crypto
  funding_stage: series_c_plus
  funding_total_usd: 1900000000  # ~$1.8-1.9B raised across rounds
  notable_investors:
    - "Sequoia Capital"
    - "Paradigm"
    - "SoftBank Vision Fund 2"
    - "Tiger Global"
    - "Temasek"
    - "Ontario Teachers' Pension Plan"
    - "BlackRock"
    - "Ribbit Capital"
    - "Lightspeed Venture Partners"
    - "Thoma Bravo"
    - "Multicoin Capital"
    - "Insight Partners"
  founded_year: 2019  # FTX International, May 2019; Alameda Research founded Nov 2017

founders:
  - name: Sam Bankman-Fried
    role: CEO
    persona_vibe: genuine_believer
    public_quotes:
      - "I'm a utilitarian. (numerous interviews including the Vox piece, 2022)"
      - "Yeah, hehe, I had to be, it's what reputations are made of, to some extent. I feel bad for those who get fucked by it. By this dumb game we woke westerners play where we say all the right shibboleths and so everyone likes us. (Twitter DM exchange with Vox's Kelsey Piper, published Nov 16, 2022) https://www.vox.com/future-perfect/23462333/sam-bankman-fried-ftx-cryptocurrency-effective-altruism-crypto-bahamas-philanthropy"
      - "Most exchanges, including FTX, do not invest the assets that customers entrust with the exchange. (FTX terms of service, 2021 archive)"
      - "I'm willing to take the risk for the bigger upside. (recurring framing in podcast appearances)"
      - "I think the math suggests you should bet it all if the EV is positive. (paraphrased from the Tyler Cowen Conversations with Tyler interview, March 2022)"
      - "We're trying to do the most good. (paraphrased throughout 80,000 Hours podcast appearance, April 2022)"
      - "It's been an interesting week. (Twitter, Nov 7-8, 2022, the 'Hi' / 'and' / 'a few' thread)"
    notable_history:
      - "MIT physics undergrad, 2010-2014"
      - "Jane Street Capital quant trader, 2014-2017"
      - "Founded Alameda Research with Tara Mac Aulay and others, November 2017"
      - "Founded FTX International (Bahamas) May 2019, FTX.US 2020"
      - "Largest individual donor to Joe Biden 2020 cycle outside of Bloomberg"
      - "Pledged largest political donor of 2024 cycle (~$1B 'soft ceiling')"
      - "Parents Joseph Bankman and Barbara Fried, Stanford Law professors"
      - "Convicted Nov 2, 2023 on all 7 counts (wire fraud, conspiracy, money laundering)"
      - "Sentenced 25 years federal, March 28, 2024"
    twitter_handle: "@SBF_FTX"
  - name: Caroline Ellison
    role: CEO of Alameda Research
    persona_vibe: genuine_believer
    public_quotes:
      - "Sometimes if you wonder how a CEO got their job, the answer is that their boss was sleeping with them. (Tumblr / public talks, paraphrased from publicly reported tweets, c. 2022)"
      - "Regulators, but make it horny. (paraphrased from her public Tumblr aesthetic, widely reported)"
      - "I lied. (testimony, US v. Bankman-Fried, October 10, 2023)"
    notable_history:
      - "Stanford math undergrad"
      - "Jane Street Capital quant trader"
      - "Joined Alameda 2018, became co-CEO then sole CEO"
      - "Cooperator; pleaded guilty December 2022"
      - "Sentenced 2 years federal, September 2024 (judge departed downward for cooperation)"
    twitter_handle: "@carolinecapital"
  - name: Gary Wang
    role: CTO / Co-founder
    persona_vibe: genuine_believer
    public_quotes: []  # Wang almost never spoke publicly
    notable_history:
      - "MIT math, Google software engineer"
      - "Co-founded FTX with SBF, 2019"
      - "Pleaded guilty December 2022; cooperated"
      - "Sentenced time served + 3 years supervised release, November 2024"
    twitter_handle: null
  - name: Nishad Singh
    role: Director of Engineering
    persona_vibe: genuine_believer
    public_quotes: []
    notable_history:
      - "Berkeley, EA-pilled in high school"
      - "Joined FTX 2019"
      - "Pleaded guilty February 2023; cooperated"
      - "Sentenced time served, October 2024"
    twitter_handle: null

product:
  category_noun: "crypto derivatives exchange"
  the_thing_it_does: "Trade crypto perpetual futures and spot, with leveraged tokens, prediction markets, and an interface that looks meaningfully cleaner than its competitors — backed by an in-house market maker (Alameda) that provides liquidity."
  buzzwords_used:
    - "the most trusted name in crypto"
    - "you in?"
    - "EV-positive"
    - "effective altruism"
    - "earn to give"
    - "future of finance"
    - "regulatory clarity"
    - "compliant by design"
    - "industry-leading risk engine"
    - "instant liquidation"
    - "FTT"
    - "Serum"
    - "MOVE"
  customer_archetype: "Retail crypto traders who want lower fees and a cleaner UX than Coinbase, plus the institutional desk customers who route through OTC and the prop firms who borrow from the exchange's risk engine"

market:
  competitors:
    - "Binance"
    - "Coinbase"
    - "Kraken"
    - "Crypto.com"
    - "BitMEX"
    - "Deribit"
    - "OKX"
  comparable_blowups:
    - "Mt. Gox (insolvent exchange, 2014)"
    - "QuadrigaCX (cold-wallet keys died with founder, 2019)"
    - "Celsius (yield product, frozen withdrawals, 2022)"
    - "Voyager (FDIC-claim collapse, 2022)"
    - "Three Arrows Capital (yacht, Singapore, 2022)"
    - "Terra/Luna (Do Kwon, May 2022)"

vibe:
  twitter_presence: thought_leader
  press_coverage_so_far: hot
  notable_dirt:
    - "FTX customer assets and Alameda's balance sheet are commingled via a 'fiat@ftx' account and a custom code path in the FTX core that gives Alameda a special 'negative balance' line of credit and exempts it from auto-liquidation — code reportedly written by Gary Wang (per SDNY indictment, Wang's testimony Oct 5-6 2023, and Ellison's testimony Oct 10-12 2023)"
    - "Caroline Ellison testified that SBF directed her to use FTX customer funds to cover Alameda losses, repay loans, buy real estate, invest in startups, make political donations, and fund celebrity endorsements; at collapse, Alameda allegedly owed FTX $10B+ in customer money"
    - "Alameda's June 2022 balance sheet, leaked by Ian Allison to CoinDesk November 2, 2022, shows a large fraction of 'assets' is FTT (FTX's own exchange token) — collateral that would evaporate in a run; the leaked file existed on a shared drive, never encrypted"
    - "Sequoia publishes 'Sam Bankman-Fried Has a Savior Complex — And Maybe You Should Too' (Adam Fisher reporting in the Bahamas) in September 2022; piece later deleted; Sequoia ultimately marks down ~$214M to zero"
    - "Tom Brady ($55M for 20 hrs/year × 3 years), Steph Curry ($35M × 3 years), Larry David ($10M Super Bowl 'I'm not so sure about this' ad), Gisele Bündchen, Naomi Osaka, Kevin O'Leary all on the cap table or paid-spokesperson roll"
    - "Miami Heat arena renamed FTX Arena (19-year, $135M deal); UC Berkeley stadium; Mercedes F1; Golden State Warriors; MLB umpire uniform logos"
    - "Most senior staff and SBF live in the $30-40M Albany Resort penthouse 'Orchid V' in the Bahamas (resort partially owned by Tiger Woods, Justin Timberlake, Joe Lewis, Ernie Els); 8 of 10 housemates paired off in romantic relationships with each other; widely reported as a 'polycule'"
    - "$200M to K5 Global (Michael Kives's company) networking SBF with Hillary Clinton, Doug Emhoff, Katy Perry, Jeff Bezos, Kardashians; Nishad Singh testified he was 'shocked' by K5 spending"
    - "$74M+ Bahamas real estate including the penthouse; $16M waterfront house for SBF's parents Joe Bankman and Barbara Fried (Stanford Law professors); Joe Bankman on payroll at $200K/year as 'advisor on corporate and tax matters' — emailed asking 'Gee Sam, I don't know what to say here. This is the first I have heard of the 200K a year salary! Putting Barbara on this.'"
    - "$1B personal loan from FTX to SBF; Nishad Singh took a $10M loan and testified he was a straw donor for SBF political donations"
    - "There is no functional board. The ostensible board is SBF, an FTX lawyer, and a small Antiguan investor (per John J. Ray III's first-day declaration in bankruptcy)"
    - "John J. Ray III (the Enron wind-down CEO) takes over in bankruptcy and writes 'Never in my career have I seen such a complete failure of corporate controls and such a complete absence of trustworthy financial information as occurred here' (FTX Chapter 11 first-day declaration, Nov 17, 2022) https://restructuring.ra.kroll.com/FTX/"
    - "The internal record-keeping system is a QuickBooks-and-Slack pastiche; expense approvals are emoji reactions in chat"
    - "August 2023: SBF's bail revoked after Judge Lewis Kaplan determined he tried to intimidate witnesses by leaking Caroline Ellison's diary to the NYT; Sam Trabucco (Alameda co-CEO) had stepped down in August 2022 with no public reason"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly Feb 2022, post-Series C extension, Super Bowl ad just aired):**
  - valuation_usd: 32_000_000_000
  - cash_usd: 2_500_000_000  # corporate cash; separate from customer assets
  - revenue_usd: 1_000_000_000  # 2021 revenue per leaked deck
  - burn_usd_monthly: ~50_000_000  # marketing-heavy, including stadium and ad spend
  - headcount: ~300
  - fbi_awareness: 0.05  # not on SDNY radar yet
  - fraud_score: 0.75  # extremely high — commingling already in place, fiat@ftx exists, Alameda exemption code path is live
  - reputation: 0.92  # peak — TIME cover, Forbes 30 Under 30, Vogue profile of Caroline
  - heat: 0.20  # Levine has occasionally raised an eyebrow; CFTC has casual interest in offshore leverage
  - day_elapsed: ~1000  # FTX founded May 2019

- **Pre-planted seeds:**
  - `alameda_intermingled_seed` — customer fiat deposits flow into an Alameda-controlled account; the FTX matching engine has a special-case carve-out for the Alameda account ID
  - `revenue_rounded_up_seed` — the deck circulating to Series C extension investors uses optimistic top-of-range numbers
  - `unencrypted_spreadsheet_seed` — the Alameda balance sheet exists on a shared drive; one version will leak to CoinDesk in November 2022
  - `bahamas_compound_seed` — the Albany penthouse is the office and the home; senior staff cohabitate
  - `sequoia_profile_loaded_seed` — Sequoia's profile is in the works; Adam Fisher is reporting in the Bahamas
  - `super_bowl_ad_loaded_seed` — Larry David ad has aired; Tom Brady ads are running
  - `effective_altruism_loaded_seed` — FTX Future Fund has been announced ($1B+ committed); the EA community is actively channeling talent into the company
  - `cofounder_flipped_seed` — pre-armed, will fire as cooperation chain (Caroline, Gary, Nishad sequence)
  - `political_donations_seed` — SBF is publicly the second-largest Democratic donor of 2020; pledged ceiling for 2024
  - `tom_brady_cap_table_seed` — celebrity equity holders are vocal; will boomerang in the postmortem
  - `binance_cz_friendly_seed` — pre-armed; CZ holds FTT from his early FTX exit; the November 2022 tweetstorm comes from this seed
  - `cult_of_personality_seed` — cargo shorts, hair, sleeping on a beanbag, "playing League during meetings" is fully calibrated
  - `wrapper_disclosure_seed` — the "industry-leading risk engine" has manual overrides for select accounts
  - `tumblr_diary_seed` — Caroline Ellison's "worldoptimization" Tumblr (polyamory-as-imperial-Chinese-harem, eugenics-adjacent, Harry Potter) is on the open internet; her diary will later be leaked to NYT and trigger the bail revocation
  - `parents_on_payroll_seed` — Joe Bankman and Barbara Fried (Stanford Law) entanglement; payroll, $16M Bahamas house, the 'first I've heard of $200K' email
  - `k5_loaded_seed` — $200M to K5 Global / Michael Kives; the celebrity-networking-as-laundry pipeline (Clintons, Bezos, Kardashians, Katy Perry)

- **Pre-loaded figures (already on cap table / board / circling at turn 0):**
  - FIG-FRAUD-002 — Sam Bankman-Fried — historical anchor (the agent IS the fictional avatar; the real SBF is referenced retrospectively)
  - FIG-FRAUD-010 — Caroline Ellison — co-founder, on-screen as Alameda CEO
  - FIG-FRAUD-011 — Ryan Salame — FTX Digital Markets co-CEO, political donations channel
  - FIG-FRAUD-012 — Nishad Singh — Director of Engineering
  - FIG-PRESS-009 — Matt Levine — circling via Money Stuff (already wrote the "I'm in the Bahamas with SBF" April 2022 column)
  - FIG-CHORUS-009 — @ParodySBF — already exists in the timeline
  - FIG-FRAUD-015 — Changpeng Zhao — pre-armed as future antagonist (he's a passive FTT holder)

- **Notable open events / pivotal decisions:**
  - The Alameda margin loan from FTX customer deposits is in place — pay it down, paper it over, or expand it?
  - Sequoia profile is in the works — accept the interview or stay heads-down?
  - FTX Future Fund grants are flowing — accelerate, slow, or pivot to direct political donations?
  - The Voyager Digital line of credit decision is on the table (June 2022 in real life)
  - The BlockFi rescue offer (June 2022) is on the table
  - The CZ FTT divestment is foreseeable — buy it back at a premium, or let it dribble onto the open market?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-3 is peak prestige — Vogue profile of Caroline, TIME cover for SBF, the Sequoia piece, the Super Bowl ad echoing on social. Turn 4-7, the Terra/Luna collapse (May 2022) ripples — Alameda eats losses but is propped up by the customer-deposit line; the agent decides to expand the Voyager and BlockFi rescues to look like a savior. Turn 8-10, the Levine columns get sharper; CoinDesk's Ian Allison is reporting on the Alameda balance sheet. Turn 11-13, the leak — CZ tweets, the FTT collapses, withdrawals freeze, the Binance LOI evaporates within 24 hours. Turn 14-17, bankruptcy, John J. Ray III, the Bahamas extradition, the perp walk. Turn 18-22, the SDNY trial — Caroline cooperator-flips first, Gary, Nishad. The historical anchor ending is END-PRISON-001 (the 25-year sentence). Divergent runs: the agent can pay down the Alameda loan when Terra hits, refuse the Voyager rescue, or split FTX.US off cleanly — any of which can shift to END-FAILUP-002 or END-CULT-001 (the documentary).

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Sam Bankman-Fried** (FIG-FRAUD-002), **Caroline Ellison** (FIG-FRAUD-010), **Nishad Singh** (FIG-FRAUD-012), **Ryan Salame** (FIG-FRAUD-011), **Gary Wang** are all post-conviction or post-plea and freely satirizable per the policy. Bible-listed quotes are from public Twitter, the Vox DM exchange (which Piper published with Bankman-Fried's knowledge), the Tyler Cowen interview, the 80,000 Hours podcast, and trial testimony.
- **John J. Ray III** is named only via his bankruptcy filings, which are court documents.
- **Sequoia, Paradigm, SoftBank, Tiger, Temasek, Ontario Teachers, BlackRock** appear strictly as cap-table presence and as `safe_reaction` post-collapse statements (each issued public mark-to-zero notes; Sequoia's deleted profile is widely reported).
- **Tom Brady, Gisele Bündchen, Steph Curry, Larry David** appear only as ad-cameo references — they did appear in real public ads. They do not perform new acts on screen.
- **Matt Levine** (FIG-PRESS-009), **Ian Allison (CoinDesk)** — `safe_reaction`. Levine writes Money Stuff; Allison's CoinDesk piece on the Alameda balance sheet is treated as having "first reported" the leak. The full long-read postmortem is published under a fictional outlet pastiche per defamation_policy.md.
- **Changpeng Zhao** (FIG-FRAUD-015) is post-plea (BSA misdemeanor, 4-month sentence) and `safe_reaction`. His historical tweetstorm of November 6-8, 2022 is referenced as having happened; new content is routed through `@ParodyCZ` if needed.
- **Joe Biden, the DNC, named political recipients of FTX donations** — `safe_reaction`. Donations are FEC-public; recipients are referenced as having received and (in many cases) returned the donations.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- US v. Bankman-Fried indictment (S.D.N.Y., 22-CR-673), original and superseding — https://www.justice.gov/usao-sdny/press-release/file/1556861/download
- DOJ press release, SBF sentencing, March 28, 2024 — https://www.justice.gov/usao-sdny/pr/samuel-bankman-fried-sentenced-25-years-orchestrating-multiple-fraudulent-schemes
- Caroline Ellison sentencing memo and order — https://www.justice.gov/usao-sdny/pr/caroline-ellison-sentenced-two-years-prison-her-role-multi-billion-dollar-fts-fraud
- John J. Ray III, FTX Debtors First Day Declaration (D. Del. 22-11068, Nov 17, 2022) — https://restructuring.ra.kroll.com/FTX/
- "Sam Bankman-Fried Has a Savior Complex — And Maybe You Should Too" — Adam Fisher, Sequoia Capital, Sep 2022 (deleted; Wayback) — https://web.archive.org/web/20221026141225/https://www.sequoiacap.com/article/sam-bankman-fried-spotlight/
- "Sam Bankman-Fried tries to explain himself" — Kelsey Piper, Vox, November 16, 2022 — https://www.vox.com/future-perfect/23462333/sam-bankman-fried-ftx-cryptocurrency-effective-altruism-crypto-bahamas-philanthropy
- "Divisions in Sam Bankman-Fried's Crypto Empire Blur on His Trading Titan Alameda's Balance Sheet" — Ian Allison, CoinDesk, November 2, 2022 — https://www.coindesk.com/business/2022/11/02/divisions-in-sam-bankman-frieds-crypto-empire-blur-on-his-trading-titan-alamedas-balance-sheet/
- "Conversations with Tyler: Sam Bankman-Fried" — Mercatus Center, March 2022 — https://conversationswithtyler.com/episodes/sam-bankman-fried/
- "How to be successful at Earning to Give" — 80,000 Hours podcast with Sam Bankman-Fried, April 2022 — https://80000hours.org/podcast/episodes/sam-bankman-fried-high-risk-altruism/
- Matt Levine, "Money Stuff" Bloomberg columns on FTX, 2022-2024 archive — https://www.bloomberg.com/opinion/authors/ARbTQlRLRjE/matthew-s-levine
- Trial transcripts, US v. Bankman-Fried, S.D.N.Y. (Caroline Ellison testimony Oct 10-12, 2023; Gary Wang Oct 5-6, 2023; Nishad Singh Oct 16-17, 2023)
- Michael Lewis, *Going Infinite: The Rise and Fall of a New Tycoon*, W.W. Norton, 2023
- Zeke Faux, *Number Go Up*, Crown, 2023
- *Bad Blood* podcast / *The Trial of Sam Bankman-Fried* — Bloomberg
