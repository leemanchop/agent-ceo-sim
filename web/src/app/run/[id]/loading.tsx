import { LoadingFallback } from "@/components/system/loading-fallback";

/**
 * Run-page loading skeleton. Shows the cockpit chrome immediately so
 * SSE attach feels live — top-bar wordmark, dashboard placeholder with
 * `--` values, agent-stream skeleton, three ghost feed rows.
 */
export default function RunLoading() {
  return (
    <main className="min-h-screen bg-paper text-ink font-body">
      {/* top bar */}
      <header
        className="flex items-center justify-between px-6 h-12"
        style={{ borderBottom: "1.4px solid var(--ink)" }}
      >
        <div
          className="font-mono uppercase tracking-wider"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}
        >
          FORBES · 30u30 SIMULATOR
        </div>
        <div
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            color: "var(--soft)",
            letterSpacing: "0.08em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            aria-hidden
            className="animate-pulse-soft"
            style={{
              display: "inline-block",
              width: 6,
              height: 6,
              background: "var(--soft)",
              borderRadius: 999,
            }}
          />
          connecting · sse
        </div>
      </header>

      {/* bloomberg ribbon — placeholder values */}
      <div
        style={{
          borderBottom: "1.4px solid var(--ink)",
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
        }}
      >
        {["DAY", "VALUATION", "REVENUE", "BURN/MO", "RUNWAY", "HEADCOUNT", "FBI AWARE"].map(
          (label, i) => (
            <div
              key={label}
              style={{
                padding: "8px 12px",
                borderLeft: i === 0 ? "none" : "1.2px solid var(--ink)",
              }}
            >
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.08em",
                  color: "var(--soft)",
                }}
              >
                {label}
              </div>
              <div
                className="font-mono"
                style={{
                  fontSize: 13,
                  color: "var(--ink-2)",
                  marginTop: 2,
                }}
              >
                --
              </div>
            </div>
          ),
        )}
      </div>

      {/* main 3-pane grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 320px",
          minHeight: "calc(100vh - 120px)",
        }}
      >
        {/* left rail timeline placeholder */}
        <aside
          style={{
            borderRight: "1.4px solid var(--ink)",
            padding: "14px 12px",
          }}
        >
          <div className="tag" style={{ marginBottom: 10 }}>
            TIMELINE
          </div>
          <div
            className="font-mono"
            style={{
              fontSize: 10,
              color: "var(--soft)",
              letterSpacing: "0.04em",
            }}
          >
            queueing...
          </div>
        </aside>

        {/* center stage — agent stream skeleton */}
        <section style={{ padding: "20px 24px" }}>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 10,
              letterSpacing: "0.12em",
              color: "var(--soft)",
              marginBottom: 14,
            }}
          >
            AMBIENT · AGENT THINKING...
          </div>
          <LoadingFallback variant="run" />
        </section>

        {/* right rail — three ghost feed rows */}
        <aside
          style={{
            borderLeft: "1.4px solid var(--ink)",
            padding: "14px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div className="tag">LIVE FEED</div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                background: "var(--paper-2)",
                border: "1px dashed var(--ink)",
                padding: "10px 12px",
                opacity: 0.6 - i * 0.15,
              }}
            >
              <div
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: "var(--soft)",
                  letterSpacing: "0.04em",
                }}
              >
                @____ · --m
              </div>
              <div
                style={{
                  marginTop: 6,
                  height: 8,
                  background: "var(--ink)",
                  opacity: 0.18,
                  width: "92%",
                }}
              />
              <div
                style={{
                  marginTop: 4,
                  height: 8,
                  background: "var(--ink)",
                  opacity: 0.12,
                  width: "68%",
                }}
              />
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
