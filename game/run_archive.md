# Run archive — the personal/global archive of past runs

The run is a story. Once it ends, the share card is the artifact, the leaderboard is the score, and the **archive is the library**. This is the surface that makes the product loopable: people watch their friends' runs, scroll through their own history, replay the moments where the agent broke their own predictions, and start new runs from there.

Aesthetic reference: Letterboxd, but for fraud. A clean, dense, browsable wall of past runs, each one a permalink-able artifact with a trading-card cover, a long-read post-mortem, and a watchable timeline. The chrome is restrained; the content is the product, same as everywhere in the app.

The archive does three jobs:

1. **Stores** every completed run permanently in a structured form that can be queried (for leaderboards), replayed (for browsing), and embedded (for sharing).
2. **Surfaces** runs back to the user — both their own ("My Runs") and the most-watched globally ("Public Archive").
3. **Replays** any past run on demand at any speed, with the original event sequence and decision moments preserved.

---

## Run record schema

```
## RUN-{ID}
- run_id: UUID
- account_id: UUID  (FK accounts.id; nullable for anon runs)
- handle: string                # display handle at time of run
- privacy: public | unlisted | private
- company_name: string
- company_template: delve | theranos | ftx | uploaded | synthetic
- template_version: string      # for preset templates; semver-style
- industry: string              # e.g. "ai_app", "biotech", "fintech"
- length_mode: short | medium | long
- craziness: tame | normal | crazy | unhinged
- started_at: ISO 8601
- ended_at: ISO 8601
- turns_elapsed: int
- endgame_id: END-XX-NNN
- endgame_archetype: PRISON | FLED | GOTAWAY | FAILUP | CULT | SUCCESS | SECRET
- final_stats: {
    valuation, revenue, burn_rate, cash_on_hand, headcount,
    days_elapsed, reputation, fbi_awareness, fraud_score
  }
- peak_stats: {
    peak_valuation, peak_revenue, peak_headcount, peak_reputation,
    peak_fbi_awareness, peak_fraud_score, min_cash_on_hand
  }
- decisions: [
    { turn: int, event_id: string, choice_taken: string,
      agent_reasoning_id: UUID, market_lines_at_close: object }
  ]
- artifacts: [
    { artifact_id: UUID, kind: tweet | slack | headline | board_email | post_mortem,
      turn: int, body_ref: string }
  ]
- achievements_unlocked: [ ACH-XX-NNN, ... ]
- predictions_correct: int
- predictions_total: int
- ceobuck_net: float
- replay_blob_url: string       # pointer to full event timeline blob
- shareable_card_url: string    # pre-rendered post-mortem trading card image
- one_line_summary: string      # the Oracle's three-act compression
- pull_quote: string            # selected by the Oracle from artifacts
- audit_flags: { idle_bot: bool, manual_pause_minutes: int, ... }
- view_count: int                # public-only
- created_at, updated_at
```

### Field notes

- **`replay_blob_url`** points to a JSON blob containing the complete turn-by-turn timeline: every event, every artifact, every CEO-reasoning trace, every market line, every stat snapshot. This is what `Replay mode` reads. Stored on object storage (S3-shaped) with a long-cached signed URL on the run record.
- **`decisions[*].agent_reasoning_id`** points into a separate table because reasoning traces are large and not needed for thumbnail rendering. Hydrated only when the user opens the replay.
- **`artifacts[*].body_ref`** references either an inline-stored body (for short ones — tweets, Slack lines) or an object-storage URL (for the long-reads). Editor's choice; either way it's normalized.
- **`peak_stats`** are precomputed at run-end so leaderboards don't have to scan the full timeline.
- **`one_line_summary`** is the Oracle-generated three-act compression that appears on the share card and on every archive surface ("Shipped a wrapper, denied the wrapper, indicted for the wrapper.")
- **`pull_quote`** is also Oracle-selected, the most quotable single line from the run's artifact stream. Surfaces in the archive list view as the row's secondary text.
- **`privacy: unlisted`** means it's accessible by direct link but not surfaced on the public archive or the user's public profile. `private` means the link 404s for anyone but the owner.

---

## Archive UX

### My Runs page — Letterboxd-for-fraud

Routed at `/me/runs`. The default authenticated landing surface after a run ends.

