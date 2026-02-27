export interface GroupMember {
  _id: string;
  personal_info: {
    fullname: string;
    profile_img?: string;
    username?: string;
  };
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  image?: string;
  coverImage?: string;
  creator: GroupMember;
  admins: GroupMember[];
  members: GroupMember[];
  invitedMembers: string[];
  isPrivate: boolean;
  isVerified: boolean;
  memberCount: number;
  tags: string[];
  category: string;
  lastActivityAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupWithLastMessage extends Group {
  lastMessage: {
    content: string;
    type: MessageType;
    senderName: string;
    createdAt: string;
  } | null;
}

export type MessageType = "text" | "image" | "audio" | "video" | "file";

export interface ReplyTo {
  _id: string;
  content: string;
  type: MessageType;
  sender: {
    _id: string;
    personal_info: {
      fullname: string;
    };
  };
}

export interface GroupMessage {
  _id: string;
  group: string;
  sender: GroupMember;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  replyTo?: ReplyTo;
  deliveredTo: string[];
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GroupMessagesResponse {
  success: boolean;
  data: GroupMessage[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface GroupMembersResponse {
  members: GroupMember[];
  pendingMembers: GroupMember[];
  meta: {
    total: number;
    page: number;
    pages: number;
  };
}
