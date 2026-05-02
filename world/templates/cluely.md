---
template_id: cluely
display_name: Cluely
tagline: "Cheat on everything. (And also on the ARR figure, allegedly.)"
era: 2025-present
default_length_mode: medium
default_craziness: crazy
historical_anchor_endgame: END-FAILUP-002
live_wire: true
warning: |
  This template is based on a recent, real, and only-partially-adjudicated
  story. The company is operating as of May 2026; no criminal charges have
  been filed; the most-recent public reporting is concentrated in
  TechCrunch, the SF Standard, and Inc., plus Roy Lee's own X posts and
  marketing copy. Allegations are presented as allegations or as the
  founder's own self-disclosure. The fictional `[FOUNDER]` driven by this
  bible is fictional regardless of how detailed the bible is — per the
  share-card disclaimer and per `defamation_policy.md`. No new accusations
  are introduced beyond what is already in the public record. If you want
  a template that lets you "do a Cluely" without naming Cluely, use the
  generic `engagement_farming_seed` synthetic instead.
---

# Template: Cluely

The "fraud-as-marketing" arc — the AI-cheating-tool that made the controversy itself the product. You start in mid-2025, post-Series-A close ($15M from a16z), with a viral launch video that shows the founder using the product to lie about his age on a date. The "$7M ARR" figure that the SF Standard cited is, the founder will admit on X in March 2026, "the only blatantly dishonest thing I've said publicly online." Your office is a SoMa house with 16 employees, mostly college dropouts. Run it straight and you find out what the on-record-fraud-as-marketing strategy looks like at scale. Run it differently and the simulator finds out whether the underlying tech (an AI that runs invisibly during interviews) could have lived as a legitimate product.

## Company Bible

```yaml
company:
  name: cluely
  display_name: Cluely
  one_liner: "An AI desktop tool that runs invisibly in a hidden window and feeds you real-time answers — for interviews, dates, sales calls, anything."
  industry: ai_app
  funding_stage: series_a
  funding_total_usd: 20300000  # $5.3M seed + $15M Series A
  notable_investors:
    - "Andreessen Horowitz / Marc Andreessen (lead, $15M Series A, June 2025)"
    - "Abstract Ventures (seed)"
    - "Susa Ventures (seed)"
  founded_year: 2024  # rebranded from Interview Coder April 2025

founders:
  - name: Chungin "Roy" Lee
    role: Co-founder & CEO
    persona_vibe: stanford_dropout  # actually Columbia-suspended, closest fit
    public_quotes:
      - "Cheat on everything. (Cluely tagline / launch slogan, April 2025)"
      - "I always harken back to ancestral living. Humans are biologically primed to live in a group, hunt with each other, and work together. We wake up, and we're all excited to hunt down the king of the jungle. (publicly attributed to Roy Lee in SF Standard profile, July 2025)"
      - "Engineers just cannot make good content. (TechCrunch Disrupt 2025)"
      - "the only blatantly dishonest thing I've said publicly online. (Roy Lee on X, March 2026, regarding the cited '$7M ARR' figure)"
    notable_history:
      - "Columbia University CS student"
      - "Built 'Interview Coder' (with Neel Shanmugam) — desktop AI tool that runs invisibly during virtual technical interviews"
      - "Used Interview Coder to land an Amazon internship and posted on X about it; Amazon rescinded the offer"
      - "Columbia put him on academic probation, then suspended him"
      - "Rebranded Interview Coder to Cluely, April 2025"
      - "Self-described as building 'as fratty as possible'"
    twitter_handle: "@im_roy_lee"
  - name: Neel Shanmugam
    role: Co-founder
    persona_vibe: stanford_dropout
    public_quotes: []
    notable_history:
      - "Co-built Interview Coder with Roy Lee at Columbia"

product:
  category_noun: "real-time AI assistance overlay"
  the_thing_it_does: "An AI desktop tool that runs invisibly in a hidden browser window during virtual meetings — interviews, dates, sales calls — and feeds the user real-time answers, fact-checks, and prompts. Originally pitched as 'Interview Coder' for technical interviews; rebranded to 'cheat on everything.'"
  buzzwords_used:
    - "cheat on everything"
    - "ancestral living"
    - "AI for the rest of us"
    - "real-time copilot"
    - "invisible AI"
    - "the calculator argument" # the manifesto comparing AI cheating to calculators
    - "engagement-first"
    - "engineers just cannot make good content"
    - "ARR" # the disclosed-as-inaccurate metric
  customer_archetype: "Job-seekers who want to ace technical interviews, salespeople who want live coaching during calls, daters who want to fact-check what their date said about a Picasso painting. Per the launch video — and per Inc.'s coverage — the brand is the use case."

market:
  competitors:
    - "ChatGPT (the obvious competitor; Cluely is essentially a context-aware overlay)"
    - "Final Round AI"
    - "interviewly.ai"
    - "Otter.ai (note-taking adjacent)"
    - "Granola (note-taking adjacent)"
    - "Various LLM browser extensions"
  comparable_blowups:
    - "Builder.ai (alleged 'AI' wrapper precedent)"
    - "Theranos (the canonical fraud-as-pitch precedent — Cluely's manifesto explicitly compares AI cheating to refusal-of-progress)"

vibe:
  twitter_presence: poster  # heavily online, viral controversy is the strategy
  press_coverage_so_far: hot  # TechCrunch, SF Standard, Inc., Vive, Design Whine, NBC News
  notable_dirt:
    - "Launch video (April 2025) shows Lee using Cluely on a date to lie about his age and pretend to know about art; widely compared to a Black Mirror episode"
    - "Per TechCrunch Disrupt 2025 reporting, Lee says viral controversy is the actual product strategy"
    - "Per public reporting, Lee pays 'over 60 content creators and 700 video editors' to flood social media"
    - "By June 2025, all references to 'cheating on job interviews' had been removed from Cluely's marketing site"
    - "March 2026: Lee admits on X that the company's previously reported '$7M ARR' figure (cited in the SF Standard profile and elsewhere) was not accurate; calls it 'the only blatantly dishonest thing I've said publicly online'"
    - "Inc., May 2026: 'an a16z-backed startup that helps people cheat on job interviews just got caught in a $7 million lie — the CEO was sweating'"
    - "SoMa office/house. 16 employees, mostly college dropouts. The CEO's nameplate is a handwritten 'CEO Cluely' taped to the wall. Self-described as 'as fratty as possible.'"
    - "One employee is an 18-year-old high school non-graduate from Minnetonka MN who left without a diploma. Another is a 40-year-old engineering intern."
    - "Marc Andreessen — yes, that one — backed Cluely (per public Series A reporting)"
    - "Cluely was a Delve customer; Barry McCardel on X: 'there's something truly sublime about cluely being scammed on their SOC 2'"
```

