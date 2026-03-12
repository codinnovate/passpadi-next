"use client";

import { useState, useEffect, useCallback } from "react";
import { ArrowUp, ArrowDown, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameQuestion, GameResult } from "./types";
import parse from "html-react-parser";

interface TowerClimbProps {
  questions: GameQuestion[];
  onGameOver: (result: GameResult) => void;
}

const TOWER_HEIGHT = 10;

export default function TowerClimb({ questions, onGameOver }: TowerClimbProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [floor, setFloor] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [startTime] = useState(Date.now());
  const [gameEnded, setGameEnded] = useState(false);

  const question = questions[currentIndex % questions.length]!;

  const endGame = useCallback(() => {
    if (gameEnded) return;
    setGameEnded(true);
    onGameOver({
      score,
      total: correct + wrong,
      correct,
      wrong,
      timeSpent: Math.round((Date.now() - startTime) / 1000),
      streak: bestStreak,
    });
  }, [gameEnded, score, correct, wrong, startTime, bestStreak, onGameOver]);

  useEffect(() => {
    if (floor >= TOWER_HEIGHT) endGame();
  }, [floor, endGame]);

  const handleAnswer = (option: string) => {
    if (selectedOption || gameEnded) return;
    setSelectedOption(option);
    const isRight = option === question.answer;
    setIsCorrect(isRight);

    if (isRight) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((p) => Math.max(p, newStreak));
      setFloor((p) => Math.min(p + 1, TOWER_HEIGHT));
      setScore((p) => p + 10);
      setCorrect((p) => p + 1);
      setDirection("up");
    } else {
      setStreak(0);
      setWrong((p) => p + 1);
      setFloor((p) => Math.max(p - 1, 0));
      setDirection("down");
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setDirection(null);
      setCurrentIndex((p) => p + 1);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-black">{score} pts</span>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          Floor {floor}/{TOWER_HEIGHT}
        </div>
      </div>

      {/* Tower visualization */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
        <div className="flex flex-col-reverse gap-1">
          {Array.from({ length: TOWER_HEIGHT }).map((_, i) => {
            const floorNum = i + 1;
            const isCurrentFloor = floor === floorNum;
            const isBelow = floor > floorNum;
            const isTop = floorNum === TOWER_HEIGHT;

            return (
              <div
                key={i}
                className={cn(
                  "h-7 rounded-md flex items-center justify-between px-3 text-xs font-medium transition-all duration-500",
                  isCurrentFloor && "bg-app-primary text-white scale-105 shadow-md",
                  isBelow && "bg-app-primary/20 text-app-primary",
                  !isCurrentFloor && !isBelow && "bg-gray-100 dark:bg-gray-800 text-gray-400",
                  isTop && isCurrentFloor && "bg-amber-500"
                )}
              >
                <span>F{floorNum}</span>
                {isTop && <Trophy size={12} />}
                {isCurrentFloor && (
                  <span className="animate-bounce">
                    {direction === "up" ? <ArrowUp size={12} /> : direction === "down" ? <ArrowDown size={12} /> : "<<"}
                  </span>
                )}
              </div>
            );
          })}
          {/* Ground floor */}
          <div
            className={cn(
              "h-7 rounded-md flex items-center px-3 text-xs font-medium transition-all duration-500",
              floor === 0 ? "bg-gray-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
            )}
          >
            Ground
            {floor === 0 && <span className="ml-auto">{"<<"}</span>}
          </div>
        </div>
      </div>

      {/* Direction indicator */}
      {direction && (
        <div
          className={cn(
            "text-center text-sm font-bold animate-in zoom-in duration-200",
            direction === "up" ? "text-emerald-500" : "text-red-500"
          )}
        >
          {direction === "up" ? "Climbing up!" : "Falling down!"}
        </div>
      )}

      {/* Question */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5 min-h-[100px] flex items-center justify-center">
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
                !selectedOption && "border-gray-200 dark:border-white/10 hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 active:scale-[0.98]",
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
