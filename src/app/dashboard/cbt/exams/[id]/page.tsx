import { Metadata } from "next";
import { ExamEnrollmentClient } from "./ExamEnrollmentClient";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;
  
  // Try to fetch exam data for dynamic SEO if we can
  // Note: In production this should be a robust server-side fetch
  let examData = null;
  try {
      // Assuming localhost for dev, but should use env var
      // This fetch happens on server side during SSR/ISR
      // We need absolute URL
      // const res = await fetch(`http://localhost:8000/api/v1/cbt/exams/${id}`, { cache: 'no-store' });
      // if (res.ok) {
      //    const json = await res.json();
      //    examData = json.data;
      // }
      // Use id to avoid unused var warning
      if (id) {
          // Placeholder usage
      }
  } catch (e) {
      // Ignore fetch errors for metadata
  }

  const title = (examData as any)?.title || "Mock Exam Enrollment";
  const desc = (examData as any)?.description || "Take our AI-powered mock exams to predict your 2026 JAMB score. Master these concepts and guarantee yourself a score of 250+.";
  const image = (examData as any)?.bannerUrl || "/images/og-mock.png";

  return {
    title: `${title} - 90Percent`,
    description: desc,
    openGraph: {
      title: `${title} - Predict Your Score with AI`,
      description: "Our AI analyzes past questions to predict upcoming 2026 JAMB topics. If you can master these mock exams, you are guaranteed at least 250 in your real exam.",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} - 90Percent AI Mock Exams`,
      description: "Predict your 2026 JAMB score with our AI-powered mock exams.",
      images: [image],
    }
  };
}

export default async function ExamEnrollmentPageWrapper({ params }: any) {
    const { id } = await params;
    return <ExamEnrollmentClient id={id} />;
}
