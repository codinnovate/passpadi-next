"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GroupMessage } from "@/types/group";
import moment from "moment";

interface MessageBubbleProps {
  message: GroupMessage;
  isOwn: boolean;
  showAvatar: boolean;
  isLastInGroup: boolean;
  onReply: (message: GroupMessage) => void;
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar,
  isLastInGroup,
  onReply,
}: MessageBubbleProps) {
  const sender = message.sender;
  const initials = (sender?.personal_info?.fullname ?? "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const type = message.type || "text";

  // Bubble corner rounding logic:
  // Own messages: right side flat for consecutive, tail (rounded) on last
  // Other messages: left side flat for consecutive, tail (rounded) on last
  const bubbleRadius = isOwn
    ? isLastInGroup
      ? "rounded-2xl rounded-br-sm"
      : "rounded-2xl rounded-r-sm"
    : isLastInGroup
      ? "rounded-2xl rounded-bl-sm"
      : "rounded-2xl rounded-l-sm";

  const bubbleColor = isOwn
    ? "bg-app-primary text-white"
    : "bg-[#E9E9EB] dark:bg-white/15 text-foreground";

  const timeColor = isOwn ? "text-white/60" : "text-muted-foreground";

  const timestamp = moment(message.createdAt).format("h:mm A");

  return (
    <div
      className={`flex gap-1.5 group ${isOwn ? "flex-row-reverse" : "flex-row"} ${showAvatar ? "mt-2" : "mt-0.5"}`}
    >
      {/* Avatar spacer / avatar */}
      {!isOwn && (
        <div className="w-7 shrink-0 self-end">
          {showAvatar && isLastInGroup && (
            <Avatar className="size-7">
              <AvatarImage
                src={sender?.personal_info?.profile_img}
                alt={sender?.personal_info?.fullname}
              />
              <AvatarFallback className="text-[9px] bg-app-primary/10 text-app-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      )}

      {/* Bubble column */}
      <div
        className={`flex flex-col max-w-[75%] ${isOwn ? "items-end" : "items-start"}`}
      >
        {/* Sender name — only first message in a group */}
        {showAvatar && !isOwn && (
          <p className="text-[11px] font-medium text-app-primary mb-0.5 ml-2">
            {sender?.personal_info?.fullname}
          </p>
        )}

        {/* Reply preview — inside the bubble area */}
        {message.replyTo && (
          <div
            className={`text-[11px] px-3 py-1.5 rounded-t-xl border-l-2 border-app-primary/60 ${
              isOwn
                ? "bg-white/10 text-white/80"
                : "bg-app-primary/5 dark:bg-app-primary/10"
            } ${isOwn ? "self-end" : "self-start"} w-full`}
          >
            <span className={`font-semibold ${isOwn ? "text-white/90" : "text-app-primary"}`}>
              {message.replyTo.sender?.personal_info?.fullname}
            </span>
            <p className={`truncate ${isOwn ? "text-white/60" : "text-muted-foreground"}`}>
              {message.replyTo.content}
            </p>
          </div>
        )}

        {/* Main bubble */}
        <div
          className={`relative ${bubbleRadius} ${bubbleColor} ${
            message.replyTo ? "rounded-t-none" : ""
          } overflow-hidden`}
        >
          {/* Image content */}
          {type === "image" && message.mediaUrl && (
            <div className="p-1">
              <img
                src={message.mediaUrl}
                alt="Shared image"
                className="rounded-xl max-w-[280px] w-full object-cover cursor-pointer"
                loading="lazy"
                onClick={() => window.open(message.mediaUrl, "_blank")}
              />
              {message.content && (
                <p className="whitespace-pre-wrap break-words text-sm px-2 pt-1.5">
                  {message.content}
                </p>
              )}
              <div className="flex justify-end px-2 pb-1">
                <span className={`text-[10px] ${timeColor}`}>{timestamp}</span>
              </div>
            </div>
          )}

          {/* Audio content */}
          {type === "audio" && message.mediaUrl && (
            <div className="px-3 py-2 min-w-[220px]">
              <audio
                controls
                preload="metadata"
                className="w-full h-8 [&::-webkit-media-controls-panel]:bg-transparent"
                style={{ maxWidth: 280 }}
              >
                <source src={message.mediaUrl} />
              </audio>
              {message.content && (
                <p className="whitespace-pre-wrap break-words text-sm mt-1">
                  {message.content}
                </p>
              )}
              <div className="flex justify-end mt-0.5">
                <span className={`text-[10px] ${timeColor}`}>{timestamp}</span>
              </div>
            </div>
          )}

          {/* Text content (default / fallback) */}
          {!(type === "image" && message.mediaUrl) && !(type === "audio" && message.mediaUrl) && (
            <div className="px-3 py-1.5">
              <span className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                {message.content}
              </span>
              <span
                className={`text-[10px] ${timeColor} ml-2 inline-block align-bottom translate-y-[1px] whitespace-nowrap`}
              >
                {timestamp}
              </span>
            </div>
          )}
        </div>

        {/* Reply button on hover */}
        <button
          onClick={() => onReply(message)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[11px] text-muted-foreground hover:text-app-primary mt-0.5 ml-2"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
