/**
 * /og/default.png
 *
 * Generic landing-page OG image — what shows up when someone shares the
 * homepage URL on Twitter, Bluesky, iMessage, etc. Same edge-renderer
 * approach as the per-run /run/{id}/card.png route, just without a run id.
 *
 * This URL is referenced as the default share image in `app/layout.tsx`.
 */
import { ImageResponse } from "next/og";
import {
  OG_HEIGHT,
  OG_WIDTH,
  loadOgFonts,
  renderDefaultOgCard,
} from "@/lib/og-card";

export const runtime = "edge";

export async function GET() {
  const fonts = await loadOgFonts().catch(() => []);
  return new ImageResponse(renderDefaultOgCard(), {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts,
    headers: {
      "Cache-Control": "public, immutable, max-age=3600, s-maxage=86400",
      "Content-Type": "image/png",
    },
  });
}
