import type {
  ActiveEvent,
  CompanyBible,
  FeedEntry,
  MiniAction,
  Stats,
  TimelineEntry,
} from "./types";
import {
  MOCK_BIBLE,
  MOCK_EVENT_QUEUE,
  MOCK_FEED,
  MOCK_MINI_ACTIONS,
  MOCK_STATS,
  MOCK_TIMELINE,
} from "./mock-data";

export type EndgameArchetype =
  | "PRISON"
  | "FLED-DUBAI"
  | "FAILED-UP"
  | "CULTURAL-AFTERLIFE"
  | "GENUINE-SUCCESS"
  | "CURSED-TOPANGA";

export type ArchiveRun = {
  id: string;                  // slug used in URL
  company_name: string;        // display
  founder: string;
  industry: string;
  endgame_id: string;          // e.g. "END · PRISON-25Y"
  endgame_archetype: EndgameArchetype;
  peak_valuation: number;      // USD
  turns_elapsed: number;
  date: string;                // "Mar 14"
  tagline: string;             // pull-quote / one-line summary
  /** display attribution for /archive */
  attribution?: string;
  /** view count for /archive */
  views?: number;
  /** scope marker: present in /archive, absent in /me/runs */
  trending?: boolean;

  // ── replay payload ────────────────────────────────────────────
  bible: CompanyBible;
  event_queue: ActiveEvent[];
  mini_actions: MiniAction[];
  timeline: TimelineEntry[];
  feed: FeedEntry[];
  start_stats: Stats;
  /** stats trajectory — one snapshot per large event, ordered. last is final. */
  stat_trajectory: Stats[];
  /** original user's choice ids by event index (for "ORIGINAL: x" annotation) */
  original_predictions: (string | null)[];
};

