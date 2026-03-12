"use client";

import { useGetCbtExamsQuery } from "@/store/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

export default function MockExamsList() {
  const { data: response, isLoading } = useGetCbtExamsQuery({});
  
  const exams = response?.data || [];

  if (isLoading) {
    return <div className="p-8 text-center text-neutral-500">Loading exams...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-neutral-900">Available Mock Exams</h2>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-xl border border-dashed">
          <p className="text-neutral-500">No mock exams scheduled at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam: any) => (
            <Card key={exam._id} className="overflow-hidden hover:shadow-md transition-shadow">
              {exam.bannerUrl ? (
                <div className="h-32 w-full relative">
                  <Image 
                    src={exam.bannerUrl} 
                    alt={exam.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-2 bg-primary/10 w-full" />
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded-full capitalize">
                        {exam.status}
                    </span>
                    <span className="text-xs text-neutral-500">
                        {exam.examType?.name}
                    </span>
                </div>
                <CardTitle className="text-lg line-clamp-2">{exam.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm text-neutral-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span>{exam.durationMinutes}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span>{exam.enrolledCount} enrolled</span>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>
                      {exam.scheduledAt 
                        ? format(new Date(exam.scheduledAt), "PPP p") 
                        : "Self-paced"}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full mt-4">
                  <Link href={`/dashboard/cbt/exams/${exam.slug || exam._id}`}>
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
