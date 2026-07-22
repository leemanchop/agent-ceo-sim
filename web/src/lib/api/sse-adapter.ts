/**
 * Maps the SSE wire stream from `/run/{id}/stream` onto handler callbacks the
 * UI consumes. The adapter is the *only* place where wire-shape leaks are
 * tolerated — everything past `attachStream` should think in UI types.
 *
 * Wire kinds → UI handlers:
 *   turn.start             → onStatsUpdate(stats)
 *   event.materialize      → onEvent(activeEvent)         (phase: ambient → event_in)
 *   agent.thought_token    → onThoughtToken(token)        (concatenated by caller)
 *   agent.thought_complete → onThoughtComplete()          (transitions awaiting/revealed)
 *   choices.appear         → onChoices(choices)
 *   agent.deliberation_token → onThoughtToken(token)      (CEO-mode "what I would have done"
 *                                                          uses the same stream slot)
 *   agent.commit           → onCommit(choice_id, justification)
 *   consequences.applied   → onConsequences(deltas, tweet?, effects?)
 *   feed.tweet|headline|slack_leak|glassdoor → onFeedItem(uiFeedEntry)
 *   turn.mini              → onMiniAction(uiMini)
 *   finding.unsealed       → onFinding(...)               (also routed to notif as "system/alarm")
 *   endgame.reached        → onEndgame(...)
 *   system.error           → onError(message)
 */
import type {
  Achievement,
  AchievementCategory,
  AchievementRarity,
  ActiveEvent,
  Choice,
  CompanyBible,
  EffectChip,
  EventCategory,
  FeedEntry,
  FeedSource,
  MiniAction,
  Severity,
  StatDeltas,
  Stats,
  TimeFrame,
} from "@/lib/types";
import type {
  SseKind,
  SsePayloadByKind,
  WireStats,
} from "./types";
import { parseSSEEvent } from "./schemas";

// ── wire→UI normalizers ───────────────────────────────────────

const CATEGORY_MAP: Record<string, EventCategory> = {
  fundraising: "FUNDRAISING",
  product: "PRODUCT",
  hiring: "HIRING",
  regulatory: "REGULATORY",
  press: "PRESS",
  customers: "CUSTOMERS",
  founder: "FOUNDER",
  crypto_ai: "CRYPTO_AI",
  operations: "OPERATIONS",
  banking: "BANKING",
  fbi: "FBI",
};

function normalizeCategory(c: string | undefined): EventCategory {
  if (!c) return "OPERATIONS";
  const key = c.toLowerCase();
  return CATEGORY_MAP[key] ?? (c.toUpperCase() as EventCategory);
}

function centsToUsd(cents: number | undefined): number | undefined {
  if (cents === undefined || cents === null) return undefined;
  return Math.round(cents / 100);
}

/**
 * Normalize wire stats → UI Stats. Backend may emit either UI-keyed dollars
 * or `*_usd_cents` keys; either is accepted. Missing fields default to 0.
 */
export function normalizeStats(w: WireStats): Stats {
  const valuation =
    w.valuation ?? centsToUsd(w.valuation_usd_cents) ?? 0;
  const cash = w.cash ?? centsToUsd(w.cash_usd_cents) ?? 0;
  const revenue = w.revenue ?? centsToUsd(w.revenue_usd_cents) ?? 0;
  const burn = w.burn ?? centsToUsd(w.burn_usd_cents) ?? 0;
  return {
    valuation,
    cash,
    revenue,
    burn,
    headcount: w.headcount ?? 0,
    fbi_awareness: w.fbi_awareness ?? w.heat ?? 0,
    fraud_score: w.fraud_score ?? 0,
    day: w.day ?? 0,
  };
}

/**
 * Normalize a wire stat-deltas dict into a UI StatDeltas. Accepts either
 * `*_usd_cents` keys or raw UI keys. `heat` aliases `fbi_awareness`.
 */
