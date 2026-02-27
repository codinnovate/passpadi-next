import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: {
    default: "90percent — Pass JAMB & Post‑UTME in one go",
    template: "%s | 90percent",
  },
  description:
    "90percent helps you prepare smarter with past questions, AI explanations, and study tools. Pass your JAMB and Post‑UTME in one goal.",
  keywords: [
    "90percent",
    "pass your jamb",
    "pass jamb",
    "jamb",
    "utme",
    "post utme",
    "post‑utme",
    "pass post utme",
    "exam prep",
    "cbt practice",
    "past questions",
    "study planner",
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
    title: "90percent — Pass JAMB & Post‑UTME in one goal",
    description:
      "Pass your JAMB and Post‑UTME in one goal with smart practice and explanations.",
  },
  alternates: {
    canonical: "/",
  },
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
