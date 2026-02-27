"use client";

import { useState, useCallback } from "react";
import { useAppSelector } from "@/store/hooks";
import { useGetFeedPostsQuery } from "../features/feedApi";
import { FEED_PAGE_SIZE } from "../features/feedApi";
import {
  useLikePostMutation,
  useUnlikePostMutation,
  useBookmarkPostMutation,
  useUnbookmarkPostMutation,
  useDeletePostMutation,
} from "../features/feedApi";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import PostCard from "../ui/PostCard";
import PostCardSkeleton from "../ui/PostCardSkeleton";
import PostComposerTrigger from "../ui/PostComposerTrigger";
import PostComposer from "../ui/PostComposer";
import FeedFilterTabs from "../ui/FeedFilterTabs";
import FeedEmptyState from "../ui/FeedEmptyState";
import FeedErrorState from "../ui/FeedErrorState";
import ReportPostDialog from "../ui/ReportPostDialog";
import type { PostType } from "../types/feed.types";

export default function FeedView() {
  const user = useAppSelector((s) => s.auth.user);
  const currentUserId: string | undefined =
    user?._id ?? user?.personal_info?._id;
  const userName: string =
    user?.personal_info?.fullname ?? user?.name ?? "";

  const [composerOpen, setComposerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [reportPostId, setReportPostId] = useState<string | null>(null);

  const postType = activeTab === "all" ? undefined : (activeTab as PostType);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetFeedPostsQuery({ page, postType });

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnbookmarkPostMutation();
  const [deletePost] = useDeletePostMutation();

  const posts = data?.data ?? [];

  // Backend returns no pagination metadata — infer hasMore from accumulated count
  const hasMore = posts.length >= page * FEED_PAGE_SIZE;

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage((p) => p + 1);
    }
  }, [isFetching, hasMore]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: isFetching,
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleLike = (postId: string) => {
    if (!currentUserId) return;
    const post = posts.find((p) => p._id === postId);
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
    const post = posts.find((p) => p._id === postId);
    if (!post) return;
    const isBookmarked = post.bookmarks.includes(currentUserId);
    if (isBookmarked) {
      unbookmarkPost(postId);
    } else {
      bookmarkPost(postId);
    }
  };

  const handleDelete = (postId: string) => {
    deletePost(postId);
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl w-full">
      {/* Composer trigger */}
      <PostComposerTrigger
        onClick={() => setComposerOpen(true)}
        userName={userName}
      />
      <PostComposer open={composerOpen} onOpenChange={setComposerOpen} />

      {/* Filter tabs */}
      <FeedFilterTabs value={activeTab} onChange={handleTabChange} />

      {/* Feed content */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <FeedErrorState onRetry={refetch} />
      ) : posts.length === 0 ? (
        <FeedEmptyState />
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              currentUserId={currentUserId}
              onLike={handleLike}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
              onReport={setReportPostId}
            />
          ))}

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="flex justify-center py-4">
            {isFetching && <PostCardSkeleton />}
            {!hasMore && posts.length > 0 && (
              <p className="text-xs text-muted-foreground">
                You&apos;ve reached the end
              </p>
            )}
          </div>
        </div>
      )}

      {/* Report dialog */}
      <ReportPostDialog
        postId={reportPostId}
        onClose={() => setReportPostId(null)}
      />
    </div>
  );
}
