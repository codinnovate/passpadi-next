"use client";

import Link from "next/link";
import { ArrowLeft, Users, Info } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Group } from "@/types/group";

interface ChatHeaderProps {
  group: Group;
  onlineCount?: number;
  typingUsers: string[];
}

export default function ChatHeader({
  group,
  typingUsers,
}: ChatHeaderProps) {
  const initials = group.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const typingText =
    typingUsers.length > 0
      ? typingUsers.length === 1
        ? `${typingUsers[0]} is typing...`
        : `${typingUsers.slice(0, 2).join(", ")} are typing...`
      : null;

  return (
    <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-3">
      <Link
        href="/study-groups"
        className="shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-[#F5F5F7] dark:hover:bg-white/10 transition-colors md:hidden"
      >
        <ArrowLeft size={20} />
      </Link>

      <Link
        href="/study-groups"
        className="hidden md:block shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-[#F5F5F7] dark:hover:bg-white/10 transition-colors"
      >
        <ArrowLeft size={20} />
      </Link>

      <Avatar className="size-10 rounded-xl">
        <AvatarImage src={group.image} alt={group.name} />
        <AvatarFallback className="rounded-xl bg-app-primary/10 text-app-primary text-xs font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold truncate">{group.name}</h2>
        {typingText ? (
          <p className="text-[11px] text-app-primary animate-pulse truncate">
            {typingText}
          </p>
        ) : (
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Users size={11} />
            {group.memberCount} members
          </p>
        )}
      </div>

      <button className="shrink-0 rounded-lg p-2 text-muted-foreground hover:bg-[#F5F5F7] dark:hover:bg-white/10 transition-colors">
        <Info size={18} />
      </button>
    </div>
  );
}
