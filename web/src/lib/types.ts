export type EventCategory =
  | "FUNDRAISING"
  | "PRODUCT"
  | "HIRING"
  | "REGULATORY"
  | "PRESS"
  | "CUSTOMERS"
  | "FOUNDER"
  | "CRYPTO_AI"
  | "OPERATIONS"
  | "BANKING"
  | "FBI";

export type Severity = "S" | "M" | "L" | "XL";

export type Mode = "spectate" | "ceo";

export type ActionSize = "small" | "medium" | "large";
export type TimeFrame = "short" | "medium" | "long";

export type Stats = {
  valuation: number;     // USD
  cash: number;          // USD
  revenue: number;       // monthly recurring USD
  burn: number;          // monthly USD
  headcount: number;
  fbi_awareness: number; // 0-100
  fraud_score: number;   // 0-100
  day: number;
};

export type StatDeltas = Partial<Record<keyof Stats, number>>;

export type EffectChip = {
  label: string;
  value: string;
  tone: "good" | "bad" | "neutral";
};

export type TimelineEntry = {
  id: string;
  turn: number;
  day: number;
  category: EventCategory;
  severity?: Severity;        // present for large/decision rows
  size: ActionSize;           // small | medium | large
  timeframe?: TimeFrame;      // present for mini-actions
  title: string;
  outcome: string;
  alarm?: boolean;            // crisis flag (raid, indictment, etc.)
};

export type Choice = {
  id: string;
  label: string;
  /** dimmed inline reasoning per chip during deliberation phase */
  agentReasoning?: string;
  /** REPLAY-only: % of users who picked this choice (0..1). Undefined in live mode. */
  community_pct?: number;
};

export type ActiveEvent = {
  id: string;
  category: EventCategory;
  severity: Severity;
  title: string;
  body: string;
  choices: Choice[];
  /** scripted CEO-agent pick (used as the reveal in spectate mode and as the "what I would have done" stream in CEO mode) */
  agent_choice_id: string;
  /** the agent's full reasoning string, streamed token-by-token */
  reasoning: string;
  /** one-line beat shown next to the committed choice */
  justification: string;
  /** post-commit tweet artifact */
  artifact_tweet: string;
  /** stat deltas applied on commit (display copy only — no math here) */
  effects_summary: EffectChip[];
};

/** Mini-actions (small + medium) auto-resolve. Large actions go through ActiveEvent. */
export type MiniAction = {
  id: string;
  size: "small" | "medium";
  category: EventCategory;
  timeframe: TimeFrame;
  title: string;
  outcome: string;
  effects_summary: EffectChip[];
};

/** the canonical phase machine for the run page */
export type Phase =
  | "researching"   // live-mode only: Researcher building the bible (one-shot, ~30-90s)
  | "ambient"
  | "mini_action"   // a mini-action is being absorbed
  | "event_in"
  | "deliberating"  // spectate only: agent reasoning streams while choices are visible
  | "awaiting"      // spectate: waiting for user prediction. ceo: waiting for user to click a choice.
  | "revealed"      // spectate: agent pick revealed. ceo: user pick locked + agent reasoning streams now.
  | "consequences"  // deltas applied, artifact tweet shown
  | "advancing";    // brief fade before next event

/** Live-mode research progress shown during the `researching` phase. */
export type ResearchProgress = {
  step: string;            // human-readable: "scraping vellum.ai" / "indexing founder twitter"
  current?: number;        // 0-indexed step
  total?: number;          // total steps if known
};

export type FeedSource =
  | "twitter"
  | "bloomberg"
  | "techcrunch"
  | "forbes"
  | "slack"
  | "glassdoor"
  | "fbi"
  | "discord";

export type FeedEntry = {
  id: string;
  source: FeedSource;
  /** display name on the row (e.g. "Paper Hands", "TechCrunch") */
  name?: string;
  handle?: string;
  channel?: string;
  publication?: string;
  rating?: number;
  /** 'gold' for press/Forbes/TechCrunch, 'blue'/true for user check, false/undefined for none */
  verified?: "gold" | "blue" | true | false;
  /** avatar background hex */
  avatarColor?: string;
  /** avatar single-letter initial */
  avatarInitial?: string;
  timestamp: string; // relative ("11s", "2m")
  body: string;
  retweets?: number;
  likes?: number;
  replies?: number;
};

export type AchievementRarity =
  | "common"
  | "uncommon"
  | "rare"
  | "legendary"
  | "hidden";

export type AchievementCategory =
  | "RUN"
  | "STAT"
  | "END"
  | "CHAIN"
  | "META"
  | "BET"
  | "SECRET";

export type Achievement = {
  id: string;                       // e.g. "ACH-RUN-014"
  category: AchievementCategory;
  rarity: AchievementRarity;
  name: string;                     // "Marc Andreessen Quote-Tweet 'hm.'"
  description: string;              // 1-2 sentences explaining what was unlocked
  share_text: string;               // tweetable one-liner
  icon_hint: string;                // short visual descriptor (used in fallback rendering)
  unlocked_at: string;              // ISO timestamp
};

export type NotificationKind =
  | "slack_dm"        // direct message in a private channel ("@cto: u up?")
  | "slack_thread"    // a thread blew up in a channel
  | "press_tip"       // press is asking — tip from a contact
  | "regulator"       // regulator-themed (SEC, FTC, etc.)
  | "stat_threshold"  // FBI awareness crossed, fraud_score crossed, $1B hit
  | "calendar"        // calendar invite arrived
  | "leak"            // an internal leak just landed in the feed
  | "system"          // simulator-system message (rare)
  | "fbi";            // FBI-tab unlock or escalation

export type NotificationSeverity = "info" | "warn" | "alarm";

export type SimNotification = {
  id: string;
  kind: NotificationKind;
  severity: NotificationSeverity;
  source_label: string;        // e.g., "#exec  · slack" / "TechCrunch · Casey Newton"
  title: string;               // bold one-liner
  body: string;                // 1-2 lines of detail
  ts: string;                  // relative timestamp
  click_action?: { label: string; href?: string };  // optional CTA chip
  ttl_ms?: number;             // override default 6000
  sound?: "ding" | "drone" | "stamp" | "cash" | "glass" | "fbi_unlock" | "fbi_raid" | "fanfare" | "tick";  // optional audio cue
};

export type CompanyBible = {
  name: string;
  display_name: string;
  one_liner: string;
  industry: string;
  founder: string;
  founder_vibe: string;
  founded_year: number;
  funding_stage: string;
};
