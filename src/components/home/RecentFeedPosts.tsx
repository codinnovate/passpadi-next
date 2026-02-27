"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useGetFeedPostsQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useBookmarkPostMutation,
  useUnbookmarkPostMutation,
} from "@/modules/feed/features/feedApi";
import PostCard from "@/modules/feed/ui/PostCard";
import PostCardSkeleton from "@/modules/feed/ui/PostCardSkeleton";

interface RecentFeedPostsProps {
  currentUserId?: string;
}

export default function RecentFeedPosts({
  currentUserId,
}: RecentFeedPostsProps) {
  const { data, isLoading, isError } = useGetFeedPostsQuery({
    page: 1,
    limit: 3,
  });

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnbookmarkPostMutation();

  const handleLike = (postId: string) => {
    if (!currentUserId) return;
    const post = data?.data.find((p) => p._id === postId);
    if (!post) return;
    const isLiked = post.likes.includes(currentUserId);
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };

  const handleBookmark = (postId: string) => {
    if (!currentUserId) return;
    const post = data?.data.find((p) => p._id === postId);
    if (!post) return;
    const isBookmarked = post.bookmarks.includes(currentUserId);
    if (isBookmarked) {
      unbookmarkPost(postId);
    } else {
      bookmarkPost(postId);
    }
  };

  if (isError) return null;

  const posts = data?.data ?? [];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Posts</h2>
        <Link
          href="/feeds"
          className="flex items-center gap-1 text-xs font-medium text-app-primary hover:underline"
        >
          See all <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No posts yet. Be the first to share something!
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onLike={handleLike}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </section>
  );
}
