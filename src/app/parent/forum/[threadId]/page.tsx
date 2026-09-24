"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { ParentForumThread } from "@/components/parent/ParentForumThread";

function ThreadInner() {
  const params = useParams();
  const threadId = typeof params.threadId === "string" ? params.threadId : "";

  return <ParentForumThread threadId={threadId} />;
}

export default function ParentForumThreadPage() {
  return (
    <Suspense fallback={null}>
      <ThreadInner />
    </Suspense>
  );
}
