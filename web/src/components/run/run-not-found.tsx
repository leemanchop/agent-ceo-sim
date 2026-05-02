"use client";

/**
 * <RunNotFound /> — inline state for when a run id has no backing data.
 *
 * Mount this when the run page receives a 404 from the backend or no
 * matching mock id. Wire-in is owned by `app/run/[id]/page.tsx` — see
 * TODO at the bottom of the SSE consumer wire-up.
 *
 * This is intentionally NOT a route — keeping it inline avoids a hard
 * navigation when the run vanishes mid-stream and lets the SSE consumer
 * agent decide when to render it.
 */

import Link from "next/link";

type Props = {
  /** the unresolved run id — surfaced in the body for the user's sanity */
  runId?: string;
};

export function RunNotFound({ runId }: Props) {
  return (
    <main className="min-h-screen bg-paper text-ink font-body" data-testid="run-not-found">
      <header
        className="flex items-center justify-between px-6 h-12"
        style={{ borderBottom: "1.4px solid var(--ink)" }}
      >
        <div
          className="font-mono uppercase tracking-wider"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}
        >
          FORBES · 30u30 SIMULATOR
        </div>
        <Link
          href="/"
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            color: "var(--soft)",
            letterSpacing: "0.08em",
          }}
        >
          ← HOME
        </Link>
      </header>

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "72px 24px",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <span
            className="stamp"
            style={{
              display: "inline-block",
              transform: "rotate(-3deg)",
              fontSize: 16,
              padding: "5px 12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            RUN NOT FOUND
          </span>
        </div>

        <h1
          className="font-body"
          style={{
            fontSize: "clamp(28px, 4vw, 36px)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            marginBottom: 14,
          }}
        >
          this run was never indexed. probably for legal reasons.
        </h1>

        <p
          className="font-mono"
          style={{
            fontSize: 12,
            color: "var(--soft)",
            letterSpacing: "0.02em",
            lineHeight: 1.5,
            marginBottom: 28,
          }}
        >
          {runId ? (
            <>
              the id <span style={{ color: "var(--alarm)" }}>{runId}</span>{" "}
              didn&apos;t resolve. either it never existed, the agent burned the
              evidence, or the share link is stale.
            </>
          ) : (
            <>
              the id didn&apos;t resolve. either it never existed, the agent
              burned the evidence, or the share link is stale.
            </>
          )}
        </p>

        <div
          style={{
            borderTop: "1.4px solid var(--ink)",
            borderBottom: "1.4px solid var(--ink)",
            padding: "16px 0",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <BrutalLink href="/">→ START NEW RUN</BrutalLink>
          <BrutalLink href="/me/runs">→ MY RUNS</BrutalLink>
          <BrutalLink href="/archive">→ ARCHIVE</BrutalLink>
        </div>
      </div>
    </main>
  );
}

function BrutalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-mono uppercase hover:text-alarm"
      style={{
        fontSize: 13,
        letterSpacing: "0.08em",
        color: "var(--ink)",
        fontWeight: 700,
      }}
    >
      {children}
    </Link>
  );
}
