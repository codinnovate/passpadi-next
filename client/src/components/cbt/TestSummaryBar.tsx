"use client";

import { BookOpen, Clock, HelpCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EXAM_TYPES, type ExamType } from "./cbt-constants";

interface TestSummaryBarProps {
  examType: ExamType | undefined;
  subjectCount: number;
  totalQuestions: number;
  duration: number;
  isValid: boolean;
  onStart: () => void;
}

export default function TestSummaryBar({
  examType,
  subjectCount,
  totalQuestions,
  duration,
  isValid,
  onStart,
}: TestSummaryBarProps) {
  const exam = EXAM_TYPES.find((e) => e.value === examType);

  return (
    <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 border-t bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-3xl flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground overflow-x-auto">
          {exam && (
            <span className="flex items-center gap-1.5 shrink-0">
              <span>{exam.emoji}</span>
              <span className="font-medium text-foreground">
                {exam.shortLabel}
              </span>
            </span>
          )}
          {subjectCount > 0 && (
            <span className="flex items-center gap-1 shrink-0">
              <BookOpen className="size-3.5" />
              <span>
                {subjectCount} {subjectCount === 1 ? "subject" : "subjects"}
              </span>
            </span>
          )}
          {totalQuestions > 0 && (
            <span className="flex items-center gap-1 shrink-0">
              <HelpCircle className="size-3.5" />
              <span>{totalQuestions} Qs</span>
            </span>
          )}
          {duration > 0 && (
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="size-3.5" />
              <span>{duration} min</span>
            </span>
          )}
        </div>

        <Button
          type="button"
          size="lg"
          disabled={!isValid}
          onClick={onStart}
          className="bg-app-primary hover:bg-app-primary/90 shrink-0 gap-2"
        >
          <Play className="size-4" />
          Start Practice
        </Button>
      </div>
    </div>
  );
}
