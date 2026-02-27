"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  useGetJoinedGroupsQuery,
  useGetDiscoverGroupsQuery,
} from "@/store/api";
import GroupCard from "@/components/study-groups/GroupCard";
import DiscoverGroupCard from "@/components/study-groups/DiscoverGroupCard";
import { Skeleton } from "@/components/ui/skeleton";

function GroupSkeleton() {
  return (
    <div className="flex items-center gap-3 px-3 py-3">
      <Skeleton className="size-12 rounded-xl shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}

export default function StudyGroupsPreview() {
  const {
    data: joinedData,
    isLoading: joinedLoading,
    isError: joinedError,
  } = useGetJoinedGroupsQuery();

  const joinedGroups = joinedData?.data ?? [];
  const showDiscover = !joinedLoading && !joinedError && joinedGroups.length === 0;

  const { data: discoverData, isLoading: discoverLoading } =
    useGetDiscoverGroupsQuery(
      { limit: 3 },
      { skip: !showDiscover }
    );

  const discoverGroups = discoverData?.data ?? [];
  const isLoading = joinedLoading || (showDiscover && discoverLoading);
  const hasJoined = joinedGroups.length > 0;

  if (joinedError) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {hasJoined ? "Your Study Groups" : "Discover Study Groups"}
        </h2>
        <Link
          href="/study-groups"
          className="flex items-center gap-1 text-xs font-medium text-app-primary hover:underline"
        >
          See all <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <GroupSkeleton key={i} />
          ))}
        </div>
      ) : hasJoined ? (
        <div className="flex flex-col gap-1 rounded-xl border bg-card">
          {joinedGroups.slice(0, 3).map((group) => (
            <GroupCard key={group._id} group={group} />
          ))}
        </div>
      ) : discoverGroups.length > 0 ? (
        <div className="flex flex-col gap-3">
          {discoverGroups.slice(0, 3).map((group) => (
            <DiscoverGroupCard key={group._id} group={group} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No study groups available yet.
        </p>
      )}
    </section>
  );
}
