import type { Achievement } from "./types";

/**
 * Seed list pulled from /game/achievements.md. A spread across categories and
 * rarities, used both for the in-run toast triggers and for any future
 * collection / montage views. Keep names verbatim from the spec where possible
 * — the exact text is the joke.
 */
export const MOCK_ACHIEVEMENTS: Record<string, Achievement> = {
  "ACH-RUN-042": {
    id: "ACH-RUN-042",
    category: "RUN",
    rarity: "rare",
    name: "Marc Andreessen Quote-Tweet 'hm.'",
    description:
      "Provoked the exact reaction. Two characters, one period. The whole achievement.",
    share_text: "Got the 'hm.' That's the whole achievement.",
    icon_hint: "hm.",
    unlocked_at: "",
  },
  "ACH-RUN-001": {
    id: "ACH-RUN-001",
    category: "RUN",
    rarity: "uncommon",
    name: "Survived 365 Days",
    description:
      "Made it a full year as a fake CEO. Most short-mode runs fall short; you didn't.",
    share_text: "365 days as a fake CEO. No notes.",
    icon_hint: "365",
    unlocked_at: "",
  },
  "ACH-STAT-001": {
    id: "ACH-STAT-001",
    category: "STAT",
    rarity: "common",
    name: "Hit $1B Valuation",
    description:
      "Crossed the unicorn line at any point in the run. Confetti is the in-run reward; the badge is the trophy.",
    share_text: "We are now a unicorn. (We are also under investigation.)",
    icon_hint: "$1B",
    unlocked_at: "",
  },
  "ACH-RUN-015": {
    id: "ACH-RUN-015",
    category: "END",
    rarity: "legendary",
    name: "Dubai Growth Advisor",
    description:
      "Earned the default-mode flight ending. The LinkedIn post is the joke.",
    share_text:
      "Thrilled to announce I'm now Growth Advisor at [REDACTED] in Dubai. 🚀🚀🚀",
    icon_hint: "DXB",
    unlocked_at: "",
  },
  "ACH-RUN-011": {
    id: "ACH-RUN-011",
    category: "CHAIN",
    rarity: "rare",
    name: "The Edison Special",
    description:
      "Wrapper disclosure → press leak → SEC inquiry, all in twelve turns. Textbook.",
    share_text:
      "Wrapper disclosure → press leak → SEC inquiry, all in twelve turns.",
    icon_hint: "TBD",
    unlocked_at: "",
  },
  "ACH-RUN-012": {
    id: "ACH-RUN-012",
    category: "RUN",
    rarity: "rare",
    name: "Cooperator Chic",
    description:
      "Reached the cooperator-plea endgame. The CEO testifies against the cofounder.",
    share_text: "Six months and a redemption tour. I was the one who flipped.",
    icon_hint: "FLIP",
    unlocked_at: "",
  },
  "ACH-SECRET-002": {
    id: "ACH-SECRET-002",
    category: "SECRET",
    rarity: "legendary",
    name: "You Were the AI All Along",
    description:
      "Reached the simulator-reveal cursed-secret ending. Containment status: nominal.",
    share_text: "Containment status: nominal.",
    icon_hint: "AI",
    unlocked_at: "",
  },
  "ACH-STAT-003": {
    id: "ACH-STAT-003",
    category: "STAT",
    rarity: "rare",
    name: "Reached FBI Awareness 100",
    description:
      "The siren-pulse hit the ceiling. Almost always paired with a PRISON or FLED endgame.",
    share_text:
      "Maxed out the awareness bar. The bar was the limit, not the ambition.",
    icon_hint: "FBI",
    unlocked_at: "",
  },
  "ACH-BET-001": {
    id: "ACH-BET-001",
    category: "BET",
    rarity: "common",
    name: "First Correct Prediction",
    description:
      "Read against the prediction head, and the prediction head was wrong. First call logged.",
    share_text:
      "First call. I read against the prediction head and the prediction head was wrong.",
    icon_hint: "✓",
    unlocked_at: "",
  },
  "ACH-RUN-030": {
    id: "ACH-RUN-030",
    category: "RUN",
    rarity: "common",
    name: "The Auditor Resigned I",
    description:
      "First auditor resignation in the run. The chair is empty. The footnote is forthcoming.",
    share_text: "First auditor down.",
    icon_hint: "I",
    unlocked_at: "",
  },
};

/**
 * Stamp helper — Achievements come from a static catalog; toast unlock attaches
 * a fresh ISO timestamp at runtime.
 */
export function stampAchievement(id: string): Achievement | null {
  const a = MOCK_ACHIEVEMENTS[id];
  if (!a) return null;
  return { ...a, unlocked_at: new Date().toISOString() };
}
