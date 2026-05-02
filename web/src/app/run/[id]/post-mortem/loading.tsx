import { LoadingFallback } from "@/components/system/loading-fallback";

/**
 * Post-mortem loading — placeholder card frame with ghost text where
 * the company name + endgame stamp would land.
 */
export default function PostMortemLoading() {
  return (
    <main className="min-h-screen bg-paper text-ink font-body">
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
          }}
        >
          developing card...
        </div>
      </header>

      <div
        style={{
          maxWidth: 720,
          margin: "48px auto",
          padding: "0 24px",
        }}
      >
        <div
          aria-hidden
          style={{
            border: "6px solid var(--alarm)",
            background: "var(--paper)",
            aspectRatio: "1080 / 1350",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* header strip */}
          <div
            style={{
              borderBottom: "1.4px solid var(--ink)",
              padding: "14px 28px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--alarm)",
                letterSpacing: "0.08em",
              }}
            >
              FORBES 30 UNDER 30 · CURSED EDITION · VOL. ---
            </span>
            <span
              className="font-mono uppercase"
              style={{
                fontSize: 11,
                color: "var(--soft)",
                letterSpacing: "0.08em",
              }}
            >
              30u30.fail/run/...
            </span>
          </div>

          {/* body — ghost company name + stamp */}
          <div
            style={{
              flex: 1,
              padding: "8% 6%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 24,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "70%",
                height: 36,
                background: "var(--ink)",
                opacity: 0.12,
              }}
            />
            <div
              style={{
                width: "50%",
                height: 14,
                background: "var(--ink)",
                opacity: 0.08,
              }}
            />

            <div
              style={{
                marginTop: 24,
                width: 220,
                height: 220,
                border: "1.4px solid var(--ink)",
                background: "var(--paper-2)",
                position: "relative",
              }}
            >
              <div
                className="stamp"
                style={{
                  position: "absolute",
                  right: -16,
                  bottom: 24,
                  transform: "rotate(-3deg)",
                  fontSize: 12,
                  padding: "4px 8px",
                  opacity: 0.6,
                  background: "var(--paper)",
                }}
              >
                ENDGAME · ---
              </div>
            </div>

            <div
              style={{
                width: "60%",
                height: 12,
                background: "var(--ink)",
                opacity: 0.1,
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <LoadingFallback variant="post-mortem" />
        </div>
      </div>
    </main>
  );
}
