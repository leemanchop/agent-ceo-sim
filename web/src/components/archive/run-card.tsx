"use client";

import Link from "next/link";
import type { ArchiveRun, EndgameArchetype } from "@/lib/mock-archive";

const ARCHETYPE_LABEL: Record<EndgameArchetype, string> = {
  "PRISON": "PRISON",
  "FLED-DUBAI": "FLED · DXB",
  "FAILED-UP": "FAILED-UP",
  "CULTURAL-AFTERLIFE": "CULT-AFTER",
  "GENUINE-SUCCESS": "SUCCESS",
  "CURSED-TOPANGA": "CURSED-TPG",
};

function formatUSD(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function RunCard({ run }: { run: ArchiveRun }) {
  // deterministic stamp rotation seeded by id
  const seed = run.id.charCodeAt(0) + run.id.charCodeAt(run.id.length - 1);
  const rot = (((seed % 7) - 3) * 0.6).toFixed(1); // -1.8 .. +1.8 deg

  return (
    <div
      className="relative flex flex-col bg-paper"
      style={{
        border: "1.4px solid var(--ink)",
        padding: 16,
        minHeight: 260,
      }}
    >
      {/* stamp */}
      <div
        className="stamp absolute"
        style={{
          top: -10,
          right: 14,
          background: "var(--paper)",
          fontSize: 10,
          transform: `rotate(${rot}deg)`,
        }}
      >
        END · {ARCHETYPE_LABEL[run.endgame_archetype]}
      </div>

      {/* company — biggest line */}
      <div
        className="font-body"
        style={{
          fontSize: 24,
          lineHeight: 1.05,
          letterSpacing: "-0.01em",
          marginTop: 4,
          paddingRight: 84,
        }}
      >
        {run.company_name}
      </div>

      <div
        className="font-mono mt-1 uppercase tracking-wider"
        style={{ fontSize: 10, color: "var(--soft)" }}
      >
        by {run.founder} · {run.industry}
      </div>

      {/* tagline */}
      <div
        className="font-body italic mt-3"
        style={{
          fontSize: 13,
          lineHeight: 1.4,
          color: "var(--ink-2)",
          flex: 1,
        }}
      >
        &ldquo;{run.tagline}&rdquo;
      </div>

      {/* dashed rule */}
      <div
        style={{
          borderTop: "1px dashed var(--ink)",
          marginTop: 14,
          marginBottom: 10,
          opacity: 0.5,
        }}
      />

      {/* stats row */}
      <div
        className="font-mono flex items-end justify-between"
        style={{ fontSize: 11 }}
      >
        <div>
          <div className="tag">PEAK VAL</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--ink)",
              letterSpacing: "0.02em",
            }}
          >
            {formatUSD(run.peak_valuation)}
          </div>
        </div>
        <div>
          <div className="tag">TURNS</div>
          <div
            style={{ fontSize: 14, fontWeight: 700, color: "var(--ink)" }}
          >
            {run.turns_elapsed}
          </div>
        </div>
        <div>
          <div className="tag">DATE</div>
          <div
            style={{ fontSize: 12, color: "var(--ink-2)" }}
          >
            {run.date}
          </div>
        </div>
      </div>

      {/* optional attribution (public archive only) */}
      {run.attribution && (
        <div
          className="font-mono mt-2"
          style={{ fontSize: 10, color: "var(--soft)" }}
        >
          {run.attribution}
        </div>
      )}

      {/* CTA */}
      <div className="mt-4 flex items-center gap-2">
        <Link
          href={`/run/${run.id}?replay=1`}
          className="pill solid"
          style={{
            cursor: "pointer",
            fontSize: 11,
            padding: "3px 12px",
            textDecoration: "none",
          }}
        >
          ▶ REPLAY
        </Link>
        <Link
          href={`/run/${run.id}`}
          className="pill"
          style={{
            cursor: "pointer",
            fontSize: 10,
            padding: "3px 10px",
            textDecoration: "none",
            color: "var(--soft)",
          }}
        >
          PERMALINK
        </Link>
      </div>
    </div>
  );
}
