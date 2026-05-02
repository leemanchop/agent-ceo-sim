"use client";

/**
 * Hooks that back `/me/runs` and `/archive` with the real Modal backend
 * when in live mode (local|prod), and fall through to mock-archive.ts
 * otherwise. Both hooks watch for `aces:api_mode_change` events so the
 * admin toggle can flip in-flight without a reload.
 *
 * Behaviour matrix for `useUserRuns`:
 *   - mock mode                → returns MY_ARCHIVE, isMock = true
 *   - live + signed in         → fetch /me/runs?user_id={email}, merged
 *                                with localStorage cache; isMock = false
 *   - live + signed out        → returns [] with isMock = false (UI shows
 *                                its existing "sign in" CTA)
 *   - live + fetch error       → returns mock fallback, isMock = true,
 *                                error populated so the page can banner it
 *
 * Behaviour matrix for `usePublicArchive`:
 *   - mock mode                → returns PUBLIC_ARCHIVE, isMock = true
 *   - live                     → fetch /archive/trending?limit=50
 *   - live + fetch error       → mock fallback + error banner
 *
 * The backend returns its own row shape (snake_case columns). We map
 * those rows into ArchiveRun-compatible cards so the existing RunCard
 * component keeps working unchanged. Where the backend doesn't yet
 * carry a field (founder, tagline, full event_queue for replay), we
 * substitute placeholders or pull from the local cache.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { API_MODE_CHANGE_EVENT, getApiBase, getApiMode } from "./client";
import {
  MY_ARCHIVE,
  PUBLIC_ARCHIVE,
  type ArchiveRun,
  type EndgameArchetype,
} from "@/lib/mock-archive";
import { listRuns as listLocalRuns } from "@/lib/user/local-runs";
import { MOCK_BIBLE, MOCK_STATS, MOCK_FEED, MOCK_TIMELINE, MOCK_MINI_ACTIONS, MOCK_EVENT_QUEUE } from "@/lib/mock-data";

/** Backend row as returned by /me/runs and /archive/trending. */
type BackendRunRow = {
  run_id: string;
  user_id?: string | null;
  status?: string;
  mode?: string;
  template_id?: string | null;
  company_name?: string | null;
  industry?: string | null;
  founder_vibe?: string | null;
  length_mode?: string | null;
  craziness?: number | null;
  started_at?: string | null;
  ended_at?: string | null;
  turns_elapsed?: number | null;
  endgame_id?: string | null;
  updated_at?: string | null;
};

export type ArchiveHookResult = {
  data: ArchiveRun[];
  loading: boolean;
  error: string | null;
  /** true when the data shown is from mock-archive.ts (mock mode OR fallback) */
  isMock: boolean;
  refetch: () => Promise<void>;
};

// ── helpers ────────────────────────────────────────────────────────

function archetypeFromEndgameId(eg?: string | null): EndgameArchetype {
  const id = (eg ?? "").toUpperCase();
  if (id.includes("PRISON")) return "PRISON";
  if (id.includes("FLED") || id.includes("DXB") || id.includes("DUBAI"))
    return "FLED-DUBAI";
  if (id.includes("FAILUP") || id.includes("FAILED-UP")) return "FAILED-UP";
  if (id.includes("CULT")) return "CULTURAL-AFTERLIFE";
  if (id.includes("SUCCESS")) return "GENUINE-SUCCESS";
  if (id.includes("CURSED") || id.includes("TPG")) return "CURSED-TOPANGA";
  // sensible default for in-progress / unknown
  return "FAILED-UP";
}

function shortDate(iso?: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("en-US", { month: "short", day: "2-digit" });
  } catch {
    return "—";
  }
}

/**
 * Map a backend row → an ArchiveRun shape that RunCard can consume.
 * The replay-only fields (event_queue, mini_actions, etc.) are stubbed
 * with the demo data so that clicking REPLAY still renders something
 * reasonable; the live replay surface is wired separately by useRun.
 *
 * NOTE: peak_valuation, founder, and tagline aren't in the backend's
 * /me/runs payload yet — we synthesize them. When the backend grows
 * these fields, swap the placeholders here.
 */
function rowToArchiveRun(row: BackendRunRow): ArchiveRun {
  const archetype = archetypeFromEndgameId(row.endgame_id);
  const company = row.company_name ?? row.run_id;
  return {
    id: row.run_id,
    company_name: company.toUpperCase(),
    founder: row.founder_vibe ?? "—",
    industry: row.industry ?? "—",
    endgame_id: row.endgame_id ?? "RUN · IN-PROGRESS",
    endgame_archetype: archetype,
    peak_valuation: 0, // backend doesn't yet track this; cards render "—"
    turns_elapsed: row.turns_elapsed ?? 0,
    date: shortDate(row.ended_at ?? row.started_at),
    tagline:
      row.status === "completed"
        ? "ran the experiment. the experiment ran them."
        : "in progress · come back later.",
    bible: { ...MOCK_BIBLE, name: company, display_name: company, industry: row.industry ?? MOCK_BIBLE.industry },
    event_queue: MOCK_EVENT_QUEUE,
    mini_actions: MOCK_MINI_ACTIONS,
    timeline: MOCK_TIMELINE,
    feed: MOCK_FEED,
    start_stats: MOCK_STATS,
    stat_trajectory: [MOCK_STATS],
    original_predictions: [],
  };
}

