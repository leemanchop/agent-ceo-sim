"use client";

/**
 * Dev helper: paste a run_id, watch the raw SSE event log scroll past.
 * Useful when wiring new event kinds in the backend. Not linked from anywhere
 * in the production nav.
 */
import { useEffect, useRef, useState } from "react";
import { getApiBase, getApiMode, streamRun } from "@/lib/api/client";
import { SSE_KINDS } from "@/lib/api/sse-adapter";

type Row = { ts: string; kind: string; data: string };

export default function DevSsePage() {
  const [runId, setRunId] = useState("");
  const [connected, setConnected] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const apiMode = getApiMode();
  const apiBase = getApiBase();

  function connect() {
    if (!runId.trim()) return;
    if (apiMode === "mock") return;
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setRows([]);
    const es = streamRun(runId.trim());
    esRef.current = es;
    setConnected(true);
    for (const kind of SSE_KINDS) {
      es.addEventListener(kind, (e: MessageEvent) => {
        setRows((prev) =>
          [...prev, { ts: new Date().toISOString().slice(11, 23), kind, data: e.data }].slice(-500)
        );
      });
    }
    es.addEventListener("error", () => {
      setRows((prev) =>
        [...prev, { ts: new Date().toISOString().slice(11, 23), kind: "error", data: "transport error" }].slice(-500)
      );
    });
  }

  function disconnect() {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setConnected(false);
  }

  useEffect(() => {
    return () => {
      if (esRef.current) esRef.current.close();
    };
  }, []);

  return (
    <div className="p-4 font-mono text-xs">
      <div className="mb-3">
        <div className="text-soft mb-1">
          API_MODE = <b>{apiMode}</b> · API_BASE = <b>{apiBase ?? "(none)"}</b>
        </div>
        {apiMode === "mock" && (
          <div className="text-soft italic">
            mock mode is active — set NEXT_PUBLIC_API_MODE=local|prod to use this page.
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mb-3">
        <input
          value={runId}
          onChange={(e) => setRunId(e.target.value)}
          placeholder="run_id (e.g. 01HXY7…)"
          className="border border-ink px-2 py-1"
          style={{ width: 320 }}
          disabled={connected}
        />
        {!connected ? (
          <button
            onClick={connect}
            className="pill solid"
            disabled={apiMode === "mock"}
          >
            CONNECT
          </button>
        ) : (
          <button onClick={disconnect} className="pill alarm solid">
            DISCONNECT
          </button>
        )}
        <button onClick={() => setRows([])} className="pill">
          CLEAR
        </button>
      </div>
      <pre
        className="border border-ink p-2 overflow-auto"
        style={{ height: "calc(100vh - 160px)", whiteSpace: "pre-wrap" }}
      >
        {rows.length === 0
          ? "(no events yet)"
          : rows
              .map((r) => `[${r.ts}] ${r.kind}\n  ${r.data}`)
              .join("\n\n")}
      </pre>
    </div>
  );
}
