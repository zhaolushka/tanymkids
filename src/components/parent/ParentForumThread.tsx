"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { ThreadsPostRow } from "@/components/parent/threads/ThreadsPostRow";
import { useI18n } from "@/i18n/LocaleProvider";
import {
  authorHandle,
  getForumFeed,
  getForumPosts,
  getForumThread,
} from "@/lib/forum/demo-forum";

type Props = {
  threadId: string;
};

export function ParentForumThread({ threadId }: Props) {
  const { locale, t } = useI18n();
  const f = t.parent.forum;
  const thread = getForumThread(threadId);
  const [extraPosts, setExtraPosts] = useState<{ id: string; body: string; time: string }[]>([]);
  const [draft, setDraft] = useState("");
  const [liked, setLiked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const root = useMemo(() => {
    if (!thread) return null;
    const feed = getForumFeed(locale, "all").find((x) => x.threadId === threadId);
    const first = getForumPosts(threadId)[0];
    return {
      author: thread.author,
      handle: authorHandle(thread.author),
      city: thread.city,
      body: feed?.body ?? (first ? (first.body[locale] ?? first.body.kk) : ""),
      time: thread.updatedAt,
      replyCount: thread.replyCount,
      likeCount: thread.likeCount,
    };
  }, [locale, thread, threadId]);

  const replies = thread ? getForumPosts(threadId).slice(1) : [];

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setExtraPosts((prev) => [...prev, { id: `u-${Date.now()}`, body: text, time: new Date().toISOString() }]);
    setDraft("");
    scrollDown();
  };

  if (!thread || !root) {
    return <p className="px-4 py-8 text-center text-sm text-[var(--ptm-muted)]">{f.notFound}</p>;
  }

  return (
    <div className="pb-24">
      <ThreadsPostRow
        author={root.author}
        handle={root.handle}
        city={root.city}
        body={root.body}
        time={root.time}
        replyCount={root.replyCount + extraPosts.length}
        likeCount={root.likeCount + (liked ? 1 : 0)}
        liked={liked}
        onLike={() => setLiked((v) => !v)}
      />

      <div className="border-b border-black/[0.06]">
        {replies.map((post) => (
          <ThreadsPostRow
            key={post.id}
            author={post.author}
            handle={authorHandle(post.author)}
            body={post.body[locale] ?? post.body.kk}
            time={post.createdAt}
            compact
            isReply
          />
        ))}
        {extraPosts.map((post) => (
          <ThreadsPostRow
            key={post.id}
            author={f.youLabel}
            handle={authorHandle(f.youLabel)}
            body={post.body}
            time={post.time}
            compact
            isReply
          />
        ))}
      </div>

      <div
        ref={bottomRef}
        className="fixed inset-x-0 bottom-16 z-30 border-t border-black/[0.06] bg-[var(--ptm-card)]/95 px-3 py-2 backdrop-blur-md lg:bottom-0 lg:max-w-2xl lg:px-4"
      >
        <form
          className="mx-auto flex max-w-lg items-end gap-2 lg:max-w-none"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={f.replyPlaceholder}
            rows={1}
            className="max-h-28 min-h-[40px] flex-1 resize-none rounded-2xl border border-black/10 bg-[var(--ptm-bg)] px-3 py-2.5 text-[15px] outline-none focus:border-[var(--ptm-accent)]"
            maxLength={2000}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="shrink-0 rounded-full bg-[var(--ptm-text)] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-40"
          >
            {f.publishThread}
          </button>
        </form>
      </div>
    </div>
  );
}
