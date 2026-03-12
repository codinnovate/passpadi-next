"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCbtExamByIdQuery, useGetCbtEnrollmentsQuery, useStartCbtAttemptMutation, useCreateReportMutation } from "@/store/api";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowLeft,
  Flag,
  Loader2,
  Share2,
  RotateCcw,
  Trophy,
  AlertTriangle,
  BookOpen,
  FlagTriangleLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { SUBJECTS } from "./cbt-constants";
import type { CbtSessionInput } from "@/lib/validations/cbt";

// ... existing code ...

declare global {
  interface Window {
    renderMathInElement?: (
      el: HTMLElement,
      options?: Record<string, unknown>
    ) => void;
  }
}

interface Question {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  answerDetail?: string;
  image?: string;
  examYear?: number;
  subjectName: string;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export default function CbtPracticeSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get("examId");
  const mode = searchParams.get("mode");

  const [config, setConfig] = useState<CbtSessionInput | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock Exam Logic
  const { data: examData } = useGetCbtExamByIdQuery(examId || "", {
      skip: !examId || mode !== "mock"
  });
  const { data: enrollmentData } = useGetCbtEnrollmentsQuery(examId || "", {
      skip: !examId || mode !== "mock"
  });
  const user = useSelector((state: any) => state.auth.user);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [warningCount, setWarningCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const questionCardRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);
  const questionMapRef = useRef<HTMLDivElement>(null);

  // Auto-scroll question map to current index
  useEffect(() => {
    if (questionMapRef.current) {
      const currentElement = questionMapRef.current.children[currentIndex] as HTMLElement;
      if (currentElement) {
        currentElement.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [currentIndex]);
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    
    // Mode: Standard Practice (from sessionStorage)
    if (mode !== "mock") {
        initialized.current = true;
        const rawConfig = sessionStorage.getItem("cbt-session");
        const rawQuestions = sessionStorage.getItem("cbt-questions");

        if (!rawConfig || !rawQuestions) {
          router.replace("/dashboard/cbt");
          return;
        }

        try {
          const parsedConfig: CbtSessionInput = JSON.parse(rawConfig);
          const parsedQuestions: Question[] = JSON.parse(rawQuestions);

          if (parsedQuestions.length === 0) {
            setError("No questions found. Please go back and try again.");
            setLoading(false);
            return;
          }

          setConfig(parsedConfig);
          setQuestions(parsedQuestions);
          setTimeLeft(parsedConfig.timeLimit * 60);
          setLoading(false);
          sessionStorage.removeItem("cbt-questions");
        } catch {
          router.replace("/dashboard/cbt");
        }
    }
  }, [router, mode]);

  const [startAttempt] = useStartCbtAttemptMutation();
  const [createReport, { isLoading: isReporting }] = useCreateReportMutation();

  // Mode: Mock Exam Initialization
  useEffect(() => {
      if (mode === "mock" && examId && examData?.data && enrollmentData?.data && !initialized.current) {
          const exam = examData.data;
          const enrollments = enrollmentData.data;
          
          // Find user enrollment
          const myEnrollment = enrollments.find((e: any) => e.user?._id === user?._id || e.user === user?._id);
          
          if (!myEnrollment) {
              setError("You are not enrolled in this exam.");
              setLoading(false);
              return;
          }

          // Start attempt (fetch questions based on enrolled subjects)
          const initAttempt = async () => {
              try {
                  const res = await startAttempt({ examId, totalQuestions: 0 }).unwrap(); // totalQuestions ignored by backend for mock
                  if (res?.data?.questions) {
                      // Map backend questions to frontend format
                      const mappedQuestions: Question[] = res.data.questions.map((q: any) => ({
                          _id: q.question._id,
                          question: q.question.question,
                          options: q.question.options,
                          answer: q.question.answer,
                          answerDetail: q.question.answerDetail,
                          image: q.question.image,
                          examYear: q.question.examYear,
                          subjectName: q.subject?.name || "Subject"
                      }));
                      
                      setQuestions(mappedQuestions);
                      
                      // Set config based on exam details
                      setConfig({
                          examType: exam.examType.name.toLowerCase() as any,
                          subjects: [], // Not used for display in same way
                          questionsPerSubject: 0, // Placeholder
                          timeLimit: exam.durationMinutes,
                          mode: "exam"
                      });
                      
                      setTimeLeft(exam.durationMinutes * 60);
                      initialized.current = true;
                  } else {
                       setError("Failed to load questions.");
                  }
              } catch (err: any) {
                  setError(err?.data?.message || "Failed to start exam session.");
              } finally {
                  setLoading(false);
              }
          };
          
          initAttempt();
      }
  }, [mode, examId, examData, enrollmentData, user, startAttempt]);

  // Timer countdown
  useEffect(() => {
    if (submitted || loading || timeLeft <= 0 || isPaused) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [submitted, loading, timeLeft, isPaused]);

  // Security Measures: Prevent tab switch & copying
  useEffect(() => {
    if (loading || submitted || mode !== "mock") return;

    const handleViolation = () => {
       if (submitted) return;
       setIsPaused(true);
       
       setWarningCount(prev => {
           const newCount = prev + 1;
           if (newCount > 3) {
               setSubmitted(true); // Auto submit
               return newCount;
           }
           setShowWarningModal(true);
           return newCount;
       });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      }
    };

    const handleBlur = () => {
      handleViolation();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    // Prevent context menu
    const handleContextMenu = (e: Event) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);
    
    // Prevent copy/cut/paste
    const handleCopy = (e: Event) => { e.preventDefault(); return false; };
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCopy);
    document.addEventListener("paste", handleCopy);

    // Prevent selection
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCopy);
      document.removeEventListener("paste", handleCopy);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, [loading, submitted, mode]);