## Loaded starting state (turn 0)

When this template is selected, the simulator pre-loads:

- **Stats (turn 0 = roughly mid-2025, Series A just closed, viral cycle running):**
  - valuation_usd: 120_000_000  # implied by the Series A; not officially confirmed in dossier
  - cash_usd: 18_000_000
  - revenue_usd: 2_000_000  # actual; the publicly-cited $7M figure is what Lee will later acknowledge as inaccurate
  - burn_usd_monthly: 800_000
  - headcount: 16  # the SoMa office headcount
  - fbi_awareness: 0.05  # not a federal matter; this is a customer-trust / TOS / academic-integrity matter
  - fraud_score: 0.45  # contested — the ARR self-disclosure is on the record but no other allegations are formally adjudicated
  - reputation: 0.65  # genuinely viral; controversy is genuinely the strategy
  - heat: 0.65  # multiple journalist DMs, Inc. piece imminent, the X discourse is sustained
  - day_elapsed: ~500  # founded 2024

- **Pre-planted seeds:**
  - `cheating_as_marketing_seed` — the viral controversy is the product strategy per the founder's own public statements
  - `engagement_farming_seed` — 60+ content creators, 700 video editors, controversy-as-distribution
  - `arr_self_disclosed_inaccurate_seed` — the $7M ARR figure that the founder later admits on X was "the only blatantly dishonest thing"
  - `cluely_was_a_delve_customer_seed` — the Barry McCardel X post; the cross-template payoff hook (pays into delve template)
  - `marketing_site_quietly_updated_seed` — June 2025 removal of "cheating on job interviews" framing; the artifact-fingerprint
  - `manifesto_calculator_argument_seed` — the founder's "this is just like the calculator" justification; the It's Actually Good reframe trope
  - `frat_house_office_seed` — SoMa office, handwritten CEO nameplate, fratty self-description
  - `high_school_non_graduate_employee_seed` — the 18-year-old Minnetonka employee
  - `40_year_old_intern_seed` — the engineering intern
  - `andreessen_loaded_seed` — Marc Andreessen's a16z backing is loaded; will reverberate in any "Marc backs everything" thread
  - `columbia_suspended_seed` — the founder's academic suspension is the origin myth
  - `amazon_offer_rescinded_seed` — origin myth: the offer that started the company
  - `tos_violation_seed` — the product structurally violates many platforms' interview / call / TOS terms; gates platform-pulldown beats
  - `revenue_rounded_up_seed` — applied pre-Lee-self-disclosure

