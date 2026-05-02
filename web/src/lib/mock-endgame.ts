import type { Stats } from "./types";
import { MOCK_BIBLE, MOCK_STATS } from "./mock-data";

export type EndgameArchetype =
  | "PRISON"
  | "FLED"
  | "GOTAWAY"
  | "FAILUP"
  | "CULT"
  | "SUCCESS"
  | "SECRET";

export type EndgameSnapshot = {
  endgame_id: string;
  archetype: EndgameArchetype;
  /** the long-form display title — appears as the header above the post-mortem */
  title: string;
  /** the rotated stamp on the trading card (≤ ~28 chars) */
  stamp_text: string;
  /** one-line headline used as the card subtitle / oracle compression */
  final_headline: string;
  /** 600-1000 word post-mortem body, plain prose with paragraph breaks (\n\n) */
  post_mortem_long_read: string;
  /** stats at endgame */
  final_stats: Stats;
  /** stats at the run's high-water mark */
  peak_stats: Stats;
  /** the turn (1-indexed) the run pivoted */
  turn_when_things_went_wrong: number;
  pivotal_event_title: string;
  pivotal_event_outcome: string;
  /** the meme line at the bottom of the card */
  tagline: string;
  /** ISO date the run terminated */
  ended_at: string;
  /** company snapshot used by the card and the long-read */
  company_name: string;
  company_one_liner: string;
  founder_name: string;
  /** initials shown in the avatar tile (1-2 chars) */
  founder_initials: string;
};

/**
 * Default stamp text per archetype — used as a fallback when an endgame
 * record doesn't carry a custom `stamp_text`.
 */
export const STAMP_BY_ARCHETYPE: Record<EndgameArchetype, string> = {
  PRISON: "25 YEARS FEDERAL",
  FLED: "DUBAI · GROWTH ADVISOR",
  GOTAWAY: "ACQUITTED · STILL RICH",
  FAILUP: "VP STRATEGY · META",
  CULT: "HBO LIMITED SERIES",
  SUCCESS: "IPO · NYSE",
  SECRET: "RUMORED IN LISBON",
};

/** Peak stats for the Vellum.ai mocked run — the run hit its high-water mark
 *  the day Tiger's term sheet cleared. */
const VELLUM_PEAK: Stats = {
  ...MOCK_STATS,
  valuation: 4_000_000_000, // $4B post
  cash: 412_000_000,
  revenue: 184_000,
  burn: 8_400_000,
  headcount: 47,
  fbi_awareness: 22,
  fraud_score: 58,
  day: 138,
};

/** Final stats — the morning of the perp walk. */
const VELLUM_FINAL: Stats = {
  ...MOCK_STATS,
  valuation: 0,
  cash: 0,
  revenue: 0,
  burn: 0,
  headcount: 0,
  fbi_awareness: 92,
  fraud_score: 87,
  day: 287,
};

/** ─── the canonical demo endgame: PRISON-001, 25 years federal ───────────── */
export const MOCK_ENDGAME: EndgameSnapshot = {
  endgame_id: "END-PRISON-001",
  archetype: "PRISON",
  title: "25 Years Federal — The Next Case Study",
  stamp_text: "25 YEARS FEDERAL",
  final_headline:
    "From Series A to SDNY in 31 turns: the rise and fall of Vellum.ai",
  post_mortem_long_read: VELLUM_LONG_READ(),
  final_stats: VELLUM_FINAL,
  peak_stats: VELLUM_PEAK,
  turn_when_things_went_wrong: 6,
  pivotal_event_title: "Tiger Global's $400M term sheet",
  pivotal_event_outcome:
    "Signed Tiger Global's $400M term sheet without reading it. CFO was at her kid's recital.",
  tagline: "From Series A to SDNY in 31 turns.",
  ended_at: "2026-04-28",
  company_name: MOCK_BIBLE.display_name.toUpperCase(),
  company_one_liner: MOCK_BIBLE.one_liner,
  founder_name: MOCK_BIBLE.founder,
  founder_initials: initials(MOCK_BIBLE.founder),
};