export function normalizeDeltas(d: Record<string, number>): StatDeltas {
  const out: StatDeltas = {};
  if ("valuation" in d) out.valuation = d.valuation;
  if ("valuation_usd_cents" in d)
    out.valuation = (out.valuation ?? 0) + Math.round(d.valuation_usd_cents / 100);
  if ("cash" in d) out.cash = d.cash;
  if ("cash_usd_cents" in d)
    out.cash = (out.cash ?? 0) + Math.round(d.cash_usd_cents / 100);
  if ("revenue" in d) out.revenue = d.revenue;
  if ("revenue_usd_cents" in d)
    out.revenue = (out.revenue ?? 0) + Math.round(d.revenue_usd_cents / 100);
  if ("burn" in d) out.burn = d.burn;
  if ("burn_usd_cents" in d)
    out.burn = (out.burn ?? 0) + Math.round(d.burn_usd_cents / 100);
  if ("headcount" in d) out.headcount = d.headcount;
  if ("fbi_awareness" in d) out.fbi_awareness = d.fbi_awareness;
  if ("heat" in d)
    out.fbi_awareness = (out.fbi_awareness ?? 0) + d.heat;
  if ("fraud_score" in d) out.fraud_score = d.fraud_score;
  if ("day" in d) out.day = d.day;
  return out;
}

function severityFromWire(s: string | undefined): Severity {
  if (s === "S" || s === "M" || s === "L" || s === "XL") return s;
  return "M";
}

/** Build a UI-shape ActiveEvent shell from `event.materialize`. Choices are
 *  filled in later by `choices.appear`; reasoning/commit fields are filled
 *  in by `agent.thought_*` and `agent.commit`. */
export function activeEventFromMaterialize(
  p: SsePayloadByKind["event.materialize"]
): ActiveEvent {
  return {
    id: p.event_id,
    category: normalizeCategory(p.category),
    severity: severityFromWire(p.severity),
    title: p.title,
    body: p.body,
    choices: [],
    agent_choice_id: "",
    reasoning: "",
    justification: "",
    artifact_tweet: "",
    effects_summary: [],
  };
}

export function choicesFromAppear(
  p: SsePayloadByKind["choices.appear"]
): Choice[] {
  return p.choices.map((c) => ({ id: c.id, label: c.label }));
}

// ── feed normalizers ──────────────────────────────────────────

let feedSeq = 0;
function nextFeedId(prefix: string): string {
  feedSeq += 1;
  return `${prefix}-${feedSeq}-${Date.now()}`;
}

const TWITTER_AVATAR_PALETTE = ["#794bc4", "#1d9bf0", "#0a8a00", "#a02b2b", "#5865f2", "#000"];
function avatarColorFromSeed(seed: string | undefined): string {
  if (!seed) return TWITTER_AVATAR_PALETTE[0];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return TWITTER_AVATAR_PALETTE[h % TWITTER_AVATAR_PALETTE.length];
}

function relTs(): string {
  // The backend sends ISO-8601; UI uses relative ("12s", "2m"). For now we
  // pass through "now" — the lifecycle agent's stream is real-time so the
  // delta is small. A polish pass later can compute relative against now.
  return "now";
}

export function feedFromTweet(p: SsePayloadByKind["feed.tweet"]): FeedEntry {
  const handleNoAt = p.handle.replace(/^@/, "");
  return {
    id: nextFeedId("tw"),
    source: "twitter",
    name: p.display_name,
    handle: p.handle.startsWith("@") ? p.handle : `@${p.handle}`,
    verified: p.verified ? "blue" : false,
    avatarColor: avatarColorFromSeed(p.avatar_seed ?? handleNoAt),
    avatarInitial: (p.display_name?.[0] ?? "?").toUpperCase(),
    timestamp: relTs(),
    body: p.body,
    likes: p.reactions?.likes,
    retweets: p.reactions?.retweets,
    replies: p.reactions?.quotes,
  };
}

const HEADLINE_SOURCE_MAP: Record<string, FeedSource> = {
  techcrunch: "techcrunch",
  bloomberg: "bloomberg",
  forbes: "forbes",
};

export function feedFromHeadline(
  p: SsePayloadByKind["feed.headline"]
): FeedEntry {
  const src =
    HEADLINE_SOURCE_MAP[p.publication.toLowerCase()] ?? "techcrunch";
  return {
    id: nextFeedId("hd"),
    source: src,
    name: p.publication,
    publication: p.publication,
    verified: "gold",
    avatarColor: "#000",
    avatarInitial: p.publication[0]?.toUpperCase() ?? "?",
    timestamp: relTs(),
    body: p.headline,
  };
}

