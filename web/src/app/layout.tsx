import type { Metadata } from "next";
import { Special_Elite, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { OfflineBanner } from "@/components/system/offline-banner";
import { AppSessionProvider } from "@/components/system/session-provider";

const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SHARE_DOMAIN = "https://30u30.fail";
const DEFAULT_TITLE = "FORBES · 30u30 SIMULATOR";
const DEFAULT_DESCRIPTION =
  "Watch an AI commit fraud in real time as your startup. Avg run: 18 min. Avg ending: prison.";
/** generic fallback card used on the homepage and any route without a per-run override. */
const DEFAULT_CARD_IMAGE = `${SHARE_DOMAIN}/og/default.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SHARE_DOMAIN),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · 30u30",
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SHARE_DOMAIN,
    siteName: "30u30.fail",
    images: [
      {
        url: DEFAULT_CARD_IMAGE,
        // 1200×630 = Twitter / Bluesky `summary_large_image` native size.
        width: 1200,
        height: 630,
        alt: "30u30 simulator — cursed trading card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_CARD_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${specialElite.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-paper text-ink antialiased font-body">
        <AppSessionProvider>
          {children}
          <OfflineBanner />
        </AppSessionProvider>
      </body>
    </html>
  );
}
