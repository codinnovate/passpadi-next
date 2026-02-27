"use client";

import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import {
  useGetPostQuery,
  useLikePostMutation,
  useUnlikePostMutation,
  useBookmarkPostMutation,
  useUnbookmarkPostMutation,
  useDeletePostMutation,
  useCreateReplyMutation,
  useDeleteReplyMutation,
  useLikeReplyMutation,
  useUnlikeReplyMutation,
} from "../features/feedApi";
import PostCard from "../ui/PostCard";
import PostCardSkeleton from "../ui/PostCardSkeleton";
import ReplyList from "../ui/ReplyList";
import ReplyComposer from "../ui/ReplyComposer";
import FeedErrorState from "../ui/FeedErrorState";
import ReportPostDialog from "../ui/ReportPostDialog";
import { useState } from "react";

interface PostDetailViewProps {
  postId: string;
}

function ReplySkeleton() {
  return (
    <div className="flex items-start gap-3 py-3 px-4">
      <Skeleton className="size-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-6 w-12 rounded-md" />
      </div>
    </div>
  );
}

export default function PostDetailView({ postId }: PostDetailViewProps) {
  const router = useRouter();
  const authUser = useAppSelector((s) => s.auth.user);
  const currentUserId: string | undefined =
    authUser?._id ?? authUser?.personal_info?._id;
  const userName: string =
    authUser?.personal_info?.fullname ?? authUser?.name ?? "";
  const userAvatar: string =
    authUser?.personal_info?.profile_img ?? authUser?.avatar ?? "";

  const [reportPostId, setReportPostId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } =
    useGetPostQuery(postId);
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [bookmarkPost] = useBookmarkPostMutation();
  const [unbookmarkPost] = useUnbookmarkPostMutation();
  const [deletePost] = useDeletePostMutation();
  const [createReply, { isLoading: isReplying }] = useCreateReplyMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [likeReply] = useLikeReplyMutation();
  const [unlikeReply] = useUnlikeReplyMutation();

  const post = data?.data;

  // Resolve post author username from personal_info or flat shape
  const postAuthorUsername = post
    ? (post.user as any)?.personal_info?.username ||
      post.user.username ||
      ""
    : "";

  const handleLike = () => {
    if (!currentUserId || !post) return;
    const isLiked = (post.likes ?? []).includes(currentUserId);
    if (isLiked) {
      unlikePost(postId);
    } else {
      likePost(postId);
    }
  };

  const handleBookmark = () => {
    if (!currentUserId || !post) return;
    const isBookmarked = (post.bookmarks ?? []).includes(currentUserId);
    if (isBookmarked) {
      unbookmarkPost(postId);
    } else {
      bookmarkPost(postId);
    }
  };

  const handleDelete = () => {
    deletePost(postId);
    router.push("/feeds");
  };

  const handleReplySubmit = async (content: string, image?: string) => {
    try {
      await createReply({ postId, content, image }).unwrap();
    } catch {
      // Error handled by RTK Query
    }
  };

  const handleLikeReply = (replyId: string) => {
    if (!currentUserId || !post) return;
    const reply = (post.replies ?? []).find((r) => r._id === replyId);
    if (!reply) return;
    const isLiked = (reply.likes ?? []).includes(currentUserId);
    if (isLiked) {
      unlikeReply({ postId, replyId });
    } else {
      likeReply({ postId, replyId });
    }
  };

  const handleDeleteReply = (replyId: string) => {
    deleteReply({ postId, replyId });
  };

  const BackButton = () => (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 -ml-2"
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-4" />
      Post
    </Button>
  );

  // ── Loading skeleton ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="max-w-2xl w-full flex flex-col">
        <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm px-4 py-3">
          <BackButton />
        </div>
        <div className="p-4">
          <PostCardSkeleton />
        </div>
        {/* Reply skeletons */}
        <div className="border-t">
          <div className="px-4 py-3">
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <ReplySkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────
  if (isError || !post) {
    const is404 =
      error && "status" in error && (error as any).status === 404;
    const isNetworkError =
      error && "status" in error && (error as any).status === "FETCH_ERROR";
    const is401 =
      error && "status" in error && (error as any).status === 401;

    let variant: "not-found" | "network" | "unauthorized" | "generic" = "generic";
    let message: string | undefined;
    if (is404) {
      variant = "not-found";
      message = "Post not found";
    } else if (isNetworkError) {
      variant = "network";
    } else if (is401) {
      variant = "unauthorized";
    }

    return (
      <div className="max-w-2xl w-full flex flex-col">
        <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm px-4 py-3">
          <BackButton />
        </div>
        <div className="p-4">
          <FeedErrorState
            variant={variant}
            message={message}
            onRetry={refetch}
          />
        </div>
      </div>
    );
  }

  // ── Post detail ───────────────────────────────────────────
  return (
    <div className="flex max-w-2xl w-full flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm px-4 py-3">
        <BackButton />
      </div>

      {/* Post */}
      <div className="p-4">
        <PostCard
          post={post}
          currentUserId={currentUserId}
          isDetail
          onLike={handleLike}
          onBookmark={handleBookmark}
          onDelete={handleDelete}
          onReport={setReportPostId}
        />
      </div>

      {/* Replies */}
      <ReplyList
        replies={post.replies ?? []}
        postAuthorUsername={postAuthorUsername}
        currentUserId={currentUserId}
        onLikeReply={handleLikeReply}
        onDeleteReply={handleDeleteReply}
      />

      {/* Reply composer */}
      <ReplyComposer
        userName={userName}
        userAvatar={userAvatar}
        isLoading={isReplying}
        onSubmit={handleReplySubmit}
      />

      {/* Report dialog */}
      <ReportPostDialog
        postId={reportPostId}
        onClose={() => setReportPostId(null)}
      />
    </div>
  );
}
