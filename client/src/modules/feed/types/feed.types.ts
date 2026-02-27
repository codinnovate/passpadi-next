export type PostType = "general" | "normal" | "question" | "marketplace" | "job";

export interface PostUser {
  _id: string;
  name?: string;
  username?: string;
  avatar?: string;
  personal_info?: {
    fullname?: string;
    username?: string;
    profile_img?: string;
  };
}

export interface Reply {
  _id: string;
  user: PostUser;
  content: string;
  image?: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  _id: string;
  user: PostUser;
  content: string;
  image?: string;
  postType: PostType;
  likes: string[];
  bookmarks: string[];
  replies: Reply[];
  // Marketplace-specific
  price?: number;
  currency?: string;
  // Job-specific
  company?: string;
  location?: string;
  jobUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Backend returns just { success, data } with no pagination metadata
export interface FeedResponse {
  success: boolean;
  data: Post[];
}

export interface SinglePostResponse {
  success: boolean;
  data: Post;
}

// Query params
export interface FeedQueryParams {
  page?: number;
  limit?: number;
  postType?: PostType;
}

// Mutation payloads
export interface CreatePostPayload {
  content: string;
  image?: string;
  postType: PostType;
  price?: number;
  currency?: string;
  company?: string;
  location?: string;
  jobUrl?: string;
}

export interface CreateReplyPayload {
  postId: string;
  content: string;
  image?: string;
}

export interface ReportPostPayload {
  postId: string;
  reason: string;
}
