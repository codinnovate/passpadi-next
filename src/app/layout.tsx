import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-ZYP9182XT3";

export const metadata: Metadata = {
  title: {
    default: "90percent |  Pass JAMB & Post UTME in one go",
    template: "%s | 90percent",
  },
  description:
    "90percent helps you prepare smarter with past questions, AI explanations, and study tools. Pass your JAMB and Post‑UTME in one goal.",
  keywords: [
    "90percent",
    "pass your jamb",
    "My School",
    "My School Cbt",
    "pass jamb",
    "330",
    "three thirty",
    "jamb",
    "utme",
    "post utme",
    "post utme apps",
    "pass post utme",
    "exam prep",
    "cbt practice",
    "past questions",
    "Jamb Past Questions",
    "university admission",
    "waec",
    "neco",
    "nigeria",
    "education",
    "mathematics",
    "english",
    "physics",
    "chemistry",
    "biology",
    "economics",
    "government",
  ],
  applicationName: "90percent",
  authors: [{ name: "90percent" }],
  creator: "90percent",
  publisher: "90percent",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "90percent — Pass JAMB & Post‑UTME in one goal",
    description:
      "Prepare smarter for JAMB and Post‑UTME with past questions, AI explanations, and study tools.",
    url: "/",
    siteName: "90percent",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "90percent — Pass JAMB & Post‑UTME in one go",
    description:
      "Pass your JAMB and Post UTME in one goal with smart practice and explanations.",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  category: "Education",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        id="ga"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="ga-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `,
        }}
      />
      <Script
        id="google-adsense-script"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8689849165840696"
        crossOrigin="anonymous"
      />
      <Script
        id="katex"
        defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"
        integrity="sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg"
        crossOrigin="anonymous"
      />
      <Script
        id="katex-renderer"
        defer
        src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
        integrity="sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk"
        crossOrigin="anonymous"
      />
      <body className="flex min-h-screen flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
