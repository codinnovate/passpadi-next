"use client";

import { useMemo } from "react";
import { Flame } from "lucide-react";
import { useGetUserXPSummaryQuery } from "@/store/api";
import { Skeleton } from "@/components/ui/skeleton";

const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildTwoWeeks(today: Date, streak: number) {
  const monday = getMonday(today);
  const prevMonday = new Date(monday);
  prevMonday.setDate(prevMonday.getDate() - 7);

  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const streakStart = new Date(todayStart);
  streakStart.setDate(streakStart.getDate() - (streak - 1));

  const weeks: {
    date: number;
    active: boolean;
    isToday: boolean;
    future: boolean;
  }[][] = [];

  for (const weekStart of [prevMonday, monday]) {
    const week: (typeof weeks)[number] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      d.setHours(0, 0, 0, 0);

      const isFuture = d > todayStart;
      const isActive =
        !isFuture && streak > 0 && d >= streakStart && d <= todayStart;

      week.push({
        date: d.getDate(),
        active: isActive,
        isToday: d.getTime() === todayStart.getTime(),
        future: isFuture,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

export default function ActivityStreak() {
  const { data, isLoading, isError } = useGetUserXPSummaryQuery(undefined);

  const weeks = useMemo(() => {
    const streak = data?.data?.streak ?? 0;
    return buildTwoWeeks(new Date(), streak);
  }, [data]);

  if (isError) return null;

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-7 gap-3">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="h-3 w-6" />
              <Skeleton className="size-10 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const streak = data?.data?.streak ?? 0;

  return (
    <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-b from-blue-50/50 to-card dark:from-blue-950/20 dark:to-card p-4 sm:p-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center size-8 rounded-lg bg-orange-500/10">
            <Flame size={16} className="text-orange-500 fill-orange-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">
              Activity Streak
            </h3>
            {streak > 0 && (
              <p className="text-xs text-muted-foreground">
                {streak} day{streak !== 1 ? "s" : ""} and counting
              </p>
            )}
          </div>
        </div>
        {streak > 0 && (
          <span
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 animate-[popIn_0.5s_ease_both]"
            style={{ animationDelay: "400ms" }}
          >
            {streak}
          </span>
        )}
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto -mx-1 px-1">
        <div className="min-w-[300px]">
          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="text-center text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-col gap-2">
            {weeks.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7">
                {week.map((day, di) => {
                  const idx = wi * 7 + di;
                  const isFirst = di === 0;
                  const prevDay = !isFirst ? week[di - 1] : null;
                  const bothActive = day.active && prevDay?.active;
                  const lineDelay = idx * 30 + 100;

                  return (
                    <div
                      key={di}
                      className="flex flex-col items-center gap-1 animate-[fadeSlideUp_0.35s_ease_both]"
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >
                      {/* Date number */}
                      <span
                        className={`text-[11px] font-medium tabular-nums leading-none ${
                          day.isToday
                            ? "text-blue-600 dark:text-blue-400 font-bold"
                            : day.future
                              ? "text-muted-foreground/30"
                              : day.active
                                ? "text-foreground"
                                : "text-muted-foreground/60"
                        }`}
                      >
                        {day.date}
                      </span>

                      {/* Circle + connector line */}
                      <div className="relative flex items-center justify-center">
                        {/* Connector line to previous day */}
                        {!isFirst && (
                          <div
                            className="absolute right-1/2 top-1/2 -translate-y-1/2 h-[3px] origin-right"
                            style={{
                              width: "calc(100% + 0.25rem)",
                              animationDelay: `${lineDelay}ms`,
                            }}
                          >
                            <div
                              className={`h-full rounded-full animate-[growLine_0.4s_ease_both] ${
                                bothActive
                                  ? "bg-blue-500"
                                  : "bg-muted-foreground/10"
                              }`}
                              style={{ animationDelay: `${lineDelay}ms` }}
                            />
                          </div>
                        )}

                        {day.active ? (
                          <div
                            className="relative z-10 flex items-center justify-center size-9 sm:size-10 rounded-full bg-blue-500 shadow-[0_2px_8px_rgba(37,99,235,0.3)] animate-[popIn_0.35s_ease_both]"
                            style={{ animationDelay: `${idx * 30 + 150}ms` }}
                          >
                            <span className="text-xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]">🔥</span>
                          </div>
                        ) : (
                          <div
                            className={`relative z-10 flex items-center justify-center size-9 sm:size-10 rounded-full border-2 border-dashed bg-card ${
                              day.future
                                ? "border-muted-foreground/10"
                                : day.isToday
                                  ? "border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/30"
                                  : "border-muted-foreground/15"
                            }`}
                          >
                            {!day.future && !day.isToday && (
                              <span className="text-base">😥</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