Visual: a grid of run cards. Each card is the post-mortem trading card from `ui_layout.md`, rendered at thumbnail size (240×320 portrait orientation, with the share-card composition cropped vertically). Hover to play a 3-second silent loop of the run's most active turn (the same loop used in the homepage hero, generated per run).

```
┌──────────────────────────────────────────────────────────────────────┐
│   MY RUNS · 47 completed                              [GRID] [LIST]  │
│                                                                      │
│   FILTERS:  ENDGAME ▼   LENGTH ▼   CRAZINESS ▼   DATE ▼   SORT ▼     │
│                                                                      │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                  │
│   │       │ │       │ │       │ │       │ │       │                  │
│   │ THER. │ │ AICO  │ │ BIO_X │ │ DELVE │ │ FTXJR │                  │
│   │       │ │       │ │       │ │       │ │       │                  │
│   │ END-  │ │ END-  │ │ END-  │ │ END-  │ │ END-  │                  │
│   │ PR-001│ │ FLED- │ │ SUCC- │ │ FAIL- │ │ PR-002│                  │
│   │       │ │ 003   │ │ 001   │ │ 001   │ │       │                  │
│   │ 25y   │ │ DXB   │ │ ✓     │ │ VP    │ │ 11y   │                  │
│   └───────┘ └───────┘ └───────┘ └───────┘ └───────┘                  │
│   Mar 14    Mar 12    Mar 10    Mar 8     Mar 7                      │
│                                                                      │
│   ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐                  │
│   │  ...  │ │  ...  │ │  ...  │ │  ...  │ │  ...  │                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

#### Filters

- **Endgame archetype** — multi-select across the 7 archetypes
- **Length mode** — short / medium / long
- **Craziness** — tame / normal / crazy / unhinged
- **Date** — range picker
- **Template** — delve / theranos / ftx / uploaded / synthetic
- **Has achievement** — show only runs that unlocked specific achievements (chip multi-select)
- **Has cameo** — show only runs that referenced specific real-named figures

#### Sort options

- Most recent (default)
- Highest peak valuation
- Highest fraud_score
- Longest survival
- Most achievements unlocked
- Most viewed (for runs with privacy: public)

#### List view

Toggle from grid to a Bloomberg-table list:

```
DATE     COMPANY              TEMPLATE    LENGTH   ENDGAME           METRIC      ACH
─────────────────────────────────────────────────────────────────────────────────────
Mar 14   THERANOS RESEARCH    theranos    medium   END-PRISON-001    25y         9
Mar 12   AICO LABS            uploaded    medium   END-FLED-003      DXB         5
Mar 10   BIO X HEALTH         theranos    long     END-SUCCESS-001   ✓           12
Mar 8    DELVE.AI             delve       short    END-FAILUP-001    VP          3
Mar 7    FTX JUNIOR           ftx         medium   END-PRISON-002    11y         7
```

Click any row to open the run's permalink page.

#### Empty state

For an account with zero completed runs:

```
   no runs yet.
   start one →  [ start run ]
```

That's the entire empty state. No imagery, no onboarding modal.

### Public archive

Routed at `/archive`. Opt-in surface — only runs with `privacy: public` appear here. The aesthetic is the same Letterboxd-for-fraud grid, but with three explicit feeds:

```
┌──────────────────────────────────────────────────────────────────────┐
│   PUBLIC ARCHIVE                                                     │
│                                                                      │
│   [TRENDING THIS WEEK] [MOST VIEWED ALL TIME] [HIDDEN GEMS]          │
│                                                                      │
│   FILTERS: same as My Runs                                           │
│                                                                      │
│   ┌───────┐ ┌───────┐ ┌───────┐ ...                                  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

- **Trending this week** — sorted by view count over rolling 7d, weighted by recency. Resets each Monday.
- **Most viewed all time** — sorted by total view count. Curated by the algorithm; obvious skew toward older runs that have had time to accumulate views.
- **Hidden gems** — a rotating selection of runs with low view counts but high "interesting" signal. The interesting-signal heuristic combines unusual endgame frequency, achievement unlocks (especially hidden), and "everyone shows up" cameo density. Editor-can-pin slot exists.

A run can be reported (defamation policy violation, harassment in company name, etc.). Reports queue for a moderator pass; the run flips to `unlisted` while pending.

