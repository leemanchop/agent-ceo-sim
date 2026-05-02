import { describe, it, expect } from "vitest";
import {
  MOCK_BIBLE,
  MOCK_EVENT_QUEUE,
  MOCK_MINI_ACTIONS,
  MOCK_TIMELINE,
  MOCK_FEED,
  MOCK_STATS,
} from "@/lib/mock-data";
import type { EventCategory, FeedSource } from "@/lib/types";

const VALID_CATEGORIES: ReadonlySet<EventCategory> = new Set<EventCategory>([
  "FUNDRAISING",
  "PRODUCT",
  "HIRING",
  "REGULATORY",
  "PRESS",
  "CUSTOMERS",
  "FOUNDER",
  "CRYPTO_AI",
  "OPERATIONS",
  "BANKING",
  "FBI",
]);

const VALID_FEED_SOURCES: ReadonlySet<FeedSource> = new Set<FeedSource>([
  "twitter",
  "bloomberg",
  "techcrunch",
  "forbes",
  "slack",
  "glassdoor",
  "fbi",
  "discord",
]);

describe("MOCK_BIBLE", () => {
  it("has all required fields populated with non-empty strings/numbers", () => {
    expect(MOCK_BIBLE.name).toBeTruthy();
    expect(typeof MOCK_BIBLE.name).toBe("string");
    expect(MOCK_BIBLE.display_name).toBeTruthy();
    expect(MOCK_BIBLE.one_liner).toBeTruthy();
    expect(MOCK_BIBLE.industry).toBeTruthy();
    expect(MOCK_BIBLE.founder).toBeTruthy();
    expect(MOCK_BIBLE.founder_vibe).toBeTruthy();
    expect(MOCK_BIBLE.funding_stage).toBeTruthy();
    expect(typeof MOCK_BIBLE.founded_year).toBe("number");
    expect(MOCK_BIBLE.founded_year).toBeGreaterThan(1900);
  });
});

describe("MOCK_STATS", () => {
  it("has finite numeric values for every stat", () => {
    for (const key of Object.keys(MOCK_STATS) as (keyof typeof MOCK_STATS)[]) {
      expect(typeof MOCK_STATS[key]).toBe("number");
      expect(Number.isFinite(MOCK_STATS[key])).toBe(true);
    }
  });

  it("clamps fbi_awareness and fraud_score to 0..100", () => {
    expect(MOCK_STATS.fbi_awareness).toBeGreaterThanOrEqual(0);
    expect(MOCK_STATS.fbi_awareness).toBeLessThanOrEqual(100);
    expect(MOCK_STATS.fraud_score).toBeGreaterThanOrEqual(0);
    expect(MOCK_STATS.fraud_score).toBeLessThanOrEqual(100);
  });
});

