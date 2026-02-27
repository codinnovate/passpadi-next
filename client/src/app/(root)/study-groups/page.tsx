import type { Metadata } from "next";
import StudyGroupsList from "@/components/study-groups/StudyGroupsList";

export const metadata: Metadata = {
  title: "Study Groups — Collaborate & Learn Together",
  description:
    "Join study groups on 90percent. Collaborate with fellow students, share notes, and prepare for JAMB, WAEC, NECO and Post-UTME together.",
  openGraph: {
    title: "Study Groups — Collaborate & Learn Together | 90percent",
    description:
      "Join study groups and collaborate with fellow students preparing for Nigerian exams.",
    url: "/study-groups",
    siteName: "90percent",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Study Groups | 90percent",
    description:
      "Join study groups and collaborate with fellow students.",
  },
  alternates: {
    canonical: "/study-groups",
  },
};

export default function StudyGroupsPage() {
  return (
    <div className="flex flex-col w-full gap-6 py-6">
      <StudyGroupsList />
    </div>
  );
}
