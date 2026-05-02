/**
 * OG card renderer — edge-runtime safe.
 *
 * Renders the cursed-Forbes 1200×630 social-embed card via @vercel/og.
 * This is intentionally a separate component from the in-app 1080×1350
 * `<ShareCard />` (which uses Tailwind + Special Elite via next/font and
 * is rendered in the browser as React DOM). `@vercel/og` runs at the edge
 * and only understands inline styles + a small subset of CSS — so we keep
 * this file fully self-contained with no Tailwind classes, no CSS vars,
 * and no Node-only APIs.
 *
 * Two callers:
 *   - /run/{id}/card.png        (per-run; uses real archive lookup)
 *   - /og/default.png           (generic homepage fallback)
 */
import type { EndgameSnapshot } from "@/lib/mock-endgame";
import { MOCK_ENDGAME, STAMP_BY_ARCHETYPE } from "@/lib/mock-endgame";
import { getArchiveRun } from "@/lib/mock-archive";

/** Canonical OG dimensions — Twitter/Bluesky `summary_large_image`. */
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// design tokens — inlined as plain hex (no CSS vars in @vercel/og)
const PAPER = "#15130f";
const PAPER_2 = "#1f1c17";
const INK = "#f1ede4";
const INK_2 = "#cfc8b8";
const SOFT = "#7a7363";
const ALARM = "#ff5a47";

/** small fnv-1a hash, matches share-card.tsx so the volume is stable */
function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

