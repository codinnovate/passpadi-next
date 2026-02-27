"use client";

import { useGetUserXPSummaryQuery } from "@/store/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function XPSummaryCard() {
  const { data, isLoading, isError } = useGetUserXPSummaryQuery(undefined);

  // Don't render if not authenticated or error
  if (isError) return null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
          <Skeleton className="h-2 w-full mt-4" />
        </CardContent>
      </Card>
    );
  }

  const summary = data?.data;
  if (!summary) return null;

  const {
    totalXP,
    level,
    nextLevelXP,
    streak,
    multiplier,
    weeklyXP,
  } = summary;

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
    <Card>
      <CardHeader>
        <CardTitle>Your XP</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <span className="text-2xl font-bold">{totalXP.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">Total XP</span>
          </div>
          <Badge variant="secondary" className="text-sm">
            Level {level}
          </Badge>
          <div className="flex flex-col">
            <span className="text-lg font-semibold">{weeklyXP}</span>
            <span className="text-xs text-muted-foreground">This Week</span>
          </div>
          {streak > 0 && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                {streak} day{streak !== 1 ? "s" : ""}
              </span>
              <span className="text-xs text-muted-foreground">
                Streak {multiplier > 1 ? `(${multiplier}x)` : ""}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Progress value={progressPercent} />
          <span className="text-xs text-muted-foreground">
            {nextLevelXP
              ? `${totalXP.toLocaleString()} / ${nextLevelXP.toLocaleString()} XP to Level ${level + 1}`
              : "Max level reached!"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

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
