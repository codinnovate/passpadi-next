import type { Metadata } from "next";
import { FeedView } from "@/modules/feed";

export const metadata: Metadata = {
  title: "Feeds — Community Updates & Discussions",
  description:
    "Stay connected with the 90percent community. Read updates, share tips, and discuss study strategies with fellow students.",
  openGraph: {
    title: "Feeds — Community Updates & Discussions | 90percent",
    description:
      "Stay connected with the 90percent community. Read updates, share tips, and discuss study strategies.",
    url: "/feeds",
    siteName: "90percent",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Feeds — Community Updates & Discussions | 90percent",
    description:
      "Stay connected with the 90percent community. Share tips and discuss study strategies.",
  },
  alternates: {
    canonical: "/feeds",
  },
};

export default function FeedsPage() {
  return (
    <div className="flex flex-col w-full gap-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">Feeds</h1>
        <p className="text-muted-foreground mt-1">
          Community updates, tips, and discussions
        </p>
      </div>
      <FeedView />
    </div>
  );
}
