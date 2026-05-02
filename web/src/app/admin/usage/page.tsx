"use client";

/**
 * /admin/usage — small monitoring dashboard for the team.
 *
 * Reads /usage and /rate_limits from the Modal backend (via
 * NEXT_PUBLIC_API_URL). Falls back to canned mock data when the env var is
 * missing or NEXT_PUBLIC_API_MODE === "mock" — see lib/admin/mock-usage.ts.
 *
 * Auto-refreshes every 15s. Pause via the AUTO-REFRESH checkbox (header).
 *
 * NOTE — admin gating lives in /admin/layout.tsx. Non-admins are
 * server-side redirected to /auth/signin before this client component
 * is ever streamed.
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRateLimits, useUsageSummary } from "@/lib/admin/use-usage";
import {
  MOCK_RUN_META,
  MODEL_CAPS,
} from "@/lib/admin/mock-usage";
import {
  fmtInt,
  fmtRelative,
  fmtUsd,
  shortModel,
  shortRunId,
} from "@/lib/admin/format";
import type { RateLimitsForModel } from "@/lib/admin/types";
import { UserMenu } from "@/components/system/user-menu";

const REFRESH_MS = 15_000;

export default function AdminUsagePage() {
  const usage = useUsageSummary();
  const rates = useRateLimits();
  const [auto, setAuto] = useState(true);
  // Re-tick once a second so relative timestamps stay live without
  // hitting the network.
  const [, setNowTick] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Auto-refresh both endpoints.
  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => {
      usage.refetch();
      rates.refetch();
    }, REFRESH_MS);
    return () => window.clearInterval(id);
    // refetch fns are stable per their deps; we intentionally restart
    // the interval only when auto flips.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  // 1Hz tick for "in 47s" countdowns.
  useEffect(() => {
    timerRef.current = window.setInterval(() => setNowTick((n) => n + 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const mocked = usage.mocked || rates.mocked;
  const summary = usage.data;
  const rateData = rates.data;

  const activeRuns = useMemo(() => {
    // Hackathon proxy: count distinct runs we have visibility into.
    // The /usage endpoint doesn't expose per-run rollups, so for now we
    // fall back to the recent-runs table size (mock data) — when the
    // backend grows a /runs endpoint, swap this in.
    return MOCK_RUN_META.length;
  }, []);

  const avgRunCost = useMemo(() => {
    if (!summary) return 0;
    if (activeRuns === 0) return 0;
    return summary.total_cost_usd / activeRuns;
  }, [summary, activeRuns]);

  return (
    <main className="min-h-screen bg-paper text-ink font-mono">
      {/* top bar */}
      <header
        className="flex items-center justify-between px-6 h-12"
        style={{ borderBottom: "1.4px solid var(--ink)" }}
      >
        <Link
          href="/"
          className="font-mono uppercase tracking-wider hover:text-alarm"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textDecoration: "none",
            color: "var(--ink)",
          }}
        >
          ← FORBES · 30u30 SIMULATOR
        </Link>
        <div className="flex items-center gap-2">
          <label
            className="font-mono uppercase tracking-wider flex items-center gap-1.5 select-none"
            style={{ fontSize: 10, color: "var(--soft)", cursor: "pointer" }}
          >
            <input
              type="checkbox"
              checked={auto}
              onChange={(e) => setAuto(e.target.checked)}
              style={{ accentColor: "var(--alarm)" }}
            />
            AUTO-REFRESH 15s
          </label>
          {!auto && (
            <span className="pill alarm" style={{ fontSize: 10 }}>
              PAUSED
            </span>
          )}
          <button
            onClick={() => {
              usage.refetch();
              rates.refetch();
            }}
            className="pill"
            style={{ cursor: "pointer", fontSize: 10 }}
          >
            ↻ refresh
          </button>
          <span
            className="stamp"
            style={{ fontSize: 10, transform: "rotate(-2deg)" }}
          >
            🔒 ADMIN
          </span>
          <UserMenu />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {/* heading */}
        <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="tag">monitoring · live</div>
            <h1
              className="font-mono mt-1"
              style={{
                fontSize: 28,
                lineHeight: 1.05,
                letterSpacing: "0.02em",
                fontWeight: 700,
              }}
            >
              USAGE
            </h1>
          </div>
          <div className="font-mono" style={{ fontSize: 11, color: "var(--soft)" }}>
            {summary
              ? `${fmtInt(summary.calls_count)} calls · ${fmtUsd(summary.total_cost_usd)} total`
              : usage.loading
                ? "loading…"
                : "no data"}
          </div>
        </div>

        {mocked && <MockBanner />}
        {usage.error && <ErrorBanner kind="usage" msg={usage.error} />}
        {rates.error && <ErrorBanner kind="rate_limits" msg={rates.error} />}

        {/* TOP STRIP — Bloomberg cells */}
        <StatStrip
          cells={[
            { label: "TOTAL SPEND", value: fmtUsd(summary?.total_cost_usd ?? 0) },
            { label: "LAST 24H", value: fmtUsd(summary?.last_24h_cost ?? 0) },
            { label: "TOTAL CALLS", value: fmtInt(summary?.calls_count ?? 0) },
            { label: "ACTIVE RUNS", value: fmtInt(activeRuns) },
            { label: "RUN COST AVG", value: fmtUsd(avgRunCost) },
          ]}
        />

        {/* BY MODEL */}
        <Section title="BY MODEL">
          <Table
            headers={[
              "MODEL",
              "CALLS",
              "TOKENS IN",
              "TOKENS OUT",
              "CACHE READ",
              "CACHE WRITE",
              "COST USD",
            ]}
            rows={
              summary
                ? Object.entries(summary.by_model).map(([model, m]) => [
                    shortModel(model),
                    fmtInt(m.calls),
                    fmtInt(m.input_tokens),
                    fmtInt(m.output_tokens),
                    fmtInt(m.cache_read),
                    fmtInt(m.cache_write),
                    {
                      v: fmtUsd(m.cost_usd),
                      alarm: m.cost_usd < 0,
                    },
                  ])
                : []
            }
            empty={usage.loading ? "loading…" : "no model data yet"}
          />
        </Section>

        {/* BY AGENT */}
        <Section title="BY AGENT">
          <Table
            headers={["AGENT", "CALLS", "TOKENS IN", "TOKENS OUT", "COST USD"]}
            rows={
              summary
                ? Object.entries(summary.by_agent).map(([agent, a]) => [
                    agent,
                    fmtInt(a.calls),
                    fmtInt(a.input_tokens),
                    fmtInt(a.output_tokens),
                    {
                      v: fmtUsd(a.cost_usd),
                      alarm: a.cost_usd < 0,
                    },
                  ])
                : []
            }
            empty={usage.loading ? "loading…" : "no agent data yet"}
          />
        </Section>

        {/* RATE LIMITS */}
        <Section title="RATE LIMITS">
          {!rateData ? (
            <Empty msg={rates.loading ? "loading…" : "no headers captured"} />
          ) : Object.keys(rateData).length === 0 ? (
            <Empty msg="no calls observed in this container" />
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              {Object.entries(rateData).map(([model, rl]) => (
                <RateLimitCard key={model} model={model} rl={rl} />
              ))}
            </div>
          )}
        </Section>

        {/* RECENT RUNS */}
        <Section title="RECENT RUNS">
          <Table
            headers={["RUN ID", "STARTED AT", "AGENTS", "COST USD", ""]}
            rows={MOCK_RUN_META.map((r) => [
              shortRunId(r.run_id),
              r.started_at,
              fmtInt(r.agent_count),
              fmtUsd(r.cost_usd),
              {
                v: "OPEN →",
                href: `/admin/usage/${r.run_id}`,
              },
            ])}
            empty="no runs yet"
          />
          <div className="tag mt-2" style={{ color: "var(--soft)" }}>
            note · backend has no /runs endpoint yet; this list is local
          </div>
        </Section>

        <div
          className="mt-12 text-center font-mono uppercase tracking-wider"
          style={{ fontSize: 10, color: "var(--soft)" }}
        >
          /usage · /rate_limits · auto-refresh {REFRESH_MS / 1000}s · admin tooling
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// sub-components
// ─────────────────────────────────────────────────────────────────────────

