"use client";

import { useEffect, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActiveEvent, Mode, Phase } from "@/lib/types";

type Speed = 1 | 2 | 4;

export function Controls({
  mode,
  phase,
  event,
  companyName,
  predicted,
  committed,
  onPredict,
  onCommit,
  predictionsCorrect,
  predictionsTotal,
  speed,
  setSpeed,
  paused,
  setPaused,
  isLastEvent,
  replayMode = false,
  originalPredictionId = null,
}: {
  mode: Mode;
  phase: Phase;
  event: ActiveEvent | undefined;
  companyName?: string;
  predicted: string | null;
  committed: string | null;
  onPredict: (id: string) => void;
  onCommit: (id: string) => void;
  predictionsCorrect: number;
  predictionsTotal: number;
  speed: Speed;
  setSpeed: (s: Speed) => void;
  paused: boolean;
  setPaused: (fn: (p: boolean) => boolean) => void;
  isLastEvent: boolean;
  replayMode?: boolean;
  originalPredictionId?: string | null;
}) {
  const [muted, setMuted] = useState(true);

  // Mirror muted state into localStorage so other surfaces (notification stack)
  // can read it without prop-drilling.
  useEffect(() => {
    try {
      window.localStorage.setItem("aces:muted", muted ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [muted]);

  // Spectate: chips active during deliberating + awaiting (one click commits the prediction)
  // CEO: chips redirect to commit handler during awaiting
  const chipsActive =
    mode === "spectate"
      ? (phase === "deliberating" || phase === "awaiting") && !predicted
      : phase === "awaiting" && !committed;

  const chipsVisible =
    !!event &&
    (phase === "deliberating" ||
      phase === "awaiting" ||
      phase === "revealed" ||
      phase === "consequences");

  return (
    <div
      className="border-t border-ink px-3 py-2 flex items-center gap-3 flex-wrap"
      style={{ background: "var(--paper)", borderTopWidth: "1.4px" }}
    >
      {/* speed */}
      <div className="flex items-center" style={{ gap: 4 }}>
        {[1, 2, 4].map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s as Speed)}
            className={cn(
              "pill",
              speed === s && "solid"
            )}
            style={{ fontSize: 10, cursor: "pointer" }}
          >
            {s}×
          </button>
        ))}
      </div>

      <button
        onClick={() => setPaused((p) => !p)}
        className="pill"
        style={{
          width: 28,
          height: 22,
          padding: 0,
          justifyContent: "center",
          cursor: "pointer",
        }}
        aria-label={paused ? "Resume" : "Pause"}
      >
        {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
      </button>

      <button
        onClick={() => setMuted((m) => !m)}
        className="pill"
        style={{
          width: 28,
          height: 22,
          padding: 0,
          justifyContent: "center",
          cursor: "pointer",
          color: muted ? "var(--soft)" : "var(--ink)",
        }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
        {!muted && <audio src="/sfx/hum.m4a" autoPlay loop className="hidden" />}
      </button>

      <div
        className="hidden md:block font-mono ml-1 truncate uppercase tracking-wider"
        style={{
          fontSize: 10,
          color: "var(--soft)",
          letterSpacing: "0.06em",
          maxWidth: 280,
        }}
      >
        {(companyName ?? "company").toUpperCase()} ·{" "}
        {mode === "spectate" ? "spectate" : "you · ceo"} ·{" "}
        {phase === "ambient"
          ? "warming up"
          : phase === "mini_action"
          ? "agent · acting"
          : phase === "event_in"
          ? "event in"
          : phase === "deliberating"
          ? "agent thinking"
          : phase === "awaiting"
          ? mode === "spectate"
            ? "predict"
            : "your move"
          : phase === "revealed"
          ? "reveal"
          : phase === "consequences"
          ? "ripples"
          : isLastEvent
          ? "demo end"
          : "→ next"}
      </div>

      {/* chips */}
      <div className="ml-auto flex items-center gap-2">
        {chipsVisible && (
          <>
            <PredictionCountdown
              active={
                (phase === "deliberating" || phase === "awaiting") &&
                !predicted &&
                !committed
              }
              mode={mode}
            />
            <span
              className="hidden sm:flex font-mono uppercase tracking-wider"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color:
                  (phase === "deliberating" || phase === "awaiting") && !predicted
                    ? "var(--alarm)"
                    : "var(--soft)",
              }}
            >
              {mode === "spectate" ? "▶ PREDICT →" : "▶ COMMIT →"}
            </span>
            <div className="flex items-center" style={{ gap: 6 }}>
              {event!.choices.map((c) => {
                const isPredicted = mode === "spectate" && predicted === c.id;
                const isCommitted = mode === "ceo" && committed === c.id;
                const isAgentPick = c.id === event!.agent_choice_id;
                const isOriginalPick =
                  replayMode &&
                  originalPredictionId === c.id &&
                  originalPredictionId !== event!.agent_choice_id;
                return (
                  <ChoiceChip
                    key={c.id}
                    label={c.label}
                    communityPct={c.community_pct}
                    mode={mode}
                    selected={isPredicted || isCommitted}
                    disabled={!chipsActive}
                    speed={speed}
                    isAgentPick={isAgentPick}
                    isOriginalPick={isOriginalPick}
                    onClick={() =>
                      mode === "ceo" ? onCommit(c.id) : onPredict(c.id)
                    }
                  />
                );
              })}
            </div>
          </>
        )}
        {mode === "spectate" && (
          <div className="ml-3 font-mono" style={{ fontSize: 11, color: "var(--ink)" }}>
            <span className="tag" style={{ marginRight: 6 }}>SCORE</span>
            <span style={{ color: "var(--ink)", fontWeight: 700 }}>
              {predictionsCorrect}
            </span>
            <span style={{ color: "var(--soft)" }}>/{predictionsTotal}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ChoiceChip({
  label,
  communityPct,
  mode,
  selected,
  disabled,
  speed,
  isAgentPick = false,
  isOriginalPick = false,
  onClick,
}: {
  label: string;
  communityPct?: number;
  mode: Mode;
  selected: boolean;
  disabled: boolean;
  speed: Speed;
  isAgentPick?: boolean;
  isOriginalPick?: boolean;
  onClick: () => void;
}) {
  const ceoSelectedColor = mode === "ceo";
  return (
    <div className="flex flex-col items-stretch" style={{ position: "relative" }}>
      {isOriginalPick && (
        <span
          className="font-mono uppercase tracking-wider"
          style={{
            fontSize: 8,
            color: "var(--alarm)",
            letterSpacing: "0.08em",
            position: "absolute",
            top: -10,
            left: 4,
          }}
        >
          ORIGINAL ↑
        </span>
      )}
      <button
        onClick={onClick}
        disabled={disabled}
        className="pill"
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled && !selected ? 0.4 : 1,
          background: selected
            ? ceoSelectedColor
              ? "var(--alarm)"
              : "var(--ink)"
            : "transparent",
          color: selected ? "var(--paper)" : "var(--ink)",
          borderColor: selected
            ? ceoSelectedColor
              ? "var(--alarm)"
              : "var(--ink)"
            : "var(--ink)",
          position: "relative",
          paddingLeft: selected ? 22 : 8,
          height: 24,
        }}
      >
        {selected && (
          <TimerRing
            accent={ceoSelectedColor ? "var(--alarm)" : "var(--ink)"}
            speed={speed}
          />
        )}
        <span
          className="truncate"
          style={{ maxWidth: 160, textTransform: "uppercase" }}
        >
          {label}
        </span>
        {communityPct !== undefined && (
          <span
            className="font-mono"
            style={{
              fontSize: 10,
              marginLeft: 6,
              fontWeight: isAgentPick ? 700 : 400,
              color: selected
                ? "var(--paper)"
                : isAgentPick
                ? "var(--ink)"
                : "var(--soft)",
              fontFeatureSettings: '"tnum" 1',
            }}
          >
            {Math.round(communityPct * 100)}%
          </span>
        )}
      </button>
      {communityPct !== undefined && (
        <div
          aria-hidden
          style={{
            height: 2,
            background: "var(--paper-2)",
            marginTop: 1,
            width: "100%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.round(communityPct * 100)}%`,
              height: "100%",
              background: isAgentPick ? "var(--ink)" : "var(--soft)",
              transition: "width 600ms ease-out",
            }}
          />
        </div>
      )}
    </div>
  );
}

function TimerRing({
  accent,
  speed,
}: {
  accent: string;
  speed: Speed;
}) {
  const ringMs = Math.max(500, Math.round(8000 / speed));
  return (
    <svg
      style={{
        position: "absolute",
        left: 4,
        top: "50%",
        transform: "translateY(-50%)",
      }}
      className="h-3.5 w-3.5"
      viewBox="0 0 80 80"
    >
      <circle cx="40" cy="40" r="36" stroke="rgba(0,0,0,0.2)" strokeWidth="8" fill="transparent" />
      <circle
        cx="40"
        cy="40"
        r="36"
        stroke={accent}
        strokeWidth="8"
        fill="transparent"
        strokeDasharray="226"
        strokeDashoffset="0"
        transform="rotate(-90 40 40)"
        className="ring-timer"
        style={{ animationDuration: `${ringMs}ms` }}
      />
    </svg>
  );
}

/**
 * Visible "you have N seconds to predict" pill. Shown in the bottom strip
 * during deliberating/awaiting phases when the user hasn't predicted yet.
 * Counts down from 30s (matching backend prediction_window).
 */
function PredictionCountdown({
  active,
  mode,
}: {
  active: boolean;
  mode: Mode;
}) {
  const TOTAL = 30;
  const [secondsLeft, setSecondsLeft] = useState(TOTAL);

  useEffect(() => {
    if (!active) {
      setSecondsLeft(TOTAL);
      return;
    }
    setSecondsLeft(TOTAL);
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;
  const urgent = secondsLeft <= 10;
  return (
    <span
      className="font-mono uppercase tracking-wider"
      style={{
        fontSize: 10,
        padding: "3px 8px",
        border: `1.4px solid ${urgent ? "var(--alarm)" : "var(--ink)"}`,
        color: urgent ? "var(--alarm)" : "var(--ink)",
        background: urgent ? "var(--alarm-soft)" : "transparent",
        fontWeight: 700,
        letterSpacing: "0.08em",
      }}
      title={`${secondsLeft}s left to ${mode === "spectate" ? "predict" : "commit"}`}
    >
      {secondsLeft}s
    </span>
  );
}
