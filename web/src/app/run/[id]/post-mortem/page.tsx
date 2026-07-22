import type { Metadata } from "next";
import { PostMortemScreen } from "@/components/post-mortem/post-mortem-screen";
import { MOCK_ENDGAME, type EndgameSnapshot } from "@/lib/mock-endgame";

const SHARE_DOMAIN = "https://30u30.fail";

type Params = { id: string };

/**
 * Per-run metadata: when someone shares /run/{id}/post-mortem on Twitter or
 * Bluesky, the embed renders the cursed trading card preview via the OG image
 * route.
 *
 * Data source priority:
 *
 *   1. live mode (NEXT_PUBLIC_API_MODE = local|prod) + completed run
 *      → fetch /run/{id} snapshot, fold the backend's endgame fields onto
 *        a real EndgameSnapshot. Note: the localStorage admin override is
 *        browser-only and cannot be honoured in this server component, so
 *        we read the raw env var here.
 *   2. anything else (mock mode, in-progress run, 404, fetch error)
 *      → fall back to MOCK_ENDGAME so the page still renders.
 *
 * MOCK pinned: until the backend snapshot carries `post_mortem_long_read`
 * and `tagline`, the prose body and meme line stay mocked. The card chrome
 * (company name, archetype, stats) updates from the backend.
 */

function envApiBase(): string | null {
  const mode = process.env.NEXT_PUBLIC_API_MODE;
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (mode === "mock" || !mode) return null;
  if (mode === "local") return (url ?? "http://localhost:8000").replace(/\/+$/, "");
  if (mode === "prod" && url) return url.replace(/\/+$/, "");
  return null;
}

async function loadEndgame(runId: string): Promise<EndgameSnapshot> {
  const base = envApiBase();
  if (!base) return MOCK_ENDGAME;
  try {
    const res = await fetch(`${base}/run/${encodeURIComponent(runId)}`, {
      cache: "no-store",
    });
    if (!res.ok) return MOCK_ENDGAME;
    const snap = (await res.json()) as {
      run_id?: string;
      status?: string;
      // NOTE: `company` on the wire is the whole nested bible.
      company?: {
        company?: { display_name?: string; name?: string; one_liner?: string };
        founders?: Array<{ name?: string }>;
      };
      stats?: { valuation?: number; day?: number } & Record<string, number>;
      endgame_id?: string;
      endgame?: {
        endgame_id?: string;
        title?: string;
        final_headline?: string;
        post_mortem_long_read?: string;
        tagline?: string;
        company_name?: string;
        one_liner?: string;
        founder_name?: string;
      };
    };
    if (snap.status !== "completed") return MOCK_ENDGAME;
    const bibleCo = snap.company?.company;
    const company =
      snap.endgame?.company_name ??
      bibleCo?.display_name ??
      bibleCo?.name ??
      MOCK_ENDGAME.company_name;
    const founder =
      snap.endgame?.founder_name ??
      snap.company?.founders?.[0]?.name ??
      MOCK_ENDGAME.founder_name;
    const initials = (founder || "??")
      .split(/\s+/)
      .map((w: string) => w[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
    // Real end-of-run numbers — the mock's $4.0B / 287-day card stats read
    // as absurd on a real micro run. Final stats are the best persisted
    // truth (peak isn't tracked separately yet).
    const realStats =
      snap.stats && typeof snap.stats.valuation === "number"
        ? { ...MOCK_ENDGAME.final_stats, ...snap.stats }
        : null;
    return {
      ...MOCK_ENDGAME,
      endgame_id: snap.endgame?.endgame_id ?? snap.endgame_id ?? MOCK_ENDGAME.endgame_id,
      title: snap.endgame?.title ?? MOCK_ENDGAME.title,
      final_headline: snap.endgame?.final_headline ?? MOCK_ENDGAME.final_headline,
      post_mortem_long_read:
        snap.endgame?.post_mortem_long_read ?? MOCK_ENDGAME.post_mortem_long_read,
      tagline: snap.endgame?.tagline ?? MOCK_ENDGAME.tagline,
      company_name: company.toUpperCase(),
      company_one_liner:
        snap.endgame?.one_liner ?? bibleCo?.one_liner ?? MOCK_ENDGAME.company_one_liner,
      founder_name: founder,
      founder_initials: initials,
      ...(realStats
        ? { final_stats: realStats, peak_stats: realStats }
        : {}),
    };
  } catch {
    // Backend down → return the demo so the page still ships.
    return MOCK_ENDGAME;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const endgame = await loadEndgame(id);
  const title = `${endgame.company_name} · 30u30 cursed edition`;
  const description = endgame.tagline;
  const cardImage = `${SHARE_DOMAIN}/run/${id}/card.png`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SHARE_DOMAIN}/run/${id}/post-mortem`,
      siteName: "30u30.fail",
      // The card.png route renders 1200×630 (Twitter/Bluesky `summary_large_image` native).
      images: [{ url: cardImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [cardImage],
    },
  };
}

export default async function PostMortemPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const endgame = await loadEndgame(id);
  return <PostMortemScreen endgame={endgame} runId={id} />;
}
