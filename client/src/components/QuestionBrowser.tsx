"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import parse from "html-react-parser";
import {
  useGetQuestionsQuery,
  useGetExamTypesQuery,
  useGetTopicsQuery,
  useGetCbtSubjectsQuery,
} from "@/store/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

declare global {
  interface Window {
    renderMathInElement?: (
      el: HTMLElement,
      options?: Record<string, unknown>
    ) => void;
  }
}

interface QuestionBrowserProps {
  /** Subject slug from route param (subject_id field) */
  subjectSlug?: string;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];
const YEAR_RANGE = Array.from(
  { length: new Date().getFullYear() - 1978 + 1 },
  (_, i) => new Date().getFullYear() - i
);

export default function QuestionBrowser({
  subjectSlug,
}: QuestionBrowserProps) {
  // ── Filter state ──
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedExamType, setSelectedExamType] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(
    new Set()
  );
  const perPage = 20;
  const questionsListRef = useRef<HTMLDivElement>(null);

  const renderMath = useCallback(() => {
    const el = questionsListRef.current;
    if (!el || !window.renderMathInElement) return;
    window.renderMathInElement(el, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false },
        { left: "\\[", right: "\\]", display: true },
      ],
      throwOnError: false,
    });
  }, []);

  // ── Data queries ──
  const { data: subjectsData } = useGetCbtSubjectsQuery(undefined);
  const { data: examTypesData } = useGetExamTypesQuery();
  const { data: topicsData } = useGetTopicsQuery();

  // ── Derived data (must be before questions query) ──
  const subjects: { _id: string; name: string; subject_id?: string }[] =
    subjectsData?.data ?? subjectsData?.subjects ?? [];

  // Resolve subject slug to _id
  const resolvedSubject = useMemo(() => {
    if (!subjectSlug || subjects.length === 0) return null;
    const decoded = decodeURIComponent(subjectSlug);
    return subjects.find(
      (s) =>
        s.subject_id === decoded ||
        s.name.toLowerCase() === decoded.toLowerCase() ||
        s._id === decoded
    );
  }, [subjectSlug, subjects]);

  // The effective subject ID for API queries
  const effectiveSubjectId = selectedSubject || resolvedSubject?._id || "";
  const subjectName = resolvedSubject?.name || subjectSlug || "";

  const examTypes = examTypesData ?? [];

  // Filter topics for the selected subject
  const filteredTopics = useMemo(() => {
    if (!topicsData?.data) return [];
    if (!effectiveSubjectId) return topicsData.data;
    return topicsData.data.filter(
      (t) => t.subject?._id === effectiveSubjectId
    );
  }, [topicsData, effectiveSubjectId]);

  // ── Questions query (depends on effectiveSubjectId) ──
  const {
    data: questionsData,
    isLoading: questionsLoading,
    isFetching,
  } = useGetQuestionsQuery({
    subjectId: effectiveSubjectId || undefined,
    examType: selectedExamType || undefined,
    examYear: selectedYear ? Number(selectedYear) : undefined,
    search: searchQuery || undefined,
    perPage,
    page,
  });

  const questions = questionsData?.data ?? [];
  const totalPages = questionsData?.totalPages ?? 0;
  const totalQuestions = questionsData?.totalQuestions ?? 0;

  // Render KaTeX math whenever questions change or answers are revealed
  useEffect(() => {
    if (questions.length === 0) return;
    if (window.renderMathInElement) {
      // Small delay to let React finish rendering the DOM
      const timer = setTimeout(renderMath, 50);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(renderMath, 500);
      return () => clearTimeout(timer);
    }
  }, [questions, revealedAnswers, renderMath]);

  const hasActiveFilters =
    selectedExamType || selectedYear || selectedTopic || searchQuery;

  // ── Handlers ──
  const clearFilters = () => {
    setSelectedExamType("");
    setSelectedYear("");
    setSelectedTopic("");
    setSearchQuery("");
    setPage(1);
  };

  const toggleAnswer = (id: string) => {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* ── Filter Toolbar ── */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-gray-900">
        <div className="mb-3 flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Filter Questions
          </span>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" />
              Clear filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Subject filter — only show if no pre-selected subject */}
          {!subjectSlug && (
            <Select
              value={selectedSubject}
              onValueChange={(val) => {
                setSelectedSubject(val === "all" ? "" : val);
                setSelectedTopic("");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s._id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Exam Type */}
          <Select
            value={selectedExamType}
            onValueChange={(val) => {
              setSelectedExamType(val === "all" ? "" : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Exam Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Exam Types</SelectItem>
              {examTypes.map((et) => (
                <SelectItem key={et._id} value={et._id}>
                  {et.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Year */}
          <Select
            value={selectedYear}
            onValueChange={(val) => {
              setSelectedYear(val === "all" ? "" : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {YEAR_RANGE.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Topic */}
          {filteredTopics.length > 0 && (
            <Select
              value={selectedTopic}
              onValueChange={(val) => {
                setSelectedTopic(val === "all" ? "" : val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Topics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {filteredTopics.map((t) => (
                  <SelectItem key={t._id} value={t._id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      {/* ── Results info ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {questionsLoading ? (
            "Loading..."
          ) : (
            <>
              <span className="font-medium text-foreground">
                {totalQuestions}
              </span>{" "}
              question{totalQuestions !== 1 ? "s" : ""} found
              {subjectName && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-medium text-foreground capitalize">
                    {decodeURIComponent(subjectName)}
                  </span>
                </span>
              )}
            </>
          )}
        </p>
        {totalPages > 1 && (
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* ── Questions List ── */}
      {questionsLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-gray-900"
            >
              <Skeleton className="mb-3 h-4 w-12" />
              <Skeleton className="mb-4 h-6 w-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 dark:border-white/10 dark:bg-gray-900">
          <Search className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-base font-medium text-foreground">
            No questions found
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={clearFilters}
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div
          ref={questionsListRef}
          className={`flex flex-col gap-4 ${isFetching ? "opacity-60" : ""}`}
        >
          {questions.map((question, index) => {
            const questionNum = (page - 1) * perPage + index + 1;
            const isRevealed = revealedAnswers.has(question._id);

            return (
              <div
                key={question._id}
                className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm dark:border-white/10 dark:bg-gray-900 sm:p-5"
              >
                {/* Question number + badges */}
                <div className="mb-3 flex items-center justify-between">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-app-primary text-xs font-bold text-white">
                    {questionNum}
                  </span>
                  <div className="flex items-center gap-2">
                    {question.examType && (
                      <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        {typeof question.examType === "object"
                          ? question.examType.name
                          : question.examType}
                      </span>
                    )}
                    {question.examYear && (
                      <span className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-gray-400">
                        {question.examYear}
                      </span>
                    )}
                    {question.subject && (
                      <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        {typeof question.subject === "object"
                          ? question.subject.name
                          : question.subject}
                      </span>
                    )}
                  </div>
                </div>

                {/* Question text */}
                <h2 className="mb-4 text-base font-medium leading-relaxed text-foreground sm:text-lg">
                  {parse(question.question)}
                </h2>

                {/* Question image */}
                {question.image && (
                  <div className="mb-4">
                    <img
                      src={question.image}
                      alt="Question"
                      className="max-h-64 rounded-lg object-contain"
                    />
                  </div>
                )}

                {/* Options */}
                <div className="mb-4 flex flex-col gap-2">
                  {question.options.map((option, optIdx) => {
                    const isCorrect =
                      isRevealed && option === question.answer;
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-sm ${
                          isCorrect
                            ? "bg-green-50 ring-1 ring-green-300 dark:bg-green-900/20 dark:ring-green-700"
                            : "bg-gray-50 dark:bg-white/5"
                        }`}
                      >
                        <span
                          className={`font-semibold ${
                            isCorrect
                              ? "text-green-700 dark:text-green-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {OPTION_LABELS[optIdx]}.
                        </span>
                        <span className="capitalize text-foreground">
                          {parse(option)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Footer: toggle answer + view detail */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => toggleAnswer(question._id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-100 dark:border-white/10 dark:hover:bg-white/10"
                  >
                    {isRevealed ? (
                      <>
                        <EyeOff className="size-3.5" />
                        Hide Answer
                      </>
                    ) : (
                      <>
                        <Eye className="size-3.5" />
                        Show Answer
                      </>
                    )}
                  </button>
                  <Link
                    href={`/subject/${subjectSlug || "q"}/${question._id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-app-primary hover:underline"
                  >
                    View Details →
                  </Link>
                </div>

                {/* Answer detail (revealed) */}
                {isRevealed && question.answerDetail && (
                  <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-900 dark:bg-green-900/20 dark:text-green-200">
                    <p className="mb-1 font-semibold">Explanation:</p>
                    <div>{parse(question.answerDetail)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="mr-1 size-4" />
            Previous
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`flex size-8 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-app-primary text-white"
                      : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
