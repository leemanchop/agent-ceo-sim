---
template_id: irl
display_name: IRL
tagline: "12 million users. 95% of them, automated."
era: 2017-2024
default_length_mode: medium
default_craziness: normal
historical_anchor_endgame: END-PRISON-005
warning: |
  This template dramatizes the publicly reported IRL / Abraham Shafi arc
  using only facts established in the SEC complaint and DOJ criminal
  charges (July 31, 2024), in TechCrunch reporting, in the SoftBank
  $150M civil suit, in the board's special-committee report (June 2023),
  and in mainstream coverage. Cases are pending; allegations are
  presented as allegations, not as established fact. All real-named
  figures appear strictly as reactions or as set decoration consistent
  with the public record.
---

# Template: IRL

The "95% bots, full unicorn valuation" arc — the canonical "WeChat of the West" pitch where the West turned out to be mostly automated. You start in spring 2021, mid-Series-C close at a $1.17B valuation, with SoftBank Vision Fund 2 leading. Per the public record, the user base was acquired through paid incentive advertising at 4× the disclosed marketing spend, and 95% of those users were eventually determined by the board's special committee to be bots. Run it straight and you get the SEC and DOJ charges (July 31, 2024) and the SoftBank $150M civil suit. Run it differently and the simulator finds out whether the 5% of real users could have grown a real company.

## Company Bible

