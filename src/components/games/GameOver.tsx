"use client";

import { Trophy, RotateCcw, Home, Target, Flame, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { GameResult, GameInfo } from "./types";

interface GameOverProps {
  result: GameResult;
  game: GameInfo;
  onReplay: () => void;
}

export default function GameOver({ result, game, onReplay }: GameOverProps) {
  const router = useRouter();
  const percentage = Math.round((result.correct / result.total) * 100);
  const grade =
    percentage >= 90 ? "S" :
    percentage >= 80 ? "A" :
    percentage >= 70 ? "B" :
    percentage >= 60 ? "C" :
    percentage >= 50 ? "D" : "F";

  const gradeColor =
    grade === "S" || grade === "A" ? "text-emerald-500" :
    grade === "B" ? "text-blue-500" :
    grade === "C" ? "text-amber-500" : "text-red-500";

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={cn("w-24 h-24 rounded-full bg-gradient-to-br flex items-center justify-center", game.color)}>
        <Trophy size={40} className="text-white" />
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold">Game Over!</h2>
        <p className="text-muted-foreground mt-1">Here&apos;s how you did</p>
      </div>

      <div className="flex items-center gap-2">
        <span className={cn("text-6xl font-black", gradeColor)}>{grade}</span>
        <div className="text-left">
          <p className="text-3xl font-bold">{result.score}</p>
          <p className="text-sm text-muted-foreground">points</p>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <Target size={20} className="mx-auto text-emerald-500 mb-1" />
          <p className="text-lg font-bold">{result.correct}/{result.total}</p>
          <p className="text-xs text-muted-foreground">Correct</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <Flame size={20} className="mx-auto text-orange-500 mb-1" />
          <p className="text-lg font-bold">{result.streak}</p>
          <p className="text-xs text-muted-foreground">Best Streak</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <Clock size={20} className="mx-auto text-blue-500 mb-1" />
          <p className="text-lg font-bold">{result.timeSpent}s</p>
          <p className="text-xs text-muted-foreground">Time</p>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 p-4 text-center">
          <div className="mx-auto w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center mb-1">
            <span className="text-[10px] font-bold text-white">%</span>
          </div>
          <p className="text-lg font-bold">{percentage}%</p>
          <p className="text-xs text-muted-foreground">Accuracy</p>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={onReplay}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white bg-gradient-to-r transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
            game.color
          )}
        >
          <RotateCcw size={18} />
          Play Again
        </button>
        <button
          onClick={() => router.push("/dashboard/games")}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3 font-semibold border border-gray-200 dark:border-white/10 text-foreground transition-all hover:bg-gray-50 dark:hover:bg-white/5"
        >
          <Home size={18} />
          All Games
        </button>
      </div>
    </div>
  );
}
