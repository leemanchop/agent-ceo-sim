"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { Achievement, AchievementRarity } from "@/lib/types";
import type { ToastEntry } from "@/lib/use-achievement-queue";

/**
 * Achievement unlock toast + modal. Pinned to the bottom-right of the run
 * page, above the controls strip. Click expands into a brief details modal
 * with a share button.
 */

const RARITY_TONE: Record<AchievementRarity, "ink" | "alarm"> = {
  common: "ink",
  uncommon: "ink",
  rare: "ink",
  legendary: "alarm",
  hidden: "alarm",
};

function StampBadge({
  hint,
  rarity,
  size = 48,
}: {
  hint: string;
  rarity: AchievementRarity;
  size?: number;
}) {
  // truncate icon hint to 5 char so it fits
  const text = hint.length > 5 ? hint.slice(0, 5) : hint;
  const isAlarm = RARITY_TONE[rarity] === "alarm";
  const fontSize = Math.max(8, Math.round(size / 4.5));
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        border: `2px solid ${isAlarm ? "var(--alarm)" : "var(--ink)"}`,
        color: isAlarm ? "var(--alarm)" : "var(--ink)",
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        transform: "rotate(-3deg)",
        background: "transparent",
        whiteSpace: "nowrap",
        padding: 2,
      }}
    >
      {text}
    </div>
  );
}

function AchievementToast({
  entry,
  onDismiss,
  onOpen,
}: {
  entry: ToastEntry;
  onDismiss: (uid: string) => void;
  onOpen: (a: Achievement) => void;
}) {
  const { achievement, uid } = entry;
  const [leaving, setLeaving] = useState(false);
  const isLoud =
    achievement.rarity === "legendary" || achievement.rarity === "hidden";

  // schedule slide-out shortly before queue prunes (5000ms TTL → leave at 4750)
  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 4750);
    return () => clearTimeout(t);
  }, []);

  const stripeStyle: CSSProperties = isLoud
    ? { background: "var(--alarm)", color: "var(--paper)" }
    : { background: "transparent", color: "var(--alarm)" };

  return (
    <div
      role="status"
      onClick={() => onOpen(achievement)}
      className={leaving ? "animate-toast-out" : "animate-toast-in"}
      style={{
        width: 340,
        maxWidth: "calc(100vw - 24px)",
        background: "var(--paper)",
        border: `1.4px solid ${isLoud ? "var(--alarm)" : "var(--ink)"}`,
        borderRadius: 0,
        cursor: "pointer",
        pointerEvents: "auto",
      }}
    >
      {/* Top stripe */}
      <div
        className="flex items-center justify-between"
        style={{
          ...stripeStyle,
          padding: "3px 8px",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontWeight: 700,
          borderBottom: `1.4px solid ${isLoud ? "var(--alarm)" : "var(--ink)"}`,
        }}
      >
        <span>ACHIEVEMENT UNLOCKED · {achievement.rarity}</span>
        <button
          aria-label="dismiss"
          onClick={(e) => {
            e.stopPropagation();
            setLeaving(true);
            // give the slide-out animation a moment before we drop it
            setTimeout(() => onDismiss(uid), 240);
          }}
          style={{
            background: "transparent",
            border: 0,
            color: "inherit",
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            lineHeight: 1,
            padding: 0,
            marginLeft: 8,
          }}
        >
          ×
        </button>
      </div>

      {/* Body */}
      <div className="flex gap-2" style={{ padding: 10 }}>
        <div className="flex-1 min-w-0">
          <div
            className="font-body"
            style={{
              fontSize: 16,
              lineHeight: 1.15,
              color: "var(--ink)",
              marginBottom: 4,
              wordBreak: "break-word",
            }}
          >
            {achievement.name}
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 11,
              lineHeight: 1.3,
              color: "var(--ink-2)",
              marginBottom: 6,
            }}
          >
            {achievement.description}
          </div>
          <div
            className="font-mono italic"
            style={{
              fontSize: 11,
              lineHeight: 1.3,
              color: "var(--soft)",
            }}
          >
            “{achievement.share_text}”
          </div>
        </div>
        <StampBadge hint={achievement.icon_hint} rarity={achievement.rarity} />
      </div>
    </div>
  );
}

export function AchievementToastStack({
  toasts,
  onDismiss,
  onOpen,
}: {
  toasts: ToastEntry[];
  onDismiss: (uid: string) => void;
  onOpen: (a: Achievement) => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        right: 12,
        // sit above the bottom controls strip (~64-88px)
        bottom: 96,
        zIndex: 30,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <AchievementToast
          key={t.uid}
          entry={t}
          onDismiss={onDismiss}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export function AchievementModal({
  achievement,
  runId,
  onClose,
}: {
  achievement: Achievement | null;
  runId: string;
  onClose: () => void;
}) {
  if (!achievement) return null;
  const isLoud =
    achievement.rarity === "legendary" || achievement.rarity === "hidden";
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `${achievement.share_text}\n\nhttps://30u30.fail/run/${runId}`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 8, 5, 0.78)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-modal-in"
        style={{
          width: "min(420px, 100%)",
          background: "var(--paper)",
          border: `1.6px solid ${isLoud ? "var(--alarm)" : "var(--ink)"}`,
          borderRadius: 0,
        }}
      >
        <div
          className="flex items-center justify-between"
          style={{
            padding: "6px 10px",
            background: isLoud ? "var(--alarm)" : "transparent",
            color: isLoud ? "var(--paper)" : "var(--alarm)",
            fontFamily: "var(--font-mono)",
            textTransform: "uppercase",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: "0.1em",
            borderBottom: `1.4px solid ${isLoud ? "var(--alarm)" : "var(--ink)"}`,
          }}
        >
          <span>ACHIEVEMENT UNLOCKED · {achievement.rarity}</span>
          <button
            aria-label="close"
            onClick={onClose}
            style={{
              background: "transparent",
              border: 0,
              color: "inherit",
              cursor: "pointer",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            padding: 18,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 12,
          }}
        >
          <StampBadge
            hint={achievement.icon_hint}
            rarity={achievement.rarity}
            size={96}
          />
          <div
            className="font-body"
            style={{
              fontSize: 22,
              lineHeight: 1.1,
              color: "var(--ink)",
            }}
          >
            {achievement.name}
          </div>
          <div
            className="tag"
            style={{ fontSize: 10, color: "var(--soft)" }}
          >
            {achievement.id} · {achievement.category}
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 12,
              lineHeight: 1.4,
              color: "var(--ink-2)",
            }}
          >
            {achievement.description}
          </div>
          <div
            className="font-mono italic"
            style={{
              fontSize: 11,
              lineHeight: 1.4,
              color: "var(--soft)",
              borderTop: "1px dashed var(--soft)",
              paddingTop: 10,
              width: "100%",
            }}
          >
            “{achievement.share_text}”
          </div>
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="brutalist-btn"
            style={{ marginTop: 4, fontSize: 12 }}
          >
            SHARE TWEET
          </a>
        </div>
      </div>
    </div>
  );
}
