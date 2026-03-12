"use client";

import { useState } from "react";
import { ArrowLeft, Loader2, Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLazyGetQuestionsQuery, useGetCbtSubjectsQuery } from "@/store/api";
import type { GameInfo, GameQuestion } from "./types";

interface GameSetupProps {
  game: GameInfo;
  onStart: (questions: GameQuestion[], subjectName: string) => void;
}

export default function GameSetup({ game, onStart }: GameSetupProps) {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedSubjectName, setSelectedSubjectName] = useState("All Subjects");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triggerGetQuestions] = useLazyGetQuestionsQuery();
  const { data: subjectsData } = useGetCbtSubjectsQuery(undefined);

  const subjects: Array<{ _id: string; name: string }> = subjectsData?.data ?? subjectsData ?? [];

  const handlePlay = async () => {
    setLoading(true);
    setError(null);
    try {
      const count = game.id === "memory-match" ? 8 : 30;
      const result = await triggerGetQuestions({
        subjectId: selectedSubject || undefined,
        perPage: count,
        page: Math.floor(Math.random() * 5) + 1,
      }).unwrap();

      if (result.data && result.data.length > 0) {
        const valid = result.data.filter(
          (q) => q.question && q.options?.length >= 2 && q.answer
        );
        const shuffled = [...valid].sort(() => Math.random() - 0.5);
        if (shuffled.length > 0) {
          onStart(shuffled, selectedSubjectName);
          return;
        }
      }
      setError("No questions found. Try a different subject.");
    } catch {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto py-8">
      <button
        onClick={() => router.push("/dashboard/games")}
        className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Games
      </button>

      <div
        className={cn(
          "w-full rounded-2xl bg-gradient-to-br p-6 text-white",
          game.color
        )}
      >
        <h1 className="text-2xl font-bold">{game.title}</h1>
        <p className="mt-2 text-white/90 text-sm">{game.description}</p>
        <div className="mt-3 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
          {game.difficulty}
        </div>
      </div>

      <div className="w-full space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Choose a Subject
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setSelectedSubject("");
                setSelectedSubjectName("All Subjects");
              }}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                !selectedSubject
                  ? "border-app-primary bg-app-primary/10 text-app-primary"
                  : "border-gray-200 dark:border-white/10 text-muted-foreground hover:border-gray-300"
              )}
            >
              All Subjects
            </button>
            {subjects.map((subject: { _id: string; name: string }) => (
              <button
                key={subject._id}
                onClick={() => {
                  setSelectedSubject(subject._id);
                  setSelectedSubjectName(subject.name);
                }}
                className={cn(
                  "rounded-lg border px-3 py-2 text-sm font-medium transition-all capitalize",
                  selectedSubject === subject._id
                    ? "border-app-primary bg-app-primary/10 text-app-primary"
                    : "border-gray-200 dark:border-white/10 text-muted-foreground hover:border-gray-300"
                )}
              >
                {subject.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          onClick={handlePlay}
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-xl py-3 text-base font-semibold text-white transition-all bg-gradient-to-r",
            game.color,
            loading ? "opacity-70" : "hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Loading Questions...
            </>
          ) : (
            <>
              <Play size={20} />
              Start Game
            </>
          )}
        </button>
      </div>
    </div>
  );
}
