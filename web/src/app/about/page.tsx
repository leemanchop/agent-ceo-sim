import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "about · 30u30",
  description:
    "what this is, what it isn't, and who to blame. spectator simulator at 30u30.fail.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-paper text-ink font-body">
      {/* top bar */}
      <header
        className="flex items-center justify-between px-6 h-12"
        style={{ borderBottom: "1.4px solid var(--ink)" }}
      >
        <Link
          href="/"
          className="font-mono uppercase tracking-wider hover:text-alarm"
          style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em" }}
        >
          ← FORBES · 30u30 SIMULATOR
        </Link>
        <nav className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider">
          <Link href="/archive" className="pill">archive</Link>
          <Link href="/me/runs" className="pill">my runs</Link>
        </nav>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div>
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "var(--soft)",
            }}
          >
            ABOUT
          </div>
          <h1
            className="font-body mt-2"
            style={{
              fontSize: "clamp(28px, 4vw, 40px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            watch an LLM CEO commit fraud in real time.
          </h1>
          <p
            className="font-body mt-3"
            style={{ fontSize: 14, color: "var(--soft)" }}
          >
            spectator simulator. ~18 minutes from series A to FBI raid.
            entertainment value scales inversely with your fraud literacy.
          </p>
        </div>

        <Section title="what it is">
          <p>
            you upload a startup. an LLM agent runs it. the agent makes
            increasingly unhinged decisions while a second LLM agent simulates
            the world&apos;s reaction — fake tweets, leaked Slack threads,
            Glassdoor reviews, board memos, FBI awareness, the eventual
            cursed-Forbes share card.
          </p>
          <p>
            you can watch (and predict the agent&apos;s choices) or play CEO
            yourself. either way the run terminates in one of seven endgame
            archetypes — prison, fled-country, got-away-with-it, failed-up,
            cultural afterlife, genuine success, or one of thirteen cursed
            secret endings — and produces a shareable post-mortem trading card.
          </p>
        </Section>

        <Section title="what it isn't">
          <p>
            this is satire. real names appear only as reactions to public
            stances or as already-public facts — never as new accusations. the
            full defamation policy is{" "}
            <ExternalLink href="https://github.com/kevinvzhu/agent-ceo-sim/blob/main/game/defamation_policy.md">
              in the repo
            </ExternalLink>
            .
          </p>
          <p>
            it&apos;s also not a real game. there are no skill trees, no upgrade
            paths, no resource management. you watch numbers go bad. that&apos;s
            the loop.
          </p>
        </Section>

        <Section title="how it works">
          <p>
            five LLM agents run the simulation. <strong>Researcher</strong>{" "}
            (Claude Opus 4.7) builds a Company Bible from web research at run
            start. <strong>Oracle</strong> (Sonnet 4.6) generates events and
            world reactions per turn. <strong>CEO</strong> (Sonnet 4.6) decides
            with sticky personality. <strong>Editor</strong> (Sonnet 4.6) does
            voice and defamation policing. <strong>Post-mortem</strong> (Opus
            4.7) writes the long-form Bloomberg-style obituary at run end.
          </p>
          <p>
            the world corpus is hand-authored: 296 events, 166 figures, 62
            endgames, 101 source-systems, 50 secret findings, 11 historical
            company templates (Theranos, FTX, WeWork, Frank, Nikola, Outcome
            Health, Headspin, Ozy, IRL, Cluely, Delve). the agents draw from
            this, not from open-ended generation.
          </p>
        </Section>

        <Section title="how to use">
          <ol className="space-y-2 list-decimal pl-5">
            <li>pick spectate or be-the-CEO</li>
            <li>upload a company OR pick a preset (Theranos is a strong demo)</li>
            <li>pick length (short / medium / long) and craziness (tame → unhinged)</li>
            <li>click START RUN. let it cook.</li>
            <li>at endgame, share the post-mortem trading card</li>
          </ol>
        </Section>

        <Section title="who built this">
          <p>
            hackathon project by <code>@kevinvzhu</code>. source on{" "}
            <ExternalLink href="https://github.com/kevinvzhu/agent-ceo-sim">
              github
            </ExternalLink>
            . feedback / bug reports as GitHub issues.
          </p>
          <p style={{ color: "var(--soft)" }}>
            inspired by BitLife · Pax Historia · Universal Paperclips · Oregon
            Trail · The Founder · A Dark Room. specifically for the modern
            tech-doom-or-coronation arc.
          </p>
        </Section>

        <Section title="contact">
          <p>
            issues:{" "}
            <ExternalLink href="https://github.com/kevinvzhu/agent-ceo-sim/issues">
              github.com/kevinvzhu/agent-ceo-sim/issues
            </ExternalLink>
          </p>
          <p>
            takedown / defamation concern: open an issue or DM. real-name
            reactions can be removed by request; this is a satire, not a
            commitment to defend any specific cameo.
          </p>
        </Section>

        <div
          className="pt-6 mt-12 font-mono text-[10px] uppercase tracking-wider"
          style={{
            borderTop: "1px dashed var(--ink)",
            color: "var(--soft)",
          }}
        >
          30u30.fail · spectator simulator · no real fraud was committed in the
          making of this site
        </div>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="font-mono uppercase mb-3"
        style={{
          fontSize: 11,
          letterSpacing: "0.18em",
          color: "var(--alarm)",
          fontWeight: 700,
        }}
      >
        ▌{title}
      </h2>
      <div
        className="space-y-3 leading-relaxed"
        style={{ fontSize: 14, color: "var(--ink-2, var(--ink))" }}
      >
        {children}
      </div>
    </section>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: "var(--alarm)", textDecoration: "underline" }}
    >
      {children}
    </a>
  );
}
