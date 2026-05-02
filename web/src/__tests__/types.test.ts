import { describe, it, expect } from "vitest";
import type {
  ActiveEvent,
  Choice,
  CompanyBible,
  EffectChip,
  EventCategory,
  FeedEntry,
  FeedSource,
  MiniAction,
  Mode,
  Phase,
  Severity,
  StatDeltas,
  Stats,
  TimelineEntry,
  ActionSize,
  TimeFrame,
} from "@/lib/types";

// This file is a *type contract* test: if a type is renamed or its shape
// shifts, the build of this file fails. It also constructs minimum-viable
// fixtures of the runtime-relevant types so callers can be sure the public
// surface still admits these shapes.

describe("types module", () => {
  it("exposes all public type names (compiles if true)", () => {
    // Constructing values that must satisfy each type.
    const sev: Severity = "L";
    const cat: EventCategory = "FUNDRAISING";
    const mode: Mode = "spectate";
    const phase: Phase = "deliberating";
    const size: ActionSize = "medium";
    const tf: TimeFrame = "short";
    const fs: FeedSource = "twitter";

    expect([sev, cat, mode, phase, size, tf, fs].every(Boolean)).toBe(true);
  });

  it("can construct a Choice", () => {
    const c: Choice = {
      id: "c1",
      label: "sign before midnight",
      agentReasoning: "obvious move.",
    };
    expect(c.id).toBe("c1");
    expect(c.label.length).toBeGreaterThan(0);
  });

  it("can construct an EffectChip", () => {
    const e: EffectChip = { label: "valuation", value: "+$400M", tone: "good" };
    expect(["good", "bad", "neutral"]).toContain(e.tone);
  });

  it("can construct a MiniAction", () => {
    const m: MiniAction = {
      id: "m99",
      size: "small",
      category: "OPERATIONS",
      timeframe: "short",
      title: "agent did a thing",
      outcome: "the thing happened",
      effects_summary: [{ label: "morale", value: "-1", tone: "bad" }],
    };
    expect(m.size === "small" || m.size === "medium").toBe(true);
  });

  it("can construct an ActiveEvent", () => {
    const ev: ActiveEvent = {
      id: "EVT-FR-999",
      category: "FUNDRAISING",
      severity: "L",
      title: "test event",
      body: "body copy",
      choices: [
        { id: "c1", label: "yes" },
        { id: "c2", label: "no" },
      ],
      agent_choice_id: "c1",
      reasoning: "reasoning string",
      justification: "because",
      artifact_tweet: "lfg",
      effects_summary: [
        { label: "valuation", value: "+1", tone: "good" },
      ],
    };
    expect(ev.choices.find((c) => c.id === ev.agent_choice_id)).toBeDefined();
  });

  it("can construct a CompanyBible", () => {
    const b: CompanyBible = {
      name: "Test",
      display_name: "Test",
      one_liner: "one line",
      industry: "ai_app",
      founder: "test",
      founder_vibe: "test_vibe",
      founded_year: 2024,
      funding_stage: "seed",
    };
    expect(b.founded_year).toBeGreaterThan(0);
  });

  it("can construct a TimelineEntry", () => {
    const t: TimelineEntry = {
      id: "t99",
      turn: 1,
      day: 1,
      category: "FUNDRAISING",
      size: "large",
      title: "test",
      outcome: "outcome",
    };
    expect(t.turn).toBe(1);
  });

  it("Stats and StatDeltas accept partial vs full shapes", () => {
    const s: Stats = {
      valuation: 0,
      cash: 0,
      revenue: 0,
      burn: 0,
      headcount: 0,
      fbi_awareness: 0,
      fraud_score: 0,
      day: 0,
    };
    const d: StatDeltas = { valuation: 1 };
    expect(s.day).toBe(0);
    expect(d.valuation).toBe(1);
  });

  it("can construct a FeedEntry", () => {
    const f: FeedEntry = {
      id: "f99",
      source: "twitter",
      timestamp: "1m",
      body: "post",
    };
    expect(f.source).toBe("twitter");
  });
});
