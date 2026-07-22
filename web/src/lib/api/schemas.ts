/**
 * Runtime validation schemas for the agent-ceo-sim wire protocol.
 *
 * These Zod schemas mirror the wire shapes documented in
 * `game/api_contracts.md` and the static types in `web/src/lib/api/types.ts`.
 * The static types remain the canonical TS surface; these schemas exist so the
 * SSE consumer and REST client can fail closed (with an in-voice error) on a
 * malformed payload from a deployed Modal backend, instead of letting bad data
 * crash the cockpit downstream.
 *
 * Use `parseSSEEvent(kind, JSON.parse(event.data))` in the SSE consumer to
 * validate every event. On `ok: false`, log the error and surface a
 * `system.error`-shaped fallback so the UI doesn't crash.
 *
 * Design intent: schemas are intentionally **conservative** — prefer optional
 * fields with safe defaults over strict rejection. Production reality is
 * messier than the spec; we only reject payloads that are structurally broken
 * (missing required ids, wrong primitive types).
 */
import { z } from "zod";

// ── primitives ─────────────────────────────────────────────────

export const SeveritySchema = z.enum(["S", "M", "L", "XL"]);

export const StatsSchema = z.object({
  valuation: z.number(),
  cash: z.number(),
  revenue: z.number(),
  burn: z.number(),
  headcount: z.number(),
  fbi_awareness: z.number().min(0).max(100),
  fraud_score: z.number().min(0).max(100),
  day: z.number(),
});

/** Wire stats — accepts either UI-keyed dollars OR `*_usd_cents` keys.
 *  Adapter normalizes; here we just allow both shapes through. */
export const WireStatsSchema = z
  .object({
    valuation: z.number().optional(),
    cash: z.number().optional(),
    revenue: z.number().optional(),
    burn: z.number().optional(),
    headcount: z.number().optional(),
    fbi_awareness: z.number().optional(),
    fraud_score: z.number().optional(),
    day: z.number().optional(),
    valuation_usd_cents: z.number().optional(),
    cash_usd_cents: z.number().optional(),
    revenue_usd_cents: z.number().optional(),
    burn_usd_cents: z.number().optional(),
    heat: z.number().optional(),
  })
  .passthrough();

export const ChoiceWireSchema = z.object({
  id: z.string(),
  label: z.string(),
  tone: z.string().optional(),
  agentReasoning: z.string().optional(),
  community_pct: z.number().min(0).max(1).optional(),
});

export const EffectChipSchema = z.object({
  label: z.string(),
  value: z.string(),
  tone: z.enum(["good", "bad", "neutral"]),
  why: z.string().nullable().optional(),
});

// ── per-event-kind SSE payloads ────────────────────────────────

export const StreamOpenSchema = z.object({
  version: z.string().optional(),
  first_turn_in_seconds: z.number().optional(),
});

export const TurnStartSchema = z.object({
  turn: z.number(),
  day_elapsed: z.number().nullable().optional(),
  stats: WireStatsSchema,
});

export const EventMaterializeSchema = z.object({
  event_id: z.string(),
  category: z.string(),
  category_color: z.string().nullable().optional(),
  title: z.string(),
  body: z.string().nullable().optional().default(""),
  severity: SeveritySchema,
  tags: z.array(z.string()).nullable().optional().default([]),
});

export const AgentThoughtTokenSchema = z.object({
  token: z.string(),
  stream_id: z.string().nullable().optional().default(""),
});

export const AgentThoughtCompleteSchema = z.object({
  stream_id: z.string().nullable().optional().default(""),
  full_text: z.string().nullable().optional(),
});

export const ChoicesAppearSchema = z.object({
  choices: z.array(ChoiceWireSchema),
  prediction_window_seconds: z.number().nullable().optional(),
});

export const AgentDeliberationTokenSchema = z.object({
  token: z.string(),
  stream_id: z.string().nullable().optional().default(""),
});

// `.nullable().optional()` accepts string | null | undefined. Backend Python
// often emits explicit `null` when a field is empty (vs JS `undefined`). Strict
// `.string().optional()` rejects null → handler never fires → cockpit hangs.
// All optional string fields use the nullable+optional pattern.
export const AgentCommitSchema = z.object({
  choice_id: z.string(),
  justification: z.string().nullable().optional().default(""),
  stream_id: z.string().nullable().optional(),
  artifact_tweet: z.string().nullable().optional(),
});

export const ConsequencesAppliedSchema = z.object({
  stat_deltas: z.record(z.number()).nullable().optional().default({}),
  seeds_planted: z.array(z.string()).nullable().optional().default([]),
  seeds_paid_off: z.array(z.string()).nullable().optional().default([]),
  next_event_in_seconds: z.number().nullable().optional(),
  artifact_tweet: z.string().nullable().optional(),
  effects_summary: z.array(EffectChipSchema).nullable().optional(),
});

export const FeedTweetSchema = z.object({
  handle: z.string(),
  display_name: z.string().optional().default(""),
  // backend may send "gold" | "blue" | true | false — accept all
  verified: z
    .union([z.literal("gold"), z.literal("blue"), z.boolean()])
    .optional(),
  avatar_seed: z.string().optional(),
  body: z.string(),
  reactions: z
    .object({
      likes: z.number().optional(),
      retweets: z.number().optional(),
      quotes: z.number().optional(),
    })
    .optional(),
  ts: z.string(),
});

export const FeedHeadlineSchema = z.object({
  publication: z.string(),
  headline: z.string(),
  url_slug: z.string().optional(),
  ts: z.string(),
});

