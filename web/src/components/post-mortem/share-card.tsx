"use client";

import { forwardRef } from "react";
import type { EndgameSnapshot } from "@/lib/mock-endgame";

/** the canonical card dimensions — Twitter mobile-optimal portrait, 4:5 ratio */
export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1350;

type Props = {
  endgame: EndgameSnapshot;
  /** the run id used in the footer permalink */
  runId: string;
  /** pseudorandom volume number to print in the masthead — defaults to a deterministic
   *  hash of the run id so the volume is stable across re-renders. */
  volumeNumber?: number;
};

function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/** Compact USD: $4.0B, $312M, $47.3M, $0 */
function formatUSD(n: number): string {
  if (n <= 0) return "$0";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

/** Day count → "DAYS · 287" — already days, but the timeline uses "turns" elsewhere.
 *  We surface days because that's what the spec asked for. */
function formatDays(stats: { day: number }): string {
  return String(stats.day);
}

function formatDate(iso: string): string {
  // "Apr 28, 2026" — Forbes-ish, ASCII safe.
  try {
    const d = new Date(iso);
    return d
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  } catch {
    return iso;
  }
}

/**
 * The shareable post-mortem trading card.
 *
 * Renders at a fixed 1080×1350 internally. To fit it into a responsive layout
 * wrap the rendered card in a container with `transform: scale(...)` — never
 * change the inner dimensions. The PNG export depends on this fixed canvas.
 */
export const ShareCard = forwardRef<HTMLDivElement, Props>(function ShareCard(
  { endgame, runId, volumeNumber },
  ref,
) {
  const vol = volumeNumber ?? (hash(runId) % 89) + 1; // 1..89, stable per run

  // stamp rotation, deterministic per run
  const rotSeed = hash(`${runId}::stamp`);
  const stampRot = -4 + ((rotSeed % 110) / 10); // -4 .. +6.9 deg

  const fbiAlarm = endgame.final_stats.fbi_awareness >= 50;
  const peakDisplay = formatUSD(endgame.peak_stats.valuation);

  return (
    <div
      ref={ref}
      data-testid="share-card"
      className="font-body text-ink bg-paper relative"
      style={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        // outer alarm border — 6px alarm stripe
        border: "6px solid var(--alarm)",
        boxSizing: "border-box",
        overflow: "hidden",
        // cards never round
        borderRadius: 0,
      }}
    >
      {/* ── 1. TOP HEADER STRIP ─────────────────────────────────── */}
      <div
        className="font-mono uppercase"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "14px 28px",
          borderBottom: "1.4px solid var(--ink)",
          background: "var(--paper)",
          fontSize: 11,
          letterSpacing: "0.08em",
          fontWeight: 700,
        }}
      >
        <span style={{ color: "var(--alarm)" }}>
          FORBES 30 UNDER 30 · CURSED EDITION · VOL.{" "}
          {String(vol).padStart(3, "0")}
        </span>
        <span className="font-mono" style={{ color: "var(--soft)", fontWeight: 400 }}>
          30u30.fail/run/{runId}
        </span>
      </div>

      {/* inner padded body */}
      <div
        style={{
          padding: "36px 56px 28px 56px",
          height: CARD_HEIGHT - 12 /* outer alarm border */ - 96 /* footer */ - 44 /* header */,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── 2. BIG COMPANY NAME ──────────────────────────────── */}
        <div
          className="font-body"
          style={{
            textAlign: "center",
            fontSize: clampHeadline(endgame.company_name),
            lineHeight: 1.0,
            letterSpacing: "-0.005em",
            color: "var(--ink)",
            // truncate one line if it overflows
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {endgame.company_name}
        </div>

        {/* ── 3. ONE-LINER SUBTITLE ────────────────────────────── */}
        <div
          className="font-body italic"
          style={{
            textAlign: "center",
            fontSize: 18,
            lineHeight: 1.35,
            color: "var(--soft)",
            marginTop: 14,
            // 2-line clamp
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          &ldquo;{endgame.company_one_liner}&rdquo;
        </div>

        {/* ── 4 + 5. MUGSHOT ZONE + STAMP ──────────────────────── */}
        <div
          style={{
            position: "relative",
            margin: "32px auto 0 auto",
            width: 380,
          }}
        >
          {/* avatar tile */}
          <div
            style={{
              width: 380,
              height: 380,
              border: "1.4px solid var(--ink)",
              background: "var(--paper-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: 220,
                fontWeight: 700,
                lineHeight: 1,
                color: "var(--ink)",
                letterSpacing: "-0.04em",
              }}
            >
              {endgame.founder_initials}
            </span>
          </div>

          {/* founder caption */}
          <div
            className="font-mono uppercase"
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 12,
              letterSpacing: "0.12em",
              color: "var(--ink-2)",
            }}
          >
            [{endgame.founder_name}]
          </div>

          {/* verdict stamp — partially over the avatar's bottom-right */}
          <div
            className="stamp"
            style={{
              position: "absolute",
              right: -18,
              bottom: 38, /* sits just above the founder caption,
                             overlapping the avatar's bottom-right corner */
              transform: `rotate(${stampRot.toFixed(2)}deg)`,
              padding: "6px 12px",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "var(--paper)",
              border: "2px solid var(--alarm)",
              color: "var(--alarm)",
            }}
          >
            {endgame.stamp_text}
          </div>
        </div>

        {/* ── 6. BLOOMBERG 2x2 STATS RIBBON ────────────────────── */}
        <div
          style={{
            marginTop: 36,
            border: "1.4px solid var(--ink)",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
          }}
        >
          <StatCell label="PEAK VAL" value={peakDisplay} />
          <StatCell
            label="DAYS"
            value={formatDays(endgame.final_stats)}
            borderLeft
          />
          <StatCell
            label="FRAUD SCORE"
            value={String(endgame.final_stats.fraud_score)}
            borderTop
          />
          <StatCell
            label="FBI AWARE"
            value={String(endgame.final_stats.fbi_awareness)}
            borderLeft
            borderTop
            alarm={fbiAlarm}
          />
        </div>

        {/* ── 7. THE MOMENT EVERYTHING WENT WRONG ──────────────── */}
        <div style={{ marginTop: 30 }}>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--alarm)",
              fontWeight: 700,
            }}
          >
            THE MOMENT EVERYTHING WENT WRONG · DAY{" "}
            {dayForTurn(endgame.turn_when_things_went_wrong)}
          </div>
          <div
            style={{
              borderLeft: "1.4px solid var(--ink)",
              paddingLeft: 14,
              marginTop: 8,
            }}
          >
            <div
              className="font-body"
              style={{
                fontSize: 19,
                lineHeight: 1.4,
                color: "var(--ink)",
              }}
            >
              {endgame.pivotal_event_outcome}
            </div>
          </div>
        </div>

        {/* ── 8. TAGLINE ────────────────────────────────────────── */}
        <div
          className="font-body italic"
          style={{
            marginTop: "auto",
            paddingTop: 28,
            textAlign: "center",
            fontSize: 22,
            lineHeight: 1.3,
            color: "var(--ink)",
          }}
        >
          {endgame.tagline}
        </div>
      </div>

      {/* ── 9. FOOTER STRIP ──────────────────────────────────── */}
      <div
        className="font-mono uppercase"
        style={{
          position: "absolute",
          left: 6,
          right: 6,
          bottom: 6,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          borderTop: "1.4px solid var(--ink)",
          background: "var(--paper)",
          fontSize: 11,
          letterSpacing: "0.08em",
          color: "var(--soft)",
        }}
      >
        <span>
          30u30.fail · spectator simulator ·{" "}
          <span style={{ color: "var(--ink-2)" }}>
            {formatDate(endgame.ended_at)}
          </span>
        </span>
        <span style={{ color: "var(--alarm)", fontWeight: 700 }}>
          VIEW FULL RUN →
        </span>
      </div>
    </div>
  );
});

