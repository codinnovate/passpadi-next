"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EXAM_TYPES, type ExamType } from "./cbt-constants";

interface ExamTypeSelectorProps {
  value: ExamType | undefined;
  onChange: (value: ExamType) => void;
}

export default function ExamTypeSelector({
  value,
  onChange,
}: ExamTypeSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {EXAM_TYPES.map((exam) => {
        const isSelected = value === exam.value;
        return (
          <button
            key={exam.value}
            type="button"
            onClick={() => onChange(exam.value)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 rounded-xl p-5 text-white font-semibold transition-all duration-200 active:scale-95 cursor-pointer",
              "dark:brightness-90",
              isSelected && "ring-3 ring-offset-2 ring-offset-background"
            )}
            style={{
              backgroundColor: exam.color,
              ...(isSelected ? { ["--tw-ring-color" as string]: exam.color } : {}),
            }}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 bg-white/30 rounded-full p-0.5">
                <Check className="size-3.5 text-white" strokeWidth={3} />
              </div>
            )}
            <span className="text-2xl">{exam.emoji}</span>
            <span className="text-sm leading-tight text-center">
              {exam.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
