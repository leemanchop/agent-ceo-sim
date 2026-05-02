/**
 * Frontend-only "my recent runs" cache. Backed by localStorage so it
 * survives page refresh. Once Postgres lands, /me/runs will pull from
 * the backend and this becomes a write-through cache for the offline
 * experience.
 *
 * Keys:
 *   aces:user:{user_id}:runs    JSON array of run_id strings, newest-first
 *   aces:guest                  "1" if user picked the spectator path
 *   aces:guest_id               synthetic id for guest users
 */

const MAX_RUNS = 50;

function safeWindow(): Window | null {
  if (typeof window === "undefined") return null;
  return window;
}

function userKey(userId: string): string {
  return `aces:user:${userId}:runs`;
}

/** Returns or lazily mints the synthetic guest_id stored in localStorage. */
export function getOrCreateGuestId(): string {
  const w = safeWindow();
  if (!w) return "guest-ssr";
  const existing = w.localStorage.getItem("aces:guest_id");
  if (existing) return existing;
  // tiny non-cryptographic id; collision is fine, this is local-only
  const rand = Math.random().toString(36).slice(2, 10);
  const id = `guest-${rand}`;
  w.localStorage.setItem("aces:guest_id", id);
  return id;
}

export function markGuest(): void {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.setItem("aces:guest", "1");
  getOrCreateGuestId();
}

export function isGuest(): boolean {
  const w = safeWindow();
  if (!w) return false;
  return w.localStorage.getItem("aces:guest") === "1";
}

export function clearGuest(): void {
  const w = safeWindow();
  if (!w) return;
  w.localStorage.removeItem("aces:guest");
}

/** Push a run_id to the front of the user's local archive. */
export function rememberRun(userId: string | null, runId: string): void {
  const w = safeWindow();
  if (!w) return;
  const id = userId ?? getOrCreateGuestId();
  const key = userKey(id);
  let prior: string[] = [];
  try {
    const raw = w.localStorage.getItem(key);
    if (raw) prior = JSON.parse(raw) as string[];
  } catch {
    prior = [];
  }
  const next = [runId, ...prior.filter((r) => r !== runId)].slice(0, MAX_RUNS);
  try {
    w.localStorage.setItem(key, JSON.stringify(next));
  } catch {
    // quota — drop silently. local cache is best-effort.
  }
}

export function listRuns(userId: string | null): string[] {
  const w = safeWindow();
  if (!w) return [];
  const id = userId ?? getOrCreateGuestId();
  try {
    const raw = w.localStorage.getItem(userKey(id));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}
