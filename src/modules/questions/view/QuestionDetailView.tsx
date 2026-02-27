"use client";

import { useState, useEffect, useRef } from "react";
import parse from "html-react-parser";
import Link from "next/link";
import {
  useGetQuestionByIdQuery,
  useAddQuestionReplyMutation,
  useDeleteQuestionReplyMutation,
} from "@/store/api";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  MessageSquare,
  ArrowLeft,
  Trash2,
  AlertTriangle,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import LatestArticles from "@/components/LatestArticles";
import QuestionReplyComposer from "../ui/QuestionReplyComposer";

declare global {
  interface Window {
    renderMathInElement?: (
      el: HTMLElement,
      options?: Record<string, unknown>
    ) => void;
  }
}

interface QuestionDetailViewProps {
  questionId: string;
}

export default function QuestionDetailView({
  questionId,
}: QuestionDetailViewProps) {
  const { data, isLoading, error, refetch, isFetching } =
    useGetQuestionByIdQuery(questionId);
  const [addReply, { isLoading: isReplying }] = useAddQuestionReplyMutation();
  const [deleteReply] = useDeleteQuestionReplyMutation();

  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const questionCardRef = useRef<HTMLDivElement>(null);

  const question = data?.data;

  // Render KaTeX math in question text and options
  useEffect(() => {
    const el = questionCardRef.current;
    if (!el || !question) return;

    const render = () => {
      if (window.renderMathInElement) {
        window.renderMathInElement(el, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
          throwOnError: false,
        });
      }
    };

    // KaTeX scripts may still be loading — retry briefly if not ready
    if (window.renderMathInElement) {
      render();
      return;
    } else {
      const timer = setTimeout(render, 500);
      return () => clearTimeout(timer);
    }
  }, [question]);
  const optionLabels = ["A", "B", "C", "D", "E", "F"];

  const handleReplySubmit = async (content: string, image?: string) => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
      return;
    }
    await addReply({ questionId, content, image });
  };

  const handleDeleteReply = async (replyId: string) => {
    await deleteReply({ questionId, replyId });
  };

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className="flex flex-col lg:flex-row gap-8 mt-4 w-full">
        <div className="flex-1 min-w-0">
          {/* Back button skeleton */}
          <Skeleton className="h-8 w-40 mb-4" />

          {/* Question card skeleton */}
          <div className="rounded-xl border bg-card p-5 md:p-6">
            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Question text */}
            <Skeleton className="h-7 w-full mb-2" />
            <Skeleton className="h-7 w-3/4 mb-6" />

            {/* Options */}
            <div className="space-y-2 mb-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Skeleton className="size-7 rounded-full shrink-0" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))}
            </div>

            {/* Answer section */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <Skeleton className="h-6 w-48 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Replies skeleton */}
          <div className="mt-6 rounded-xl border bg-card p-5">
            <Skeleton className="h-6 w-48 mb-4" />
            <Skeleton className="h-20 w-full rounded-lg mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="size-8 rounded-full shrink-0" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeleton */}
        <div className="w-full lg:w-[300px] shrink-0">
          <Skeleton className="h-6 w-32 mb-3" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error fallback ──
  if (error || !question) {
    const errStatus = (error as any)?.status;
    const isNetworkError = !errStatus || errStatus === "FETCH_ERROR";
    const is404 = errStatus === 404;

    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="flex flex-col items-center text-center max-w-md">
          <div className="flex size-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 mb-4">
            {isNetworkError ? (
              <WifiOff className="size-8 text-red-500" />
            ) : (
              <AlertTriangle className="size-8 text-red-500" />
            )}
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-2">
            {is404
              ? "Question not found"
              : isNetworkError
                ? "Connection error"
                : "Something went wrong"}
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            {is404
              ? "This question may have been removed or the link is incorrect."
              : isNetworkError
                ? "Please check your internet connection and try again."
                : "We couldn't load this question. Please try again."}
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2"
            >
              <RefreshCw
                className={`size-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Retrying..." : "Try again"}
            </Button>

            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="size-4 mr-1" />
                Go home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Resolved fields ──
  const subjectName =
    typeof question.subject === "object"
      ? question.subject?.name
      : question.subject;
  const examTypeName =
    typeof question.examType === "object"
      ? question.examType?.name
      : question.examType;

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-8 mt-4 w-full">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Back button */}
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2 text-muted-foreground"
            asChild
          >
            <Link href={`/subject/${subjectName}`}>
              <ArrowLeft className="size-4" />
              Back to questions
            </Link>
          </Button>

          {/* Question card */}
          <div ref={questionCardRef} className="rounded-xl border bg-card p-5 md:p-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {question.examYear && (
                <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium">
                  {question.examYear}
                </span>
              )}
              {subjectName && (
                <span className="inline-flex items-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-0.5 text-xs font-medium">
                  {subjectName}
                </span>
              )}
              {examTypeName && (
                <span className="inline-flex items-center rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2.5 py-0.5 text-xs font-medium uppercase">
                  {examTypeName}
                </span>
              )}
            </div>

            {/* Question text */}
            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <h2 className="text-lg md:text-xl font-semibold leading-relaxed !mt-0">
                {parse(`${question.question}`)}
              </h2>
            </div>

            {/* Question image */}
            {question.image && (
              <div className="mb-6 rounded-lg overflow-hidden border">
                <img
                  src={question.image}
                  alt="Question"
                  className="w-full max-h-80 object-contain bg-muted/30"
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-2 mb-6">
              {question.options.map((option: string, index: number) => {
                const isCorrect =
                  question.answer &&
                  (question.answer === optionLabels[index] ||
                    question.answer.toLowerCase() === option.toLowerCase());

                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
                      isCorrect
                        ? "border-green-500/50 bg-green-50 dark:bg-green-950/20"
                        : "border-border"
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center size-7 rounded-full text-xs font-bold shrink-0 ${
                        isCorrect
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {optionLabels[index]}
                    </span>
                    <span className="text-sm pt-0.5 leading-relaxed">
                      {parse(`${option}`)}
                    </span>
                    {isCorrect && (
                      <CheckCircle2 className="size-4 text-green-500 shrink-0 mt-1 ml-auto" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Answer section */}
            <div className="rounded-lg border bg-muted/30 p-4 md:p-5">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="size-5 text-green-500" />
                <h3 className="font-semibold text-base">
                  Correct Answer: {parse(`${question.answer || "N/A"}`)}
                </h3>
              </div>

              {question.answerDetail ? (
                <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                  {parse(`${question.answerDetail}`)}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No explanation available yet. Share your solution below!
                </p>
              )}

              {question.answerDetail_image && (
                <div className="mt-3 rounded-lg overflow-hidden border">
                  <img
                    src={question.answerDetail_image}
                    alt="Answer explanation"
                    className="w-full max-h-60 object-contain bg-muted/30"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Replies section */}
          <div className="mt-6 rounded-xl border bg-card">
            <div className="flex items-center gap-2 p-5 pb-0">
              <MessageSquare className="size-5 text-muted-foreground" />
              <h3 className="font-semibold text-base">
                Solutions & Comments
                {question.replies?.length > 0 && (
                  <span className="text-muted-foreground font-normal ml-1">
                    ({question.replies.length})
                  </span>
                )}
              </h3>
            </div>

            {/* Reply composer */}
            <div className="p-5">
              <QuestionReplyComposer
                isLoading={isReplying}
                isAuthenticated={isAuthenticated}
                userName={
                  user?.personal_info?.fullname || user?.fullname
                }
                userAvatar={
                  user?.personal_info?.profile_img || user?.profile_img
                }
                onSubmit={handleReplySubmit}
                onLoginPrompt={() => setShowLoginDialog(true)}
              />
            </div>

            {/* Reply list */}
            {question.replies?.length > 0 ? (
              <div className="border-t">
                {[...question.replies]
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((reply: any) => {
                    const replyUser =
                      reply.user?.personal_info || reply.user || {};
                    const name =
                      replyUser.fullname || replyUser.username || "User";
                    const avatar = replyUser.profile_img;
                    const initials = name
                      ? name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()
                      : "U";
                    const isOwner =
                      user?._id === reply.user?._id ||
                      user?._id === reply.user;

                    return (
                      <div
                        key={reply._id}
                        className="flex items-start gap-3 px-5 py-4 border-b last:border-b-0"
                      >
                        <Avatar className="size-8 shrink-0">
                          {avatar && <AvatarImage src={avatar} />}
                          <AvatarFallback className="text-[10px] font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold truncate">
                              {name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(reply.createdAt)}
                            </span>
                          </div>

                          <p className="text-sm mt-1 whitespace-pre-wrap break-words text-foreground/90">
                            {reply.content}
                          </p>

                          {reply.image && (
                            <div className="mt-2 rounded-lg overflow-hidden border max-w-sm">
                              <img
                                src={reply.image}
                                alt="Reply attachment"
                                className="w-full max-h-48 object-contain bg-muted/30"
                              />
                            </div>
                          )}

                          {isOwner && (
                            <Button
                              variant="ghost"
                              size="xs"
                              className="text-muted-foreground hover:text-destructive mt-1 -ml-2"
                              onClick={() => handleDeleteReply(reply._id)}
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="px-5 pb-5 text-center">
                <p className="text-sm text-muted-foreground py-6">
                  No solutions yet. Be the first to share your answer!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[300px] shrink-0">
          <LatestArticles />
        </div>
      </div>

      {/* Login dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              You need to be logged in to share your solution or comment
              on this question.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Button asChild>
              <Link
                href="/login"
                onClick={() => setShowLoginDialog(false)}
              >
                Sign in
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="/register"
                onClick={() => setShowLoginDialog(false)}
              >
                Create an account
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
