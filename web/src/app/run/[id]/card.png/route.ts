/**
 * /run/{id}/card.png
 *
 * Edge-rendered 1200×630 OG PNG via @vercel/og. This is the landscape
 * social-embed variant — Twitter & Bluesky `summary_large_image` cards
 * use these dimensions natively. The in-app post-mortem card stays at
 * 1080×1350 (portrait) and lives in `components/post-mortem/share-card.tsx`.
 *
 * Caching: 1 hour at the browser, 24 hours at the edge. Twitter scrapers
 * re-fetch occasionally; we want them hitting the edge cache.
 */
import { ImageResponse } from "next/og";
import {
  OG_HEIGHT,
  OG_WIDTH,
  loadOgFonts,
  renderDefaultOgCard,
  renderRunOgCard,
  resolveOgData,
} from "@/lib/og-card";

export const runtime = "edge";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { endgame, runId, found } = resolveOgData(id);
    const fonts = await loadOgFonts();

    return new ImageResponse(
      renderRunOgCard({ endgame, runId, notFound: !found }),
      {
        width: OG_WIDTH,
        height: OG_HEIGHT,
        fonts,
        headers: {
          "Cache-Control":
            "public, immutable, max-age=3600, s-maxage=86400",
          "Content-Type": "image/png",
        },
      },
    );
  } catch {
    // Never let a render error 500 the scraper — serve the default card.
    const fonts = await loadOgFonts().catch(() => []);
    return new ImageResponse(renderDefaultOgCard(), {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts,
      headers: {
        "Cache-Control": "public, max-age=300",
        "Content-Type": "image/png",
      },
    });
  }
}