// ── tiny deterministic hash for community_pct fan-out ─────────────
function hash(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/** populate community_pct on a copy of an event, deterministically per (runId, eventId). */
function withCommunityPct(runId: string, evt: ActiveEvent): ActiveEvent {
  const seed = hash(`${runId}::${evt.id}`);
  // agent's pick gets 60–72%, second 18–28%, third 8–15%
  const agentPct = 0.60 + ((seed % 13) / 100);            // .60..72
  const secondPct = 0.18 + (((seed >> 4) % 11) / 100);    // .18..28
  // remainder spread across the rest
  const remaining = Math.max(0.05, 1 - agentPct - secondPct);

  // pick a deterministic "second-best" id ≠ agent
  const non = evt.choices.filter((c) => c.id !== evt.agent_choice_id);
  const secondId = non[(seed >> 8) % Math.max(1, non.length)]?.id;

  const tailIds = non.filter((c) => c.id !== secondId).map((c) => c.id);
  const tailEach = tailIds.length > 0 ? remaining / tailIds.length : 0;

  return {
    ...evt,
    choices: evt.choices.map((c) => {
      let pct: number;
      if (c.id === evt.agent_choice_id) pct = agentPct;
      else if (c.id === secondId) pct = secondPct;
      else pct = tailEach;
      // tiny deterministic jitter
      const jitter = (((seed >> 12) ^ hash(c.id)) % 5) / 1000;
      pct = Math.max(0.02, Math.min(0.98, pct + jitter));
      return { ...c, community_pct: pct };
    }),
  };
}

function makeTrajectory(start: Stats, turns: number, endgame: EndgameArchetype): Stats[] {
  const traj: Stats[] = [start];
  let s = { ...start };
  for (let i = 1; i <= turns; i++) {
    const climb = i / turns;
    s = {
      ...s,
      day: start.day + i * 14,
      valuation:
        endgame === "GENUINE-SUCCESS"
          ? Math.round(start.valuation * (1 + climb * 8))
          : Math.round(start.valuation * (1 + climb * 4) * (i > turns * 0.7 ? 0.3 : 1)),
      cash: Math.max(50_000, Math.round(start.cash * (1 - climb * 0.6))),
      revenue: Math.round(start.revenue * (1 + climb * 3)),
      burn: Math.round(start.burn * (1 + climb * 0.8)),
      headcount: Math.round(start.headcount * (1 + climb * 1.5)),
      fbi_awareness: Math.min(
        100,
        Math.round(start.fbi_awareness + climb * (endgame === "PRISON" ? 80 : endgame === "GENUINE-SUCCESS" ? 4 : 40))
      ),
      fraud_score: Math.min(
        100,
        Math.round(start.fraud_score + climb * (endgame === "PRISON" || endgame === "FLED-DUBAI" ? 50 : 20))
      ),
    };
    traj.push(s);
  }
  return traj;
}

// ── canonical Vellum run reused as the live demo's archive entry ──
const VELLUM_RUN_ID = "demo";

const VELLUM_RUN: ArchiveRun = {
  id: VELLUM_RUN_ID,
  company_name: "VELLUM.AI",
  founder: MOCK_BIBLE.founder,
  industry: "ai_app",
  endgame_id: "END · PRISON-08",
  endgame_archetype: "PRISON",
  peak_valuation: 4_000_000_000,
  turns_elapsed: 14,
  date: "Apr 28",
  tagline: "Shipped a wrapper, denied the wrapper, indicted for the wrapper.",
  bible: MOCK_BIBLE,
  event_queue: MOCK_EVENT_QUEUE.map((e) => withCommunityPct(VELLUM_RUN_ID, e)),
  mini_actions: MOCK_MINI_ACTIONS,
  timeline: MOCK_TIMELINE,
  feed: MOCK_FEED,
  start_stats: MOCK_STATS,
  stat_trajectory: makeTrajectory(MOCK_STATS, MOCK_EVENT_QUEUE.length, "PRISON"),
  // user predicted "double down" on EVT-FR-002 (matches agent), then missed the SEC tweet, etc.
  original_predictions: ["c1", "c1", "c1", "c1"],
};

// ── 7 more archive entries, varied endgames ───────────────────────
function placeholderRun(
  id: string,
  company_name: string,
  founder: string,
  industry: string,
  archetype: EndgameArchetype,
  endgame_id: string,
  peak: number,
  turns: number,
  date: string,
  tagline: string,
  attribution?: string,
  views?: number,
  trending?: boolean,
): ArchiveRun {
  // For the mock-archive-only entries we reuse the demo's event queue but rebrand
  // the bible. The replay layer renders whatever lives on the run; this keeps
  // the wall feeling populated without wiring per-run scripts.
  const bible: CompanyBible = {
    ...MOCK_BIBLE,
    name: company_name,
    display_name: company_name.replace(/\..*$/, ""),
    founder,
    industry,
  };
  const startStats: Stats = {
    ...MOCK_STATS,
    valuation: Math.round(peak * 0.18),
    headcount: Math.max(6, Math.round(turns * 1.6)),
  };
  return {
    id,
    company_name,
    founder,
    industry,
    endgame_id,
    endgame_archetype: archetype,
    peak_valuation: peak,
    turns_elapsed: turns,
    date,
    tagline,
    attribution,
    views,
    trending,
    bible,
    event_queue: MOCK_EVENT_QUEUE.map((e) => withCommunityPct(id, e)),
    mini_actions: MOCK_MINI_ACTIONS,
    timeline: MOCK_TIMELINE,
    feed: MOCK_FEED,
    start_stats: startStats,
    stat_trajectory: makeTrajectory(startStats, MOCK_EVENT_QUEUE.length, archetype),
    original_predictions: MOCK_EVENT_QUEUE.map((_, i) => (i % 2 === 0 ? "c1" : "c2")),
  };
}

export const MY_ARCHIVE: ArchiveRun[] = [
  VELLUM_RUN,
  placeholderRun(
    "theranos-research",
    "THERANOS RESEARCH",
    "Eli Holmes",
    "biotech",
    "PRISON",
    "END · PRISON-25Y",
    312_000_000,
    18,
    "Apr 24",
    "Tested 14 drops, billed 240 panels, stood for the photo.",
  ),
  placeholderRun(
    "aico-labs",
    "AICO LABS",
    "Jens Wexler",
    "ai_app",
    "FLED-DUBAI",
    "END · FLED-DXB-03",
    1_400_000_000,
    16,
    "Apr 21",
    "Raised at 1.4B, fled to UAE, podcast tour in 2027.",
  ),
  placeholderRun(
    "delve-ai",
    "DELVE.AI",
    "Riya Patel",
    "ai_app",
    "FAILED-UP",
    "END · FAILUP-VP",
    88_000_000,
    11,
    "Apr 17",
    "Burned the seed, lost the deck, got the title.",
  ),
  placeholderRun(
    "ftx-junior",
    "FTX JUNIOR",
    "Cam Beaumont",
    "crypto",
    "PRISON",
    "END · PRISON-11Y",
    2_800_000_000,
    20,
    "Apr 12",
    "Different exchange. Same Bahamas penthouse. Same outcome.",
  ),
  placeholderRun(
    "topanga-mind",
    "TOPANGA MIND CO.",
    "Solenne Marsh",
    "wellness_ai",
    "CULTURAL-AFTERLIFE",
    "END · CULT-AFTER",
    44_000_000,
    22,
    "Apr 09",
    "Company died. The Substack lives on. There is a retreat now.",
  ),
  placeholderRun(
    "bio-x-health",
    "BIO X HEALTH",
    "Nadia Brand",
    "biotech",
    "GENUINE-SUCCESS",
    "END · SUCCESS-01",
    1_900_000_000,
    24,
    "Apr 04",
    "Built the thing, sold the thing, kept the thing. Insufferable.",
  ),
  placeholderRun(
    "cursed-topanga",
    "PARAGON PROTOCOL",
    "Hex Quintero",
    "crypto",
    "CURSED-TOPANGA",
    "END · CURSED-TPG",
    7_700_000_000,
    19,
    "Mar 29",
    "Voluntarily moved to Topanga. Cannot be reached for comment.",
  ),
];

export const PUBLIC_ARCHIVE: ArchiveRun[] = [
  placeholderRun(
    "auren-prison",
    "TOWERHOUSE.AI",
    "Auren Yates",
    "ai_app",
    "PRISON",
    "END · PRISON-08Y",
    520_000_000,
    13,
    "May 01",
    "Built a deterministic harness. The harness was a Zapier.",
    "by @auren_hoffman_brain · 4.2k views",
    4_212,
    true,
  ),
  placeholderRun(
    "rasp-fled",
    "RASPBERRY FINANCE",
    "Diem Larkin",
    "fintech",
    "FLED-DUBAI",
    "END · FLED-DXB-07",
    980_000_000,
    15,
    "Apr 30",
    "The Cayman sub-account was named 'consultancy / cayman.'",
    "by @diem · 8.8k views",
    8_811,
    true,
  ),
  placeholderRun(
    "halo-success",
    "HALO PROTEIN",
    "Marko Vasquez",
    "biotech",
    "GENUINE-SUCCESS",
    "END · SUCCESS-02",
    3_100_000_000,
    26,
    "Apr 28",
    "IPO'd with positive unit economics. Discourse confused.",
    "by @marko_v · 12.1k views",
    12_140,
    true,
  ),
  placeholderRun(
    "salt-failup",
    "SALT TYPE",
    "Peregrine Voss",
    "saas",
    "FAILED-UP",
    "END · FAILUP-PMF",
    61_000_000,
    9,
    "Apr 27",
    "Pivoted to AI. Pivoted to agents. Pivoted to a podcast.",
    "by @peregrine · 2.0k views",
    2_044,
    false,
  ),
  placeholderRun(
    "obelisk-prison",
    "OBELISK MARKETS",
    "Cassius Lee",
    "crypto",
    "PRISON",
    "END · PRISON-15Y",
    4_400_000_000,
    19,
    "Apr 26",
    "Wells notice. Tweeted through it. The tweets were exhibits.",
    "by @cassius · 22.4k views",
    22_412,
    true,
  ),
  placeholderRun(
    "cult-public",
    "MIRRORHOUSE",
    "Liorah Day",
    "wellness_ai",
    "CULTURAL-AFTERLIFE",
    "END · CULT-AFTER",
    77_000_000,
    21,
    "Apr 22",
    "Out of business. Not out of culture. Two retreats now.",
    "by @liorah · 3.1k views",
    3_188,
    false,
  ),
  placeholderRun(
    "ftx-jr-pub",
    "EQUINOX EXCHANGE",
    "Bram Hollister",
    "crypto",
    "PRISON",
    "END · PRISON-25Y",
    9_900_000_000,
    24,
    "Apr 19",
    "Said 'we have nothing to hide' four minutes before discovery.",
    "by @bram · 41.0k views",
    41_022,
    true,
  ),
  placeholderRun(
    "cursed-topanga-pub",
    "VANTAGE NOON",
    "Sloane Rivers",
    "ai_app",
    "CURSED-TOPANGA",
    "END · CURSED-TPG",
    122_000_000,
    17,
    "Apr 14",
    "Sold the company. Bought a tipi. Cannot be reached for comment.",
    "by @sloane · 1.4k views",
    1_402,
    false,
  ),
  placeholderRun(
    "halo-fled",
    "HALCYON CAPITAL",
    "Indira Wells",
    "fintech",
    "FLED-DUBAI",
    "END · FLED-DXB-12",
    2_200_000_000,
    18,
    "Apr 11",
    "Allocators got the memo. The memo was from Dubai.",
    "by @indira · 6.4k views",
    6_433,
    false,
  ),
  placeholderRun(
    "mid-success",
    "PARAGON KIDNEY",
    "Tomas Aldama",
    "biotech",
    "GENUINE-SUCCESS",
    "END · SUCCESS-03",
    1_650_000_000,
    23,
    "Apr 06",
    "Approved by FDA. Profiled by Stat. Loved by no one in tech.",
    "by @tomas · 5.8k views",
    5_811,
    false,
  ),
];

export function getArchiveRun(id: string): ArchiveRun | null {
  const all = [...MY_ARCHIVE, ...PUBLIC_ARCHIVE];
  return all.find((r) => r.id === id) ?? null;
}
