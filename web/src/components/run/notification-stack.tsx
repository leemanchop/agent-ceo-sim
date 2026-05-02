"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type {
  NotificationKind,
  NotificationSeverity,
  SimNotification,
} from "@/lib/types";
import type { NotificationEntry } from "@/lib/use-notification-queue";

/**
 * Notification stack — pinned to the TOP-RIGHT of the run page. Distinct from
 * achievement toasts (bottom-right, z-30). Sits at z-25; the right rail (X
 * feed) is to the LEFT of this column.
 */

const KIND_GLYPH: Record<NotificationKind, string> = {
  slack_dm: "💬",
  slack_thread: "#",
  press_tip: "📰",
  regulator: "⚖",
  stat_threshold: "▲",
  calendar: "📅",
  leak: "🔓",
  system: "▣",
  fbi: "🔒 → 🔓",
};

const SOUND_SRC: Record<NonNullable<SimNotification["sound"]>, string> = {
  ding: "/sfx/slack-ping.mp3",
  drone: "/sfx/note-low.mp3",
  stamp: "/sfx/stamp.wav",
  cash: "/sfx/chime-cash.mp3",
  glass: "/sfx/glass.mp3",
  fbi_unlock: "/sfx/fbi-investigation.mp3",
  fbi_raid: "/sfx/siren-tasteful.mp3",
  fanfare: "/sfx/fanfare-cursed.wav",
  tick: "/sfx/tick.wav",
};

function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem("aces:muted") !== "0";
  } catch {
    return true;
  }
}

function severityBorder(sev: NotificationSeverity): CSSProperties {
  if (sev === "alarm") {
    return {
      border: "1.6px solid var(--alarm)",
      background: "var(--alarm-soft)",
    };
  }
  if (sev === "warn") {
    return {
      border: "1.4px solid var(--alarm)",
      background: "var(--paper)",
    };
  }
  return {
    border: "1.4px solid var(--ink)",
    background: "var(--paper)",
  };
}

function NotificationCard({
  entry,
  onDismiss,
}: {
  entry: NotificationEntry;
  onDismiss: (uid: string) => void;
}) {
  const { notification: n, uid } = entry;
  const [leaving, setLeaving] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ttl = n.ttl_ms ?? 6000;
  const isFbiUnlock = n.kind === "fbi" && n.severity === "alarm";

  // schedule slide-out shortly before queue prunes
  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), Math.max(0, ttl - 250));
    return () => clearTimeout(t);
  }, [ttl]);

  // play sound on mount if unmuted + sound set
  useEffect(() => {
    if (!n.sound) return;
    if (isMuted()) return;
    const a = audioRef.current;
    if (!a) return;
    // gracefully fail when missing
    a.play().catch(() => {});
  }, [n.sound]);

  const baseStyle: CSSProperties = isFbiUnlock
    ? {
        border: "2px solid var(--alarm)",
        background: "var(--alarm)",
        color: "var(--paper)",
      }
    : severityBorder(n.severity);

  const stripeColor =
    n.severity === "info" ? "var(--soft)" : "var(--alarm)";

  return (
    <div
      role="status"
      className={leaving ? "animate-notif-out" : "animate-notif-in"}
      style={{
        width: 320,
        maxWidth: "80vw",
        borderRadius: 0,
        pointerEvents: "auto",
        ...baseStyle,
      }}
    >
      {/* Top stripe: kind glyph + source_label + ts + dismiss */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: "3px 8px",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: isFbiUnlock ? 700 : 600,
          color: isFbiUnlock ? "var(--paper)" : stripeColor,
          borderBottom: isFbiUnlock
            ? "1.4px solid var(--paper)"
            : `1px dashed ${stripeColor}`,
        }}
      >
        <span
          className="flex items-center gap-1.5 truncate"
          style={{ minWidth: 0 }}
        >
          <span style={{ fontSize: 11, lineHeight: 1 }}>
            {KIND_GLYPH[n.kind]}
          </span>
          <span className="truncate">{n.source_label}</span>
        </span>
        <span className="flex items-center gap-2 shrink-0">
          <span style={{ opacity: 0.85 }}>{n.ts}</span>
          <button
            aria-label="dismiss"
            onClick={(e) => {
              e.stopPropagation();
              setLeaving(true);
              setTimeout(() => onDismiss(uid), 200);
            }}
            style={{
              background: "transparent",
              border: 0,
              color: "inherit",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              lineHeight: 1,
              padding: 0,
              opacity: 0.7,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
          >
            ×
          </button>
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "8px 10px 10px" }}>
        <div
          className={isFbiUnlock ? "font-mono" : "font-body"}
          style={{
            fontSize: 13,
            lineHeight: 1.2,
            color: isFbiUnlock ? "var(--paper)" : "var(--ink)",
            fontWeight: isFbiUnlock ? 700 : 400,
            textTransform: isFbiUnlock ? "uppercase" : "none",
            marginBottom: 3,
            wordBreak: "break-word",
          }}
        >
          {n.title}
        </div>
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            lineHeight: 1.3,
            color: isFbiUnlock ? "var(--paper)" : "var(--ink-2)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {n.body}
        </div>
        {n.click_action && (
          <div style={{ marginTop: 8 }}>
            {n.click_action.href ? (
              <a
                href={n.click_action.href}
                className="pill"
                style={{
                  fontSize: 10,
                  cursor: "pointer",
                  borderColor: isFbiUnlock ? "var(--paper)" : undefined,
                  color: isFbiUnlock ? "var(--paper)" : undefined,
                }}
              >
                {n.click_action.label}
              </a>
            ) : (
              <span
                className="pill"
                style={{
                  fontSize: 10,
                  borderColor: isFbiUnlock ? "var(--paper)" : undefined,
                  color: isFbiUnlock ? "var(--paper)" : undefined,
                }}
              >
                {n.click_action.label}
              </span>
            )}
          </div>
        )}
      </div>

      {n.sound && (
        <audio
          ref={audioRef}
          src={SOUND_SRC[n.sound]}
          preload="auto"
          className="hidden"
        />
      )}
    </div>
  );
}

export function NotificationStack({
  notifications,
  onDismiss,
}: {
  notifications: NotificationEntry[];
  onDismiss: (uid: string) => void;
}) {
  // newest on top — render in reverse insertion order
  const ordered = [...notifications].reverse();
  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        // sit below any header strip; well above achievement toasts
        top: 56,
        zIndex: 25,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {ordered.map((t) => (
        <NotificationCard key={t.uid} entry={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
