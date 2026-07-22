/**
 * Wire shapes for the agent-ceo-sim backend (per `game/api_contracts.md`).
 *
 * These are intentionally separate from `web/src/lib/types.ts` (which describes
 * UI-shaped data the components consume). The SSE adapter maps wire → UI; this
 * file is the boundary.
 *
 * Money on the wire is integer USD cents — the UI formats to dollars.
 */
import type { CompanyBible, Stats } from "@/lib/types";

// ── /run/create ────────────────────────────────────────────────
export type CreateRunBody = {
  mode: "uploaded" | "template" | "synthetic";
  template_id?: string | null;  // any preset slug under world/templates/
  company?: {
    name: string;
    one_liner: string;
    industry: string;
    founder_vibe?: string;
    /** User-provided founder name — researcher treats it as ground truth. */
    founder?: string;
    /** User-provided founder X handle (with or without @). */
    founder_handle?: string;
  } | null;
  settings?: {
    length_mode?: "micro" | "short" | "medium" | "long";
    craziness?: "tame" | "normal" | "unhinged";
    interactive?: boolean;
  };
};

export type CreateRunResponse = {
  run_id: string;
  status: string;
  bible_url?: string;
};

// ── /run/{id}/decide ───────────────────────────────────────────
export type DecideBody =
  | { kind: "prediction"; event_id: string; predicted_choice: string }
  | { kind: "force_choice"; event_id: string; choice_id: string };

// ── /run/{id}/speed ────────────────────────────────────────────
export type SpeedValue = "1x" | "2x" | "4x" | "pause";
export type SpeedBody = { speed: SpeedValue };

// ── /run/{id} (snapshot) ───────────────────────────────────────
export type RunSnapshot = {
  run_id: string;
  status: "in_progress" | "completed" | "abandoned";
  company: CompanyBible;
  settings: Record<string, unknown>;
  stats: WireStats;
  stat_history?: Array<{ turn: number; stats: WireStats }>;
  events_resolved?: unknown[];
  feed_recent?: unknown[];
  achievements_unlocked?: unknown[];
  findings_unsealed?: unknown[];
  predictions?: { correct: number; total: number };
  ceobuck_balance?: number;
};

// ── stats on the wire (cents → dollars at the boundary) ───────
// The backend may emit either a fully-formed UI Stats object OR cents-keyed
// fields. We accept both and normalize in the adapter.
export type WireStats = Partial<Stats> & {
  valuation_usd_cents?: number;
  cash_usd_cents?: number;
  revenue_usd_cents?: number;
  burn_usd_cents?: number;
  heat?: number;
};

// ── SSE event payloads (per api_contracts.md) ─────────────────
//
// Every SSE message is `event: <kind>\ndata: <json>\n\n`. Kinds we know:
//
//   stream.open                  · handshake
//   turn.start                   · stats snapshot
//   event.materialize            · large event card
//   agent.thought_token          · streamed reasoning (concatenate)
//   agent.thought_complete       · reasoning done
//   choices.appear               · choices array + prediction window
//   agent.deliberation_token     · CEO-mode "what I would have done" stream
//   agent.commit                 · scripted/forced commit
//   consequences.applied         · stat deltas + ripples
//   feed.tweet | feed.headline | feed.slack_leak | feed.glassdoor
//   turn.mini                    · atmospheric mini-action
//   finding.unsealed             · secret reveal
//   endgame.reached              · run over → post-mortem
//   system.error                 · in-voice error
//   ": ping"                     · keepalive (handled by EventSource itself)

export type SsePayloadByKind = {
  "stream.open": { version: string; first_turn_in_seconds?: number };
  "turn.start": { turn: number; day_elapsed?: number; stats: WireStats };
  "event.materialize": {
    event_id: string;
    category: string;
    category_color?: string;
    title: string;
    body: string;
    severity: "S" | "M" | "L" | "XL";
    tags?: string[];
  };
  "agent.thought_token": { token: string; stream_id: string };
  "agent.thought_complete": { stream_id: string; full_text?: string };
  "choices.appear": {
    choices: Array<{ id: string; label: string; tone?: string }>;
    prediction_window_seconds?: number;
  };
  "agent.deliberation_token": { token: string; stream_id: string };
  "agent.commit": {
    choice_id: string;
    justification?: string;
    stream_id?: string;
    artifact_tweet?: string;
  };
  "consequences.applied": {
    stat_deltas: Record<string, number>;
    seeds_planted?: string[];
    seeds_paid_off?: string[];
    next_event_in_seconds?: number;
    artifact_tweet?: string;
    effects_summary?: Array<{
      label: string;
      value: string;
      tone: "good" | "bad" | "neutral";
    }>;
  };
  "feed.tweet": {
    handle: string;
    display_name: string;
    verified?: boolean;
    avatar_seed?: string;
    body: string;
    reactions?: { likes?: number; retweets?: number; quotes?: number };
    ts: string;
  };
  "feed.headline": {
    publication: string;
    headline: string;
    url_slug?: string;
    ts: string;
  };
  "feed.slack_leak": {
    channel: string;
    author?: string;
    body: string;
    reactions?: string[];
    ts: string;
  };
  "feed.glassdoor": {
    stars: number;
    title?: string;
    body: string;
    ts: string;
  };
  "day.tick": { day: number; quiet?: boolean | null };
  "turn.mini": {
    /** Stable per-(turn, index) id from the backend — timeline dedup key. */
    mini_id?: string | null;
    kind: string;
    headline: string;
    stat_deltas?: Record<string, number>;
    timeframe?: "short" | "medium" | "long";
    category?: string;
  };
  "finding.unsealed": {
    finding_id: string;
    headline: string;
    canon_text_short?: string;
    canon_text_long?: string;
    achievement_unlocked?: string;
    stat_deltas?: Record<string, number>;
  };
  "endgame.reached": {
    endgame_id: string;
    title: string;
    verdict?: string;
    endgame_category?: string;
    final_headline?: string;
    post_mortem_long_read?: string;
    share_card_url?: string;
    achievements_summary?: unknown[];
  };
  "system.error": {
    code?: string;
    message: string;
    details?: Record<string, unknown>;
  };
  "achievement.unlocked": {
    achievement_id: string;
    category: string;
    rarity: string;
    name: string;
    description: string;
    share_text: string;
    icon_hint: string;
    unlocked_at: string;
  };
};

export type SseKind = keyof SsePayloadByKind;
