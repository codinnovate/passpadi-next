"use client";

import Link from "next/link";
import { useGetCbtSubjectsQuery, useGetTopicsQuery } from "@/store/api";
import QuestionBrowser from "@/components/QuestionBrowser";
import { BookOpen } from "lucide-react";
import { useMemo } from "react";


export default function SubjectPageClient({
  subjectSlug,
}: {
  subjectSlug: string;
}) {
  const { data: subjectsData } = useGetCbtSubjectsQuery(undefined);
  const subjects: { _id: string; name: string; subject_id?: string }[] = Array.isArray(
    subjectsData as any
  )
    ? (subjectsData as any)
    : (subjectsData as any)?.data ?? (subjectsData as any)?.subjects ?? [];

  const { data: topicsData } = useGetTopicsQuery();

  const decodedSlug = decodeURIComponent(subjectSlug);
  const currentSubject = subjects.find(
    (s) =>
      s.subject_id === decodedSlug ||
      s.name.toLowerCase() === decodedSlug.toLowerCase() ||
      s._id === decodedSlug
  );

  const subjectTopics = useMemo(() => {
    if (!topicsData?.data || !currentSubject) return [];
    return topicsData.data.filter(
      (t) => t.subject?._id === currentSubject._id
    );
  }, [topicsData, currentSubject]);

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        {/* Page header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-app-primary/10">
            <BookOpen className="size-5 text-app-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground capitalize">
              {currentSubject?.name || decodedSlug}
            </h1>
            <p className="text-sm text-muted-foreground">
              Browse and practice questions
            </p>
          </div>
        </div>

        {/* Question browser with filters */}
        <QuestionBrowser subjectSlug={subjectSlug} />
      </div>

      {/* Sidebar */}
      <div className="flex w-full flex-col gap-6 lg:w-72 xl:w-80">
        {/* Subjects list */}
        <div className="rounded-xl flex flex-col gap-3 border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
          <h2 className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">
            All Subjects
          </h2>
          <div className="flex  gap-3 flex-col">
            {subjects.map((sub) => {
              const isActive =
                sub.subject_id === decodedSlug ||
                sub.name.toLowerCase() === decodedSlug.toLowerCase() ||
                sub._id === decodedSlug;
              return (
                <Link
                  key={sub._id}
                  href={`/dashboard/subject/${sub.subject_id || sub._id}`}
                  className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-app-primary/10 text-app-primary"
                      : "text-foreground hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Subject Topics */}
        {subjectTopics.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-gray-900">
            <h2 className="border-b border-gray-200 px-4 py-3 text-sm font-semibold text-foreground dark:border-white/10">
              {currentSubject?.name || decodedSlug} Topics
            </h2>
            <div className="flex max-h-[400px] flex-col overflow-y-auto">
              {subjectTopics.map((topic) => (
                <div
                  key={topic._id}
                  className="flex items-center px-4 py-2.5 text-sm font-medium text-foreground"
                >
                  {topic.name}
                </div>
              ))}
            </div>
          </div>
        )}

      
      </div>
    </div>
  );
}