Each public run also shows social telemetry on its row: view count, "shared to X" count (UTM-tracked), and a small comment count if comments are enabled (off by default; see Comments below).

### Run permalink page

Routed at `/run/{run_id}` (and the slug variant `/r/{slug}` from the share card).

Layout:

```
┌──────────────────────────────────────────────────────────────────────┐
│  ← back · /run/8c4f2a                                                │
│                                                                      │
│  ┌──────────────┐  THERANOS RESEARCH                                 │
│  │              │  uploaded · medium · normal · 14 turns             │
│  │ [trading     │  ended Mar 14 · 142 views                          │
│  │  card        │                                                    │
│  │  rendered]   │  END-PRISON-001 · "25 Years Federal"               │
│  │              │  fraud_score 87 · peak val $312M                   │
│  └──────────────┘                                                    │
│                                                                      │
│  "Shipped a wrapper, denied the wrapper, indicted for the wrapper."  │
│                                                                      │
│  [▶ replay]  [↗ share]  [↻ challenge this run]                       │
│                                                                      │
│  ──────────────────────────────────────────────────────────          │
│  POST-MORTEM LONG-READ                                               │
│                                                                      │
│  [the full Carreyrou-style postscript renders here, 65ch wide,       │
│   single column, scrollable]                                         │
│                                                                      │
│  ──────────────────────────────────────────────────────────          │
│  TIMELINE                                                            │
│  [the run's left-panel spine, but horizontal here, scrollable, with  │
│   every turn clickable to open the full center-stream transcript     │
│   for that turn]                                                     │
│                                                                      │
│  ──────────────────────────────────────────────────────────          │
│  ACHIEVEMENTS UNLOCKED THIS RUN — 9                                  │
│  [grid of achievement badges with rarity stamps]                     │
│                                                                      │
│  ──────────────────────────────────────────────────────────          │
│  KEY ARTIFACTS                                                       │
│  [pull quotes: 3-5 standout artifacts from the run rendered in       │
│   their pastiche register — one tweet, one Slack leak, one headline] │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

The page is a single scroll. The trading-card thumbnail is the hero; everything else flows down.

#### "Challenge this run" CTA

A button that starts a new run with the same template, length, and craziness. The new run, when it ends, gets a small comparison strip on its archive page: "you ran this against [original run] — your endgame: X, theirs: Y, your turns: N, theirs: M."

This is the cheapest hook for replays-from-shares. A friend posts their share card, you click through to the permalink, you click "challenge this run," you have your own thing in 8 minutes.

### Replay mode

Routed at `/run/{run_id}/replay` (or `/r/{slug}/replay`).

Renders the same UI as a live run but in playback. Top-corner badge: `REPLAY · 4x`. All controls present:

- Speed: 1x / 2x / 4x / instant (instant = jumps to endgame state, useful for "show me how it ends" without spoilers being possible because the replay is by definition of an ended run)
- Scrub bar: drag to any turn; the dashboard, timeline, and live feed reconstruct to that turn's state
- Auto-pause: same XL-event auto-pauses fire as in the original run, so the cinematic beats are preserved
- Decision-moment markets: shown as **resolved** — the bar shows the final line and the agent's commit, no live betting (per `betting_market.md`'s "no live betting on a replay" rule)

The replay always starts at turn 0 unless deep-linked to a specific turn (`/run/{id}/replay?t=14`). Deep-linking individual turns is the share primitive for "look at the moment everything went wrong."

### Diff mode (stretch)

Routed at `/diff/{run_id_a}/{run_id_b}`. Stretch goal for hackathon-plus.

Constraints:
- Both runs must be on the same `company_template`
- Both runs must be on the same `length_mode`
- Both must be the same `craziness`
- Both must belong to the user (you can't diff someone else's runs without their permission, mainly because diff exposes seed-state which is post-game-only info)

Layout: a side-by-side timeline. Each turn renders both runs in parallel; turns where the runs diverged (different events, different choices, different stat deltas) get a vertical highlight strip. A "divergence summary" sidebar lists the turn-by-turn deltas.

The intended use is the "what if I had not given Walgreens that pilot" page: pick two of your Theranos runs that differed on a single decision-moment commit and see how the chain unfolded differently.

Because diff mode is comparison-heavy and large-state, it's not a default-on feature. It loads on-demand from the replay blobs.

### Comments (off by default)

Per-run optional comment thread, off by default at the account level. Enabling it on your profile turns it on for all your public runs.

Threaded, light moderation. Mostly intended for friends quote-replying with their own takes. The Greek chorus parody accounts (`@startup_dunk` etc.) post in-character if the run hits a certain heat threshold.

### Sharing

Per-run sharing surface:

- **Public URL** at `/run/{run_id}`. Slug variant `/r/{8-char-slug}` for short shares.
- **Embed:** `/run/{run_id}/embed` returns OG image (the trading card) and Twitter card metadata so paste-on-Twitter renders the card automatically. Bluesky honors the same metadata.
- **iframe embed:** `/run/{run_id}/iframe` returns a small embed showing the trading card as a clickable thumbnail; intended for blog posts and Substacks.
- **"Send to a friend"** CTA appears at the end of every run, directly below the share-card overlay. It pre-fills a share text:
  - `"watched my fake startup get [endgame.title]. [share_card_url]"`
  - The user can edit before posting; the share-text is a starting point.
- **Direct DM share** (if the user is on iOS/Android with native sharesheet): native share-sheet integration sends the URL with the trading card preview.
- **Permalink-to-turn** sharing: from any turn in replay mode, a "share this moment" button copies a `/run/{id}/replay?t=N` link.

The share card includes the disclaimer footer per `defamation_policy.md`. The disclaimer follows the share image regardless of where it's posted.

---

## Storage — minimal data model

For the hackathon: **SQLite**. Single file, server-local, zero ops. If the product gets traction, swap to **Postgres** with the same schema; nothing in this design relies on SQLite specifically.

### Tables

```
accounts
  id                UUID PRIMARY KEY
  handle            TEXT UNIQUE
  email             TEXT UNIQUE
  created_at        TIMESTAMP
  ceobuck_balance   REAL DEFAULT 10000
  privacy_default   TEXT DEFAULT 'unlisted'  -- public | unlisted | private
  comments_enabled  BOOLEAN DEFAULT false
  flagged_idle_bot  BOOLEAN DEFAULT false
  -- personal-best columns (denormalized; updated on run validation):
  pb_turns_to_raid          INTEGER
  pb_peak_valuation_collapse REAL
  pb_turns_elapsed          INTEGER
  pb_sentence_length_years  INTEGER
  pb_peak_valuation         REAL
  pb_min_cash               REAL
  pb_fraud_score            REAL
  pb_single_market_win      REAL
  pb_decision_streak_in_run INTEGER

