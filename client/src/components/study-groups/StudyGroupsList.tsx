"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetJoinedGroupsQuery, useGetDiscoverGroupsQuery } from "@/store/api";
import GroupCard from "./GroupCard";
import DiscoverGroupCard from "./DiscoverGroupCard";
import CreateGroupSheet from "./CreateGroupSheet";

export default function StudyGroupsList() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: joinedData,
    isLoading: loadingJoined,
    isError: joinedError,
  } = useGetJoinedGroupsQuery();

  const {
    data: discoverData,
    isLoading: loadingDiscover,
  } = useGetDiscoverGroupsQuery({ search: searchQuery, limit: 20 });

  const joinedGroups = joinedData?.data ?? [];
  const discoverGroups = discoverData?.data ?? [];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Study Groups</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Learn together, grow together
          </p>
        </div>
        <CreateGroupSheet />
      </div>

      <Tabs defaultValue="my-groups" className="w-full">
        <TabsList className="w-full max-w-xs bg-[#F5F5F7] dark:bg-white/10 rounded-xl">
          <TabsTrigger value="my-groups" className="flex-1 rounded-lg text-xs">
            My Groups
          </TabsTrigger>
          <TabsTrigger value="discover" className="flex-1 rounded-lg text-xs">
            Discover
          </TabsTrigger>
        </TabsList>

        {/* My Groups Tab */}
        <TabsContent value="my-groups" className="mt-4">
          {loadingJoined ? (
            <GroupListSkeleton />
          ) : joinedError ? (
            <EmptyState
              title="Sign in to see your groups"
              description="Log in to join study groups and start collaborating with others."
            />
          ) : joinedGroups.length === 0 ? (
            <EmptyState
              title="No groups yet"
              description="Create a new study group or discover existing ones to get started."
            />
          ) : (
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-white/5">
              {joinedGroups.map((group) => (
                <GroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Discover Tab */}
        <TabsContent value="discover" className="mt-4 space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search size={16} />
            </span>
            <Input
              placeholder="Search study groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 bg-[#F5F5F7] dark:bg-white/10 border-none rounded-xl text-sm"
            />
          </div>

          {loadingDiscover ? (
            <GroupListSkeleton />
          ) : discoverGroups.length === 0 ? (
            <EmptyState
              title="No groups found"
              description={
                searchQuery
                  ? "Try different search terms."
                  : "Be the first to create a study group!"
              }
            />
          ) : (
            <div className="flex flex-col gap-3">
              {discoverGroups.map((group) => (
                <DiscoverGroupCard key={group._id} group={group} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function GroupListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-3">
          <Skeleton className="size-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="size-16 rounded-2xl bg-app-primary/10 flex items-center justify-center mb-4">
        <Users size={28} className="text-app-primary" />
      </div>
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">{description}</p>
    </div>
  );
}