export function feedFromSlackLeak(
  p: SsePayloadByKind["feed.slack_leak"]
): FeedEntry {
  return {
    id: nextFeedId("sl"),
    source: "slack",
    channel: p.channel,
    timestamp: relTs(),
    body: p.body,
  };
}

export function feedFromGlassdoor(
  p: SsePayloadByKind["feed.glassdoor"]
): FeedEntry {
  return {
    id: nextFeedId("gd"),
    source: "glassdoor",
    rating: p.stars,
    timestamp: relTs(),
    body: p.body,
  };
}

// ── mini-action ───────────────────────────────────────────────

export function miniFromTurnMini(
  p: SsePayloadByKind["turn.mini"]
): MiniAction {
  const deltas = p.stat_deltas ?? {};
  const effects: EffectChip[] = Object.entries(deltas).map(([k, v]) => ({
    label: k,
    value: v > 0 ? `+${v}` : String(v),
    tone: v > 0 ? "bad" : v < 0 ? "good" : "neutral",
  }));
  return {
    id: p.mini_id ?? `mini-${p.kind}-${Date.now()}`,
    size: "small",
    category: normalizeCategory(p.category),
    timeframe: (p.timeframe as TimeFrame) ?? "short",
    title: p.headline,
    outcome: "",
    effects_summary: effects,
  };
}

// ── handler contract ──────────────────────────────────────────

export type RunStreamHandlers = {
  onStatsUpdate: (stats: Stats) => void;
  onEvent: (event: ActiveEvent) => void;
  onThoughtToken: (token: string) => void;
  onThoughtComplete: () => void;
  onChoices: (choices: Choice[]) => void;
  onCommit: (choiceId: string, justification: string, artifactTweet?: string) => void;
  onConsequences: (
    deltas: StatDeltas,
    artifactTweet?: string,
    effects?: EffectChip[]
  ) => void;
  onFeedItem: (item: FeedEntry) => void;
  onMiniAction: (mini: MiniAction) => void;
  /** Days-axis pacing: a quiet day ticking past between beats. */
  onDayTick?: (day: number) => void;
  onFinding: (finding: {
    id: string;
    headline: string;
    canon_text_long: string;
  }) => void;
  onEndgame: (endgame: {
    id: string;
    title: string;
    verdict?: string;
    share_card_url: string;
  }) => void;
  onAchievement?: (achievement: Achievement) => void;
  onBible?: (bible: Partial<CompanyBible> & { display_name?: string }) => void;
  onResearchProgress?: (step: string, current?: number, total?: number) => void;
  onStreamReady?: () => void;
  onPostMortemDelta?: (text: string) => void;
  onPostMortemComplete?: (markdown: string) => void;
  onError: (message: string) => void;
  onClose: () => void;
};

const ACH_CATEGORY_VALUES: AchievementCategory[] = [
  "RUN",
  "STAT",
  "END",
  "CHAIN",
  "META",
  "BET",
  "SECRET",
];
const ACH_RARITY_VALUES: AchievementRarity[] = [
  "common",
  "uncommon",
  "rare",
  "legendary",
  "hidden",
];

function normalizeAchievement(
  p: SsePayloadByKind["achievement.unlocked"]
): Achievement {
  const cat = (p.category || "").toUpperCase() as AchievementCategory;
  const rar = (p.rarity || "").toLowerCase() as AchievementRarity;
  return {
    id: p.achievement_id,
    category: ACH_CATEGORY_VALUES.includes(cat) ? cat : "RUN",
    rarity: ACH_RARITY_VALUES.includes(rar) ? rar : "common",
    name: p.name,
    description: p.description ?? "",
    share_text: p.share_text ?? "",
    icon_hint: p.icon_hint ?? "",
    unlocked_at: p.unlocked_at,
  };
}

/** Subset map: which SSE kinds we wire up. Keepalive ":" comments are
 *  handled by EventSource itself and never reach us. */
const KINDS: SseKind[] = [
  "stream.open",
  "turn.start",
  "event.materialize",
  "agent.thought_token",
  "agent.thought_complete",
  "choices.appear",
  "agent.deliberation_token",
  "agent.commit",
  "consequences.applied",
  "feed.tweet",
  "feed.headline",
  "feed.slack_leak",
  "feed.glassdoor",
  "turn.mini",
  "finding.unsealed",
  "endgame.reached",
  "system.error",
  "achievement.unlocked",
];

