---
template_id: delve
display_name: Delve
tagline: "AI agents for SOC 2. (494 audits, 493 of them identical.)"
era: 2023-present
default_length_mode: medium
default_craziness: normal
historical_anchor_endgame: END-FAILUP-002
live_wire: true
warning: |
  This template is based on a recent, real, and only-partially-adjudicated
  controversy. Every factual claim in this bible is sourced to public
  reporting (the DeepDelver Substack two-part investigation March 2026,
  TechCrunch coverage of the YC removal, Y Combinator's own posted action,
  Delve's own marketing copy and public defense, and the founders' public
  posts). Allegations are presented as allegations; the company's public
  defense is also recorded. The fictional `[FOUNDER]` driven by this bible
  is fictional regardless of how detailed the bible is — per the share-card
  disclaimer and per `defamation_policy.md`. No new accusations are
  introduced beyond what is already in the public record. If you want a
  template that lets you "do a Delve" without naming Delve, use the generic
  `ai_compliance_seed` synthetic instead.
---

# Template: Delve

The AI-compliance-startup arc, captured at the moment public reporting started circling. Delve raised on the pitch that an "AI-native" automation platform could deliver SOC 2, ISO 27001, HIPAA, and GDPR compliance "in days, not months" using AI agents to collect evidence, write reports, and monitor compliance gaps — pricing was $6,000–$15,000 for packages that conventionally cost six figures and took 6–12 months. Then, in March 2026, an anonymous Substack writer using the handle "DeepDelver" — themselves a former Delve customer who'd been pooling resources with other suspicious customers — published "Delve – Fake Compliance as a Service," and Y Combinator removed the company from its directory two weeks later. The arc is not over in real life. In the simulator, the agent inherits the moment of maximum velocity and decides what to do with it.

## Company Bible