- **Pre-loaded figures:**
  - FIG-VC-001 — Marc Andreessen — pre-loaded as the named lead investor
  - FIG-VC-002 — Ben Horowitz — pre-loaded as a16z partner-in-arms
  - FIG-PRESS-005 / FIG-PRESS-019 — Ed Zitron — circling; "the AI is people / engagement farming" voice
  - FIG-PRESS-007 — Eric Newcomer — VC-beat newsletter coverage
  - FIG-PRESS-013 — Kate Clark / The Information — paywalled-scoop voice
  - FIG-CHORUS-001 through FIG-CHORUS-009 — parody chorus accounts; the bulk of the heat content is parody-account, not real names
  - FIG-FRAUD-005 — Trevor Milton — anchor reference (the demo-fraud Pantheon precedent — the "social media skills used to tout the company in materially false ways" phrase is an exact rhyme)
  - FIG-FRAUD-001 — Elizabeth Holmes — anchor reference (the "It's Actually Good" calculator-argument reframe trope)
  - // suggests EVT-PR-NNN: Inc. profile "got caught in a $7 million lie — the CEO was sweating"
  - // suggests EVT-PR-NNN: Roy Lee X self-disclosure ("the only blatantly dishonest thing I've said publicly online")
  - // suggests cross-template payoff: cluely_was_a_delve_customer_seed pays into delve.md's customer_trust_brittle_seed
  - // Additional figures the dossier mentions but not yet in cast.md: Roy Lee, Neel Shanmugam, Barry McCardel. Reference in body, no FIG IDs yet.

- **Notable open events / pivotal decisions:**
  - The "$7M ARR" figure is being cited externally — correct it now (eat the news cycle), or wait until the Inc. piece forces the disclosure?
  - The "cheat on everything" framing is being scrubbed from the marketing site — finish the scrub or lean back into the controversy?
  - A platform (Zoom, a major ATS, an interview-platform vendor) is making noise about TOS — engineer around it, comply, or lawyer up?
  - The viral content engine is producing more videos than the product can support — keep producing, throttle, or pivot to "transparency mode"?
  - Hire actual senior engineers to make the product real, or stay college-dropout?
  - Take the next-round bridge from a16z at a markup, or wait for the controversy cycle to peak?

## Suggested arc (Oracle hint)

The historical arc is not yet resolved in real life. The Oracle should treat this as a "live wire" arc where divergence is the default, not the exception. As a rhythm guide: turn 1-3, the launch-video / "cheat on everything" cycle peaks; the SF Standard profile lands; the $7M ARR figure enters the bloodstream. Turn 4-6, marketing-site references to "cheating on job interviews" are scrubbed (June 2025); the post-launch optics cycle stabilizes. Turn 7-9, the cross-template Delve incident hits (Cluely was a Delve customer; the SOC 2 thing happens to them) — this is comedic in the discourse but is also a real customer-trust event. Turn 10-12, March 2026 the founder self-discloses the ARR was inaccurate; Inc. piece lands the same week ("the CEO was sweating"). Turn 13-15, the company either pivots to a transparency-and-compliance posture (END-FAILUP-002 / END-CULT-001), or rides the controversy cycle into platform-level pulldowns and a wave of TOS lawsuits. The historical anchor ending is END-FAILUP-002 (the company is bigger, not smaller, in May 2026) but END-CULT-001 (the documentary), END-PRISON-005 (small civil settlement), and END-FAILUP-001 (acqui-hire) are all live. Criminal endings against the founder are NOT historically anchored here — the public reporting does not at present contemplate criminal exposure for Roy Lee, and the simulator should not lean toward those endings unless the agent's own choices in-run actively push toward them.

## Defamation notes

This is one of the two `live_wire: true` templates and the rules are correspondingly strict.

