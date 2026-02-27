"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useSocket } from "@/components/SocketProvider";
import {
  useGetGroupDetailsQuery,
  useGetGroupMessagesQuery,
  useSendGroupMessageMutation,
} from "@/store/api";
import type { GroupMessage, MessageType } from "@/types/group";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import moment from "moment";

interface ChatRoomProps {
  groupId: string;
}

export default function ChatRoom({ groupId }: ChatRoomProps) {
  const { socket } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [localMessages, setLocalMessages] = useState<GroupMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Map<string, string>>(new Map());
  const [replyTo, setReplyTo] = useState<GroupMessage | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // TODO: Get current user ID from your auth state.
  // For now we read it from a cookie or use a placeholder.
  const currentUserId = useRef("");

  const { data: groupData, isLoading: loadingGroup } =
    useGetGroupDetailsQuery(groupId);
  const {
    data: messagesData,
    isLoading: loadingMessages,
  } = useGetGroupMessagesQuery({ groupId, page, limit: 50 });
  const [sendMessage] = useSendGroupMessageMutation();

  const group = groupData?.data;

  // Sync API messages into local state
  useEffect(() => {
    if (messagesData?.data) {
      if (page === 1) {
        setLocalMessages(messagesData.data);
      } else {
        setLocalMessages((prev) => {
          const existingIds = new Set(prev.map((m) => m._id));
          const newMessages = messagesData.data.filter(
            (m) => !existingIds.has(m._id)
          );
          return [...newMessages, ...prev];
        });
        setLoadingMore(false);
      }
      setHasMore(page < (messagesData.meta?.pages ?? 1));
    }
  }, [messagesData, page]);

  // Auto-scroll to bottom on first load & new messages
  useEffect(() => {
    if (page === 1) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages, page]);

  // Socket.io: join room & listen for real-time events
  useEffect(() => {
    if (!socket || !groupId) return;

    socket.emit("join_group", groupId, (response: { success: boolean }) => {
      if (response?.success) {
        console.log(`Joined group room: ${groupId}`);
      }
    });

    function handleNewMessage(message: GroupMessage) {
      setLocalMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
      // Mark as received
      socket?.emit("message_received", message._id, groupId);
    }

    function handleMessageUpdated(message: GroupMessage) {
      setLocalMessages((prev) =>
        prev.map((m) => (m._id === message._id ? message : m))
      );
    }

    function handleMessageDeleted({ messageId }: { messageId: string }) {
      setLocalMessages((prev) => prev.filter((m) => m._id !== messageId));
    }

    function handleUserTyping(data: { userId: string; name: string }) {
      if (data.userId === currentUserId.current) return;
      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.set(data.userId, data.name);
        return next;
      });
    }

    function handleStopTyping(data: { userId: string }) {
      setTypingUsers((prev) => {
        const next = new Map(prev);
        next.delete(data.userId);
        return next;
      });
    }

    socket.on("new_message", handleNewMessage);
    socket.on("message_updated", handleMessageUpdated);
    socket.on("message_deleted", handleMessageDeleted);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleStopTyping);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.off("message_updated", handleMessageUpdated);
      socket.off("message_deleted", handleMessageDeleted);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleStopTyping);
      socket.emit("leave_group", groupId);
    };
  }, [socket, groupId]);

  // Infinite scroll up to load older messages
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el || loadingMore || !hasMore) return;
    if (el.scrollTop < 80) {
      setLoadingMore(true);
      setPage((p) => p + 1);
    }
  }, [loadingMore, hasMore]);

  // Send handler
  async function handleSend(content: string, replyToId?: string, type?: MessageType, mediaUrl?: string) {
    try {
      await sendMessage({ groupId, content, type, replyToId, mediaUrl }).unwrap();
    } catch {
      // Error handled by RTK Query
    }
  }

  function handleTyping() {
    socket?.emit("typing", groupId);
  }

  function handleStopTyping() {
    socket?.emit("stop_typing", groupId);
  }

  // Group messages by date for date separators
  function getDateLabel(dateStr: string) {
    const date = moment(dateStr);
    if (date.isSame(moment(), "day")) return "Today";
    if (date.isSame(moment().subtract(1, "day"), "day")) return "Yesterday";
    return date.format("MMM D, YYYY");
  }

  // Check if we should show avatar (first message from a user in a consecutive sequence)
  function shouldShowAvatar(messages: GroupMessage[], index: number) {
    if (index === 0) return true;
    const prev = messages[index - 1];
    const curr = messages[index];
    if (!prev || !curr) return true;
    if (prev.sender?._id !== curr.sender?._id) return true;
    // Show avatar if gap > 5 minutes
    return moment(curr.createdAt).diff(moment(prev.createdAt), "minutes") > 5;
  }

  // Check if this is the last message in a consecutive group from same sender
  function isLastInGroup(messages: GroupMessage[], index: number) {
    if (index === messages.length - 1) return true;
    const curr = messages[index];
    const next = messages[index + 1];
    if (!curr || !next) return true;
    if (curr.sender?._id !== next.sender?._id) return true;
    return moment(next.createdAt).diff(moment(curr.createdAt), "minutes") > 5;
  }

  if (loadingGroup) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="size-6 animate-spin text-app-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Group not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      <ChatHeader
        group={group}
        typingUsers={Array.from(typingUsers.values())}
      />

      {/* Messages area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
      >
        {loadingMore && (
          <div className="flex justify-center py-2">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {loadingMessages && page === 1 ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="size-6 animate-spin text-app-primary" />
          </div>
        ) : localMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg font-semibold">Welcome to {group.name}!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start the conversation by sending a message.
            </p>
          </div>
        ) : (
          <>
            {localMessages.map((msg, i) => {
              const showDate =
                i === 0 ||
                getDateLabel(msg.createdAt) !==
                  getDateLabel(localMessages[i - 1]!.createdAt);

              return (
                <div key={msg._id}>
                  {showDate && (
                    <div className="flex items-center justify-center my-4">
                      <span className="text-[11px] text-muted-foreground bg-[#F5F5F7] dark:bg-white/10 px-3 py-1 rounded-full">
                        {getDateLabel(msg.createdAt)}
                      </span>
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    isOwn={msg.sender?._id === currentUserId.current}
                    showAvatar={shouldShowAvatar(localMessages, i)}
                    isLastInGroup={isLastInGroup(localMessages, i)}
                    onReply={setReplyTo}
                  />
                </div>
              );
            })}
          </>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        groupId={groupId}
      />
    </div>
  );
}
