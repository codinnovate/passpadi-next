import { api } from "@/store/api";
import type {
  FeedResponse,
  SinglePostResponse,
  FeedQueryParams,
  CreatePostPayload,
  CreateReplyPayload,
  ReportPostPayload,
} from "../types/feed.types";

export const FEED_PAGE_SIZE = 100;

export const feedApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ── Queries ──────────────────────────────────────────────
    getFeedPosts: builder.query<FeedResponse, FeedQueryParams>({
      query: ({ page = 1, limit = FEED_PAGE_SIZE, postType } = {}) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        if (postType) params.append("type", postType);
        return `/api/v1/post/get-posts?${params.toString()}`;
      },
      serializeQueryArgs: ({ queryArgs }) => {
        return queryArgs.postType ?? "all";
      },
      merge: (currentCache, newItems, { arg }) => {
        if (arg.page === 1) {
          return newItems;
        }
        // Deduplicate by _id when merging pages
        const existingIds = new Set(currentCache.data.map((p) => p._id));
        const newPosts = newItems.data.filter((p) => !existingIds.has(p._id));
        return {
          ...newItems,
          data: [...currentCache.data, ...newPosts],
        };
      },
      forceRefetch: ({ currentArg, previousArg }) => {
        return currentArg?.page !== previousArg?.page;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({
                type: "Feed" as const,
                id: _id,
              })),
              { type: "Feed", id: "LIST" },
            ]
          : [{ type: "Feed", id: "LIST" }],
    }),

    getPost: builder.query<SinglePostResponse, string>({
      query: (postId) => `/api/v1/post/get-post/${postId}`,
      providesTags: (_result, _error, postId) => [
        { type: "Feed", id: postId },
      ],
    }),

    getBookmarkedPosts: builder.query<
      FeedResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 20 } = {}) =>
        `/api/v1/post/bookmarked-posts?page=${page}&limit=${limit}`,
      providesTags: [{ type: "Feed", id: "BOOKMARKS" }],
    }),

    // ── Mutations ────────────────────────────────────────────
    createPost: builder.mutation<SinglePostResponse, CreatePostPayload>({
      query: (body) => ({
        url: "/api/v1/post/create-post",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Feed", id: "LIST" }],
    }),

    deletePost: builder.mutation<{ success: boolean }, string>({
      query: (postId) => ({
        url: `/api/v1/post/delete-post/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Feed", id: postId },
        { type: "Feed", id: "LIST" },
      ],
    }),

    likePost: builder.mutation<SinglePostResponse, string>({
      query: (postId) => ({
        url: `/api/v1/post/like-post/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Feed", id: postId },
        { type: "Feed", id: "LIST" },
      ],
    }),

    unlikePost: builder.mutation<SinglePostResponse, string>({
      query: (postId) => ({
        url: `/api/v1/post/unlike-post/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Feed", id: postId },
        { type: "Feed", id: "LIST" },
      ],
    }),

    bookmarkPost: builder.mutation<SinglePostResponse, string>({
      query: (postId) => ({
        url: `/api/v1/post/bookmark-post/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Feed", id: postId },
        { type: "Feed", id: "LIST" },
        { type: "Feed", id: "BOOKMARKS" },
      ],
    }),

    unbookmarkPost: builder.mutation<SinglePostResponse, string>({
      query: (postId) => ({
        url: `/api/v1/post/unbookmark-post/${postId}`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, postId) => [
        { type: "Feed", id: postId },
        { type: "Feed", id: "LIST" },
        { type: "Feed", id: "BOOKMARKS" },
      ],
    }),

    reportPost: builder.mutation<{ success: boolean }, ReportPostPayload>({
      query: ({ postId, reason }) => ({
        url: `/api/v1/post/report-post/${postId}`,
        method: "POST",
        body: { reason },
      }),
    }),

    createReply: builder.mutation<SinglePostResponse, CreateReplyPayload>({
      query: ({ postId, content, image }) => ({
        url: `/api/v1/post/post/${postId}/reply`,
        method: "POST",
        body: { content, image },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Feed", id: postId },
      ],
    }),

    deleteReply: builder.mutation<
      SinglePostResponse,
      { postId: string; replyId: string }
    >({
      query: ({ postId, replyId }) => ({
        url: `/api/v1/post/post/${postId}/reply/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Feed", id: postId },
      ],
    }),

    likeReply: builder.mutation<
      SinglePostResponse,
      { postId: string; replyId: string }
    >({
      query: ({ postId, replyId }) => ({
        url: `/api/v1/post/post/${postId}/reply/${replyId}/like`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Feed", id: postId },
      ],
    }),

    unlikeReply: builder.mutation<
      SinglePostResponse,
      { postId: string; replyId: string }
    >({
      query: ({ postId, replyId }) => ({
        url: `/api/v1/post/post/${postId}/reply/${replyId}/unlike`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: "Feed", id: postId },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
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
} = feedApi;
