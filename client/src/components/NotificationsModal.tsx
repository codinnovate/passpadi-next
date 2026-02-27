"use client";

import { useEffect } from "react";
import Link from "next/link";
import moment from "moment";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Notification,
  TickCircle,
  People,
  Message2,
  InfoCircle,
} from "iconsax-reactjs";
import {
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useRespondToGroupInvitationMutation,
} from "@/store/api";
import { useSocket } from "@/components/SocketProvider";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

type BackendNotification = {
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
};

const typeConfig: Record<
  BackendNotification["type"],
  { icon: (size: number) => React.ReactNode; color: string; bg: string }
> = {
  group_invitation: {
    icon: (size) => <People size={size} variant="Bold" />,
    color: "text-purple",
    bg: "bg-purple-50 dark:bg-purple/10",
  },
  mention: {
    icon: (size) => <Message2 size={size} variant="Bold" />,
    color: "text-app-primary",
    bg: "bg-blue-50 dark:bg-app-primary/10",
  },
  system: {
    icon: (size) => <InfoCircle size={size} variant="Bold" />,
    color: "text-gray-500",
    bg: "bg-gray-100 dark:bg-white/10",
  },
};

function getNotificationLink(n: BackendNotification): string | undefined {
  if (n.type === "group_invitation" || n.type === "mention") {
    const groupId =
      typeof n.data.groupId === "object" ? n.data.groupId?._id : n.data.groupId;
    if (groupId) return `/study-groups/${groupId}`;
  }
  return undefined;
}

function isUnread(n: BackendNotification) {
  return n.status === "pending";
}

interface NotificationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsModal = ({ open, onOpenChange }: NotificationsModalProps) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { socket } = useSocket();

  const { data, refetch } = useGetNotificationsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [respondToInvitation, { isLoading: isResponding }] =
    useRespondToGroupInvitationMutation();

  const notifications: BackendNotification[] = data?.data ?? [];
  const unreadCount = notifications.filter(isUnread).length;

  // Listen for real-time notifications
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      refetch();
    };

    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket, refetch]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch {
      // handled by RTK Query
    }
  };

  const handleInvitationResponse = async (
    notification: BackendNotification,
    response: "accepted" | "declined"
  ) => {
    const groupId =
      typeof notification.data.groupId === "object"
        ? notification.data.groupId?._id
        : notification.data.groupId;
    if (!groupId) return;

    try {
      await respondToInvitation({
        groupId,
        notificationId: notification._id,
        response,
      });
    } catch {
      // handled by RTK Query
    }
  };

  const getSenderInfo = (n: BackendNotification) => {
    const fullname = n.sender?.personal_info?.fullname || "Someone";
    const avatar = n.sender?.personal_info?.profile_img;
    const initials = fullname
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return { fullname, avatar, initials };
  };

  const getNotificationText = (n: BackendNotification): string => {
    switch (n.type) {
      case "group_invitation":
        return n.data.message || `invited you to join ${n.data.groupName || "a group"}`;
      case "mention":
        return `mentioned you in ${n.data.groupName || "a group"}`;
      case "system":
        return n.data.message || "System notification";
      default:
        return n.data.message || "";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-[400px] p-0 flex flex-col gap-0"
      >
        {/* Header */}
        <SheetHeader className="border-b border-gray-100 dark:border-white/10 p-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle className="text-lg font-semibold">
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-app-primary text-white text-xs font-semibold">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() =>
                  notifications
                    .filter(isUnread)
                    .forEach((n) => handleMarkAsRead(n._id))
                }
                className="flex items-center gap-1.5 text-xs font-medium text-app-primary hover:text-app-primary/80 transition-colors"
              >
                <TickCircle size={14} variant="Bold" />
                Mark all read
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 mb-4">
                <Notification
                  size={28}
                  variant="Bulk"
                  className="text-gray-400"
                />
              </div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                No notifications yet
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                When you get notifications, they&apos;ll show up here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {notifications.map((notification) => {
                const config = typeConfig[notification.type];
                const sender = getSenderInfo(notification);
                const link = getNotificationLink(notification);
                const unread = isUnread(notification);
                const isInvitation =
                  notification.type === "group_invitation" &&
                  notification.status === "pending";

                const Content = (
                  <div
                    className={`flex items-start gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer ${
                      unread
                        ? "bg-app-primary/[0.03] dark:bg-app-primary/[0.05]"
                        : ""
                    }`}
                    onClick={() => {
                      if (unread && !isInvitation) handleMarkAsRead(notification._id);
                    }}
                  >
                    {/* Avatar with type badge */}
                    <div className="relative shrink-0">
                      <Avatar className="size-10">
                        <AvatarImage
                          src={
                            sender.avatar ||
                            `https://api.dicebear.com/9.x/initials/svg?seed=${sender.initials}`
                          }
                          alt={sender.fullname}
                        />
                        <AvatarFallback className="bg-app-primary text-xs text-white">
                          {sender.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center w-5 h-5 rounded-full ${config.bg} ${config.color} ring-2 ring-white dark:ring-gray-950`}
                      >
                        {config.icon(16)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">
                        <span className="font-semibold text-app-secondary dark:text-white">
                          {sender.fullname}
                        </span>{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {getNotificationText(notification)}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {moment(notification.createdAt).fromNow()}
                      </p>

                      {/* Invitation actions */}
                      {isInvitation && (
                        <div className="flex items-center gap-2 mt-2.5">
                          <button
                            disabled={isResponding}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleInvitationResponse(notification, "accepted");
                            }}
                            className="rounded-lg bg-app-primary px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-app-primary/90 disabled:opacity-50"
                          >
                            Accept
                          </button>
                          <button
                            disabled={isResponding}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleInvitationResponse(notification, "declined");
                            }}
                            className="rounded-lg bg-gray-100 px-4 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-white/10 dark:text-gray-300 dark:hover:bg-white/15 disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </div>
                      )}

                      {/* Show accepted/declined status */}
                      {notification.type === "group_invitation" &&
                        notification.status !== "pending" &&
                        notification.status !== "read" && (
                          <p className="text-xs mt-1.5 font-medium capitalize text-gray-400">
                            {notification.status}
                          </p>
                        )}
                    </div>

                    {/* Unread dot */}
                    {unread && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-app-primary" />
                    )}
                  </div>
                );

                return link && !isInvitation ? (
                  <Link
                    key={notification._id}
                    href={link}
                    onClick={() => onOpenChange(false)}
                    className="block hover:no-underline hover:!text-inherit"
                  >
                    {Content}
                  </Link>
                ) : (
                  <div key={notification._id}>{Content}</div>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsModal;
