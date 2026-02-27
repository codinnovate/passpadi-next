"use client";

import { useGetBlogByIdQuery } from "@/store/api";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BadgeCheck, Eye, Heart, Clock, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BlogDetail {
  _id: string;
  blog_id?: string;
  title: string;
  banner?: string;
  des?: string;
  content: any[];
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
    total_comments?: number;
  };
  publishedAt?: string;
}

function estimateReadTime(content: any[]): number {
  if (!content || content.length === 0) return 1;
  let wordCount = 0;
  for (const block of content) {
    if (typeof block === "string") {
      wordCount += block.split(/\s+/).length;
    } else if (block.data?.text) {
      wordCount += block.data.text.replace(/<[^>]*>/g, "").split(/\s+/).length;
    } else if (block.data?.items) {
      for (const item of block.data.items) {
        wordCount += item.replace(/<[^>]*>/g, "").split(/\s+/).length;
      }
    }
  }
  return Math.max(1, Math.ceil(wordCount / 200));
}

function renderContent(content: any[]) {
  if (!content || content.length === 0) return null;

  return content.map((block: any, index: number) => {
    if (typeof block === "string") {
      return (
        <div
          key={index}
          className="prose prose-gray dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: block }}
        />
      );
    }

    switch (block.type) {
      case "header": {
        const level = block.data?.level || 2;
        const cls = "font-bold mt-8 mb-4";
        if (level === 1) return <h1 key={index} className={`text-3xl ${cls}`}>{block.data?.text}</h1>;
        if (level === 3) return <h3 key={index} className={`text-xl ${cls}`}>{block.data?.text}</h3>;
        if (level === 4) return <h4 key={index} className={`text-lg ${cls}`}>{block.data?.text}</h4>;
        return <h2 key={index} className={`text-2xl ${cls}`}>{block.data?.text}</h2>;
      }
      case "paragraph":
        return (
          <p
            key={index}
            className="mb-5 leading-[1.8] text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: block.data?.text || "" }}
          />
        );
      case "image":
        return (
          <figure key={index} className="my-8">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden">
              <Image
                src={block.data?.file?.url || block.data?.url || ""}
                alt={block.data?.caption || ""}
                fill
                className="object-contain"
              />
            </div>
            {block.data?.caption && (
              <figcaption className="text-center text-sm text-muted-foreground mt-3 italic">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );
      case "list": {
        const isOrdered = block.data?.style === "ordered";
        const ListTag = isOrdered ? "ol" : "ul";
        return (
          <ListTag
            key={index}
            className={`mb-5 pl-6 space-y-2 text-gray-700 dark:text-gray-300 ${isOrdered ? "list-decimal" : "list-disc"}`}
          >
            {block.data?.items?.map((item: string, i: number) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ListTag>
        );
      }
      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-app-primary pl-5 py-2 my-6 bg-muted/30 rounded-r-lg"
          >
            <p
              className="italic text-gray-600 dark:text-gray-400 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: block.data?.text || "" }}
            />
            {block.data?.caption && (
              <cite className="block text-sm font-medium mt-2 not-italic">
                — {block.data.caption}
              </cite>
            )}
          </blockquote>
        );
      case "code":
        return (
          <pre
            key={index}
            className="bg-gray-950 text-gray-100 rounded-xl p-5 my-6 overflow-x-auto text-sm leading-relaxed"
          >
            <code>{block.data?.code}</code>
          </pre>
        );
      default:
        return null;
    }
  });
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-5 w-32" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-6 w-2/3" />
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48 mt-1" />
        </div>
      </div>
      <Skeleton className="w-full aspect-[16/7] rounded-2xl" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

export default function BlogDetailClient({ blogId }: { blogId: string }) {
  const { data, isLoading, isError } = useGetBlogByIdQuery(blogId) as {
    data: { success: boolean; data: BlogDetail } | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  if (isLoading) return <DetailSkeleton />;

  if (isError || !data?.data) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">
          This article could not be found.
        </p>
        <Link href="/blog">
          <Button variant="outline">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const blog: BlogDetail = data.data;
  const readTime = estimateReadTime(blog.content);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: blog.title,
        text: blog.des || blog.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <article>
      {/* Breadcrumb */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-[2.75rem] font-bold leading-[1.15] tracking-tight">
        {blog.title}
      </h1>

      {/* Description / Subtitle */}
      {blog.des && (
        <p className="text-lg md:text-xl text-muted-foreground mt-4 leading-relaxed">
          {blog.des}
        </p>
      )}

      {/* Author bar */}
      <div className="flex items-center justify-between mt-8 pb-6 border-b border-gray-100 dark:border-white/10">
        <div className="flex items-center gap-3">
          {blog.author?.personal_info?.profile_img && (
            <Image
              src={blog.author.personal_info.profile_img}
              alt={blog.author.personal_info.fullname || "Author"}
              width={44}
              height={44}
              className="rounded-full"
            />
          )}
          <div>
            <span className="flex items-center gap-1 text-sm font-semibold">
              {blog.author?.personal_info?.fullname || "Unknown Author"}
              {blog.author?.personal_info?.username && (
                <span className="flex items-center gap-0.5 text-muted-foreground font-normal">
                  @{blog.author.personal_info.username}
                  <BadgeCheck size={14} className="text-blue-500" />
                </span>
              )}
            </span>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
              {blog.publishedAt && (
                <span>
                  {new Date(blog.publishedAt).toLocaleDateString("en-NG", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {readTime} min read
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-muted-foreground">
          {blog.activity && (
            <>
              <span className="flex items-center gap-1 text-xs">
                <Eye size={14} /> {blog.activity.total_reads ?? 0}
              </span>
              <span className="flex items-center gap-1 text-xs">
                <Heart size={14} /> {blog.activity.total_likes ?? 0}
              </span>
            </>
          )}
          <button
            onClick={handleShare}
            className="p-2 rounded-full hover:bg-muted transition-colors"
            title="Share article"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Banner */}
      {blog.banner && (
        <div className="relative w-full aspect-[16/8] rounded-2xl overflow-hidden mt-8">
          <Image
            src={blog.banner}
            alt={blog.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Article body */}
      <div className="mt-10 text-[17px] leading-[1.8]">
        {renderContent(blog.content)}
      </div>

      {/* Bottom tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-12 pt-6 border-t border-gray-100 dark:border-white/10">
          {blog.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-full">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Back to blog CTA */}
      <div className="mt-8 text-center">
        <Link href="/blog">
          <Button variant="outline" className="rounded-full px-6">
            <ArrowLeft size={16} className="mr-2" />
            More Articles
          </Button>
        </Link>
      </div>
    </article>
  );
}
