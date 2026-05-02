"use client";

/**
 * LoadingFallback — typewriter-cycle loading copy with escalating impatience.
 *
 * Cycles through ambient thoughts every 1.4s. After 8s, drops into a more
 * impatient phrase set ("the LLM is at lunch.") and after 16s offers an
 * actual refresh button — the boundary clearly took too long.
 *
 * Used by every `loading.tsx` in the app shell so the in-voice
 * loading state is consistent.
 */

import { useEffect, useState } from "react";

const AMBIENT = [
  "warming up the agent...",
  "compiling the foreshadow tracker...",
  "loading lawyer up disclaimers...",
  "spinning up the SDNY mock courtroom...",
];

const IMPATIENT = [
  "the LLM is at lunch. one moment.",
  "did the agent ghost us? checking...",
  "streaming the agent's chain of cope...",
  "still here. don't refresh. (probably.)",
];

const SLOW_THRESHOLD_MS = 8_000;
const STUCK_THRESHOLD_MS = 16_000;
const TICK_MS = 1_400;

type Props = {
  /** override the default phrase set — used by the run-page loading */
  variant?: "default" | "run" | "post-mortem";
  /** show the chrome-less compact form (one line, no refresh CTA) */
  compact?: boolean;
};

const VARIANT_AMBIENT: Record<NonNullable<Props["variant"]>, string[]> = {
  default: AMBIENT,
  run: [
    "ambient · agent thinking...",
    "attaching SSE stream...",
    "warming up the live feed...",
    "cueing the FBI awareness counter...",
  ],
  "post-mortem": [
    "developing the polaroid...",
    "stamping the verdict...",
    "redacting names for legal...",
    "queueing the share card...",
  ],
};

export function LoadingFallback({ variant = "default", compact = false }: Props) {
  const [tick, setTick] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const phraseTimer = setInterval(() => setTick((t) => t + 1), TICK_MS);
    const elapsedTimer = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 250);
    return () => {
      clearInterval(phraseTimer);
      clearInterval(elapsedTimer);
    };
  }, []);

  const isSlow = elapsed >= SLOW_THRESHOLD_MS;
  const isStuck = elapsed >= STUCK_THRESHOLD_MS;

  const pool = isSlow ? IMPATIENT : VARIANT_AMBIENT[variant];
  const phrase = pool[tick % pool.length];

  return (
    <div
      className="font-mono"
      data-testid="loading-fallback"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        fontSize: 11,
        letterSpacing: "0.04em",
        color: "var(--soft)",
        textTransform: "lowercase",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            background: isSlow ? "var(--alarm)" : "var(--ink)",
            opacity: 0.6,
          }}
          className="animate-pulse-soft"
        />
        <span style={{ color: isSlow ? "var(--alarm)" : "var(--soft)" }}>
          {phrase}
        </span>
      </div>

      {!compact && (
        <div
          aria-hidden
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            opacity: 0.55,
          }}
        >
          {VARIANT_AMBIENT[variant]
            .filter((p) => p !== phrase)
            .slice(0, 3)
            .map((p) => (
              <div key={p} style={{ color: "var(--soft)" }}>
                · {p}
              </div>
            ))}
        </div>
      )}

      {isStuck && !compact && (
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--alarm)",
          }}
        >
          <span>took too long — refresh?</span>
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            className="brutalist-btn"
            style={{
              fontSize: 10,
              padding: "6px 10px",
              background: "var(--alarm)",
              borderColor: "var(--alarm)",
              color: "var(--paper)",
              cursor: "pointer",
            }}
          >
            → REFRESH
          </button>
        </div>
      )}
    </div>
  );
}