function formatUSD(n: number): string {
  if (n <= 0) return "$0";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

/** map a long company name → a smaller font size, edge-safe (no measureText). */
function clampHeadline(name: string): number {
  const n = name.length;
  if (n <= 8) return 96;
  if (n <= 12) return 84;
  if (n <= 18) return 68;
  if (n <= 26) return 54;
  return 44;
}

/** Resolve a run id → endgame-shape data, with two layers of fallback so the
 *  OG image is never broken: archive run → MOCK_ENDGAME → generic NOT-FOUND. */
export function resolveOgData(id: string): {
  endgame: EndgameSnapshot;
  runId: string;
  found: boolean;
} {
  const archive = getArchiveRun(id);
  if (archive) {
    // Archive runs don't carry the full endgame snapshot — synthesize one.
    // We pick the final stat trajectory point and a peak (max valuation).
    const finalStats = archive.stat_trajectory[archive.stat_trajectory.length - 1];
    const peakStats = archive.stat_trajectory.reduce(
      (best, s) => (s.valuation > best.valuation ? s : best),
      archive.stat_trajectory[0],
    );
    const stamp = STAMP_BY_ARCHETYPE[mapArchetype(archive.endgame_archetype)] ?? "CASE STUDY";
    const founderInitials = archive.founder
      .split(/\s+/)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const endgame: EndgameSnapshot = {
      endgame_id: archive.endgame_id,
      archetype: mapArchetype(archive.endgame_archetype),
      title: `${archive.company_name} · ${archive.endgame_id}`,
      stamp_text: stamp,
      final_headline: archive.tagline,
      post_mortem_long_read: "",
      final_stats: finalStats,
      peak_stats: peakStats,
      turn_when_things_went_wrong: Math.max(1, Math.round(archive.turns_elapsed * 0.45)),
      pivotal_event_title: "",
      pivotal_event_outcome: archive.tagline,
      tagline: archive.tagline,
      ended_at: archive.date,
      company_name: archive.company_name,
      company_one_liner: archive.bible.one_liner,
      founder_name: archive.founder,
      founder_initials: founderInitials,
    };
    return { endgame, runId: id, found: true };
  }

  // mocked demo path — works for /run/demo or any unknown id where we still
  // want to ship a real card while the rest of the run system catches up.
  if (id === "demo") {
    return { endgame: MOCK_ENDGAME, runId: id, found: true };
  }

  // unknown id: fall back to MOCK_ENDGAME but mark as not-found so callers can
  // decide whether to render a NOT FOUND stamp instead.
  return { endgame: MOCK_ENDGAME, runId: id, found: false };
}

/** archive uses a slightly different archetype enum — collapse to endgame's. */
function mapArchetype(
  a:
    | "PRISON"
    | "FLED-DUBAI"
    | "FAILED-UP"
    | "CULTURAL-AFTERLIFE"
    | "GENUINE-SUCCESS"
    | "CURSED-TOPANGA",
): EndgameSnapshot["archetype"] {
  switch (a) {
    case "PRISON":
      return "PRISON";
    case "FLED-DUBAI":
      return "FLED";
    case "FAILED-UP":
      return "FAILUP";
    case "CULTURAL-AFTERLIFE":
      return "CULT";
    case "GENUINE-SUCCESS":
      return "SUCCESS";
    case "CURSED-TOPANGA":
      return "SECRET";
  }
}

/** ─── the per-run OG card JSX ────────────────────────────────────────────
 *  1200×630, single flex column with a header strip, a 2-column body,
 *  and a footer strip. All inline styles. */
export function RunOgCard({
  endgame,
  runId,
  notFound,
}: {
  endgame: EndgameSnapshot;
  runId: string;
  notFound?: boolean;
}) {
  const vol = (hash(runId) % 89) + 1;
  const rotSeed = hash(`${runId}::stamp`);
  const stampRot = -4 + (rotSeed % 110) / 10;
  const fbiAlarm = endgame.final_stats.fbi_awareness >= 50;
  const peakDisplay = formatUSD(endgame.peak_stats.valuation);
  const stampText = notFound ? "RUN NOT FOUND" : endgame.stamp_text;

  return (
    <div
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: PAPER,
        color: INK,
        fontFamily: "JetBrains Mono, monospace",
        // 6px alarm outer stroke
        border: `6px solid ${ALARM}`,
        boxSizing: "border-box",
      }}
    >
      {/* ── TOP STRIP ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: `1.4px solid ${INK}`,
          fontSize: 14,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        <div style={{ display: "flex", color: ALARM }}>
          FORBES · 30u30 · CURSED EDITION · VOL.{" "}
          {String(vol).padStart(3, "0")}
        </div>
        <div style={{ display: "flex", color: SOFT, fontWeight: 400 }}>
          30u30.fail/run/{runId}
        </div>
      </div>

      {/* ── BODY: 2 columns ───────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* LEFT: 480px — name, tagline, mugshot stamp */}
        <div
          style={{
            width: 480,
            display: "flex",
            flexDirection: "column",
            padding: "32px 28px 28px 36px",
            borderRight: `1.4px solid ${INK}`,
            boxSizing: "border-box",
          }}
        >
          {/* big company name */}
          <div
            style={{
              display: "flex",
              fontFamily: "serif",
              fontSize: clampHeadline(endgame.company_name),
              lineHeight: 1.0,
              letterSpacing: "-0.01em",
              color: INK,
              fontWeight: 700,
              wordBreak: "break-word",
            }}
          >
            {endgame.company_name}
          </div>

          {/* one-liner subtitle */}
          <div
            style={{
              display: "flex",
              fontFamily: "serif",
              fontSize: 17,
              lineHeight: 1.35,
              color: INK_2,
              fontStyle: "italic",
              marginTop: 16,
            }}
          >
            &ldquo;{endgame.company_one_liner}&rdquo;
          </div>

          {/* mugshot tile + stamp */}
          <div
            style={{
              position: "relative",
              marginTop: "auto",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                width: 200,
                height: 200,
                border: `1.4px solid ${INK}`,
                background: PAPER_2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontSize: 120,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: INK,
                  lineHeight: 1,
                }}
              >
                {endgame.founder_initials}
              </div>
            </div>

            {/* stamp — overlaps bottom-right of mugshot */}
            <div
              style={{
                position: "absolute",
                left: 130,
                bottom: 30,
                display: "flex",
                transform: `rotate(${stampRot.toFixed(2)}deg)`,
                padding: "8px 14px",
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.08em",
                background: PAPER,
                border: `2px solid ${ALARM}`,
                color: ALARM,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {stampText}
            </div>
          </div>

          {/* founder caption under the mugshot */}
          <div
            style={{
              display: "flex",
              marginTop: 12,
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: INK_2,
            }}
          >
            [{endgame.founder_name}]
          </div>
        </div>

        {/* RIGHT: ~720px — stats ribbon + blockquote + tagline */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "32px 36px 28px 32px",
            boxSizing: "border-box",
          }}
        >
          {/* 2x2 stats grid — flex-only since @vercel/og's grid is patchy */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              border: `1.4px solid ${INK}`,
            }}
          >
            <div style={{ display: "flex" }}>
              <StatCell label="PEAK VAL" value={peakDisplay} />
              <StatCell
                label="DAYS"
                value={String(endgame.final_stats.day)}
                borderLeft
              />
            </div>
            <div style={{ display: "flex", borderTop: `1.2px solid ${INK}` }}>
              <StatCell
                label="FRAUD SCORE"
                value={String(endgame.final_stats.fraud_score)}
              />
              <StatCell
                label="FBI AWARE"
                value={String(endgame.final_stats.fbi_awareness)}
                borderLeft
                alarm={fbiAlarm}
              />
            </div>
          </div>

          {/* moment everything went wrong */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: ALARM,
                fontWeight: 700,
              }}
            >
              THE MOMENT EVERYTHING WENT WRONG
            </div>
            <div
              style={{
                display: "flex",
                borderLeft: `1.4px solid ${INK}`,
                paddingLeft: 14,
                marginTop: 10,
                fontFamily: "serif",
                fontSize: 19,
                lineHeight: 1.4,
                color: INK,
              }}
            >
              {truncate(endgame.pivotal_event_outcome, 180)}
            </div>
          </div>

          {/* tagline pinned to bottom */}
          <div
            style={{
              display: "flex",
              marginTop: "auto",
              fontFamily: "serif",
              fontStyle: "italic",
              fontSize: 22,
              lineHeight: 1.3,
              color: INK,
              paddingTop: 24,
            }}
          >
            {truncate(endgame.tagline, 120)}
          </div>
        </div>
      </div>

      {/* ── FOOTER STRIP ──────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 32px",
          borderTop: `1.4px solid ${INK}`,
          fontSize: 12,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: SOFT,
        }}
      >
        <div style={{ display: "flex" }}>
          30u30.fail · spectator simulator
        </div>
        <div style={{ display: "flex", color: ALARM, fontWeight: 700 }}>
          VIEW FULL RUN →
        </div>
      </div>
    </div>
  );
}

/** ─── generic landing-page card (no run id) ──────────────────────────── */
export function DefaultOgCard() {
  return (
    <div
      style={{
        width: OG_WIDTH,
        height: OG_HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: PAPER,
        color: INK,
        fontFamily: "JetBrains Mono, monospace",
        border: `6px solid ${ALARM}`,
        boxSizing: "border-box",
      }}
    >
      {/* top strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 32px",
          borderBottom: `1.4px solid ${INK}`,
          fontSize: 14,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: ALARM,
        }}
      >
        <div style={{ display: "flex" }}>FORBES · 30u30 · CURSED EDITION</div>
        <div style={{ display: "flex", color: SOFT, fontWeight: 400 }}>
          30u30.fail
        </div>
      </div>

      {/* body */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding: "0 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "serif",
            fontSize: 88,
            lineHeight: 1.0,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: INK,
          }}
        >
          30u30.fail
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "serif",
            fontSize: 26,
            lineHeight: 1.3,
            color: INK_2,
            marginTop: 18,
            fontStyle: "italic",
          }}
        >
          spectator simulator · watch an AI commit fraud as your startup
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            transform: "rotate(-3deg)",
            padding: "10px 18px",
            border: `2px solid ${ALARM}`,
            color: ALARM,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: PAPER,
          }}
        >
          AVG ENDING · PRISON
        </div>
      </div>

      {/* footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 32px",
          borderTop: `1.4px solid ${INK}`,
          fontSize: 12,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: SOFT,
        }}
      >
        <div style={{ display: "flex" }}>
          avg run · 18 min · avg ending · prison
        </div>
        <div style={{ display: "flex", color: ALARM, fontWeight: 700 }}>
          START A RUN →
        </div>
      </div>
    </div>
  );
}

function StatCell({
  label,
  value,
  borderLeft,
  alarm,
}: {
  label: string;
  value: string;
  borderLeft?: boolean;
  alarm?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: "18px 22px",
        borderLeft: borderLeft ? `1.2px solid ${INK}` : "none",
        gap: 6,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 11,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: SOFT,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: alarm ? ALARM : INK,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function truncate(s: string, max: number): string {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

/** Convenience factories so consumers in plain `.ts` files (route handlers)
 *  don't need to embed JSX themselves. The components above are still exported
 *  for callers that want to compose. */
export function renderRunOgCard(props: {
  endgame: EndgameSnapshot;
  runId: string;
  notFound?: boolean;
}) {
  return <RunOgCard {...props} />;
}

export function renderDefaultOgCard() {
  return <DefaultOgCard />;
}

/** ─── shared font loader ────────────────────────────────────────────────
 *  @vercel/og wants real font bytes — we load JetBrains Mono Bold from
 *  Google Fonts' static CDN. The Special Elite headline falls back to the
 *  edge runtime's default `serif` stack; the in-app card keeps Special
 *  Elite via next/font. The font load is cached at the edge by the
 *  platform, so this is one fetch per cold start. */
const JETBRAINS_BOLD_URL =
  "https://fonts.gstatic.com/s/jetbrainsmono/v20/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjOVPkfh4yEEyPkUnYsM5w.ttf";

let jetbrainsBoldCache: ArrayBuffer | null = null;

export async function loadOgFonts(): Promise<
  { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[]
> {
  if (!jetbrainsBoldCache) {
    const res = await fetch(JETBRAINS_BOLD_URL);
    if (!res.ok) {
      // graceful fallback — render with the default font if Google blips.
      return [];
    }
    jetbrainsBoldCache = await res.arrayBuffer();
  }
  return [
    {
      name: "JetBrains Mono",
      data: jetbrainsBoldCache,
      weight: 700,
      style: "normal",
    },
  ];
}
