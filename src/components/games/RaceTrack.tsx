"use client";

import { useState, useEffect, useCallback } from "react";
import { Flag, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameQuestion, GameResult } from "./types";
import parse from "html-react-parser";

interface RaceTrackProps {
  questions: GameQuestion[];
  onGameOver: (result: GameResult) => void;
}

const TOTAL_LAPS = 10;

export default function RaceTrack({ questions, onGameOver }: RaceTrackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playerPos, setPlayerPos] = useState(0);
  const [aiPos, setAiPos] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [startTime] = useState(Date.now());

  const question = questions[currentIndex % questions.length]!;

  const endGame = useCallback(
    (winner: "player" | "ai") => {
      if (gameEnded) return;
      setGameEnded(true);
      onGameOver({
        score: score + (winner === "player" ? 50 : 0),
        total: correct + wrong,
        correct,
        wrong,
        timeSpent: Math.round((Date.now() - startTime) / 1000),
        streak: bestStreak,
      });
    },
    [gameEnded, score, correct, wrong, startTime, bestStreak, onGameOver]
  );

  useEffect(() => {
    if (playerPos >= TOTAL_LAPS) endGame("player");
    else if (aiPos >= TOTAL_LAPS) endGame("ai");
  }, [playerPos, aiPos, endGame]);

  const handleAnswer = (option: string) => {
    if (selectedOption || gameEnded) return;
    setSelectedOption(option);
    const isRight = option === question.answer;
    setIsCorrect(isRight);

    if (isRight) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((p) => Math.max(p, newStreak));
      setPlayerPos((p) => Math.min(p + 1, TOTAL_LAPS));
      setScore((p) => p + 10);
      setCorrect((p) => p + 1);
      // AI sometimes moves on correct
      if (Math.random() < 0.3) setAiPos((p) => Math.min(p + 1, TOTAL_LAPS));
    } else {
      setStreak(0);
      setWrong((p) => p + 1);
      // AI always moves on wrong
      setAiPos((p) => Math.min(p + 1, TOTAL_LAPS));
      // AI sometimes gets a bonus
      if (Math.random() < 0.2) setAiPos((p) => Math.min(p + 1, TOTAL_LAPS));
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setCurrentIndex((p) => p + 1);
    }, 1000);
  };

  const playerPercent = (playerPos / TOTAL_LAPS) * 100;
  const aiPercent = (aiPos / TOTAL_LAPS) * 100;

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Score */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-black">{score} pts</span>
        <span className="text-sm text-muted-foreground">Q{currentIndex + 1}</span>
      </div>

      {/* Race Track */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4 space-y-3">
        <div className="text-xs font-medium text-muted-foreground mb-2">RACE TRACK</div>

        {/* Player track */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-blue-600 dark:text-blue-400">You</span>
            <span className="text-muted-foreground">{playerPos}/{TOTAL_LAPS}</span>
          </div>
          <div className="relative h-8 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex items-center" style={{ width: "100%" }}>
              {/* Track markers */}
              {Array.from({ length: TOTAL_LAPS + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
                  style={{ left: `${(i / TOTAL_LAPS) * 100}%` }}
                />
              ))}
            </div>
            <div
              className="absolute top-1 transition-all duration-500 ease-out"
              style={{ left: `calc(${playerPercent}% - ${playerPercent > 5 ? 20 : 0}px)` }}
            >
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">
                <Car size={14} />
              </div>
            </div>
            {/* Finish line */}
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-emerald-200 dark:to-emerald-900/50 flex items-center justify-center">
              <Flag size={14} className="text-emerald-600" />
            </div>
          </div>
        </div>

        {/* AI track */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-red-600 dark:text-red-400">Opponent</span>
            <span className="text-muted-foreground">{aiPos}/{TOTAL_LAPS}</span>
          </div>
          <div className="relative h-8 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div className="absolute inset-y-0 left-0 flex items-center" style={{ width: "100%" }}>
              {Array.from({ length: TOTAL_LAPS + 1 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700"
                  style={{ left: `${(i / TOTAL_LAPS) * 100}%` }}
                />
              ))}
            </div>
            <div
              className="absolute top-1 transition-all duration-500 ease-out"
              style={{ left: `calc(${aiPercent}% - ${aiPercent > 5 ? 20 : 0}px)` }}
            >
              <div className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg">
                <Car size={14} />
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-emerald-200 dark:to-emerald-900/50 flex items-center justify-center">
              <Flag size={14} className="text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5 min-h-[100px] flex items-center justify-center">
        <div className="text-center text-sm font-medium leading-relaxed">
          {parse(question.question)}
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
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
                !selectedOption && "border-gray-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 active:scale-[0.98]",
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
    </div>
  );
}
