import type { Metadata } from "next";
import EventsPageClient from "./EventsPageClient";

export const metadata: Metadata = {
  title: "Events — Mock Exams, Scheduled JAMB & Post UTME Prep",
  description:
    "Discover upcoming mock exams, scheduled JAMB practice tests, Post UTME mock exams, workshops, and live study sessions. Register and track your participation.",
  openGraph: {
    title: "Events — Mock Exams, Scheduled JAMB & Post UTME Prep | 90percent",
    description:
      "Join upcoming mock exams, scheduled JAMB practice tests, and Post UTME mock exams on 90percent. Register for live sessions and competitions.",
    url: "/dashboard/events",
    siteName: "90percent",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Events — Mock Exams, Scheduled JAMB & Post UTME Prep | 90percent",
    description:
      "Join upcoming mock exams, scheduled JAMB practice tests, and Post UTME mock exams on 90percent.",
  },
  alternates: {
    canonical: "/dashboard/events",
  },
};

export default function EventsPage() {
  return <EventsPageClient />;
}