runs
  id                UUID PRIMARY KEY
  account_id        UUID NULL REFERENCES accounts(id)
  handle_at_run     TEXT          -- snapshot at time of run
  privacy           TEXT
  company_name      TEXT
  company_template  TEXT
  template_version  TEXT
  industry          TEXT
  length_mode       TEXT
  craziness         TEXT
  started_at        TIMESTAMP
  ended_at          TIMESTAMP
  turns_elapsed     INTEGER
  endgame_id        TEXT
  endgame_archetype TEXT
  -- stats blob (JSON column, denormalized for fast leaderboard queries):
  final_stats_json  TEXT
  peak_stats_json   TEXT
  ceobuck_net       REAL
  predictions_total INTEGER
  predictions_correct INTEGER
  one_line_summary  TEXT
  pull_quote        TEXT
  replay_blob_url   TEXT
  shareable_card_url TEXT
  view_count        INTEGER DEFAULT 0
  audit_flags_json  TEXT
  created_at        TIMESTAMP
  updated_at        TIMESTAMP

decisions
  id                UUID PRIMARY KEY
  run_id            UUID REFERENCES runs(id) ON DELETE CASCADE
  turn              INTEGER
  event_id          TEXT
  choice_taken      TEXT
  agent_reasoning_id UUID NULL     -- references reasoning blob; lazy-loaded
  market_lines_json TEXT
  created_at        TIMESTAMP

artifacts
  id                UUID PRIMARY KEY
  run_id            UUID REFERENCES runs(id) ON DELETE CASCADE
  turn              INTEGER
  kind              TEXT          -- tweet | slack | headline | board_email | post_mortem | share_card
  body              TEXT NULL     -- inline body for short artifacts
  body_ref          TEXT NULL     -- object-storage URL for long ones
  created_at        TIMESTAMP

