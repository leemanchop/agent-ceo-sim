# agent-ceo-sim — backend

Modal + FastAPI backend. Five LLM agents, one Modal app, one SQLite usage log.

## Layout

```
backend/
  modal_app.py       # Modal app + FastAPI ASGI + local entrypoints
  state.py           # RunState, ForeshadowTracker, in-memory registry
  corpus_loader.py   # Parses /world markdown into prompt-cacheable corpus
  usage_tracker.py   # Wraps every Anthropic call; writes /tmp/usage.db
  agents/
    __init__.py
    common.py        # Model assignments + DEFAMATION_PREAMBLE
    post_mortem.py   # End-of-run Bloomberg/Levine long read (Opus)
    # ceo.py, oracle.py, editor.py, researcher.py — wired via usage_tracker
```

## Cost tracking and rate limits

### Model assignment — "Opus for the once, Sonnet for the loop"

| Agent       | Model              | Cadence              | Why                                       |
| ----------- | ------------------ | -------------------- | ----------------------------------------- |
| Researcher  | `claude-opus-4-7`  | Once at run start    | Web research benefits from heavy reasoning |
| PostMortem  | `claude-opus-4-7`  | Once at run end      | One chunk; quality matters                |
| CEO         | `claude-sonnet-4-6`| Per-turn (hot loop)  | Streaming, cost-sensitive                 |
| Oracle      | `claude-sonnet-4-6`| Per-turn (hot loop)  | Prompt-cached corpus; cost-sensitive      |
| Editor      | `claude-sonnet-4-6`| Per-turn (hot loop)  | Voice consistency > marginal Haiku saving |

Editor was originally Haiku 4.5; we upgraded to Sonnet on 2026-05-02 because
voice-policing across the run reads better with Sonnet's prose feel, and
the cost delta on a short polish pass is small.

### Per-million-token rates (USD)

| Model        | Input | Output | Cache read | Cache write |
| ------------ | -----:| ------:| ----------:| -----------:|
| Opus 4.7     | $15.00| $75.00 |     $1.50  |    $18.75   |
| Sonnet 4.6   |  $3.00| $15.00 |     $0.30  |     $3.75   |
| Haiku 4.5    |  $1.00|  $5.00 |     $0.10  |     $1.25   |

### What a run costs (rough envelope, medium length, ~28 turns)

- Researcher (Opus, ~5k in / ~3k out): **~$0.30**
- Per-turn loop (Sonnet × 3 agents × 28 turns):
  - With Oracle corpus prompt-cached after turn 1, average ~$0.04/turn-set
  - **~$1.20** for the loop
- Post-mortem (Opus, ~6k in / ~1.5k out): **~$0.20**
- **Typical total: $1.50–$2.50 per medium run.**
- Long runs (60 turns) roughly double the loop component → $3–5.

These are envelopes, not promises. The `/usage` endpoint and the SQLite log
are the source of truth.

### Endpoints

All three are intentionally unauthed for the hackathon. **TODO: gate behind
admin auth before public launch** — same TODO marker is in `modal_app.py`.

- `GET /usage` — project-wide summary
  ```json
  {
    "run_id": null,
    "total_cost_usd": 12.481,
    "calls_count": 1842,
    "by_agent": { "ceo": {...}, "oracle": {...}, "editor": {...},
                  "researcher": {...}, "post_mortem": {...} },
    "by_model": { "claude-opus-4-7": {...}, "claude-sonnet-4-6": {...} },
    "last_24h_cost": 4.92,
    "current_run_cost": null
  }
  ```
- `GET /usage/{run_id}` — same shape, scoped to a run; `current_run_cost`
  is populated.
- `GET /rate_limits` — last-seen Anthropic rate-limit headers per model:
  ```json
  {
    "claude-sonnet-4-6": {
      "observed_at": "2026-05-02T18:14:22+00:00",
      "requests_remaining": "950",
      "requests_reset": "2026-05-02T18:15:00Z",
      "tokens_remaining": "199000",
      "tokens_reset": "2026-05-02T18:15:00Z"
    }
  }
  ```

CORS is enabled for `https://30u30.fail`, `https://*.vercel.app`, and
`http://localhost:3001` so the frontend admin page can hit these directly.

