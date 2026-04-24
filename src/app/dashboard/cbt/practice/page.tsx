import type { Metadata } from "next";
import { Suspense } from "react";

import CbtPracticeSession from "@/components/cbt/CbtPracticeSession";
import Loader from "@/components/Loader";

export const metadata: Metadata = {
  title: "Practice Session — CBT",
  description: "Timed CBT practice session with past questions.",
};

export default function CbtPracticePage() {
  return (
    <Suspense fallback={<Loader />}>
      <CbtPracticeSession />
    </Suspense>
  );
}
