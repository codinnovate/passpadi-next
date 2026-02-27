"use client";

import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface RankEntry {
  _id: string;
  user?: { name?: string; username?: string; profile_img?: string };
  score: number;
  rank?: number;
}

const podiumConfig = [
  {
    // 2nd place — left column
    rank: 2,
    podiumHeight: "h-28",
    avatarSize: "size-16",
    ringColor: "ring-gray-300 dark:ring-gray-500",
    trophyColor: "text-gray-400",
    badgeBg: "bg-gray-400",
    cardBg: "bg-gray-100 dark:bg-white/5",
    cardBorder: "border-gray-200 dark:border-white/10",
  },
  {
    // 1st place — center column
    rank: 1,
    podiumHeight: "h-36",
    avatarSize: "size-20",
    ringColor: "ring-yellow-400",
    trophyColor: "text-yellow-400",
    badgeBg: "bg-yellow-500",
    cardBg: "bg-gray-100 dark:bg-white/5",
    cardBorder: "border-yellow-200 dark:border-yellow-500/20",
  },
  {
    // 3rd place — right column
    rank: 3,
    podiumHeight: "h-24",
    avatarSize: "size-14",
    ringColor: "ring-amber-600",
    trophyColor: "text-amber-600",
    badgeBg: "bg-amber-600",
    cardBg: "bg-gray-100 dark:bg-white/5",
    cardBorder: "border-gray-200 dark:border-white/10",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function LeaderboardPodium({
  entries,
}: {
  entries: RankEntry[];
}) {
  if (entries.length < 1) return null;

  // Pad to 3 if fewer entries
  const padded = [...entries];
  while (padded.length < 3) {
    padded.push({ _id: `empty-${padded.length}`, score: 0, user: undefined });
  }

  // Display order: 2nd, 1st, 3rd
  const ordered = [padded[1], padded[0], padded[2]];

  return (
    <div className="relative px-2 pt-6 pb-0">
      {/* Podium row */}
      <div className="relative flex items-end justify-center gap-2 sm:gap-4">
        {ordered.map((entry, i) => {
          const config = podiumConfig[i];
          const name =
            entry?.user?.name ?? entry?.user?.username ?? "—";
          const initials = entry?.user ? getInitials(name) : "?";
          const isEmpty = !entry?.user;

          return (
            <div
              key={entry?._id ?? i}
              className="flex flex-col items-center flex-1 max-w-[180px]"
            >
              {/* Avatar + rank badge */}
              {!isEmpty ? (
                <div className="relative mb-2">
                  <Avatar
                    className={cn(
                      config.avatarSize,
                      "ring-[3px]",
                      config.ringColor
                    )}
                  >
                    {entry?.user?.profile_img && (
                      <AvatarImage
                        src={entry.user.profile_img}
                        alt={name}
                      />
                    )}
                    <AvatarFallback
                      className={cn(
                        "bg-app-primary/10 text-app-primary font-bold",
                        config.rank === 1 ? "text-base" : "text-sm"
                      )}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full text-[10px] font-bold text-white shadow-md",
                      config.rank === 1 ? "size-6" : "size-5",
                      config.badgeBg
                    )}
                  >
                    {config.rank}
                  </span>
                </div>
              ) : (
                <div
                  className={cn(
                    "rounded-full bg-muted mb-2 flex items-center justify-center text-muted-foreground",
                    config.avatarSize
                  )}
                >
                  ?
                </div>
              )}

              {/* Name */}
              <p
                className={cn(
                  "text-foreground font-semibold text-center truncate w-full mb-2",
                  config.rank === 1 ? "text-sm" : "text-xs"
                )}
              >
                {name}
              </p>

              {/* Podium bar */}
              <div
                className={cn(
                  "w-full rounded-t-xl flex flex-col items-center justify-start pt-3 gap-1 border-t border-x",
                  config.podiumHeight,
                  config.cardBg,
                  config.cardBorder
                )}
              >
                <Trophy
                  className={cn(
                    config.trophyColor,
                    config.rank === 1 ? "size-6" : "size-5"
                  )}
                />
                <span
                  className={cn(
                    "font-bold text-foreground",
                    config.rank === 1 ? "text-lg" : "text-sm"
                  )}
                >
                  {(entry?.score ?? 0).toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {entry?.score === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
