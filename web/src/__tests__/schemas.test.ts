import { describe, expect, it } from "vitest";
import {
  CreateRunResponseSchema,
  EventMaterializeSchema,
  FeedTweetSchema,
  FindingUnsealedSchema,
  RunSnapshotSchema,
  StatsSchema,
  TurnStartSchema,
  parseSSEEvent,
  assert,
} from "@/lib/api/schemas";
import { parseEnvForTest } from "@/lib/env";

describe("schemas — happy paths", () => {
  it("StatsSchema accepts a well-formed stats object", () => {
    const r = StatsSchema.safeParse({
      valuation: 4_000_000_000,
      cash: 50_000_000,
      revenue: 100_000,
      burn: 800_000,
      headcount: 42,
      fbi_awareness: 12,
      fraud_score: 30,
      day: 84,
    });
    expect(r.success).toBe(true);
  });

  it("TurnStartSchema accepts a turn snapshot with wire-stats", () => {
    const r = TurnStartSchema.safeParse({
      turn: 7,
      day_elapsed: 84,
      stats: { valuation_usd_cents: 400_000_000_00, heat: 12 },
    });
    expect(r.success).toBe(true);
  });

  it("EventMaterializeSchema fills tags default", () => {
    const r = EventMaterializeSchema.safeParse({
      event_id: "EVT-FR-002",
      category: "fundraising",
      title: "Tiger Global term sheet",
      body: "...",
      severity: "L",
    });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.tags).toEqual([]);
  });

  it("FeedTweetSchema accepts the verified gold/blue/bool union", () => {
    expect(
      FeedTweetSchema.safeParse({
        handle: "@TrungTPhan",
        body: "vellum just raised at 4B",
        ts: "2025-01-01T00:00:00Z",
        verified: "gold",
      }).success
    ).toBe(true);
    expect(
      FeedTweetSchema.safeParse({
        handle: "@TrungTPhan",
        body: "x",
        ts: "2025-01-01T00:00:00Z",
        verified: true,
      }).success
    ).toBe(true);
  });

  it("FindingUnsealedSchema applies safe defaults", () => {
    const r = FindingUnsealedSchema.safeParse({
      finding_id: "SF-CIA-001",
      headline: "FILE UNSEALED",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.canon_text_long).toBe("");
      expect(r.data.canon_text_short).toBe("");
    }
  });

  it("CreateRunResponseSchema accepts a minimal response", () => {
    const r = CreateRunResponseSchema.safeParse({
      run_id: "01HXY7",
      status: "initialized",
    });
    expect(r.success).toBe(true);
  });

  it("RunSnapshotSchema applies predictions/balance defaults", () => {
    const r = RunSnapshotSchema.safeParse({
      run_id: "01HXY7",
      status: "in_progress",
      company: {},
      settings: {},
      stats: {},
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.predictions).toEqual({ correct: 0, total: 0 });
      expect(r.data.ceobuck_balance).toBe(0);
    }
  });
});

describe("schemas — rejection paths", () => {
  it("StatsSchema rejects out-of-range fbi_awareness", () => {
    const r = StatsSchema.safeParse({
      valuation: 0,
      cash: 0,
      revenue: 0,
      burn: 0,
      headcount: 0,
      fbi_awareness: 200,
      fraud_score: 0,
      day: 0,
    });
    expect(r.success).toBe(false);
  });

  it("EventMaterializeSchema rejects when required fields missing", () => {
    const r = EventMaterializeSchema.safeParse({
      event_id: "EVT-FR-002",
      // category, title, body, severity all missing
    });
    expect(r.success).toBe(false);
  });

  it("EventMaterializeSchema rejects unknown severity", () => {
    const r = EventMaterializeSchema.safeParse({
      event_id: "EVT-FR-002",
      category: "fundraising",
      title: "x",
      body: "y",
      severity: "ENORMOUS",
    });
    expect(r.success).toBe(false);
  });
});

describe("parseSSEEvent dispatch", () => {
  it("returns ok:true with validated data for known kinds", () => {
    const r = parseSSEEvent("agent.thought_token", {
      token: "ok ",
      stream_id: "thought_12",
    });
    expect(r.ok).toBe(true);
    if (r.ok) expect((r.data as { token: string }).token).toBe("ok ");
  });

  it("returns ok:false for unknown kinds", () => {
    const r = parseSSEEvent("not.a.real.kind", { foo: 1 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/unknown event kind/);
  });

  it("returns ok:false with a path-prefixed error for malformed payloads", () => {
    const r = parseSSEEvent("agent.thought_token", { token: 42 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/token/);
  });
});

describe("env validator", () => {
  it("falls back to mock when API_MODE is missing", () => {
    const r = parseEnvForTest({});
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.NEXT_PUBLIC_API_MODE).toBe("mock");
  });

  it("rejects nonsense API_MODE values", () => {
    const r = parseEnvForTest({ NEXT_PUBLIC_API_MODE: "wat" });
    expect(r.success).toBe(false);
  });

  it("rejects non-URL API_URL", () => {
    const r = parseEnvForTest({
      NEXT_PUBLIC_API_MODE: "prod",
      NEXT_PUBLIC_API_URL: "not a url",
    });
    expect(r.success).toBe(false);
  });

  it("accepts a valid prod config", () => {
    const r = parseEnvForTest({
      NEXT_PUBLIC_API_MODE: "prod",
      NEXT_PUBLIC_API_URL: "https://api.example.com",
    });
    expect(r.success).toBe(true);
  });
});

describe("assert", () => {
  it("throws on falsy", () => {
    expect(() => assert(false, "nope")).toThrow(/assertion failed: nope/);
  });
  it("narrows on truthy", () => {
    const v: number | null = 1;
    assert(v !== null, "v should be set");
    // type narrowed; usage compiles
    expect(v + 1).toBe(2);
  });
});
