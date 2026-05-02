"use client";

/**
 * Run-subtree error boundary — narrower scope than the global error.tsx,
 * keeps the rest of the app shell alive when the cockpit blows up.
 */

import Link from "next/link";
import { useEffect } from "react";

export default function RunError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof console !== "undefined") {
      console.error("[run error boundary]", error);
    }
  }, [error]);

  return (
    <div
      className="font-body text-ink bg-paper"
      style={{ minHeight: "60vh", padding: "32px 24px" }}
      data-testid="run-error"
    >
      <div className="max-w-xl mx-auto">
        <div style={{ marginBottom: 20 }}>
          <span
            className="stamp"
            style={{
              display: "inline-block",
              transform: "rotate(-3deg)",
              fontSize: 13,
              padding: "4px 10px",
              fontWeight: 700,
              letterSpacing: "0.08em",
            }}
          >
            SIMULATION ERROR · AGENT TOOK THE FIFTH
          </span>
        </div>

        <h2
          className="font-body"
          style={{
            fontSize: "clamp(22px, 3vw, 30px)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            marginBottom: 12,
          }}
        >
          the run hit a wall. counsel advised silence.
        </h2>

        <p
          className="font-mono"
          style={{
            fontSize: 12,
            color: "var(--soft)",
            letterSpacing: "0.02em",
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          one of the cockpit panels threw. the rest of the app is fine.
        </p>

        <details
          style={{
            border: "1.4px solid var(--ink)",
            padding: "10px 12px",
            marginBottom: 20,
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
            [ exhibit · sealed but viewable ]
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

        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <button
            type="button"
            onClick={reset}
            className="brutalist-btn"
            style={{ fontSize: 12, padding: "10px 14px" }}
          >
            → RETRY
          </button>
          <Link
            href="/"
            className="font-mono uppercase hover:text-alarm"
            style={{
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "var(--soft)",
            }}
          >
            → HOME
          </Link>
        </div>
      </div>
    </div>
  );
}
