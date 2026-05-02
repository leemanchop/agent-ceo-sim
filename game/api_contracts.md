# API contracts

The boundary between the frontend (`web/`) and the agent backend. The frontend should ship with a `MOCK_API=1` mode that returns canned data matching these shapes; the real backend swaps in later. This file is the source of truth for the wire format.

## Conventions

- All endpoints are `POST` unless noted; bodies and responses are JSON unless noted.
- Streaming endpoints use **Server-Sent Events** (`text/event-stream`) with the format `event: <kind>\ndata: <json>\n\n`. SSE is chosen over WebSockets because the protocol is read-mostly (events flow server → client; user actions are rare and small).
- IDs are ULIDs (`01HXY...`) — sortable + unguessable.
- Timestamps are ISO-8601 with timezone.
- Money is integer USD cents on the wire; the frontend formats for display.
- Errors return HTTP 4xx with `{ "error": { "code": "snake_case", "message": "human-readable", "details": {...} } }`.

## Run lifecycle

```
POST /run/create          → returns {run_id}
POST /run/{id}/start      → kicks off the Researcher; returns SSE stream of bible-build progress
GET  /run/{id}/stream     → SSE stream of all run events (turn-by-turn live feed)
POST /run/{id}/decide     → user submits a prediction OR (in interactive mode) a forced choice
POST /run/{id}/speed      → set 1x | 2x | 4x | pause
POST /run/{id}/end        → manual termination (rare; mostly for hackathon abandons)
GET  /run/{id}            → snapshot of full run state for the run page
GET  /run/{id}/replay     → SSE of the run replayed from t=0 at requested speed
```

## Onboarding

### `POST /run/create`

Body:

```json
{
  "mode": "uploaded" | "template" | "synthetic",
  "template_id": "delve" | "theranos" | "ftx" | null,
  "company": {
    "name": "Vellum.ai",
    "one_liner": "autonomous procurement for SaaS spend",
    "industry": "ai_app",
    "founder_vibe": "stanford_dropout"
  },
  "settings": {
    "length_mode": "medium",
    "craziness": "normal",
    "interactive": false
  }
}
```

If `mode: "synthetic"`, the backend generates the company itself; `company` may be null.
If `mode: "template"`, `template_id` is required and `company` is ignored (loaded from `world/templates/`).
If `mode: "uploaded"`, all `company` fields except `founder_vibe` are required.

Response:

```json
{
  "run_id": "01HXY7...",
  "status": "initialized",
  "bible_url": "/run/01HXY7.../bible"   // available once start completes
}
```

### `POST /run/{id}/start` (SSE)

Triggers the Researcher agent. Streams progress events:

```
event: researcher.searching
data: {"query": "Vellum.ai SaaS procurement", "step": 1, "of": 8}

event: researcher.scraping
data: {"url": "https://vellum.ai", "step": 3, "of": 8}

event: researcher.bible_partial
data: {"section": "founders", "content": {...}}

event: researcher.bible_complete
data: {"bible": {...}}

event: stream.open
data: {"first_turn_in_seconds": 2}
```

Bible JSON shape per `game/personalization.md`. The frontend uses bible-partial events to populate the upload-confirmation screen progressively (so the user sees research happening).

## Run streaming

### `GET /run/{id}/stream` (SSE)

The hero data feed. Drives the entire run page. Event kinds:

#### Per-turn events

```
event: turn.start
data: {"turn": 7, "day_elapsed": 84, "stats": {<full stats snapshot>}}

event: event.materialize
data: {
  "event_id": "EVT-FR-002",
  "category": "fundraising",
  "category_color": "#3b82f6",
  "title": "Tiger Global offers a $400M Series B",
  "body": "Tiger Global offers a $400M Series B at a $4B valuation, term sheet expires in 6 hours, due diligence is one Zoom call.",
  "severity": "L",
  "tags": ["fundraising", "term_sheet", "tiger_global"]
}

event: agent.thought_token
data: {"token": "ok ", "stream_id": "thought_12"}     // many of these per thought; concatenate

event: agent.thought_complete
data: {"stream_id": "thought_12", "full_text": "..."}

event: choices.appear
data: {
  "choices": [
    {"id": "A", "label": "Sign immediately", "tone": "unhinged"},
    {"id": "B", "label": "Counter at $5B", "tone": "midwit"},
    {"id": "C", "label": "Pass", "tone": "rare-cucked"}
  ],
  "prediction_window_seconds": 8
}

event: agent.deliberation_token
data: {"token": "ok ", "stream_id": "deliberation_12"}    // hidden reasoning streamed alongside

event: agent.commit
data: {"choice_id": "A", "justification": "...", "stream_id": "deliberation_12"}

event: consequences.applied
data: {
  "stat_deltas": {"valuation": +400_000_000_00, "fraud_score": +5, "heat": +10},
  "seeds_planted": ["valuation_inflated_seed"],
  "seeds_paid_off": [],
  "next_event_in_seconds": 4
}
```

#### Live-feed micro-events (between turns)

