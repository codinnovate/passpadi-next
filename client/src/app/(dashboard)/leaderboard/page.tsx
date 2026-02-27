import type { Metadata } from "next";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import XPSummaryCard from "@/components/leaderboard/XPSummaryCard";

export const metadata: Metadata = {
  title: "Leaderboard — Top Students",
  description:
    "See who's topping the charts on 90percent. Track your ranking and compete with other students preparing for JAMB, WAEC, and more.",
  openGraph: {
    title: "Leaderboard — Top Students | 90percent",
    description:
      "See who's topping the charts. Track your ranking and compete with other students.",
    url: "/leaderboard",
    siteName: "90percent",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Leaderboard — Top Students | 90percent",
    description:
      "See who's topping the charts on 90percent. Compete with other students.",
  },
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardPage() {
  return (
    <div className="flex flex-col w-full gap-6 py-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground mt-1">
          Top-performing students across all exams
        </p>
      </div>
      <XPSummaryCard />
      <LeaderboardTable />
    </div>
  );
}
