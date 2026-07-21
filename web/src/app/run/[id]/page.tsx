"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Dashboard } from "@/components/run/dashboard";
import { Timeline } from "@/components/run/timeline";
import { AgentStream } from "@/components/run/agent-stream";
import { LiveFeed } from "@/components/run/live-feed";
import { Controls } from "@/components/run/controls";
import { NotificationStack } from "@/components/run/notification-stack";
import { useNotificationQueue } from "@/lib/use-notification-queue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UserMenu } from "@/components/system/user-menu";
import { useRun } from "@/lib/api/use-run";
import { getApiMode } from "@/lib/api/client";
import { useAchievementQueue } from "@/lib/use-achievement-queue";
import type { Mode, SimNotification } from "@/lib/types";

export default function RunPage() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const runId = (params?.id ?? "demo").toString();
  const replayMode = search.get("replay") === "1";
  // Be-the-CEO mode retired (owner call, Phase 2): the scripted engine is
  // spectate-only and coherence-first. Old ?mode=ceo links force-spectate.
  const mode: Mode = "spectate";

  // ── achievement toast queue (real SSE-driven; was previously mocked) ──
  const achievementQueue = useAchievementQueue();

  // ── single source of truth for run state (mock | live) ─────────
  const run = useRun({
    runId,
    mode,
    replayMode,
    onAchievement: achievementQueue.unlock,
  });

  const {
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
    archive,
    originalPredictions,
    researchProgress,
    researchLog,
    eventIdx,
    predict: onPredict,
    commit: onCommit,
    setSpeed,
    setPaused,
    jumpToEvent,
  } = run;

  const onReasoningDone = useCallback(() => {
    // The mock branch advances phase via its own timers; the live branch
    // advances on `agent.thought_complete`. Either way the AgentStream's
    // local typewriter just signals it's done — nothing for us to do.
  }, []);

  // ── notification queue (UI-local; same triggers as before) ─────
  const { notifications, push: pushNotif, dismiss: dismissNotif } =
    useNotificationQueue();
  const notifSeqRef = useRef(0);
  const fbiUnlockedRef = useRef(false);
  const fraudCrossedRef = useRef(false);
  const opsMiniCountRef = useRef(0);
  const lastEventIdxNotifRef = useRef(-1);
  const pausedRef = useRef(paused);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const safePush = useCallback(
    (n: Omit<SimNotification, "id"> & { id?: string }) => {
      if (pausedRef.current) return;
      notifSeqRef.current += 1;
      const id = n.id ?? `notif-${notifSeqRef.current}-${Date.now()}`;
      pushNotif({ ...n, id } as SimNotification);
    },
    [pushNotif]
  );

  // every other OPERATIONS mini-action → slack thread
  // (mock-only: in live mode, the backend's notification stream is the source of truth)
  useEffect(() => {
    if (getApiMode() !== "mock") return;
    if (phase !== "mini_action" || !activeMini) return;
    if (activeMini.category !== "OPERATIONS") return;
    opsMiniCountRef.current += 1;
    if (opsMiniCountRef.current % 2 !== 0) return;
    const speedMul = 1 / speed;
    const t = setTimeout(() => {
      safePush({
        kind: "slack_thread",
        severity: "info",
        source_label: "#leadership  · slack",
        title: "your CFO is asking about the lease invoice",
        body: "wants a 15-min sync today",
        ts: "now",
        sound: "ding",
      });
    }, 1200 * speedMul);
    return () => clearTimeout(t);
  }, [phase, activeMini, speed, safePush]);

  // large-event press tip (mock-only)
  useEffect(() => {
    if (getApiMode() !== "mock") return;
    if (phase !== "event_in") return;
    if (!event) return;
    if (lastEventIdxNotifRef.current === eventIdx) return;
    lastEventIdxNotifRef.current = eventIdx;
    if (event.severity !== "L" && event.severity !== "XL") return;
    safePush({
      kind: "press_tip",
      severity: "warn",
      source_label: "TechCrunch  · tip",
      title: "Casey Newton just left a voicemail",
      body: "asking for comment by 5pm",
      ts: "now",
      sound: "stamp",
      click_action: { label: "OPEN VOICEMAIL" },
    });
  }, [phase, event, eventIdx, safePush]);

  // FBI unlock + fraud_score crossing — proxied off timeline state (mock-only)
  useEffect(() => {
    if (getApiMode() !== "mock") return;
    const xlSeen = timeline.some((t) => t.severity === "XL");
    const totalLarge = timeline.filter((t) => t.size === "large").length;
    if (!fbiUnlockedRef.current && (xlSeen || totalLarge >= 4)) {
      fbiUnlockedRef.current = true;
      safePush({
        kind: "fbi",
        severity: "alarm",
        source_label: "FBI",
        title: "FBI 🔒 → 🔓 unlocked",
        body: "Right-rail tab now visible",
        ts: "now",
        sound: "drone",
        ttl_ms: 9000,
      });
    }
    if (!fraudCrossedRef.current && totalLarge >= 3) {
      fraudCrossedRef.current = true;
      safePush({
        kind: "stat_threshold",
        severity: "warn",
        source_label: "metric  · threshold",
        title: "fraud_score crossed 50",
        body: "auditor questions queue is forming",
        ts: "now",
        sound: "drone",
      });
    }
  }, [timeline, safePush]);

  // prediction submitted → fast info notification (with sound)
  useEffect(() => {
    if (!predicted) return;
    if (!event) return;
    const choice = event.choices.find((c) => c.id === predicted);
    if (!choice) return;
    safePush({
      id: `pred-${event.id}-${predicted}`,
      kind: "system",
      severity: "info",
      source_label: "prediction · system",
      title: `locked in: ${choice.label}`,
      body: "good luck out there.",
      ts: "now",
      ttl_ms: 2500,
      sound: "tick",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predicted, event?.id]);

  // agent commit (live + mock) → stamp sound + brief flash
  const lastCommitNotifIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!committed || !event) return;
    const key = `commit-${event.id}-${committed}`;
    if (lastCommitNotifIdRef.current === key) return;
    lastCommitNotifIdRef.current = key;
    const choice = event.choices.find((c) => c.id === committed);
    safePush({
      id: key,
      kind: "system",
      severity: "info",
      source_label: "agent · committed",
      title: `→ ${choice?.label ?? committed}`,
      body: event.justification || "",
      ts: "now",
      ttl_ms: 3500,
      sound: "stamp",
    });
  }, [committed, event?.id, event, safePush]);

  // valuation moved → pop-up with the one-line why (UX-12)
  const lastValNotifRef = useRef<string | null>(null);
  useEffect(() => {
    const dv = deltas?.valuation ?? 0;
    if (!dv || !event) return;
    const key = `val-${event.id}`;
    if (lastValNotifRef.current === key) return;
    lastValNotifRef.current = key;
    const fmtM = (n: number) =>
      `${n < 0 ? "-" : "+"}$${Math.abs(n / 1_000_000).toFixed(1)}M`;
    const why =
      event.effects_summary?.find((e) => e.why)?.why ??
      "the market did market things.";
    safePush({
      id: key,
      kind: "stat_threshold",
      severity: dv < 0 ? "warn" : "info",
      source_label: "valuation · dashboard",
      title: `valuation ${dv < 0 ? "▼" : "▲"} ${fmtM(dv)}`,
      body: why,
      ts: "now",
      ttl_ms: 7000,
      sound: dv < 0 ? "glass" : "cash",
    });
  }, [deltas, event, stats, safePush]);

  // periodic calendar invites (mock-only — atmospheric loop, backend doesn't emit these)
  useEffect(() => {
    if (getApiMode() !== "mock") return;
    if (paused) return;
    if (runEnded) return;
    const baseMs = 12000 + Math.random() * 6000;
    const ms = Math.max(2000, baseMs / speed);
    const t = setTimeout(() => {
      safePush({
        kind: "calendar",
        severity: "info",
        source_label: "calendar  · gcal",
        title: "Tiger associate added: 'sync re: signature'",
        body: "Tue 4pm · 30 min · zoom link in description",
        ts: "now",
        sound: "stamp",
      });
    }, ms);
    return () => clearTimeout(t);
  }, [paused, runEnded, speed, safePush, notifications.length]);

  const replayHeadline = useMemo(() => {
    if (!archive) return null;
    return `REPLAY MODE · THIS RUN ENDED IN ${archive.endgame_id} · ${speed}× SPEED`;
  }, [archive, speed]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-paper text-ink">
      {/* tiny header strip */}
      <div
        className="hidden md:flex items-center gap-3 px-3 h-9 border-b border-ink"
        style={{ borderBottomWidth: "1.4px" }}
      >
        <Link
          href={replayMode ? "/me/runs" : "/"}
          className="font-mono uppercase tracking-wider text-soft hover:text-ink"
          style={{ fontSize: 10 }}
        >
          ← {replayMode ? "ARCHIVE" : "FORBES · 30u30"}
        </Link>
        <span className="text-soft" style={{ fontSize: 10 }}>/</span>
        <span
          className="font-mono uppercase tracking-wider whitespace-nowrap"
          style={{ fontSize: 11, fontWeight: 700 }}
        >
          {bible.display_name.toUpperCase()}
        </span>
        <span className="text-soft" style={{ fontSize: 10 }}>·</span>
        <span
          className="font-body italic text-soft truncate min-w-0 flex-1"
          style={{ fontSize: 11 }}
          title={bible.one_liner}
        >
          &quot;{bible.one_liner}&quot;
        </span>
        <span className="ml-auto flex items-center gap-2 shrink-0 whitespace-nowrap">
          {replayMode ? (
            <span className="pill alarm solid" style={{ fontSize: 10 }}>
              ▶ REPLAY
            </span>
          ) : (
            <>
              <span className="pill solid" style={{ fontSize: 10 }}>
                SPECTATE
              </span>
              <span className="pill alarm" style={{ fontSize: 10 }}>
                ● LIVE
              </span>
            </>
          )}
          <RunParamsBadge
            length={search.get("length") ?? "medium"}
            craziness={search.get("craziness") ?? "normal"}
          />
          <span className="pill" style={{ fontSize: 10 }}>
            RUN #{runId.padStart(5, "0").slice(0, 5)}
          </span>
          <Link
            href="/admin/usage"
            className="font-mono uppercase tracking-wider hover:text-alarm"
            style={{
              fontSize: 10,
              color: "var(--soft)",
              textDecoration: "none",
              letterSpacing: "0.08em",
            }}
          >
            → usage
          </Link>
          <UserMenu />
        </span>
      </div>

      {replayMode && archive && (
        <div
          className="flex flex-col"
          style={{
            borderBottom: "1.4px solid var(--alarm)",
            background: "var(--alarm-soft)",
          }}
        >
          <div className="flex items-center gap-3 px-3 py-1.5 flex-wrap">
            <span
              className="font-mono uppercase tracking-wider"
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--alarm)",
                letterSpacing: "0.08em",
              }}
            >
              {replayHeadline}
            </span>
            {archive?.tagline && (
              <span
                className="font-body italic ml-auto truncate"
                style={{
                  fontSize: 11,
                  color: "var(--ink-2)",
                  maxWidth: "55%",
                }}
              >
                &ldquo;{archive.tagline}&rdquo;
              </span>
            )}
          </div>
          <ScrubBar
            events={archive.event_queue}
            currentIdx={eventIdx}
            onJump={jumpToEvent}
          />
        </div>
      )}

      <Dashboard stats={stats} deltas={deltas} speed={speed} />

      {/* desktop: 3-column */}
      {/* Timeline column = exactly one stat-strip cell (1/7) so its right
          border lands on the DAY | VALUATION divider at every width. */}
      <div className="hidden md:grid flex-1 min-h-0 grid-cols-[calc(100%/7)_1fr_360px]">
        <div
          className="border-r border-ink min-h-0 overflow-hidden"
          style={{ borderRightWidth: "1.4px" }}
        >
          <Timeline entries={timeline} />
        </div>
        <div className="min-h-0 overflow-hidden">
          <AgentStream
            mode={mode}
            phase={phase}
            bible={bible}
            event={event}
            researchProgress={researchProgress}
            researchLog={researchLog}
            templateId={search.get("template")}
            liveMode={getApiMode() !== "mock"}
            predicted={predicted}
            committed={committed}
            speed={speed}
            miniActionTitle={activeMini?.title ?? null}
            onReasoningDone={onReasoningDone}
            onCommit={onCommit}
            replayMode={replayMode}
            originalPredictionId={originalPredictions[eventIdx] ?? null}
          />
        </div>
        <div
          className="border-l border-ink min-h-0 overflow-hidden"
          style={{ borderLeftWidth: "1.4px" }}
        >
          <LiveFeed entries={feed} speed={speed} />
        </div>
      </div>

      {/* mobile: tabs */}
      <div className="md:hidden flex-1 min-h-0 overflow-hidden flex flex-col">
        <Tabs defaultValue="agent" className="flex-1 flex flex-col min-h-0">
          <div className="px-2 pt-2">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="agent">Agent</TabsTrigger>
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="agent" className="flex-1 min-h-0 m-0 mt-2">
            <AgentStream
              mode={mode}
              phase={phase}
              bible={bible}
              event={event}
              researchProgress={researchProgress}
              templateId={search.get("template")}
              predicted={predicted}
              committed={committed}
              speed={speed}
              miniActionTitle={activeMini?.title ?? null}
              onReasoningDone={onReasoningDone}
              onCommit={onCommit}
              replayMode={replayMode}
              originalPredictionId={originalPredictions[eventIdx] ?? null}
            />
          </TabsContent>
          <TabsContent value="feed" className="flex-1 min-h-0 m-0 mt-2">
            <LiveFeed entries={feed} speed={speed} />
          </TabsContent>
          <TabsContent value="timeline" className="flex-1 min-h-0 m-0 mt-2">
            <Timeline entries={timeline} />
          </TabsContent>
        </Tabs>
      </div>

      {runEnded && (
        <RunEndedModal
          runId={runId}
          companyName={bible.display_name}
        />
      )}
      {runEnded ? (
        <EndOfRunStrip
          runId={runId}
          tagline={archive?.tagline ?? "the run is over."}
          endgame={archive?.endgame_id ?? "END · DEMO-001"}
        />
      ) : event ? (
        <Controls
          mode={mode}
          phase={phase}
          event={event}
          companyName={bible.display_name}
          predicted={predicted}
          committed={committed}
          onPredict={onPredict}
          onCommit={onCommit}
          predictionsCorrect={predictionsCorrect}
          predictionsTotal={predictionsTotal}
          speed={speed}
          setSpeed={setSpeed}
          paused={paused}
          setPaused={setPaused}
          isLastEvent={isLastEvent}
          replayMode={replayMode}
          originalPredictionId={originalPredictions[eventIdx] ?? null}
        />
      ) : null}

      {/* Top-right notification stack — distinct from achievement toasts (bottom-right) */}
      <NotificationStack
        notifications={notifications}
        onDismiss={dismissNotif}
      />
    </div>
  );
}

