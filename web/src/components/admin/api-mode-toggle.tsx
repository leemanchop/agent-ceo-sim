"use client";

/**
 * Admin-only API mode override pill. Lives bottom-right on every page
 * under /admin/*. Writes to localStorage via setApiModeOverride() and
 * dispatches a window event so subscribed hooks (use-archive, use-usage,
 * etc.) refetch in place — no reload needed.
 *
 * Gated on `useSession().data?.user?.isAdmin`. When the session is not
 * an admin we render NOTHING (not even a hidden node) — admins-only by
 * the cheapest possible mechanism.
 */

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  API_MODE_CHANGE_EVENT,
  getApiMode,
  getApiModeEnv,
  getApiModeOverride,
  setApiModeOverride,
  type ApiMode,
} from "@/lib/api/client";

const MODES: ApiMode[] = ["mock", "local", "prod"];

export function ApiModeToggle() {
  const { data, status } = useSession();
  const isAdmin = Boolean(
    (data?.user as { isAdmin?: boolean } | undefined)?.isAdmin,
  );

  // Hooks must be called unconditionally — but we only RENDER for admins.
  const [active, setActive] = useState<ApiMode>("mock");
  const [override, setOverride] = useState<ApiMode | null>(null);
  const [envMode, setEnvMode] = useState<ApiMode>("mock");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setActive(getApiMode());
    setOverride(getApiModeOverride());
    setEnvMode(getApiModeEnv());
    setMounted(true);
  }, []);

  useEffect(() => {
    const refresh = () => {
      setActive(getApiMode());
      setOverride(getApiModeOverride());
    };
    window.addEventListener(API_MODE_CHANGE_EVENT, refresh);
    return () => window.removeEventListener(API_MODE_CHANGE_EVENT, refresh);
  }, []);

  if (status !== "authenticated" || !isAdmin) return null;
  if (!mounted) return null;

  const apiUrl =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_API_URL || ""
      : "";
  const prodReachable = active === "prod" && Boolean(apiUrl);
  const localReachable = active === "local";
  const willFallBack =
    (active === "prod" && !apiUrl) ||
    (active === "local" && !apiUrl);

  const flip = (m: ApiMode) => {
    // Clicking the currently-set override clears it (back to env default).
    if (override === m) {
      setApiModeOverride(null);
    } else {
      setApiModeOverride(m);
    }
  };

  return (
    <div
      role="region"
      aria-label="api mode override"
      style={{
        position: "fixed",
        right: 16,
        bottom: 16,
        zIndex: 40,
        background: "var(--paper)",
        border: "1.4px solid var(--ink)",
        padding: "8px 10px",
        minWidth: 220,
        boxShadow: "3px 3px 0 var(--ink)",
        fontFamily: "var(--font-mono, ui-monospace, monospace)",
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.14em",
          fontWeight: 700,
          color: "var(--ink)",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        ▌API MODE
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {MODES.map((m) => {
          const isActive = active === m;
          return (
            <button
              key={m}
              onClick={() => flip(m)}
              className="transition-colors"
              style={{
                flex: 1,
                fontSize: 10,
                letterSpacing: "0.1em",
                fontWeight: 700,
                textTransform: "uppercase",
                padding: "4px 0",
                border: "1.4px solid var(--ink)",
                background: isActive ? "var(--alarm)" : "var(--paper)",
                color: isActive ? "var(--paper)" : "var(--ink)",
                cursor: "pointer",
              }}
              aria-pressed={isActive}
              title={
                override === m
                  ? "click to clear override"
                  : `set override to ${m}`
              }
            >
              {m}
            </button>
          );
        })}
      </div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: "0.06em",
          color: "var(--soft)",
          marginTop: 6,
          textTransform: "lowercase",
        }}
      >
        env={envMode} · override={override ?? "—"}
      </div>
      {willFallBack && (
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.06em",
            color: "var(--alarm)",
            marginTop: 4,
            textTransform: "uppercase",
            fontWeight: 700,
            lineHeight: 1.3,
          }}
        >
          ⚠ NEXT_PUBLIC_API_URL unset
          <br />
          {active} mode falls back to mock
        </div>
      )}
      {(prodReachable || localReachable) && apiUrl && (
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.04em",
            color: "var(--ink)",
            marginTop: 4,
            wordBreak: "break-all",
            opacity: 0.6,
          }}
        >
          → {apiUrl.replace(/^https?:\/\//, "")}
        </div>
      )}
    </div>
  );
}
