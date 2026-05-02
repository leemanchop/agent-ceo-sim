# Personalization — the slot-fill system

Personalization is what turns a generic "AI startup goes to prison" simulator into "*your* AI startup goes to prison." The pipeline:

```
user input  →  Researcher agent  →  Company Bible  →  slot resolver  →  per-event slot fill
```

## User input (onboarding)

Brutally short. From the brief:

1. **Company name** (free text)
2. **One-line description** (free text — fed to LLM as event-context)
3. **Industry tag** (single select: `ai_infra | ai_app | dev_tools | fintech | crypto | dtc | marketplace | enterprise_saas | consumer_social | hardware | biotech | climate | defense | other`)
4. **Founder vibe** (optional select: `stanford_dropout | ex_mckinsey | crypto_refugee | nepo_baby | genuine_believer | second_time_founder`)
5. **Length mode** (`short | medium | long`)
6. **Craziness** (`tame | normal | crazy | unhinged`)

Everything else is inferred. No "team size," no "cap table." 30 seconds end-to-end.

If the user skips upload entirely, generate a synthetic company:
- Name: Markov-chain over real-startup name patterns (`{abstract_noun}.ai`, `{latin_root}_labs`, `{greek_letter}_protocol`).
- Description: pulled from a stock list of 20 plausible blurbs.
- Industry/vibe: random.

## Researcher agent (one-shot, run start)

Inputs: user's 6 fields.

Process: web-search the company name + one-liner. Scrape landing page, founder LinkedIn, recent news, Twitter, Crunchbase if accessible, podcast appearances, etc. ~60-90 sec budget.

Output: **Company Bible** — a structured doc the Oracle reads on every turn.

```yaml
company:
  name: ...
  display_name: ...               # how the agent refers to itself
  one_liner: ...
  industry: ...
  funding_stage: seed | series_a | series_b | growth | ipo | bootstrapped
  funding_total_usd: int
  notable_investors: [...]
  founded_year: int

founders:
  - name: ...
    role: CEO | CTO | ...
    persona_vibe: ...             # from user select or inferred
    public_quotes: [...]          # direct from web research
    notable_history: [...]        # prior companies, controversies, schools
    twitter_handle: ...

product:
  category_noun: ...              # "MLOps platform" / "B2B fintech app" / "creator tool"
  the_thing_it_does: ...          # one clean sentence
  buzzwords_used: [...]           # from their site copy — agent will redeploy these
  customer_archetype: ...

market:
  competitors: [...]              # named, real
  comparable_blowups: [...]       # past similar-shape disasters from the world corpus

vibe:
  twitter_presence: lurker | poster | reply_guy | thought_leader | dormant
  press_coverage_so_far: minimal | growing | hot | overheating
  notable_dirt: [...]             # any scandals or "huh" moments found
```

## Slot vocabulary

Every event body uses `[SLOT_NAME]` markers. Slots are resolved per-event from the bible. Common slots:

### Identity slots
- `[COMPANY]` — display name
- `[FOUNDER]` — primary founder name
- `[FOUNDER_VIBE]` — vibe selector
- `[CTO]` — co-founder/CTO if exists, else `the engineering lead`
- `[INDUSTRY]` — industry tag in plain English

### Product slots
- `[PRODUCT_NOUN]` — "MLOps platform" / "marketplace" / "social app"
- `[CORE_FEATURE]` — the main thing the product does
- `[BUZZWORD]` — random pick from `buzzwords_used` (for the ratio'd LinkedIn post)

### Market slots
- `[COMPETITOR]` — random pick from `competitors`
- `[COMPARABLE_FRAUD]` — pulled from `comparable_blowups` (e.g., "the Theranos play")

### World slots (resolved against world corpus, not bible)
- `[TIER1_VC_PARTNER]` — random Tier-1 VC partner FIG entry
- `[JOURNALIST_TECH]` — random tech journalist FIG entry
- `[REGULATOR]` — appropriate regulator for current stage
- `[PARODY_ACCOUNT]` — random Greek-chorus parody handle
- `[PEER_FOUNDER]` — random peer-founder cameo
- `[AUSA_NAME]` — assistant US Attorney handling the matter
- `[STATE_AG]` — state attorney general (industry/run-state weighted)
- `[PROCUREMENT_OFFICER]` — Fortune 500 buyer archetype
- `[CHIEF_OF_STAFF]` — internal CoS archetype
- `[BANK_NAME_DODGY]` — second-tier bank with regulatory issues
- `[NON_EXTRADITION_COUNTRY]` — country pool for FLED endings
- `[CHANNEL_PARTNER_NAME]` — round-trip counterparty
- `[MICROCELEBRITY_VC]` — junior VC who is famous on Twitter only
- `[PODCAST_HOST_PARODY]` — generic podcaster slot
- `[SUBSTACK_HANDLE]` — independent journalist Substack
- `[INTERN_NAME]` — generic intern slot for Brayden-energy beats

## Resolution rules

1. **Determinism within a run.** A given slot, once resolved, sticks. `[TIER1_VC_PARTNER]` resolved to "Marc Andreessen" on turn 3 stays Marc Andreessen for the rest of the run *unless* the event explicitly says `slot_reroll: [TIER1_VC_PARTNER]`.

2. **Re-roll on payoff mismatch.** If an event plants a seed naming a specific journalist and the payoff event tries to use a different journalist, re-roll the payoff to match. Continuity > variety.

3. **Defamation-class respect.** Slot resolver filters figure pool by `defamation_class` against the event's safety profile. A `safe_reaction`-class figure can fill `[TIER1_VC_REACTING]` but not `[TIER1_VC_ACCUSED]`.

4. **Industry-aware filtering.** If `industry: crypto`, slot pool for `[REGULATOR]` weights toward SEC/CFTC. If `industry: biotech`, weights toward FDA/HHS. The world corpus tags figures and regulators by relevant industries.

5. **Vibe-aware filtering.** Founder-vibe biases events. `crypto_refugee` vibe makes `EVT-CA-*` events 2x as likely. `ex_mckinsey` makes consulting-flavor events fire. `nepo_baby` unlocks the family-trust banking subplot.

## Generation prompt fragment

The Oracle, when transmuting an event into a media artifact, is told:

> "Use the company bible voice. The founder's tweets sound like *this* (3-5 examples from `public_quotes`). The product copy uses *these* buzzwords (3-5 from `buzzwords_used`). When generating press headlines, match the publication's house style. When generating Slack leaks, match the disgruntled-engineer register from `voice_and_tone.md`."

Voice consistency with the *real* company's actual voice is what makes the satire bite. A boilerplate "the CEO tweeted X" doesn't land; "[FOUNDER] tweeted X in their lowercase no-punctuation cadence" does.
