"use client";

import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  ShoppingBag,
  Briefcase,
} from "lucide-react";
import type { PostType } from "../types/feed.types";

const config: Record<
  Exclude<PostType, "general" | "normal">,
  { label: string; icon: React.ReactNode; className: string }
> = {
  question: {
    label: "Question",
    icon: <HelpCircle className="size-3" />,
    className: "bg-purple/15 text-purple border-purple/25",
  },
  marketplace: {
    label: "Marketplace",
    icon: <ShoppingBag className="size-3" />,
    className: "bg-amber-500/15 text-amber-600 border-amber-500/25 dark:text-amber-400",
  },
  job: {
    label: "Job",
    icon: <Briefcase className="size-3" />,
    className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
  },
};

export default function PostTypeBadge({ postType }: { postType: PostType }) {
  if (postType === "general") return null;
  const entry = config[postType as Exclude<PostType, "general" | "normal">];
  if (!entry) return null;
  const { label, icon, className } = entry;

  return (
    <Badge variant="outline" className={className}>
      {icon}
      {label}
    </Badge>
  );
}
