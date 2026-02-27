"use client";

import { use } from "react";
import ChatRoom from "@/components/study-groups/ChatRoom";

export default function GroupChatPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = use(params);

  return (
    <div className="-mx-4 -my-4 md:-mb-4">
      <ChatRoom groupId={groupId} />
    </div>
  );
}