function StatStrip({ cells }: { cells: { label: string; value: string }[] }) {
  return (
    <div
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cells.length}, 1fr)`,
        border: "1.4px solid var(--ink)",
      }}
    >
      {cells.map((c, i) => (
        <div
          key={c.label}
          className="px-3 py-2"
          style={{
            borderRight:
              i < cells.length - 1 ? "1.2px solid var(--ink)" : undefined,
          }}
        >
          <div className="tag">{c.label}</div>
          <div
            className="font-mono"
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.02em",
              marginTop: 2,
            }}
          >
            {c.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <div
        className="font-mono uppercase tracking-wider mb-2"
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.12em",
          color: "var(--ink)",
        }}
      >
        ▌{title}
      </div>
      {children}
    </section>
  );
}

type Cell = string | { v: string; alarm?: boolean; href?: string };

function Table({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: Cell[][];
  empty: string;
}) {
  if (rows.length === 0) return <Empty msg={empty} />;
  return (
    <div
      style={{
        border: "1.4px solid var(--ink)",
        overflowX: "auto",
      }}
    >
      <table
        className="w-full"
        style={{ borderCollapse: "collapse", fontFamily: "var(--font-mono)" }}
      >
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                className="text-left px-3 py-1.5"
                style={{
                  borderBottom: "1.2px solid var(--ink)",
                  borderRight:
                    i < headers.length - 1 ? "1.2px solid var(--ink)" : undefined,
                  fontSize: 9,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--soft)",
                  fontWeight: 700,
                  background: "var(--paper-2)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.map((cell, ci) => {
                const isObj = typeof cell !== "string";
                const v = isObj ? cell.v : cell;
                const alarm = isObj ? cell.alarm : false;
                const href = isObj ? cell.href : undefined;
                const inner = href ? (
                  <Link
                    href={href}
                    className="hover:text-alarm"
                    style={{
                      color: "var(--ink)",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    {v}
                  </Link>
                ) : (
                  v
                );
                return (
                  <td
                    key={ci}
                    className="px-3 py-1.5"
                    style={{
                      borderTop: ri > 0 ? "1px dashed var(--ink)" : undefined,
                      borderRight:
                        ci < r.length - 1 ? "1.2px solid var(--ink)" : undefined,
                      fontSize: 12,
                      color: alarm ? "var(--alarm)" : "var(--ink)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {inner}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return (
    <div
      style={{
        border: "1.4px dashed var(--ink)",
        padding: 16,
        color: "var(--soft)",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {msg}
    </div>
  );
}

function MockBanner() {
  return (
    <div
      className="mb-4"
      style={{
        border: "1.4px solid var(--alarm)",
        background: "var(--alarm-soft)",
        padding: "8px 12px",
        color: "var(--alarm)",
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
      }}
    >
      BACKEND NOT CONFIGURED — using mock data. set
      NEXT_PUBLIC_API_URL to a Modal deploy.
    </div>
  );
}

function ErrorBanner({ kind, msg }: { kind: string; msg: string }) {
  return (
    <div
      className="mb-2"
      style={{
        border: "1.4px solid var(--alarm)",
        padding: "6px 12px",
        color: "var(--alarm)",
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontFamily: "var(--font-mono)",
      }}
    >
      {kind} fetch failed · {msg}
    </div>
  );
}

function RateLimitCard({
  model,
  rl,
}: {
  model: string;
  rl: RateLimitsForModel;
}) {
  const cap = MODEL_CAPS[model] ?? { requests: 1000, tokens: 400_000 };
  const reqRem = numOrNull(rl.requests_remaining);
  const tokRem =
    numOrNull(rl.tokens_remaining) ??
    numOrNull(rl.input_tokens_remaining) ??
    null;

  const reqPct = reqRem == null ? null : Math.max(0, Math.min(100, (reqRem / cap.requests) * 100));
  const tokPct = tokRem == null ? null : Math.max(0, Math.min(100, (tokRem / cap.tokens) * 100));

  const reset = rl.requests_reset ?? rl.tokens_reset;

  return (
    <div style={{ border: "1.4px solid var(--ink)", padding: 10 }}>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.04em" }}
      >
        {shortModel(model)}
      </div>
      <Bar label="REQUESTS" remaining={reqRem} pct={reqPct} cap={cap.requests} />
      <Bar label="TOKENS" remaining={tokRem} pct={tokPct} cap={cap.tokens} />
      <div
        className="font-mono mt-1.5"
        style={{ fontSize: 10, color: "var(--soft)" }}
      >
        RESET · {fmtRelative(reset)} ·
        {" "}
        OBSERVED {fmtRelative(rl.observed_at)}
      </div>
    </div>
  );
}

function Bar({
  label,
  remaining,
  pct,
  cap,
}: {
  label: string;
  remaining: number | null;
  pct: number | null;
  cap: number;
}) {
  const alarm = pct != null && pct < 10;
  return (
    <div className="mt-2">
      <div className="flex justify-between" style={{ fontSize: 10 }}>
        <span className="tag">{label}</span>
        <span
          className="font-mono"
          style={{
            color: alarm ? "var(--alarm)" : "var(--ink)",
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          {remaining == null ? "—" : fmtInt(remaining)}{" "}
          <span style={{ color: "var(--soft)" }}>/ {fmtInt(cap)}</span>
        </span>
      </div>
      <div
        style={{
          height: 6,
          marginTop: 3,
          border: "1px solid var(--ink)",
          background: "var(--paper)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct ?? 0}%`,
            background: alarm ? "var(--alarm)" : "var(--ink)",
          }}
        />
      </div>
    </div>
  );
}

function numOrNull(s: string | undefined): number | null {
  if (s == null) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
