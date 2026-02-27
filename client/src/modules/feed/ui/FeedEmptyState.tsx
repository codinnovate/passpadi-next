"use client";

import { FileText } from "lucide-react";

interface FeedEmptyStateProps {
  message?: string;
}

export default function FeedEmptyState({
  message = "No posts yet. Be the first to share something!",
}: FeedEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-muted p-4">
        <FileText className="size-8 text-muted-foreground" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground max-w-xs">{message}</p>
    </div>
  );
}
