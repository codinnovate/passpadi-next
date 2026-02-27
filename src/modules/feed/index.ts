// Views
export { default as FeedView } from "./view/FeedView";
export { default as PostDetailView } from "./view/PostDetailView";

// UI Components
export { default as PostCard } from "./ui/PostCard";
export { default as PostCardSkeleton } from "./ui/PostCardSkeleton";
export { default as PostActions } from "./ui/PostActions";
export { default as PostTypeBadge } from "./ui/PostTypeBadge";
export { default as PostComposer } from "./ui/PostComposer";
export { default as PostComposerTrigger } from "./ui/PostComposerTrigger";
export { default as ReplyItem } from "./ui/ReplyItem";
export { default as ReplyComposer } from "./ui/ReplyComposer";
export { default as ReplyList } from "./ui/ReplyList";
export { default as FeedFilterTabs } from "./ui/FeedFilterTabs";
export { default as FeedEmptyState } from "./ui/FeedEmptyState";
export { default as FeedErrorState } from "./ui/FeedErrorState";
export { default as ReportPostDialog } from "./ui/ReportPostDialog";

// API hooks
export {
  useGetFeedPostsQuery,
  useGetPostQuery,
  useGetBookmarkedPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useBookmarkPostMutation,
  useUnbookmarkPostMutation,
  useReportPostMutation,
  useCreateReplyMutation,
  useDeleteReplyMutation,
  useLikeReplyMutation,
  useUnlikeReplyMutation,
  FEED_PAGE_SIZE,
} from "./features/feedApi";

// Types
export type {
  Post,
  Reply,
  PostUser,
  PostType,
  FeedResponse,
  SinglePostResponse,
  FeedQueryParams,
  CreatePostPayload,
  CreateReplyPayload,
  ReportPostPayload,
} from "./types/feed.types";

// Hooks
export { formatRelativeTime } from "./hooks/useRelativeTime";
export { useInfiniteScroll } from "./hooks/useInfiniteScroll";