achievements_unlocked
  id                UUID PRIMARY KEY
  account_id        UUID REFERENCES accounts(id)
  run_id            UUID NULL REFERENCES runs(id)  -- NULL for meta-achievements
  achievement_id    TEXT          -- e.g. ACH-RUN-002
  unlocked_at       TIMESTAMP
  UNIQUE (account_id, achievement_id) WHERE repeatable = false  -- enforced in app code

bets
  id                UUID PRIMARY KEY
  account_id        UUID REFERENCES accounts(id)
  run_id            UUID REFERENCES runs(id)
  market_id         TEXT
  market_kind       TEXT          -- decision_moment | persistent | run_specific | meta
  side              TEXT
  stake             REAL
  entry_price       REAL          -- in cents (0..100)
  resolution        TEXT NULL     -- win | loss | refund | pending
  payout            REAL NULL
  placed_at         TIMESTAMP
  resolved_at       TIMESTAMP NULL

reports
  id                UUID PRIMARY KEY
  run_id            UUID REFERENCES runs(id)
  reporter_account_id UUID NULL
  reason            TEXT
  status            TEXT          -- pending | dismissed | actioned
  created_at        TIMESTAMP
```

### Indexes (the leaderboard-and-archive query plan)

```
CREATE INDEX idx_runs_account_id ON runs(account_id);
CREATE INDEX idx_runs_endgame_id ON runs(endgame_id);
CREATE INDEX idx_runs_archetype  ON runs(endgame_archetype);
CREATE INDEX idx_runs_template   ON runs(company_template);
CREATE INDEX idx_runs_length     ON runs(length_mode);
CREATE INDEX idx_runs_ended_at   ON runs(ended_at DESC);
CREATE INDEX idx_runs_privacy    ON runs(privacy) WHERE privacy = 'public';
CREATE INDEX idx_runs_view_count ON runs(view_count DESC) WHERE privacy = 'public';

CREATE INDEX idx_decisions_run    ON decisions(run_id, turn);
CREATE INDEX idx_artifacts_run    ON artifacts(run_id, turn);
CREATE INDEX idx_ach_account      ON achievements_unlocked(account_id, achievement_id);
CREATE INDEX idx_ach_run          ON achievements_unlocked(run_id);

CREATE INDEX idx_bets_account     ON bets(account_id, placed_at DESC);
CREATE INDEX idx_bets_run         ON bets(run_id);
```

The leaderboard surfaces are mostly sort-and-limit queries against `runs` plus a join into `accounts` for the handle. The archive surfaces are filter-and-paginate queries against `runs` keyed by `account_id` (My Runs) or `privacy = 'public'` (Public Archive).

### Storage outside the relational store

- **Replay blobs** (`runs.replay_blob_url`): JSON blobs stored on S3-shaped object storage. Contents: full turn-by-turn timeline including events, artifacts, reasoning traces, market state. Typical size: 50-500KB per run depending on length mode. Long-mode runs cap around 2MB.
- **Reasoning traces** (`decisions.agent_reasoning_id`): same object store, separate blob per decision; lazy-loaded only when replay is opened. Typical size: 2-20KB per decision.
- **Share card images** (`runs.shareable_card_url`): pre-rendered PNGs (1200×630 OG + 1200×1200 square + 1080×1920 vertical) generated at endgame and cached. Static assets, CDN-served.
- **Artifact long-forms** (`artifacts.body_ref`): post-mortem long-reads, vanity_fair_profile bodies, opening_number_lyrics — anything over ~2KB lives on object storage rather than inline in the row.

### Migrations and growth

For SQLite: WAL mode on, sane page size, vacuum on a cron. Single-writer is fine because runs write at endgame (low write rate; ~1 write/sec at peak) and reads are dominated by leaderboard queries (which are well-indexed) and archive paginates.

For Postgres swap: identical schema except UUID type, JSON → JSONB, and the personal-best denormalization on `accounts` becomes a materialized view refreshed on run-end for sharper read latency. Add full-text search on `runs.company_name` + `runs.one_line_summary` + `runs.pull_quote` for an archive search bar.

Don't shard early. The product can run on a single Postgres node well past any traction milestone we'd consider real.

---

## Privacy and retention

- **Default privacy** is `unlisted`. Public archive participation is opt-in per-account and per-run.
- **Account deletion** cascades: deleting an account deletes its runs (per row) and its bets (per row). Achievements records are anonymized rather than deleted (the `account_id` becomes NULL) so leaderboard-history snapshots aren't corrupted by retroactive deletions.
- **Anonymous runs** (no account_id) are public-by-default but accessible only by direct slug. They expire after 30 days unless an account claims them within that window.
- **Reported runs** flip to `unlisted` while a moderation pass runs; if actioned (defamation policy violation, harassment), the run is hard-deleted and the account is flagged.
- **GDPR/CCPA**: the `accounts` table holds the deletion request; cascading deletes per above. Replay blobs and share cards in object storage get a TTL marker on account deletion and are GC'd within 7 days.

---

## API surface (sketch)

The archive needs a small set of HTTP endpoints. Naming convention is REST-ish.

```
GET  /api/runs/{run_id}                   → run record (respects privacy)
GET  /api/runs/{run_id}/replay_blob       → full timeline JSON (signed URL, short-cached)
GET  /api/runs/{run_id}/reasoning/{id}    → individual reasoning trace blob
GET  /api/runs/{run_id}/artifacts/{id}    → individual artifact body

