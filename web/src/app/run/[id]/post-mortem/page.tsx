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
      company?: { display_name?: string; name?: string; one_liner?: string; founder?: string };
      endgame_id?: string;
      endgame?: {
        endgame_id?: string;
        title?: string;
        final_headline?: string;
        post_mortem_long_read?: string;
        archetype?: string;
        tagline?: string;
      };
    };
    if (snap.status !== "completed") return MOCK_ENDGAME;
    const company =
      snap.company?.display_name ?? snap.company?.name ?? MOCK_ENDGAME.company_name;
    const founder = snap.company?.founder ?? MOCK_ENDGAME.founder_name;
    return {
      ...MOCK_ENDGAME,
      endgame_id: snap.endgame?.endgame_id ?? snap.endgame_id ?? MOCK_ENDGAME.endgame_id,
      title: snap.endgame?.title ?? MOCK_ENDGAME.title,
      final_headline: snap.endgame?.final_headline ?? MOCK_ENDGAME.final_headline,
      post_mortem_long_read:
        snap.endgame?.post_mortem_long_read ?? MOCK_ENDGAME.post_mortem_long_read,
      tagline: snap.endgame?.tagline ?? MOCK_ENDGAME.tagline,
      company_name: company.toUpperCase(),
      company_one_liner: snap.company?.one_liner ?? MOCK_ENDGAME.company_one_liner,
      founder_name: founder,
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
