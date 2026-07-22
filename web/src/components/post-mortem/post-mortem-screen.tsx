"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ShareCard, CARD_HEIGHT, CARD_WIDTH } from "./share-card";
import type { EndgameSnapshot } from "@/lib/mock-endgame";
import { UserMenu } from "@/components/system/user-menu";

type Props = {
  endgame: EndgameSnapshot;
  runId: string;
};

const SHARE_DOMAIN = "https://30u30.fail";

/** slug for the downloaded PNG */
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** dynamic, build-safe import — bypasses static analysis so the page
 *  still builds even when `html-to-image` is not installed yet. */
async function loadHtmlToImage(): Promise<
  | { toPng: (n: HTMLElement, opts?: Record<string, unknown>) => Promise<string> }
  | null
> {
  try {
    // Function ctor keeps Next/Webpack from trying to resolve the module at build.
    const dyn = new Function("m", "return import(m)") as (
      m: string,
    ) => Promise<unknown>;
    const mod = (await dyn("html-to-image")) as {
      toPng?: (n: HTMLElement, opts?: Record<string, unknown>) => Promise<string>;
    };
    if (typeof mod?.toPng !== "function") return null;
    return { toPng: mod.toPng };
  } catch {
    return null;
  }
}

export function PostMortemScreen({ endgame: serverEndgame, runId }: Props) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Hydrate from the localStorage handoff written by the run page on
  // endgame.reached. This is the ONLY way to get real run data into a page
  // routed by URL slug (the backend keys runs by ULID, not slug).
  const [endgame, setEndgame] = useState<EndgameSnapshot>(serverEndgame);
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(`aces:run:${runId}:postmortem`);
      if (!raw) return;
      const handoff = JSON.parse(raw) as {
        run_id?: string;
        endgame_id?: string;
        title?: string;
        post_mortem_long_read?: string;
        tagline?: string;
        bible?: {
          name?: string;
          display_name?: string;
          one_liner?: string;
          founder?: string;
          industry?: string;
        };
      };
      const company =
        handoff.bible?.display_name ?? handoff.bible?.name ?? null;
      setEndgame((prev) => ({
        ...prev,
        endgame_id: handoff.endgame_id ?? prev.endgame_id,
        title: handoff.title ?? prev.title,
        company_name: company ? company.toUpperCase() : prev.company_name,
        company_one_liner:
          handoff.bible?.one_liner ?? prev.company_one_liner,
        founder_name: handoff.bible?.founder ?? prev.founder_name,
        // Real Opus-generated post-mortem from the SSE stream. Falls back
        // to the demo if the run was mock-mode or the SSE didn't fire.
        post_mortem_long_read:
          handoff.post_mortem_long_read ?? prev.post_mortem_long_read,
        tagline: handoff.tagline ?? prev.tagline,
      }));
      // The long-read streams AFTER endgame.reached — if the user clicked
      // through before it finished, the handoff lacks it. The backend now
      // persists it on the run, so fetch by ULID as a fallback (UX-14).
      if (!handoff.post_mortem_long_read && handoff.run_id) {
        const mode = process.env.NEXT_PUBLIC_API_MODE;
        const url = process.env.NEXT_PUBLIC_API_URL;
        const base =
          mode === "local"
            ? (url ?? "http://localhost:8000").replace(/\/+$/, "")
            : mode === "prod" && url
            ? url.replace(/\/+$/, "")
            : null;
        if (base) {
          fetch(`${base}/run/${encodeURIComponent(handoff.run_id)}`)
            .then((r) => (r.ok ? r.json() : null))
            .then((snap) => {
              const md = snap?.endgame?.post_mortem_long_read;
              if (md) {
                setEndgame((prev) => ({ ...prev, post_mortem_long_read: md }));
              }
            })
            .catch(() => {});
        }
      }
    } catch {
      /* corrupt entry — keep server fallback */
    }
  }, [runId]);

  // responsive scale: fit the 1080×1350 card into the available stage width
  useEffect(() => {
    function recompute() {
      const stage = stageRef.current;
      if (!stage) return;
      const w = stage.clientWidth;
      // leave a touch of breathing room
      const target = Math.min(1, (w - 8) / CARD_WIDTH);
      setScale(target);
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  const permalink = `${SHARE_DOMAIN}/run/${runId}`;

  const flashToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const onDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const lib = await loadHtmlToImage();
      if (!lib) {
        flashToast("install `html-to-image` to enable PNG export");
        return;
      }
      const dataUrl = await lib.toPng(cardRef.current, {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        pixelRatio: 1,
        cacheBust: true,
        // ensure paper bg renders even if some downstream sets transparent
        backgroundColor: "#15130f",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `30u30-${slugify(endgame.company_name)}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      flashToast("png export failed — try screenshot instead");
    } finally {
      setDownloading(false);
    }
  }, [endgame.company_name, flashToast]);

  const onTweet = useCallback(() => {
    const text = `${endgame.tagline} watch the run on @30u30fail`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(permalink)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [endgame.tagline, permalink]);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(permalink);
      flashToast("link copied");
    } catch {
      flashToast("copy failed — long-press to select");
    }
  }, [permalink, flashToast]);

  // visible portion of the long-read body — split on blank lines
  const paragraphs = endgame.post_mortem_long_read
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col min-h-screen bg-paper text-ink">
      {/* ── TOP BAR ────────────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-3 h-9 border-b border-ink shrink-0"
        style={{ borderBottomWidth: "1.4px" }}
      >
        <span
          className="font-mono uppercase tracking-wider"
          style={{ fontSize: 11, fontWeight: 700 }}
        >
          FORBES · 30u30 SIMULATOR
        </span>
        <span className="text-soft" style={{ fontSize: 10 }}>
          /
        </span>
        <span
          className="font-mono uppercase tracking-wider text-soft"
          style={{ fontSize: 10 }}
        >
          POST-MORTEM
        </span>
        <Link
          href={`/run/${runId}`}
          className="ml-auto font-mono uppercase tracking-wider text-soft hover:text-ink"
          style={{ fontSize: 10 }}
        >
          ← BACK TO RUN
        </Link>
        <div className="ml-2">
          <UserMenu />
        </div>
      </div>

      {/* ── HERO: card + CTAs ─────────────────────────────────── */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-8 px-4 md:px-8 pt-8 pb-10">
        {/* card stage with paper-2 backdrop */}
        <div
          ref={stageRef}
          className="bg-paper2 flex items-start justify-center"
          style={{
            border: "1.4px solid var(--ink)",
            padding: 16,
            minHeight: 200,
          }}
        >
          <div
            style={{
              width: CARD_WIDTH * scale,
              height: CARD_HEIGHT * scale,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <ShareCard ref={cardRef} endgame={endgame} runId={runId} />
            </div>
          </div>
        </div>

        {/* CTAs column */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onDownload}
            disabled={downloading}
            className="brutalist-btn"
            style={{ textAlign: "left" }}
          >
            {downloading ? "RENDERING…" : "DOWNLOAD PNG"}
          </button>
          <button
            type="button"
            onClick={onTweet}
            className="brutalist-btn"
            style={{ textAlign: "left" }}
          >
            SHARE TWEET
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="brutalist-btn"
            style={{ textAlign: "left" }}
          >
            COPY LINK
          </button>
          <Link
            href={`/run/${runId}?replay=1`}
            className="brutalist-btn"
            style={{
              textAlign: "left",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            REPLAY THIS RUN
          </Link>
          <Link
            href="/"
            className="brutalist-btn"
            style={{
              textAlign: "left",
              textDecoration: "none",
              display: "inline-block",
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          >
            NEW RUN
          </Link>

          {/* compact run summary card */}
          <div
            className="mt-3"
            style={{
              border: "1.4px solid var(--ink)",
              padding: 14,
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            <div
              className="font-mono uppercase"
              style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                color: "var(--soft)",
                marginBottom: 6,
              }}
            >
              ENDGAME
            </div>
            <div className="font-body" style={{ fontSize: 14 }}>
              {endgame.title}
            </div>
            <div
              className="font-mono"
              style={{
                marginTop: 8,
                fontSize: 10,
                color: "var(--soft)",
              }}
            >
              {endgame.endgame_id} · {endgame.archetype}
            </div>
          </div>

          <p
            className="font-mono"
            style={{
              fontSize: 10,
              color: "var(--soft)",
              lineHeight: 1.5,
              marginTop: 4,
            }}
          >
            a fictional simulation. real-named figures appear only as public-persona
            reactions.
          </p>
        </div>
      </div>

      {/* ── POST-MORTEM LONG READ ─────────────────────────────── */}
      <div className="px-4 md:px-8 pb-24">
        <div
          style={{
            maxWidth: "65ch",
            margin: "0 auto",
            borderTop: "1.4px solid var(--ink)",
            paddingTop: 28,
          }}
        >
          <div
            className="font-mono uppercase"
            style={{
              fontSize: 11,
              letterSpacing: "0.16em",
              color: "var(--alarm)",
              fontWeight: 700,
              marginBottom: 6,
            }}
          >
            BY THE NUMBERS · POST-MORTEM
          </div>
          <h1
            className="font-body"
            style={{
              fontSize: 32,
              lineHeight: 1.1,
              letterSpacing: "-0.005em",
              marginBottom: 18,
            }}
          >
            {endgame.title}
          </h1>
          <div
            className="font-body italic"
            style={{
              fontSize: 16,
              color: "var(--ink-2)",
              marginBottom: 22,
            }}
          >
            {endgame.final_headline}
          </div>

          <article
            className="font-body"
            style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: "var(--ink-2)",
            }}
          >
            {paragraphs.map((p, i) => (
              <p key={i} style={{ marginBottom: 18 }}>
                {p}
              </p>
            ))}
          </article>
        </div>
      </div>

      {/* tiny toast */}
      {toast && (
        <div
          role="status"
          className="fixed font-mono uppercase"
          style={{
            right: 16,
            bottom: 16,
            border: "1.4px solid var(--ink)",
            background: "var(--paper-2)",
            padding: "10px 14px",
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "var(--ink)",
            zIndex: 50,
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}
