"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PenLine } from "lucide-react";

interface PostComposerTriggerProps {
  onClick: () => void;
  userName?: string;
}

export default function PostComposerTrigger({
  onClick,
  userName,
}: PostComposerTriggerProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:bg-accent/50"
    >
      <Avatar className="size-10 shrink-0">
        <AvatarFallback className="text-xs font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="flex-1 text-sm text-muted-foreground">
        What&apos;s on your mind?
      </span>
      <PenLine className="size-5 text-muted-foreground" />
    </button>
  );
}
