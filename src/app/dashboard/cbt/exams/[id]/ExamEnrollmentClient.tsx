"use client";

import { useGetCbtExamByIdQuery, useEnrollCbtExamMutation, useGetMyCbtEnrollmentQuery  } from "@/store/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function ExamEnrollmentClient({ id }: { id: string }) {
  const router = useRouter();
  
  const { data: examResponse, isLoading: isExamLoading, refetch: refetchExam } = useGetCbtExamByIdQuery(id as string);
  const { data: enrollmentResponse, isLoading: isEnrollmentLoading, refetch: refetchEnrollment } = useGetMyCbtEnrollmentQuery(id as string);
  const [enroll, { isLoading: isEnrolling }] = useEnrollCbtExamMutation();

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const exam = examResponse?.data;
  const userEnrollment = enrollmentResponse?.data;
  const isEnrolled = !!userEnrollment;
  
  // Update selected subjects if already enrolled
  useEffect(() => {
    if (isEnrolled && userEnrollment.subjects) {
      setSelectedSubjects(userEnrollment.subjects.map((s: any) => s._id || s));
    }
  }, [isEnrolled, userEnrollment]);
  
  // Identify English Language subject ID
  const englishSubject = exam?.subjects?.find((s: any) => {
    const name = s.subject.name.toLowerCase();
    return name.includes("english") && !name.includes("literature");
  });

  // Auto-select English Language on mount if it's JAMB
  useEffect(() => {
    if (exam && exam.examType?.name?.toLowerCase().includes("jamb")) {
        const eng = exam.subjects.find((s: any) => {
            const name = s.subject.name.toLowerCase();
            return name.includes("english") && !name.includes("literature");
        });
        if (eng && !selectedSubjects.includes(eng.subject._id)) {
            setSelectedSubjects(prev => [...prev, eng.subject._id]);
        }
    }
  }, [exam]);

  if (isExamLoading || isEnrollmentLoading) return <div className="p-12 text-center text-neutral-500">Loading details...</div>;
  if (!exam) return <div className="p-12 text-center">Exam not found</div>;

  const handleSubjectToggle = (subjectId: string) => {
    // Prevent unselecting English if JAMB
    if (exam.examType?.name?.toLowerCase().includes("jamb") && englishSubject && subjectId === englishSubject.subject._id) {
        return; 
    }

    setSelectedSubjects(prev => {
        if (prev.includes(subjectId)) {
            return prev.filter(s => s !== subjectId);
        } else {
            // JAMB max 4 check
            if (exam.examType?.name?.toLowerCase().includes("jamb") && prev.length >= 4) {
                toast.error("You can select max 4 subjects for JAMB.");
                return prev;
            }
            return [...prev, subjectId];
        }
    });
  };

  const handleEnroll = async () => {
    // Client-side validation for JAMB
    if (exam.examType?.name?.toLowerCase().includes("jamb")) {
        if (selectedSubjects.length !== 4) {
            toast.error("You must select exactly 4 subjects for JAMB.");
            return;
        }
        if (englishSubject && !selectedSubjects.includes(englishSubject.subject._id)) {
             toast.error("Use of English is compulsory.");
             return;
        }
    } else {
        if (selectedSubjects.length === 0) {
            toast.error("Please select at least one subject.");
            return;
        }
    }

    try {
      await enroll({ id: exam._id, subjects: selectedSubjects }).unwrap();
      toast.success("Successfully enrolled in mock exam!");
      // Refetch data after enrollment
      refetchExam();
      refetchEnrollment();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to enroll");
    }
  };

  const handleStart = () => {
    router.push(`/dashboard/cbt/practice?examId=${exam._id}&mode=mock`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 rounded-3xl overflow-hidden bg-neutral-900">
        {exam.bannerUrl ? (
          <Image 
            src={exam.bannerUrl} 
            alt={exam.title} 
            fill 
            className="object-cover opacity-60"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-indigo-900 opacity-80" />
        )}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
              {exam.examType?.name}
            </Badge>
            <Badge className={`border-none ${exam.status === 'live' ? 'bg-green-500' : 'bg-white/20'}`}>
              {exam.status}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">{exam.title}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">About this Exam</h2>
            <div className="prose text-neutral-600 max-w-none">
              <p>{exam.description || "No description provided."}</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">
              {isEnrolled ? "Your Selected Subjects" : "Select Subjects"}
            </h2>
            <p className="text-sm text-neutral-500">
                {isEnrolled 
                  ? "You have already enrolled for these subjects."
                  : (exam.examType?.name?.toLowerCase().includes("jamb") 
                    ? "Select up to 4 subjects. English is compulsory." 
                    : "Select the subjects you want to take.")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {exam.subjects
                .filter((sub: any) => !isEnrolled || selectedSubjects.includes(sub.subject._id))
                .map((sub: any, i: number) => {
                const name = sub.subject.name.toLowerCase();
                const isEnglish = name.includes("english") && !name.includes("literature");
                const isJamb = exam.examType?.name?.toLowerCase().includes("jamb");
                const isChecked = selectedSubjects.includes(sub.subject._id);
                
                return (
                <div 
                    key={i} 
                    className={`flex items-center gap-2 p-3 border rounded-lg transition-all cursor-pointer text-sm ${isChecked ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-neutral-100 hover:border-blue-200'}`}
                    onClick={() => !isEnrolled && handleSubjectToggle(sub.subject._id)}
                >
                  <Checkbox 
                    checked={isChecked} 
                    onCheckedChange={() => !isEnrolled && handleSubjectToggle(sub.subject._id)}
                    disabled={isEnrolled}
                    className="h-4 w-4"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 truncate flex items-center gap-1.5">
                        {sub.subject.name}
                        {isJamb && isEnglish && <Badge variant="secondary" className="text-[9px] h-4 px-1">Compulsory</Badge>}
                    </p>
                  </div>
                </div>
              )})}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-neutral-900">Instructions</h2>
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl text-amber-900 text-sm leading-relaxed">
              {exam.instructions || "Please read all questions carefully before answering."}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-white sticky top-8">
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Calendar className="w-4 h-4" />
                    <span>Scheduled</span>
                  </div>
                  <span className="font-medium text-right">
                    {exam.scheduledAt ? format(new Date(exam.scheduledAt), "PPP p") : "Anytime"}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-4 h-4" />
                    <span>Duration</span>
                  </div>
                  <span className="font-medium">{exam.durationMinutes} minutes</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Users className="w-4 h-4" />
                    <span>Enrolled</span>
                  </div>
                  <span className="font-medium">
                    {exam.enrolledCount} 
                    {exam.maxStudents ? ` / ${exam.maxStudents}` : ''}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                {isEnrolled ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg justify-center">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="font-medium">You are enrolled</span>
                    </div>
                    
                    <Button onClick={handleStart} className="w-full h-12 text-lg">
                      Enter Exam Room
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleEnroll} 
                    disabled={isEnrolling || (exam.maxStudents && exam.enrolledCount >= exam.maxStudents) || selectedSubjects.length === 0}
                    className="w-full h-12 text-lg"
                  >
                    {isEnrolling ? "Enrolling..." : "Enroll Now"}
                  </Button>
                )}
                
                {exam.maxStudents && exam.enrolledCount >= exam.maxStudents && !isEnrolled && (
                  <p className="text-xs text-center text-red-500 mt-2">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Registration closed (Full)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
