"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Clock, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameQuestion, GameResult } from "./types";
import parse from "html-react-parser";

interface TimeAttackProps {
  questions: GameQuestion[];
  onGameOver: (result: GameResult) => void;
}

const TOTAL_QUESTIONS = 20;
const INITIAL_TIME = 60;
const BONUS_TIME = 5;
const PENALTY_TIME = 3;

export default function TimeAttack({ questions, onGameOver }: TimeAttackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeBonus, setTimeBonus] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [startTime] = useState(Date.now());
  const [gameEnded, setGameEnded] = useState(false);

  const question = questions[currentIndex % questions.length]!;
  const questionsAnswered = correct + wrong;

  const endGame = useCallback(() => {
    if (gameEnded) return;
    setGameEnded(true);
    if (timerRef.current) clearInterval(timerRef.current);
    onGameOver({
      score: score + Math.max(0, timeLeft) * 2,
      total: correct + wrong,
      correct,
      wrong,
      timeSpent: Math.round((Date.now() - startTime) / 1000),
      streak: bestStreak,
    });
  }, [gameEnded, score, timeLeft, correct, wrong, startTime, bestStreak, onGameOver]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) return 0;
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

  useEffect(() => {
    if (questionsAnswered >= TOTAL_QUESTIONS && !gameEnded) endGame();
  }, [questionsAnswered, gameEnded, endGame]);

  const handleAnswer = (option: string) => {
    if (selectedOption || gameEnded) return;
    setSelectedOption(option);
    const isRight = option === question.answer;
    setIsCorrect(isRight);

    if (isRight) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((p) => Math.max(p, newStreak));
      setScore((p) => p + 10);
      setCorrect((p) => p + 1);
      setTimeLeft((p) => p + BONUS_TIME);
      setTimeBonus(BONUS_TIME);
    } else {
      setStreak(0);
      setWrong((p) => p + 1);
      setTimeLeft((p) => Math.max(0, p - PENALTY_TIME));
      setTimeBonus(-PENALTY_TIME);
    }

    setTimeout(() => setTimeBonus(null), 800);
    setTimeout(() => {
      setSelectedOption(null);
      setIsCorrect(null);
      setCurrentIndex((p) => p + 1);
    }, 1000);
  };

  const progressPercent = (questionsAnswered / TOTAL_QUESTIONS) * 100;

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xl font-black">{score} pts</span>
        <div className="flex items-center gap-2 relative">
          <Clock size={18} className={cn(timeLeft <= 10 && "text-red-500 animate-pulse")} />
          <span className={cn("text-xl font-bold tabular-nums", timeLeft <= 10 && "text-red-500")}>
            {timeLeft}s
          </span>
          {timeBonus !== null && (
            <span
              className={cn(
                "absolute -top-5 right-0 text-sm font-bold animate-in fade-in slide-in-from-bottom-2 duration-300",
                timeBonus > 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {timeBonus > 0 ? <span className="flex items-center"><Plus size={12} />{timeBonus}s</span> : <span className="flex items-center"><Minus size={12} />{Math.abs(timeBonus)}s</span>}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{questionsAnswered}/{TOTAL_QUESTIONS} questions</span>
          <span>Streak: {streak}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
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
                !selectedOption && "border-gray-200 dark:border-white/10 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/10 active:scale-[0.98]",
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
