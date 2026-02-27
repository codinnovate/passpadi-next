"use client";

import { useState } from "react";
import { useGetBlogsQuery } from "@/store/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Eye, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogItem {
  _id: string;
  blog_id?: string;
  title: string;
  banner?: string;
  des?: string;
  tags?: string[];
  author?: {
    personal_info?: {
      fullname?: string;
      username?: string;
      profile_img?: string;
    };
  };
  activity?: {
    total_reads?: number;
    total_likes?: number;
  };
  publishedAt?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function blogHref(blog: BlogItem) {
  return `/blog/${blog.blog_id || blog._id}`;
}

/* ── Hero / Featured Article ─────────────────────────────────── */
function HeroArticle({ blog }: { blog: BlogItem }) {
  return (
    <Link href={blogHref(blog)} className="group block">
      <div className="relative w-full aspect-[16/7] md:aspect-[16/6] rounded-2xl overflow-hidden">
        {blog.banner ? (
          <Image
            src={blog.banner}
            alt={blog.title}
            fill
            priority
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {blog.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight line-clamp-3 max-w-2xl">
            {blog.title}
          </h2>
          {blog.des && (
            <p className="text-sm md:text-base text-white/80 mt-2 line-clamp-2 max-w-xl">
              {blog.des}
            </p>
          )}
          <div className="flex items-center gap-3 mt-4">
            {blog.author?.personal_info?.profile_img && (
              <Image
                src={blog.author.personal_info.profile_img}
                alt=""
                width={32}
                height={32}
                className="rounded-full border-2 border-white/30"
              />
            )}
            <div className="flex items-center gap-2 text-sm text-white/70">
              {blog.author?.personal_info?.username && (
                <span className="flex items-center gap-1 font-medium text-white">
                  @{blog.author.personal_info.username}
                  <BadgeCheck size={14} className="text-blue-400" />
                </span>
              )}
              {blog.publishedAt && (
                <>
                  <span className="text-white/40">·</span>
                  <span>{formatDate(blog.publishedAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── Large Card (Popular section left) ───────────────────────── */
function LargeArticleCard({ blog }: { blog: BlogItem }) {
  return (
    <Link href={blogHref(blog)} className="group block">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden">
        {blog.banner ? (
          <Image
            src={blog.banner}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
      </div>
      <div className="mt-3">
        <h3 className="font-semibold text-lg leading-snug line-clamp-2 group-hover:text-app-primary transition-colors">
          {blog.title}
        </h3>
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Horizontal Row Card (Popular section right) ─────────────── */
function RowArticleCard({ blog }: { blog: BlogItem }) {
  return (
    <Link
      href={blogHref(blog)}
      className="group flex gap-4 items-start py-4 border-b border-gray-100 dark:border-white/10 last:border-0"
    >
      {blog.banner && (
        <div className="relative w-24 h-20 md:w-28 md:h-22 shrink-0 rounded-lg overflow-hidden">
          <Image
            src={blog.banner}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm md:text-base leading-snug line-clamp-2 group-hover:text-app-primary transition-colors">
          {blog.title}
        </h4>
        {blog.des && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {blog.des}
          </p>
        )}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {blog.tags.slice(0, 1).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Grid Card (All Articles section) ────────────────────────── */
function GridArticleCard({ blog }: { blog: BlogItem }) {
  return (
    <Link href={blogHref(blog)} className="group block">
      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden">
        {blog.banner ? (
          <Image
            src={blog.banner}
            alt={blog.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800" />
        )}
      </div>
      <div className="mt-3">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-1.5">
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-app-primary transition-colors">
          {blog.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          {blog.author?.personal_info?.username && (
            <span className="flex items-center gap-1">
              @{blog.author.personal_info.username}
              <BadgeCheck size={12} className="text-blue-500" />
            </span>
          )}
          {blog.publishedAt && (
            <>
              <span>·</span>
              <span>{formatDate(blog.publishedAt)}</span>
            </>
          )}
        </div>
        {blog.activity && (
          <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground">
            <Eye size={12} />
            <span>{blog.activity.total_reads ?? 0} reads</span>
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Loading Skeletons ───────────────────────────────────────── */
function HeroSkeleton() {
  return <Skeleton className="w-full aspect-[16/7] md:aspect-[16/6] rounded-2xl" />;
}

function GridSkeleton() {
  return (
    <div>
      <Skeleton className="w-full aspect-[16/10] rounded-xl" />
      <Skeleton className="h-4 w-3/4 mt-3" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────────── */
export default function BlogListClient() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetBlogsQuery({ page, limit: 12 });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-10">
        <HeroSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <GridSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">
          Unable to load articles. Please try again later.
        </p>
      </div>
    );
  }

  const blogs: BlogItem[] = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-muted-foreground">
          No articles published yet. Check back soon!
        </p>
      </div>
    );
  }

  const [hero, ...rest] = blogs;
  const popularLeft = rest[0];
  const popularRight = rest.slice(1, 4);
  const allArticles = rest.slice(4);

  return (
    <div className="flex flex-col gap-12">
      {/* ── Hero Featured Article ──────────────────────────────── */}
      <HeroArticle blog={hero!} />

      {/* ── Popular Articles ───────────────────────────────────── */}
      {rest.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Articles</h2>
            {totalPages > 1 && (
              <Link
                href="#all-articles"
                className="flex items-center gap-1 text-sm font-medium text-app-primary hover:underline"
              >
                View all <ArrowRight size={14} />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: large card */}
            {popularLeft && (
              <LargeArticleCard blog={popularLeft} />
            )}

            {/* Right: stacked row cards */}
            {popularRight.length > 0 && (
              <div className="flex flex-col">
                {popularRight.map((blog) => (
                  <RowArticleCard key={blog._id} blog={blog} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── All Articles Grid ──────────────────────────────────── */}
      {allArticles.length > 0 && (
        <section id="all-articles">
          <h2 className="text-2xl font-bold mb-6">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
            {allArticles.map((blog) => (
              <GridArticleCard key={blog._id} blog={blog} />
            ))}
          </div>
        </section>
      )}

      {/* ── Pagination ─────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
