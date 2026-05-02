"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserMenu } from "@/components/system/user-menu";
import { markGuest } from "@/lib/user/local-runs";

const INDUSTRIES = ["SaaS", "AI", "Fintech", "Bio", "Crypto", "DTC", "Other"];

const VIBES = [
  "Stanford Dropout",
  "Ex-McKinsey",
  "Crypto Refugee",
  "Nepo Baby",
  "Believer",
  "2× Founder",
];

const LENGTHS = ["micro", "short", "medium", "long"] as const;
const CRAZINESS = ["tame", "normal", "crazy", "unhinged"] as const;

const TEMPLATES = [
  { id: "delve", label: "Delve", subtitle: "AI security · YC W24 · live wire" },
  { id: "theranos", label: "Theranos", subtitle: "Edison machine · 2003-2018 · 11y federal" },
  { id: "ftx", label: "FTX", subtitle: "Bahamas crypto · 2019-2022 · 25y federal" },
  { id: "wework", label: "WeWork", subtitle: "Vibes-based real estate · 2010-2019 · acquisition" },
  { id: "nikola", label: "Nikola", subtitle: "The truck rolling downhill · 4y federal" },
  { id: "frank", label: "Frank", subtitle: "Synthetic users for $175M · acquired by JPM" },
];

const TEMPLATES_MORE = [
  { id: "outcome_health", label: "Outcome Health", subtitle: "Doctor's office TV fraud · 2006-2019" },
  { id: "headspin", label: "HeadSpin", subtitle: "ARR inflation · 18mo federal" },
  { id: "ozy", label: "Ozy Media", subtitle: "Impersonating a YouTube exec · ongoing" },
  { id: "irl", label: "IRL", subtitle: "95% bots · full unicorn valuation" },
  { id: "cluely", label: "Cluely", subtitle: "Fraud-as-marketing · 2024-present · live wire" },
];