// ── shared event subscriber ───────────────────────────────────────

function useApiModeChange(onChange: () => void) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => onChange();
    window.addEventListener(API_MODE_CHANGE_EVENT, handler);
    return () => window.removeEventListener(API_MODE_CHANGE_EVENT, handler);
  }, [onChange]);
}

// ── /me/runs hook ─────────────────────────────────────────────────

export function useUserRuns(): ArchiveHookResult {
  const { data: session, status } = useSession();
  const email = session?.user?.email ?? null;
  const signedIn = status === "authenticated" && !!email;

  const [data, setData] = useState<ArchiveRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(false);
  const aliveRef = useRef(true);

  const fetcher = useCallback(async () => {
    setLoading(true);
    setError(null);
    const mode = getApiMode();

    if (mode === "mock") {
      if (!aliveRef.current) return;
      setData(MY_ARCHIVE);
      setIsMock(true);
      setLoading(false);
      return;
    }

    // live mode — only hit the backend when we have a user identity
    if (!signedIn || !email) {
      if (!aliveRef.current) return;
      setData([]);
      setIsMock(false);
      setLoading(false);
      return;
    }

    try {
      const base = getApiBase();
      if (!base) throw new Error("api base url not configured");
      const url = `${base}/me/runs?user_id=${encodeURIComponent(email)}&limit=50`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { runs?: BackendRunRow[] };
      const rows = Array.isArray(body.runs) ? body.runs : [];
      const fromBackend = rows.map(rowToArchiveRun);

      // Merge in any localStorage-cached run ids that the backend hasn't
      // surfaced yet (e.g. brand-new run from this session).
      const cached = listLocalRuns(email);
      const seen = new Set(fromBackend.map((r) => r.id));
      const cachedStubs: ArchiveRun[] = cached
        .filter((id) => !seen.has(id))
        .map((id) =>
          rowToArchiveRun({
            run_id: id,
            user_id: email,
            status: "researching",
            company_name: id,
            started_at: new Date().toISOString(),
            turns_elapsed: 0,
          }),
        );

      if (!aliveRef.current) return;
      setData([...cachedStubs, ...fromBackend]);
      setIsMock(false);
      setLoading(false);
    } catch (e) {
      // backend down → fall back to mock so the page still renders
      if (!aliveRef.current) return;
      setError((e as Error).message || "fetch failed");
      setData(MY_ARCHIVE);
      setIsMock(true);
      setLoading(false);
    }
  }, [signedIn, email]);

  useEffect(() => {
    aliveRef.current = true;
    fetcher();
    return () => {
      aliveRef.current = false;
    };
  }, [fetcher]);

  useApiModeChange(useCallback(() => void fetcher(), [fetcher]));

  return useMemo(
    () => ({ data, loading, error, isMock, refetch: fetcher }),
    [data, loading, error, isMock, fetcher],
  );
}

// ── /archive hook ────────────────────────────────────────────────

export function usePublicArchive(): ArchiveHookResult {
  const [data, setData] = useState<ArchiveRun[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(false);
  const aliveRef = useRef(true);

  const fetcher = useCallback(async () => {
    setLoading(true);
    setError(null);
    const mode = getApiMode();

    if (mode === "mock") {
      if (!aliveRef.current) return;
      setData(PUBLIC_ARCHIVE);
      setIsMock(true);
      setLoading(false);
      return;
    }

    try {
      const base = getApiBase();
      if (!base) throw new Error("api base url not configured");
      const res = await fetch(`${base}/archive/trending?limit=50`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { runs?: BackendRunRow[] };
      const rows = Array.isArray(body.runs) ? body.runs : [];
      if (!aliveRef.current) return;
      setData(rows.map(rowToArchiveRun));
      setIsMock(false);
      setLoading(false);
    } catch (e) {
      if (!aliveRef.current) return;
      setError((e as Error).message || "fetch failed");
      setData(PUBLIC_ARCHIVE);
      setIsMock(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    fetcher();
    return () => {
      aliveRef.current = false;
    };
  }, [fetcher]);

  useApiModeChange(useCallback(() => void fetcher(), [fetcher]));

  return useMemo(
    () => ({ data, loading, error, isMock, refetch: fetcher }),
    [data, loading, error, isMock, fetcher],
  );
}
