"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  Trash2,
  Flag,
  Link as LinkIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "../hooks/useRelativeTime";
import PostActions from "./PostActions";
import PostTypeBadge from "./PostTypeBadge";
import type { Post } from "../types/feed.types";

interface PostCardProps {
  post: Post;
  currentUserId?: string;
  isDetail?: boolean;
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onReport?: (postId: string) => void;
}

export default function PostCard({
  post,
  currentUserId,
  isDetail = false,
  onLike,
  onBookmark,
  onDelete,
  onReport,
}: PostCardProps) {
  const router = useRouter();

  const isLiked = currentUserId
    ? (post.likes ?? []).includes(currentUserId)
    : false;
  const isBookmarked = currentUserId
    ? (post.bookmarks ?? []).includes(currentUserId)
    : false;
  const postUserId =
    post.user?._id ?? (post.user as any)?.personal_info?._id;
  const isOwner = !!(currentUserId && postUserId && currentUserId === postUserId);

  // Backend populates user as { personal_info: { fullname, username, profile_img } }
  const pi = (post.user as any)?.personal_info;
  const userName = pi?.fullname || post.user?.name || "";
  const userUsername = pi?.username || post.user?.username || "";
  const userAvatar = pi?.profile_img || post.user?.avatar || "";

  const initials = userName
    ? userName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  const handleCardClick = () => {
    if (!isDetail) {
      router.push(`/feeds/${post._id}`);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/feeds/${post._id}`
    );
  };

  return (
    <article
      className={cn(
        "rounded-xl border bg-card p-4 transition-colors",
        !isDetail && "cursor-pointer hover:bg-accent/50"
      )}
      onClick={handleCardClick}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <Avatar className="size-10 shrink-0">
          {userAvatar && <AvatarImage src={userAvatar} />}
          <AvatarFallback className="text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-semibold truncate">
                {userName}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                @{userUsername}
              </span>
              <span className="text-xs text-muted-foreground">
                &middot; {formatRelativeTime(post.createdAt)}
              </span>
            </div>

            {/* More menu */}
            <div onClick={(e) => e.stopPropagation()}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-44 p-1"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm"
                    onClick={handleCopyLink}
                  >
                    <LinkIcon className="size-4" />
                    Copy link
                  </Button>
                  {isOwner && onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive"
                      onClick={() => onDelete(post._id)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </Button>
                  )}
                  {!isOwner && onReport && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-sm text-destructive hover:text-destructive"
                      onClick={() => onReport(post._id)}
                    >
                      <Flag className="size-4" />
                      Report
                    </Button>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Post type badge */}
          {post.postType !== "general" && post.postType !== "normal" && (
            <div className="mt-1.5">
              <PostTypeBadge postType={post.postType} />
            </div>
          )}

          {/* Post content */}
          <p
            className={cn(
              "text-sm mt-2 whitespace-pre-wrap break-words",
              !isDetail && "line-clamp-6"
            )}
          >
            {post.content}
          </p>

          {/* Marketplace / Job metadata */}
          {post.postType === "marketplace" && post.price != null && (
            <div className="mt-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
              {post.currency ?? "NGN"} {post.price.toLocaleString()}
            </div>
          )}
          {post.postType === "job" && post.company && (
            <div className="mt-2 text-sm text-muted-foreground">
              {post.company}
              {post.location && ` — ${post.location}`}
            </div>
          )}

          {/* Image */}
          {post.image && (
            <div className="mt-3 overflow-hidden rounded-lg border">
              <img
                src={post.image}
                alt="Post attachment"
                className="w-full object-cover max-h-96"
                loading="lazy"
              />
            </div>
          )}

          {/* Action bar */}
          <div className="mt-2" onClick={(e) => e.stopPropagation()}>
            <PostActions
              likesCount={(post.likes ?? []).length}
              repliesCount={(post.replies ?? []).length}
              isLiked={isLiked}
              isBookmarked={isBookmarked}
              onLike={() => onLike(post._id)}
              onBookmark={() => onBookmark(post._id)}
              onReply={
                !isDetail
                  ? () => router.push(`/feeds/${post._id}`)
                  : undefined
              }
              onShare={handleCopyLink}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
