import { LoadingFallback } from "@/components/system/loading-fallback";

/**
 * Default route-segment loading boundary. Dense in-voice copy that
 * cycles between ambient phrases. After 8s the wording escalates;
 * after 16s the user gets a refresh button.
 */
export default function Loading() {
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
          style={{ fontSize: 11, color: "var(--soft)", letterSpacing: "0.08em" }}
        >
          loading...
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <LoadingFallback />
      </div>
    </main>
  );
}
