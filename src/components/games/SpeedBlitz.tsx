"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameQuestion, GameResult } from "./types";
import parse from "html-react-parser";

interface SpeedBlitzProps {
  questions: GameQuestion[];
  onGameOver: (result: GameResult) => void;
}

const GAME_DURATION = 60;

export default function SpeedBlitz({ questions, onGameOver }: SpeedBlitzProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [shake, setShake] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const question = questions[currentIndex % questions.length]!;

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onGameOver({
      score,
      total: answered,
      correct,
      wrong,
      timeSpent: GAME_DURATION,
      streak: bestStreak,
    });
  }, [score, answered, correct, wrong, bestStreak, onGameOver]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) endGame();
  }, [timeLeft, endGame]);

  const handleAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    const correct_ = option === question.answer;
    setIsCorrect(correct_);
    setAnswered((p) => p + 1);

    if (correct_) {
      const newStreak = streak + 1;
      const multiplier = Math.min(Math.floor(newStreak / 3) + 1, 5);
      setStreak(newStreak);
      setBestStreak((p) => Math.max(p, newStreak));
      setScore((p) => p + 10 * multiplier);
      setCorrect((p) => p + 1);
    } else {
      setStreak(0);
      setWrong((p) => p + 1);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setCurrentIndex((p) => p + 1);
    }, 800);
  };

  const timerPercent = (timeLeft / GAME_DURATION) * 100;
  const multiplier = Math.min(Math.floor(streak / 3) + 1, 5);

  return (
    <div className={cn("flex flex-col gap-4 w-full max-w-lg mx-auto", shake && "animate-shake")}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-amber-500" />
          <span className="text-2xl font-black">{score}</span>
        </div>
        <div className="flex items-center gap-3">
          {streak >= 3 && (
            <div className="flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/30 px-2 py-1 animate-in zoom-in duration-200">
              <Flame size={14} className="text-orange-500" />
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400">x{multiplier}</span>
            </div>
          )}
          <div className="text-lg font-bold tabular-nums">
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            timerPercent > 30 ? "bg-app-primary" : timerPercent > 10 ? "bg-amber-500" : "bg-red-500 animate-pulse"
          )}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Streak indicator */}
      <div className="flex gap-1 justify-center">
        {Array.from({ length: Math.min(streak, 10) }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-400 animate-in zoom-in duration-150"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>

      {/* Question */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5 min-h-[120px] flex items-center justify-center">
        <div className="text-center text-sm font-medium leading-relaxed">
          {parse(question.question)}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-2">
        {question.options.map((option, i) => {
          const isSelected = selectedOption === option;
          const showCorrect = selectedOption && option === question.answer;
          const showWrong = isSelected && !isCorrect;

          return (
            <button
              key={`${currentIndex}-${i}`}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedOption}
              className={cn(
                "rounded-xl border-2 p-3 text-left text-sm font-medium transition-all duration-200",
                !selectedOption && "border-gray-200 dark:border-white/10 hover:border-app-primary hover:bg-app-primary/5 active:scale-[0.98]",
                showCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
                showWrong && "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
                !isSelected && selectedOption && !showCorrect && "opacity-50"
              )}
            >
              <span className="mr-2 text-xs text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
              {parse(option)}
            </button>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