export default function LandingPage() {
  const router = useRouter();
  const search = useSearchParams();
  const [name, setName] = useState("");
  const [oneliner, setOneliner] = useState("");
  const [industry, setIndustry] = useState<string>("AI");
  const [vibe, setVibe] = useState<string>("Stanford Dropout");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>("medium");
  const [crazy, setCrazy] = useState<(typeof CRAZINESS)[number]>("normal");
  const [mode, setMode] = useState<"spectate" | "ceo">("spectate");
  const [showMoreTemplates, setShowMoreTemplates] = useState(false);

  // ?guest=1 → record the spectator opt-in so the UserMenu shows GUEST.
  useEffect(() => {
    if (search?.get("guest") === "1") markGuest();
  }, [search]);

  function buildSearch() {
    const p = new URLSearchParams();
    p.set("mode", mode);
    p.set("length", length);
    p.set("craziness", crazy);
    if (industry) p.set("industry", industry);
    if (vibe) p.set("vibe", vibe);
    return p.toString();
  }

  function start() {
    const trimmed = name.trim();
    const slug = trimmed
      ? trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24)
      : "demo";
    // Persist what the user typed so the run page can pass it to createRun
    // and seed the bible immediately. localStorage handoff > URL params here
    // because oneliner can be long enough to bloat the URL.
    if (typeof window !== "undefined") {
      try {
        const payload = {
          name: trimmed || slug,
          one_liner: oneliner.trim(),
          industry,
          founder_vibe: vibe,
          length,
          craziness: crazy,
          mode,
          saved_at: new Date().toISOString(),
        };
        localStorage.setItem(
          `aces:run:${slug}:input`,
          JSON.stringify(payload),
        );
      } catch {
        /* localStorage may be disabled — non-fatal */
      }
    }
    router.push(`/run/${slug || "demo"}?${buildSearch()}`);
  }

  function startTemplate(id: string) {
    const p = new URLSearchParams();
    p.set("mode", mode);
    p.set("length", length);
    p.set("craziness", crazy);
    p.set("template", id);
    router.push(`/run/${id}?${p.toString()}`);
  }

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
        <nav className="flex items-center gap-2">
          <a href="/about" className="pill" style={{ cursor: "pointer" }}>about</a>
          <a href="/archive" className="pill" style={{ cursor: "pointer" }}>archive</a>
          <a href="/me/runs" className="pill" style={{ cursor: "pointer" }}>my runs</a>
          <UserMenu />
        </nav>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* hero */}
        <div className="mb-8">
          <h1
            className="font-body"
            style={{
              fontSize: "clamp(34px, 6vw, 56px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            Watch an AI{" "}
            <span className="hand-underline" style={{ position: "relative", zIndex: 1 }}>
              commit fraud
            </span>{" "}
            in real time as your startup.
          </h1>
          <p
            className="mt-4 font-body"
            style={{ fontSize: 15, color: "var(--soft)" }}
          >
            Upload your company. Avg run: 18 min. Avg ending: prison.
          </p>
        </div>

        {/* form box */}
        <div
          className="relative"
          style={{
            border: "1.6px solid var(--ink)",
            background: "var(--paper)",
            padding: 24,
          }}
        >
          {/* angled annotation */}
          <div
            className="annotation hidden md:block"
            style={{
              position: "absolute",
              top: -28,
              right: 32,
              transform: "rotate(-8deg)",
              fontSize: 14,
            }}
          >
            30 sec to start ↴
          </div>

          {/* mode toggle */}
          <Field label="Who decides?">
            <div className="flex gap-2">
              <ModeChip
                active={mode === "spectate"}
                onClick={() => setMode("spectate")}
                title="Spectate"
                subtitle="Watch the agent decide. Predict."
              />
              <ModeChip
                active={mode === "ceo"}
                onClick={() => setMode("ceo")}
                title="Be the CEO"
                subtitle="You pick. Agent shows what it would have done."
                alarm
              />
            </div>
          </Field>

          {/* name */}
          <Field label="Company name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vellum.ai"
              className="brutalist-input"
            />
          </Field>

          {/* one-liner */}
          <Field label="One-line description">
            <input
              value={oneliner}
              onChange={(e) => setOneliner(e.target.value)}
              placeholder="autonomous procurement for SaaS spend"
              className="brutalist-input"
            />
          </Field>

          {/* industry */}
          <Field label="Industry">
            <ChipPick
              value={industry}
              options={INDUSTRIES}
              onChange={setIndustry}
            />
          </Field>

          {/* vibe */}
          <Field label="Founder vibe">
            <ChipPick value={vibe} options={VIBES} onChange={setVibe} />
          </Field>

          {/* length */}
          <Field label="Length">
            <ChipPick
              value={length}
              options={LENGTHS as unknown as string[]}
              onChange={(v) => setLength(v as (typeof LENGTHS)[number])}
            />
          </Field>

          {/* craziness */}
          <Field label="Craziness">
            <ChipPick
              value={crazy}
              options={CRAZINESS as unknown as string[]}
              onChange={(v) => setCrazy(v as (typeof CRAZINESS)[number])}
              alarmSelected
            />
          </Field>

          {/* CTA */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={start}
              className="brutalist-btn"
              style={{ fontSize: 16, padding: "14px 24px", flex: 1 }}
            >
              START RUN →
            </button>
            <button
              onClick={start}
              className="font-mono uppercase tracking-wider hover:text-ink"
              style={{ fontSize: 11, color: "var(--soft)" }}
            >
              or watch a demo run →
            </button>
          </div>
        </div>

        {/* templates */}
        <div className="mt-10">
          <div className="tag mb-3">OR LOAD A PRESET</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => startTemplate(t.id)}
                className="text-left transition-colors hover:bg-paper2"
                style={{
                  border: "1.4px solid var(--ink)",
                  padding: "10px 12px",
                  background: "var(--paper)",
                  cursor: "pointer",
                }}
              >
                <div
                  className="font-mono"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {t.label}
                </div>
                <div
                  className="font-mono mt-0.5"
                  style={{ fontSize: 11, color: "var(--soft)" }}
                >
                  {t.subtitle}
                </div>
              </button>
            ))}
          </div>

          {showMoreTemplates && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              {TEMPLATES_MORE.map((t) => (
                <button
                  key={t.id}
                  onClick={() => startTemplate(t.id)}
                  className="text-left transition-colors hover:bg-paper2"
                  style={{
                    border: "1.4px solid var(--ink)",
                    padding: "10px 12px",
                    background: "var(--paper)",
                  }}
                >
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                    }}
                  >
                    {t.label}
                  </div>
                  <div
                    className="font-mono mt-0.5"
                    style={{ fontSize: 11, color: "var(--soft)" }}
                  >
                    {t.subtitle}
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowMoreTemplates((v) => !v)}
            className="mt-3 font-mono uppercase tracking-wider hover:text-ink"
            style={{ fontSize: 11, color: "var(--soft)", cursor: "pointer" }}
          >
            {showMoreTemplates ? "− fewer presets" : "+ more presets"}
          </button>
        </div>

        <div
          className="mt-10 text-center font-mono uppercase tracking-wider"
          style={{ fontSize: 10, color: "var(--soft)" }}
        >
          no account · no upload · 30 seconds · it&apos;s fake.
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block mt-4 first:mt-0">
      <div className="tag mb-1.5">{label}</div>
      {children}
    </label>
  );
}

function ChipPick({
  value,
  options,
  onChange,
  alarmSelected,
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  alarmSelected?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const selected = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn("pill", selected && (alarmSelected ? "alarm solid" : "solid"))}
            style={{ cursor: "pointer", fontSize: 11 }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function ModeChip({
  active,
  onClick,
  title,
  subtitle,
  alarm,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  alarm?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left transition-colors flex-1"
      style={{
        border: active
          ? alarm
            ? "1.4px solid var(--alarm)"
            : "1.4px solid var(--ink)"
          : "1.4px solid var(--ink)",
        background: active ? (alarm ? "var(--alarm-soft)" : "var(--ink)") : "transparent",
        color: active ? (alarm ? "var(--alarm)" : "var(--paper)") : "var(--ink)",
        padding: "8px 10px",
        cursor: "pointer",
      }}
    >
      <div
        className="font-mono uppercase tracking-wider"
        style={{ fontSize: 12, fontWeight: 700 }}
      >
        {title}
      </div>
      <div
        className="font-body mt-0.5"
        style={{ fontSize: 11, opacity: 0.85 }}
      >
        {subtitle}
      </div>
    </button>
  );
}
