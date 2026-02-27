"use client";

import { Separator } from "@/components/ui/separator";
import ReplyItem from "./ReplyItem";
import type { Reply } from "../types/feed.types";

interface ReplyListProps {
  replies: Reply[];
  postAuthorUsername?: string;
  currentUserId?: string;
  onLikeReply: (replyId: string) => void;
  onDeleteReply?: (replyId: string) => void;
}

export default function ReplyList({
  replies,
  postAuthorUsername,
  currentUserId,
  onLikeReply,
  onDeleteReply,
}: ReplyListProps) {
  if (replies.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No replies yet. Be the first to reply!
      </div>
    );
  }

  return (
    <div>
      <h3 className="px-4 py-3 text-sm font-semibold">
        {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
      </h3>
      <Separator />
      <div className="divide-y px-4">
        {replies.map((reply) => (
          <ReplyItem
            key={reply._id}
            reply={reply}
            postAuthorUsername={postAuthorUsername}
            currentUserId={currentUserId}
            onLike={onLikeReply}
            onDelete={onDeleteReply}
          />
        ))}
      </div>
    </div>
  );
}
