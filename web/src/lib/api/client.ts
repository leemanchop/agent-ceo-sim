/**
 * Thin HTTP client for the Modal backend. Every URL is derived from
 * `NEXT_PUBLIC_API_URL` — never hardcoded. In `mock` mode, `getApiBase()`
 * returns null and callers must NOT call HTTP.
 *
 * Streaming endpoints return native EventSource instances. SSE is browser-only,
 * so these helpers must run in a `"use client"` boundary.
 */
import type {
  CreateRunBody,
  CreateRunResponse,
  DecideBody,
  RunSnapshot,
  SpeedValue,
} from "./types";

export type ApiMode = "mock" | "local" | "prod";

/**
 * localStorage key for the admin-only mode override. Only the admin
 * toggle widget writes this key; everywhere else just reads it. This
 * lets a privileged operator flip the live UI between mock/local/prod
 * without redeploying. The key is harmless to non-admins (any user can
 * set it manually via DevTools) — but the toggle UI itself is gated on
 * `useSession().data?.user?.isAdmin`, so the path of least resistance
 * stays correct.
 */
export const API_MODE_OVERRIDE_KEY = "aces:api_mode_override";
export const API_MODE_CHANGE_EVENT = "aces:api_mode_change";

/**
 * Resolution priority:
 *   1. localStorage override  (admin toggle, browser-only)
 *   2. NEXT_PUBLIC_API_MODE env var
 *   3. default → "mock"
 */
export function getApiMode(): ApiMode {
  if (typeof window !== "undefined") {
    try {
      const override = window.localStorage.getItem(API_MODE_OVERRIDE_KEY);
      if (override === "mock" || override === "local" || override === "prod") {
        return override;
      }
    } catch {
      // localStorage unavailable (e.g. blocked) — fall through to env.
    }
  }
  const raw = process.env.NEXT_PUBLIC_API_MODE;
  if (raw === "mock" || raw === "local" || raw === "prod") return raw;
  return "mock";
}

/** Read the current override (or null if unset). Browser-only. */
export function getApiModeOverride(): ApiMode | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(API_MODE_OVERRIDE_KEY);
    return v === "mock" || v === "local" || v === "prod" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Write (or clear) the override. Dispatches a window-level event so any
 * subscribed hook can refetch / re-render without a full page reload.
 */
export function setApiModeOverride(mode: ApiMode | null): void {
  if (typeof window === "undefined") return;
  try {
    if (mode === null) {
      window.localStorage.removeItem(API_MODE_OVERRIDE_KEY);
    } else {
      window.localStorage.setItem(API_MODE_OVERRIDE_KEY, mode);
    }
    window.dispatchEvent(new Event(API_MODE_CHANGE_EVENT));
  } catch {
    // localStorage write failures are best-effort.
  }
}

/** Read the raw env-var setting (independent of the override). */
export function getApiModeEnv(): ApiMode {
  const raw = process.env.NEXT_PUBLIC_API_MODE;
  if (raw === "mock" || raw === "local" || raw === "prod") return raw;
  return "mock";
}

/**
 * Returns null in mock mode (callers must not make HTTP calls), otherwise
 * the absolute base URL with no trailing slash.
 */
export function getApiBase(): string | null {
  const mode = getApiMode();
  if (mode === "mock") return null;
  if (mode === "local") return "http://localhost:8000";
  // prod
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    // misconfigured — fail loudly in dev, silent-null in prod so the page
    // can render its own error state instead of crashing on import.
    if (typeof window !== "undefined") {
      console.warn(
        "[api/client] NEXT_PUBLIC_API_MODE=prod but NEXT_PUBLIC_API_URL is unset"
      );
    }
    return null;
  }
  return base.replace(/\/$/, "");
}

function requireBase(): string {
  const base = getApiBase();
  if (!base) {
    throw new Error(
      "agent-ceo-sim API base URL not configured. Set NEXT_PUBLIC_API_MODE and NEXT_PUBLIC_API_URL."
    );
  }
  return base;
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const base = requireBase();
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`POST ${path} → ${res.status}: ${text}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

async function getJson<T>(path: string): Promise<T> {
  const base = requireBase();
  const res = await fetch(`${base}${path}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`GET ${path} → ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

// ── public surface ────────────────────────────────────────────

/**
 * Create a new run. Pass `userId` (typically `session.user.email`) when the
 * caller is signed in; pass null/undefined for guest runs and the backend
 * will treat the run as anonymous.
 *
 * The `user_id` field rides along on the request body. The current Modal
 * backend ignores it — that's intentional. Once Postgres lands the route
 * handler will start persisting the association.
 *
 * TODO: persist user_id once we have a user table (frontend already sends it).
 */
export async function createRun(
  body: CreateRunBody,
  userId?: string | null,
): Promise<CreateRunResponse> {
  const enriched = userId ? { ...body, user_id: userId } : body;
  const res = await postJson<CreateRunResponse>("/run/create", enriched);

  // Cache the run_id locally so /me/runs can hydrate even before backend
  // persistence ships. See lib/user/local-runs.ts for the storage layout.
  try {
    if (typeof window !== "undefined" && res?.run_id) {
      const { rememberRun } = await import("@/lib/user/local-runs");
      rememberRun(userId ?? null, res.run_id);
    }
  } catch {
    // local cache is best-effort.
  }
  return res;
}

/**
 * Opens the SSE stream for `/run/{id}/start` (researcher progress + first
 * turn handshake). Caller is responsible for `.close()`-ing.
 */
export function startRun(runId: string): EventSource {
  const base = requireBase();
  return new EventSource(`${base}/run/${runId}/start`);
}

/**
 * Opens the live run SSE stream `/run/{id}/stream`. Caller closes.
 */
export function streamRun(runId: string): EventSource {
  const base = requireBase();
  return new EventSource(`${base}/run/${runId}/stream`);
}

/**
 * Replay an existing run from t=0. Speed query param is forwarded.
 *
 * NOTE: backend route `/run/{id}/replay` may not yet be wired by the
 * lifecycle agent. Treat any 404 from this as a soft failure on the caller.
 */
export function replayRun(
  runId: string,
  opts?: { speed?: SpeedValue; from_turn?: number; to_turn?: number | null }
): EventSource {
  const base = requireBase();
  const params = new URLSearchParams();
  if (opts?.speed) params.set("speed", opts.speed);
  if (opts?.from_turn !== undefined) params.set("from_turn", String(opts.from_turn));
  if (opts?.to_turn !== undefined && opts.to_turn !== null) {
    params.set("to_turn", String(opts.to_turn));
  }
  const qs = params.toString();
  return new EventSource(
    `${base}/run/${runId}/replay${qs ? `?${qs}` : ""}`
  );
}

export async function decideRun(
  runId: string,
  body: DecideBody
): Promise<void> {
  await postJson<void>(`/run/${runId}/decide`, body);
}

export async function setSpeed(
  runId: string,
  speed: SpeedValue
): Promise<void> {
  await postJson<void>(`/run/${runId}/speed`, { speed });
}

export async function endRun(runId: string): Promise<void> {
  await postJson<void>(`/run/${runId}/end`, {});
}

export async function getRunSnapshot(runId: string): Promise<RunSnapshot> {
  return getJson<RunSnapshot>(`/run/${runId}`);
}
