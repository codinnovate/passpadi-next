"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Users, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import LatestBlogArticles from "./LatestBlogArticles";

const features = [
  {
    title: "CBT Practice",
    description: "Practice JAMB, WAEC, NECO & Post-UTME past questions with instant grading.",
    icon: BookOpen,
    color: "bg-app-primary/10 text-app-primary",
  },
  {
    title: "Study Groups",
    description: "Join study groups, share resources, and learn together with peers.",
    icon: Users,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "AI Tutor",
    description: "Get personalized study recommendations powered by AI.",
    icon: Sparkles,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    title: "Community",
    description: "Ask questions, share tips, and connect with students across Nigeria.",
    icon: MessageSquare,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

export default function GuestHero() {
  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <div className="flex flex-col items-center text-center gap-6 py-8 md:py-14">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight max-w-2xl">
          Pass JAMB & Post-UTME{" "}
          <span className="text-app-primary">in one go</span>
        </h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-lg">
          Practice past questions, join study groups, and get AI-powered study
          recommendations — all in one place.
        </p>
        <div className="flex items-center gap-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link href="/register">
              Get Started
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full px-8">
            <Link href="/blog">Explore Blog</Link>
          </Button>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex flex-col items-start gap-3 rounded-xl border bg-card p-5"
          >
            <div
              className={`flex items-center justify-center size-10 rounded-lg ${feature.color}`}
            >
              <feature.icon size={20} />
            </div>
            <div>
              <h3 className="text-sm font-semibold">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Public blog articles */}
      <LatestBlogArticles />
    </div>
  );
}