GET  /api/me/runs                         → My Runs paginated list, with filters as query params
GET  /api/archive                         → Public Archive feed (trending|all_time|hidden_gems)

GET  /api/leaderboards/{lb_id}            → leaderboard rows, paginated, scope as query params
GET  /api/leaderboards/{lb_id}/personal   → user's personal rank stripe (user above + below)

POST /api/runs/{run_id}/share             → records a share event (UTM-tracked); returns short slug
POST /api/runs/{run_id}/report            → submits a moderation report
PUT  /api/runs/{run_id}/privacy           → owner-only; changes privacy

POST /api/runs                            → creates a new run (start-run flow)
                                            body: { company_name, one_liner, industry,
                                                    length_mode, craziness, [template] }
WS   /api/runs/{run_id}/stream            → live websocket of run events (during play)
```

The `WS` stream multiplexes everything the UI needs for the live view: dashboard updates, agent stream chunks (event cards, reasoning, commits, artifacts), live feed posts, market line wobbles, achievement-unlock toasts. Replay mode reads the same shape from the replay blob, paced by client.

---

## Designer guidance

When extending the archive:

1. **The run is the unit.** Don't add features that cross-cut runs in ways that need their own surface (a "best moments compilation" video, a "your year in fraud" wrapped-style annual recap). The run is the artifact; the archive is a wall of artifacts. Adding meta-narrative on top of the artifacts is gold-plating.
2. **Permalinks must be stable.** A `/run/{id}` URL posted to Twitter today must resolve correctly in three years. Schema migrations have to preserve the run record. Don't delete runs except via account-deletion cascades.
3. **Shareability over discoverability.** People will find runs through shares, not through search. The archive's job is to make a shared link land somewhere good. The Public Archive feeds are aesthetic, not essential.
4. **Privacy defaults to unlisted.** Every share is a deliberate act. People can write things in their company name they don't want indexed. The owner controls the privacy, full stop.
5. **The replay blob is sacred.** Once a run ends, the replay blob is the complete fossil record. Don't recompute, don't re-render, don't re-rank. If the corpus changes upstream (new events added, balance tweaks), historical runs play back with the corpus snapshot they ran on.

## IDs referenced that don't exist yet

- The `body_ref` object-storage shape and the signed-URL service: not specified; needs a small object-storage abstraction.
- The "interesting-signal heuristic" for `Hidden gems` is handwaved; needs a real ranking pass when the public archive ships.
- The `template_version` field on runs and per-template integrity bracketing (referenced from `leaderboards.md`): the version-string scheme isn't specified.
- The diff-mode UI components and the seed-state-exposed-only-in-diff invariant are sketched but not designed.
- The comments table is implied by the comments feature but omitted from the schema above; if comments ship in v1, add `comments` and `comment_reports` tables.
- The UTM-tracking on `POST /api/runs/{run_id}/share` is described but the analytics pipeline isn't (Plausible vs PostHog vs other — TBD).
- The "shared to X count" telemetry on public-archive rows depends on the share endpoint's UTM accounting; same TBD.