```
event: feed.tweet
data: {
  "handle": "@TrungTPhan",
  "display_name": "Trung Phan",
  "verified": true,
  "avatar_seed": "trung",            // frontend resolves to deterministic dicebear
  "body": "vellum just raised at 4B from tiger. economy is fixed",
  "reactions": {"likes": 12_400, "retweets": 1_900, "quotes": 220},
  "ts": "2025-..."
}

event: feed.headline
data: {
  "publication": "TechCrunch",
  "headline": "Vellum.ai banks $400M Series B at $4B valuation",
  "url_slug": "vellum-ai-series-b",
  "ts": "..."
}

event: feed.slack_leak
data: {
  "channel": "#random",
  "author": "kevin (eng)",
  "body": "did anyone else see the burn this month",
  "reactions": [":eyes: 12", ":pensive: 8"],
  "ts": "..."
}

event: feed.glassdoor
data: {
  "stars": 1,
  "title": "Mid",
  "body": "CEO microwaves fish in shared kitchen.",
  "ts": "..."
}
```

#### Mini-events (atmospheric, between major turns)

```
event: turn.mini
data: {
  "kind": "office_lease_signed" | "hire" | "fire" | "press_mention" | ...,
  "headline": "Agent signed lease on 12,000 sq ft office.",
  "stat_deltas": {"burn": +80_000_00, "cash": -240_000_00}
}
```

#### Secret findings (mid-run reveals)

```
event: finding.unsealed
data: {
  "finding_id": "SF-CIA-001",
  "headline": "FILE UNSEALED: The Company Was a CIA Front the Whole Time",
  "canon_text_short": "...",
  "canon_text_long": "...",
  "achievement_unlocked": "ACH-SECRET-007",
  "stat_deltas": {"heat": -30}
}
```

The frontend pauses for ~5s on findings (auto-pause).

#### Endgame

```
event: endgame.reached
data: {
  "endgame_id": "END-PRISON-001",
  "title": "25 Years Federal — The Case Study",
  "final_headline": "...",
  "post_mortem_long_read": "<markdown>",
  "share_card_url": "/run/{id}/card.png",
  "achievements_summary": [...]
}
```

The frontend transitions to the post-mortem view.

## User actions

### `POST /run/{id}/decide`

Body during prediction window (spectator mode):

```json
{
  "kind": "prediction",
  "event_id": "EVT-FR-002",
  "predicted_choice": "A"
}
```

Body when user is the CEO (interactive mode):

```json
{
  "kind": "force_choice",
  "event_id": "EVT-FR-002",
  "choice_id": "B"
}
```

In interactive mode, `force_choice` overrides what the CEO agent would have picked. The CEO agent's "deliberation" stream still plays (showing what it would have chosen) — the user is just final arbiter.

### `POST /run/{id}/speed`

```json
{ "speed": "1x" | "2x" | "4x" | "pause" }
```

Affects the rate at which the backend emits `turn.*` events. Live-feed events continue at their own pace.

## Snapshot & replay

### `GET /run/{id}`

Returns the full run state — used by the run page on initial load and on refresh.

```json
{
  "run_id": "...",
  "status": "in_progress" | "completed" | "abandoned",
  "company": {...},                 // bible
  "settings": {...},
  "stats": {...},                   // current
  "stat_history": [{turn, stats}, ...],
  "events_resolved": [...],
  "feed_recent": [...],             // last 100 feed entries
  "achievements_unlocked": [...],
  "findings_unsealed": [...],
  "predictions": {"correct": 7, "total": 12},
  "ceobuck_balance": 1242.50
}
```

### `GET /run/{id}/replay` (SSE)

Replays the run from the beginning at the requested speed. Same event kinds as `/stream`, just historical.

Query params: `?speed=4x&from_turn=0&to_turn=null`.

## Archive

```
GET  /me/runs?limit=50&cursor=...    → list of run summary cards (Letterboxd-style)
GET  /archive/trending                → public archive top runs
GET  /run/{id}/card.png              → the trading-card share image
GET  /leaderboards/{lb_id}           → top N for a leaderboard
```

Run summary card:

```json
{
  "run_id": "...",
  "company_name": "Vellum.ai",
  "endgame_id": "END-PRISON-001",
  "endgame_title": "25 Years Federal",
  "peak_valuation_usd_cents": 4_000_000_000_00,
  "turns_elapsed": 27,
  "started_at": "...",
  "ended_at": "...",
  "shareable_card_url": "/run/.../card.png",
  "tagline": "Took the Tiger term sheet at hour 4.",
  "achievements_count": 9
}
```

## Betting market

```
POST /run/{id}/bet                    → place a bet on a market
GET  /run/{id}/markets                 → SSE of market price updates
GET  /me/portfolio                    → $CEOBUCK balance + open positions
```

Bet body:

```json
{
  "market_id": "MKT-PER_RUN-FBI_RAID",
  "side": "yes" | "no",
  "amount_ceobuck": 100,
  "price_floor": 0.42                // optional — refuse if price moves past this
}
```

See `game/betting_market.md` for market types.

## Auth

Hackathon scope: anonymous accounts via cookie. No login flow. `POST /me/identify` exchanges a display name + avatar for a stable account_id. Real auth (OAuth) post-hackathon.

## Mock-mode toggle

Frontend reads `NEXT_PUBLIC_API_MODE` env var:

- `mock` — all endpoints return canned data from `web/src/lib/mock-data.ts`
- `local` — calls `http://localhost:8000`
- `prod` — calls `process.env.API_URL`

For the hackathon demo, `mock` is the default. The full event stream for the demo is hardcoded in `web/src/lib/mock-stream.ts` as a JSON array; the SSE simulator just iterates with timeouts that respect the speed control.

## Versioning

Wire format version goes in every SSE handshake event:

```
event: stream.open
data: {"version": "1.0.0", "first_turn_in_seconds": 2}
```

Bump major when breaking; the frontend rejects mismatched majors with a "please refresh" toast.