/**
 * Attaches handlers to an EventSource. Returns a detach function that closes
 * the EventSource AND removes every named listener.
 */
export function attachStream(
  es: EventSource,
  handlers: RunStreamHandlers
): () => void {
  const listeners: Array<[string, (e: MessageEvent) => void]> = [];

  function on<K extends SseKind>(
    kind: K,
    fn: (data: SsePayloadByKind[K]) => void
  ) {
    const wrapped = (e: MessageEvent) => {
      let raw: unknown;
      try {
        raw = JSON.parse(e.data);
      } catch (err) {
        // malformed JSON — surface as an error but don't tear down the stream.
        // eslint-disable-next-line no-console
        console.warn(`[sse-adapter] failed to parse JSON for ${kind}:`, err);
        return;
      }
      // Validate against the Zod schema. On failure: log a warning and STILL
      // call the handler with the raw payload (cast to the expected type).
      // Rationale: a single optional-field type mismatch (e.g. backend sends
      // `null` for an optional string field) used to tear the whole event
      // down, leaving the UI in a permanent "waiting" state. Resilient
      // best-effort dispatch beats strict validation here — schemas are now
      // observability, not gating.
      const result = parseSSEEvent(kind, raw);
      const payload = result.ok
        ? (result.data as SsePayloadByKind[K])
        : (raw as SsePayloadByKind[K]);
      if (!result.ok) {
        // eslint-disable-next-line no-console
        console.warn(
          `[sse-adapter] soft schema mismatch on ${kind}: ${result.error} — dispatching anyway`,
        );
      }
      try {
        fn(payload);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[sse-adapter] handler threw on ${kind}:`, err);
      }
    };
    es.addEventListener(kind, wrapped as EventListener);
    listeners.push([kind, wrapped]);
  }

  on("turn.start", (p) => handlers.onStatsUpdate(normalizeStats(p.stats)));
  on("event.materialize", (p) =>
    handlers.onEvent(activeEventFromMaterialize(p))
  );
  on("agent.thought_token", (p) => handlers.onThoughtToken(p.token));
  on("agent.thought_complete", () => handlers.onThoughtComplete());
  on("choices.appear", (p) => handlers.onChoices(choicesFromAppear(p)));
  // Deliberation tokens (CEO-mode "what I would have done") feed the same
  // streaming surface — there's only one reasoning slot per event in the UI.
  on("agent.deliberation_token", (p) => handlers.onThoughtToken(p.token));
  on("agent.commit", (p) =>
    handlers.onCommit(p.choice_id, p.justification ?? "", p.artifact_tweet)
  );
  on("consequences.applied", (p) =>
    handlers.onConsequences(
      normalizeDeltas(p.stat_deltas ?? {}),
      p.artifact_tweet,
      p.effects_summary
    )
  );
  on("feed.tweet", (p) => handlers.onFeedItem(feedFromTweet(p)));
  on("feed.headline", (p) => handlers.onFeedItem(feedFromHeadline(p)));
  on("feed.slack_leak", (p) => handlers.onFeedItem(feedFromSlackLeak(p)));
  on("feed.glassdoor", (p) => handlers.onFeedItem(feedFromGlassdoor(p)));
  on("turn.mini", (p) => handlers.onMiniAction(miniFromTurnMini(p)));
  on("day.tick", (p) => handlers.onDayTick?.(p.day));
  on("finding.unsealed", (p) =>
    handlers.onFinding({
      id: p.finding_id,
      headline: p.headline,
      canon_text_long: p.canon_text_long ?? p.canon_text_short ?? "",
    })
  );
  on("endgame.reached", (p) =>
    handlers.onEndgame({
      id: p.endgame_id,
      title: p.title,
      verdict: p.verdict,
      share_card_url: p.share_card_url ?? "",
    })
  );
  on("system.error", (p) => handlers.onError(p.message));
  on("achievement.unlocked", (p) => {
    if (handlers.onAchievement) {
      try {
        handlers.onAchievement(normalizeAchievement(p));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn("[sse-adapter] onAchievement handler threw:", err);
      }
    }
  });
  // stream.open: announces the main loop is about to fire its first turn
  on("stream.open", () => {
    handlers.onStreamReady?.();
  });

  // researcher.searching / researcher.scraping / researcher.bible_partial —
  // freeform progress events; surface raw so the cockpit can render a status.
  if (handlers.onResearchProgress) {
    const progressKinds = [
      "researcher.searching",
      "researcher.scraping",
      "researcher.bible_partial",
    ];
    for (const kind of progressKinds) {
      const listener = (e: MessageEvent) => {
        try {
          const raw = JSON.parse(e.data);
          const step =
            raw?.query ??
            raw?.url ??
            raw?.section ??
            raw?.step_label ??
            kind.split(".")[1];
          handlers.onResearchProgress?.(
            String(step ?? kind),
            typeof raw?.step === "number" ? raw.step : undefined,
            typeof raw?.of === "number" ? raw.of : undefined,
          );
        } catch {
          handlers.onResearchProgress?.(kind, undefined, undefined);
        }
      };
      es.addEventListener(kind, listener as EventListener);
      listeners.push([kind, listener as EventListener]);
    }
  }

  // researcher.bible_complete: bible payloads are freeform — bypass the typed
  // dispatcher and consume raw so the UI can update the company name/one-liner
  // as soon as the Researcher finishes (or as soon as a template loads).
  if (handlers.onBible) {
    const bibleListener = (e: MessageEvent) => {
      try {
        const raw = JSON.parse(e.data);
        const bible = raw?.bible ?? raw;
        if (bible && typeof bible === "object") {
          // Coerce nested company structure into flat fields the UI expects.
          const company = bible.company ?? bible;
          const founders = bible.founders ?? company.founders;
          const founder0 = Array.isArray(founders) ? founders[0] : null;
          handlers.onBible?.({
            name: company.name,
            display_name: company.display_name ?? company.name,
            one_liner: company.one_liner ?? bible.one_liner,
            industry: company.industry,
            founder: founder0?.name,
            founder_vibe: founder0?.persona_vibe,
            founded_year: company.founded_year,
            funding_stage: company.funding_stage,
          });
        }
      } catch {
        /* malformed bible — ignore */
      }
    };
    es.addEventListener("researcher.bible_complete", bibleListener as EventListener);
    listeners.push(["researcher.bible_complete", bibleListener as EventListener]);
  }

  // post_mortem.delta / post_mortem.complete: streamed Bloomberg/Levine-voice
  // long-read at run end. Backend emits incremental text deltas, then a
  // single complete event with the final markdown body. The post-mortem
  // page reads the accumulated text via localStorage handoff.
  if (handlers.onPostMortemDelta || handlers.onPostMortemComplete) {
    const pmDeltaListener = (e: MessageEvent) => {
      try {
        const raw = JSON.parse(e.data);
        const text = String(raw?.text ?? "");
        if (text) handlers.onPostMortemDelta?.(text);
      } catch {
        /* ignore */
      }
    };
    const pmCompleteListener = (e: MessageEvent) => {
      try {
        const raw = JSON.parse(e.data);
        const markdown = String(raw?.markdown ?? raw?.body ?? "");
        if (markdown) handlers.onPostMortemComplete?.(markdown);
      } catch {
        /* ignore */
      }
    };
    es.addEventListener("post_mortem.delta", pmDeltaListener as EventListener);
    es.addEventListener("post_mortem.complete", pmCompleteListener as EventListener);
    listeners.push(["post_mortem.delta", pmDeltaListener as EventListener]);
    listeners.push(["post_mortem.complete", pmCompleteListener as EventListener]);
  }

  // transport-level errors (network drop / 5xx) — surface and let caller decide
  const onErr = () => handlers.onError("connection error");
  const onOpenClose = () => {};
  es.addEventListener("error", onErr);
  es.addEventListener("open", onOpenClose);

  return () => {
    for (const [kind, fn] of listeners) {
      es.removeEventListener(kind, fn as EventListener);
    }
    es.removeEventListener("error", onErr);
    es.removeEventListener("open", onOpenClose);
    es.close();
    handlers.onClose();
  };
}

// re-export for convenience
export { KINDS as SSE_KINDS };
