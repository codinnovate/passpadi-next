import type { Metadata } from "next";
import { PostDetailView } from "@/modules/feed";

export const metadata: Metadata = {
  title: "Post — 90percent",
  description: "View post and join the discussion.",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;

  return (
    <div className="flex flex-col w-full py-6">
      <PostDetailView postId={postId} />
    </div>
  );
}