  // Filtered questions by active subject
  const filteredQuestions = useMemo(() => {
    if (!activeSubject) return questions;
    return questions.filter((q) => q.subjectName === activeSubject);
  }, [questions, activeSubject]);

  const currentQuestion = filteredQuestions[currentIndex];

  const selectAnswer = useCallback(
    (option: string) => {
      if (submitted || !currentQuestion) return;
      const alreadyAnswered = !!answers[currentQuestion._id];
      setAnswers((prev) => ({ ...prev, [currentQuestion._id]: option }));

      // Auto-advance to next question after a brief delay (only on first answer)
      if (!alreadyAnswered && currentIndex < filteredQuestions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((i) => i + 1);
        }, 300);
      }
    },
    [submitted, currentQuestion, answers, currentIndex, filteredQuestions.length]
  );

  const goNext = useCallback(() => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, filteredQuestions.length]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }, [currentIndex]);

  // Keyboard shortcuts: A/B/C/D to select options, S to submit, arrow keys to navigate
  useEffect(() => {
    if (submitted || loading || showConfirmFinish) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const key = e.key.toUpperCase();

      // A-F to select corresponding option
      if (currentQuestion) {
        const optionIndex = key.charCodeAt(0) - 65; // A=0, B=1, C=2, D=3...
        if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
          e.preventDefault();
          selectAnswer(currentQuestion.options[optionIndex]!);
          return;
        }
      }

      // S to submit (show confirmation)
      if (key === "S") {
        e.preventDefault();
        setShowConfirmFinish(true);
        return;
      }

      // Arrow keys for navigation
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitted, loading, showConfirmFinish, currentQuestion, selectAnswer, goNext, goPrev]);

  // Render KaTeX math in question card whenever the question changes
  useEffect(() => {
    const el = questionCardRef.current;
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
  }, [currentIndex, currentQuestion]);

  // Render KaTeX in results review
  useEffect(() => {
    const el = reviewRef.current;
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
  }, [submitted]);

  const handleFinish = () => {
    setSubmitted(true);
    setShowConfirmFinish(false);
  };

  const handleSubjectFilter = (subject: string | null) => {
    setActiveSubject(subject);
    setCurrentIndex(0);
  };

  const handleFlag = async () => {
    if (!currentQuestion || flaggedQuestions.has(currentQuestion._id)) return;
    try {
      await createReport({
        questionId: currentQuestion._id,
        description: "Flagged during CBT session",
      }).unwrap();
      setFlaggedQuestions((prev) => new Set(prev).add(currentQuestion._id));
      toast.success("Question flagged for review!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to flag question");
    }
  };

  // Calculate results
  const results = useMemo(() => {
    if (!submitted) return null;
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    const perSubject: Record<
      string,
      { correct: number; wrong: number; skipped: number; total: number }
    > = {};

    for (const q of questions) {
      if (!perSubject[q.subjectName]) {
        perSubject[q.subjectName] = { correct: 0, wrong: 0, skipped: 0, total: 0 };
      }
      const stats = perSubject[q.subjectName]!;
      stats.total++;

      const userAnswer = answers[q._id];
      if (!userAnswer) {
        skipped++;
        stats.skipped++;
      } else if (userAnswer === q.answer) {
        correct++;
        stats.correct++;
      } else {
        wrong++;
        stats.wrong++;
      }
    }

    return { correct, wrong, skipped, total: questions.length, perSubject };
  }, [submitted, questions, answers]);

  const subjectNames = useMemo(() => {
    if (config?.mode === "exam") {
        return Array.from(new Set(questions.map(q => q.subjectName)));
    }
    return config?.subjects.map((s) => s.name) ?? [];
  }, [config, questions]);

  // --- Loading state ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="size-8 animate-spin text-app-primary" />
        <p className="text-muted-foreground text-sm">Starting session...</p>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/cbt")}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Setup
        </Button>
      </div>
    );
  }

  // --- Results view ---
  if (submitted && results) {
    const scorePercent = Math.round((results.correct / results.total) * 100);
    const RING_RADIUS = 54;
    const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
    const ringOffset = RING_CIRCUMFERENCE - (scorePercent / 100) * RING_CIRCUMFERENCE;
    const ringColor =
      scorePercent >= 70 ? "#10b981" : scorePercent >= 50 ? "#f59e0b" : "#ef4444";

    const shareToWhatsApp = () => {
      const subjectLines = Object.entries(results.perSubject)
        .map(
          ([subj, s]) =>
            `  ${subj}: ${s.correct}/${s.total} (${s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0}%)`
        )
        .join("\n");
      const text = [
        `📝 CBT Practice Result`,
        ``,
        `Score: ${scorePercent}%`,
        `✅ ${results.correct} correct`,
        `❌ ${results.wrong} wrong`,
        `⏭️ ${results.skipped} skipped`,
        ``,
        `Subject Breakdown:`,
        subjectLines,
        ``,
        `Practice on 90percent.com.ng`,
      ].join("\n");
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    };

    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard/cbt")}
          className="self-start gap-2"
        >
          <ArrowLeft className="size-4" />
          Back to CBT
        </Button>

        {/* Hero score section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 pb-8 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15),transparent_70%)]" />
          <div className="relative flex flex-col items-center gap-5">
            {/* SVG score ring */}
            <div className="relative">
              <svg width="140" height="140" viewBox="0 0 120 120" className="rotate-[-90deg]">
                <circle
                  cx="60" cy="60" r={RING_RADIUS}
                  fill="none" stroke="currentColor" strokeWidth="8"
                  className="text-white/10"
                />
                <circle
                  cx="60" cy="60" r={RING_RADIUS}
                  fill="none" stroke={ringColor} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{scorePercent}%</span>
                <span className="text-[10px] text-white/60 uppercase tracking-wider">Score</span>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="size-5 text-yellow-400" />
                <h2 className="text-xl font-bold">
                  {scorePercent >= 70
                    ? "Great job!"
                    : scorePercent >= 50
                      ? "Good effort!"
                      : "Keep practicing!"}
                </h2>
              </div>
              <p className="text-sm text-white/50">
                {results.correct} of {results.total} questions answered correctly
              </p>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-emerald-500/15 py-2.5 px-2">
                <CheckCircle2 className="size-4 text-emerald-400" />
                <span className="text-lg font-bold">{results.correct}</span>
                <span className="text-[10px] text-emerald-300/70 uppercase tracking-wider">Correct</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-red-500/15 py-2.5 px-2">
                <XCircle className="size-4 text-red-400" />
                <span className="text-lg font-bold">{results.wrong}</span>
                <span className="text-[10px] text-red-300/70 uppercase tracking-wider">Wrong</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-2.5 px-2">
                <MinusCircle className="size-4 text-white/40" />
                <span className="text-lg font-bold">{results.skipped}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-wider">Skipped</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="gap-2 h-11"
            onClick={shareToWhatsApp}
          >
            <Share2 className="size-4 text-[#25D366]" />
            Share to WhatsApp
          </Button>
          <Button
            onClick={() => router.push("/dashboard/cbt")}
            className="gap-2 h-11 bg-app-primary hover:bg-app-primary/90"
          >
            <RotateCcw className="size-4" />
            Practice Again
          </Button>
        </div>

        {/* Subject breakdown */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Subject Breakdown</h3>
            <div className="flex flex-col gap-4">
              {Object.entries(results.perSubject).map(
                ([subject, stats]) => {
                  const pct =
                    stats.total > 0
                      ? Math.round((stats.correct / stats.total) * 100)
                      : 0;
                  const match = SUBJECTS.find(
                    (s) => s.name.toLowerCase() === subject.toLowerCase()
                  );
                  const Icon = match?.icon ?? BookOpen;
                  const color = match?.color ?? "#6366f1";

                  return (
                    <div key={subject}>
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="flex items-center justify-center size-8 rounded-lg shrink-0"
                          style={{ backgroundColor: `${color}18` }}
                        >
                          <Icon className="size-4" style={{ color }} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{subject}</span>
                            <span className="text-sm font-semibold" style={{ color }}>
                              {pct}%
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Progress bar */}
                      <div className="ml-11 flex flex-col gap-1.5">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, backgroundColor: color }}
                          />
                        </div>
                        <div className="flex gap-3 text-[11px] text-muted-foreground">
                          <span className="text-emerald-600">{stats.correct} correct</span>
                          {stats.wrong > 0 && (
                            <span className="text-red-500">{stats.wrong} wrong</span>
                          )}
                          {stats.skipped > 0 && (
                            <span>{stats.skipped} skipped</span>
                          )}
                          <span className="ml-auto">{stats.correct}/{stats.total}</span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review answers */}
        <div ref={reviewRef}>
          <h3 className="font-semibold mb-3">Review Answers</h3>
          <Tabs defaultValue="all">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="all" className="gap-1.5">
                All
                <span className="text-[10px] bg-foreground/10 rounded-full px-1.5 py-0.5 tabular-nums">{questions.length}</span>
              </TabsTrigger>
              <TabsTrigger value="correct" className="gap-1.5">
                Correct
                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-full px-1.5 py-0.5 tabular-nums">{results.correct}</span>
              </TabsTrigger>
              <TabsTrigger value="incorrect" className="gap-1.5">
                Wrong
                <span className="text-[10px] bg-red-500/15 text-red-600 dark:text-red-400 rounded-full px-1.5 py-0.5 tabular-nums">{results.wrong}</span>
              </TabsTrigger>
              <TabsTrigger value="skipped" className="gap-1.5">
                Skipped
                <span className="text-[10px] bg-foreground/10 rounded-full px-1.5 py-0.5 tabular-nums">{results.skipped}</span>
              </TabsTrigger>
            </TabsList>
            {(["all", "correct", "incorrect", "skipped"] as const).map((tab) => {
              const filtered = questions.filter((q) => {
                const ua = answers[q._id];
                if (tab === "correct") return ua === q.answer;
                if (tab === "incorrect") return ua && ua !== q.answer;
                if (tab === "skipped") return !ua;
                return true;
              });
              return (
                <TabsContent key={tab} value={tab}>
                  <div className="flex flex-col gap-3">
                    {filtered.length === 0 && (
                      <Card>
                        <CardContent className="flex flex-col items-center gap-2 py-8">
                          <MinusCircle className="size-8 text-muted-foreground/30" />
                          <p className="text-sm text-muted-foreground">
                            No {tab} questions
                          </p>
                        </CardContent>
                      </Card>
                    )}
                    {filtered.map((q) => {
                      const globalIndex = questions.indexOf(q);
                      const userAns = answers[q._id];
                      const isCorrect = userAns === q.answer;
                      const isSkipped = !userAns;

                      return (
                        <Card
                          key={q._id}
                          className={cn(
                            "overflow-hidden border-l-[3px]",
                            isSkipped
                              ? "border-l-muted-foreground/30"
                              : isCorrect
                                ? "border-l-emerald-500"
                                : "border-l-red-500"
                          )}
                        >
                          <CardContent className="py-4">
                            <div className="flex items-start gap-3 mb-3">
                              <span
                                className={cn(
                                  "flex items-center justify-center size-7 rounded-full text-xs font-bold shrink-0 mt-0.5",
                                  isSkipped
                                    ? "bg-muted text-muted-foreground"
                                    : isCorrect
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400"
                                      : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                                )}
                              >
                                {globalIndex + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p
                                  className="text-sm leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: q.question }}
                                />
                                <Badge variant="outline" className="text-[10px] mt-1.5">
                                  {q.subjectName}
                                </Badge>
                              </div>
                              {isSkipped ? (
                                <Badge variant="secondary" className="shrink-0 text-[10px] gap-1">
                                  <MinusCircle className="size-3" />
                                  Skipped
                                </Badge>
                              ) : isCorrect ? (
                                <Badge className="shrink-0 text-[10px] gap-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 hover:bg-emerald-100">
                                  <CheckCircle2 className="size-3" />
                                  Correct
                                </Badge>
                              ) : (
                                <Badge variant="destructive" className="shrink-0 text-[10px] gap-1">
                                  <XCircle className="size-3" />
                                  Wrong
                                </Badge>
                              )}
                            </div>

                            <Separator className="my-3" />

                            <div className="flex flex-col gap-1.5">
                              {q.options.map((opt, j) => {
                                const isAnswer = opt === q.answer;
                                const isUserPick = opt === userAns;
                                return (
                                  <div
                                    key={j}
                                    className={cn(
                                      "flex items-start gap-2.5 text-sm px-3 py-2 rounded-lg transition-colors",
                                      isAnswer
                                        ? "bg-emerald-50 dark:bg-emerald-500/10"
                                        : isUserPick
                                          ? "bg-red-50 dark:bg-red-500/10"
                                          : "bg-transparent"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "flex items-center justify-center size-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5",
                                        isAnswer
                                          ? "bg-emerald-500 text-white"
                                          : isUserPick
                                            ? "bg-red-500 text-white"
                                            : "bg-muted text-muted-foreground"
                                      )}
                                    >
                                      {OPTION_LABELS[j]}
                                    </span>
                                    <span
                                      className={cn(
                                        "flex-1 text-[13px]",
                                        isAnswer && "text-emerald-700 dark:text-emerald-400 font-medium",
                                        isUserPick && !isAnswer && "text-red-700 dark:text-red-400 line-through"
                                      )}
                                      dangerouslySetInnerHTML={{ __html: opt }}
                                    />
                                    {isAnswer && (
                                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                                    )}
                                    {isUserPick && !isAnswer && (
                                      <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            {q.answerDetail && (
                              <div className="mt-3 rounded-lg bg-blue-50 dark:bg-blue-500/10 px-3 py-2.5">
                                <p
                                  className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed"
                                  dangerouslySetInnerHTML={{ __html: q.answerDetail }}
                                />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    );
  }

  // --- Practice view ---
  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-muted-foreground">No questions available.</p>
        <Button variant="outline" onClick={() => router.push("/dashboard/cbt")}>
          <ArrowLeft className="size-4 mr-2" />
          Back to Setup
        </Button>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const userAnswer = answers[currentQuestion._id];

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto py-4">
      {/* Top bar: timer + progress */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirmFinish(true)}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          End
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">
            {answeredCount}/{questions.length} answered
          </span>
          <span
            className={cn(
              "flex items-center gap-1.5 text-sm font-mono font-semibold tabular-nums",
              timeLeft <= 60 && "text-red-500 animate-pulse"
            )}
          >
            <Clock className="size-4" />
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Subject filter tabs */}
      {subjectNames.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Button
            type="button"
            variant={activeSubject === null ? "default" : "outline"}
            size="sm"
            onClick={() => handleSubjectFilter(null)}
            className={cn(
              "rounded-full text-xs shrink-0",
              activeSubject === null &&
                "bg-app-primary hover:bg-app-primary/90"
            )}
          >
            All ({questions.length})
          </Button>
          {subjectNames.map((name) => {
            const count = questions.filter(
              (q) => q.subjectName === name
            ).length;
            if (count === 0) return null;
            return (
              <Button
                key={name}
                type="button"
                variant={activeSubject === name ? "default" : "outline"}
                size="sm"
                onClick={() => handleSubjectFilter(name)}
                className={cn(
                  "rounded-full text-xs shrink-0",
                  activeSubject === name &&
                    "bg-app-primary hover:bg-app-primary/90"
                )}
              >
                {name} ({count})
              </Button>
            );
          })}
        </div>
      )}

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-app-primary transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question card */}
      <Card className="shadow-none" ref={questionCardRef}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Q{currentIndex + 1} of {filteredQuestions.length}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentQuestion.subjectName}
              </Badge>
              {currentQuestion.examYear && (
                <Badge variant="outline" className="text-xs">
                  {currentQuestion.examYear}
                </Badge>
              )}
            </div>
             <Button
               variant="ghost"
               size="sm"
               onClick={handleFlag}
               disabled={isReporting || flaggedQuestions.has(currentQuestion._id)}
               className={cn(
                 "h-8 gap-1.5 text-xs shrink-0",
                 flaggedQuestions.has(currentQuestion._id) 
                   ? "text-neutral-400 cursor-default" 
                   : "text-red-500 hover:text-red-600 hover:bg-red-50"
               )}
             >
               {isReporting ? (
                 <Loader2 className="size-3.5 animate-spin" />
               ) : (
                 <FlagTriangleLeft className="size-3.5" />
               )}
               {flaggedQuestions.has(currentQuestion._id) ? "Flagged" : "Flag"}
             </Button>
           </div>

          <div
            className="text-sm md:text-base leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />

          {currentQuestion.image && (
            <img
              src={currentQuestion.image}
              alt="Question"
              className="max-w-full rounded-lg mb-6"
            />
          )}

          {/* Options */}
          <div className="flex flex-col gap-2.5">
            {currentQuestion.options.map((option, i) => {
              const isSelected = userAnswer === option;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectAnswer(option)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all active:scale-[0.99]",
                    isSelected
                      ? "border-app-primary bg-app-primary/5"
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center size-7 rounded-full text-xs font-bold shrink-0 transition-colors",
                      isSelected
                        ? "bg-app-primary text-white"
                        : "bg-background border text-muted-foreground"
                    )}
                  >
                    {OPTION_LABELS[i]}
                  </span>
                  <span className="text-sm pt-0.5" dangerouslySetInnerHTML={{ __html: option }} />
                </button>
              );
            })}
          </div>

          <p className="text-[10px] text-muted-foreground mt-3 hidden md:block">
            Press <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">A</kbd>-<kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">D</kbd> to answer, <kbd className="px-1 py-0.5 rounded bg-muted text-[10px] font-mono">S</kbd> to submit, arrow keys to navigate
          </p>
          
          {/* Question Map */}
          <div className="mt-8 pt-6 border-t border-dashed border-neutral-200">
             <div className="flex items-center justify-between mb-4">
                 <h3 className="text-sm font-semibold text-neutral-800 shrink-0 mr-4">Question Map</h3>
                 <div className="flex items-center gap-3 text-[10px] overflow-x-auto no-scrollbar pb-1">
                     <div className="flex items-center gap-1.5 shrink-0">
                         <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                         <span className="text-neutral-600">Answered</span>
                     </div>
                     <div className="flex items-center gap-1.5 shrink-0">
                         <div className="w-2.5 h-2.5 rounded-full bg-neutral-100 border border-neutral-200"></div>
                         <span className="text-neutral-600">Unanswered</span>
                     </div>
                     <div className="flex items-center gap-1.5 shrink-0">
                         <div className="w-2.5 h-2.5 rounded-full ring-2 ring-blue-500 bg-white"></div>
                         <span className="text-neutral-600">Current</span>
                     </div>
                 </div>
             </div>
             
             <div 
                ref={questionMapRef}
                className="flex gap-2 overflow-x-auto no-scrollbar pb-4 -mx-2 p-2 scroll-smooth"
             >
                 {filteredQuestions.map((q, idx) => {
                     const isAnswered = !!answers[q._id];
                     const isCurrent = idx === currentIndex;
                     
                     return (
                         <button
                            key={q._id}
                            onClick={() => {
                                setCurrentIndex(idx);
                            }}
                            className={cn(
                                 "h-6 w-6 rounded-full text-xs font-medium transition-all flex items-center justify-center shrink-0",
                                 isCurrent 
                                     ? "ring-2 ring-blue-600 bg-blue-50 text-blue-700 z-10 scale-105" 
                                     : isAnswered 
                                         ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm" 
                                         : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border border-neutral-200"
                             )}
                          >
                              {idx + 1}
                          </button>
                      );
                  })}
              </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="gap-2"
        >
          <ChevronLeft className="size-4" />
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowConfirmFinish(true)}
          className="gap-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <Flag className="size-4" />
          Submit
        </Button>

        {currentIndex === filteredQuestions.length - 1 ? (
          <Button
            onClick={() => setShowConfirmFinish(true)}
            className="gap-2 bg-app-primary hover:bg-app-primary/90"
          >
            <Flag className="size-4" />
            Finish
          </Button>
        ) : (
          <Button
            onClick={goNext}
            className="gap-2 bg-app-primary hover:bg-app-primary/90"
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>

      {/* Question grid navigator - removed since it's redundant with the new Question Map */}
      <div className="hidden">
        {filteredQuestions.map((q, i) => {
          const isAnswered = !!answers[q._id];
          const isCurrent = i === currentIndex;
          return (
            <button
              key={q._id}
              type="button"
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "flex items-center justify-center size-8 rounded-md text-xs font-medium transition-colors",
                isCurrent
                  ? "bg-app-primary text-white"
                  : isAnswered
                    ? "bg-app-primary/10 text-app-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Confirm finish modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="pt-6 flex flex-col gap-4">
              <h3 className="text-lg font-semibold">Finish Practice?</h3>
              <p className="text-sm text-muted-foreground">
                You have answered {answeredCount} of {questions.length}{" "}
                questions.
                {questions.length - answeredCount > 0 && (
                  <>
                    {" "}
                    {questions.length - answeredCount} question
                    {questions.length - answeredCount !== 1 ? "s" : ""} will be
                    marked as skipped.
                  </>
                )}
              </p>
              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmFinish(false)}
                >
                  Continue Practice
                </Button>
                <Button
                  onClick={handleFinish}
                  className="bg-app-primary hover:bg-app-primary/90"
                >
                  Finish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Warning Modal */}
      {showWarningModal && !submitted && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <Card className="max-w-md w-full border-red-500 shadow-2xl animate-in fade-in zoom-in duration-300">
            <CardContent className="pt-8 flex flex-col items-center text-center gap-4">
              <div className="size-16 rounded-full bg-red-100 flex items-center justify-center mb-2">
                 <AlertTriangle className="size-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-red-600">Exam Violation Warning!</h3>
              <p className="text-neutral-600 font-medium">
                You are not allowed to leave the exam tab or window.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full">
                  <p className="text-sm font-semibold text-red-800">
                    Warning {warningCount} of 3
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Your exam will be automatically submitted after 3 warnings.
                  </p>
              </div>
              <Button 
                onClick={() => {
                    setShowWarningModal(false);
                    setIsPaused(false);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white mt-2"
              >
                I Understand, Resume Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
