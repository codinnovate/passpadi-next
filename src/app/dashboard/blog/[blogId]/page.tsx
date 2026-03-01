import type { Metadata } from "next";
import BlogDetailClient from "@/components/BlogDetailClient";

const API_BASE = process.env.NEXT_PUBLIC_SERVER || "http://localhost:8000";

async function getBlog(blogId: string) {
  try {
    const res = await fetch(`${API_BASE}/api/v1/blogs/${blogId}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ blogId: string }>;
}): Promise<Metadata> {
  const { blogId } = await params;
  const blog = await getBlog(blogId);

  if (!blog) {
    return {
      title: "Article Not Found — Passpadi",
      description: "This article could not be found.",
    };
  }

  const title = `${blog.title} — Passpadi Blog`;
  const description =
    blog.des || `Read "${blog.title}" on Passpadi — study tips, exam guides, and education news.`;
  const authorName =
    blog.author?.personal_info?.fullname || "Passpadi";

  return {
    title,
    description,
    keywords: blog.tags ?? [],
    authors: [{ name: authorName }],
    openGraph: {
      title,
      description,
      url: `/blog/${blogId}`,
      siteName: "Passpadi",
      locale: "en_NG",
      type: "article",
      publishedTime: blog.publishedAt,
      authors: [authorName],
      ...(blog.banner ? { images: [{ url: blog.banner, width: 1200, height: 630, alt: blog.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(blog.banner ? { images: [blog.banner] } : {}),
    },
    alternates: {
      canonical: `/blog/${blogId}`,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ blogId: string }>;
}) {
  const { blogId } = await params;

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto py-6 px-1">
      <BlogDetailClient blogId={blogId} />
    </div>
  );
}
