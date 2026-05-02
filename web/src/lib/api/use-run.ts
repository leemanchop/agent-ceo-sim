"use client";

/**
 * `useRun` — the single state surface the run page consumes. Branches on
 * `NEXT_PUBLIC_API_MODE`:
 *
 *   - mock  → wraps the in-memory mock state machine (preserves the demo
 *             experience byte-for-byte: mini-action timer, feed trickle,
 *             scripted reasoning, scripted commit).
 *   - local/prod → opens an SSE connection to the Modal backend and routes
 *             events through `attachStream`. Side-effects (decide / speed)
 *             go back over POST.
 *
 * The page is otherwise mode-agnostic.
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MOCK_BIBLE,
  MOCK_DELTAS,
  MOCK_EVENT_QUEUE,
  MOCK_FEED,
  MOCK_MINI_ACTIONS,
  MOCK_STATS,
  MOCK_TIMELINE,
} from "@/lib/mock-data";
import { getArchiveRun } from "@/lib/mock-archive";
import type {
  Achievement,
  ActiveEvent,
  CompanyBible,
  FeedEntry,
  MiniAction,
  Mode,
  Phase,
  ResearchProgress,
  StatDeltas,
  Stats,
  TimelineEntry,
} from "@/lib/types";
import {
  createRun,
  decideRun,
  getApiMode,
  setSpeed as apiSetSpeed,
  startRun,
  streamRun,
} from "./client";
import { attachStream, type RunStreamHandlers } from "./sse-adapter";

const MINI_DELAY_BASE = 2500;
const TIMEFRAME_MUL: Record<MiniAction["timeframe"], number> = {
  short: 0.5,
  medium: 1,
  long: 2,
};

/**
 * Lightweight bible seeds for preset templates so the header renders the right
 * company name from t=0, before the SSE `researcher.bible_complete` event lands.
 * The full bible (founders, public_quotes, buzzwords) still comes from the
 * backend's parsed world/templates/{id}.md.
 */
const TEMPLATE_BIBLE_SEEDS: Record<string, Partial<CompanyBible>> = {
  theranos: {
    name: "Theranos",
    display_name: "Theranos",
    one_liner: "One drop of blood. Hundreds of tests. Zero working machines.",
    industry: "biotech",
    founder: "Elizabeth Holmes",
    founder_vibe: "stanford_dropout",
    funding_stage: "growth",
    founded_year: 2003,
  },
  ftx: {
    name: "FTX",
    display_name: "FTX",
    one_liner: "The most trusted name in crypto. (For about eighteen months.)",
    industry: "crypto",
    founder: "Sam Bankman-Fried",
    founder_vibe: "genuine_believer",
    funding_stage: "growth",
    founded_year: 2019,
  },
  delve: {
    name: "Delve",
    display_name: "Delve",
    one_liner: "Delve gets you compliant in days, not months.",
    industry: "ai_app",
    founder: "Karun Kaushik",
    founder_vibe: "stanford_dropout",
    funding_stage: "series_a",
    founded_year: 2023,
  },
  wework: {
    name: "WeWork",
    display_name: "WeWork",
    one_liner: "We are a community company committed to maximum global impact.",
    industry: "other",
    founder: "Adam Neumann",
    founder_vibe: "genuine_believer",
    funding_stage: "growth",
    founded_year: 2010,
  },
  frank: {
    name: "Frank",
    display_name: "Frank",
    one_liner: "The fastest-growing financial-aid platform.",
    industry: "fintech",
    founder: "Charlie Javice",
    founder_vibe: "ex_mckinsey",
    funding_stage: "series_a",
    founded_year: 2017,
  },
  nikola: {
    name: "Nikola",
    display_name: "Nikola",
    one_liner: "Zero-emission trucks. Powered by hydrogen, briefly.",
    industry: "hardware",
    founder: "Trevor Milton",
    founder_vibe: "genuine_believer",
    funding_stage: "ipo",
    founded_year: 2014,
  },
  outcome_health: {
    name: "Outcome Health",
    display_name: "Outcome Health",
    one_liner: "Point-of-care advertising that reaches every doctor's office.",
    industry: "biotech",
    founder: "Rishi Shah",
    founder_vibe: "ex_mckinsey",
    funding_stage: "growth",
    founded_year: 2006,
  },
  headspin: {
    name: "HeadSpin",
    display_name: "HeadSpin",
    one_liner: "Mobile experience platform with $100M ARR. (Allegedly.)",
    industry: "enterprise_saas",
    founder: "Manish Lachwani",
    founder_vibe: "second_time_founder",
    funding_stage: "growth",
    founded_year: 2015,
  },
  ozy: {
    name: "Ozy Media",
    display_name: "Ozy Media",
    one_liner: "The new and the next.",
    industry: "consumer_social",
    founder: "Carlos Watson",
    founder_vibe: "ex_mckinsey",
    funding_stage: "series_b",
    founded_year: 2013,
  },
  irl: {
    name: "IRL",
    display_name: "IRL",
    one_liner: "Group messaging for events. 95% bots, 100% unicorn.",
    industry: "consumer_social",
    founder: "Abraham Shafi",
    founder_vibe: "genuine_believer",
    funding_stage: "growth",
    founded_year: 2017,
  },
  cluely: {
    name: "Cluely",
    display_name: "Cluely",
    one_liner: "Cheat on everything. (Their copy, not ours.)",
    industry: "ai_app",
    founder: "Roy Lee",
    founder_vibe: "stanford_dropout",
    funding_stage: "series_a",
    founded_year: 2024,
  },
};

