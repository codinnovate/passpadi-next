"use client";

import Link from "next/link";
import { BookOpen, PenLine, Users } from "lucide-react";

const actions = [
  {
    title: "Start CBT Practice",
    description: "Practice past questions",
    href: "/cbt",
    icon: BookOpen,
    color: "bg-app-primary/10 text-app-primary",
  },
  {
    title: "Create a Post",
    description: "Share with the community",
    href: "/feeds",
    icon: PenLine,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    title: "Study Groups",
    description: "Learn with others",
    href: "/study-groups",
    icon: Users,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-[#F5F5F7] dark:hover:bg-white/5"
        >
          <div className={`flex items-center justify-center size-10 rounded-lg ${action.color}`}>
            <action.icon size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{action.title}</h3>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
