"use client";

/**
 * /admin/usage/[run_id] — per-run cost detail. Pulls /usage/{run_id} from the
 * Modal backend and renders the same Bloomberg-density treatment as the
 * project-wide page, plus a raw call timeline (when available via mock).
 *
 * If the run is unknown we render RUN NOT FOUND in alarm with a back link.
 */

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useUsageSummary } from "@/lib/admin/use-usage";
import { MOCK_USAGE_ROWS } from "@/lib/admin/mock-usage";
import {
  fmtInt,
  fmtUsd,
  shortModel,
  shortRunId,
} from "@/lib/admin/format";
import { UserMenu } from "@/components/system/user-menu";

const REFRESH_MS = 15_000;

export default function AdminUsageRunPage() {
  const params = useParams<{ run_id: string }>();
  const runId = params?.run_id ?? "";
  const usage = useUsageSummary(runId);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => usage.refetch(), REFRESH_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  const summary = usage.data;
  const notFound = !usage.loading && summary === null;

  const callRows = useMemo(() => {
    // Backend doesn't currently expose per-call rows on /usage/{run_id};
    // we render mock rows when in mock mode, otherwise show the empty state.
    if (usage.mocked) return MOCK_USAGE_ROWS[runId] ?? [];
    return [];
  }, [usage.mocked, runId]);

  return (
    <main className="min-h-screen bg-paper text-ink font-mono">
      {/* top bar */}
      <header
        className="flex items-center justify-between px-6 h-12"
        style={{ borderBottom: "1.4px solid var(--ink)" }}
      >
        <div className="flex items-center gap-3">
          <Link
            href="/admin/usage"
            className="font-mono uppercase tracking-wider hover:text-alarm"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            ← USAGE
          </Link>
          <span className="text-soft" style={{ fontSize: 10 }}>/</span>
          <span
            className="font-mono uppercase tracking-wider"
            style={{ fontSize: 11, fontWeight: 700 }}
          >
            RUN · {shortRunId(runId)}
          </span>
        </div>
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
            onClick={() => usage.refetch()}
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
        {usage.mocked && <MockBanner />}
        {usage.error && (
          <div
            className="mb-2"
            style={{
              border: "1.4px solid var(--alarm)",
              padding: "6px 12px",
              color: "var(--alarm)",
              fontSize: 11,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            usage fetch failed · {usage.error}
          </div>
        )}

        {notFound ? (
          <NotFound runId={runId} />
        ) : (
          <>
            <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
              <div>
                <div className="tag">monitoring · per-run</div>
                <h1
                  className="font-mono mt-1"
                  style={{
                    fontSize: 28,
                    lineHeight: 1.05,
                    letterSpacing: "0.02em",
                    fontWeight: 700,
                  }}
                >
                  {runId}
                </h1>
              </div>
              <div
                className="font-mono"
                style={{ fontSize: 11, color: "var(--soft)" }}
              >
                {summary
                  ? `${fmtInt(summary.calls_count)} calls · ${fmtUsd(summary.total_cost_usd)} this run`
                  : usage.loading
                    ? "loading…"
                    : "no data"}
              </div>
            </div>

            {/* TOP STRIP */}
            <StatStrip
              cells={[
                {
                  label: "RUN COST",
                  value: fmtUsd(summary?.current_run_cost ?? summary?.total_cost_usd ?? 0),
                },
                { label: "TOTAL CALLS", value: fmtInt(summary?.calls_count ?? 0) },
                {
                  label: "AGENTS SEEN",
                  value: fmtInt(summary ? Object.keys(summary.by_agent).length : 0),
                },
                {
                  label: "MODELS USED",
                  value: fmtInt(summary ? Object.keys(summary.by_model).length : 0),
                },
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
                        { v: fmtUsd(m.cost_usd), alarm: m.cost_usd < 0 },
                      ])
                    : []
                }
                empty={usage.loading ? "loading…" : "no model data"}
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
                        { v: fmtUsd(a.cost_usd), alarm: a.cost_usd < 0 },
                      ])
                    : []
                }
                empty={usage.loading ? "loading…" : "no agent data"}
              />
            </Section>

            {/* CALL TIMELINE */}
            <Section title="CALL TIMELINE">
              <Table
                headers={[
                  "TS",
                  "AGENT",
                  "MODEL",
                  "IN",
                  "OUT",
                  "CACHE R",
                  "CACHE W",
                  "COST",
                ]}
                rows={callRows.map((r) => [
                  r.ts,
                  r.agent ?? "—",
                  shortModel(r.model ?? ""),
                  fmtInt(r.input_tokens),
                  fmtInt(r.output_tokens),
                  fmtInt(r.cache_read),
                  fmtInt(r.cache_write),
                  { v: fmtUsd(r.cost_usd), alarm: r.cost_usd < 0 },
                ])}
                empty={
                  usage.mocked
                    ? "no rows captured for this run"
                    : "backend has no per-call dump endpoint yet"
                }
              />
            </Section>

            <div
              className="mt-12 text-center font-mono uppercase tracking-wider"
              style={{ fontSize: 10, color: "var(--soft)" }}
            >
              /usage/{shortRunId(runId)} · auto-refresh {REFRESH_MS / 1000}s
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function NotFound({ runId }: { runId: string }) {
  return (
    <div
      style={{
        border: "1.4px solid var(--alarm)",
        background: "var(--alarm-soft)",
        padding: 24,
      }}
    >
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: "var(--alarm)",
          letterSpacing: "0.06em",
        }}
      >
        RUN NOT FOUND
      </div>
      <div
        className="font-mono mt-2"
        style={{ fontSize: 12, color: "var(--ink-2)" }}
      >
        no usage rows for run_id <span style={{ fontWeight: 700 }}>{runId}</span>.
        the run may not have started yet, or the Modal container that recorded
        it has cycled (/tmp/usage.db is ephemeral — see backend/README.md).
      </div>
      <Link
        href="/admin/usage"
        className="pill alarm solid mt-3 inline-block"
        style={{ textDecoration: "none", marginTop: 12 }}
      >
        ← back to /admin/usage
      </Link>
    </div>
  );
}

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

type Cell = string | { v: string; alarm?: boolean };

function Table({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: Cell[][];
  empty: string;
}) {
  if (rows.length === 0) {
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
        {empty}
      </div>
    );
  }
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
                    {v}
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
