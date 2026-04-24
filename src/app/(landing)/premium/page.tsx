import type { Metadata } from "next";
import PremiumAdmissionPage from "./premium-admission-page";

export const metadata: Metadata = {
  title: "Know Your 2026 Admission Chances",
  description:
    "Share your 2026 JAMB score, course and school to know your admission chances. Get expert admission guidance, school updates, and real-time support.",
  alternates: {
    canonical: "/premium",
  },
  openGraph: {
    title: "Share your 2026 JAMB score to know your admission chances",
    description:
      "Your JAMB score is not the end. Let admission experts review your score, course and school choice, then guide your next move.",
    url: "/premium",
    type: "website",
  },
};

export default function PremiumPage() {
  return <PremiumAdmissionPage />;
}