### Where the tracker plugs in

Every Anthropic call — across all five agents — goes through one of:

```python
from backend.usage_tracker import tracked_messages_create, tracked_messages_stream

# Non-streaming (Researcher, Editor, etc.)
msg = tracked_messages_create(
    run_id=run.run_id, agent="researcher", model=MODEL_RESEARCHER, **kwargs
)

# Streaming (CEO, Oracle, PostMortem)
with tracked_messages_stream(
    run_id=run.run_id, agent="ceo", model=MODEL_CEO, **kwargs
) as stream:
    for delta in stream.text_stream:
        ...
```

Each wrapper:
1. Reads the response (with `with_raw_response` for non-streaming so we get
   headers).
2. Records `(ts, run_id, agent, model, input_tokens, output_tokens,
   cache_read, cache_write, cost_usd)` to `/tmp/usage.db`.
3. Captures the four `anthropic-ratelimit-*` headers into a module-level
   per-model dict, surfaced via `/rate_limits`.
4. Logs 429s with run_id + model + retry-after. The Anthropic SDK's built-in
   retry stays on — we just want 429s visible in logs.

### Inspecting the SQLite log directly

The DB lives at `/tmp/usage.db`. Schema:

```sql
CREATE TABLE usage (
  id            INTEGER PRIMARY KEY,
  ts            TEXT,        -- ISO8601 UTC
  run_id        TEXT,
  agent         TEXT,        -- ceo | oracle | editor | researcher | post_mortem
  model         TEXT,
  input_tokens  INTEGER,
  output_tokens INTEGER,
  cache_read    INTEGER,
  cache_write   INTEGER,
  cost_usd      REAL
);
```

From a terminal (Modal local entrypoint, prints JSON):

```bash
modal run backend/modal_app.py::dump_usage
modal run backend/modal_app.py::dump_usage --run-id=01H...XYZ
modal run backend/modal_app.py::usage_summary --run-id=01H...XYZ
```

Or query SQLite directly:

```bash
sqlite3 /tmp/usage.db \
  "SELECT agent, model, COUNT(*), ROUND(SUM(cost_usd), 4) \
   FROM usage WHERE run_id = '01H...XYZ' GROUP BY agent, model;"
```

> **Persistence note.** `/tmp/usage.db` is a Modal-container-ephemeral path.
> For the hackathon, this is fine: each FastAPI container keeps its own log
> and the summary endpoints are good enough. Before public launch, swap
> `USAGE_DB_PATH` (env var, defaults to `/tmp/usage.db`) to a Modal volume
> mount and add a periodic S3 export. The swap point is marked
> `# TODO: persistence` in `usage_tracker.py`.

## Running locally

```bash
modal serve backend/modal_app.py
```

Sets up the FastAPI app at the printed URL with `/usage`, `/rate_limits`
live and a fresh `/tmp/usage.db` per container.

## Run-lifecycle endpoints (the SSE surface)

Mounted from `routes.py` per `game/api_contracts.md`:

| Method | Path                       | Behavior                                           |
| ------ | -------------------------- | -------------------------------------------------- |
| POST   | `/run/create`              | Creates a run record, returns `{run_id}`           |
| POST   | `/run/{id}/start`          | SSE — Researcher → Bible → `stream.open`           |
| GET    | `/run/{id}/stream`         | SSE — turn loop (Oracle / CEO stream / Editor)     |
| POST   | `/run/{id}/decide`         | `{kind: "prediction"\|"force_choice", …}`           |
| POST   | `/run/{id}/speed`          | `{speed: "1x"\|"2x"\|"4x"\|"pause"}`                  |
| POST   | `/run/{id}/end`            | Manual termination                                  |
| GET    | `/run/{id}`                | Full snapshot                                      |
| GET    | `/run/{id}/bible`          | Just the bible YAML / JSON                          |

Run state lives in a write-through cache: `_RUNS` (in-memory, in `state.py`)
in front of a SQLite DB on a Modal Volume. See **Run persistence** below.

## Run persistence

