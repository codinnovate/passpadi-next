import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  Group,
  GroupWithLastMessage,
  GroupMessage,
  GroupMessagesResponse,
  GroupMembersResponse,
} from "@/types/group";

const baseUrl = process.env.NEXT_PUBLIC_SERVER || "";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Blog", "Feed", "CBT", "Leaderboard", "XP", "Group", "GroupMessages", "Auth", "Question", "QuestionStats", "Notification"],
  endpoints: (builder) => ({
    // ── Auth endpoints ───────────────────────────────────────────
    register: builder.mutation<
      { message: string; data: any },
      { fullname: string; email: string; password: string; confirmPassword: string; app?: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<
      { message: string; accessToken: string; user: any; mfaRequired: boolean },
      { email: string; password: string; app?: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    googleLogin: builder.mutation<
      { message: string; accessToken: string; user: any; mfaRequired: boolean },
      { accessToken: string; app?: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/google/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
    }),

    getProfile: builder.query<{ message: string; data: any }, void>({
      query: () => "/api/v1/auth/profile",
      providesTags: ["Auth"],
    }),

    getQuestionStats: builder.query<
      { message: string; data: { today: number; thisWeek: number; thisMonth: number; lifetime: number } },
      void
    >({
      query: () => "/api/v1/auth/question-stats",
      providesTags: ["QuestionStats"],
    }),

    updateProfile: builder.mutation<
      { message: string; data: { user: any } },
      { fullname?: string; username?: string; bio?: string; profile_img?: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.query<{ message: string; accessToken: string }, void>({
      query: () => "/api/v1/auth/refresh",
      providesTags: ["Auth"],
    }),

    verifyEmail: builder.mutation<{ message: string }, { code: string }>({
      query: (body) => ({
        url: "/api/v1/auth/verify/email",
        method: "POST",
        body,
      }),
    }),

    resendVerificationEmail: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/api/v1/auth/verify/email/resend",
        method: "POST",
        body,
      }),
    }),

    sendPasswordResetOTP: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/password/send-otp",
        method: "POST",
        body,
      }),
    }),

    resetPasswordWithOTP: builder.mutation<
      { message: string },
      { email: string; otp: string; password: string }
    >({
      query: (body) => ({
        url: "/api/v1/auth/password/reset-with-otp",
        method: "POST",
        body,
      }),
    }),

    // Blog endpoints
    getBlogs: builder.query({
      query: ({ page = 1, limit = 12, tag, search }: { page?: number; limit?: number; tag?: string; search?: string }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        params.append("limit", String(limit));
        if (tag) params.append("tag", tag);
        if (search) params.append("search", search);
        return `/api/v1/blogs?${params.toString()}`;
      },
      providesTags: ["Blog"],
    }),
    getBlogById: builder.query({
      query: (id: string) => `/api/v1/blogs/${id}`,
      providesTags: (_result: unknown, _error: unknown, id: string) => [{ type: "Blog" as const, id }],
    }),

    // Feeds endpoints
    getFeeds: builder.query({
      query: ({ page = 1, limit = 20 }) => `/api/v1/post/get-posts?page=${page}&limit=${limit}`,
      providesTags: ["Feed"],
    }),

    // CBT endpoints
    getCbtExams: builder.query({
      query: ({ examType, subject }: { examType?: string; subject?: string }) => {
        const params = new URLSearchParams();
        if (examType) params.append("examType", examType);
        if (subject) params.append("subject", subject);
        return `/api/v1/cbt/exams?${params.toString()}`;
      },
      providesTags: ["CBT"],
    }),
    getCbtExamById: builder.query({
      query: (id: string) => `/api/v1/cbt/exams/${id}`,
      providesTags: (_result: any, _error: any, id: string) => [{ type: "CBT", id }],
    }),
    enrollCbtExam: builder.mutation({
      query: ({ id, subjects }: { id: string; subjects: string[] }) => ({
        url: `/api/v1/cbt/exams/${id}/enroll`,
        method: "POST",
        body: { subjects },
      }),
      invalidatesTags: ["CBT"],
    }),
    getCbtEnrollments: builder.query({
      query: (id: string) => `/api/v1/cbt/exams/${id}/enrollments`,
      providesTags: ["CBT"],
    }),
    getMyCbtEnrollment: builder.query({
      query: (id: string) => `/api/v1/cbt/exams/${id}/my-enrollment`,
      providesTags: ["CBT"],
    }),
    startCbtAttempt: builder.mutation({
      query: ({ examId, totalQuestions }: { examId: string; totalQuestions: number }) => ({
        url: `/api/v1/cbt/exams/${examId}/start`,
        method: "POST",
        body: { totalQuestions },
      }),
      invalidatesTags: ["CBT"],
    }),
    submitCbtAttempt: builder.mutation({
      query: ({ examId, attemptId, correct, wrong, skipped, durationSeconds }: any) => ({
        url: `/api/v1/cbt/exams/${examId}/submit`,
        method: "POST",
        body: { attemptId, correct, wrong, skipped, durationSeconds },
      }),
      invalidatesTags: ["CBT"],
    }),
    getCbtSubjects: builder.query({
      query: () => "/api/v1/subjects",
      providesTags: ["CBT"],
    }),
    getQuestions: builder.query<
      {
        success: boolean;
        totalQuestions: number;
        perPage: number;
        page: number;
        totalPages: number;
        data: Array<{
          _id: string;
          question: string;
          options: string[];
          answer: string;
          answerDetail?: string;
          image?: string;
          examYear?: number;
          subject?: { _id: string; name: string };
          examType?: { _id: string; name: string };
        }>;
      },
      { subjectId?: string; examType?: string; examYear?: number; search?: string; perPage?: number; page?: number }
    >({
      query: ({ subjectId, examType, examYear, search, perPage = 25, page = 1 }) => {
        const params = new URLSearchParams();
        params.append("perPage", String(perPage));
        params.append("page", String(page));
        if (subjectId) params.append("subjectId", subjectId);
        if (examType) params.append("examType", examType);
        if (examYear) params.append("examYear", String(examYear));
        if (search) params.append("search", search);
        return `/api/v1/questions?${params.toString()}`;
      },
    }),

    getQuestionById: builder.query<
      { success: boolean; data: any },
      string
    >({
      query: (id) => `/api/v1/questions/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Question", id }],
    }),

    addQuestionReply: builder.mutation<
      { success: boolean; data: any },
      { questionId: string; content: string; image?: string }
    >({
      query: ({ questionId, content, image }) => ({
        url: `/api/v1/questions/${questionId}/replies`,
        method: "POST",
        body: { content, image },
      }),
      invalidatesTags: (_result, _error, { questionId }) => [{ type: "Question", id: questionId }],
    }),

    deleteQuestionReply: builder.mutation<
      { success: boolean },
      { questionId: string; replyId: string }
    >({
      query: ({ questionId, replyId }) => ({
        url: `/api/v1/questions/${questionId}/replies/${replyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, { questionId }) => [{ type: "Question", id: questionId }],
    }),

    getUploadUrl: builder.mutation<
      { url: string; publicUrl: string },
      { fileType: string }
    >({
      query: ({ fileType }) => `/api/v1/get-upload-url?fileType=${fileType}`,
    }),

    getExamTypes: builder.query<
      Array<{ _id: string; name: string; subjects?: Array<{ _id: string; name: string }> }>,
      void
    >({
      query: () => "/api/v1/examtypes",
    }),

    getTopics: builder.query<
      { success: boolean; data: Array<{ _id: string; name: string; subject: { _id: string; name: string } }> },
      void
    >({
      query: () => "/api/v1/topics",
    }),

    // Leaderboard endpoints
    getLeaderboard: builder.query({
      query: ({ examType, period = "all" }: { examType?: string; period?: string }) => {
        const params = new URLSearchParams();
        if (examType) params.append("examType", examType);
        if (period) params.append("period", period);
        return `/api/v1/xp/leaderboard?${params.toString()}`;
      },
      providesTags: ["Leaderboard"],
    }),

    // XP endpoints
    getUserXPSummary: builder.query({
      query: () => "/api/v1/xp/me",
      providesTags: ["XP"],
    }),
    recordDailyActivity: builder.mutation({
      query: () => ({ url: "/api/v1/xp/daily-activity", method: "POST" }),
      invalidatesTags: ["XP", "Leaderboard"],
    }),

    // ── Study Group endpoints ──────────────────────────────────────

    getJoinedGroups: builder.query<{ success: boolean; data: GroupWithLastMessage[] }, void>({
      query: () => "/api/v1/groups/joined",
      providesTags: ["Group"],
    }),

    getDiscoverGroups: builder.query<
      { success: boolean; data: Group[] },
      { search?: string; category?: string; page?: number; limit?: number }
    >({
      query: ({ search, category, page = 1, limit = 20 }) => {
        const params = new URLSearchParams({ discover: "true" });
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        params.append("page", String(page));
        params.append("limit", String(limit));
        return `/api/v1/groups?${params.toString()}`;
      },
      providesTags: ["Group"],
    }),

    getGroupDetails: builder.query<{ success: boolean; data: Group }, string>({
      query: (groupId) => `/api/v1/groups/${groupId}`,
      providesTags: (_result, _error, groupId) => [{ type: "Group", id: groupId }],
    }),

    getGroupMembers: builder.query<
      { success: boolean; data: GroupMembersResponse },
      { groupId: string; page?: number; search?: string }
    >({
      query: ({ groupId, page = 1, search }) => {
        const params = new URLSearchParams({ page: String(page) });
        if (search) params.append("search", search);
        return `/api/v1/groups/${groupId}/members?${params.toString()}`;
      },
    }),

    getGroupMessages: builder.query<
      GroupMessagesResponse,
      { groupId: string; page?: number; limit?: number }
    >({
      query: ({ groupId, page = 1, limit = 50 }) =>
        `/api/v1/groups/${groupId}/messages?page=${page}&limit=${limit}`,
      providesTags: (_result, _error, { groupId }) => [
        { type: "GroupMessages", id: groupId },
      ],
    }),

    createGroup: builder.mutation<
      { success: boolean; data: Group },
      {
        name: string;
        description: string;
        category: string;
        image?: string;
        coverImage?: string;
        tags?: string[];
        isPrivate?: boolean;
        invitedMembers?: string[];
      }
    >({
      query: (body) => ({ url: "/api/v1/groups", method: "POST", body }),
      invalidatesTags: ["Group"],
    }),

    joinGroup: builder.mutation<{ success: boolean; data: Group }, string>({
      query: (groupId) => ({ url: `/api/v1/groups/${groupId}/join`, method: "POST" }),
      invalidatesTags: ["Group"],
    }),

    leaveGroup: builder.mutation<{ success: boolean; data: Group }, string>({
      query: (groupId) => ({ url: `/api/v1/groups/${groupId}/leave`, method: "POST" }),
      invalidatesTags: ["Group"],
    }),

    sendGroupMessage: builder.mutation<
      { success: boolean; data: GroupMessage },
      { groupId: string; content: string; type?: string; replyToId?: string; mediaUrl?: string }
    >({
      query: ({ groupId, ...body }) => ({
        url: `/api/v1/groups/${groupId}/messages`,
        method: "POST",
        body,
      }),
    }),

    deleteGroupMessage: builder.mutation<
      { success: boolean },
      { groupId: string; messageId: string }
    >({
      query: ({ groupId, messageId }) => ({
        url: `/api/v1/groups/${groupId}/messages/${messageId}`,
        method: "DELETE",
      }),
    }),

    // ── AI endpoints ──────────────────────────────────────────────
    aiChat: builder.mutation<
      { message: string },
      { message: string; history?: Array<{ role: "user" | "assistant"; content: string }> }
    >({
      query: (body) => ({
        url: "/api/v1/ai/chat",
        method: "POST",
        body,
      }),
    }),

    rephraseText: builder.mutation<
      { text: string },
      { text: string; tone: string }
    >({
      query: (body) => ({
        url: "/api/v1/ai/rephrase",
        method: "POST",
        body,
      }),
    }),

    // ── User endpoints ─────────────────────────────────────────────
    searchUsers: builder.query<
      {
        success: boolean;
        totalUsers: number;
        data: Array<{
          _id: string;
          personal_info: {
            fullname: string;
            username: string;
            profile_img: string;
            email: string;
          };
        }>;
      },
      { search: string; perPage?: number; page?: number }
    >({
      query: ({ search, perPage = 10, page = 1 }) => {
        const params = new URLSearchParams();
        params.append("search", search);
        params.append("perPage", String(perPage));
        params.append("page", String(page));
        return `/api/v1/users?${params.toString()}`;
      },
    }),

    // ── Notification endpoints ─────────────────────────────────────
    getNotifications: builder.query<
      {
        success: boolean;
        data: Array<{
          _id: string;
          recipient: string;
          sender: {
            _id: string;
            personal_info: {
              fullname: string;
              username: string;
              profile_img: string;
            };
          };
          type: "group_invitation" | "system" | "mention";
          data: {
            groupId?: { _id: string; name: string; image?: string } | string;
            groupName?: string;
            message?: string;
            messageId?: string;
          };
          status: "pending" | "accepted" | "declined" | "read";
          createdAt: string;
          updatedAt: string;
        }>;
      },
      void
    >({
      query: () => "/api/v1/notifications",
      providesTags: ["Notification"],
    }),

    markNotificationAsRead: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    deleteNotification: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({
        url: `/api/v1/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    respondToGroupInvitation: builder.mutation<
      { success: boolean },
      { groupId: string; notificationId: string; response: "accepted" | "declined" }
    >({
      query: ({ groupId, ...body }) => ({
        url: `/api/v1/groups/${groupId}/respond`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notification", "Group"],
    }),

    // Report endpoints
    createReport: builder.mutation<
      { success: boolean; data: any },
      { questionId: string; description?: string }
    >({
      query: (body) => ({
        url: "/api/v1/reports",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useGoogleLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useGetQuestionStatsQuery,
  useUpdateProfileMutation,
  useRefreshTokenQuery,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useSendPasswordResetOTPMutation,
  useResetPasswordWithOTPMutation,
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetFeedsQuery,
  useGetCbtExamsQuery,
  useGetCbtExamByIdQuery,
  useEnrollCbtExamMutation,
  useGetCbtEnrollmentsQuery,
  useGetMyCbtEnrollmentQuery,
  useStartCbtAttemptMutation,
  useSubmitCbtAttemptMutation,
  useGetCbtSubjectsQuery,
  useGetQuestionsQuery,
  useLazyGetQuestionsQuery,
  useGetQuestionByIdQuery,
  useAddQuestionReplyMutation,
  useDeleteQuestionReplyMutation,
  useGetUploadUrlMutation,
  useGetExamTypesQuery,
  useGetTopicsQuery,
  useGetLeaderboardQuery,
  useGetUserXPSummaryQuery,
  useRecordDailyActivityMutation,
  useGetJoinedGroupsQuery,
  useGetDiscoverGroupsQuery,
  useGetGroupDetailsQuery,
  useGetGroupMembersQuery,
  useGetGroupMessagesQuery,
  useCreateGroupMutation,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useSendGroupMessageMutation,
  useDeleteGroupMessageMutation,
  useAiChatMutation,
  useRephraseTextMutation,
  useLazySearchUsersQuery,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useRespondToGroupInvitationMutation,
  useCreateReportMutation,
} = api;
