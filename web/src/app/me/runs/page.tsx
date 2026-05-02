"use client";

/**
 * /me/runs — personal archive.
 *
 * Data lives behind `useUserRuns()` (see lib/api/use-archive.ts), which
 * branches on the live `getApiMode()`:
 *   - mock                  → MY_ARCHIVE (demo runs, isMock=true)
 *   - live + signed in      → GET /me/runs?user_id={email}
 *   - live + signed out     → empty list (page shows "sign in" CTA)
 *   - live + fetch error    → mock fallback + warning banner
 *
 * The mock banner ("DEMO RUNS · …") only shows when `isMock` is true and
 * the user IS signed in — that's the case where their real archive isn't
 * showing because we're in demo mode (or backend's down).
 */

import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { RunCard } from "@/components/archive/run-card";
import { UserMenu } from "@/components/system/user-menu";
import { useUserRuns } from "@/lib/api/use-archive";
import { cn } from "@/lib/utils";
import type { ArchiveRun } from "@/lib/mock-archive";

const TABS = ["MY RUNS", "PUBLIC ARCHIVE", "LEADERBOARDS"] as const;

export default function MyRunsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("MY RUNS");
  const { data: session, status } = useSession();
  const signedIn = status === "authenticated";
  const email = session?.user?.email ?? null;

  const { data: myRuns, loading, error, isMock, refetch } = useUserRuns();

  return (
    <main className="min-h-screen bg-paper text-ink font-body">
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
        <nav className="flex items-center gap-2">
          <Link href="/archive" className="pill" style={{ textDecoration: "none" }}>
            archive
          </Link>
          <Link href="/" className="pill solid" style={{ textDecoration: "none" }}>
            new run
          </Link>
          <UserMenu />
        </nav>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* page heading */}
        <div className="flex items-end justify-between mb-2 flex-wrap gap-3">
          <div>
            <div className="tag">archive · personal</div>
            <h1
              className="font-body mt-1"
              style={{
                fontSize: "clamp(28px, 4vw, 40px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              {signedIn && email ? (
                <>
                  MY RUNS{" "}
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 14,
                      letterSpacing: "0.04em",
                      color: "var(--soft)",
                    }}
                  >
                    · {email}
                  </span>
                </>
              ) : (
                "MY RUNS"
              )}
            </h1>
          </div>
          <div
            className="font-mono"
            style={{ fontSize: 11, color: "var(--soft)" }}
          >
            {signedIn ? `${myRuns.length} completed` : "guest mode"}
          </div>
        </div>

        {/* tab strip */}
        <div
          className="flex items-center gap-0 mt-4"
          style={{ borderBottom: "1.4px solid var(--ink)" }}
        >
          {TABS.map((t) => {
            const active = t === tab;
            const isMyRuns = t === "MY RUNS";
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "font-mono uppercase tracking-wider transition-colors",
                  active && "text-ink"
                )}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  padding: "10px 14px",
                  borderBottom: active
                    ? "2px solid var(--alarm)"
                    : "2px solid transparent",
                  marginBottom: -1,
                  color: active ? "var(--ink)" : "var(--soft)",
                  cursor: "pointer",
                  background: "transparent",
                  fontWeight: active ? 700 : 400,
                }}
              >
                {isMyRuns ? `${t} · ${signedIn ? myRuns.length : 0}` : t}
              </button>
            );
          })}
        </div>

        {/* mock banner — only when we're showing demo data to a signed-in user */}
        {tab === "MY RUNS" && signedIn && isMock && !loading && (
          <DemoBanner />
        )}

        {/* error banner — backend hiccup, mock fallback in use */}
        {tab === "MY RUNS" && error && !loading && (
          <ErrorBanner message={error} onRetry={refetch} />
        )}

        {/* content */}
        <div className="mt-6">
          {tab === "MY RUNS" && (
            <>
              {loading ? (
                <SkeletonGrid />
              ) : signedIn ? (
                myRuns.length > 0 ? (
                  <div
                    className="grid gap-4"
                    style={{
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(280px, 1fr))",
                    }}
                  >
                    {myRuns.map((r) => (
                      <RunCard key={r.id} run={r} />
                    ))}
                  </div>
                ) : (
                  <NoRunsYetEmpty />
                )
              ) : (
                <SignedOutEmpty trending={myRuns.slice(0, 4)} />
              )}
            </>
          )}

          {tab === "PUBLIC ARCHIVE" && (
            <Placeholder
              title="head over to the public archive"
              cta="open /archive →"
              href="/archive"
            />
          )}

          {tab === "LEADERBOARDS" && (
            <Placeholder
              title="leaderboards · coming soon"
              cta="back to my runs"
              onBack={() => setTab("MY RUNS")}
            />
          )}
        </div>

        <div
          className="mt-12 text-center font-mono uppercase tracking-wider"
          style={{ fontSize: 10, color: "var(--soft)" }}
        >
          30u30.fail · the archive · {isMock ? "demo data" : "live"}.
        </div>
      </div>
    </main>
  );
}

