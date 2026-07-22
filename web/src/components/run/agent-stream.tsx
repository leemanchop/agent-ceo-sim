"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ActiveEvent,
  CompanyBible,
  Mode,
  Phase,
} from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, X } from "lucide-react";

const AMBIENT_THOUGHTS = [
  "scanning competitor pricing pages.",
  "watching the LP letter cycle.",
  "drafting series B narrative. discarding.",
  "reading mentions. closing tab.",
  "thinking about the Brex pilot.",
  "thinking about whether the Brex pilot is real.",
];

export function AgentStream({
  mode,
  phase,
  bible,
  event,
  researchProgress,
  researchLog,
  templateId = null,
  liveMode = false,
  predicted,
  committed,
  speed,
  miniActionTitle,
  onReasoningDone,
  onCommit,
  replayMode = false,
  originalPredictionId = null,
}: {
  mode: Mode;
  phase: Phase;
  bible: CompanyBible;
  event: ActiveEvent | undefined;
  researchProgress?: { step: string; current?: number; total?: number };
  researchLog?: { step: string; current?: number; total?: number; ts: number }[];
  /** non-null when running a pre-built template — researcher is just streaming
   *  a pre-authored bible at fake-research speed for UX continuity. */
  templateId?: string | null;
  /** true when the reasoning string is fed by SSE tokens (live mode); skips
   *  the local typewriter so we don't double-type. */
  liveMode?: boolean;
  predicted: string | null;
  committed: string | null;
  speed: 1 | 2 | 4;
  miniActionTitle?: string | null;
  onReasoningDone: () => void;
  onCommit: (id: string) => void;
  replayMode?: boolean;
  originalPredictionId?: string | null;
}) {
  const [streamed, setStreamed] = useState("");
  const [ambientIdx, setAmbientIdx] = useState(0);

  // reset stream when event/phase shifts back to non-streaming
  useEffect(() => {
    if (
      phase === "ambient" ||
      phase === "mini_action" ||
      phase === "event_in" ||
      (mode === "ceo" && phase === "awaiting")
    ) {
      setStreamed("");
    }
  }, [phase, mode, event?.id]);

  // Live-mode: the SSE token stream IS the typewriter — just mirror reasoning
  // directly. No local interval, no speed-driven re-render reset.
  useEffect(() => {
    if (!liveMode) return;
    if (!event) return;
    setStreamed(event.reasoning ?? "");
  }, [liveMode, event?.reasoning, event?.id]);

  // Mock-mode local typewriter. Reads tickMs from a ref so speed changes
  // mid-stream just adjust the pace — we never restart from i=0.
  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    if (liveMode) return;
    const shouldStream =
      (mode === "spectate" && phase === "deliberating") ||
      (mode === "ceo" && phase === "revealed");
    if (!shouldStream) return;
    if (!event) return;

    let i = 0;
    setStreamed("");
    const reasoning = event.reasoning ?? "";
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const tick = () => {
      i += 1;
      setStreamed(reasoning.slice(0, i));
      if (i >= reasoning.length) {
        setTimeout(() => onReasoningDone(), 500 / speedRef.current);
        return;
      }
      const tickMs = Math.max(8, Math.round(28 / speedRef.current));
      timeout = setTimeout(tick, tickMs);
    };
    const initialTick = Math.max(8, Math.round(28 / speedRef.current));
    timeout = setTimeout(tick, initialTick);
    return () => {
      if (timeout) clearTimeout(timeout);
    };
    // NOTE: `speed` intentionally NOT in deps — speedRef captures it live.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, mode, liveMode, event?.id, event?.reasoning, onReasoningDone]);

  // ambient cycling
  useEffect(() => {
    if (phase !== "ambient" && phase !== "mini_action") return;
    const ambientMs = Math.max(150, Math.round(2400 / speed));
    const interval = setInterval(() => {
      setAmbientIdx((i) => (i + 1) % AMBIENT_THOUGHTS.length);
    }, ambientMs);
    return () => clearInterval(interval);
  }, [phase, speed]);

  const showEventCard =
    phase === "event_in" ||
    phase === "deliberating" ||
    phase === "awaiting" ||
    phase === "revealed" ||
    phase === "consequences" ||
    phase === "advancing";
  const showReasoning =
    (mode === "spectate" &&
      (phase === "deliberating" ||
        phase === "awaiting" ||
        phase === "revealed" ||
        phase === "consequences" ||
        phase === "advancing")) ||
    (mode === "ceo" &&
      (phase === "revealed" ||
        phase === "consequences" ||
        phase === "advancing"));

  const showCommit =
    phase === "revealed" || phase === "consequences" || phase === "advancing";

  // for spectate: hide which choice committed UNTIL phase >= revealed
  const revealCommitted =
    phase === "revealed" || phase === "consequences" || phase === "advancing";
  const committedChoice = revealCommitted && event?.choices
    ? event.choices.find((c) => c.id === committed)
    : null;

  // CEO can pick any choice during awaiting
  const ceoCanPick = mode === "ceo" && phase === "awaiting";

  // auto-paused stamp: severity L or XL
  const showAutoPaused =
    showEventCard && (event?.severity === "L" || event?.severity === "XL");

  const isAmbient = phase === "ambient" || phase === "mini_action";

  return (
    <div className="flex flex-col h-full overflow-hidden bg-paper">
      <div
        className="px-4 py-2 border-b border-ink flex items-center gap-3"
        style={{ borderBottomWidth: "1.4px" }}
      >
        <div className="tag">AGENT · STREAM</div>
        <PhaseLabel phase={phase} mode={mode} />
        <WaitingPill phase={phase} mode={mode} predicted={predicted} />
        <div
          className="ml-auto font-mono flex items-center gap-1.5"
          style={{ fontSize: 10, color: "var(--alarm)" }}
        >
          <span
            className="rounded-full"
            style={{ width: 6, height: 6, background: "var(--alarm)", animation: "blink 1s step-end infinite" }}
          />
          LIVE
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-5 py-5"
        style={{
          // Days-axis quiet mode: between beats the played-out card recedes
          // while the calendar ticks and the feed carries the motion.
          opacity: isAmbient && event ? 0.45 : 1,
          transition: "opacity 600ms ease",
        }}
      >
        {/* researching (live-mode initial bible build) */}
        {phase === "researching" && (
          <div className="flex flex-col items-start gap-4 max-w-2xl">
            <div className="tag" style={{ color: "var(--alarm)" }}>
              ▌ {templateId ? "LOADING HISTORICAL RECORD" : "RESEARCHER · COMPILING BIBLE"}
            </div>
            <div
              className="font-body"
              style={{ fontSize: 18, color: "var(--ink)", lineHeight: 1.3 }}
            >
              {templateId ? (
                <>
                  loading the canonical{" "}
                  <span style={{ color: "var(--alarm)", fontWeight: 700 }}>
                    {bible.display_name}
                  </span>{" "}
                  bible. (pre-authored — see{" "}
                  <code style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>
                    world/templates/{templateId}.md
                  </code>
                  .)
                </>
              ) : (
                <>
                  the agent is reading everything it can find about{" "}
                  <span style={{ color: "var(--alarm)", fontWeight: 700 }}>
                    {bible.display_name}
                  </span>
                  .
                </>
              )}
            </div>
            <div
              className="font-body"
              style={{ fontSize: 13, color: "var(--soft)", lineHeight: 1.5 }}
            >
              {templateId
                ? "loading the hand-authored record. about a minute."
                : "landing page, founder posts, recent press. usually 2–4 minutes. don't close the tab."}
            </div>
            {/* Live log — visible from second zero so the wait never looks
                dead. Researcher steps AND showrunner episode progress both
                land here (templates skip research but still script). */}
            {(
              <div
                className="font-mono mt-2 w-full animate-event-in"
                style={{
                  border: "1.4px solid var(--ink)",
                  background: "var(--paper-2)",
                  padding: "10px 12px",
                  maxHeight: 260,
                  overflowY: "auto",
                  fontSize: 12,
                  color: "var(--ink-2)",
                  lineHeight: 1.5,
                }}
              >
                <div
                  className="font-mono uppercase mb-2"
                  style={{
                    fontSize: 9,
                    color: "var(--alarm)",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                  }}
                >
                  ▌ LIVE LOG
                </div>
                {(!researchLog || researchLog.length === 0) && (
                  <div
                    style={{
                      borderLeft: "2px solid var(--alarm)",
                      paddingLeft: 8,
                      marginBottom: 3,
                    }}
                  >
                    <span className="text-soft">system ›</span> connecting to
                    the researcher…
                    <span className="animate-blink ml-1">▌</span>
                  </div>
                )}
                {(researchLog ?? []).map((entry, i) => {
                  const isLast = i === (researchLog ?? []).length - 1;
                  return (
                    <div
                      key={`${entry.ts}-${i}`}
                      style={{
                        opacity: isLast ? 1 : 0.62,
                        borderLeft: isLast
                          ? "2px solid var(--alarm)"
                          : "2px solid var(--soft)",
                        paddingLeft: 8,
                        marginBottom: 3,
                        wordBreak: "break-word",
                      }}
                    >
                      <span className="text-soft">researcher ›</span>{" "}
                      {entry.step}
                      {typeof entry.current === "number" &&
                        typeof entry.total === "number" && (
                          <span className="text-soft">
                            {" "}
                            [{entry.current}/{entry.total}]
                          </span>
                        )}
                      {isLast && <span className="animate-blink ml-1">▌</span>}
                    </div>
                  );
                })}
              </div>
            )}
            <div
              className="font-mono mt-3"
              style={{ fontSize: 10, color: "var(--soft)" }}
            >
              [ feed and timeline populate once the run begins ]
            </div>
          </div>
        )}

        {/* ambient */}
        {isAmbient && (
          <div className="flex flex-col items-start gap-3 max-w-2xl">
            <div className="tag">
              ambient · {bible.display_name} CEO agent
            </div>
            <div
              className="font-body italic animate-pulse-soft"
              style={{ fontSize: 14, color: "var(--soft)" }}
            >
              {AMBIENT_THOUGHTS[ambientIdx]}
            </div>
            {phase === "mini_action" && miniActionTitle && (
              <div
                className="font-mono animate-event-in"
                style={{
                  fontSize: 12,
                  color: "var(--ink-2)",
                  borderLeft: "1.4px solid var(--ink)",
                  paddingLeft: 8,
                }}
              >
                <span className="text-soft">agent ›</span> {miniActionTitle}
              </div>
            )}
          </div>
        )}

        {/* event card — JetBrains Mono terminal feel */}
        {showEventCard && event && (
          <div className="max-w-2xl" style={{ fontFamily: "var(--font-mono)" }}>
            <div
              className="animate-event-in relative"
              key={event.id}
              style={{
                border: "1.4px solid var(--ink)",
                background: "var(--paper)",
              }}
            >
              {/* AUTO-PAUSED stamp */}
              {showAutoPaused && (
                <div
                  className="stamp absolute"
                  style={{
                    top: -10,
                    right: 14,
                    transform: "rotate(-3deg)",
                    background: "var(--paper)",
                    fontSize: 10,
                  }}
                >
                  AUTO-PAUSED
                </div>
              )}

              <div
                className="px-4 py-2.5 flex items-center gap-2"
                style={{ borderBottom: "1px dashed var(--ink)" }}
              >
                <span
                  className={cn(
                    "pill",
                    event.severity === "XL" || event.category === "REGULATORY" || event.category === "FBI"
                      ? "alarm solid"
                      : "solid"
                  )}
                >
                  {event.category}
                </span>
                <span className="pill" style={{ fontSize: 10 }}>
                  SEV · {event.severity}
                </span>
                <span
                  className="ml-auto font-mono uppercase tracking-wider"
                  style={{ fontSize: 9, color: "var(--soft)" }}
                >
                  EVT · {event.id}
                </span>
              </div>
              <div className="px-4 py-3">
                <div
                  className="font-mono"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                    color: "var(--ink)",
                  }}
                >
                  {event.title}
                </div>
                <div
                  className="mt-1.5"
                  style={{
                    fontSize: 12,
                    color: "var(--ink-2)",
                    lineHeight: 1.5,
                  }}
                >
                  {event.body}
                </div>
              </div>
              <div
                className="px-4 py-3"
                style={{ borderTop: "1px dashed var(--ink)" }}
              >
                <div className="tag" style={{ marginBottom: 6 }}>
                  CHOICES · {mode === "spectate" ? "agent will pick" : "you commit"}
                </div>
                <div className="flex flex-col" style={{ gap: 6 }}>
                  {event.choices.map((c) => {
                    const isCommitted =
                      revealCommitted && committedChoice?.id === c.id;
                    const isFaded = revealCommitted && !isCommitted;
                    const isPredicted = mode === "spectate" && predicted === c.id;
                    const isClickable = ceoCanPick;
                    const wrongPrediction =
                      mode === "spectate" &&
                      revealCommitted &&
                      predicted &&
                      predicted === c.id &&
                      predicted !== committedChoice?.id;

                    const showAgentReasoning =
                      mode === "spectate" &&
                      (phase === "deliberating" || phase === "awaiting") &&
                      c.agentReasoning;

                    const isAgentPick = c.id === event.agent_choice_id;
                    const isOriginalPick =
                      replayMode &&
                      originalPredictionId === c.id &&
                      originalPredictionId !== event.agent_choice_id;
                    const pctText =
                      c.community_pct !== undefined
                        ? `${Math.round(c.community_pct * 100)}%`
                        : null;

                    return (
                      <div key={c.id}>
                        {/* ORIGINAL annotation rendered above the chip */}
                        {isOriginalPick && (
                          <div
                            className="font-mono uppercase tracking-wider"
                            style={{
                              fontSize: 9,
                              color: "var(--alarm)",
                              marginBottom: 2,
                              paddingLeft: 4,
                              letterSpacing: "0.08em",
                            }}
                          >
                            ORIGINAL ↑
                          </div>
                        )}
                        {/* AGENT PICKED annotation — only visible after commit */}
                        {revealCommitted && isAgentPick && (
                          <div
                            className="font-mono uppercase tracking-wider"
                            style={{
                              fontSize: 10,
                              color: "var(--alarm)",
                              fontWeight: 700,
                              marginBottom: 3,
                              paddingLeft: 4,
                              letterSpacing: "0.1em",
                            }}
                          >
                            ▌ AGENT PICKED ↓
                          </div>
                        )}
                        <button
                          type="button"
                          disabled={!isClickable}
                          onClick={() => isClickable && onCommit(c.id)}
                          className={cn(
                            "w-full text-left flex items-center gap-2 px-3 py-2 transition-colors font-mono",
                            isClickable && "cursor-pointer"
                          )}
                          style={{
                            border: isCommitted
                              ? "1.4px solid var(--alarm)"
                              : isFaded
                              ? "1px solid var(--soft)"
                              : "1.4px solid var(--ink)",
                            background: isCommitted
                              ? "var(--alarm-soft)"
                              : "transparent",
                            color: isFaded ? "var(--soft)" : "var(--ink)",
                            opacity: isFaded && !isCommitted ? 0.6 : 1,
                            fontSize: 12,
                          }}
                        >
                          <span style={{ flex: 1 }}>{c.label}</span>
                          {pctText && (
                            <span
                              className="font-mono"
                              style={{
                                fontSize: 11,
                                color: isAgentPick
                                  ? "var(--ink)"
                                  : "var(--soft)",
                                fontWeight: isAgentPick ? 700 : 400,
                                fontFeatureSettings: '"tnum" 1',
                              }}
                            >
                              {pctText}
                            </span>
                          )}
                          {isPredicted && !revealCommitted && (
                            <span
                              className="pill"
                              style={{ fontSize: 9, padding: "0 6px" }}
                            >
                              YOUR PICK
                            </span>
                          )}
                          {wrongPrediction && (
                            <X className="h-3 w-3" style={{ color: "var(--alarm)" }} />
                          )}
                          {isCommitted && (
                            <CheckCircle2
                              className="h-3 w-3"
                              style={{ color: "var(--alarm)" }}
                            />
                          )}
                        </button>
                        {/* tiny horizontal community-pct fill bar */}
                        {c.community_pct !== undefined && (
                          <div
                            style={{
                              height: 2,
                              background: "var(--paper-2)",
                              marginTop: 1,
                              marginLeft: 0,
                              marginRight: 0,
                              position: "relative",
                              overflow: "hidden",
                            }}
                            aria-hidden
                          >
                            <div
                              style={{
                                width: `${Math.round(c.community_pct * 100)}%`,
                                height: "100%",
                                background: isAgentPick
                                  ? "var(--ink)"
                                  : "var(--soft)",
                                transition: "width 600ms ease-out",
                              }}
                            />
                          </div>
                        )}
                        {showAgentReasoning && (
                          <div
                            className="font-mono italic px-3 mt-1"
                            style={{
                              fontSize: 11,
                              color: "var(--soft)",
                              lineHeight: 1.4,
                            }}
                          >
                            ↳ {c.agentReasoning}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* reasoning */}
            {showReasoning && (
              <div className="mt-4">
                <div className="tag mb-2">
                  {mode === "spectate"
                    ? "AGENT · thinking"
                    : "AGENT · what I would have done"}
                </div>
                <div
                  className="font-mono whitespace-pre-wrap"
                  style={{
                    fontSize: 12,
                    lineHeight: 1.5,
                    color: "var(--ink-2)",
                  }}
                >
                  <span className="text-soft">agent ›</span> {streamed}
                  {((mode === "spectate" && phase === "deliberating") ||
                    (mode === "ceo" && phase === "revealed")) && (
                    <span
                      style={{ color: "var(--alarm)", marginLeft: 2 }}
                      className="animate-blink"
                    >
                      ▌
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* commit / consequences */}
            {showCommit && (committedChoice || committed) && (
              <div className="mt-5 animate-event-in" style={{ fontFamily: "var(--font-body)" }}>
                {/* BIG verdict banner — only in spectate mode after prediction */}
                {mode === "spectate" && predicted && (() => {
                  const correct = predicted === (committedChoice?.id ?? committed);
                  return (
                    <div
                      className="font-mono uppercase mb-3 animate-event-in"
                      style={{
                        display: "inline-block",
                        padding: "8px 14px",
                        border: `2px solid ${correct ? "var(--ink)" : "var(--alarm)"}`,
                        background: correct ? "transparent" : "var(--alarm-soft)",
                        color: correct ? "var(--ink)" : "var(--alarm)",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        transform: "rotate(-1.5deg)",
                      }}
                    >
                      {correct ? "✓ YOU CALLED IT" : "✗ YOU MISSED"}
                    </div>
                  );
                })()}
                <div
                  className="flex items-center gap-2 font-mono uppercase tracking-wider"
                  style={{ fontSize: 10 }}
                >
                  <CheckCircle2
                    className="h-3 w-3"
                    style={{ color: "var(--alarm)" }}
                  />
                  <span style={{ color: "var(--alarm)" }}>
                    {mode === "ceo" ? "you committed" : "agent committed"}
                  </span>
                </div>
                <div
                  className="mt-1.5 font-body"
                  style={{ fontSize: 14, color: "var(--ink)" }}
                >
                  doing: {committedChoice?.label ?? `${committed} (unknown choice id)`}.
                </div>
                {!committedChoice && committed && (
                  <div
                    className="mt-1 font-mono"
                    style={{ fontSize: 11, color: "var(--alarm)" }}
                  >
                    [debug] agent.commit returned id={JSON.stringify(committed)} —
                    not in choices [{event?.choices.map((c) => c.id).join(", ")}]
                  </div>
                )}
                <div
                  className="mt-1 font-body italic"
                  style={{ fontSize: 12, color: "var(--soft)" }}
                >
                  {event?.justification}
                </div>

                {/* tweet artifact card — X styling; hidden when the CEO
                    didn't tweet this turn (empty artifact) */}
                {(phase === "consequences" || phase === "advancing") &&
                  !!event?.artifact_tweet?.trim() && (
                  <div
                    className="mt-4 max-w-md font-x animate-event-in"
                    style={{
                      background: "var(--x-bg)",
                      border: "1px solid var(--x-rule)",
                      padding: 12,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="rounded-full flex items-center justify-center font-bold"
                        style={{
                          width: 32,
                          height: 32,
                          background: "var(--alarm)",
                          color: "var(--paper)",
                          fontSize: 13,
                        }}
                      >
                        {bible.founder[0]}
                      </div>
                      <div style={{ fontSize: 13 }}>
                        <div className="flex items-center gap-1">
                          <span style={{ color: "var(--x-text)", fontWeight: 700 }}>
                            {bible.founder}
                          </span>
                          <span style={{ color: "var(--x-blue)", fontSize: 12 }}>✓</span>
                        </div>
                        <div style={{ color: "var(--x-muted)", fontSize: 12 }}>
                          @{bible.founder.toLowerCase().replace(/\s+/g, "")}
                        </div>
                      </div>
                    </div>
                    <div
                      className="mt-2"
                      style={{ color: "var(--x-text)", fontSize: 14, lineHeight: 1.4 }}
                    >
                      {event.artifact_tweet}
                    </div>
                    <div
                      className="mt-2 font-mono"
                      style={{ color: "var(--x-muted)", fontSize: 11 }}
                    >
                      4:51 PM · X
                    </div>
                  </div>
                )}

                {/* deltas */}
                {(phase === "consequences" || phase === "advancing") && (
                  <div
                    className="mt-4 font-mono flex flex-wrap gap-x-3 gap-y-1 animate-event-in"
                    style={{ fontSize: 11, color: "var(--soft)" }}
                  >
                    <span className="tag">RIPPLES ›</span>
                    {event.effects_summary.map((e, i) => (
                      <span key={i}>
                        {e.label}{" "}
                        <span
                          style={{
                            color:
                              e.tone === "good"
                                ? "var(--ink)"
                                : e.tone === "bad"
                                ? "var(--alarm)"
                                : "var(--soft)",
                          }}
                        >
                          {e.value}
                        </span>
                      </span>
                    ))}
                    {event.effects_summary.find((e) => e.why)?.why && (
                      <span
                        className="basis-full font-body"
                        style={{ fontSize: 11, color: "var(--soft)" }}
                      >
                        — {event.effects_summary.find((e) => e.why)?.why}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function PhaseLabel({ phase, mode }: { phase: Phase; mode: Mode }) {
  const map: Record<Phase, string> = {
    researching: "researcher · loading bible",
    ambient: "ambient",
    mini_action: "mini · acting",
    event_in: "event arriving",
    deliberating: mode === "spectate" ? "agent deliberating" : "—",
    awaiting: mode === "spectate" ? "predict now" : "you decide",
    revealed: mode === "spectate" ? "reveal" : "agent reveal",
    consequences: "consequences",
    advancing: "advancing",
  };
  return (
    <div className="tag">
      {map[phase]}
    </div>
  );
}

/**
 * Visible "waiting on X" status pill. Appears next to the PhaseLabel when
 * the user is blocked on an LLM/server action. Animated dots so it's
 * unambiguously a "live wait" not a frozen state.
 */
function WaitingPill({
  phase,
  mode,
  predicted,
}: {
  phase: Phase;
  mode: Mode;
  predicted: string | null;
}) {
  const text = (() => {
    if (phase === "researching") return null; // own dedicated UI
    if (phase === "event_in") return "waiting on agent thoughts";
    if (mode === "spectate" && phase === "awaiting" && predicted) {
      return "agent locking in their pick";
    }
    if (phase === "consequences") return "consequences settling";
    if (phase === "advancing") return "oracle generating next event";
    return null;
  })();
  if (!text) return null;
  return (
    <div
      className="font-mono flex items-center gap-1.5"
      style={{
        fontSize: 10,
        color: "var(--alarm)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "2px 8px",
        border: "1.4px solid var(--alarm)",
        background: "var(--alarm-soft)",
        fontWeight: 700,
      }}
    >
      <span
        className="rounded-full"
        style={{
          width: 4,
          height: 4,
          background: "var(--alarm)",
          animation: "blink 0.6s step-end infinite",
        }}
      />
      ▌ {text}
      <span className="animate-pulse" aria-hidden>…</span>
    </div>
  );
}