describe("MOCK_EVENT_QUEUE", () => {
  it("is non-empty", () => {
    expect(MOCK_EVENT_QUEUE.length).toBeGreaterThan(0);
  });

  it("every event has 2-4 choices", () => {
    for (const ev of MOCK_EVENT_QUEUE) {
      expect(ev.choices.length).toBeGreaterThanOrEqual(2);
      expect(ev.choices.length).toBeLessThanOrEqual(4);
    }
  });

  it("every event's agent_choice_id maps to one of its own choices", () => {
    for (const ev of MOCK_EVENT_QUEUE) {
      const ids = ev.choices.map((c) => c.id);
      expect(ids).toContain(ev.agent_choice_id);
    }
  });

  it("every event has a non-empty effects_summary", () => {
    for (const ev of MOCK_EVENT_QUEUE) {
      expect(ev.effects_summary.length).toBeGreaterThan(0);
      for (const eff of ev.effects_summary) {
        expect(eff.label).toBeTruthy();
        expect(eff.value).toBeTruthy();
        expect(["good", "bad", "neutral"]).toContain(eff.tone);
      }
    }
  });

  it("every event has body, reasoning, justification, artifact_tweet", () => {
    for (const ev of MOCK_EVENT_QUEUE) {
      expect(ev.body.length).toBeGreaterThan(10);
      expect(ev.reasoning.length).toBeGreaterThan(10);
      expect(ev.justification.length).toBeGreaterThan(0);
      expect(ev.artifact_tweet.length).toBeGreaterThan(0);
      expect(VALID_CATEGORIES.has(ev.category)).toBe(true);
      expect(["S", "M", "L", "XL"]).toContain(ev.severity);
    }
  });

  it("event ids are unique", () => {
    const ids = MOCK_EVENT_QUEUE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("MOCK_MINI_ACTIONS", () => {
  it("is non-empty", () => {
    expect(MOCK_MINI_ACTIONS.length).toBeGreaterThan(0);
  });

  it("every entry uses size in {small, medium} (no large minis)", () => {
    for (const m of MOCK_MINI_ACTIONS) {
      expect(["small", "medium"]).toContain(m.size);
      expect(m.size).not.toBe("large");
    }
  });

  it("every entry uses timeframe in {short, medium, long}", () => {
    for (const m of MOCK_MINI_ACTIONS) {
      expect(["short", "medium", "long"]).toContain(m.timeframe);
    }
  });

  it("every entry has a valid category and effects_summary", () => {
    for (const m of MOCK_MINI_ACTIONS) {
      expect(VALID_CATEGORIES.has(m.category)).toBe(true);
      expect(m.title.length).toBeGreaterThan(0);
      expect(Array.isArray(m.effects_summary)).toBe(true);
      expect(m.effects_summary.length).toBeGreaterThan(0);
    }
  });

  it("entry ids are unique", () => {
    const ids = MOCK_MINI_ACTIONS.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("MOCK_TIMELINE", () => {
  it("entries have valid categories and sizes", () => {
    for (const t of MOCK_TIMELINE) {
      expect(VALID_CATEGORIES.has(t.category)).toBe(true);
      expect(["small", "medium", "large"]).toContain(t.size);
      if (t.severity) {
        expect(["S", "M", "L", "XL"]).toContain(t.severity);
      }
    }
  });

  it("turn numbers are monotonically increasing", () => {
    for (let i = 1; i < MOCK_TIMELINE.length; i++) {
      expect(MOCK_TIMELINE[i].turn).toBeGreaterThan(MOCK_TIMELINE[i - 1].turn);
    }
  });

  it("day numbers are monotonically non-decreasing", () => {
    for (let i = 1; i < MOCK_TIMELINE.length; i++) {
      expect(MOCK_TIMELINE[i].day).toBeGreaterThanOrEqual(
        MOCK_TIMELINE[i - 1].day
      );
    }
  });
});

describe("MOCK_FEED", () => {
  it("is non-empty", () => {
    expect(MOCK_FEED.length).toBeGreaterThan(0);
  });

  it("every entry has a valid source and a non-empty body", () => {
    for (const f of MOCK_FEED) {
      expect(VALID_FEED_SOURCES.has(f.source)).toBe(true);
      expect(f.body.length).toBeGreaterThan(0);
      expect(f.timestamp.length).toBeGreaterThan(0);
    }
  });

  it("entry ids are unique", () => {
    const ids = MOCK_FEED.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("timestamp ordering is reasonable (parseable as a unit-suffixed value)", () => {
    // timestamps look like "11s", "2m", etc. Convert to seconds and verify
    // they are non-decreasing (the feed trickles oldest-first ... newest-last
    // OR newest-first; either way, parseable).
    const parsed = MOCK_FEED.map((f) => parseTs(f.timestamp));
    for (const v of parsed) {
      expect(Number.isFinite(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
    }
    // sortedness: sorted ascending OR descending — just verify monotonic in
    // SOME direction so we don't enforce a specific feed-order policy.
    const asc = parsed.every(
      (v, i, a) => i === 0 || v >= a[i - 1]
    );
    const desc = parsed.every(
      (v, i, a) => i === 0 || v <= a[i - 1]
    );
    expect(asc || desc).toBe(true);
  });
});

function parseTs(ts: string): number {
  const m = ts.match(/^(\d+)\s*([smhd])$/i);
  if (!m) return Number.NaN;
  const n = parseInt(m[1], 10);
  const unit = m[2].toLowerCase();
  return unit === "s"
    ? n
    : unit === "m"
    ? n * 60
    : unit === "h"
    ? n * 3600
    : unit === "d"
    ? n * 86400
    : Number.NaN;
}
