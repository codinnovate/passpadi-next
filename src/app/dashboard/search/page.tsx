"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { SearchNormal1 } from "iconsax-reactjs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetBlogsQuery, useGetQuestionsQuery } from "@/store/api";
import { Eye, FileText, HelpCircle } from "lucide-react";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ResultSkeleton() {
  return (
    <div className="flex gap-4 p-4">
      <Skeleton className="w-20 h-16 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-48" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <ResultSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [tab, setTab] = useState("all");

  const { data: blogData, isLoading: blogsLoading } = useGetBlogsQuery(
    { page: 1, limit: 20, search: query },
    { skip: !query }
  );

  const { data: questionData, isLoading: questionsLoading } =
    useGetQuestionsQuery(
      { search: query, perPage: 20, page: 1 },
      { skip: !query }
    );

  const blogs = blogData?.data ?? [];
  const questions = questionData?.data ?? [];
  const isLoading = blogsLoading || questionsLoading;
  const totalResults = blogs.length + questions.length;

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center size-16 rounded-full bg-gray-100 dark:bg-white/10 mb-4">
          <SearchNormal1 size={28} className="text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold">Search Passpadi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search for articles, questions, and study materials.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {/* Header */}
      <div>
        <p className="text-sm text-muted-foreground">
          {isLoading
            ? "Searching..."
            : `${totalResults} result${totalResults !== 1 ? "s" : ""} for`}
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          &ldquo;{query}&rdquo;
        </h1>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">
            All ({totalResults})
          </TabsTrigger>
          <TabsTrigger value="articles">
            Articles ({blogs.length})
          </TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({questions.length})
          </TabsTrigger>
        </TabsList>

        {/* Loading state */}
        {isLoading && (
          <div className="mt-4 space-y-2 divide-y divide-gray-100 dark:divide-white/10">
            {Array.from({ length: 5 }).map((_, i) => (
              <ResultSkeleton key={i} />
            ))}
          </div>
        )}

        {/* No results */}
        {!isLoading && totalResults === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <SearchNormal1
              size={40}
              className="text-muted-foreground mb-3"
            />
            <p className="font-medium">No results found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try a different search term or check your spelling.
            </p>
          </div>
        )}

        {/* All results */}
        <TabsContent value="all" className="mt-4 space-y-1">
          {blogs.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={14} /> Articles
              </h2>
              <div className="divide-y divide-gray-100 dark:divide-white/10 rounded-xl border border-gray-100 dark:border-white/10">
                {blogs.slice(0, 5).map((blog: any) => (
                  <BlogResult key={blog._id} blog={blog} />
                ))}
              </div>
              {blogs.length > 5 && (
                <button
                  onClick={() => setTab("articles")}
                  className="text-sm text-app-primary font-medium mt-2 hover:underline"
                >
                  View all {blogs.length} articles
                </button>
              )}
            </section>
          )}

          {questions.length > 0 && (
            <section className="mt-6">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <HelpCircle size={14} /> Questions
              </h2>
              <div className="divide-y divide-gray-100 dark:divide-white/10 rounded-xl border border-gray-100 dark:border-white/10">
                {questions.slice(0, 5).map((q: any) => (
                  <QuestionResult key={q._id} question={q} />
                ))}
              </div>
              {questions.length > 5 && (
                <button
                  onClick={() => setTab("questions")}
                  className="text-sm text-app-primary font-medium mt-2 hover:underline"
                >
                  View all {questions.length} questions
                </button>
              )}
            </section>
          )}
        </TabsContent>

        {/* Articles tab */}
        <TabsContent value="articles" className="mt-4">
          {blogs.length === 0 && !isLoading ? (
            <p className="text-center text-muted-foreground py-10">
              No articles found.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/10 rounded-xl border border-gray-100 dark:border-white/10">
              {blogs.map((blog: any) => (
                <BlogResult key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Questions tab */}
        <TabsContent value="questions" className="mt-4">
          {questions.length === 0 && !isLoading ? (
            <p className="text-center text-muted-foreground py-10">
              No questions found.
            </p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/10 rounded-xl border border-gray-100 dark:border-white/10">
              {questions.map((q: any) => (
                <QuestionResult key={q._id} question={q} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BlogResult({ blog }: { blog: any }) {
  const href = `/dashboard/blog/${blog.blog_id || blog._id}`;
  return (
    <Link href={href} className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
      {blog.banner && (
        <div className="relative w-20 h-16 md:w-24 md:h-18 shrink-0 rounded-lg overflow-hidden">
          <Image src={blog.banner} alt={blog.title} fill className="object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base leading-snug line-clamp-2">
          {blog.title}
        </h3>
        {blog.des && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{blog.des}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
          {blog.tags?.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
          {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
          {blog.activity && (
            <span className="flex items-center gap-1">
              <Eye size={10} /> {blog.activity.total_reads ?? 0}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function QuestionResult({ question }: { question: any }) {
  const subjectName = question.subject?.name || "General";
  const examName = question.examType?.name || "";
  return (
    <Link
      href={`/dashboard/cbt`}
      className="flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
    >
      <div className="flex items-center justify-center size-12 rounded-lg bg-app-primary/10 text-app-primary shrink-0">
        <HelpCircle size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className="font-semibold text-sm leading-snug line-clamp-2"
          dangerouslySetInnerHTML={{ __html: question.question }}
        />
        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-[10px]">
            {subjectName}
          </Badge>
          {examName && (
            <Badge variant="outline" className="text-[10px]">
              {examName}
            </Badge>
          )}
          {question.examYear && <span>{question.examYear}</span>}
        </div>
      </div>
    </Link>
  );
}
