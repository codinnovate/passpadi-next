"use client";

import { Users, Lock, BadgeCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useJoinGroupMutation } from "@/store/api";
import type { Group } from "@/types/group";

export default function DiscoverGroupCard({ group }: { group: Group }) {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();

  const initials = group.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/10 p-3">
      <Avatar className="size-12 shrink-0 rounded-xl">
        <AvatarImage src={group.image} alt={group.name} />
        <AvatarFallback className="rounded-xl bg-app-primary/10 text-app-primary text-sm font-semibold">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-semibold truncate">{group.name}</h3>
          {group.isVerified && (
            <BadgeCheck size={14} className="shrink-0 text-app-primary" />
          )}
          {group.isPrivate && (
            <Lock size={12} className="shrink-0 text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {group.description}
        </p>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
          <Users size={11} />
          {group.memberCount} members
        </span>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="shrink-0 rounded-full text-xs h-8 px-4 border-app-primary text-app-primary hover:bg-app-primary hover:text-white"
        onClick={() => joinGroup(group._id)}
        disabled={isLoading}
      >
        {isLoading ? "Joining..." : "Join"}
      </Button>
    </div>
  );
}
