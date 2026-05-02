"use client";

/**
 * <SSEStatus /> — small status pill for the run page top bar.
 *
 * Wire-in is owned by the SSE consumer agent — plug this into the run
 * page header. This component is presentational only: it receives the
 * status + a reconnect callback and renders. It does NOT manage the
 * EventSource itself.
 *
 * TODO(sse-consumer-agent): mount this in the run page top bar and pass
 *   `status` from the SSE hook + `onReconnect` from its retry handler.
 */

export type SSEConnectionStatus =
  | "connecting"
  | "live"
  | "reconnecting"
  | "lost";

type Props = {
  status: SSEConnectionStatus;
  /** seconds until next reconnect attempt; only used when status === "reconnecting" */
  reconnectInSec?: number;
  /** invoked by the manual RECONNECT button; required when status === "lost" */
  onReconnect?: () => void;
};

const COPY: Record<SSEConnectionStatus, string> = {
  connecting: "connecting · sse",
  live: "live",
  reconnecting: "reconnecting...",
  lost: "stream lost",
};

export function SSEStatus({ status, reconnectInSec, onReconnect }: Props) {
  const isLive = status === "live";
  const isReconnecting = status === "reconnecting";
  const isLost = status === "lost";
  const isConnecting = status === "connecting";

  // colour mapping — stays inside the design tokens
  const dotColor = isLost || isReconnecting
    ? "var(--alarm)"
    : isLive
    ? "#3fcf6f" // green-ish but inside the warm palette range; alt would be ink
    : "var(--soft)";

  const textColor = isLost
    ? "var(--alarm)"
    : isReconnecting
    ? "var(--alarm)"
    : isLive
    ? "var(--ink-2)"
    : "var(--soft)";

  return (
    <div
      data-testid="sse-status"
      data-status={status}
      className="font-mono uppercase"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 10,
        letterSpacing: "0.12em",
        color: textColor,
      }}
    >
      <span
        aria-hidden
        className={isLive || isConnecting ? "animate-pulse-soft" : undefined}
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: 999,
          background: dotColor,
        }}
      />
      <span>
        {COPY[status]}
        {isReconnecting && typeof reconnectInSec === "number" ? (
          <>
            {" "}
            <span style={{ color: "var(--soft)" }}>· retry {reconnectInSec}s</span>
          </>
        ) : null}
      </span>
      {isLost && onReconnect ? (
        <button
          type="button"
          onClick={onReconnect}
          className="pill alarm"
          style={{
            cursor: "pointer",
            marginLeft: 4,
            fontSize: 10,
            padding: "1px 8px",
          }}
        >
          RECONNECT
        </button>
      ) : null}
    </div>
  );
}

/** Helper: alias preserved so callers can import either name. */
export type SSEStatusValue = SSEConnectionStatus;
