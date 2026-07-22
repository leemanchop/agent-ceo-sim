"use client";

import { useEffect, useRef } from "react";
import type { Stats, TimelineEntry } from "@/lib/types";

/**
 * FBI surveillance surface (owner spec, Phase 3 UI layer):
 * - the right-rail FBI tab unlocks at fbi_awareness >= FBI_UNLOCK_AT
 * - first unlock throws a center-screen case-file modal that MUST be
 *   dismissed via its ✕ (no click-outside, no auto-dismiss)
 * - the tab renders a case file: status band, awareness meter, and a
 *   surveillance log derived from the run's own events — no extra
 *   backend calls; the script already carries the escalation.
 */

export const FBI_UNLOCK_AT = 20;

const STAGES: Array<{ at: number; label: string; note: string }> = [
  { at: 20, label: "PASSIVE MONITORING", note: "File opened. Public statements archived." },
  { at: 50, label: "ACTIVE INVESTIGATION", note: "Subpoena drafts circulating. Vendors contacted." },
  { at: 61, label: "ENFORCEMENT REFERRAL", note: "SEC liaison assigned. Interviews scheduled." },
  { at: 86, label: "GRAND JURY", note: "Sealed. Do not discuss travel plans." },
];

export function fbiStage(awareness: number) {
  let cur = STAGES[0];
  for (const s of STAGES) if (awareness >= s.at) cur = s;
  return cur;
}

/** Surveillance-log rows derived from what already happened on screen. */
export function buildFbiLog(timeline: TimelineEntry[], awareness: number) {
  const watched = new Set(["FBI", "REGULATORY", "BANKING", "LEGAL"]);
  const rows = timeline
    .filter((e) => watched.has((e.category || "").toUpperCase()) || e.alarm)
    .map((e) => ({
      day: e.day,
      text: e.title,
      note: e.alarm ? "flagged: pattern consistent with prior subjects" : "logged",
    }));
  const stage = fbiStage(awareness);
  rows.push({
    day: -1, // renders as "now"
    text: `Status: ${stage.label}`,
    note: stage.note,
  });
  return rows.reverse();
}

function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem("aces:muted") !== "0";
  } catch {
    return true;
  }
}

/** Center-screen first-unlock takeover. Dismiss ONLY via the ✕. */
export function FbiUnlockModal({
  open,
  onClose,
  companyName,
}: {
  open: boolean;
  onClose: () => void;
  companyName: string;
}) {
  const playedRef = useRef(false);
  useEffect(() => {
    if (!open || playedRef.current || isMuted()) return;
    playedRef.current = true;
    try {
      new Audio("/sfx/fbi-investigation.mp3").play().catch(() => {});
    } catch {
      /* audio optional */
    }
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.72)" }}
      role="dialog"
      aria-modal="true"
      aria-label="FBI file opened"
    >
      <div
        className="relative max-w-md w-full mx-4 animate-event-in"
        style={{
          background: "var(--paper)",
          border: "2px solid var(--alarm)",
          padding: "28px 26px 22px",
          boxShadow: "0 0 0 6px rgba(255,90,71,0.12)",
        }}
      >
        <button
          type="button"
          aria-label="dismiss"
          onClick={onClose}
          className="absolute font-mono"
          style={{
            top: 8,
            right: 10,
            fontSize: 18,
            color: "var(--soft)",
            background: "none",
            border: "none",
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
        <div
          className="font-mono uppercase"
          style={{
            color: "var(--alarm)",
            fontSize: 11,
            letterSpacing: "0.14em",
            transform: "rotate(-4deg)",
            border: "1.6px solid var(--alarm)",
            display: "inline-block",
            padding: "3px 8px",
            marginBottom: 14,
          }}
        >
          FILE OPENED
        </div>
        <div className="font-body" style={{ fontSize: 20, lineHeight: 1.25 }}>
          The Bureau is now aware of {companyName}.
        </div>
        <div
          className="font-body mt-3"
          style={{ fontSize: 13, color: "var(--soft)", lineHeight: 1.5 }}
        >
          Somewhere in a field office, an agent just created a folder with
          your company&apos;s name on it. They read everything. They are very
          patient. A new tab has been unlocked in your feed.
        </div>
        <div
          className="font-mono mt-4 uppercase"
          style={{ fontSize: 10, color: "var(--soft)", letterSpacing: "0.1em" }}
        >
          FBI 🔓 · surveillance log now available
        </div>
      </div>
    </div>
  );
}

/** The FBI tab's pane content. */
export function FbiPane({
  stats,
  timeline,
}: {
  stats: Stats;
  timeline: TimelineEntry[];
}) {
  const awareness = stats.fbi_awareness ?? 0;
  const stage = fbiStage(awareness);
  const log = buildFbiLog(timeline, awareness);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4" style={{ color: "var(--x-text)" }}>
      <div
        className="font-mono uppercase"
        style={{ fontSize: 10, color: "var(--x-muted)", letterSpacing: "0.12em" }}
      >
        CASE FILE · SF FIELD OFFICE
      </div>
      <div className="font-mono mt-1" style={{ fontSize: 15, fontWeight: 700 }}>
        {stage.label}
      </div>

      {/* awareness meter */}
      <div className="mt-3" style={{ border: "1px solid var(--x-rule)", height: 10 }}>
        <div
          style={{
            width: `${Math.min(100, Math.max(0, awareness))}%`,
            height: "100%",
            background: awareness >= 86 ? "var(--alarm)" : awareness >= 50 ? "#f5b900" : "var(--x-muted)",
            transition: "width 600ms ease",
          }}
        />
      </div>
      <div
        className="font-mono mt-1"
        style={{ fontSize: 10, color: "var(--x-muted)" }}
      >
        awareness {awareness}/100 · next stage at{" "}
        {STAGES.find((s) => s.at > awareness)?.at ?? "—"}
      </div>

      {/* surveillance log */}
      <div className="mt-4 flex flex-col gap-3">
        {log.map((row, i) => (
          <div key={i} style={{ borderLeft: "2px solid var(--x-rule)", paddingLeft: 10 }}>
            <div className="font-mono" style={{ fontSize: 10, color: "var(--x-muted)" }}>
              {row.day < 0 ? "NOW" : `DAY ${String(row.day).padStart(3, "0")}`}
            </div>
            <div className="font-body" style={{ fontSize: 13, lineHeight: 1.35 }}>
              {row.text}
            </div>
            <div className="font-body" style={{ fontSize: 11, color: "var(--x-muted)" }}>
              {row.note}
            </div>
          </div>
        ))}
        {log.length <= 1 && (
          <div className="font-body" style={{ fontSize: 12, color: "var(--x-muted)" }}>
            The file is thin. For now.
          </div>
        )}
      </div>
    </div>
  );
}
