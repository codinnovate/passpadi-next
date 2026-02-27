"use client";

import Link from "next/link";
import { ArrowRight, Trophy } from "lucide-react";
import { useGetLeaderboardQuery } from "@/store/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const rankColors: Record<number, string> = {
  1: "bg-yellow-500 text-white",
  2: "bg-gray-400 text-white",
  3: "bg-amber-700 text-white",
};

export default function LeaderboardPreview() {
  const { data, isLoading, isError } = useGetLeaderboardQuery({
    period: "weekly",
  });

  if (isError) return null;

  const rankings = data?.data ?? data?.leaderboard ?? [];

  return (
    <Card className="py-4">
      <CardHeader className="pb-0 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Trophy size={16} className="text-yellow-500" />
            Top Students
          </CardTitle>
          <Link
            href="/leaderboard"
            className="flex items-center gap-1 text-xs font-medium text-app-primary hover:underline"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-4 pt-3">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-5 rounded-full" />
                <Skeleton className="size-8 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        ) : rankings.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No rankings yet. Start practicing!
          </p>
        ) : (
          <div className="space-y-1">
            {rankings.slice(0, 5).map(
              (
                entry: {
                  _id: string;
                  rank?: number;
                  user?: {
                    name?: string;
                    username?: string;
                    profile_img?: string;
                  };
                  score: number;
                },
                index: number
              ) => {
                const name =
                  entry.user?.name ?? entry.user?.username ?? "Student";
                const initials = name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                const rank = entry.rank ?? index + 1;

                return (
                  <div
                    key={entry._id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[#F5F5F7] dark:hover:bg-white/5 transition-colors"
                  >
                    {rank <= 3 ? (
                      <span
                        className={`flex items-center justify-center size-5 rounded-full text-[10px] font-bold ${rankColors[rank]}`}
                      >
                        {rank}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center size-5 text-xs text-muted-foreground">
                        {rank}
                      </span>
                    )}
                    <Avatar className="size-7">
                      {entry.user?.profile_img && (
                        <AvatarImage
                          src={entry.user.profile_img}
                          alt={name}
                        />
                      )}
                      <AvatarFallback className="text-[10px]">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm font-medium truncate">
                      {name}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {entry.score} XP
                    </span>
                  </div>
                );
              }
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