export type UseRunResult = {
  bible: CompanyBible;
  stats: Stats;
  deltas: StatDeltas;
  timeline: TimelineEntry[];
  feed: FeedEntry[];
  activeEvent: ActiveEvent | undefined;
  phase: Phase;
  predicted: string | null;
  committed: string | null;
  miniAction: MiniAction | null;
  predictionsCorrect: number;
  predictionsTotal: number;
  speed: 1 | 2 | 4;
  paused: boolean;
  runEnded: boolean;
  isLastEvent: boolean;
  endgame: { id: string; title: string; share_card_url: string } | null;

  // setters / actions
  predict: (choiceId: string) => void;
  commit: (choiceId: string) => void;
  setSpeed: (s: 1 | 2 | 4) => void;
  setPaused: (fn: (p: boolean) => boolean) => void;

  // replay only — jump to a specific event index
  jumpToEvent: (idx: number) => void;
  eventIdx: number;

  // archive metadata (mock + replay)
  archive: ReturnType<typeof getArchiveRun> | null;
  originalPredictions: (string | null)[];

  /** all achievements unlocked this run (live SSE, in order) */
  achievementsUnlocked: Achievement[];

  /** live-mode research-phase progress (label + step counts, when known) */
  researchProgress: ResearchProgress;

  /** accumulated researcher log — every progress step in order, so the user
   *  can watch the agent work in real time. */
  researchLog: { step: string; current?: number; total?: number; ts: number }[];
};