function DemoBanner() {
  return (
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
      DEMO RUNS · sign in + create runs to populate your real archive
    </div>
  );
}

function ErrorBanner({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
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
          {message}
        </div>
      </div>
      <button
        onClick={onRetry}
        className="pill"
        style={{ cursor: "pointer", fontSize: 10 }}
      >
        retry
      </button>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div
      className="grid gap-4"
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
        >
          <div
            className="tag"
            style={{ background: "transparent", color: "var(--soft)" }}
          >
            loading · {i + 1}
          </div>
          <div
            style={{
              height: 24,
              marginTop: 10,
              width: "70%",
              background: "var(--paper-2, rgba(0,0,0,0.04))",
            }}
          />
          <div
            style={{
              height: 12,
              marginTop: 10,
              width: "55%",
              background: "var(--paper-2, rgba(0,0,0,0.03))",
            }}
          />
          <div
            style={{
              height: 12,
              marginTop: 18,
              width: "90%",
              background: "var(--paper-2, rgba(0,0,0,0.03))",
            }}
          />
        </div>
      ))}
    </div>
  );
}

function NoRunsYetEmpty() {
  return (
    <div
      className="flex flex-col items-start gap-3"
      style={{
        border: "1.4px dashed var(--ink)",
        padding: 32,
      }}
    >
      <div className="tag">empty · clean slate</div>
      <div
        className="font-body"
        style={{ fontSize: 22, color: "var(--ink)", maxWidth: 480 }}
      >
        NO RUNS YET
      </div>
      <div
        className="font-body"
        style={{ fontSize: 14, color: "var(--ink-2)", maxWidth: 480 }}
      >
        start one →
      </div>
      <Link
        href="/"
        className="brutalist-btn"
        style={{
          textDecoration: "none",
          fontSize: 14,
          padding: "12px 20px",
        }}
      >
        → BEGIN A RUN
      </Link>
    </div>
  );
}

function SignedOutEmpty({
  trending,
}: {
  trending: ArchiveRun[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <div
        className="flex flex-col items-start gap-3"
        style={{
          border: "1.4px dashed var(--ink)",
          padding: 32,
        }}
      >
        <div className="tag">empty · guest</div>
        <div
          className="font-body"
          style={{ fontSize: 18, color: "var(--ink-2)", maxWidth: 480 }}
        >
          you don&apos;t have any saved runs. probably because we don&apos;t
          know who you are yet.
        </div>
        <Link
          href="/auth/signin?callbackUrl=/me/runs"
          className="brutalist-btn"
          style={{
            textDecoration: "none",
            fontSize: 14,
            padding: "12px 20px",
          }}
        >
          → SIGN IN TO SEE YOUR RUNS
        </Link>
      </div>

      {trending.length > 0 && (
        <div>
          <div
            className="font-mono uppercase tracking-wider mb-3"
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
            }}
          >
            ▌TRENDING
          </div>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            }}
          >
            {trending.map((r) => (
              <RunCard key={r.id} run={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Placeholder({
  title,
  cta,
  href,
  onBack,
}: {
  title: string;
  cta: string;
  href?: string;
  onBack?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-start gap-3 py-16"
      style={{
        border: "1.4px dashed var(--ink)",
        padding: 32,
      }}
    >
      <div className="tag">empty</div>
      <div
        className="font-body"
        style={{ fontSize: 18, color: "var(--ink-2)" }}
      >
        {title}
      </div>
      {href ? (
        <Link href={href} className="pill solid" style={{ textDecoration: "none" }}>
          {cta}
        </Link>
      ) : (
        <button onClick={onBack} className="pill" style={{ cursor: "pointer" }}>
          {cta}
        </button>
      )}
    </div>
  );
}
