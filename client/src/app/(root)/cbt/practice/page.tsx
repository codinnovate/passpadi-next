import type { Metadata } from "next";
import CbtPracticeSession from "@/components/cbt/CbtPracticeSession";

export const metadata: Metadata = {
  title: "Practice Session — CBT",
  description: "Timed CBT practice session with past questions.",
};

export default function CbtPracticePage() {
  return <CbtPracticeSession />;
}
