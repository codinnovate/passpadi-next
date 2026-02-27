"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import {
  cbtSessionSchema,
  type CbtSessionInput,
} from "@/lib/validations/cbt";
import {
  useGetCbtSubjectsQuery,
  useLazyGetQuestionsQuery,
} from "@/store/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ExamTypeSelector from "./ExamTypeSelector";
import SubjectSelector from "./SubjectSelector";
import TestConfigPanel from "./TestConfigPanel";
import TestSummaryBar from "./TestSummaryBar";
import { type ExamType, getMaxSubjects } from "./cbt-constants";

interface StoredQuestion {
  _id: string;
  question: string;
  options: string[];
  answer: string;
  answerDetail?: string;
  image?: string;
  examYear?: number;
  subjectName: string;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function CbtDashboard() {
  const router = useRouter();
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [prefetchError, setPrefetchError] = useState<string | null>(null);

  const { data: subjectsData, isLoading: subjectsLoading } =
    useGetCbtSubjectsQuery(undefined);
  const [triggerGetQuestions] = useLazyGetQuestionsQuery();

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CbtSessionInput>({
    resolver: zodResolver(cbtSessionSchema),
    defaultValues: {
      subjects: [],
      questionsPerSubject: 20,
      timeLimit: 60,
    },
    mode: "onChange",
  });

  const examType = watch("examType");
  const subjects = watch("subjects");
  const questionsPerSubject = watch("questionsPerSubject");
  const timeLimit = watch("timeLimit");

  // Subjects API returns a plain array from the aggregate
  const apiSubjects: { _id: string; name: string; examTypes?: { _id: string; name: string }[] }[] = Array.isArray(
    subjectsData
  )
    ? subjectsData
    : subjectsData?.data ?? subjectsData?.subjects ?? [];

  // Filter subjects to only show those available for the selected exam type
  const filteredSubjects = examType
    ? apiSubjects.filter((s) =>
        s.examTypes?.some(
          (et) => et.name.toLowerCase() === examType.toLowerCase()
        )
      )
    : apiSubjects;

  const selectedNames = subjects.map((s) => s.name);
  const totalQuestions = subjects.reduce((sum, s) => sum + s.questionsCount, 0);
  const maxSubjects = getMaxSubjects(examType);

  const handleSubjectsChange = (names: string[]) => {
    const updated = names.map((name) => {
      const existing = subjects.find((s) => s.name === name);
      return existing ?? { name, questionsCount: questionsPerSubject };
    });
    setValue("subjects", updated, { shouldValidate: true });
  };

  const handleQuestionsChange = (value: number) => {
    setValue("questionsPerSubject", value, { shouldValidate: true });
    if (subjects.length > 0) {
      setValue(
        "subjects",
        subjects.map((s) => ({ ...s, questionsCount: value })),
        { shouldValidate: true }
      );
    }
  };

  const handleSubjectQuestionsChange = (name: string, count: number) => {
    const updated = subjects.map((s) =>
      s.name === name ? { ...s, questionsCount: count } : s
    );
    setValue("subjects", updated, { shouldValidate: true });
  };

  const onSubmit = async (data: CbtSessionInput) => {
    setIsPrefetching(true);
    setPrefetchError(null);

    try {
      // Build subject name → ID map
      const subjectMap = new Map(
        apiSubjects.map((s) => [s.name.toLowerCase(), s._id])
      );

      const allQuestions: StoredQuestion[] = [];

      // Fetch questions for each selected subject
      for (const sub of data.subjects) {
        const subjectId = subjectMap.get(sub.name.toLowerCase());
        if (!subjectId) continue;

        try {
          const result = await triggerGetQuestions({
            subjectId,
            examType: data.examType,
            perPage: sub.questionsCount,
            page: 1,
          }).unwrap();

          if (result.data) {
            allQuestions.push(
              ...result.data.map((q) => ({
                _id: q._id,
                question: q.question,
                options: q.options,
                answer: q.answer,
                answerDetail: q.answerDetail,
                image: q.image,
                examYear: q.examYear,
                subjectName: sub.name,
              }))
            );
          }
        } catch {
          // Skip subjects with no questions
        }
      }

      if (allQuestions.length === 0) {
        setPrefetchError(
          "No questions found for the selected subjects. Try different subjects or exam type."
        );
        setIsPrefetching(false);
        return;
      }

      // Store config + pre-fetched questions
      sessionStorage.setItem("cbt-session", JSON.stringify(data));
      sessionStorage.setItem(
        "cbt-questions",
        JSON.stringify(shuffleArray(allQuestions))
      );

      router.push("/cbt/practice");
    } catch {
      setPrefetchError("Failed to load questions. Please try again.");
      setIsPrefetching(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 pb-24"
    >
      {/* Step 1: Exam Type */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Select Exam Type</CardTitle>
          <CardDescription>
            Choose the exam you want to practice for
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExamTypeSelector
            value={examType}
            onChange={(val) => {
              setValue("examType", val, { shouldValidate: true });
              if (val !== examType) {
                setValue("subjects", [], { shouldValidate: true });
              }
            }}
          />
          {errors.examType && (
            <p className="text-sm text-destructive mt-3">
              {errors.examType.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Subjects */}
      {examType && (
        <Card className="shadow-none animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Choose Subjects
              {selectedNames.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({selectedNames.length} selected)
                </span>
              )}
            </CardTitle>
            <CardDescription>
              Pick up to {maxSubjects} subjects to practice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SubjectSelector
              selected={selectedNames}
              onChange={handleSubjectsChange}
              maxSubjects={maxSubjects}
              apiSubjects={filteredSubjects.length > 0 ? filteredSubjects : undefined}
              isLoading={subjectsLoading}
            />
            {errors.subjects && (
              <p className="text-sm text-destructive mt-3">
                {errors.subjects.message}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Configuration */}
      {subjects.length > 0 && (
        <Card className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CardHeader>
            <CardTitle>Configure Your Test</CardTitle>
            <CardDescription>
              Set duration and number of questions per subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TestConfigPanel
              duration={timeLimit}
              onDurationChange={(val) =>
                setValue("timeLimit", val, { shouldValidate: true })
              }
              questionsPerSubject={questionsPerSubject}
              onQuestionsChange={handleQuestionsChange}
              subjects={subjects}
              onSubjectQuestionsChange={handleSubjectQuestionsChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Pre-fetch error */}
      {prefetchError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {prefetchError}
        </div>
      )}

      {/* Loading overlay */}
      {isPrefetching && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 shadow-lg">
            <Loader2 className="size-10 animate-spin text-app-primary" />
            <div className="text-center">
              <p className="font-semibold">Loading questions...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Preparing your practice session
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Sticky summary bar */}
      <TestSummaryBar
        examType={examType as ExamType | undefined}
        subjectCount={selectedNames.length}
        totalQuestions={totalQuestions}
        duration={timeLimit}
        isValid={isValid && !isPrefetching}
        onStart={handleSubmit(onSubmit)}
      />
    </form>
  );
}
