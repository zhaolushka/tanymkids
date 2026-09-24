"use client";

import { useMemo, useState } from "react";
import { PenLine } from "lucide-react";
import { parentInitials } from "@/components/parent/parent-telemed-ui";
import { ThreadsPostRow } from "@/components/parent/threads/ThreadsPostRow";
import { useI18n } from "@/i18n/LocaleProvider";
import {
  authorHandle,
  type ForumCategory,
  getForumFeed,
} from "@/lib/forum/demo-forum";

type LocalPost = {
  id: string;
  author: string;
  handle: string;
  body: string;
  time: string;
  replyCount: number;
  likeCount: number;
};

export function ParentForumList() {
  const { locale, t } = useI18n();
  const f = t.parent.forum;
  const [category, setCategory] = useState<ForumCategory>("all");
  const [composeOpen, setComposeOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  const feed = useMemo(() => {
    const base = getForumFeed(locale, category);
    const extra: LocalPost[] = localPosts.map((p) => ({ ...p }));
    return [
      ...extra.map((p) => ({
        threadId: p.id,
        postId: p.id,
        author: p.author,
        handle: p.handle,
        city: f.youCity,
        body: p.body,
        replyCount: p.replyCount,
        likeCount: p.likeCount,
        updatedAt: p.time,
        isLocal: true,
      })),
      ...base.map((item) => ({ ...item, isLocal: false })),
    ];
  }, [category, f.youCity, localPosts, locale]);

  const tabs: { id: ForumCategory; label: string }[] = [
    { id: "all", label: f.tabForYou },
    { id: "lfk", label: f.catLfk },
    { id: "speech", label: f.catSpeech },
    { id: "general", label: f.catGeneral },
  ];

  const publish = () => {
    const text = draft.trim();
    if (!text) return;
    const id = `local-${Date.now()}`;
    setLocalPosts((prev) => [
      {
        id,
        author: f.youLabel,
        handle: authorHandle(f.youLabel),
        body: text,
        time: new Date().toISOString(),
        replyCount: 0,
        likeCount: 0,
      },
      ...prev,
    ]);
    setDraft("");
    setComposeOpen(false);
  };

  return (
    <div className="relative pb-20">
      <div className="flex gap-0 border-b border-black/[0.06]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setCategory(tab.id)}
            className={`flex-1 py-3 text-center text-[13px] font-semibold transition ${
              category === tab.id
                ? "border-b-2 border-[var(--ptm-text)] text-[var(--ptm-text)]"
                : "text-[var(--ptm-muted)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setComposeOpen(true)}
        className="flex w-full gap-3 border-b border-black/[0.06] px-4 py-3 text-left transition hover:bg-black/[0.02]"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--ptm-accent)]/15 text-xs font-bold text-[var(--ptm-accent)]">
          {parentInitials(f.youLabel)}
        </div>
        <span className="flex flex-1 items-center text-[15px] text-[var(--ptm-muted)]">
          {f.composePlaceholder}
        </span>
        <PenLine className="h-5 w-5 shrink-0 text-[var(--ptm-muted)]" aria-hidden />
      </button>

      {composeOpen && (
        <div className="border-b border-black/[0.06] bg-[var(--ptm-bg)]/80 px-4 py-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={f.composePlaceholder}
            rows={4}
            autoFocus
            className="w-full resize-none bg-transparent text-[15px] outline-none"
            maxLength={2000}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setComposeOpen(false)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--ptm-muted)]"
            >
              {f.cancel}
            </button>
            <button
              type="button"
              onClick={publish}
              disabled={!draft.trim()}
              className="rounded-full bg-[var(--ptm-text)] px-5 py-2 text-sm font-bold text-white disabled:opacity-40"
            >
              {f.publishThread}
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-[var(--ptm-muted)]">{f.demoBadge}</p>
        </div>
      )}

      <div>
        {feed.map((item) => {
          const likeKey = item.threadId;
          const liked = likes[likeKey] ?? false;
          const likeCount = item.likeCount + (liked ? 1 : 0);
          return (
            <ThreadsPostRow
              key={item.threadId}
              author={item.author}
              handle={item.handle}
              city={item.city}
              body={item.body}
              time={item.updatedAt}
              replyCount={item.replyCount}
              likeCount={likeCount}
              liked={liked}
              onLike={() =>
                setLikes((prev) => ({ ...prev, [likeKey]: !prev[likeKey] }))
              }
              threadHref={item.isLocal ? undefined : `/parent/forum/${item.threadId}`}
            />
          );
        })}
      </div>

      {feed.length === 0 && (
        <p className="py-12 text-center text-sm text-[var(--ptm-muted)]">{f.empty}</p>
      )}

      <button
        type="button"
        onClick={() => setComposeOpen(true)}
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--ptm-text)] text-white shadow-lg lg:bottom-8"
        aria-label={f.newTopic}
      >
        <PenLine className="h-6 w-6" strokeWidth={2} />
      </button>
    </div>
  );
}
