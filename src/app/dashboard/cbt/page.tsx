import type { Metadata } from "next";
import CbtDashboard from "@/components/cbt/CbtDashboard";
import MockExamsList from "@/components/cbt/MockExamsList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://90percent.ng";

export const metadata: Metadata = {
  title: "CBT Practice — JAMB, WAEC, NECO & Post-UTME Past Questions",
  description:
    "Free CBT practice for JAMB UTME, WAEC SSCE, NECO, and Post-UTME. Practice with thousands of past questions, timed sessions, instant scoring, and detailed explanations. Start preparing now!",
  keywords: [
    "CBT practice",
    "JAMB CBT practice",
    "JAMB past questions",
    "JAMB past questions and answers",
    "WAEC past questions",
    "NECO past questions",
    "Post-UTME past questions",
    "JAMB UTME practice",
    "free CBT practice online",
    "JAMB CBT simulator",
    "WAEC SSCE practice",
    "NECO SSCE past questions",
    "Nigeria exam practice",
    "online CBT test",
    "JAMB preparation",
    "UTME preparation",
    "past questions and answers",
    "Mathematics past questions",
    "English past questions",
    "Physics past questions",
    "Chemistry past questions",
    "Biology past questions",
    "Economics past questions",
    "Government past questions",
  ],
  openGraph: {
    title: "CBT Practice — JAMB, WAEC, NECO & Post-UTME | 90percent",
    description:
      "Practice for JAMB, WAEC, NECO, and Post-UTME with thousands of past questions, timed CBT sessions, instant scoring, and detailed explanations. Free!",
    url: `${SITE_URL}/cbt`,
    siteName: "90percent",
    locale: "en_NG",
    type: "website",
    images: [
      {
        url: `${SITE_URL}/og-cbt.png`,
        width: 1200,
        height: 630,
        alt: "90percent CBT Practice — Practice JAMB, WAEC, NECO Past Questions Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CBT Practice — JAMB, WAEC, NECO & Post-UTME | 90percent",
    description:
      "Free timed CBT practice with thousands of JAMB, WAEC, NECO & Post-UTME past questions. Get instant scores and detailed explanations.",
    images: [`${SITE_URL}/og-cbt.png`],
  },
  alternates: {
    canonical: `${SITE_URL}/cbt`,
  },
  category: "Education",
};

function CbtJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "90percent CBT Practice",
    description:
      "Free online CBT practice platform for Nigerian students preparing for JAMB UTME, WAEC SSCE, NECO, and Post-UTME examinations with past questions and detailed explanations.",
    url: `${SITE_URL}/cbt`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NGN",
    },
    author: {
      "@type": "Organization",
      name: "90percent",
      url: SITE_URL,
    },
    educationalAlignment: [
      {
        "@type": "AlignmentObject",
        alignmentType: "educationalLevel",
        targetName: "Senior Secondary School",
      },
    ],
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

function CbtFaqJsonLd() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I practice for JAMB CBT online?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "On 90percent, select JAMB as your exam type, choose your subjects (up to 4), set your preferred duration and number of questions, then start your timed practice session. You'll get instant scoring and detailed explanations after each session.",
        },
      },
      {
        "@type": "Question",
        name: "Are these real JAMB, WAEC, and NECO past questions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes! Our question bank contains thousands of real past questions from JAMB UTME, WAEC SSCE, NECO, and Post-UTME exams, organized by subject and year with verified answers and detailed explanations.",
        },
      },
      {
        "@type": "Question",
        name: "Is this CBT practice free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 90percent CBT practice is completely free. You can practice unlimited times with past questions from JAMB, WAEC, NECO, and Post-UTME exams.",
        },
      },
      {
        "@type": "Question",
        name: "What subjects are available for CBT practice?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We cover all major subjects including Mathematics, English Language, Physics, Chemistry, Biology, Economics, Government, Literature, Geography, Commerce, CRK, Civic Education, Computer Science, and more.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  );
}

export default function CbtPage() {
  return (
    <div className="space-y-8 pb-20">
      <CbtJsonLd />
      <CbtFaqJsonLd />
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-neutral-900">CBT Practice Centre</h1>
        <p className="text-neutral-500">
          Master your exams with timed practice sessions and mock tests.
        </p>
      </div>

      <MockExamsList />

      <div className="border-t border-neutral-200 pt-8">
        <h2 className="text-xl font-bold text-neutral-900 mb-6">Quick Practice</h2>
        <CbtDashboard />
      </div>
    </div>
  );
}
