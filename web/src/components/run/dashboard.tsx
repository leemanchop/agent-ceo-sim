"use client";

import { useEffect, useRef, useState } from "react";
import type { Stats, StatDeltas } from "@/lib/types";
import { cn, formatMoney } from "@/lib/utils";

type Cell = {
  key: keyof Stats;
  label: string;
  format: (v: number, stats: Stats) => string;
  /** when true, value renders in alarm color */
  isNegative?: (v: number, stats: Stats) => boolean;
};

const CELLS: Cell[] = [
  { key: "day", label: "DAY", format: (v) => `${v}` },
  { key: "valuation", label: "VALUATION", format: (v) => formatMoney(v) },
  { key: "revenue", label: "REVENUE", format: (v) => formatMoney(v) },
  {
    key: "burn",
    label: "BURN / MO",
    format: (v) => formatMoney(v),
    isNegative: () => true,
  },
  {
    // synthetic — derived from cash/burn
    key: "cash",
    label: "RUNWAY",
    format: (_v, stats) => {
      const months = stats.burn > 0 ? stats.cash / stats.burn : 999;
      return `${months.toFixed(1)} mo`;
    },
    isNegative: (_v, stats) => {
      const months = stats.burn > 0 ? stats.cash / stats.burn : 999;
      return months < 6;
    },
  },
  { key: "headcount", label: "HEADCOUNT", format: (v) => `${v}` },
  {
    key: "fbi_awareness",
    label: "FBI AWARE.",
    format: (v) => `${v}`,
    isNegative: (v) => v >= 25,
  },
];

export function Dashboard({
  stats,
  deltas,
  speed = 1,
}: {
  stats: Stats;
  deltas: StatDeltas;
  speed?: 1 | 2 | 4;
}) {
  return (
    <div
      className="grid grid-cols-7 border-b border-ink"
      style={{ background: "var(--paper)" }}
    >
      {CELLS.map((cell, i) => (
        <StatCell
          key={`${cell.key}-${i}`}
          label={cell.label}
          value={stats[cell.key]}
          stats={stats}
          delta={deltas[cell.key] ?? 0}
          format={cell.format}
          isNegative={cell.isNegative}
          last={i === CELLS.length - 1}
          speed={speed}
        />
      ))}
    </div>
  );
}

function StatCell({
  label,
  value,
  stats,
  delta,
  format,
  isNegative,
  last,
  speed,
}: {
  label: string;
  value: number;
  stats: Stats;
  delta: number;
  format: (v: number, stats: Stats) => string;
  isNegative?: (v: number, stats: Stats) => boolean;
  last: boolean;
  speed: 1 | 2 | 4;
}) {
  const [flash, setFlash] = useState<"neg" | null>(null);
  const prev = useRef(value);
  const flashMs = Math.max(120, Math.round(600 / speed));
  useEffect(() => {
    if (value !== prev.current) {
      // only flash on big negative deltas (>10%)
      const pct = prev.current !== 0 ? Math.abs((value - prev.current) / prev.current) : 0;
      if (value < prev.current && pct > 0.1) {
        setFlash("neg");
        const t = setTimeout(() => setFlash(null), flashMs);
        prev.current = value;
        return () => clearTimeout(t);
      }
      prev.current = value;
    }
  }, [value, flashMs]);

  const negative = isNegative?.(value, stats) ?? false;
  // direction glyph for recent moves
  const glyph =
    delta > 0
      ? Math.abs(delta) > Math.abs(value) * 0.05
        ? " ▲▲"
        : " ▲"
      : delta < 0
      ? " ▼"
      : "";

  return (
    <div
      className={cn(
        "flex flex-col justify-center px-3 py-2 min-w-0",
        !last && "border-r border-ink"
      )}
      style={{ borderRightWidth: !last ? "1.2px" : 0 }}
    >
      <div
        className="font-mono uppercase tracking-wider text-soft"
        style={{ fontSize: 9, letterSpacing: "0.08em" }}
      >
        {label}
      </div>
      <div
        className={cn(
          "font-mono tabular-nums truncate font-medium",
          flash === "neg" && "animate-flash-neg"
        )}
        style={{
          fontSize: 11,
          marginTop: 2,
          color: negative ? "var(--alarm)" : "var(--ink)",
          ["--flash-ms" as string]: `${flashMs}ms`,
        } as React.CSSProperties}
      >
        {format(value, stats)}
        <span style={{ color: negative ? "var(--alarm)" : "var(--ink-2)" }}>
          {glyph}
        </span>
      </div>
    </div>
  );
}