function initials(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function VELLUM_LONG_READ(): string {
  return [
    "BY THE NUMBERS: a $4 billion paper valuation, fourteen months of runway, forty-seven engineers, one Tiger Global term sheet signed at 11:47pm Pacific by a founder who admitted under oath she had not read past page two. The CFO was at a recital.",
    "There is a long Bloomberg Money Stuff tradition of asking what fraud is, exactly, and the Vellum.ai indictment will keep that conversation going for at least one news cycle. Vellum sold an autonomous procurement agent that, depending on which week of testimony you read, was either an autonomous procurement agent or a Zapier workflow with a 1.4-second setTimeout. Both things can be true. Securities law generally has a view.",
    "The pivotal moment, per the prosecutors, was Day 67. Tiger Global had been circling the round at $4B post for six hours. The associate sent the term sheet at 4pm. The cover note said \"happy to walk through tomorrow\" and also \"sheet expires 10pm Pacific,\" which are two notes that cannot coexist. The CFO was at her daughter's recital. The CEO signed at 11:47pm. The Brex pilot was booked as ARR the next morning. The Brex pilot was a slide.",
    "What followed is the standard arc, compressed into eleven months. The TechCrunch profile dropped on Day 22 and called Vellum \"the next Ramp.\" The All-In podcast slot got booked on Day 91, where Riya described velocity culture as \"a moral framework, respectfully.\" The Wells notice arrived on Day 174. The company's response was a 612-character tweet beginning \"the SEC is the real fraud\" — a tweet that, in retrospect, the legal team now agrees was load-bearing for the indictment.",
    "Casey Newton blocked the press team four minutes after requesting comment, which Casey then noted in a Platformer post that became, by some readings, exhibit 14. Marc Andreessen quote-tweeted the response with the single word \"hm,\" a courtesy he extends to many companies, though rarely twice. He extended it twice. Tiger marked the position internally before the indictment unsealed. Tiger always marks the position internally before the indictment unseals.",
    "What is striking about the Vellum case, the post-mortem genre will note for the next eighteen months, is how mundane the underlying fraud was. The company shipped a real product to real customers, billed real money, and had a real engineering org of which most of the IC engineers were, by all accounts, sharp. The fraud was a setTimeout. It was always a setTimeout. The story is whether the founder knew it was a setTimeout, when she knew it was a setTimeout, and whether she emailed about it. She emailed about it.",
    "The cooperator was the CFO, who returned from the recital to discover that the term sheet had cleared and the diligence call had been rescheduled to \"after we sign.\" She kept her copies. The forensic accountants describe her as \"unusually well-organized.\" The judge, at sentencing, will describe her as \"a credible witness.\" The defense will describe her as \"a person with a family to feed.\" All three things will be true.",
    "The indictment itself runs 84 pages, of which 11 are tweets. The jury is back in four hours. The sentencing memo cites \"a stunning betrayal of investor trust\" and notes that the defendant, when asked at her deposition whether she had read the term sheet before signing, answered \"I read enough.\" The judge does not love this answer.",
    "Twenty-five years federal, navy suit, the kind you forgot was for funerals. Riya Chen will be eligible for release in 2049, by which point — the post-mortem will close on this note — agentic procurement, in some form, will probably actually exist. An HBO limited series is in early development. A Carreyrou-style book is under contract. A documentary unit at A24 has reached out. The team is, per a person familiar, considering the offers.",
    "There is no moral here that the discourse will agree on. The discourse rarely does. But the casebook now has a new chapter, and it is a clean one: a $4B startup, a $400M round signed in six hours, eleven months to indictment, and a CEO who, at the perp walk, was still holding a phone.",
    "Footnote: the phone was on. She was tweeting.",
  ].join("\n\n");
}
