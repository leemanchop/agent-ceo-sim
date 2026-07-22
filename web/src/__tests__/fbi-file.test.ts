import { describe, expect, it } from "vitest";
import { FBI_UNLOCK_AT, buildFbiLog, fbiStage } from "@/components/run/fbi-file";
import type { TimelineEntry } from "@/lib/types";

describe("fbi file", () => {
  it("stages escalate at the design thresholds", () => {
    expect(FBI_UNLOCK_AT).toBe(20);
    expect(fbiStage(0).label).toBe("PASSIVE MONITORING");
    expect(fbiStage(20).label).toBe("PASSIVE MONITORING");
    expect(fbiStage(50).label).toBe("ACTIVE INVESTIGATION");
    expect(fbiStage(61).label).toBe("ENFORCEMENT REFERRAL");
    expect(fbiStage(86).label).toBe("GRAND JURY");
    expect(fbiStage(100).label).toBe("GRAND JURY");
  });

  it("builds the surveillance log from watched categories + alarms", () => {
    const timeline = [
      { id: "1", turn: 1, day: 20, size: "large", category: "FUNDRAISING", title: "term sheet" },
      { id: "2", turn: 2, day: 31, size: "large", category: "REGULATORY", title: "SEC letter" },
      { id: "3", turn: 3, day: 40, size: "large", category: "PRESS", title: "exposé", alarm: true },
    ] as unknown as TimelineEntry[];
    const log = buildFbiLog(timeline, 55);
    const texts = log.map((r) => r.text);
    expect(texts).toContain("SEC letter");
    expect(texts).toContain("exposé");
    expect(texts).not.toContain("term sheet");
    expect(texts[0]).toContain("ACTIVE INVESTIGATION"); // status row first (reversed)
  });
});
