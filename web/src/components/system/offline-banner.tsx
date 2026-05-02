"use client";

/**
 * <OfflineBanner /> — global offline detector. Mounted in `app/layout.tsx`.
 *
 * Listens to navigator.onLine + the `online`/`offline` events. When the
 * user goes offline, surfaces a fixed-bottom alarm-bordered banner. When
 * connectivity returns, briefly toasts "→ RESUMING" before dismissing.
 */

import { useEffect, useState } from "react";

type Phase = "online" | "offline" | "resuming";

const RESUMING_MS = 1800;

export function OfflineBanner() {
  // start "online" — the SSR pass shouldn't render the banner. The first
  // client effect reconciles to navigator.onLine.
  const [phase, setPhase] = useState<Phase>("online");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // reconcile initial state
    if (typeof navigator !== "undefined" && navigator.onLine === false) {
      setPhase("offline");
    }

    const handleOffline = () => setPhase("offline");
    const handleOnline = () => {
      setPhase((prev) => (prev === "offline" ? "resuming" : "online"));
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  // auto-dismiss the resuming toast
  useEffect(() => {
    if (phase !== "resuming") return;
    const t = setTimeout(() => setPhase("online"), RESUMING_MS);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "online") return null;

  if (phase === "resuming") {
    return (
      <div
        role="status"
        aria-live="polite"
        data-testid="offline-banner-resuming"
        className="font-mono uppercase"
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          left: "auto",
          zIndex: 60,
          border: "1.4px solid var(--ink)",
          background: "var(--ink)",
          color: "var(--paper)",
          padding: "8px 14px",
          fontSize: 11,
          letterSpacing: "0.08em",
          fontWeight: 700,
        }}
      >
        → RESUMING
      </div>
    );
  }

  // phase === "offline"
  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid="offline-banner"
      className="font-mono"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        borderTop: "2px solid var(--alarm)",
        background: "var(--alarm-soft)",
        color: "var(--alarm)",
        padding: "10px 18px",
        fontSize: 12,
        letterSpacing: "0.04em",
        textAlign: "center",
      }}
    >
      you&apos;re offline. simulation paused. agent has fled to the cayman
      islands.
    </div>
  );
}
