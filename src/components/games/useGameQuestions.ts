"use client";

import { useState, useCallback } from "react";
import { useLazyGetQuestionsQuery, useGetCbtSubjectsQuery } from "@/store/api";
import type { GameQuestion } from "./types";

export function useGameQuestions() {
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerGetQuestions] = useLazyGetQuestionsQuery();
  const { data: subjectsData } = useGetCbtSubjectsQuery(undefined);

  const subjects: Array<{ _id: string; name: string }> = subjectsData?.data ?? subjectsData ?? [];

  const fetchQuestions = useCallback(
    async (subjectId?: string, count = 30) => {
      setLoading(true);
      setError(null);
      try {
        const result = await triggerGetQuestions({
          subjectId,
          perPage: count,
          page: 1,
        }).unwrap();

        if (result.data && result.data.length > 0) {
          const valid = result.data.filter(
            (q) => q.question && q.options?.length >= 2 && q.answer
          );
          // Shuffle
          const shuffled = [...valid].sort(() => Math.random() - 0.5);
          setQuestions(shuffled);
        } else {
          setError("No questions found for this subject.");
        }
      } catch {
        setError("Failed to load questions. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [triggerGetQuestions]
  );

  return { questions, loading, error, fetchQuestions, subjects };
}