```yaml
company:
  name: delve
  display_name: Delve
  one_liner: "AI compliance agents that automate SOC 2, HIPAA, ISO 27001, and GDPR — get audit-ready in days, not months."
  industry: enterprise_saas
  funding_stage: series_a
  funding_total_usd: 35000000  # $3M seed + $32M Series A (July 2025)
  notable_investors:
    - "Y Combinator (W24 batch)"
    - "Insight Partners (lead, $32M Series A, July 2025)"
    - "General Catalyst"
    - "FundersClub"
    - "Soma Capital"
    - "Fortune 500 CISO angels (per public reporting)"
  founded_year: 2023

founders:
  - name: Karun Kaushik
    role: CEO & Co-founder
    persona_vibe: stanford_dropout
    public_quotes:
      - "we grew too fast and fell short of our own standard. To our customers, we deeply apologize for the inconveniences caused. (Karun Kaushik on X, response to DeepDelver, March 2026)"
      - "Delve gets you compliant in days, not months. (delve.co marketing copy)"
      - "Delve does not itself perform audits or issue final SOC 2 reports, but instead provides software and automation. (Delve blog response to misleading claims, March 2026)"
    notable_history:
      - "MIT student; took leave to do YC W24"
      - "Founded Delve from MIT dorm at 21"
      - "Forbes 30 Under 30 (2026 list, the same list class as Delve's collapse)"
    twitter_handle: "@karun_kaushik"
  - name: Selin Kocalar
    role: COO & Co-founder
    persona_vibe: stanford_dropout
    public_quotes:
      - "YC and Delve have parted ways. I still remember the day we took our YC interview at MIT. We're so grateful to the community and every founder friend we've made. (Selin Kocalar on X, April 4, 2026)"
    notable_history:
      - "MIT student; YC W24"
      - "Forbes 30 Under 30 (2026 list)"
    twitter_handle: "@selinkocalar"

product:
  category_noun: "AI compliance platform"
  the_thing_it_does: "Drop in an AI agent that maps your codebase, infrastructure, and policies to SOC 2 / HIPAA / ISO controls; auto-generates evidence; preps you for the auditor; routes through partner audit firms (Accorp and Gradient per DeepDelver); manages the audit lifecycle end-to-end."
  buzzwords_used:
    - "AI agent for compliance"
    - "compliant in days, not months"
    - "continuous compliance"
    - "compliance autopilot"
    - "Pathways" # the no-code workflow product
    - "Questionnaire AI"
    - "agentic"
    - "trust center"
    - "evidence collection"
    - "policy generation"
    - "AI-native"
  customer_archetype: "Series A and B startups whose enterprise prospect just asked for a SOC 2 report and who would prefer to spend $15K and a weekend rather than $80K and three months with Vanta or Drata. Public customer list (per Delve's own marketing) included Lovable, Bland, Cluely, Notion, Brex, Anthropic, Gusto, and NASDAQ-traded Duos Edge."

market:
  competitors:
    - "Vanta"
    - "Drata"
    - "Secureframe"
    - "Tugboat Logic (OneTrust)"
    - "Thoropass"
    - "AuditBoard"
    - "Sprinto"
  comparable_blowups:
    - "Builder.ai (alleged 'AI' that was largely human contractors)"
    - "Theranos (the wrapper-disclosure precedent in healthtech)"
    - "Nikola (the demo-fraud Pantheon precedent)"

vibe:
  twitter_presence: poster
  press_coverage_so_far: hot
  notable_dirt:
    - "DeepDelver (anonymous Substack, March 18-22, 2026) alleges 493 of 494 SOC 2 reports were 99.8% identical — same paragraphs, same grammatical errors, same exact phrasing across hundreds of clients, only the customer name changed"
    - "DeepDelver alleges auditor reports and test results were fully populated BEFORE clients submitted their company descriptions, network diagrams, or any evidence — directly violating AICPA independence rules"
    - "Customers were routed through two audit firms — 'Accorp' and 'Gradient' — that DeepDelver claims were 'part of the same operation' operating primarily in India ('certification mills')"
    - "DeepDelver alleges Delve's 'Questionnaire AI' auto-answered ~70% of vendor security questions with answers that were untrue (claims of MDM, 200-hour pen-tests, regular backup restoration simulations) — none of which had been performed"
    - "December 2025: a whistleblower email circulated to hundreds of Delve clients alleging audit reports were fabricated; CEO Karun Kaushik publicly told customers no external party had gained access"
    - "DeepDelver Part II (March 30, 2026) alleges Delve's no-code 'Pathways' product ($50K–$200K per seat) was a fork of SimStudio, the Apache 2.0 open-source product of Sim.ai (a fellow YC company) with attribution stripped — Sim.ai had been a paying Delve customer ($15K, with Karun Kaushik personally handling onboarding); Sim co-founder Emir Karabeg quoted: 'Ultimately, it's open source so there's nothing we can really do about it'"
    - "April 4, 2026: Y Combinator removed Delve from its directory and asked the founders to leave the program; leaked YC Bookface chat from Garry Tan: 'We have asked Delve to leave YC. YC is a community, not just an accelerator. The founders in our community have to trust each other'"
    - "Insight Partners removed (then partially restored) blog posts about the investment from its website; LinkedIn announcement remains deleted"
    - "Delve's defense: 'coordinated cyberattack' — claim an attacker bought Delve under false pretenses and 'weaponized' exfiltrated data in a smear campaign, citing two cybersecurity firms"
    - "Out-of-home advertising spend in fall 2025: bus ads and billboards across SF, NYC, Austin; Delve published a blog post bragging about the spend levels with the principle that 'if this startup can afford this and pull it off, they must be legit'"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly the moment DeepDelver Part I drops, mid-March 2026):**
  - valuation_usd: 300_000_000  # post-Insight Partners Series A, July 2025
  - cash_usd: 25_000_000
  - revenue_usd: 12_000_000  # ARR per public reporting; the customer count was 1,500+
  - burn_usd_monthly: 1_500_000
  - headcount: ~50  # FTE; "Accorp" / "Gradient" are downstream of the FTE count
  - fbi_awareness: 0.05  # not a federal matter at start; HIPAA criminal exposure is a downstream possibility for customers
  - fraud_score: 0.55  # contested — public allegations are denied by Delve but the 493/494 detail is hard to wave off
  - reputation: 0.55  # was 0.85 in October 2025 (post-Series A); rapidly declining as Substack lands
  - heat: 0.80  # extremely hot — multiple journalist DMs, two-part Substack, Aakash Gupta and Gergely Orosz both posting
  - day_elapsed: ~900  # founded 2023, run starts ~March 2026

- **Pre-planted seeds:**
  - `wrapper_disclosure_seed` — the "AI agent" reportedly leans on templated SOC 2 packs and "thin SAAS platform wrapper" per DeepDelver
  - `identical_reports_seed` — the 493/494 reports are 99.8% identical; one downstream customer comparison will detonate this
  - `pre_populated_evidence_seed` — auditor conclusions written before client evidence submitted; AICPA independence rule violation
  - `cert_mill_loop_seed` — Accorp / Gradient routing; allegations they are "the same operation" with nominal U.S. presence
  - `questionnaire_ai_lying_seed` — the AI auto-answers vendor security questionnaires with inflated capabilities
  - `whistleblower_email_seed` — a December 2025 email already circulated to hundreds of customers; the agent decides whether to address publicly
  - `apache_attribution_stripped_seed` — Pathways is a SimStudio fork with attribution removed; one fellow YC founder away from detonation
  - `customer_paying_for_their_own_audit_seed` — Sim.ai paid Delve $15K for SOC 2/HIPAA while Delve was building Pathways from SimStudio
  - `yc_alumni_chorus_seed` — YC W24 peers and alumni are subtweeting in both directions; YC's own posture is in question
  - `customer_trust_brittle_seed` — public customer list (Lovable, Bland, Cluely, Notion, Brex, Anthropic, Gusto, Duos Edge) is a list of brand-name reputations now exposed to HIPAA/GDPR clawback risk
  - `journalist_circling_seed` — TechCrunch, The Tech (MIT), Captain Compliance already posted; substack ecosystem is feeding
  - `founder_posting_seed` — Karun and Selin's apology posts are themselves evidence in the discourse
  - `cyberattack_defense_seed` — Delve's "coordinated cyberattack" defense is loaded as a Chekhov's claim; two cybersecurity firms named, neither with public report
  - `ooh_ad_spend_seed` — the bus-ad blog post is a tonal smoking gun loaded for the postmortem
  - `revenue_rounded_up_seed` — soft seed; deck-vs-reality is downstream payoff

- **Pre-loaded figures (already in the run at turn 0):**
  - FIG-VC-004 — Paul Graham — YC alumni chorus, posting essays about "founder mode" that everyone reads as either defense or critique
  - FIG-VC-008 / FIG-VC-025 — Garry Tan — current YC president; the Bookface "we have asked Delve to leave YC" message is canonical
  - FIG-VC-009 — Delian Asparouhov — Founders Fund partner reacting on X (note: Delve's lead was Insight, but the FF chorus reacts adjacent)
  - FIG-PRESS-005 / FIG-PRESS-019 — Ed Zitron — the "the AI is people" Better Offline / Where's Your Ed At ecosystem is exactly the voice for this
  - FIG-PRESS-007 — Eric Newcomer — VC-beat newsletter coverage of the Series A and the fallout
  - FIG-PRESS-013 — Kate Clark / The Information — "we obtained internal Slack screenshots" angle
  - FIG-FRAUD-005 — Trevor Milton — anchor reference (the demo-fraud Pantheon precedent for "the AI was actually templates")
  - FIG-FRAUD-001 — Elizabeth Holmes — anchor reference (the wrapper-disclosure Pantheon precedent in healthtech / regulated framework)
  - FIG-CHORUS-001 through FIG-CHORUS-009 — parody chorus accounts already firing; the bulk of the heat content is parody-account, not real names
  - // Additional figures the dossier mentions but not yet in cast.md: Aakash Gupta, Gergely Orosz, Barry McCardel, Jason Calacanis, Emir Karabeg (Sim.ai). Reference in body, no FIG IDs yet.
  - // suggests EVT-PR-NNN: "Aakash Gupta tweet — 'When your defense to you faked the reports is we only made the drafts...'"

- **Notable open events / pivotal decisions:**
  - Issue a public clarification post / blog "How Delve Actually Works" with full disclosure, or stay silent and let YC's defense carry the news cycle?
  - Sue DeepDelver (defamation playbook) or stay quiet on the Substack?
  - Lean into the "coordinated cyberattack" framing or quietly retract it?
  - Pay Sim.ai a settlement and add SimStudio attribution, or wait for the open-source license argument?
  - Refund the customer list ahead of the HIPAA clawback wave, or wait for them to sue?
  - Take an emergency bridge from Insight at a down-round, or ride out the heat with current cash?
  - Pivot to a different vertical (HIPAA-only, transparency-mode SKU) to escape the SOC 2 specific story?

## Suggested arc (Oracle hint)

The historical arc is not yet resolved in real life. The Oracle should treat this as a "live wire" arc where divergence is the default, not the exception. As a rhythm guide: turn 1-3, the DeepDelver Part I post is up, the founders' first responses (the "we grew too fast" apology, the "coordinated cyberattack" framing) set the tone. Turn 4-6, customer churn signals start to land; YC's posture solidifies; DeepDelver Part II drops the Sim.ai IP-theft story, which is the move that killed them more than the customer fraud. Turn 7-10, YC removes Delve from the directory (April 4 in real life); Insight Partners removes the blog post; the Bookface message leaks; the founders go quieter. Turn 11-15, either the company executes a credible repositioning (full disclosure, SimStudio attribution, customer refunds, transparency dashboard) and stabilizes, or the spiral continues into a customer revolt, downstream HIPAA criminal exposure for customers, and a board-driven leadership change. The historical anchor ending is END-FAILUP-002 (new company, same pitch, different logo) but END-CULT-001 (the documentary), END-FAILUP-001 (acqui-hire), and END-PRISON-005 (small civil settlement, no criminal exposure on founders) are all live. Criminal endings against the founders are NOT historically anchored here — the public reporting does not at present contemplate criminal exposure for Karun or Selin, and the simulator should not lean toward those endings unless the agent's own choices in-run actively push toward them.

## Defamation notes

This is the most defamation-sensitive of the preset templates and the rules are correspondingly strict. `live_wire: true`.

- **Karun Kaushik** and **Selin Kocalar** are real, living founders with no criminal adjudication. The bible draws strictly from their own public posts, public marketing copy, and public press coverage (DeepDelver, TechCrunch, The Tech, Captain Compliance). The fictional `[FOUNDER]` driven by this bible is treated as **fictional** regardless of how detailed the bible is. The share-card disclaimer is mandatory on all share artifacts for this template. The Oracle is constrained to:
  - NOT generate new accusations of crime, fraud, or specific deceptive conduct against the real founders.
  - NOT generate private content (DMs, Slack screenshots quoted as if real, "leaked board minutes") attributed to the real founders.
  - NOT depict the real founders in scenes alongside the fictional `[FOUNDER]`. The fictional `[FOUNDER]` carries any in-run misconduct alone.
  - The bible's `notable_dirt` is restricted to allegations as already published in DeepDelver and reported by named outlets, framed as allegations, with the company's public dispute noted.
- **Delve (the company)** is named. The fictional avatar in the run is "[COMPANY]" and is fictional. Share-card disclaimer footer: "a fictional simulation; not a representation of any real company's actual conduct."
- **YC, Garry Tan, Paul Graham, Insight Partners, General Catalyst, Delian Asparouhov, Founders Fund** appear strictly as `safe_reaction` cap-table or chorus presence — they posted what they posted, they react to the fictional company's beats with the kind of thing they actually post. The Garry Tan Bookface message ("We have asked Delve to leave YC...") is on the public record and may be quoted.
- **DeepDelver** is, by design, anonymous. The simulator does not unmask them. Use as a `[SUBSTACK_HANDLE]`-class voice; do not invent a real name for them.
- **Sim.ai / Emir Karabeg** — appear as `safe_reaction`. Karabeg's quote is publicly reported; do not put new words in his mouth.
- **Aakash Gupta, Gergely Orosz, Barry McCardel, Jason Calacanis** appear strictly via their already-public X posts (quoted in the dossier) and the Calacanis podcast comparison. No new content.
- **TechCrunch, The Information, Ed Zitron, Kate Clark, Eric Newcomer** appear as `safe_reaction` — they wrote what they wrote, framed as having "first reported" things; the long-read postmortem in-game runs under a fictional outlet pastiche.
- **Audit firms named in DeepDelver ("Accorp", "Gradient")** — referenced strictly at the level of public allegation. Specific named individuals at those firms are not depicted on screen.
- **Pantheon analogy** — Builder.ai, Theranos, Trevor Milton (Nikola) precedents are referenced as historical context (`[COMPARABLE_FRAUD]`), not as on-screen comparisons attributing equivalent conduct to Delve. The bit is "this is what the Twitter chorus is comparing it to," not "this is what we are saying happened."
- **Live-wire enforcement** — While `live_wire: true`, no event in this run can fire a `#fraud_heavy` payoff against a real-named cap-table or founder figure; only `#fraud_lite` (and only against the fictional `[FOUNDER]`). The fictional founder can be accused of anything because the fictional founder is fictional.

