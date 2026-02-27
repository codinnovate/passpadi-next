"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostActionsProps {
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
  onReply?: () => void;
  onShare?: () => void;
}

export default function PostActions({
  likesCount,
  repliesCount,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark,
  onReply,
  onShare,
}: PostActionsProps) {
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [bookmarkAnimating, setBookmarkAnimating] = useState(false);

  const handleLike = () => {
    setLikeAnimating(true);
    onLike();
    setTimeout(() => setLikeAnimating(false), 200);
  };

  const handleBookmark = () => {
    setBookmarkAnimating(true);
    onBookmark();
    setTimeout(() => setBookmarkAnimating(false), 200);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="flex items-center gap-1 -ml-2">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1.5 text-muted-foreground hover:text-red transition-colors",
          isLiked && "text-red",
          likeAnimating && "scale-110"
        )}
        onClick={handleLike}
      >
        <Heart
          className={cn("size-4", isLiked && "fill-red")}
        />
        {likesCount > 0 && (
          <span className="text-xs">{likesCount}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-muted-foreground hover:text-app-primary transition-colors"
        onClick={onReply}
      >
        <MessageCircle className="size-4" />
        {repliesCount > 0 && (
          <span className="text-xs">{repliesCount}</span>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "gap-1.5 text-muted-foreground hover:text-app-primary transition-colors",
          isBookmarked && "text-app-primary",
          bookmarkAnimating && "scale-110"
        )}
        onClick={handleBookmark}
      >
        <Bookmark
          className={cn("size-4", isBookmarked && "fill-app-primary")}
        />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={handleShare}
      >
        <Share2 className="size-4" />
      </Button>
    </div>
  );
}