/** Headline auto-sizer: shorter names go bigger, long names cap at the floor. */
function clampHeadline(name: string): number {
  const n = name.length;
  if (n <= 8) return 84;
  if (n <= 12) return 72;
  if (n <= 18) return 60;
  if (n <= 26) return 50;
  return 44;
}

/** Maps the pivotal "turn" → an in-narrative day index for the card label. */
function dayForTurn(turn: number): number {
  // mock-data's turn 6 lands on day 67, so the per-turn cadence is ~11 days.
  // we keep this strictly cosmetic — the long-read carries the real numbers.
  return Math.max(1, Math.round(turn * 11.2));
}

function StatCell({
  label,
  value,
  borderLeft,
  borderTop,
  alarm,
}: {
  label: string;
  value: string;
  borderLeft?: boolean;
  borderTop?: boolean;
  alarm?: boolean;
}) {
  return (
    <div
      style={{
        padding: "20px 22px",
        borderLeft: borderLeft ? "1.2px solid var(--ink)" : "none",
        borderTop: borderTop ? "1.2px solid var(--ink)" : "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 6,
        minHeight: 90,
      }}
    >
      <div
        className="font-mono uppercase"
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--soft)",
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        className="font-mono"
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: alarm ? "var(--alarm)" : "var(--ink)",
        }}
      >
        {value}
      </div>
    </div>
  );
}
