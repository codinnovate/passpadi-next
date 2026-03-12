"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Heart, Shield, Skull } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameQuestion, GameResult } from "./types";
import parse from "html-react-parser";

interface SurvivalModeProps {
  questions: GameQuestion[];
  onGameOver: (result: GameResult) => void;
}

const MAX_LIVES = 3;
const INITIAL_TIME_PER_QUESTION = 15;
const MIN_TIME = 5;

export default function SurvivalMode({ questions, onGameOver }: SurvivalModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [wave, setWave] = useState(1);
  const [timePerQ, setTimePerQ] = useState(INITIAL_TIME_PER_QUESTION);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_PER_QUESTION);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [screenFlash, setScreenFlash] = useState<"red" | "green" | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTime = useRef(Date.now());

  const question = questions[currentIndex % questions.length]!;

  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onGameOver({
      score,
      total: correct + wrong,
      correct,
      wrong,
      timeSpent: Math.round((Date.now() - startTime.current) / 1000),
      streak: bestStreak,
    });
  }, [score, correct, wrong, bestStreak, onGameOver]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(timePerQ);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timePerQ]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, startTimer]);

  // Handle time running out
  useEffect(() => {
    if (timeLeft === 0 && !selectedOption) {
      handleAnswer("__timeout__");
    }
  }, [timeLeft]);

  useEffect(() => {
    if (lives <= 0) endGame();
  }, [lives, endGame]);

  const handleAnswer = (option: string) => {
    if (selectedOption) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(option);
    const isRight = option === question.answer;
    setIsCorrect(isRight);

    if (isRight) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((p) => Math.max(p, newStreak));
      setScore((p) => p + 10 * wave);
      setCorrect((p) => p + 1);
      setScreenFlash("green");

      // Every 5 correct answers = new wave (faster)
      if ((correct + 1) % 5 === 0) {
        const newWave = wave + 1;
        setWave(newWave);
        setTimePerQ(Math.max(MIN_TIME, INITIAL_TIME_PER_QUESTION - newWave));
      }
    } else {
      setStreak(0);
      setWrong((p) => p + 1);
      setLives((p) => p - 1);
      setScreenFlash("red");
    }

    setTimeout(() => setScreenFlash(null), 300);
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setCurrentIndex((p) => p + 1);
    }, 1000);
  };

  const timerPercent = (timeLeft / timePerQ) * 100;

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto relative">
      {/* Screen flash overlay */}
      {screenFlash && (
        <div
          className={cn(
            "absolute inset-0 z-10 rounded-2xl pointer-events-none animate-in fade-in duration-100",
            screenFlash === "red" ? "bg-red-500/20" : "bg-emerald-500/20"
          )}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: MAX_LIVES }).map((_, i) => (
            <Heart
              key={i}
              size={24}
              className={cn(
                "transition-all duration-300",
                i < lives
                  ? "text-red-500 fill-red-500"
                  : "text-gray-300 dark:text-gray-700"
              )}
              style={i >= lives ? { transform: "scale(0.8)" } : undefined}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1">
            <Shield size={14} className="text-purple-500" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Wave {wave}</span>
          </div>
          <span className="text-xl font-black">{score}</span>
        </div>
      </div>

      {/* Timer bar */}
      <div className="h-3 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-linear",
            timerPercent > 40 ? "bg-app-primary" : timerPercent > 20 ? "bg-amber-500" : "bg-red-500 animate-pulse"
          )}
          style={{ width: `${timerPercent}%` }}
        />
      </div>

      {/* Question counter */}
      <div className="text-center text-xs text-muted-foreground">
        Question {correct + wrong + 1} | Streak: {streak}
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
                !selectedOption && "border-gray-200 dark:border-white/10 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 active:scale-[0.98]",
                showCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400",
                showWrong && "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
                selectedOption === "__timeout__" && option === question.answer && "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
                !isSelected && selectedOption && !showCorrect && "opacity-50"
              )}
            >
              <span className="mr-2 text-xs text-muted-foreground">{String.fromCharCode(65 + i)}.</span>
              {parse(option)}
            </button>
          );
        })}
      </div>

      {/* Timeout message */}
      {selectedOption === "__timeout__" && (
        <div className="flex items-center justify-center gap-2 text-red-500 animate-in fade-in duration-200">
          <Skull size={16} />
          <span className="text-sm font-medium">Time&apos;s up!</span>
        </div>
      )}
    </div>
  );
}