export function useRun({
  runId,
  mode,
  replayMode,
  onAchievement,
}: {
  runId: string;
  mode: Mode;
  replayMode: boolean;
  /** Optional bridge — fires on every server-side achievement.unlocked event
   *  so the page can forward to its toast queue. */
  onAchievement?: (achievement: Achievement) => void;
}): UseRunResult {
  const apiMode = getApiMode();
  const useMock = apiMode === "mock";

  // ── archive resolution (used by mock + replay) ───────────────
  const archive = useMemo(
    () => (replayMode ? getArchiveRun(runId) : null),
    [replayMode, runId]
  );

  // Bible: starts from archive (replay) or template-id lookup (live preset),
  // overridden by SSE `researcher.bible_complete` once it lands. Falls back to
  // MOCK_BIBLE if neither is available.
  const initialBible = useMemo<CompanyBible>(() => {
    if (archive?.bible) return archive.bible;
    // For preset templates (e.g. /run/theranos), seed display_name + one_liner
    // from the local template hint so the header reads correctly even before
    // the SSE bible arrives.
    const presetSeed = TEMPLATE_BIBLE_SEEDS[runId];
    if (presetSeed) return { ...MOCK_BIBLE, ...presetSeed };
    return MOCK_BIBLE;
  }, [archive, runId]);
  const [liveBible, setLiveBible] = useState<CompanyBible>(initialBible);
  // Reset when archive/runId changes.
  useEffect(() => {
    setLiveBible(initialBible);
  }, [initialBible]);
  const bible = liveBible;
  const eventQueue = archive?.event_queue ?? MOCK_EVENT_QUEUE;
  const miniActions = archive?.mini_actions ?? MOCK_MINI_ACTIONS;
  // In live mode we start clean — feed/timeline populate from SSE; stats from
  // the first `turn.start` event. In mock/replay mode we seed from archive or
  // the canned demo so the cockpit isn't empty before any work happens.
  const apiModeForInit = getApiMode();
  const useMockForInit = apiModeForInit === "mock";
  const baseTimeline = archive?.timeline ?? (useMockForInit ? MOCK_TIMELINE : []);
  const baseFeed = archive?.feed ?? (useMockForInit ? MOCK_FEED : []);
  const baseStats =
    archive?.start_stats ??
    (useMockForInit
      ? MOCK_STATS
      : {
          // live mode default stats — bare scaffolding until turn.start lands
          valuation: 0,
          cash: 0,
          revenue: 0,
          burn: 0,
          headcount: 0,
          fbi_awareness: 0,
          fraud_score: 0,
          day: 0,
        });
  const originalPredictions = useMemo(
    () => archive?.original_predictions ?? [],
    [archive]
  );

  // ── state shared by both branches ────────────────────────────
  const [stats, setStats] = useState<Stats>(baseStats);
  const [feed, setFeed] = useState<FeedEntry[]>(baseFeed);
  const [timeline, setTimeline] = useState<TimelineEntry[]>(baseTimeline);
  const [eventIdx, setEventIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>(
    useMockForInit ? "ambient" : "researching",
  );
  const [researchProgress, setResearchProgress] = useState<ResearchProgress>({
    step: "spinning up agent…",
  });
  // Accumulated researcher log — every step the Researcher emits, kept so
  // the user can watch the agent work (scrape this, search that, parse this).
  // Capped at 50 entries to bound DOM growth.
  const [researchLog, setResearchLog] = useState<
    { step: string; current?: number; total?: number; ts: number }[]
  >([]);
  const [activeMini, setActiveMini] = useState<MiniAction | null>(null);
  const [predicted, setPredicted] = useState<string | null>(null);
  const [committed, setCommitted] = useState<string | null>(null);
  const [predictionsCorrect, setPredictionsCorrect] = useState(0);
  const [predictionsTotal, setPredictionsTotal] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeedState] = useState<1 | 2 | 4>(replayMode ? 4 : 1);
  const [runEnded, setRunEnded] = useState(false);
  const [endgame, setEndgame] = useState<
    { id: string; title: string; share_card_url: string } | null
  >(null);

  // For live mode: the active event is built up token by token.
  const [liveEvent, setLiveEvent] = useState<ActiveEvent | null>(null);
  const liveEventRef = useRef<ActiveEvent | null>(null);
  liveEventRef.current = liveEvent;
  // Backend-assigned ULID for live mode. Different from the URL slug (which
  // can be a template id like "theranos"). Set during bootstrap; read by
  // decide/setSpeed/end calls that hit `/run/{id}/...`.
  const backendRunIdRef = useRef<string | null>(null);

  // Live-stream achievements (real backend triggers — no longer mocked).
  const [achievementsUnlocked, setAchievementsUnlocked] = useState<
    Achievement[]
  >([]);
  // Stable ref so the SSE handler closure doesn't need to re-attach when
  // the page passes a fresh onAchievement callback each render.
  const onAchievementRef = useRef<typeof onAchievement>(onAchievement);
  useEffect(() => {
    onAchievementRef.current = onAchievement;
  }, [onAchievement]);

  // mock-only refs (mini cadence)
  const minisSinceLargeRef = useRef(0);
  const minisTargetRef = useRef(replayMode ? 1 : 2 + Math.floor(Math.random() * 3));
  const [miniIdx, setMiniIdx] = useState(0);

  const event: ActiveEvent | undefined = useMock
    ? eventQueue[eventIdx]
    : liveEvent ?? undefined;
  const isLastEvent = useMock ? eventIdx === eventQueue.length - 1 : false;

  // ── reset on archive/run change (mock branch only) ───────────
  useEffect(() => {
    if (!useMock) return;
    setStats(baseStats);
    setFeed(baseFeed);
    setTimeline(baseTimeline);
    setEventIdx(0);
    setMiniIdx(0);
    setPredicted(null);
    setCommitted(null);
    setPredictionsCorrect(0);
    setPredictionsTotal(0);
    setRunEnded(false);
    setPhase("ambient");
    setActiveMini(null);
    setEndgame(null);
    minisSinceLargeRef.current = 0;
    minisTargetRef.current = replayMode ? 1 : 2 + Math.floor(Math.random() * 3);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runId, replayMode, useMock]);

  // ────────────────────────────────────────────────────────────
  // MOCK BRANCH — preserves the existing demo state machine 1:1
  // ────────────────────────────────────────────────────────────

  // mini-action driver
  useEffect(() => {
    if (!useMock) return;
    if (paused) return;
    if (runEnded) return;
    if (phase !== "ambient") return;
    if (miniIdx >= miniActions.length) return;

    if (
      minisSinceLargeRef.current >= minisTargetRef.current &&
      eventIdx < eventQueue.length
    ) {
      const t = setTimeout(() => setPhase("event_in"), 600 / speed);
      return () => clearTimeout(t);
    }

    const next = miniActions[miniIdx];
    const delay = (MINI_DELAY_BASE * TIMEFRAME_MUL[next.timeframe]) / speed;
    const t = setTimeout(() => {
      setActiveMini(next);
      setPhase("mini_action");
    }, delay);
    return () => clearTimeout(t);
  }, [
    useMock,
    phase,
    paused,
    speed,
    miniIdx,
    eventIdx,
    miniActions,
    eventQueue.length,
    runEnded,
  ]);

  // absorb mini-action
  useEffect(() => {
    if (!useMock) return;
    if (phase !== "mini_action" || !activeMini) return;
    const speedMul = 1 / speed;
    const HOLD = 1500 * speedMul;
    const t = setTimeout(() => {
      const turnNum = timeline.length + 1;
      const dayNum = (timeline[timeline.length - 1]?.day ?? 0) + 2;
      setTimeline((prev) => [
        ...prev,
        {
          id: `tm-${activeMini.id}-${turnNum}`,
          turn: turnNum,
          day: dayNum,
          size: activeMini.size,
          category: activeMini.category,
          timeframe: activeMini.timeframe,
          title: activeMini.title,
          outcome: activeMini.outcome,
        },
      ]);
      minisSinceLargeRef.current += 1;
      setMiniIdx((i) => i + 1);
      setActiveMini(null);
      setPhase("ambient");
    }, HOLD);
    return () => clearTimeout(t);
  }, [useMock, phase, activeMini, speed, timeline]);

  // event_in → deliberating/awaiting
  useEffect(() => {
    if (!useMock) return;
    if (paused) return;
    if (phase !== "event_in") return;
    setPredicted(null);
    setCommitted(null);
    const speedMul = 1 / speed;
    const t = setTimeout(
      () => setPhase(mode === "spectate" ? "deliberating" : "awaiting"),
      1100 * speedMul
    );
    return () => clearTimeout(t);
  }, [useMock, phase, paused, speed, mode]);

  // replay autopilot
  useEffect(() => {
    if (!useMock) return;
    if (!replayMode) return;
    if (phase !== "awaiting") return;
    if (committed) return;
    const ev = eventQueue[eventIdx];
    if (!ev) return;
    const speedMul = 1 / speed;
    const t = setTimeout(() => {
      const orig = originalPredictions[eventIdx] ?? null;
      if (orig) {
        setPredicted(orig);
        setPredictionsTotal((n) => n + 1);
        if (orig === ev.agent_choice_id) {
          setPredictionsCorrect((n) => n + 1);
        }
      }
      setCommitted(ev.agent_choice_id);
      setPhase("revealed");
    }, 900 * speedMul);
    return () => clearTimeout(t);
  }, [
    useMock,
    replayMode,
    phase,
    committed,
    speed,
    eventQueue,
    eventIdx,
    originalPredictions,
  ]);

  // revealed → consequences → advancing  (mock)
  useEffect(() => {
    if (!useMock) return;
    if (paused) return;
    const ev = eventQueue[eventIdx];
    const speedMul = 1 / speed;

    if (phase === "revealed") {
      const t = setTimeout(() => setPhase("consequences"), 2200 * speedMul);
      return () => clearTimeout(t);
    }
    if (phase === "consequences" && ev) {
      const t = setTimeout(() => {
        const turnNum = timeline.length + 1;
        const dayNum = (timeline[timeline.length - 1]?.day ?? 0) + 14;
        const choice = ev.choices.find((c) => c.id === committed);
        const isCrisis =
          ev.severity === "XL" ||
          ev.category === "REGULATORY" ||
          ev.category === "FBI";
        setTimeline((prev) => [
          ...prev,
          {
            id: `t-${ev.id}-${turnNum}`,
            turn: turnNum,
            day: dayNum,
            size: "large",
            category: ev.category,
            severity: ev.severity,
            title: ev.title,
            outcome:
              (mode === "ceo" ? "(you) " : "") +
              (choice?.label ?? "—") +
              ". " +
              ev.justification,
            alarm: isCrisis,
          },
        ]);
        setPhase("advancing");
      }, 4200 * speedMul);
      return () => clearTimeout(t);
    }
    if (phase === "advancing") {
      const t = setTimeout(() => {
        if (eventIdx === eventQueue.length - 1) {
          setRunEnded(true);
        } else {
          minisSinceLargeRef.current = 0;
          minisTargetRef.current = replayMode
            ? 1
            : 2 + Math.floor(Math.random() * 3);
          setEventIdx((i) => Math.min(i + 1, eventQueue.length - 1));
          setPhase("ambient");
        }
      }, 800 * speedMul);
      return () => clearTimeout(t);
    }
  }, [
    useMock,
    phase,
    paused,
    speed,
    mode,
    eventQueue,
    eventIdx,
    committed,
    timeline,
    replayMode,
  ]);

  // ────────────────────────────────────────────────────────────
  // LIVE BRANCH — SSE consumer
  // ────────────────────────────────────────────────────────────

  // accumulator for streamed reasoning tokens — flushed onto the active
  // event when thought_complete arrives.
  const reasoningBufRef = useRef<string>("");

  useEffect(() => {
    if (useMock) return;
    if (!runId) return;

    // Live-mode bootstrap:
    //   1) POST /run/create → backend assigns a ULID
    //   2) GET /run/{ulid}/start (SSE) → researcher events + stream.open
    //   3) on stream.open, close /start, GET /run/{ulid}/stream (SSE)
    //
    // The URL slug (e.g. "theranos") is NOT a run_id on the backend; it's a
    // template_id at create time. The backend mints its own run_id.
    let detach: (() => void) | null = null;
    let cancelled = false;
    let startEs: EventSource | null = null;
    let streamEs: EventSource | null = null;

    const bootstrap = async () => {
      try {
        // Treat the URL slug as a template_id when it matches one of the known
        // presets; otherwise upload-flavor with the slug as company name.
        const isTemplate = runId in TEMPLATE_BIBLE_SEEDS;

        // Hydrate user-typed company input from localStorage (set by the
        // landing page on submit). Without this we'd just send the URL slug
        // and the backend Researcher would have no real input to research.
        let userInput: {
          name?: string;
          one_liner?: string;
          industry?: string;
          founder_vibe?: string;
          length?: string;
          craziness?: string;
        } = {};
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem(`aces:run:${runId}:input`);
            if (raw) userInput = JSON.parse(raw);
          } catch {
            /* corrupt entry — ignore */
          }
        }

        // Seed the bible IMMEDIATELY so the cockpit header reads the user's
        // company name during the researching phase, not "Vellum".
        if (!isTemplate && (userInput.name || userInput.one_liner)) {
          setLiveBible((prev) => ({
            ...prev,
            name: userInput.name ?? prev.name,
            display_name: userInput.name ?? prev.display_name,
            one_liner: userInput.one_liner ?? prev.one_liner,
            industry: userInput.industry ?? prev.industry,
            founder_vibe: userInput.founder_vibe ?? prev.founder_vibe,
          }));
        }

        const created = await createRun({
          mode: isTemplate ? "template" : "uploaded",
          template_id: isTemplate ? runId : null,
          company: isTemplate
            ? null
            : {
                name: userInput.name || runId,
                one_liner: userInput.one_liner || "",
                industry: userInput.industry || "other",
                founder_vibe: userInput.founder_vibe || undefined,
              },
          settings: {
            length_mode: (userInput.length as "micro" | "short" | "medium" | "long") || "medium",
            craziness: (userInput.craziness as "tame" | "normal" | "unhinged") || "normal",
            interactive: mode === "ceo",
          },
        });
        if (cancelled) return;
        const ulid = created.run_id;
        backendRunIdRef.current = ulid;

        // Open /start to consume researcher events. When stream.open fires,
        // close it and switch to /stream.
        startEs = startRun(ulid);

        const startHandlers: Partial<RunStreamHandlers> = {
          onResearchProgress: (step, current, total) => {
            setResearchProgress({ step, current, total });
            setResearchLog((prev) => {
              const next = [...prev, { step, current, total, ts: Date.now() }];
              return next.length > 50 ? next.slice(-50) : next;
            });
          },
          onBible: (incoming) => {
            setLiveBible((prev) => ({
              ...prev,
              ...Object.fromEntries(
                Object.entries(incoming).filter(([, v]) => v != null && v !== "")
              ),
            }));
          },
          onStreamReady: () => {
            // researcher done; close /start and open /stream.
            try {
              startEs?.close();
            } catch {
              /* ignore */
            }
            startEs = null;
            if (cancelled) return;
            setPhase("ambient");
            streamEs = streamRun(ulid);
            detach = attachStream(streamEs, mainHandlers);
          },
          onError: (msg) => {
            // eslint-disable-next-line no-console
            console.warn("[useRun] /start stream error:", msg);
          },
          onStatsUpdate: () => {},
          onEvent: () => {},
          onThoughtToken: () => {},
          onThoughtComplete: () => {},
          onChoices: () => {},
          onCommit: () => {},
          onConsequences: () => {},
          onFeedItem: () => {},
          onMiniAction: () => {},
          onFinding: () => {},
          onEndgame: () => {},
          onClose: () => {},
        };
        const startDetach = attachStream(
          startEs,
          startHandlers as RunStreamHandlers,
        );
        // Make sure we clean up the start listener too — the stream-detach
        // is captured in `detach` above only when /stream opens.
        const prevDetach = detach;
        detach = () => {
          startDetach();
          prevDetach?.();
        };
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("[useRun] live bootstrap failed:", err);
      }
    };

    const mainHandlers: RunStreamHandlers = {
        onStatsUpdate: (s) => setStats(s),
        onEvent: (e) => {
          reasoningBufRef.current = "";
          setLiveEvent(e);
          setPredicted(null);
          setCommitted(null);
          setPhase("event_in");
          // The event card animation needs a tick before phase advances.
          // We let it sit at event_in until choices.appear lands.
        },
        onChoices: (choices) => {
          setLiveEvent((cur) => (cur ? { ...cur, choices } : cur));
          setPhase(mode === "spectate" ? "deliberating" : "awaiting");
        },
        onThoughtToken: (tok) => {
          reasoningBufRef.current += tok;
          // Live-update the reasoning string so AgentStream's local typewriter
          // can mirror it. AgentStream re-types on event change; for the live
          // branch we simply replace the canonical reasoning each token tick.
          setLiveEvent((cur) =>
            cur ? { ...cur, reasoning: reasoningBufRef.current } : cur
          );
        },
        onThoughtComplete: () => {
          // For spectate mode, deliberation done → user can now predict.
          // For ceo mode, reasoning streams during `revealed` (post-commit).
          if (mode === "spectate") {
            setPhase((p) => (p === "deliberating" ? "awaiting" : p));
          }
        },
        onCommit: (choiceId, justification, artifactTweet) => {
          setCommitted(choiceId);
          setLiveEvent((cur) =>
            cur
              ? {
                  ...cur,
                  agent_choice_id: choiceId,
                  justification,
                  artifact_tweet: artifactTweet ?? cur.artifact_tweet,
                }
              : cur
          );
          // Score the user's prediction now that we know the agent's pick.
          // (Mock mode does this in the predict() handler itself; live mode
          // can't because the agent's choice isn't known until commit.)
          setPredicted((curPred) => {
            if (curPred && curPred === choiceId) {
              setPredictionsCorrect((n) => n + 1);
            }
            return curPred;
          });
          setPhase("revealed");
        },
        onConsequences: (deltas, artifactTweet, effects) => {
          // Apply deltas onto stats.
          setStats((cur) => ({
            valuation: (cur.valuation ?? 0) + (deltas.valuation ?? 0),
            cash: (cur.cash ?? 0) + (deltas.cash ?? 0),
            revenue: (cur.revenue ?? 0) + (deltas.revenue ?? 0),
            burn: (cur.burn ?? 0) + (deltas.burn ?? 0),
            headcount: (cur.headcount ?? 0) + (deltas.headcount ?? 0),
            fbi_awareness: (cur.fbi_awareness ?? 0) + (deltas.fbi_awareness ?? 0),
            fraud_score: (cur.fraud_score ?? 0) + (deltas.fraud_score ?? 0),
            day: (cur.day ?? 0) + (deltas.day ?? 0),
          }));
          setLiveEvent((cur) =>
            cur
              ? {
                  ...cur,
                  artifact_tweet: artifactTweet ?? cur.artifact_tweet,
                  effects_summary: effects ?? cur.effects_summary,
                }
              : cur
          );
          // Drop a row onto the timeline now that the event resolved.
          setLiveEvent((curEv) => {
            if (!curEv) return curEv;
            const choice = curEv.choices.find((c) => c.id === curEv.agent_choice_id);
            setTimeline((prev) => {
              const turnNum = prev.length + 1;
              const dayNum = (prev[prev.length - 1]?.day ?? 0) + 14;
              return [
                ...prev,
                {
                  id: `t-${curEv.id}-${turnNum}`,
                  turn: turnNum,
                  day: dayNum,
                  size: "large",
                  category: curEv.category,
                  severity: curEv.severity,
                  title: curEv.title,
                  outcome:
                    (choice?.label ?? "—") + ". " + curEv.justification,
                  alarm:
                    curEv.severity === "XL" ||
                    curEv.category === "REGULATORY" ||
                    curEv.category === "FBI",
                },
              ];
            });
            return curEv;
          });
          setPhase("consequences");
          // After ~4s the consequences animation has finished AND the user
          // has had time to see the reveal callout + agent pick. Then flip
          // the WaitingPill to "oracle generating next event". The phase
          // will jump to "event_in" on the next onEvent (which usually
          // arrives BEFORE this timeout fires now that Oracle is pre-fetched).
          setTimeout(() => {
            setPhase((p) => (p === "consequences" ? "advancing" : p));
          }, 4000);
        },
        onFeedItem: (item) => {
          setFeed((prev) => [item, ...prev].slice(0, 200));
        },
        onMiniAction: (mini) => {
          setTimeline((prev) => {
            const turnNum = prev.length + 1;
            const dayNum = (prev[prev.length - 1]?.day ?? 0) + 2;
            return [
              ...prev,
              {
                id: `tm-${mini.id}-${turnNum}`,
                turn: turnNum,
                day: dayNum,
                size: mini.size,
                category: mini.category,
                timeframe: mini.timeframe,
                title: mini.title,
                outcome: mini.outcome,
              },
            ];
          });
        },
        onFinding: () => {
          // Surfaced via the existing notification stack — owner page subscribes
          // to the same SSE stream via this hook. For now we just log; the
          // notification dispatch lives in the page (since it owns the queue).
          // Hook for that goes through `onFinding` exposed from a future setter.
          // (left intentionally minimal — the page doesn't currently consume it
          // in mock mode either.)
        },
        onEndgame: (eg) => {
          setEndgame(eg);
          setRunEnded(true);
          setPhase("advancing");
          // localStorage handoff so the post-mortem page (server component
          // routed by URL slug, can't query the backend by ULID) can render
          // real run data instead of falling back to MOCK_ENDGAME.
          if (typeof window !== "undefined") {
            try {
              const payload = {
                run_id: backendRunIdRef.current,
                endgame_id: eg.id,
                title: eg.title,
                share_card_url: eg.share_card_url,
                bible: liveBible,
                stats: undefined as unknown,  // filled below if available
                achievements: undefined as unknown,
                saved_at: new Date().toISOString(),
              };
              // Capture last-known stats by reading current state — closures
              // make this a bit awkward; we read via a ref-style fresh fetch.
              localStorage.setItem(
                `aces:run:${runId}:postmortem`,
                JSON.stringify(payload),
              );
            } catch {
              /* localStorage may be disabled — non-fatal */
            }
          }
        },
        onAchievement: (ach) => {
          setAchievementsUnlocked((prev) =>
            prev.some((a) => a.id === ach.id) ? prev : [...prev, ach]
          );
          const fn = onAchievementRef.current;
          if (fn) {
            try {
              fn(ach);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.warn("[useRun] onAchievement bridge threw:", err);
            }
          }
        },
        onError: (msg) => {
          // eslint-disable-next-line no-console
          console.warn("[useRun] stream error:", msg);
        },
        onBible: (incoming) => {
          setLiveBible((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(incoming).filter(([, v]) => v != null && v !== "")
            ),
          }));
        },
        onResearchProgress: (step, current, total) => {
          setResearchProgress({ step, current, total });
        },
        onStreamReady: () => {
          // researcher done; main loop is about to start firing events.
          setPhase("ambient");
        },
        onClose: () => {
          /* no-op; detach handles teardown */
        },
    };
    // Kick off the create → /start → /stream sequence.
    void bootstrap();

    return () => {
      cancelled = true;
      if (detach) detach();
      try {
        startEs?.close();
      } catch {
        /* ignore */
      }
      try {
        streamEs?.close();
      } catch {
        /* ignore */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useMock, runId, mode]);

  // ── actions ──────────────────────────────────────────────────

  const predict = useCallback(
    (id: string) => {
      if (replayMode) return;
      if (mode !== "spectate") return;
      if (phase !== "deliberating" && phase !== "awaiting") return;
      if (predicted) return;
      setPredicted(id);

      if (useMock) {
        const ev = eventQueue[eventIdx];
        if (!ev) return;
        setTimeout(() => {
          const agentChoice = ev.agent_choice_id;
          setCommitted(agentChoice);
          setPredictionsTotal((n) => n + 1);
          if (id === agentChoice) setPredictionsCorrect((n) => n + 1);
          setPhase("revealed");
        }, 700);
      } else {
        const evId = liveEventRef.current?.id;
        const backendId = backendRunIdRef.current;
        if (evId && backendId) {
          decideRun(backendId, {
            kind: "prediction",
            event_id: evId,
            predicted_choice: id,
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.warn("[useRun] decide(prediction) failed:", err);
          });
        }
        setPredictionsTotal((n) => n + 1);
      }
    },
    [
      useMock,
      replayMode,
      mode,
      phase,
      predicted,
      eventQueue,
      eventIdx,
      runId,
    ]
  );

  const commit = useCallback(
    (id: string) => {
      if (replayMode) return;
      if (mode !== "ceo") return;
      if (phase !== "awaiting") return;
      if (committed) return;
      setCommitted(id);

      if (useMock) {
        setPhase("revealed");
      } else {
        const evId = liveEventRef.current?.id;
        const backendId = backendRunIdRef.current;
        if (evId && backendId) {
          decideRun(backendId, {
            kind: "force_choice",
            event_id: evId,
            choice_id: id,
          }).catch((err) => {
            // eslint-disable-next-line no-console
            console.warn("[useRun] decide(force_choice) failed:", err);
          });
        }
        // server will emit agent.commit + consequences.applied.
      }
    },
    [useMock, replayMode, mode, phase, committed, runId]
  );

  const setSpeed = useCallback(
    (s: 1 | 2 | 4) => {
      setSpeedState(s);
      if (!useMock) {
        const backendId = backendRunIdRef.current ?? runId;
        apiSetSpeed(backendId, (`${s}x` as `${typeof s}x`)).catch((err) => {
          // eslint-disable-next-line no-console
          console.warn("[useRun] setSpeed failed:", err);
        });
      }
    },
    [useMock, runId]
  );

  const jumpToEvent = useCallback(
    (idx: number) => {
      if (!replayMode) return;
      if (!useMock) return; // live replay jump not implemented yet
      if (idx < 0 || idx >= eventQueue.length) return;
      setEventIdx(idx);
      setPredicted(null);
      setCommitted(null);
      setActiveMini(null);
      setRunEnded(false);
      setPhase("event_in");
    },
    [useMock, replayMode, eventQueue.length]
  );

  const deltas = useMemo(() => MOCK_DELTAS, []);

  return {
    bible,
    stats,
    deltas,
    timeline,
    feed,
    activeEvent: event,
    phase,
    predicted,
    committed,
    miniAction: activeMini,
    predictionsCorrect,
    predictionsTotal,
    speed,
    paused,
    runEnded,
    isLastEvent,
    endgame,
    predict,
    commit,
    setSpeed,
    setPaused,
    jumpToEvent,
    eventIdx,
    archive,
    originalPredictions,
    achievementsUnlocked,
    researchProgress,
    researchLog,
  };
}