```yaml
company:
  name: irl
  display_name: IRL
  one_liner: "A social messaging app for Gen Z — 'WeChat of the West,' originally a social calendar, pivoted to group messaging during the pandemic."
  industry: consumer_social
  funding_stage: series_c_plus
  funding_total_usd: 200000000  # ~$30M seed/A + $170M Series C
  notable_investors:
    - "SoftBank Vision Fund 2 (lead, $170M Series C, June 2021)"
    - "Founders Fund"
    - "Goodwater Capital"
    - "Floodgate Fund"
    - "Dragoneer Investment Group"
    - "Scott Banister (co-founder, ex-PayPal board member)"
  founded_year: 2017

founders:
  - name: Abraham Shafi
    role: Founder & CEO
    persona_vibe: genuine_believer
    public_quotes:
      - "The philosophy is not to raise when you have to, but to raise when it makes sense. And we were scaling like crazy to the point where our servers were melting. It made sense to take those discussions very seriously when they came to us. (Shafi to TechCrunch, 2021)"
      - "Like the Olympics, we know most people don't want to be Olympians. … Becoming one of these iconic, impactful companies is akin to winning a gold medal in the Olympics. (June 2022 company-wide memo accompanying 25% layoff)"
    notable_history:
      - "Egyptian-born; co-founded IRL in 2017 with Scott Banister"
      - "GQ Middle East profile called him 'Middle East's First Founder of a Billion-Dollar Social Media App'"
      - "April 2023: Special board committee suspends him for 'a pattern of misconduct'"
      - "July 31, 2024: SEC files fraud charges; DOJ files criminal charges (obstruction of justice, securities fraud, wire fraud)"
      - "Per SEC: allegedly destroyed evidence by restoring his cell phone to a previous backup"
      - "Per SEC complaint: was last residing in Pepeekeo, Hawaii"
      - "Cases pending as of May 2026"
    twitter_handle: "@abrahamshafi"
  - name: Scott Banister
    role: Co-founder
    persona_vibe: second_time_founder
    public_quotes: []
    notable_history:
      - "Ex-PayPal board member; co-founded IRL with Shafi in 2017"
      - "Not charged"
  - name: Barbara Woortmann
    role: Shafi's fiancée
    persona_vibe: nepo_baby
    public_quotes: []
    notable_history:
      - "Per SEC complaint: Shafi and Woortmann allegedly used IRL company credit cards for hundreds of thousands of dollars of clothing, home furnishings, travel — including IRL's own wedding-related expenses, art classes, etc."

product:
  category_noun: "social messaging platform"
  the_thing_it_does: "Originally a social calendar app where Gen Z users could organize and discover events; pivoted in 2020-2021 to group messaging with the ambition of becoming a 'WeChat of the West' — a comprehensive social messaging platform combining chat, events, and content."
  buzzwords_used:
    - "WeChat of the West"
    - "Gen Z social"
    - "in real life"
    - "organic virality"
    - "12 million MAU" # later 20M
    - "viral growth coefficient"
    - "social calendar"
    - "group messaging"
    - "DAU/MAU"
    - "Olympic-tier"  # from the layoff memo
  customer_archetype: "Gen Z high schoolers and college students who would download a group-chat app to organize parties, study groups, and social events. Per the SEC complaint, that audience existed at roughly 5% of the size IRL claimed."

market:
  competitors:
    - "Discord"
    - "Snapchat"
    - "iMessage / FaceTime"
    - "GroupMe"
    - "Marco Polo"
    - "Instagram (DMs)"
  comparable_blowups:
    - "Frank (the synthetic-user precedent)"
    - "Theranos (the fundamental-misrepresentation Pantheon precedent)"
    - "HeadSpin (the Tiger / SoftBank-style cash-heavy lead-investor diligence-light precedent)"

vibe:
  twitter_presence: poster
  press_coverage_so_far: hot  # GQ Middle East, TechCrunch
  notable_dirt:
    - "Per SEC: Shafi told investors IRL had 12M users (later 20M MAU) acquired ORGANICALLY from users inviting friends"
    - "Per SEC: actual acquisition was massive paid acquisition through 'incentive advertising' — paying users in third-party apps to download IRL"
    - "Per SEC: Shafi told investors marketing was $50K/month; actual was $200K/month, hidden by being invoiced through a third-party firm"
    - "Per SEC: around the Series C, Shafi asked his ad vendor for a 'big burst' of ads for 'a few days' to drive installs"
    - "Per board's June 2023 special committee finding: 95% of users were bots/automated"
    - "Per SEC: Shafi and Woortmann allegedly used IRL company credit cards for hundreds of thousands of dollars of personal expenses"
    - "May 2022: internal employees start questioning user numbers"
    - "June 2022: 25% layoff; Shafi's 'Olympics' memo"
    - "April 2023: former employee Nicholas Grant files a legal complaint claiming he was fired for raising bot concerns"
    - "April 2023: Special board committee suspends Shafi for 'a pattern of misconduct'"
    - "June 2023: Board investigation concludes 95% of users automated; IRL announces shutdown"
    - "July 31, 2024: SEC fraud charges; DOJ criminal charges (obstruction of justice, securities fraud, wire fraud)"
    - "SoftBank sues Shafi for $150M"
    - "Strange legal twist: post-suspension, the founders sued the VCs back, claiming the VCs 'panicked' after the SEC began deposing them and commissioned an outside firm to produce a report blaming the platform's failure on bots in order to protect the VCs from reputational damage. Delaware Chancery Court is sorting it out."
    - "Sara Mauskopf (Winnie CEO) on Twitter: 'Building a real business without fraud means it's nearly impossible to reach unicorn status in a few years time. Lots more stories like this coming.'"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly June 2021, Series C just closed at $1.17B, the "WeChat of the West" press cycle is active):**
  - valuation_usd: 1_170_000_000
  - cash_usd: 170_000_000  # Series C proceeds
  - revenue_usd: 0  # consumer social with no ARPU yet
  - burn_usd_monthly: 4_000_000  # disclosed; actual is ~3-4× higher per SEC
  - headcount: ~100
  - fbi_awareness: 0.05  # not yet
  - fraud_score: 0.85  # the bot ratio is in place; the marketing-spend misrepresentation is in place
  - reputation: 0.85  # GQ Middle East, top-10 social app on Apple briefly
  - heat: 0.10  # internal employees aware but not yet external
  - day_elapsed: ~1500  # founded 2017

- **Pre-planted seeds:**
  - `bot_users_seed` — the central artifact; the future board's "95% automated" finding is loaded
  - `dau_inflation_seed` — 12M / 20M MAU pitched to investors; actual real-user count is meaningfully smaller
  - `incentive_advertising_seed` — paid acquisition via third-party app rewards; "$50K/month" disclosed vs. ~$200K/month actual
  - `third_party_invoicing_seed` — the marketing-spend hiding mechanism
  - `big_burst_ads_seed` — the literal "big burst" ad-vendor ask around Series C close
  - `consort_credit_card_seed` — Barbara Woortmann company card use; the lifestyle giveaway
  - `wedding_expenses_seed` — the IRL company card paying for wedding-related expenses; this will be in the indictment
  - `nicholas_grant_disgruntled_seed` — Nicholas Grant retaliation complaint (April 2023); the witness
  - `softbank_lawsuit_loaded_seed` — the $150M SoftBank suit is downstream
  - `phone_restored_seed` — the obstruction allegation (restored cell phone backup) gates the criminal-evidence-destruction beat
  - `pepeekeo_hawaii_seed` — the SEC complaint's last-known-address detail; gates the END-FLED variant
  - `vc_blame_pivot_seed` — the founders-sue-VCs counter-narrative (Delaware Chancery)
  - `revenue_rounded_up_seed` — canonical, applied to MAU rather than ARR

- **Pre-loaded figures:**
  - FIG-FRAUD-019 — The IRL Guys — historical anchor; the agent IS the fictional avatar
  - FIG-PRESS-013 — Kate Clark / The Information — paywalled-scoop voice (TechCrunch had the actual scoop; The Information has been on adjacent)
  - FIG-VC-001 / FIG-VC-002 — Marc Andreessen / Ben Horowitz — // dossier note: Founders Fund (not a16z) was on the IRL cap table; if the run wants a Tier-1 VC reaction, FF-side is the right anchor
  - FIG-VC-009 — Delian Asparouhov — Founders Fund partner reactions
  - // suggests EVT-LEGAL-NNN: SEC complaint filing day; SoftBank $150M civil suit caption
  - // suggests EVT-PR-NNN: TechCrunch "IRL shut down fake users" piece (June 2023)
  - // Additional figures the dossier mentions but not yet in cast.md: Scott Banister, Barbara Woortmann, Nicholas Grant (the whistleblower), Sara Mauskopf, Sean Byrnes, Masayoshi Son (SoftBank patron). Reference in body, no FIG IDs yet.

- **Notable open events / pivotal decisions:**
  - The Series C just closed — quietly let the bot users dilute over time, or do a "big burst" of paid ads to mask the bot ratio with new fake humans?
  - Internal employees are starting to question — promote the loudest, fire them, or run an internal "data quality" review that buries the answer?
  - Audit firm wants to sample DAU — give them the raw data, give them filtered data, or change auditors?
  - The personal credit card use is itemized — pay it back from personal funds, or wait for the SEC to find it?
  - When TechCrunch / The Information email for comment, engage, stonewall, or threaten?
  - When the SEC begins depositions, sue the VCs (the actual move) or stay quiet?

## Suggested arc (Oracle hint)

The historical arc, as a rhythm guide for the Oracle, runs roughly: turn 1-3, the Series C victory lap; GQ Middle East profile; top-10 on Apple. Turn 4-6, May 2022 internal questioning begins; June 2022 25% layoff and the "Olympics" memo. Turn 7-9, April 2023 Nicholas Grant retaliation complaint; April 2023 board suspends Shafi; June 2023 board's special committee finding (95% bots), shutdown announcement. Turn 10-13, July 31, 2024 SEC and DOJ charges (obstruction of justice based on the cell-phone backup restore); SoftBank $150M suit; founders countersue VCs in Delaware Chancery. Turn 14-18, the long pre-trial — case still pending as of May 2026. The historical anchor ending is END-PRISON-005 (post-charge, pre-resolution; the dossier marks IRL as "pending"). Divergent runs: voluntarily disclosing the bot ratio at Series C close and refunding $100M+ of the round could push to END-CULT-001 / END-FAILUP-002 (settlement-only, no criminal charges). Doubling down on the cell-phone backup obstruction is exactly what got the criminal case opened, so the historical arc is the worst case.

## Defamation notes

All real-named figures referenced here are limited to the public record:

- **Abraham Shafi** has pending DOJ charges (filed July 31, 2024) but is NOT post-conviction. Treat allegations as allegations. Bible-listed quotes are from his own public TechCrunch and company-memo statements. The fictional `[FOUNDER]` driven by this bible carries any in-run misconduct.
- **Scott Banister** has not been charged; `safe_reaction` only.
- **Barbara Woortmann** is a private individual named in the SEC complaint. Treat strictly per the public record; do not generate new private content or accusations beyond the SEC complaint's public allegations.
- **Nicholas Grant** is a public retaliation-complaint filer; his complaint is on the public record.
- **SoftBank Vision Fund / Masayoshi Son, Founders Fund, Goodwater Capital, Floodgate Fund, Dragoneer** — `safe_reaction` for cap-table presence. The SoftBank $150M civil suit is on the public record.
- **Sara Mauskopf, Sean Byrnes** — `safe_quote`. Their tweets quoted in the dossier are public; restate, don't invent.
- **TechCrunch reporters who covered the 2023 shutdown** — `safe_reaction`; the long-read postmortem in-game runs under a fictional outlet pastiche.

The fictional `[FOUNDER]` driven by this bible can be accused of anything because they are fictional. The share-card disclaimer makes this explicit.

## Sources

- TechCrunch, "Founder behind social media app IRL charged with fraud" (July 31, 2024) — https://techcrunch.com/2024/07/31/founder-behind-social-media-app-irl-charged-with-fraud/
- TechCrunch, "IRL shut down fake users" (June 26, 2023) — https://techcrunch.com/2023/06/26/irl-shut-down-fake-users/
- Fortune, "IRL shutting down: 95% of messaging app users were fake" (June 25, 2023) — https://fortune.com/2023/06/25/irl-shutting-down-startup-admits-95-percent-of-messaging-app-users-were-fake/
- Quartz, "Social app IRL is shutting down" — https://qz.com/social-app-irl-is-shutting-down-because-most-of-its-use-1850580325
- SFist, "Founder of social media startup IRL charged with $170M fraud scheme" (Aug 1, 2024) — https://sfist.com/2024/08/01/founder-of-social-media-startup-irl-charged-with-170m-fraud-scheme/
- Fortune, "Tech CEO VCs unicorn IRL fraud SoftBank" (Sept 4, 2025) — https://fortune.com/2025/09/04/tech-ceo-vcs-unicorn-irl-fraud-softbank/
- Slashdot tech, "Founder of collapsed social media site IRL charged with fraud over faked users" — https://tech.slashdot.org/story/24/08/05/0437221/founder-of-collapsed-social-media-site-irl-charged-with-fraud-over-faked-users
- Yahoo News, "Founder behind social media app charged" — https://www.yahoo.com/news/founder-behind-social-media-app-021408995.html
- SEC complaint, SEC v. Shafi (July 31, 2024) — sec.gov
