"use client";

import { useState } from "react";
import { Clock, Layers, Zap, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { QUESTIONS_PRESETS, SUBJECTS } from "./cbt-constants";

interface SubjectPracticeConfigProps {
  subjectName: string;
}

export default function SubjectPracticeConfig({
  subjectName,
}: SubjectPracticeConfigProps) {
  const [questionCount, setQuestionCount] = useState(20);
  const [duration, setDuration] = useState(30);

  const subject = SUBJECTS.find(
    (s) => s.name.toLowerCase() === subjectName.replaceAll("-", " ").toLowerCase()
  );

  const accentColor = subject?.color ?? "#2454FF";

  const handleStart = () => {
    console.log("Start practice:", { subjectName, questionCount, duration });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
      {/* Accent bar */}
      <div className="h-1" style={{ background: `linear-gradient(to right, ${accentColor}, ${accentColor}88)` }} />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          {subject?.icon && (
            <span
              className="flex size-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: `${accentColor}14`, color: accentColor }}
            >
              <subject.icon className="size-5" />
            </span>
          )}
          <div>
            <h3 className="text-lg font-semibold capitalize text-foreground">
              Practice {subjectName.replaceAll("-", " ")}
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure your practice session
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Questions selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                Number of Questions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUESTIONS_PRESETS.map((preset) => {
                const isSelected = questionCount === preset;
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setQuestionCount(preset)}
                    className={cn(
                      "relative rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.96] cursor-pointer",
                      isSelected
                        ? "text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/8 dark:text-gray-300 dark:hover:bg-white/12"
                    )}
                    style={
                      isSelected
                        ? {
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                            boxShadow: `0 4px 14px ${accentColor}40`,
                          }
                        : undefined
                    }
                  >
                    {preset}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration selector */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Duration
                </span>
              </div>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: accentColor }}
              >
                {duration >= 60
                  ? `${Math.floor(duration / 60)}h ${duration % 60 ? `${duration % 60}m` : ""}`
                  : `${duration} min`}
              </span>
            </div>
            <div className="px-1">
              <Slider
                value={[duration]}
                onValueChange={([val]) => setDuration(val!)}
                min={5}
                max={180}
                step={5}
              />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground tabular-nums">
              <span>5 min</span>
              <span>1h</span>
              <span>2h</span>
              <span>3h</span>
            </div>
          </div>
        </div>

        {/* Summary + Start */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Summary pills */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-white/8">
              <Layers className="size-3.5" />
              {questionCount} questions
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-white/8">
              <Clock className="size-3.5" />
              {duration} min
            </span>
          </div>

          {/* Start button */}
          <button
            type="button"
            onClick={handleStart}
            className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:brightness-110 active:scale-[0.97] cursor-pointer"
            style={{
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}bb)`,
              boxShadow: `0 4px 20px ${accentColor}35`,
            }}
          >
            <Zap className="size-4" />
            Start Practice
            <ChevronRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
