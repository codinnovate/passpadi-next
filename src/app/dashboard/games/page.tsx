import type { Metadata } from "next";
import GamesHub from "@/components/games/GamesHub";

export const metadata: Metadata = {
  title: "Games — Learn While Playing",
  description:
    "Play interactive quiz games to make studying fun. Speed Blitz, Survival Mode, Race Track, and more — all powered by real exam questions.",
  openGraph: {
    title: "Games — Learn While Playing | 90percent",
    description:
      "Play interactive quiz games to make studying fun. Powered by real exam questions.",
    url: "/dashboard/games",
    siteName: "90percent",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Games — Learn While Playing | 90percent",
    description:
      "Play interactive quiz games powered by real exam questions.",
  },
  alternates: {
    canonical: "/dashboard/games",
  },
};

export default function GamesPage() {
  return (
    <div className="flex flex-col w-full gap-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">Games</h1>
        <p className="text-muted-foreground mt-1">
          Learn while you play — pick a game and test your knowledge
        </p>
      </div>
      <GamesHub />
    </div>
  );
}
