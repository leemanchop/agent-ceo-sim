# Schemas

All world-corpus records use a consistent format: a markdown header with stable ID, a metadata block, and a body.

## Event schema

```
## EVT-{CAT}-{NUM} — "Short title"
- tags: [tag_1, tag_2, ...]
- severity: S | M | L | XL
- prereqs: [seed_id, ...]      # all must be active for this event to fire
- prereqs_any: [seed_id, ...]  # OR-list (any one satisfies)
- plants: [seed_id, ...]       # seeds this event activates
- pays_off: [seed_id, ...]     # seeds this event resolves
- cooldown: turns              # min turns before another event in this cluster fires
- slots: [SLOT_NAME, ...]      # personalization slots used
- effects: { stat: delta, ... }
- length_eligibility: [short, medium, long]
- chain_weight: 1.0            # baseline; higher when prereqs satisfied

Body prose. Uses [SLOT_NAME] for personalization. Reads as a single beat, not a full scene. The Oracle will transmute this into a media artifact (tweet, headline, Slack thread, etc.) at run time.

Notes (optional): designer notes about chain potential, voice, expected payoff window.
```

### Categories
- **FR**: Fundraising & Capital
- **PE**: Product & Engineering
- **HP**: Hiring & People
- **LR**: Legal, Regulatory & Compliance
- **PR**: Press & PR
- **CS**: Customers & Sales
- **FB**: Founder/CEO Personal Behavior
- **CA**: Crypto / Web3 / AI Adjacency
- **OO**: Operations & Office
- **BF**: Banking & Finance
- **FE**: FBI / Endgame Triggers

### Severity scale
- **S — cosmetic.** Affects a single reputation axis by ≤5. Background texture.
- **M — manageable.** Multi-axis effects. Shifts narrative direction. Typical mid-game beat.
- **L — crisis.** Forces CEO to spend a turn responding. Plants major seeds.
- **XL — existential.** Threatens run termination or unlocks a new arc. Rare; gated by prereqs.

## Figure schema

```
## FIG-{CAT}-{NUM} — Real Name (or @handle, or [Archetype])
- type: real_person | real_org | parody_account | archetype
- domain_tags: [tech_press, vc_tier1, lawyer_white_collar, ...]
- voice: short voice-tone descriptor
- typical_beats: [list of how they tend to cameo]
- defamation_class: safe_reaction | safe_quote | restricted | parody_only
- slots_filled: [TIER1_VC_PARTNER, JOURNALIST_TECH, ...]

Body: 2-4 sentence flavor description for the Oracle to draw on for voice consistency.
```

### Defamation classes
- `safe_reaction` — can react (tweet, block, quote-dunk) but cannot have new accusatory facts attributed to them
- `safe_quote` — can be quoted on already-public public stances
- `restricted` — don't generate new content for this person without manual review
- `parody_only` — only the parody-account variant should be used

## Endgame schema

```
## END-{CAT}-{NUM} — "Title"
- tags: [...]
- prereqs: [seed_id, ...]
- requires_stats: { stat: comparator value, ... }   e.g. { fraud_score: ">=70", cash: "<=0" }
- length_eligibility: [short, medium, long]
- artifacts_required: [final_headline, post_mortem_long_read, ...]

Body: 2-4 sentence description of what triggers this and what the closing scene looks like. Includes the "post-mortem long read" generation hint and any specific cameo requirements.
```

## Secret-finding schema

Secret findings live in `world/secret_findings.md`. They are mid-run hidden lore reveals — neither events nor endgames. They fire when multi-seed combinations or stat-corner conditions hit, produce a flash modal, award a hidden achievement, and append permanent canon to the run archive.

```
## SF-{CAT}-{NUM} — "Finding name"
- tags: [...]
- prereqs: [seed_id, ...]                 # all required
- prereqs_any: [seed_id, ...]             # OR-list
- requires_stats: { stat: comparator value, ... }
- length_eligibility: [short, medium, long]
- craziness_min: tame | normal | crazy | unhinged
- visibility: hidden                       # always hidden until triggered
- one_run_only: true | false               # default true
- unlocks_achievement: ACH-SECRET-NNN
- canon_text_short: one-sentence headline shown on the modal
- canon_text_long: 100-200 word full reveal text appended to the run archive
- effects: { stat: delta, ... }
- plants: [seed_id, ...]                  # optional
- retires: [seed_id, ...]                 # NEW: hard-removes a seed from the active list
- lock_endgame: END-XX-NNN                # optional — locks this endgame in
- unlock_endgame: END-XX-NNN              # optional — unlocks an otherwise-blocked endgame

Body: 2-4 sentences on what triggers this and the in-game effect.
```

CAT codes: CIA, DREAM, CULT, IDENT, OCCULT, AI, CONSPIRACY, TIMELINE, MEMORY, MEDICAL, FAMILY, DEAL, DEBT.

### `retires:` semantics

Distinct from `pays_off:`. `pays_off` resolves a seed and may chain into follow-ups; `retires` hard-removes it. Used when a finding makes a previously-planted seed obsolete (e.g., the IRS retreats from auditing the retreat → `retires: [retreat_irs_loaded_seed]`).

## Source schema

```
## SRC-{CAT}-{NUM} — "Source name"
- type: capital | banking | customer | press | regulator | auditor | talent | platform | conference | board
- tier: 1 | 2 | 3 | none
- typical_interactions: [...]
- spawns_events: [EVT-XX-NNN, ...]
- defamation_class: ...

Body: how this source works, what events it can spawn, who staffs it.
```

## ID conventions

- Events: `EVT-{CAT}-{NNN}` zero-padded to 3 digits
- Figures: `FIG-{CAT}-{NNN}` where CAT is FRAUD, VC, PRESS, LAW, FOUNDER, POL, CULT, CAMEO, CHORUS, BOARD, ORG
- Endgames: `END-{CAT}-{NNN}` where CAT is PRISON, FLED, GOTAWAY, FAILUP, CULT, SUCCESS, SECRET. FLED endgames may use the country code as the suffix instead of a number when the destination is canonical (e.g., `END-FLED-RU` for Russia, `END-FLED-DXB` for Dubai).
- Secret findings: `SF-{CAT}-{NNN}` per the secret-finding schema above
- Sources: `SRC-{CAT}-{NNN}`
- Foreshadow seeds: `{domain}_{descriptor}_seed` (snake_case, no prefix)
