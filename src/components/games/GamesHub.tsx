"use client";

import Link from "next/link";
import { Zap, Heart, Car, Building2, Clock, Brain, PersonStanding } from "lucide-react";
import { cn } from "@/lib/utils";
import { GAMES, type GameInfo } from "./types";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  RUNNER: PersonStanding,
  ZAP: Zap,
  HEART: Heart,
  CAR: Car,
  BUILDING: Building2,
  CLOCK: Clock,
  BRAIN: Brain,
};

function FeaturedGameCard({ game }: { game: GameInfo }) {
  const Icon = iconMap[game.icon] || Zap;

  return (
    <Link href={`/dashboard/games/${game.id}`}>
      <div className="group relative rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]">
        <div className={cn("h-56 sm:h-64 bg-gradient-to-br flex items-center justify-center relative", game.color, game.darkColor)}>
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-4 w-20 h-20 rounded-full bg-white/10 blur-xl" />
            <div className="absolute bottom-4 right-4 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative flex flex-col items-center gap-3">
            <Icon size={64} className="text-white/90 group-hover:scale-110 transition-transform duration-300" />
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-bold text-white">
              FEATURED
            </div>
          </div>
          <div className="absolute top-4 right-4 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            {game.difficulty}
          </div>
        </div>
        <div className="p-5 bg-white dark:bg-gray-900">
          <h3 className="font-bold text-xl">{game.title}</h3>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            {game.description}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 px-2 py-0.5 text-cyan-700 dark:text-cyan-400 font-medium">
              3D Runner
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 text-blue-700 dark:text-blue-400 font-medium">
              Endless
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 text-purple-700 dark:text-purple-400 font-medium">
              Swipe
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function GameCard({ game }: { game: GameInfo }) {
  const Icon = iconMap[game.icon] || Zap;

  return (
    <Link href={`/dashboard/games/${game.id}`}>
      <div className="group rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-transparent active:scale-[0.98]">
        <div className={cn("h-32 bg-gradient-to-br flex items-center justify-center relative", game.color, game.darkColor)}>
          <Icon size={48} className="text-white/90 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute top-3 right-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white">
            {game.difficulty}
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base">{game.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
            {game.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function GamesHub() {
  const [featured, ...rest] = GAMES;

  return (
    <div className="space-y-6">
      {/* Featured game */}
      {featured && <FeaturedGameCard game={featured} />}

      {/* Other games grid */}
      <div>
        <h2 className="text-lg font-semibold mb-3">More Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rest.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
}
