"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SUBJECTS } from "./cbt-constants";

interface SubjectSelectorProps {
  selected: string[];
  onChange: (subjects: string[]) => void;
  maxSubjects: number;
  apiSubjects?: { _id: string; name: string }[];
  isLoading?: boolean;
}

export default function SubjectSelector({
  selected,
  onChange,
  maxSubjects,
  apiSubjects,
  isLoading,
}: SubjectSelectorProps) {
  const subjectList =
    apiSubjects && apiSubjects.length > 0
      ? apiSubjects.map((s) => {
          const match = SUBJECTS.find(
            (sub) => sub.name.toLowerCase() === s.name.toLowerCase()
          );
          return {
            name: s.name,
            icon: match?.icon,
            color: match?.color ?? "#6366f1",
            bgColor: match?.bgColor ?? "#eef2ff",
          };
        })
      : SUBJECTS.map((s) => ({
          name: s.name,
          icon: s.icon,
          color: s.color,
          bgColor: s.bgColor,
        }));

  const toggle = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((s) => s !== name));
    } else if (selected.length < maxSubjects) {
      onChange([...selected, name]);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {subjectList.map((subject) => {
          const isSelected = selected.includes(subject.name);
          const isDisabled = !isSelected && selected.length >= maxSubjects;
          const Icon = subject.icon;

          return (
            <button
              key={subject.name}
              type="button"
              onClick={() => toggle(subject.name)}
              disabled={isDisabled}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2 rounded-xl p-4 text-sm font-medium transition-all duration-200 active:scale-[0.97] cursor-pointer border-2",
                isSelected
                  ? "border-current ring-1 ring-current/20"
                  : "border-transparent hover:border-gray-200 dark:hover:border-white/10",
                isDisabled && "opacity-35 cursor-not-allowed"
              )}
              style={{
                backgroundColor: isSelected ? subject.bgColor : undefined,
                color: isSelected ? subject.color : undefined,
              }}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <span
                  className="absolute top-2 right-2 flex items-center justify-center size-5 rounded-full text-white"
                  style={{ backgroundColor: subject.color }}
                >
                  <Check className="size-3" strokeWidth={3} />
                </span>
              )}

              {/* Icon */}
              <span
                className={cn(
                  "flex items-center justify-center size-10 rounded-lg transition-colors",
                  !isSelected && "bg-muted"
                )}
                style={
                  isSelected
                    ? { backgroundColor: `${subject.color}18` }
                    : undefined
                }
              >
                {Icon && (
                  <Icon
                    className="size-5"
                    style={isSelected ? { color: subject.color } : undefined}
                  />
                )}
              </span>

              {/* Label */}
              <span className={cn("text-xs text-center leading-tight", !isSelected && "text-foreground")}>
                {subject.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selection count */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {selected.length} / {maxSubjects} subjects
          </Badge>
          {selected.length >= maxSubjects && (
            <span className="text-xs text-muted-foreground">Maximum reached</span>
          )}
        </div>
      )}
    </div>
  );
}
