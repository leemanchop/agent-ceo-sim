"use client";

/**
 * React hooks for the admin usage dashboard.
 *
 * Both hit the Modal backend (NEXT_PUBLIC_API_URL). When the env var is
 * missing OR NEXT_PUBLIC_API_MODE === "mock", we transparently fall back to
 * canned mock data and surface a "BACKEND NOT CONFIGURED" banner upstream
 * via the `mocked` flag so the page still renders for design review.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MOCK_RATE_LIMITS,
  MOCK_USAGE_GLOBAL,
  MOCK_USAGE_PER_RUN,
} from "./mock-usage";
import type { RateLimitsByModel, UsageSummary } from "./types";
import { API_MODE_CHANGE_EVENT, getApiMode } from "@/lib/api/client";

function apiBase(): string | null {
  // Read at call-time so tests can stub via vi.stubEnv. Also respects
  // the localStorage admin override via getApiMode().
  const url = process.env.NEXT_PUBLIC_API_URL;
  const mode = getApiMode();
  if (!url || mode === "mock") return null;
  return url.replace(/\/+$/, "");
}

export type UsageHookResult = {
  data: UsageSummary | null;
  loading: boolean;
  error: string | null;
  mocked: boolean;
  refetch: () => Promise<void>;
};

export type RateLimitsHookResult = {
  data: RateLimitsByModel | null;
  loading: boolean;
  error: string | null;
  mocked: boolean;
  refetch: () => Promise<void>;
};

/**
 * Project-wide usage summary (or run-scoped if runId provided).
 * Falls back to mock data when the backend isn't configured.
 */
export function useUsageSummary(runId?: string): UsageHookResult {
  const [data, setData] = useState<UsageSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mocked, setMocked] = useState<boolean>(false);
  const aliveRef = useRef(true);

  const fetcher = useCallback(async () => {
    setLoading(true);
    setError(null);
    const base = apiBase();
    if (!base) {
      // Mock fallback.
      const mock = runId
        ? MOCK_USAGE_PER_RUN[runId] ?? null
        : MOCK_USAGE_GLOBAL;
      if (aliveRef.current) {
        setData(mock);
        setMocked(true);
        setLoading(false);
      }
      return;
    }
    try {
      const path = runId
        ? `${base}/usage/${encodeURIComponent(runId)}`
        : `${base}/usage`;
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as UsageSummary;
      if (aliveRef.current) {
        setData(body);
        setMocked(false);
        setLoading(false);
      }
    } catch (e) {
      if (aliveRef.current) {
        setError((e as Error).message || "fetch failed");
        setLoading(false);
      }
    }
  }, [runId]);

  useEffect(() => {
    aliveRef.current = true;
    fetcher();
    return () => {
      aliveRef.current = false;
    };
  }, [fetcher]);

  // Refetch when the admin toggle flips API mode.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = () => void fetcher();
    window.addEventListener(API_MODE_CHANGE_EVENT, h);
    return () => window.removeEventListener(API_MODE_CHANGE_EVENT, h);
  }, [fetcher]);

  return { data, loading, error, mocked, refetch: fetcher };
}

/**
 * Latest Anthropic rate-limit headers per model.
 */
export function useRateLimits(): RateLimitsHookResult {
  const [data, setData] = useState<RateLimitsByModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mocked, setMocked] = useState<boolean>(false);
  const aliveRef = useRef(true);

  const fetcher = useCallback(async () => {
    setLoading(true);
    setError(null);
    const base = apiBase();
    if (!base) {
      if (aliveRef.current) {
        setData(MOCK_RATE_LIMITS);
        setMocked(true);
        setLoading(false);
      }
      return;
    }
    try {
      const res = await fetch(`${base}/rate_limits`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as RateLimitsByModel;
      if (aliveRef.current) {
        setData(body);
        setMocked(false);
        setLoading(false);
      }
    } catch (e) {
      if (aliveRef.current) {
        setError((e as Error).message || "fetch failed");
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    aliveRef.current = true;
    fetcher();
    return () => {
      aliveRef.current = false;
    };
  }, [fetcher]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = () => void fetcher();
    window.addEventListener(API_MODE_CHANGE_EVENT, h);
    return () => window.removeEventListener(API_MODE_CHANGE_EVENT, h);
  }, [fetcher]);

  return { data, loading, error, mocked, refetch: fetcher };
}