function ScrubBar({
  events,
  currentIdx,
  onJump,
}: {
  events: { id: string; title: string; severity: string }[];
  currentIdx: number;
  onJump: (idx: number) => void;
}) {
  return (
    <div className="px-3 pb-2">
      <div
        className="flex items-center gap-1.5"
        style={{
          height: 14,
          borderTop: "1px dashed var(--alarm)",
          paddingTop: 4,
        }}
      >
        <span
          className="tag"
          style={{ color: "var(--alarm)", marginRight: 6 }}
        >
          SCRUB ›
        </span>
        <div className="flex-1 flex items-center" style={{ gap: 4 }}>
          {events.map((e, i) => {
            const active = i === currentIdx;
            const past = i < currentIdx;
            return (
              <button
                key={e.id}
                onClick={() => onJump(i)}
                title={`T${i + 1} · ${e.title}`}
                className="cursor-pointer transition-all"
                style={{
                  flex: 1,
                  height: 8,
                  border: "1px solid var(--alarm)",
                  background: active
                    ? "var(--alarm)"
                    : past
                    ? "rgba(255,90,71,0.4)"
                    : "transparent",
                  borderRadius: 0,
                  padding: 0,
                  position: "relative",
                }}
                aria-label={`jump to event ${i + 1}`}
              >
                {active && (
                  <span
                    className="font-mono"
                    style={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontSize: 9,
                      color: "var(--alarm)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    T{i + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <span
          className="font-mono"
          style={{ fontSize: 10, color: "var(--alarm)", marginLeft: 6 }}
        >
          {currentIdx + 1}/{events.length}
        </span>
      </div>
    </div>
  );
}

function EndOfRunStrip({
  runId,
  tagline,
  endgame,
}: {
  runId: string;
  tagline: string;
  endgame: string;
}) {
  return (
    <div
      className="border-t border-ink px-4 py-3 flex items-center gap-3 flex-wrap"
      style={{ background: "var(--paper)", borderTopWidth: "1.4px" }}
    >
      <span
        className="stamp"
        style={{ fontSize: 10, transform: "rotate(-2deg)" }}
      >
        RUN COMPLETE
      </span>
      <span
        className="font-body italic truncate"
        style={{ fontSize: 12, color: "var(--ink-2)", maxWidth: 420 }}
      >
        &ldquo;{tagline}&rdquo;
      </span>
      <span
        className="font-mono uppercase tracking-wider"
        style={{ fontSize: 10, color: "var(--soft)" }}
      >
        {endgame}
      </span>
      <div className="ml-auto flex items-center gap-2">
        <Link
          href={`/run/${runId}/post-mortem`}
          className="pill"
          style={{ fontSize: 10, textDecoration: "none" }}
        >
          → VIEW POST-MORTEM
        </Link>
        <Link
          href="/me/runs"
          className="pill solid"
          style={{ fontSize: 10, textDecoration: "none" }}
        >
          → ARCHIVE THIS RUN
        </Link>
      </div>
    </div>
  );
}

/**
 * Compact pill showing the run's length + craziness parameters in the
 * top-right header strip. Hover/tap shows a tooltip with the human-readable
 * meaning of each.
 */
function RunParamsBadge({
  length,
  craziness,
}: {
  length: string;
  craziness: string;
}) {
  // Craziness escalates color: tame → ink, normal → ink, crazy → alarm-soft, unhinged → alarm
  const crazinessIsAlarm = craziness === "crazy" || craziness === "unhinged";
  const crazinessIsHot = craziness === "unhinged";
  return (
    <span
      className="pill"
      style={{
        fontSize: 10,
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
      }}
      title={`length: ${length} · craziness: ${craziness}`}
    >
      <span style={{ color: "var(--soft)" }}>LEN</span>
      <span style={{ color: "var(--ink)", fontWeight: 700 }}>
        {length.toUpperCase()}
      </span>
      <span style={{ color: "var(--soft)" }}>·</span>
      <span style={{ color: "var(--soft)" }}>CRZ</span>
      <span
        style={{
          color: crazinessIsHot
            ? "var(--alarm)"
            : crazinessIsAlarm
            ? "var(--alarm)"
            : "var(--ink)",
          fontWeight: 700,
        }}
      >
        {craziness.toUpperCase()}
      </span>
    </span>
  );
}

/**
 * Modal that pops up the moment a run terminates. Tells the user to go view
 * the post-mortem trading card. Brutalist styling, dismissable, but with a
 * clear primary CTA.
 */
function RunEndedModal({
  runId,
  companyName,
}: {
  runId: string;
  companyName: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(2px)",
      }}
      onClick={() => setDismissed(true)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-event-in"
        style={{
          width: "min(480px, 92vw)",
          background: "var(--paper)",
          border: "2px solid var(--alarm)",
          padding: "28px 26px",
          fontFamily: "var(--font-body)",
        }}
      >
        <div
          className="font-mono uppercase mb-4"
          style={{
            display: "inline-block",
            border: "2px solid var(--alarm)",
            background: "var(--alarm-soft)",
            color: "var(--alarm)",
            padding: "6px 14px",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.16em",
            transform: "rotate(-2deg)",
          }}
        >
          RUN ENDED · {companyName.toUpperCase()}
        </div>
        <h2
          className="font-body"
          style={{
            fontSize: 26,
            lineHeight: 1.2,
            color: "var(--ink)",
            marginTop: 8,
            marginBottom: 12,
          }}
        >
          the agent has run its course.
        </h2>
        <p
          className="font-body"
          style={{
            fontSize: 15,
            color: "var(--ink-2)",
            lineHeight: 1.5,
            marginBottom: 6,
          }}
        >
          your post-mortem is ready. trading card, share image, the whole
          forbes-cursed treatment. 1080×1350 png if you want to flex on
          twitter.
        </p>
        <p
          className="font-body italic"
          style={{
            fontSize: 12,
            color: "var(--soft)",
            marginBottom: 22,
          }}
        >
          there is no second act. only the post-mortem.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            href={`/run/${runId}/post-mortem`}
            className="brutalist-btn"
            style={{
              fontSize: 14,
              padding: "12px 20px",
              flex: 1,
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            → VIEW POST-MORTEM
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="font-mono uppercase tracking-wider"
            style={{
              fontSize: 11,
              padding: "12px 20px",
              border: "1.4px solid var(--ink)",
              background: "transparent",
              color: "var(--ink)",
              cursor: "pointer",
            }}
          >
            keep watching
          </button>
        </div>
      </div>
    </div>
  );
}
