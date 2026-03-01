"use client";

import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { useGetUserXPSummaryQuery } from "@/store/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 300,
  4: 600,
  5: 1000,
  6: 1500,
  7: 2200,
  8: 3000,
  9: 4000,
  10: 5500,
};

function getLevelThreshold(level: number): number {
  return LEVEL_THRESHOLDS[level] ?? 0;
}

export default function XPStreakCard() {
  const { data, isLoading, isError } = useGetUserXPSummaryQuery(undefined);

  if (isError) return null;

  if (isLoading) {
    return (
      <Card className="py-4">
        <CardContent className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-2 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const summary = data?.data;
  if (!summary) return null;

  const { totalXP, level, nextLevelXP, streak, weeklyXP } = summary;
  const currentLevelXP = getLevelThreshold(level);
  const progressPercent = nextLevelXP
    ? Math.min(
        Math.round(
          ((totalXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
        ),
        100
      )
    : 100;

  return (
    <Card className="py-4">
      <CardContent className="flex flex-col gap-3">
        {/* Streak + Level row */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-orange-500/10">
            <Flame size={20} className="text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">
                {streak} day{streak !== 1 ? "s" : ""} streak
              </span>
              <Badge variant="secondary" className="text-[10px] h-5">
                Lv. {level}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalXP.toLocaleString()} XP total
            </p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="flex flex-col gap-1">
          <Progress value={progressPercent} className="h-1.5" />
          <span className="text-[10px] text-muted-foreground">
            {nextLevelXP
              ? `${totalXP.toLocaleString()} / ${nextLevelXP.toLocaleString()} XP to Level ${level + 1}`
              : "Max level reached!"}
          </span>
        </div>

        {/* Weekly XP + Link */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold">{weeklyXP}</span>
            <span className="text-[10px] text-muted-foreground">This week</span>
          </div>
          <Link
            href="/dashboard/leaderboard"
            className="flex items-center gap-1 text-xs font-medium text-app-primary hover:underline"
          >
            View Details <ArrowRight size={12} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
