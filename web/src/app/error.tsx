"use client";

/**
 * Global error boundary — catches uncaught exceptions in any route.
 * Stays in voice. Renders the actual error inside a collapsed `<details>`.
 */

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // surface in dev; in prod this is the only place we can see the actual
    // error from the client because next strips messages from the prop.
    if (typeof console !== "undefined") {
      console.error("[global error boundary]", error);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-paper text-ink font-body flex flex-col">
      <header
        className="flex items-center justify-between px-6 h-12 shrink-0"
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

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full">
          <div style={{ marginBottom: 36 }}>
            <span
              className="stamp"
              style={{
                display: "inline-block",
                transform: "rotate(-3deg)",
                fontSize: 18,
                padding: "6px 14px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              500 · SYSTEM EVENT
            </span>
          </div>

          <h1
            className="font-body"
            style={{
              fontSize: "clamp(32px, 5vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              marginBottom: 16,
            }}
          >
            the agent went silent. legal team confiscated phone.
          </h1>

          <p
            className="font-mono"
            style={{
              fontSize: 13,
              color: "var(--soft)",
              letterSpacing: "0.02em",
              marginBottom: 28,
              lineHeight: 1.5,
            }}
          >
            stack trace was disclosed to the SDNY in error.
          </p>

          <details
            style={{
              border: "1.4px solid var(--ink)",
              padding: "10px 12px",
              marginBottom: 28,
              background: "var(--paper-2)",
            }}
          >
            <summary
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--soft)",
                cursor: "pointer",
              }}
            >
              [ exhibit a · pry it open ]
            </summary>
            <pre
              className="font-mono"
              style={{
                marginTop: 10,
                fontSize: 11,
                color: "var(--ink-2)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: 1.5,
              }}
            >
              {error?.message || "no message provided"}
              {error?.digest ? `\n\ndigest: ${error.digest}` : ""}
            </pre>
          </details>

          <div
            style={{
              borderTop: "1.4px solid var(--ink)",
              borderBottom: "1.4px solid var(--ink)",
              padding: "18px 0",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={reset}
              className="font-mono uppercase hover:text-alarm"
              style={{
                fontSize: 14,
                letterSpacing: "0.08em",
                color: "var(--ink)",
                fontWeight: 700,
                textAlign: "left",
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              → TRY AGAIN
            </button>
            <Link
              href="/"
              className="font-mono uppercase hover:text-alarm"
              style={{
                fontSize: 14,
                letterSpacing: "0.08em",
                color: "var(--ink)",
                fontWeight: 700,
              }}
            >
              → HOME
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
