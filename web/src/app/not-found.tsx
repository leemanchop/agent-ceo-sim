import Link from "next/link";

/**
 * Global 404 — in-voice page-not-found surface.
 * Single-screen layout matching the landing's chrome.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink font-body flex flex-col">
      {/* top bar — mirrors landing */}
      <header
        className="flex items-center justify-between px-6 h-12 shrink-0"
        style={{ borderBottom: "1.4px solid var(--ink)" }}
      >
        <div
          className="font-mono uppercase tracking-wider"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}
        >
          FORBES · 30u30 SIMULATOR
        </div>
        <Link
          href="/"
          className="font-mono uppercase"
          style={{
            fontSize: 11,
            color: "var(--soft)",
            letterSpacing: "0.08em",
          }}
        >
          ← HOME
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full">
          {/* big rotated stamp */}
          <div style={{ marginBottom: 36 }}>
            <span
              className="stamp"
              style={{
                display: "inline-block",
                transform: "rotate(-3deg)",
                fontSize: 18,
                padding: "6px 14px",
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              404 · NOT FOUND
            </span>
          </div>

          <h1
            className="font-body"
            style={{
              fontSize: "clamp(32px, 5vw, 44px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              marginBottom: 16,
            }}
          >
            this page either doesn&apos;t exist or got the SBF treatment.
          </h1>

          <p
            className="font-mono"
            style={{
              fontSize: 13,
              color: "var(--soft)",
              letterSpacing: "0.02em",
              marginBottom: 32,
              lineHeight: 1.5,
            }}
          >
            url didn&apos;t resolve. you&apos;ve been rugged. happens to the best of us.
          </p>

          <div
            style={{
              borderTop: "1.4px solid var(--ink)",
              borderBottom: "1.4px solid var(--ink)",
              padding: "18px 0",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <BrutalLink href="/">→ START NEW RUN</BrutalLink>
            <BrutalLink href="/archive">→ ARCHIVE</BrutalLink>
            <BrutalLink href="/me/runs">→ MY RUNS</BrutalLink>
          </div>

          <div
            className="font-mono uppercase"
            style={{
              marginTop: 36,
              fontSize: 10,
              color: "var(--soft)",
              letterSpacing: "0.12em",
            }}
          >
            <a href="https://30u30.fail" style={{ color: "var(--soft)" }}>
              30u30.fail
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function BrutalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="font-mono uppercase hover:text-alarm"
      style={{
        fontSize: 14,
        letterSpacing: "0.08em",
        color: "var(--ink)",
        fontWeight: 700,
      }}
    >
      {children}
    </Link>
  );
}
