# Mock data sources

This document inventories every mock data source still in the webapp, what
it drives, and the conditions under which it falls back vs. yields to the
live Modal backend. The frontend resolves API mode via
`getApiMode()` (lib/api/client.ts) with the priority:

1. localStorage admin override (`aces:api_mode_override`, browser-only)
2. `NEXT_PUBLIC_API_MODE` env var
3. default → `mock`

The admin toggle (components/admin/api-mode-toggle.tsx) writes the override.
It is gated on `useSession().data?.user?.isAdmin` and only renders inside
the `/admin/*` layout — non-admins never see it.

| File | Drives | Falls back when |
|---|---|---|
| `src/lib/mock-data.ts` | run page (cockpit) — bible, stats, events, feed, mini-actions, timeline | mock mode; `useRun` consults `getApiMode()` and uses this when mode is `mock` |
| `src/lib/mock-archive.ts` | `/me/runs` (MY_ARCHIVE) and `/archive` (PUBLIC_ARCHIVE); also seeds RunCard replays | mock mode; OR live mode when the backend fetch fails (use-archive.ts surfaces `error` + `isMock=true`) |
| `src/lib/mock-endgame.ts` | `/run/{id}/post-mortem` chrome + long-read prose | mock mode; OR live mode when `/run/{id}` returns non-200 / `status !== "completed"`. Note: `post_mortem_long_read` and `tagline` are PINNED to mock until the backend snapshot starts emitting them — the company name + endgame_id update from live data |
| `src/lib/mock-achievements.ts` | initial seed for the achievement-toast queue + `mock-archive` decoration | always present; the run-page achievement triggers (FBI unlock, fraud crossing, etc.) are now gated on `getApiMode() === "mock"` so they don't double-fire when the backend emits real `achievement.unlocked` SSE events |
| `src/lib/admin/mock-usage.ts` | `/admin/usage` — usage summary, per-run breakdown, rate-limit headers | mock mode; OR live mode when `NEXT_PUBLIC_API_URL` is unset; OR fetch error |

## Live wiring

These pages are now mode-aware:

- `/me/runs` → `useUserRuns()` hits `GET /me/runs?user_id={email}` when
  mode ∈ {local, prod} AND the user is signed in. Signed-out users in live
  mode see an empty state with the existing sign-in CTA. Brand-new run ids
  cached in `localStorage` (lib/user/local-runs.ts) are merged in front of
  the backend response so they show up before the persistence write
  propagates.
- `/archive` → `usePublicArchive()` hits `GET /archive/trending?limit=50`.
- `/admin/usage` → already lived on live data; now also respects the
  localStorage override and refetches on `aces:api_mode_change`.
- `/run/{id}` cockpit → `useRun()` was already mode-aware; it now also
  silences the four atmospheric notification triggers in live mode.
- `/run/{id}/post-mortem` → fetches `GET /run/{id}` server-side when the
  env var is `local|prod`; otherwise renders MOCK_ENDGAME.

## Future work

- When auth + backend are both live in production, switch the default
  mode for prod deploys to `prod` via Vercel env (`NEXT_PUBLIC_API_MODE=prod`).
  Mock mode persists as the dev/preview default and as the admin override.
- Backend `/me/runs` and `/archive/trending` rows don't yet carry
  `peak_valuation_usd`, `tagline`, or full replay payloads — `use-archive.ts`
  synthesizes those in `rowToArchiveRun()`. Drop the synthesizer once the
  backend rows grow those fields.
- Server-side filtering for `/archive` (TRENDING / ALL TIME / HIDDEN GEMS)
  is TODO; client filtering is a stand-in until view counts ship.
- The post-mortem long-read should come from the backend `endgame.reached`
  SSE payload (it already exists in `SsePayloadByKind`); the snapshot
  endpoint needs to start persisting and returning it.