- **Roy Lee** and **Neel Shanmugam** are real, living founders with no criminal adjudication. The bible draws strictly from their own public posts, public marketing copy, and public press coverage (TechCrunch, SF Standard, Inc., Design Whine, NBC News, Vive, the Wikipedia entry on Roy Lee). The fictional `[FOUNDER]` driven by this bible is treated as **fictional** regardless of how detailed the bible is. The share-card disclaimer is mandatory on all share artifacts for this template. The Oracle is constrained to:
  - NOT generate new accusations of crime, fraud, or specific deceptive conduct against the real founders beyond what they have themselves publicly disclosed (the ARR self-disclosure being the canonical example).
  - NOT generate private content (DMs, Slack screenshots quoted as if real, "leaked board minutes") attributed to the real founders.
  - NOT depict the real founders in scenes alongside the fictional `[FOUNDER]`. The fictional `[FOUNDER]` carries any in-run misconduct alone.
  - The bible's `notable_dirt` is restricted to allegations as already published in named outlets, framed as allegations, with the founder's own response (where given) noted.
- **Cluely (the company)** is named. The fictional avatar in the run is "[COMPANY]" and is fictional. Share-card disclaimer footer applies.
- **Marc Andreessen, a16z, Abstract Ventures, Susa Ventures** appear strictly as `safe_reaction` cap-table presence — they posted/invested what they posted/invested, and they react to the fictional company's beats with the kind of thing they actually post. They do not endorse fraud on screen.
- **TechCrunch, SF Standard, Inc., Ed Zitron, Kate Clark, Eric Newcomer, NBC News** appear as `safe_reaction` — they wrote what they wrote, framed as having "first reported" things; the long-read postmortem in-game runs under a fictional outlet pastiche.
- **Barry McCardel, Aakash Gupta, Gergely Orosz, Jason Calacanis** appear strictly via their already-public X posts. No new content.
- **The 18-year-old Minnetonka employee, the 40-year-old intern, the 60+ content creators, the 700 video editors** — referenced strictly at the level of public characterization. Specific named individuals are not depicted on screen; if a "former employee" character is needed in a scene, use the parody handle `@layoff_anon` or a fictional first-name-only character.
- **Pantheon analogy** — Trevor Milton (Nikola) and Elizabeth Holmes (Theranos) precedents are referenced as historical context (`[COMPARABLE_FRAUD]`), not as on-screen comparisons attributing equivalent conduct to Cluely. The bit is "this is what the Twitter chorus is comparing it to," not "this is what we are saying happened."
- **Live-wire enforcement** — While `live_wire: true`, no event in this run can fire a `#fraud_heavy` payoff against a real-named cap-table or founder figure; only `#fraud_lite` (and only against the fictional `[FOUNDER]`). The fictional founder can be accused of anything because the fictional founder is fictional.

If any future legal development changes the public record — formal SEC, FTC, FBI, or DOJ action; a settled civil suit; a retraction by the reporting outlets — review and update this template before re-publishing it. If the company sues a satire publication (or this one), move both founders to `restricted` and disable this template entirely.

## Sources

- TechCrunch, "Columbia student suspended over interview cheating tool raises $5.3M to cheat on everything" (April 21, 2025) — https://techcrunch.com/2025/04/21/columbia-student-suspended-over-interview-cheating-tool-raises-5-3m-to-cheat-on-everything/
- SF Standard, "Cluely startups Roy Lee Columbia cheating viral TikTok" (July 18, 2025) — https://sfstandard.com/2025/07/18/cluely-startups-roy-lee-columbia-cheating-viral-tiktok/
- Inc., "An a16z-backed startup that helps people cheat on job interviews just got caught in a $7 million lie — the CEO was sweating" — https://www.inc.com/leila-sheridan/an-a16z-backed-startup-that-helps-people-cheat-on-job-interviews-just-got-caught-in-a-7-million-lie-the-ceo-was-sweating/91313070
- Design Whine, "Interview Cluely Founder Roy Lee" — https://www.designwhine.com/interview-cluely-founder-roy-lee/
- NBC News, "Columbia University student trolls big tech AI tool job applications" — https://www.nbcnews.com/tech/tech-news/columbia-university-student-trolls-big-tech-ai-tool-job-applications-rcna198454
- Vive blog, "Columbia dropouts AI tool Cluely cheats on everything" — https://blog.vive.com/us/columbia-dropouts-ai-tool-cluely-cheats-on-everythingand-we-tried-it/
- Roy Lee Wikipedia entry — https://en.wikipedia.org/wiki/Roy_Lee_(entrepreneur)
- Roy Lee X / Twitter (the March 2026 ARR self-disclosure post)
- Barry McCardel on X (Cluely-was-a-Delve-customer post) — https://x.com/barrald/status/2034800203140931653