If any future legal development changes the public record — formal SEC, FTC, or DOJ action; settled civil suit; retraction by the reporting outlets — review and update this template before re-publishing it. If the company sues a satire publication (or this one), move both founders to `restricted` and disable this template entirely.

## Sources

- DeepDelver, "Delve – Fake Compliance as a Service – Part I" — https://deepdelver.substack.com/p/delve-fake-compliance-as-a-service
- DeepDelver, "Delve – Fake Compliance as a Service – Part II" (Sim.ai) — https://deepdelver.substack.com/p/delve-fake-compliance-as-a-service-98a
- TechCrunch, "Delve accused of misleading customers with fake compliance" (March 22, 2026) — https://techcrunch.com/2026/03/22/delve-accused-of-misleading-customers-with-fake-compliance/
- TechCrunch, "Embattled startup Delve has parted ways with Y Combinator" (April 4, 2026) — https://techcrunch.com/2026/04/04/embattled-startup-delve-has-parted-ways-with-y-combinator/
- The Tech (MIT student paper), "Delve fraud reports" (April 9, 2026) — https://thetech.com/2026/04/09/delve-fraud-reports
- Captain Compliance, "The Delve Scandal" — https://captaincompliance.com/news/the-delve-scandal-fake-soc-2-audits-open-source-code-theft-and-exit-from-y-combinator/
- "Delve's Capital Sin and YC's Code Of" — https://genaiassembling.substack.com/p/delves-capital-sin-and-ycs-code-of
- Ali Kriegsman, "Unpacking the Insanity of the Delve" — https://alikriegsman.substack.com/p/unpacking-the-insanity-of-the-delve
- Delve's response — https://delve.co/blog/response-to-misleading-claims
- IANS Research, "Delve Allegations Expose Weak Points" — https://www.iansresearch.com/resources/all-blogs/post/security-blog/2026/04/19/delve-allegations-expose-weak-points-in-modern-compliance
- VisoTrust, "Delve AI Compliance" — https://visotrust.com/resources/delve-ai-compliance/
- Evan Epstein, "When the Compliance Company Becomes" — https://evanepstein.substack.com/p/when-the-compliance-company-becomes
- Gergely Orosz on X — https://x.com/GergelyOrosz/status/2039305666108575833
- Aakash Gupta on X — https://x.com/aakashgupta/status/2035191276564336782
- Barry McCardel on X — https://x.com/barrald/status/2034800203140931653
