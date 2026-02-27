"use client";

import Link from "next/link";
import { Users, Lock, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GroupWithLastMessage } from "@/types/group";
import moment from "moment";

export default function GroupCard({ group }: { group: GroupWithLastMessage }) {
  const initials = group.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/study-groups/${group._id}`}
      className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F5F5F7] dark:hover:bg-white/5"
    >
      <Avatar className="size-12 shrink-0 rounded-xl">
        <AvatarImage src={group.image} alt={group.name} />
        <AvatarFallback className="rounded-xl bg-app-primary/10 text-app-primary text-sm font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold truncate text-foreground">
            {group.name}
          </h3>
          {group.isVerified && (
            <BadgeCheck size={14} className="shrink-0 text-app-primary" />
          )}
          {group.isPrivate && (
            <Lock size={12} className="shrink-0 text-muted-foreground" />
          )}
        </div>

        {group.lastMessage ? (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            <span className="font-medium">{group.lastMessage.senderName}:</span>{" "}
            {group.lastMessage.type !== "text"
              ? `Sent ${group.lastMessage.type}`
              : group.lastMessage.content}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-0.5">No messages yet</p>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        {group.lastMessage && (
          <span className="text-[10px] text-muted-foreground">
            {moment(group.lastMessage.createdAt).fromNow(true)}
          </span>
        )}
        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
          <Users size={10} />
          {group.memberCount}
        </span>
      </div>
    </Link>
  );
}
