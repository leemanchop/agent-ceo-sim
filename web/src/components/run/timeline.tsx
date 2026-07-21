"use client";

import { useEffect, useRef } from "react";
import type { TimelineEntry } from "@/lib/types";
import { cn } from "@/lib/utils";

export function Timeline({
  entries,
  onSelect,
}: {
  entries: TimelineEntry[];
  onSelect?: (id: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  // auto-scroll to bottom on new entries
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div className="flex flex-col h-full bg-paper">
      <div
        className="px-3 py-2 border-b border-ink flex items-center justify-between"
        style={{ borderBottomWidth: "1.4px" }}
      >
        <div className="tag">RUN TIMELINE</div>
        <div className="font-mono text-soft" style={{ fontSize: 10 }}>
          T{entries.length}
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <ol>
          {entries.map((e) => (
            <TimelineRow
              key={e.id}
              entry={e}
              onClick={() => onSelect?.(e.id)}
            />
          ))}
        </ol>
      </div>
    </div>
  );
}

function TimelineRow({
  entry,
  onClick,
}: {
  entry: TimelineEntry;
  onClick: () => void;
}) {
  const isMini = entry.size !== "large";
  const isCrisis = entry.alarm || entry.severity === "XL";

  // dot styling
  let dotStyle: React.CSSProperties = {};
  if (isCrisis) {
    dotStyle = {
      background: "var(--alarm)",
      border: "1.4px solid var(--alarm)",
    };
  } else if (entry.size === "small") {
    dotStyle = { background: "transparent", border: "1.4px solid var(--ink)" };
  } else if (entry.size === "medium") {
    dotStyle = { background: "var(--ink-2)", border: "1.4px solid var(--ink-2)" };
  } else {
    // large, committed
    dotStyle = { background: "var(--ink)", border: "1.4px solid var(--ink)" };
  }

  return (
    <li
      onClick={onClick}
      className="px-3 py-2 cursor-pointer hover:bg-paper2 transition-colors"
      style={{ borderBottom: "1px dashed var(--ink)" }}
    >
      <div className="flex items-start gap-2">
        <span
          className="rounded-full mt-1.5 shrink-0"
          style={{
            width: entry.size === "small" ? 6 : 8,
            height: entry.size === "small" ? 6 : 8,
            ...dotStyle,
          }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 font-mono text-soft" style={{ fontSize: 9 }}>
            <span>D {String(entry.day).padStart(3, "0")}</span>
            <span className="text-soft">·</span>
            <span>T{entry.turn}</span>
            {isMini && entry.timeframe && (
              <span
                className="pill"
                style={{
                  fontSize: 8,
                  padding: "0 5px",
                  borderWidth: 1,
                  letterSpacing: "0.06em",
                }}
              >
                {entry.timeframe}
              </span>
            )}
            {!isMini && entry.severity && (
              <span
                className={cn("pill", isCrisis && "alarm")}
                style={{
                  fontSize: 8,
                  padding: "0 5px",
                  borderWidth: 1,
                  letterSpacing: "0.06em",
                }}
              >
                {entry.severity}
              </span>
            )}
            <span
              className="pill"
              style={{
                fontSize: 8,
                padding: "0 5px",
                borderWidth: 1,
                letterSpacing: "0.06em",
              }}
            >
              {entry.category}
            </span>
          </div>
          <div
            className="font-body leading-snug mt-0.5"
            style={{
              fontSize: 12,
              color: isCrisis ? "var(--alarm)" : "var(--ink)",
              fontWeight: !isMini ? 500 : 400,
            }}
          >
            {entry.title}
          </div>
          <div
            className="font-body leading-snug mt-0.5 text-soft"
            style={{ fontSize: 11 }}
          >
            {entry.outcome}
          </div>
        </div>
      </div>
    </li>
  );
}