`backend/run_store.py` is a SQLite-backed persistence layer for `RunState`.
Cold-restarts (Modal scaling down) used to lose all run state; now the canonical
copy lives on a Modal Volume and the in-memory dict is just a hot-path cache.

### Where it lives

| Environment        | DB path              |
| ------------------ | -------------------- |
| Modal (deployed)   | `/data/runs.db`      |
| Local `modal serve`| `/tmp/aces-runs.db`  |
| Override           | `$RUN_DB_PATH`       |

The Modal Volume is named **`agent-ceo-sim-runs`** and is mounted at `/data`
on the `fastapi_app` function (see `modal_app.py`). `run_store.init_db()` is
called at app startup, idempotently.

### Write-through pattern

- `register_run(state)` → caches in `_RUNS` AND `run_store.save_run(state)`
- `get_run(run_id)` → checks `_RUNS`; on miss, `run_store.load_run(run_id)`
  and re-populates the cache
- `persist_run(run_id)` → flushes the cached `RunState` to disk; called after
  every `consequences.applied`, after `bible_complete`, and at endgame
- `run_store.append_decision(...)` → append-only per-turn log
- `run_store.append_achievement(run_id, achievement_id)` → idempotent insert
  (UNIQUE on (run_id, achievement_id)); returns True on first unlock
- `run_store.end_run(run_id, endgame_id)` → flips status to `completed` and
  stamps `ended_at`

Volumes auto-sync on function exit; for the 1-hour streaming function we
accept the eventually-consistent semantics — completed runs are durable, and
mid-run cold-restarts will lose at most the most recent in-memory delta.

### Schema

```sql
CREATE TABLE runs (
  run_id TEXT PRIMARY KEY,
  user_id TEXT,
  status TEXT NOT NULL,            -- in_progress | completed | abandoned
  mode TEXT NOT NULL,              -- spectate | ceo | uploaded | template
  template_id TEXT,
  company_name TEXT,
  industry TEXT,
  founder_vibe TEXT,
  length_mode TEXT,
  craziness TEXT,
  started_at TEXT NOT NULL,
  ended_at TEXT,
  turns_elapsed INTEGER DEFAULT 0,
  endgame_id TEXT,
  bible_json TEXT,
  state_blob_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_runs_user_id    ON runs(user_id);
CREATE INDEX idx_runs_status     ON runs(status);
CREATE INDEX idx_runs_started_at ON runs(started_at);

CREATE TABLE run_decisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,
  turn INTEGER NOT NULL,
  event_id TEXT,
  agent_choice_id TEXT,
  user_predicted_id TEXT,
  user_committed_id TEXT,
  artifact_tweet TEXT,
  ts TEXT NOT NULL
);
CREATE INDEX idx_decisions_run_id ON run_decisions(run_id);

CREATE TABLE run_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  run_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  unlocked_at TEXT NOT NULL,
  UNIQUE(run_id, achievement_id)
);
```

### New endpoints

- `GET /me/runs?user_id={id}&limit=50` — a user's runs (most recent first).
  `user_id` flows in via `POST /run/create` payload (top-level `user_id` or
  `settings.user_id` are both accepted).
- `GET /archive/trending?limit=50` — public archive feed; only runs with
  `status = 'completed'`, ordered by `ended_at` desc.

### Inspecting locally

```bash
sqlite3 /tmp/aces-runs.db ".schema"
sqlite3 /tmp/aces-runs.db "SELECT run_id, status, company_name, turns_elapsed FROM runs ORDER BY started_at DESC LIMIT 20;"
```

### Inspecting the deployed volume

```bash
modal volume get agent-ceo-sim-runs runs.db ./runs.db
sqlite3 ./runs.db ".tables"
```

### Nuking it for a fresh start

```bash
modal volume rm agent-ceo-sim-runs
modal volume create agent-ceo-sim-runs
# Next deploy will re-init the schema on first request.
```

### Unserializable fields

`RunState.decision_queue` is an `asyncio.Queue` (loop-bound, not JSON-able).
The store strips it on save and `ensure_decision_queue()` rebinds a fresh one
to the running event loop on rehydration. Everything else round-trips through
`dataclasses.asdict()` + `json.dumps(..., default=str)`.

