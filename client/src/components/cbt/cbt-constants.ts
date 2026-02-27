import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  BookOpen,
  Atom,
  FlaskConical,
  Leaf,
  TrendingUp,
  Landmark,
  BookText,
  Globe,
  Scale,
  Palette,
  Languages,
  Cpu,
  Church,
  Music,
  Utensils,
  Map,
  Dumbbell,
} from "lucide-react";

export type ExamType = "jamb" | "waec" | "neco" | "post-utme";

export interface ExamTypeOption {
  value: ExamType;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
  darkColor: string;
  maxSubjects: number;
}

export const EXAM_TYPES: ExamTypeOption[] = [
  {
    value: "jamb",
    label: "JAMB (UTME)",
    shortLabel: "JAMB",
    emoji: "🎯",
    color: "#17cac0",
    darkColor: "#14b5ac",
    maxSubjects: 4,
  },
  {
    value: "waec",
    label: "WAEC (SSCE)",
    shortLabel: "WAEC",
    emoji: "📝",
    color: "#64c573",
    darkColor: "#57b366",
    maxSubjects: 9,
  },
  {
    value: "neco",
    label: "NECO",
    shortLabel: "NECO",
    emoji: "📚",
    color: "#ffa731",
    darkColor: "#e6962c",
    maxSubjects: 9,
  },
  {
    value: "post-utme",
    label: "Post-UTME",
    shortLabel: "Post-UTME",
    emoji: "🏫",
    color: "#0074e1",
    darkColor: "#0068ca",
    maxSubjects: 6,
  },
];

export function getMaxSubjects(examType?: ExamType): number {
  const exam = EXAM_TYPES.find((e) => e.value === examType);
  return exam?.maxSubjects ?? 4;
}

export interface SubjectOption {
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const SUBJECTS: SubjectOption[] = [
  { name: "Mathematics", icon: Calculator, color: "#6366f1", bgColor: "#eef2ff" },
  { name: "English", icon: BookOpen, color: "#ec4899", bgColor: "#fdf2f8" },
  { name: "Physics", icon: Atom, color: "#f59e0b", bgColor: "#fffbeb" },
  { name: "Chemistry", icon: FlaskConical, color: "#10b981", bgColor: "#ecfdf5" },
  { name: "Biology", icon: Leaf, color: "#22c55e", bgColor: "#f0fdf4" },
  { name: "Economics", icon: TrendingUp, color: "#0ea5e9", bgColor: "#f0f9ff" },
  { name: "Government", icon: Landmark, color: "#8b5cf6", bgColor: "#f5f3ff" },
  { name: "Literature", icon: BookText, color: "#e11d48", bgColor: "#fff1f2" },
  { name: "Geography", icon: Globe, color: "#14b8a6", bgColor: "#f0fdfa" },
  { name: "Commerce", icon: Scale, color: "#f97316", bgColor: "#fff7ed" },
  { name: "CRK", icon: Church, color: "#a855f7", bgColor: "#faf5ff" },
  { name: "IRK", icon: BookText, color: "#06b6d4", bgColor: "#ecfeff" },
  { name: "Civic Education", icon: Landmark, color: "#64748b", bgColor: "#f8fafc" },
  { name: "Fine Arts", icon: Palette, color: "#d946ef", bgColor: "#fdf4ff" },
  { name: "French", icon: Languages, color: "#3b82f6", bgColor: "#eff6ff" },
  { name: "Computer Science", icon: Cpu, color: "#6d28d9", bgColor: "#f5f3ff" },
  { name: "Music", icon: Music, color: "#e879f9", bgColor: "#fdf4ff" },
  { name: "Agric Science", icon: Utensils, color: "#84cc16", bgColor: "#f7fee7" },
  { name: "History", icon: Map, color: "#b45309", bgColor: "#fffbeb" },
  { name: "Physical Education", icon: Dumbbell, color: "#ef4444", bgColor: "#fef2f2" },
];

export const DURATION_PRESETS = [15, 30, 45, 60, 90, 120] as const;

export const QUESTIONS_PRESETS = [10, 15, 20, 25, 30, 40, 50] as const;
