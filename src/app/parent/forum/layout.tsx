"use client";

import { ThreadsForumHeader } from "@/components/parent/threads/ThreadsForumHeader";
import { usePathname } from "next/navigation";

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isThread = /^\/parent\/forum\/[^/]+$/.test(pathname);

  return (
    <div className="-mx-4 sm:-mx-0 sm:mx-0">
      <div className="overflow-hidden rounded-none border-black/[0.06] bg-[var(--ptm-card)] sm:rounded-[var(--ptm-radius-lg)] sm:border sm:shadow-[var(--ptm-shadow-sm)]">
        <ThreadsForumHeader backHref={isThread ? "/parent/forum" : undefined} />
        {children}
      </div>
    </div>
  );
}