### End-to-end flow

1. Frontend `POST /run/create` → returns `{run_id}`.
2. Frontend opens `POST /run/{id}/start` (SSE). Stream fires
   `researcher.searching` → `researcher.scraping` → `researcher.bible_partial` →
   `researcher.bible_complete` → `stream.open`.
3. Frontend then opens `GET /run/{id}/stream` (SSE). Per turn:
   `turn.start` → `event.materialize` → `agent.thought_token`× →
   `agent.thought_complete` → `choices.appear` → `agent.deliberation_token`× →
   `agent.commit` → `editor.decision` → `consequences.applied` →
   feed micro-events. Findings unseal at turns 3 / 7 / 12 as
   `finding.unsealed`. End-of-run emits `endgame.reached` followed by
   `post_mortem.delta`× and `post_mortem.complete`.
4. The user can `POST /run/{id}/decide` mid-turn (interactive mode forces
   a choice; spectate mode logs a prediction) and `POST /run/{id}/speed`
   any time (`pause` puts the loop into keepalive-only mode).

### Local curl smoke test

```bash
# 0) Start the server
modal serve backend/modal_app.py
# (set BASE to whatever Modal prints, or http://localhost:8000)
BASE=https://your-workspace--agent-ceo-sim-fastapi-app.modal.run

# 1) Create a run (synthetic mode for the cheapest path)
curl -s -X POST "$BASE/run/create" \
  -H 'Content-Type: application/json' \
  -d '{
    "mode": "uploaded",
    "company": {
      "name": "Vellum.ai",
      "one_liner": "autonomous procurement for SaaS spend",
      "industry": "ai_app",
      "founder_vibe": "stanford_dropout"
    },
    "settings": {"length_mode": "short", "craziness": "normal", "interactive": false}
  }'
# → {"run_id":"01H...","status":"initialized","bible_url":"..."}

RUN=01H...   # paste the run_id

# 2) Kick off the Researcher (SSE stream — bible build progress)
curl -N -X POST "$BASE/run/$RUN/start"

# 3) Open the main loop (SSE stream — turn-by-turn)
curl -N "$BASE/run/$RUN/stream"

# 4) (optional) Submit a spectator prediction or force-choice
curl -s -X POST "$BASE/run/$RUN/decide" \
  -H 'Content-Type: application/json' \
  -d '{"kind":"prediction","event_id":"EVT-FR-002","predicted_choice":"A"}'

# 5) (optional) Pause/resume
curl -s -X POST "$BASE/run/$RUN/speed" \
  -H 'Content-Type: application/json' -d '{"speed":"pause"}'
curl -s -X POST "$BASE/run/$RUN/speed" \
  -H 'Content-Type: application/json' -d '{"speed":"2x"}'

# 6) Snapshot (full state — used by /run/{id} page on refresh)
curl -s "$BASE/run/$RUN" | jq .
```

## Deployment

```bash
# 1. Install + auth Modal
pip install modal
modal token new

# 2. Provision the Anthropic secret (one-time per workspace)
modal secret create anthropic ANTHROPIC_API_KEY=sk-ant-...

# 3. Local dev (hot-reload)
modal serve backend/modal_app.py

# 4. Production deploy
modal deploy backend/modal_app.py
```

After deploy, Modal prints the ASGI URL — something like
`https://your-workspace--agent-ceo-sim-fastapi-app.modal.run`.

## Frontend hookup

The Next.js frontend at `web/` reads two env vars to pick a backend.
Configure in Vercel → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-workspace--agent-ceo-sim-fastapi-app.modal.run
NEXT_PUBLIC_API_MODE=prod
```

Modes (per `game/api_contracts.md` § Mock-mode toggle):

- `mock` — frontend uses the canned event stream from `web/src/lib/mock-stream.ts`
- `local` — frontend hits `http://localhost:8000` (e.g. for direct uvicorn dev)
- `prod` — frontend hits `NEXT_PUBLIC_API_URL` (the Modal deploy)

For `modal serve` local development, set `NEXT_PUBLIC_API_URL` to the temporary
`*.modal.run` URL Modal prints and use `prod` mode — the URL is stable per
serve session.
