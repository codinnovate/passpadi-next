"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useGetLeaderboardQuery } from "@/store/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpDown, Trophy, Medal } from "lucide-react";
import LeaderboardPodium from "./LeaderboardPodium";

const periods = [
  { value: "all", label: "All Time" },
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
] as const;

interface RankEntry {
  _id: string;
  rank?: number;
  user?: { name?: string; username?: string; profile_img?: string };
  score: number;
  streak?: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex items-center justify-center size-7 rounded-full bg-yellow-500/15">
        <Trophy className="size-3.5 text-yellow-500" />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex items-center justify-center size-7 rounded-full bg-gray-400/15">
        <Medal className="size-3.5 text-gray-400" />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex items-center justify-center size-7 rounded-full bg-amber-600/15">
        <Medal className="size-3.5 text-amber-600" />
      </div>
    );
  return (
    <span className="flex items-center justify-center size-7 text-sm font-semibold text-muted-foreground">
      {rank}
    </span>
  );
}

export default function LeaderboardTable() {
  const [period, setPeriod] = useState("all");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading, isError } = useGetLeaderboardQuery({ period });

  const rankings: RankEntry[] = data?.data ?? data?.leaderboard ?? [];
  const top3 = rankings.slice(0, 3);
  const rest = rankings.slice(3);

  const scoreLabel = period === "all" ? "Streak" : "XP";
  const scoreUnit = period === "all" ? "days" : "XP";

  const columns = useMemo<ColumnDef<RankEntry>[]>(
    () => [
      {
        accessorKey: "rank",
        header: () => <span className="pl-1">#</span>,
        cell: ({ row }) => {
          const rank = row.original.rank ?? row.index + 4;
          return <RankBadge rank={rank} />;
        },
        size: 60,
        enableSorting: false,
      },
      {
        id: "student",
        header: "Student",
        cell: ({ row }) => {
          const entry = row.original;
          const name =
            entry.user?.name ?? entry.user?.username ?? "Student";
          const initials = getInitials(name);

          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                {entry.user?.profile_img && (
                  <AvatarImage src={entry.user.profile_img} alt={name} />
                )}
                <AvatarFallback className="text-xs font-medium bg-app-primary/10 text-app-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="font-medium text-sm truncate">{name}</span>
                {entry.user?.username && (
                  <span className="text-xs text-muted-foreground truncate">
                    @{entry.user.username}
                  </span>
                )}
              </div>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "score",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1.5 text-right ml-auto font-medium hover:text-foreground transition-colors"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {scoreLabel}
            <ArrowUpDown className="size-3.5" />
          </button>
        ),
        cell: ({ row }) => {
          const entry = row.original;
          return (
            <div className="text-right">
              <span className="font-semibold tabular-nums">
                {entry.score.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                {scoreUnit}
              </span>
            </div>
          );
        },
        size: 120,
      },
    ],
    [scoreLabel, scoreUnit]
  );

  const table = useReactTable({
    data: rest,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Period filter */}
      <div className="flex justify-center">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList>
            {periods.map((p) => (
              <TabsTrigger key={p.value} value={p.value}>
                {p.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col gap-6">
          {/* Podium skeleton */}
          <div className="flex items-end justify-center gap-4 py-8">
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="size-16 rounded-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-20 w-28 rounded-t-xl" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="size-20 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-28 w-32 rounded-t-xl" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="size-14 rounded-full" />
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-16 w-24 rounded-t-xl" />
            </div>
          </div>
          {/* Table skeleton */}
          <div className="rounded-xl border">
            <div className="p-3 space-y-0">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 py-3 border-b last:border-0"
                >
                  <Skeleton className="size-7 rounded-full" />
                  <Skeleton className="size-9 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : isError ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Unable to load leaderboard. Please try again later.
          </p>
        </div>
      ) : rankings.length === 0 ? (
        <p className="text-center text-muted-foreground py-10">
          No rankings available yet. Start a CBT practice to appear here!
        </p>
      ) : (
        <>
          {/* Podium for top 3 */}
          <LeaderboardPodium entries={top3} />

          {/* Table for rank 4+ */}
          {rest.length > 0 && (
            <div className="rounded-xl border bg-card">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="hover:bg-transparent">
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="text-xs uppercase tracking-wider text-muted-foreground"
                          style={{
                            width: header.column.getSize()
                              ? `${header.column.getSize()}px`
                              : undefined,
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className="group transition-colors"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="py-3">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-muted-foreground"
                      >
                        No more entries.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
