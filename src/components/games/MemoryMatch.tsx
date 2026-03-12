"use client";

import { useState, useEffect, useCallback } from "react";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GameQuestion, GameResult } from "./types";

interface MemoryMatchProps {
  questions: GameQuestion[];
  onGameOver: (result: GameResult) => void;
}

interface Card {
  id: string;
  content: string;
  type: "question" | "answer";
  pairId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function MemoryMatch({ questions, onGameOver }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [startTime] = useState(Date.now());
  const [isChecking, setIsChecking] = useState(false);
  const totalPairs = Math.min(questions.length, 6);

  // Initialize cards
  useEffect(() => {
    const selected = questions.slice(0, totalPairs);
    const cardPairs: Card[] = [];

    selected.forEach((q, i) => {
      const pairId = `pair-${i}`;
      cardPairs.push({
        id: `q-${i}`,
        content: stripHtml(q.question).slice(0, 60) + (stripHtml(q.question).length > 60 ? "..." : ""),
        type: "question",
        pairId,
        isFlipped: false,
        isMatched: false,
      });
      cardPairs.push({
        id: `a-${i}`,
        content: stripHtml(q.answer),
        type: "answer",
        pairId,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle
    const shuffled = [...cardPairs].sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [questions, totalPairs]);

  const endGame = useCallback(() => {
    onGameOver({
      score,
      total: totalPairs,
      correct: matchedPairs,
      wrong: moves - matchedPairs,
      timeSpent: Math.round((Date.now() - startTime) / 1000),
      streak: bestStreak,
    });
  }, [score, totalPairs, matchedPairs, moves, startTime, bestStreak, onGameOver]);

  useEffect(() => {
    if (matchedPairs === totalPairs && totalPairs > 0) {
      setTimeout(endGame, 500);
    }
  }, [matchedPairs, totalPairs, endGame]);

  const handleCardClick = (cardId: string) => {
    if (isChecking) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    if (flippedCards.length >= 2) return;

    // Flip the card
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((p) => p + 1);

      const first = cards.find((c) => c.id === newFlipped[0]);
      const second = cards.find((c) => c.id === newFlipped[1]);
      if (!first || !second) { setIsChecking(false); setFlippedCards([]); return; }
      const firstCard = first.id === cardId ? { ...first, isFlipped: true } : first;
      const secondCard = second.id === cardId ? { ...second, isFlipped: true } : second;

      // Check if they match (same pairId, different types)
      if (firstCard.pairId === secondCard.pairId && firstCard.type !== secondCard.type) {
        // Match!
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.pairId === firstCard.pairId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          const newStreak = streak + 1;
          setStreak(newStreak);
          setBestStreak((p) => Math.max(p, newStreak));
          setMatchedPairs((p) => p + 1);
          setScore((p) => p + 20 * Math.min(newStreak, 3));
          setFlippedCards([]);
          setIsChecking(false);
        }, 600);
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c
            )
          );
          setStreak(0);
          setFlippedCards([]);
          setIsChecking(false);
        }, 1000);
      }
    }
  };

  const gridCols = totalPairs <= 4 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-pink-500" />
          <span className="text-xl font-black">{score}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            Pairs: <span className="font-bold text-foreground">{matchedPairs}/{totalPairs}</span>
          </span>
          <span className="text-muted-foreground">
            Moves: <span className="font-bold text-foreground">{moves}</span>
          </span>
        </div>
      </div>

      {/* Card Grid */}
      <div className={cn("grid gap-2", gridCols)}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isFlipped || card.isMatched || isChecking}
            className={cn(
              "relative aspect-[3/4] rounded-xl border-2 transition-all duration-300 text-xs font-medium p-2 flex items-center justify-center text-center overflow-hidden",
              card.isMatched && "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 scale-95",
              card.isFlipped && !card.isMatched && "border-app-primary bg-app-primary/5",
              !card.isFlipped && !card.isMatched && "border-gray-200 dark:border-white/10 bg-gradient-to-br from-pink-100 to-fuchsia-100 dark:from-pink-900/20 dark:to-fuchsia-900/20 hover:scale-105 hover:shadow-md cursor-pointer",
            )}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="animate-in fade-in zoom-in duration-200">
                <div className={cn(
                  "text-[10px] uppercase font-bold mb-1",
                  card.type === "question" ? "text-blue-500" : "text-amber-500"
                )}>
                  {card.type === "question" ? "Q" : "A"}
                </div>
                <div className="text-[11px] leading-tight">{card.content}</div>
              </div>
            ) : (
              <div className="text-2xl">?</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
