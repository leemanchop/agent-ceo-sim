# agent-ceo-sim

Spectator simulator: submit a company description, watch an autonomous CEO agent run it inside a world simulated by an Oracle agent. Multi-format narrative output (tweets, headlines, leaked Slack threads, board memos, Glassdoor reviews) culminating in a shareable Forbes-cursed post-mortem trading card.

**Live at [30u30.fail](https://30u30.fail)** — one-screen onboarding, ~18-minute average run, ~prison.

Inspired by BitLife, Pax Historia, Universal Paperclips, Oregon Trail, The Founder, A Dark Room — but specifically for the modern tech-company doom-or-coronation arc.

## Run it

```
cd web
cp .env.local.example .env.local      # fill in NEXTAUTH_SECRET, GOOGLE_*, ADMIN_EMAILS
npm install
npm run dev
```

Lands on **http://localhost:3001** (or 3000 if free). Auth works without backend in mock mode — visitors stay signed-out gracefully if the OAuth env vars are blank. Open the run page → watch the agent stream → predict its choices → see the consequences ripple. To skip the landing entirely and jump straight to the demo run, hit `/run/demo?mode=spectate`.

Required env (see `web/.env.local.example`): `NEXTAUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAILS`. Backend pointers `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_MODE` are optional — default mode is `mock`.

### Quickstart for contributors

```
git clone <repo>
cd agent-ceo-sim/web
cp .env.local.example .env.local
# fill in NEXTAUTH_SECRET (openssl rand -base64 32), Google OAuth, etc.
npm install
npm run dev
# localhost:3001 — auth works in mock mode without a backend
```

CI runs `npm run test` (frontend Vitest) and `node scripts/validate-corpus.mjs` (corpus integrity) on every push.

## What's built

### Play mode

- **Spectate** — watch the LLM CEO agent decide. You predict its choice from chips during the deliberation/awaiting window; the outcome only reveals after you commit, then the prediction is graded. Score is tracked across the run.

(A second "Be the CEO" mode existed pre-Phase-2; it was retired when runs
moved to the pregenerated script engine, which is spectate-only. The live
turn engine that powered it remains as the `ACES_SCRIPTED=0` fallback.)

**Example (Spectate):** Tiger Global emails a $400M Series B at $4B post; term sheet expires in 6 hours; due diligence is one Zoom call. Three chips appear — *sign immediately / counter at $5B / pass*. The CEO's deliberation stream starts: *"signing's the obvious play but —"*. You predict `sign immediately`. The agent commits: `sign immediately`. ✓ correct. Stats jump (`+$400M valuation`, `+$2M burn`, `+5 fraud_score`), the Twitter chorus reacts, next event materializes.

## The cockpit at a glance

The frontend is a Bloomberg-density four-panel layout. The unit of action is sized — not every beat is a full decision moment.

- **Action-size taxonomy.** Every beat is `small`, `medium`, or `large`. Small + medium are *mini-actions* — they auto-resolve and appear as compact rows on the left timeline (a dot + a one-line outcome + an effect chip or two). Large actions are decision moments — they gate in the center stage and demand a chip pick. This is what keeps the run from being a wall of full-screen modals; the run feels alive between major decisions because mini-actions are constantly trickling in.
- **TimeFrame pills** — `short / medium / long` — annotate mini-actions on the timeline so the user can read the cadence at a glance (a `long` mini-action represents days; a `short` one is a moment).
- **Decision frame** is rendered fully in `JetBrains Mono` (terminal-log feel — distinct from the Special Elite body). Severity-`L` and `XL` events get an **AUTO-PAUSED** stamp (alarm-red, slight rotation) in the corner.
- **Choice chips** carry no market price (deliberate call) — just the label, plus per-chip dimmed agent reasoning streaming alongside during deliberation (`nah way too cucked` / `ok hear me out` / `this is the move actually`).
- **In-sim notification stack** lives top-right — Slack pings, regulator alerts, FBI-tab unlocks. Max 4 visible, autodismiss at 6s, click to expand.
- **Achievement toast stack** lives bottom-right — slides in on unlocks, click to expand, share-to-twitter from the toast.
- **Top strip** is the 8-stat Bloomberg dashboard (monospace values, ▲/▼ deltas, FBI cell turns amber at ≥50, red siren-pulse at ≥86).
- **Right rail** is a pure-black X feed with `For You / Following / Press / FBI🔒` tabs; FBI tab unlocks once awareness crosses threshold.
- **Bottom strip** carries 1×/2×/4× speed (affects EVERYTHING — char streaming, ambient cycling, feed trickle, timer ring, dashboard flash), pause, mute, and the prediction chips with timer ring.
- **Mobile** collapses to 3-tab (Agent / Feed / Timeline) under the dashboard. Mostly tested on desktop; touch polish is on the open-list.
- **Admins** see a floating API-mode toggle bottom-right of any `/admin/*` page that flips between `mock | local | prod` per session via `localStorage["aces:api_mode_override"]`. Non-admins never render it.

Phase machine: `ambient → mini_action → event_in → deliberating → awaiting → revealed → consequences → advancing → next`.

### Pre-set company templates

Eleven loaded-state companies you can jump straight into. Each has a researched Company Bible (founders, public quotes, era investors, buzzwords, comparable blowups), pre-planted seeds, and a historical-anchor endgame the run is biased toward but can diverge from.

| Template | Era | Anchor endgame | Tagline |
|---|---|---|---|
| **Delve** | YC W24, AI security | `END-FAILUP-002` | *"AI agents for SOC 2. (And some humans in Manila, allegedly.)"* |
| **Theranos** | 2003-2018, biotech | `END-PRISON-002` ("11 Years — The SBF Special") | *"One drop of blood. Hundreds of tests. Zero working machines."* |
| **FTX** | 2019-2022, crypto | `END-PRISON-001` ("25 Years Federal — The Next Case Study") | *"The most trusted name in crypto. (For about eighteen months.)"* |
| **WeWork**, **Nikola**, **Outcome Health**, **Frank**, **Headspin**, **Ozy**, **IRL**, **Cluely** | various | various | shipped from `research/30u30_research.txt` |

Pre-planted seeds give each preset its weight: Delve loads `manila_loop_seed` and `wrapper_disclosure_seed` from turn one; Theranos opens with `carreyrou_circling_seed` and `unencrypted_spreadsheet_seed`; FTX starts with `revenue_rounded_up_seed`, `cofounder_disgruntled_seed`, and a Bahamas-compound atmospheric set. All eleven Bibles live in `world/templates/`.

### The world corpus

| Layer | Count | Where |
|---|---|---|
| **Events** (the deck the Oracle pulls from each turn) | **296** across 11 categories | `world/events/` |
| **Figures** (cameo roster) | **166** | `world/figures/cast.md` |
| **Endgames** (run terminations across 7 archetypes) | **62** | `world/endgames/` |
| **Sources** (systems the agent interacts with) | **101** | `world/sources/systems.md` |
| **Secret findings** (mid-run hidden lore reveals — easter-egg modal interrupts) | **50** | `world/secret_findings.md` |
| **Templates** (researched Company Bibles for presets) | **11** | `world/templates/` |
| **Achievements** | **88** across 7 categories | `game/achievements.md` |
| **Leaderboards** | **40** | `game/leaderboards.md` |

Event categories: Fundraising, Product/Engineering, Hiring/People, Legal/Regulatory, Press/PR, Customers/Sales, Founder Behavior, Crypto/AI Adjacency, Operations/Office, Banking/Finance, FBI/Endgame Triggers.

Endgame archetypes: Prison (9), Fled Country (9), Got Away With It (9), Failed Up (11), Cultural Afterlife (9), Genuine Success (2 — the 1% wins), Cursed/Secret (13).

#### What lives where (one verbatim title per category)

A taste of voice. None of these are placeholders.

- **Fundraising** — `EVT-FR-002 "Tiger's six-hour term sheet"`, `EVT-FR-003 "Masa wants to feel the energy"`, `EVT-FR-004 "Cousin on the board"`
- **Founder Behavior** — `EVT-FB-005 "Glassdoor: microwaves fish"`, `EVT-FB-007 "Goodreads has been found"`, `EVT-FB-010 "All-In Summit, fifth billing"`
- **Banking/Finance** — `EVT-BF-010 "Mercury memo: 'cocaine (joke)'"`, `EVT-BF-012 "Unencrypted spreadsheet on the share drive"`, `EVT-BF-014 "Cold storage is a Google Doc"`
- **FBI/Endgame** — `EVT-FE-002 "6am raid, footage on Twitter"`, `EVT-FE-007 "Non-extradition decision, 14 hours"`, `EVT-FE-010 "Co-founder flipped, you read it on the docket"`

Every event tags against the controlled vocabulary in `world/tags.md`. Every record is voiced — no generic "the regulator does a thing" placeholders. Real names appear ONLY as reactions or already-public stances per `game/defamation_policy.md`.

### Game design specs (in `game/`)

- **`length_modes.md`** — short (10-15 turns / 5-8 min) / medium (25-35 / 15-25 min) / long (60-90 / 45-60 min). Each mode sets foreshadow window (3 / 8 / 25 turns), severity ramp, and atmospheric-event budget. Short isn't a different game; it's a filtered medium.
- **`personalization.md`** — six-field onboarding (`name / one-liner / industry / vibe / length / craziness`), Researcher-built Company Bible with `voice_anchors`, `[SLOT_NAME]` resolution rules. Determinism within a run: `[TIER1_VC_PARTNER]` resolved to one figure stays that figure unless an event explicitly re-rolls.
- **`chaining.md`** — foreshadow tracker, seven canonical escalation ladders, `chain_weight` math, anti-patterns. Seeds are the unit; a run with three concurrent ladders is the "doom spiral" UI tint.
- **`defamation_policy.md`** — four defamation classes, real-name reaction-only doctrine, share-card disclaimer, the Editor's hard-block rule for new accusations against named figures.
- **`betting_market.md`** — Polymarket-style $CEOBUCK spectator betting (play-money), persistent + run-specific + decision-moment markets, LMSR pricing, a prediction-head model that drives the line wobble during the 22-second decision window. *(Specced; the chip layer in production currently shows no market price — a deliberate call.)*
- **`agents.md`** — full specs for Researcher / CEO / Oracle / Editor with system-prompt sketches, voice anchors, sample turn transcripts, inter-agent contracts (CEO never sees the foreshadow tracker; Oracle never sees Editor rejections directly).
- **`stats.md`** — the 8 dashboard stats (formulas + color thresholds + voice samples below).
- **`ui_layout.md`** — Bloomberg-density four-panel desktop layout, decision-moment flow, mobile collapse, end-of-run flow, share-card spec.
- **`api_contracts.md`** — frontend ↔ backend wire format. SSE event kinds (`event.materialize`, `agent.thought_token`, `choices.appear`, `agent.commit`, `consequences.applied`, `feed.tweet`, `feed.headline`, `feed.slack_leak`, `feed.glassdoor`, `finding.unsealed`, `endgame.reached`), run lifecycle, archive endpoints, betting market.
- **`achievements.md`** — 88 achievements across RUN/STAT/END/CHAIN/META/BET/SECRET. Trigger-kind taxonomy (`stat_threshold | endgame_reached | event_chain | meta`), rarity bands (common / uncommon / rare / legendary / hidden), toast UX, end-of-run montage, share images.
- **`leaderboards.md`** — 40 boards, scoped per length-mode / per template / per craziness as appropriate. Anti-cheating + bracketing rules.
- **`run_archive.md`** — Letterboxd-for-fraud archive. Per-run permalinks, replay mode with scrub bar, diff mode (stretch), SQLite/Postgres schema, share URLs, OG embeds.

#### The seven canonical ladders (from `chaining.md`)

A *ladder* is a named chain template — a sequence of seed states that produces a recognizable arc.

1. **Wrapper-disclosure ladder** (PE → PR → LR → FE) — the "your AI is GPT-4 in a trench coat" arc. Default for any `industry: ai_*` run.
2. **Cofounder-flip ladder** (HP → LR → FE) — `cofounder_disgruntled → cofounder_lawyered_up → cofounder_flipped`. The flip is a one-way valve.
3. **Demo-fraud ladder** (PE → CS → PR → LR) — Theranos shape. Plants `hardcoded_demo_seed` early, peaks at on-stage failure.
4. **Round-tripping ladder** (FR → CS → BF → LR → FE) — financial-irregularity spine. Slow-burn; long-mode favorite.
5. **Regulator-awareness ladder** (any → LR → FE) — meta-ladder. Two `_aware_seed`s active flips the run into "joint task force" mode.
6. **Cult-of-personality ladder** (FB → PR → CULT-endgame) — the founder-becomes-the-brand arc. Can resolve into a positive-sum CULT endgame *or* feed any of the fraud ladders.
7. **Banking-collapse ladder** (BF → CS → FR → endgame) — fast ladder, compatible with short mode.

#### The 8 dashboard stats (from `stats.md`)

| # | Stat | One-line |
|---|---|---|
| 1 | **Valuation** | Paper worth; bands keyed to funding stage; FBI raid = instant -90% |
| 2 | **Revenue** (annualized) | With a quality footnote: ✅ clean / ⚠️ soft / 🔴 fictional, computed from active seeds |
| 3 | **Burn rate** | Monthly, surfaced as months of runway; cash is implicit |
| 4 | **Cash on hand** | Hover-only; surfaced as the runway suffix on the burn cell |
| 5 | **Headcount** | Color-keyed by ARR-per-head; "zero-revenue unicorn" turns red |
| 6 | **Days elapsed** | In-fiction calendar; days roll, events drive |
| 7 | **Reputation / heat** | -100 to +100; "rep" when positive, "heat" when negative — same number |
| 8 | **FBI awareness** | 0-100; the run-killer. Bands: passive → active → enforcement → operation. Red siren-pulse from 86 |

Plus a derived **`fraud_score`** (0-100) — *not* on the live dashboard. Surfaced in the post-mortem and on the share card.

## Replay mode + archive

Runs persist. Then they get watched again.

- **`/me/runs`** — Letterboxd-for-fraud grid of the current user's past runs. Filters on archetype, length, peak valuation, prison years. Each tile is a minified share card.
- **`/archive`** — public trending feed (top runs by share count, recent endgames, hidden-gem secret findings). Source-of-truth for the cultural register of the product.
- **Replay** flips on a community-percentage overlay on each chip (`72% picked this`) — a beat that's *only* available in replay; live mode shows the choices without the wisdom-of-crowds layer. The `community_pct` field on `Choice` is undefined in live mode and populated in replay.
- Scrub-bar timeline navigation, **4× default** (replays are for re-reading, not re-watching at 1×), original-user pick annotation on every decision.
- Share-card permalink at `30u30.fail/run/{run_id}` resolves to the post-mortem screen with full OG-embed metadata.

## Post-mortem trading card

The end-of-run share artifact. The Forbes-30u30 pastiche we keep promising.

- **1080×1350** Forbes-cursed share card, rendered server-side (`/run/{id}/card.png`).
- Lives at **`/run/{id}/post-mortem`** — single screen, no chrome, made for screenshots.
- Card actions: **PNG download · Twitter intent share · copy link · replay**.
- Below the card: a **600–1000 word post-mortem long-read** in Matt Levine deadpan. The Oracle does not say "this is the climax of the run." It says the facts. The facts are the punchline.
- **OG embed** wired through Next.js metadata so any `30u30.fail/run/{id}/post-mortem` link unfurls the card on Twitter, Bluesky, iMessage. Per-run `og:image`, `twitter:card=summary_large_image`.

Archetype-keyed border colors (PRISON red / FLED orange / GOTAWAY white / FAILUP gold / CULT purple / SUCCESS green / CURSED black-hatched), peak-vs-final stats, archetype ID, one-line Oracle compression, mandatory disclaimer footer per `game/defamation_policy.md`.

## Authentication

Google OAuth via Auth.js v5, JWT sessions, no DB adapter. Admin gating is a comma-separated allowlist (`ADMIN_EMAILS`) baked into the JWT at sign-in time.

- If any OAuth env var is missing, the app still renders — visitors stay signed-out and `/admin/*` redirects them away. Auth degrades gracefully rather than crashing the page.
- Allowlist evaluation runs in the JWT callback; flipping someone's admin bit requires them to sign out and back in.
- JWT-only means no server-side session revocation. A Postgres user store + database session strategy is the planned swap.
- Register two redirect URIs in Google Cloud Console → Credentials → OAuth client:
  - `http://localhost:3001/api/auth/callback/google`
  - `https://30u30.fail/api/auth/callback/google`

Full setup walkthrough (consent screen, scopes, env vars, admin verification) lives in `web/docs/AUTH.md`.

## Run persistence

Run state used to live in a Modal-container in-memory dict; cold-restarts ate everything. Now it's a write-through cache in front of a SQLite DB on a Modal Volume.

- **Volume:** `agent-ceo-sim-runs`, mounted at `/data` on the `fastapi_app` Modal function. DB at `/data/runs.db` (deployed) or `/tmp/aces-runs.db` (local `modal serve`). Override via `$RUN_DB_PATH`.
- **Tables:** `runs` (one row per run, JSON state blob + indexed columns for `user_id`, `status`, `started_at`), `run_decisions` (append-only per-turn log), `run_achievements` (idempotent, UNIQUE on `(run_id, achievement_id)`).
- **Pattern:** `register_run()` writes both cache and disk; `get_run()` reads cache first, lazily rehydrates from disk on miss; `persist_run()` flushes after every `consequences.applied`, after `bible_complete`, and at endgame.
- **Rehydration gotcha:** `RunState.decision_queue` is an `asyncio.Queue` and is loop-bound. The store strips it on save and `ensure_decision_queue()` rebinds a fresh one to the running event loop on rehydration.
- **New endpoints:** `GET /me/runs?user_id={id}&limit=50` (most recent first) and `GET /archive/trending?limit=50` (only `status=completed`, ordered by `ended_at` desc).

Schema and inspection commands in `backend/README.md` § Run persistence.

## Achievement engine

Backend parses `game/achievements.md` at startup, evaluates triggers per turn (`stat_threshold | endgame_reached | event_chain | meta`), and emits `achievement.unlocked` SSE events on first-fire. Frontend's `useAchievementQueue` consumes the stream and slides toasts into the bottom-right stack. Idempotency is enforced at the DB layer — `run_achievements` has a UNIQUE constraint on `(run_id, achievement_id)`, so re-deliveries are silently dropped.

Mock client-side triggers (FBI awareness ticks, fraud crossing 70, prediction streaks) are gated to `getApiMode() === "mock"` so they don't double-fire alongside the real backend stream in prod.

## Mock vs live data

Default mode is `mock` — safe for previews and offline dev. Mode resolution priority:

1. `localStorage["aces:api_mode_override"]` (admin floating toggle, browser-only)
2. `NEXT_PUBLIC_API_MODE` env var
3. default → `mock`

The toggle widget lives bottom-right of any `/admin/*` page, gated on `useSession().data?.user?.isAdmin`. Admins (currently `kevinvzhu@gmail.com` per `ADMIN_EMAILS`) can flip `mock | local | prod` per-session without redeploying.

| Page | Live source | Mock fallback |
|---|---|---|
| `/run/{id}` cockpit | `useRun()` SSE → Modal | `lib/mock-data.ts` |
| `/me/runs` | `GET /me/runs?user_id={email}` | `lib/mock-archive.ts` |
| `/archive` | `GET /archive/trending` | `lib/mock-archive.ts` |
| `/run/{id}/post-mortem` | `GET /run/{id}` server-side | `lib/mock-endgame.ts` (long-read still pinned to mock) |
| `/admin/usage` | `GET /usage` from Modal | `lib/admin/mock-usage.ts` |

Full inventory + fallback conditions in `web/docs/MOCK_SOURCES.md`.

## Audio

Real audio sourced for 7 of 9 slots; 3 procedural placeholders remain. Hum loop is muted by default (single mute toggle bottom strip flips `localStorage["aces:muted"]`).

Sound enums on `SimNotification.sound`: `ding | drone | stamp | cash | glass | fbi_unlock | fbi_raid | fanfare | tick`.

| Slot | Cue | Status |
|---|---|---|
| `ding` (slack-ping.mp3), `drone` (note-low.mp3), `cash` (chime-cash.mp3), `glass`, `fbi_unlock`, `fbi_raid`, hum loop, tick | regular notification + ambient cues | real audio |
| `stamp`, `fanfare`, crowd-murmur | decision committed / rare positive milestone / live-feed eruption | procedural placeholder |

Slot mapping table + replacement workflow in `web/public/sfx/README.md`.

## The agent backend (Modal)

Modal-hosted Python service. FastAPI ASGI behind a Modal `@asgi_app`. Five LLM agents, one usage tracker, one corpus loader.

**Model assignment — "Opus for the once, Sonnet for the loop"**

| Agent | Model | Cadence |
|---|---|---|
| Researcher | `claude-opus-4-7` | Once at run start (web research → Company Bible) |
| Post-mortem | `claude-opus-4-7` | Once at run end (the long-read) |
| CEO | `claude-sonnet-4-6` | Per-turn (streaming hot loop) |
| Oracle | `claude-sonnet-4-6` | Per-turn (prompt-cached corpus) |
| Editor | `claude-sonnet-4-6` | Per-turn (voice policing, can request one rewrite) |

**Cost envelope.** With prompt caching on the world corpus (the bulk of Oracle's input), a medium run (~28 turns) lands at **$1.50–$2.50**. Long runs (~60 turns) double the loop component to ~$3–5. Researcher ~$0.30, post-mortem ~$0.20, the Sonnet loop ~$1.20.

**Usage tracking.** Every Anthropic call routes through `tracked_messages_create` / `tracked_messages_stream` in `backend/usage_tracker.py`. Each call records `(ts, run_id, agent, model, input_tokens, output_tokens, cache_read, cache_write, cost_usd)` to a SQLite log at `/tmp/usage.db`. The four `anthropic-ratelimit-*` headers are captured per-model.

**Endpoints (live):**

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/run/create` | Creates a run record, returns `{run_id}` |
| `POST` | `/run/{id}/start` | SSE — Researcher → Bible → `stream.open` |
| `GET`  | `/run/{id}/stream` | SSE — turn loop (Oracle / CEO stream / Editor) |
| `POST` | `/run/{id}/decide` | `{kind: "prediction" \| "force_choice", …}` |
| `POST` | `/run/{id}/speed` | `{speed: "1x" \| "2x" \| "4x" \| "pause"}` |
| `POST` | `/run/{id}/end` | Manual termination |
| `GET`  | `/run/{id}` | Full snapshot |
| `GET`  | `/run/{id}/bible` | Bible JSON only |
| `GET`  | `/me/runs` | A user's runs (most recent first) |
| `GET`  | `/archive/trending` | Public archive feed (completed runs) |
| `GET`  | `/usage`, `/usage/{run_id}` | Cost summary, by_agent / by_model / last_24h_cost |
| `GET`  | `/rate_limits` | Last-seen Anthropic rate-limit headers per model |
| `GET`  | `/healthz` | — |

**Run persistence.** `state.py` runs a write-through cache in front of `run_store.py`, a SQLite DB on a Modal Volume (`agent-ceo-sim-runs` mounted at `/data`). Three tables — `runs`, `run_decisions`, `run_achievements`. See § Run persistence above.

**Achievement engine.** Backend parses `game/achievements.md`, evaluates `stat_threshold | endgame_reached | event_chain | meta` triggers per turn, emits `achievement.unlocked` SSE events. Idempotency at the DB layer. See § Achievement engine above.

**Per-turn SSE kinds:** `turn.start → event.materialize → agent.thought_token× → agent.thought_complete → choices.appear → agent.deliberation_token× → agent.commit → editor.decision → consequences.applied → feed.*`. Findings unseal at turns 3 / 7 / 12 as `finding.unsealed`. End-of-run emits `endgame.reached` followed by `post_mortem.delta×` and `post_mortem.complete`.

CORS is enabled for `https://30u30.fail`, `https://*.vercel.app`, and `http://localhost:3001`.

Deploy command:

```
modal deploy backend/modal_app.py
```

Full backend docs, schema, and curl smoke test in `backend/README.md`.

## Visual identity

The look is "Bloomberg-meets-typewriter" — dense, dark, deadpan.

- **Palette.** Warm-black `#15130f` paper / off-white `#f1ede4` ink / alarm-red `#ff5a47` for FBI/burn/Wells-notice stamps. Soft `#7a7363` for tertiary metadata. The X feed panel deliberately breaks register to pure-black `#000`.
- **Type.** `Special Elite` (typewriter) for body / agent stream / event copy. `JetBrains Mono` 400/500/700 for data, pills, the decision-moment frame, the dashboard. Helvetica only inside the X feed (matches X's chrome).
- **The X feed.** Pure-black panel, tabs `For You · Following · Press · FBI🔒`. Real X visual cues — gold-check for press accounts, blue-check for users, action-row glyphs.
- **No drop shadows. No gradients. No rounded corners except pills.** Density and contrast carry the hierarchy. 1.4–1.6px solid ink borders are the default panel boundary; dashed rules separate items inside a panel; "stamps" use 2px alarm border + slight rotation.

Full design spec — tokens, motion language, decision-frame anatomy, dead-air mitigation — lives in `design/README.md`.

## Notifications + sounds

- **In-sim notification stack** top-right. Max 4 visible at once, autodismiss at 6s (override per-notification `ttl_ms`). Click to expand.
- **Notification kinds** (`SimNotification.kind`): `slack_dm · slack_thread · press_tip · regulator · stat_threshold · calendar · leak · system · fbi`.
- **Severities** (`info / warn / alarm`) drive border color and whether the notification can be auto-dismissed mid-animation.
- **Sound cues** (`ding / drone / stamp / cash / glass / fbi_unlock / fbi_raid / fanfare / tick`) — muted by default, single mute toggle in the bottom strip flips `localStorage["aces:muted"]`. 7 of 9 slots use real audio; 3 procedural placeholders remain. Slot map in `web/public/sfx/README.md`.

## Sample run walkthrough (Vellum.ai, mocked demo)

What the user actually sees from clicking START.

1. **Mode toggle.** Landing page; user picks **Spectate**, picks the **Vellum.ai** demo, length `medium`, craziness `normal`. Clicks `start run`.
2. **Onboarding → research animation.** A diegetic loading state fires: *"Reading [FOUNDER]'s LinkedIn. Reading [FOUNDER]'s Twitter. Building bible."* (Mocked: ~4 seconds of bible-partial events stream in.)
3. **Run page mounts.** Dashboard slots populate (`VAL $14M · REV $0 ✅ · BURN $180k/mo · 18mo · HEAD 6 · DAY 14 · REP +12 · FBI 0`). Timeline empty. Live feed has two warm-up posts. Center stream sits at `T1 · Day 14`.
4. **First event materializes.** `EVT-FR-002 "Tiger's six-hour term sheet"` slides into the center. Severity badge `L` flashes; AUTO-PAUSED stamp appears. Body renders: *"Tiger Global emails a $400M Series B at a $4B valuation. Term sheet expires in 6 hours."*
5. **Choices appear, deliberation streams.** Three chips: `sign immediately / counter at $5B / pass`. Predictor timer ring starts at 8 seconds. The CEO's hidden reasoning streams in dim italic next to each chip. User clicks `sign immediately`.
6. **Agent commits → reveal.** Chip locks. CEO commit text bolds: `doing: sign immediately. it's free money. taking it.` Prediction `✓ correct`. Score `1/1`. **Achievement toast** slides in bottom-right: *"First Blood — predicted T1 correct"*. Notification top-right: *"@TrungTPhan quote-tweeted you"*.
7. **Live feed reactions cascade.** `@TrungTPhan: vellum just raised at 4B from tiger. economy is fixed.` `[Bloomberg ticker]: Vellum.ai banks $400M Series B at $4B valuation.` `[Casey Newton]: huh.`
8. **Mini-actions trickle.** Between major events: *"Agent signed lease on 12,000 sq ft office. Burn +$80k/mo."* — small, auto-resolved, on the timeline only.
9. **Eventually — endgame.** After ~12-14 turns, the run hits an XL `EVT-FE-*` raid event. Auto-pause. Oracle generates the post-mortem long-read. Cockpit dims; CTA replaces bottom strip: `view post-mortem`. Click → the **1080×1350 Forbes-cursed share card** at `/run/{id}/post-mortem`. PNG download / Twitter intent / copy link / replay.

## Engagement loops

- **Prediction scoring.** Every decision moment, the user predicts the agent's choice from the visible chips. Predictions are graded post-commit; the running score persists in the run header.
- **Achievements (88 across 7 categories).** A wall of small, specific, tweetable proofs. Cited favorites:
  - `ACH-RUN-004 "All Four Big 4 Auditors Quit"`
  - `ACH-RUN-011 "The Edison Special"`
  - `ACH-RUN-014 "The Unicorn Cliff"` — peak ≥$1B then `END-PRISON-*` or `END-FLED-*`
  - `ACH-RUN-034 "Zero-Revenue Unicorn"`
  - `ACH-RUN-042 "Marc Andreessen Quote-Tweet 'hm.'"`
  - `ACH-RUN-046 "Casey Newton 'huh'"`
  - `ACH-RUN-050 "Genuine Success"` — legendary rarity
- **Leaderboards (40 boards).** Each is a single weird axis. Cited favorites:
  - `LB-RUN-001 "Fastest to FBI Investigation"` (per length-mode)
  - `LB-RUN-003 "Highest Valuation Before Collapse"` — the Icarus board
  - `LB-RUN-009 "Tightest IPO-to-Indictment Gap"`
  - `LB-RUN-012 "Most Distinct Regulators Triggered"`
  - `LB-BET-006 "Longest 'Called The Run' Streak"`
- **Shareable post-mortem card.** See "Post-mortem trading card" above.

## Secret findings

A separate mid-run mechanic from endgames. While endgames close the run, a *finding* fires *during* the run as a flash-modal interrupt — the only auto-pause in the product besides XL events. Findings trigger when multi-seed combinations or stat-corner conditions hit. Each one drops a one-sentence headline, a 100-200 word canon paragraph appended permanently to the run archive, and a hidden achievement (`ACH-SECRET-*`).

50 findings live in `world/secret_findings.md` across CIA, DREAM, CULT, IDENT, OCCULT, AI, CONSPIRACY, TIMELINE, MEMORY, MEDICAL, FAMILY, DEAL, DEBT subdomains. Cited:

- `SF-CIA-001 "The Company Was a CIA Front the Whole Time"`
- `SF-CONSPIRACY-001 "All Six of Your VCs Are the Same Person Wearing Different Glasses"`
- `SF-AI-001 "You Are Actually the AI in the Simulation"`
- `SF-FAMILY-001 "The Whistleblower Is Your Mother"`
- `SF-CONSPIRACY-006 "The Product Manager You Fired in 2022 Is the SDNY Prosecutor on Your Case"`

Distinct from cursed-secret endgames (`END-SECRET-001 "Joined a Cult in Topanga"`, `END-SECRET-003 "Disappeared, Presumed Alive, Sightings in Lisbon"`) which actually terminate the run.

## Agents

| Agent | Purpose | Voice anchor |
|---|---|---|
| **Researcher** | One-shot at game start. Builds the Company Bible from web research. | factual, dossier-style |
| **CEO** | Per-turn decision-maker with sticky personality. | twitter-poisoned, lowercase, em-dash-heavy |
| **Oracle** | Per-turn world simulator. Generates events, NPC behavior, media artifacts. | deadpan Bloomberg / Matt Levine |
| **Editor** | Per-turn quality check; can request one rewrite. | terse rejection-note voice |
| **Post-mortem** | Once at end. Generates the 600–1000 word long-read. | Matt Levine deadpan, Carreyrou-cadence |

The agent split exists because voice consistency is the load-bearing thing in the product. A single LLM doing all five jobs collapses to default-helpful inside 8 turns.

## Defamation

Real names appear only as reactions or already-public stances. Never new accusations. Four classes (`world/figures/cast.md` carries one per figure, enforced by the slot resolver and the Editor agent): `safe_reaction`, `safe_quote`, `restricted`, `parody_only`.

Pantheon fraudsters (Holmes, SBF, Madoff, etc.) appear only as historical anchors in retrospectives — never as co-conspirators with the user's company. Every share-card carries the disclaimer footer per `game/defamation_policy.md`.

## Directory tree

```
agent-ceo-sim/
├── README.md
├── world/                              # the data layer (markdown corpus, no code)
│   ├── schemas.md                      # 5 record types
│   ├── tags.md                         # controlled vocabulary
│   ├── secret_findings.md              # 50 findings
│   ├── events/                         # 296 events across 11 categories
│   ├── figures/cast.md                 # 166 figures
│   ├── endgames/                       # 62 across 7 archetypes
│   ├── sources/systems.md              # 101 sources
│   └── templates/                      # 3 preset bibles (delve / theranos / ftx)
├── game/                               # game design specs (no code)
│   ├── agents.md                       # Researcher / CEO / Oracle / Editor / Post-mortem
│   ├── api_contracts.md                # SSE wire format
│   ├── achievements.md                 # 88
│   ├── betting_market.md
│   ├── chaining.md                     # foreshadow tracker, seven ladders
│   ├── defamation_policy.md
│   ├── leaderboards.md                 # 40
│   ├── length_modes.md
│   ├── personalization.md
│   ├── run_archive.md                  # Letterboxd-for-fraud
│   ├── stats.md                        # 8 dashboard stats + fraud_score
│   └── ui_layout.md                    # four-panel layout, share card
├── backend/                            # Modal + FastAPI
│   ├── modal_app.py                    # asgi_app + Volume mount + lifecycle SSE
│   ├── routes.py                       # /run/* SSE + /me/runs + /archive/trending
│   ├── state.py                        # RunState, ForeshadowTracker, write-through cache
│   ├── run_store.py                    # SQLite-on-Volume persistence layer
│   ├── corpus_loader.py                # parses /world into prompt-cacheable chunks
│   ├── usage_tracker.py                # tracked_messages_{create,stream}, /tmp/usage.db
│   ├── achievement_engine.py           # parses game/achievements.md, evaluates triggers
│   ├── agents/
│   │   ├── common.py                   # MODEL_* + DEFAMATION_PREAMBLE
│   │   └── post_mortem.py              # Opus long-read
│   └── README.md
├── design/                             # design system reference
│   ├── README.md                       # tokens, decision-frame anatomy, motion
│   ├── wireframes.html                 # browser-served wireframe canvas
│   ├── wf-app.jsx · wf-cockpit.jsx · wf-decision.jsx
│   └── design-canvas.jsx · tweaks-panel.jsx     # tooling, do not ship
├── research/
│   └── 30u30_research.txt              # 30u30 dossier — source for next 8 templates
└── web/                                # Next.js 15 + React 19 + Tailwind v4
    ├── docs/                           # AUTH.md, MOCK_SOURCES.md
    ├── public/sfx/                     # 9-slot audio (7 real, 3 procedural)
    └── src/
        ├── app/
        │   ├── page.tsx                # landing
        │   ├── admin/                  # admin layout + /admin/usage + identity banner
        │   ├── api/auth/[...nextauth]/ # Auth.js catch-all OAuth route
        │   ├── archive/page.tsx        # public trending runs
        │   ├── auth/signin/page.tsx    # brutalist sign-in screen
        │   ├── me/runs/page.tsx        # Letterboxd-for-fraud grid
        │   └── run/[id]/
        │       ├── page.tsx            # the cockpit
        │       ├── post-mortem/page.tsx# share-card + long-read + OG embed
        │       └── card.png            # OG image route
        ├── components/
        │   ├── admin/api-mode-toggle   # admin-only floating mode flipper
        │   ├── run/                    # dashboard, agent-stream, live-feed,
        │   │                           # timeline, controls, notification-stack,
        │   │                           # achievement-toast, category-color
        │   ├── post-mortem/            # post-mortem-screen, share-card
        │   ├── system/                 # session-provider, user-menu
        │   └── ui/                     # shadcn primitives
        └── lib/                        # types, api/client, auth/config,
                                        # user/local-runs, mock-* fallbacks
```

## Where to extend next

What's actually still open before public launch:

- **Compress the three remaining audio placeholders.** `stamp.wav`, `fanfare-cursed.wav`, `crowd-murmur.wav` are still procedurally synthesized. Real sources from Freesound / Pixabay land in `web/public/sfx/` under matching slot names.
- **Backend `peak_valuation_usd` + `tagline` on archive rows.** Don't exist yet; `/me/runs` and `/archive` cards synthesize them in `use-archive.ts → rowToArchiveRun()`. Drop the synthesizer once the backend grows the columns.
- **Post-mortem long-read from the snapshot endpoint.** The `endgame.reached` SSE payload already carries `post_mortem_long_read`; the snapshot doesn't persist it yet, so the post-mortem page falls back to `mock-endgame.ts` per page-load.
- **End-to-end smoke test against `modal serve`.** Confirm the SSE consumer and backend agree on every wire kind in `game/api_contracts.md`. Currently spot-checked, not exhaustive.
- **Postgres user store + DB-backed sessions.** Auth issues a JWT only; revocation isn't possible until we swap `session: { strategy: "database" }` and add `@auth/drizzle-adapter`. Fine for hackathon; needed before opening the floodgates.
- **Public archive view counts.** Not implemented — `TRENDING / ALL TIME / HIDDEN GEMS` filter client-side on whatever the backend returns. Server-side ranking is TODO.
- **Mobile polish.** Cockpit collapses to 3-tab under the dashboard but hasn't been hands-on tested across viewports.
- **Real role table.** `ADMIN_EMAILS` env-var allowlist is fine for the hackathon. A user/role table behind it later.
- **Real betting market.** `game/betting_market.md` is fully specced; persistent + run-specific markets and NPC chorus bets still ahead.
- **Embedded leaderboard widget.** The 40 boards in `game/leaderboards.md` need a Bloomberg-table component.
- **More Forbes-30u30 cursed visual assets** for the share card (avatar X-out treatments, archetype-keyed border textures, vertical / square crops).

## Deploy

Two-stack: Vercel for the frontend, Modal for the agent backend. Domain on Vercel.

**1. Frontend (Vercel).** Push to GitHub, then:

```
cd web
vercel --prod
# Vercel project settings → Root Directory: web
```

Set in Vercel → Project → Settings → Environment Variables:

| Var | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | the `*.modal.run` URL Modal prints after deploy |
| `NEXT_PUBLIC_API_MODE` | `mock` initially; flip to `prod` after the backend lands |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://30u30.fail` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
| `ADMIN_EMAILS` | comma-separated allowlist |

**2. Backend (Modal).**

```
pip install modal
modal token new
modal secret create anthropic ANTHROPIC_API_KEY=sk-ant-...
modal deploy backend/modal_app.py
# returns https://<workspace>--agent-ceo-sim-fastapi-app.modal.run
```

The `agent-ceo-sim-runs` Modal Volume is created and mounted by the app — no manual provisioning. Re-run with the printed URL plugged into Vercel's `NEXT_PUBLIC_API_URL` and flip `NEXT_PUBLIC_API_MODE=prod`.

**3. Domain.** In Vercel, add `30u30.fail` as a custom domain. Vercel auto-issues SSL via Let's Encrypt. In Google Cloud Console, add `https://30u30.fail/api/auth/callback/google` as an authorized redirect URI on the OAuth client.

## Status

Hackathon build. Frontend live at **[30u30.fail](https://30u30.fail)**. World corpus seeded with 296 events, 166 figures, 62 endgames, 101 sources, 50 secret findings, 88 achievements, 40 leaderboards, 11 templates — every record voiced and chainable. Modal backend deployed with the full SSE run-lifecycle (`/run/create` → `/start` → `/stream` → `/decide`), durable run persistence on a Modal Volume, the achievement engine, plus `/me/runs`, `/archive/trending`, `/usage*`, `/rate_limits`. Google OAuth via Auth.js v5 with admin allowlist gating. Default `NEXT_PUBLIC_API_MODE=mock` for safety; admins can flip to `prod` per-session via the `/admin/*` toggle.

Quality > quantity: every record should be specific, voiced, and chainable. Generic events ("you have a hiring problem") are dead weight.
