"use client";

import { useParams } from "next/navigation";
import QuestionDetailView from "@/modules/questions/view/QuestionDetailView";

export default function QuestionPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  if (!id) return null;

  return <QuestionDetailView questionId={id} />;
}
