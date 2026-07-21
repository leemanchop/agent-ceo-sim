"use client";

import { useState } from "react";
import type { FeedEntry } from "@/lib/types";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "feed", label: "Feed", active: true, locked: false },
  { id: "fbi", label: "FBI 🔒", active: false, locked: true },
] as const;

export function LiveFeed({
  entries,
  speed = 1,
}: {
  entries: FeedEntry[];
  speed?: 1 | 2 | 4;
}) {
  const [activeTab, setActiveTab] = useState<string>("feed");

  // The cockpit feeds `entries` incrementally — in live mode SSE pushes one
  // at a time; in mock mode the canned 30-entry list arrives at once and we
  // trickle to simulate momentum. Either way, render the ENTIRE list (most
  // recent first; assume parent already orders that way).
  // Trickle only matters in mock mode; in live mode, entries just renders
  // as it grows. Cap at the most recent 200 to keep the DOM bounded.
  const visible = entries.slice(0, 200);

  // No-op for `speed` here — kept in props for future per-feed pacing knobs.
  void speed;

  return (
    <div
      className="flex flex-col h-full font-x"
      style={{ background: "var(--x-bg)", color: "var(--x-text)" }}
    >
      {/* tabs */}
      <div
        className="flex items-center gap-0 border-b"
        style={{ borderColor: "var(--x-rule)" }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            disabled={t.locked}
            onClick={() => !t.locked && setActiveTab(t.id)}
            className={cn(
              "flex-1 h-10 font-mono uppercase tracking-wider transition-colors relative",
              t.locked
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:bg-white/5"
            )}
            style={{ fontSize: 11, color: t.locked ? "var(--x-muted)" : (activeTab === t.id ? "var(--x-text)" : "var(--x-muted)") }}
          >
            {t.label}
            {activeTab === t.id && !t.locked && (
              <span
                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                style={{
                  width: 36,
                  height: 3,
                  borderRadius: 999,
                  background: "var(--x-blue)",
                }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <ol>
          {visible.map((e) => (
            <FeedItem key={e.id} entry={e} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function FeedItem({ entry }: { entry: FeedEntry }) {
  if (entry.source === "slack") return <SlackRow entry={entry} />;
  if (entry.source === "glassdoor") return <GlassdoorRow entry={entry} />;
  return <TweetRow entry={entry} />;
}

function TweetRow({ entry }: { entry: FeedEntry }) {
  const verifiedColor =
    entry.verified === "gold"
      ? "var(--x-gold)"
      : entry.verified === "blue" || entry.verified === true
      ? "var(--x-blue)"
      : null;

  const displayName = entry.name ?? entry.publication ?? entry.handle ?? "—";
  const handle = entry.handle ?? (entry.publication ? `@${entry.publication.replace(/\s+/g, "")}` : "");

  return (
    <li
      className="animate-feed-in flex gap-3 px-3 py-3 hover:bg-white/[0.03] transition-colors"
      style={{ borderBottom: "1px solid var(--x-rule)" }}
    >
      <div
        className="shrink-0 rounded-full flex items-center justify-center font-bold"
        style={{
          width: 32,
          height: 32,
          background: entry.avatarColor || "var(--paper-2)",
          color: "#fff",
          fontSize: 13,
        }}
      >
        {entry.avatarInitial ?? displayName[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 flex-wrap" style={{ fontSize: 13, lineHeight: 1.2 }}>
          <span className="font-bold truncate" style={{ color: "var(--x-text)" }}>
            {displayName}
          </span>
          {verifiedColor && (
            <span style={{ color: verifiedColor, fontSize: 12 }}>✓</span>
          )}
          <span className="truncate" style={{ color: "var(--x-muted)", fontSize: 13 }}>
            {handle}
          </span>
          <span style={{ color: "var(--x-muted)", fontSize: 13 }}>·</span>
          <span style={{ color: "var(--x-muted)", fontSize: 13 }}>
            {entry.timestamp}
          </span>
        </div>
        <div
          className="mt-0.5"
          style={{ color: "var(--x-text)", fontSize: 13, lineHeight: 1.35 }}
        >
          {entry.body}
        </div>
        <div
          className="mt-1.5 flex items-center gap-5"
          style={{ color: "var(--x-muted)", fontSize: 11 }}
        >
          {entry.replies !== undefined && (
            <span>💬 {fmt(entry.replies)}</span>
          )}
          {entry.retweets !== undefined && (
            <span>↻ {fmt(entry.retweets)}</span>
          )}
          {entry.likes !== undefined && (
            <span>♥ {fmt(entry.likes)}</span>
          )}
          <span>↗</span>
        </div>
      </div>
    </li>
  );
}

function SlackRow({ entry }: { entry: FeedEntry }) {
  return (
    <li
      className="animate-feed-in px-3 py-3"
      style={{
        borderBottom: "1px solid var(--x-rule)",
        background: "var(--x-bg)",
      }}
    >
      <div
        style={{
          background: "var(--paper-2)",
          border: "1px solid var(--x-rule)",
          padding: "8px 10px",
        }}
      >
        <div className="flex items-center gap-2 font-mono" style={{ fontSize: 11 }}>
          <span
            style={{
              background: "#4a154b",
              color: "#fff",
              width: 16,
              height: 16,
              fontSize: 10,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2,
            }}
          >
            #
          </span>
          <span style={{ color: "var(--x-text)", fontWeight: 700 }}>
            {entry.channel}
          </span>
          <span style={{ color: "var(--x-muted)" }}>· slack</span>
          <span className="ml-auto" style={{ color: "var(--x-muted)" }}>
            {entry.timestamp}
          </span>
        </div>
        <div className="mt-1" style={{ fontSize: 13, color: "var(--x-text)", lineHeight: 1.35 }}>
          {entry.body}
        </div>
      </div>
    </li>
  );
}

function GlassdoorRow({ entry }: { entry: FeedEntry }) {
  return (
    <li
      className="animate-feed-in px-3 py-3"
      style={{ borderBottom: "1px solid var(--x-rule)" }}
    >
      <div className="flex items-center gap-2" style={{ fontSize: 11 }}>
        <span
          className="font-bold font-mono"
          style={{ color: "var(--x-text)" }}
        >
          glassdoor
        </span>
        {entry.rating !== undefined && <Stars rating={entry.rating} />}
        <span className="ml-auto" style={{ color: "var(--x-muted)" }}>
          {entry.timestamp}
        </span>
      </div>
      <div className="mt-1" style={{ fontSize: 13, color: "var(--x-text)", lineHeight: 1.35 }}>
        {entry.body}
      </div>
    </li>
  );
}

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            style={{ width: 11, height: 11 }}
            fill={filled ? "var(--x-gold)" : "transparent"}
            stroke={filled ? "var(--x-gold)" : "var(--x-muted)"}
          />
        );
      })}
    </span>
  );
}
