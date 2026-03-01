"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { useGetBlogsQuery } from "@/store/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogItem {
  _id: string;
  blog_id?: string;
  title: string;
  banner?: string;
  tags?: string[];
  author?: {
    personal_info?: {
      fullname?: string;
      username?: string;
      profile_img?: string;
    };
  };
  publishedAt?: string;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
  });
}

function blogHref(blog: BlogItem) {
  return `/blog/${blog.blog_id || blog._id}`;
}

function BlogCardSkeleton() {
  return (
    <div>
      <Skeleton className="w-full aspect-[16/10] rounded-xl" />
      <Skeleton className="h-4 w-3/4 mt-3" />
      <Skeleton className="h-4 w-1/2 mt-2" />
    </div>
  );
}

export default function LatestBlogArticles() {
  const { data, isLoading, isError } = useGetBlogsQuery({
    page: 1,
    limit: 3,
  });

  if (isError) return null;

  const blogs: BlogItem[] = data?.data ?? [];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Latest Articles</h2>
        <Link
          href="/dashboard/blog"
          className="flex items-center gap-1 text-xs font-medium text-app-primary hover:underline"
        >
          See all <ArrowRight size={14} />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">
          No articles published yet. Check back soon!
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={blogHref(blog)}
              className="group block"
            >
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
                  <Badge
                    variant="outline"
                    className="text-[10px] font-normal mb-1.5"
                  >
                    {blog.tags[0]}
                  </Badge>
                )}
                <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-app-primary transition-colors">
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
