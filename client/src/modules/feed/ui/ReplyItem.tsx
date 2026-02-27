"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "../hooks/useRelativeTime";
import type { Reply } from "../types/feed.types";

interface ReplyItemProps {
  reply: Reply;
  postAuthorUsername?: string;
  currentUserId?: string;
  onLike: (replyId: string) => void;
  onDelete?: (replyId: string) => void;
}

export default function ReplyItem({
  reply,
  postAuthorUsername,
  currentUserId,
  onLike,
  onDelete,
}: ReplyItemProps) {
  const isLiked = currentUserId
    ? (reply.likes ?? []).includes(currentUserId)
    : false;
  const replyUserId =
    reply.user?._id ?? (reply.user as any)?.personal_info?._id;
  const isOwner = !!(currentUserId && replyUserId && currentUserId === replyUserId);

  const pi = (reply.user as any)?.personal_info;
  const userName = pi?.fullname || reply.user?.name || "";
  const userUsername = pi?.username || reply.user?.username || "";
  const userAvatar = pi?.profile_img || reply.user?.avatar || "";

  const initials = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="flex items-start gap-3 py-3">
      <Avatar className="size-8 shrink-0">
        {userAvatar && <AvatarImage src={userAvatar} />}
        <AvatarFallback className="text-[10px] font-medium">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold truncate">
            {userName}
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(reply.createdAt)}
          </span>
        </div>

        {postAuthorUsername && (
          <p className="text-xs text-muted-foreground">
            Replying to{" "}
            <span className="text-app-primary">@{postAuthorUsername}</span>
          </p>
        )}

        {reply.content && (
          <p className="text-sm mt-1 whitespace-pre-wrap break-words">
            {reply.content}
          </p>
        )}

        {reply.image && (
          <img
            src={reply.image}
            alt="Reply image"
            className="mt-2 max-h-60 rounded-lg border object-contain"
          />
        )}

        <div className="flex items-center gap-1 mt-1 -ml-2">
          <Button
            variant="ghost"
            size="xs"
            className={cn(
              "gap-1 text-muted-foreground hover:text-red transition-colors",
              isLiked && "text-red"
            )}
            onClick={() => onLike(reply._id)}
          >
            <Heart className={cn("size-3.5", isLiked && "fill-red")} />
            {(reply.likes ?? []).length > 0 && (
              <span className="text-[10px]">{(reply.likes ?? []).length}</span>
            )}
          </Button>

          {isOwner && onDelete && (
            <Button
              variant="ghost"
              size="xs"
              className="text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => onDelete(reply._id)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
