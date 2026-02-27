import type { Metadata } from "next";
import BlogListClient from "@/components/BlogListClient";

export const metadata: Metadata = {
  title: "Blog — Study Tips, Exam Guides & Education News | Passpadi",
  description:
    "Discover expert articles on JAMB preparation, WAEC tips, Post-UTME strategies, university admission guides, and the latest education news in Nigeria.",
  keywords: [
    "JAMB preparation tips",
    "WAEC study guide",
    "Post-UTME prep",
    "Nigeria education news",
    "university admission guide",
    "exam preparation",
    "study tips",
    "Passpadi blog",
  ],
  openGraph: {
    title: "Blog — Study Tips, Exam Guides & Education News | Passpadi",
    description:
      "Discover expert articles on JAMB preparation, WAEC tips, Post-UTME strategies, and the latest education news in Nigeria.",
    url: "/blog",
    siteName: "Passpadi",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Study Tips, Exam Guides & Education News | Passpadi",
    description:
      "Expert articles on exam preparation, study tips, and education news.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <div className="flex flex-col w-full gap-8 py-6">
      <div>
        <p className="text-sm font-medium text-app-primary mb-1">Our Blog</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Articles & Guides
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          Study tips, exam strategies, admission guides, and education news to
          help you ace your exams.
        </p>
      </div>
      <BlogListClient />
    </div>
  );
}
