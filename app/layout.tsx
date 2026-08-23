import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cron Expression Helper | Bookchaowalit",
  description: "Build and explain standard 5-field cron expressions and preview next run times.",
  keywords: ["cron","schedule","crontab","expression"],
  authors: [{ name: "Bookchaowalit", url: "https://bookchaowalit.com" }],
  creator: "Bookchaowalit",
  publisher: "Bookchaowalit",
  metadataBase: new URL("https://bookchaowalit.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Cron Expression Helper | Bookchaowalit",
    description: "Build and explain standard 5-field cron expressions and preview next run times.",
    siteName: "Bookchaowalit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cron Expression Helper | Bookchaowalit",
    description: "Build and explain standard 5-field cron expressions and preview next run times.",
    creator: "@bookchaowalit",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* THESIS: Cron is an editorial notation plate, refusing the generic utility dashboard. OWN-WORLD: near-white stock, registration marks, one periwinkle seal, and orange proofing ink. STORY: visitors set five marks, read the resulting sentence, then inspect the next impressions. FIRST VIEWPORT: oversized typographic title, central expression plate, field legend, and presets. FORM: design annual plate, assigned grounded direction 5, seed c6458837. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance */}
        <Analytics />
        <SpeedInsights />
        {children}
      </body>
    </html>
  );
}
