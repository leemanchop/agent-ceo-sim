"use client";

/**
 * /archive — public trending wall.
 *
 * Backed by `usePublicArchive()`:
 *   - mock                  → PUBLIC_ARCHIVE (canned demo set)
 *   - live                  → GET /archive/trending?limit=50
 *   - live + fetch error    → mock fallback + warning banner
 *
 * Filter pills (TRENDING / ALL TIME / HIDDEN GEMS) currently slice the
 * live list client-side. TODO: server-side filters once the backend
 * carries view counts.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { RunCard } from "@/components/archive/run-card";
import { usePublicArchive } from "@/lib/api/use-archive";
import { cn } from "@/lib/utils";

const FILTERS = ["TRENDING THIS WEEK", "ALL TIME", "HIDDEN GEMS"] as const;

export default function PublicArchivePage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>(
    "TRENDING THIS WEEK"
  );
  const { data: runs, loading, error, isMock, refetch } = usePublicArchive();

  const visible = useMemo(() => {
    if (filter === "TRENDING THIS WEEK") {
      // when the data carries `trending` markers (mock) honour them; in live
      // mode every entry is already the most-recent N completed runs.
      const flagged = runs.filter((r) => r.trending);
      return flagged.length > 0 ? flagged : runs;
    }
    if (filter === "ALL TIME") {
      return [...runs].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    }
    // hidden gems = lowest view counts (or just the tail when nothing's flagged)
    const lowProfile = runs.filter((r) => !r.trending);
    return (lowProfile.length > 0 ? lowProfile : runs).slice().sort(
      (a, b) => (a.views ?? 0) - (b.views ?? 0)
    );
  }, [filter, runs]);

  return (
    <main className="min-h-screen bg-paper text-ink font-body">
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
        <nav className="flex items-center gap-2">
          <Link href="/me/runs" className="pill" style={{ textDecoration: "none" }}>
            my runs
          </Link>
          <Link href="/" className="pill solid" style={{ textDecoration: "none" }}>
            new run
          </Link>
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-end justify-between mb-2 flex-wrap gap-3">
          <div>
            <div className="tag">archive · public</div>
            <h1
              className="font-body mt-1"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              PUBLIC ARCHIVE
            </h1>
          </div>
          <div
            className="font-mono"
            style={{ fontSize: 11, color: "var(--soft)" }}
          >
            {runs.length} runs · {isMock ? "demo" : "public"}
          </div>
        </div>

        {/* mock banner — only visible when isMock is true */}
        {isMock && !loading && (
          <div
            className="font-mono uppercase mt-4"
            style={{
              fontSize: 10,
              letterSpacing: "0.08em",
              color: "var(--soft)",
              borderTop: "1px dashed var(--ink)",
              borderBottom: "1px dashed var(--ink)",
              padding: "8px 0",
            }}
          >
            DEMO ARCHIVE · canned runs · the wall fills up once people start shipping
          </div>
        )}

        {error && !loading && (
          <div
            className="mt-4 flex items-center justify-between gap-3"
            style={{
              border: "1.4px solid var(--alarm)",
              background: "var(--alarm-soft, rgba(255,90,71,0.08))",
              padding: "10px 12px",
            }}
          >
            <div>
              <div
                className="font-mono uppercase tracking-wider"
                style={{ fontSize: 10, fontWeight: 700, color: "var(--alarm)" }}
              >
                archive went silent. system event.
              </div>
              <div
                className="font-mono"
                style={{ fontSize: 10, color: "var(--soft)", marginTop: 2 }}
              >
                {error}
              </div>
            </div>
            <button
              onClick={refetch}
              className="pill"
              style={{ cursor: "pointer", fontSize: 10 }}
            >
              retry
            </button>
          </div>
        )}

        {/* filter pills */}
        <div className="flex flex-wrap gap-2 mt-5">
          {FILTERS.map((f) => {
            const active = f === filter;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn("pill", active && "solid")}
                style={{ cursor: "pointer", fontSize: 10 }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* grid / loading / empty */}
        {loading ? (
          <div
            className="mt-6 grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  border: "1.4px dashed var(--ink)",
                  background: "var(--paper-2, rgba(0,0,0,0.02))",
                  minHeight: 260,
                  padding: 16,
                  opacity: 0.7,
                }}
              />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div
            className="mt-10"
            style={{
              border: "1.4px dashed var(--ink)",
              padding: 32,
              color: "var(--soft)",
            }}
          >
            no public runs yet · be the first to ship a cursed startup
          </div>
        ) : (
          <div
            className="mt-6 grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {visible.map((r) => (
              <RunCard key={r.id} run={r} />
            ))}
          </div>
        )}

        <div
          className="mt-12 text-center font-mono uppercase tracking-wider"
          style={{ fontSize: 10, color: "var(--soft)" }}
        >
          30u30.fail · public archive · {isMock ? "demo data" : "live runs"}
        </div>
      </div>
    </main>
  );
}