export const FeedSlackLeakSchema = z.object({
  channel: z.string(),
  author: z.string().optional(),
  body: z.string(),
  reactions: z.array(z.string()).optional(),
  ts: z.string(),
});

export const FeedGlassdoorSchema = z.object({
  stars: z.number(),
  title: z.string().optional(),
  body: z.string(),
  ts: z.string(),
});

export const DayTickSchema = z.object({
  day: z.number(),
  quiet: z.boolean().nullable().optional(),
});

export const TurnMiniSchema = z.object({
  mini_id: z.string().nullable().optional(),
  kind: z.string(),
  headline: z.string(),
  stat_deltas: z.record(z.number()).default({}),
  timeframe: z.enum(["short", "medium", "long"]).optional(),
  category: z.string().optional(),
});

export const FindingUnsealedSchema = z.object({
  finding_id: z.string(),
  headline: z.string(),
  canon_text_short: z.string().optional().default(""),
  canon_text_long: z.string().optional().default(""),
  achievement_unlocked: z.string().optional(),
  stat_deltas: z.record(z.number()).optional(),
});

export const EndgameReachedSchema = z.object({
  endgame_id: z.string(),
  title: z.string(),
  // Trading-card stamp text derived from the corpus record ("FLED —
  // SINGAPORE") — without it the card falls back to per-archetype defaults.
  verdict: z.string().optional(),
  endgame_category: z.string().optional(),
  final_headline: z.string().optional(),
  post_mortem_long_read: z.string().optional(),
  share_card_url: z.string().optional(),
  achievements_summary: z.array(z.unknown()).default([]),
});

export const SystemErrorSchema = z.object({
  code: z.string().optional(),
  message: z.string(),
  recoverable: z.boolean().default(true),
  details: z.record(z.unknown()).optional(),
});

export const AchievementUnlockedSchema = z.object({
  achievement_id: z.string(),
  category: z.string(),
  rarity: z.string(),
  name: z.string(),
  description: z.string().default(""),
  share_text: z.string().default(""),
  icon_hint: z.string().default(""),
  unlocked_at: z.string(),
});

// ── REST shapes ────────────────────────────────────────────────

export const CreateRunResponseSchema = z.object({
  run_id: z.string(),
  status: z.string(),
  bible_url: z.string().optional(),
});

export const RunSnapshotSchema = z.object({
  run_id: z.string(),
  status: z.enum(["in_progress", "completed", "abandoned"]),
  // bible — UI shape varies by mode; don't validate strictly here
  company: z.unknown(),
  settings: z.unknown(),
  stats: WireStatsSchema,
  stat_history: z
    .array(z.object({ turn: z.number(), stats: WireStatsSchema }))
    .default([]),
  events_resolved: z.array(z.unknown()).default([]),
  feed_recent: z.array(z.unknown()).default([]),
  achievements_unlocked: z.array(z.unknown()).default([]),
  findings_unsealed: z.array(z.unknown()).default([]),
  predictions: z
    .object({ correct: z.number(), total: z.number() })
    .default({ correct: 0, total: 0 }),
  ceobuck_balance: z.number().default(0),
});

// ── dispatch table ─────────────────────────────────────────────

export const SSE_EVENT_SCHEMAS: Record<string, z.ZodTypeAny> = {
  "stream.open": StreamOpenSchema,
  "turn.start": TurnStartSchema,
  "event.materialize": EventMaterializeSchema,
  "agent.thought_token": AgentThoughtTokenSchema,
  "agent.thought_complete": AgentThoughtCompleteSchema,
  "choices.appear": ChoicesAppearSchema,
  "agent.deliberation_token": AgentDeliberationTokenSchema,
  "agent.commit": AgentCommitSchema,
  "consequences.applied": ConsequencesAppliedSchema,
  "feed.tweet": FeedTweetSchema,
  "feed.headline": FeedHeadlineSchema,
  "feed.slack_leak": FeedSlackLeakSchema,
  "feed.glassdoor": FeedGlassdoorSchema,
  "turn.mini": TurnMiniSchema,
  "day.tick": DayTickSchema,
  "finding.unsealed": FindingUnsealedSchema,
  "endgame.reached": EndgameReachedSchema,
  "system.error": SystemErrorSchema,
  "achievement.unlocked": AchievementUnlockedSchema,
};

export type ParseResult<T = unknown> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/**
 * Validate an SSE payload by event kind. Returns a discriminated result.
 *
 * Usage in the SSE consumer:
 *   const r = parseSSEEvent(kind, JSON.parse(event.data));
 *   if (!r.ok) { handlers.onError(`bad ${kind}: ${r.error}`); return; }
 *   // r.data is the validated, defaulted payload
 */
export function parseSSEEvent(
  kind: string,
  raw: unknown
): ParseResult {
  const schema = SSE_EVENT_SCHEMAS[kind];
  if (!schema) {
    return { ok: false, error: `unknown event kind: ${kind}` };
  }
  const r = schema.safeParse(raw);
  if (r.success) return { ok: true, data: r.data };
  return {
    ok: false,
    error: r.error.issues
      .map((i) => `${i.path.join(".") || "<root>"}: ${i.message}`)
      .join("; "),
  };
}

/**
 * Tiny `assert` helper for the SSE consumer. Throws an Error with a
 * `[sse]`-prefixed message if `cond` is falsy. Intended for invariants
 * the consumer can't recover from (e.g. an event slipped through that
 * should have been validated upstream).
 */
export function assert(
  cond: unknown,
  message: string
): asserts cond {
  if (!cond) {
    throw new Error(`[sse] assertion failed: ${message}`);
  }
}
