"use client";

import { Clock, HelpCircle, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { QUESTIONS_PRESETS, SUBJECTS } from "./cbt-constants";

interface SubjectConfig {
  name: string;
  questionsCount: number;
}

interface TestConfigPanelProps {
  duration: number;
  onDurationChange: (value: number) => void;
  questionsPerSubject: number;
  onQuestionsChange: (value: number) => void;
  subjects: SubjectConfig[];
  onSubjectQuestionsChange: (name: string, count: number) => void;
}

export default function TestConfigPanel({
  duration,
  onDurationChange,
  questionsPerSubject,
  onQuestionsChange,
  subjects,
  onSubjectQuestionsChange,
}: TestConfigPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Duration */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Clock className="size-4 text-muted-foreground" />
            <span>Duration</span>
          </div>
          <span className="text-sm font-semibold tabular-nums text-app-primary">
            {duration >= 60
              ? `${Math.floor(duration / 60)}h ${duration % 60 ? `${duration % 60}m` : ""}`
              : `${duration} min`}
          </span>
        </div>
        <div className="px-1">
          <Slider
            value={[duration]}
            onValueChange={([val]) => onDurationChange(val)}
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

      {/* Questions — "Set all" presets */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <HelpCircle className="size-4 text-muted-foreground" />
          <span>Questions per subject</span>
          <span className="text-xs text-muted-foreground font-normal">
            (set all)
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUESTIONS_PRESETS.map((preset) => {
            const isSelected = questionsPerSubject === preset;
            return (
              <Button
                key={preset}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => onQuestionsChange(preset)}
                className={cn(
                  "rounded-lg transition-all",
                  isSelected && "bg-app-primary hover:bg-app-primary/90"
                )}
              >
                {preset}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Per-subject question counts */}
      {subjects.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-foreground">
            Customize per subject
          </div>
          <div className="flex flex-col gap-2">
            {subjects.map((subject) => {
              const match = SUBJECTS.find(
                (s) => s.name.toLowerCase() === subject.name.toLowerCase()
              );
              const Icon = match?.icon;
              const color = match?.color ?? "#6366f1";

              return (
                <div
                  key={subject.name}
                  className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5"
                >
                  {/* Icon + name */}
                  <span
                    className="flex items-center justify-center size-8 rounded-lg shrink-0"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    {Icon && (
                      <Icon className="size-4" style={{ color }} />
                    )}
                  </span>
                  <span className="flex-1 text-sm font-medium truncate">
                    {subject.name}
                  </span>

                  {/* +/- controls */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        onSubjectQuestionsChange(
                          subject.name,
                          Math.max(5, subject.questionsCount - 5)
                        )
                      }
                      disabled={subject.questionsCount <= 5}
                      className="flex items-center justify-center size-7 rounded-md border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold tabular-nums">
                      {subject.questionsCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        onSubjectQuestionsChange(
                          subject.name,
                          Math.min(50, subject.questionsCount + 5)
                        )
                      }
                      disabled={subject.questionsCount >= 50}
                      className="flex items-center justify-center size-7 rounded-md border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
