"use client";

import Link from "next/link";
import { Heart, MessageCircle, Repeat2, Send } from "lucide-react";
import { parentInitials } from "@/components/parent/parent-telemed-ui";
import { formatThreadTime } from "@/components/parent/threads/threads-utils";
import { useI18n } from "@/i18n/LocaleProvider";

export type ThreadsPostRowProps = {
  author: string;
  handle: string;
  city?: string;
  body: string;
  time: string;
  replyCount?: number;
  likeCount?: number;
  threadHref?: string;
  compact?: boolean;
  isReply?: boolean;
  liked?: boolean;
  onLike?: () => void;
  onReplyClick?: () => void;
};

export function ThreadsPostRow({
  author,
  handle,
  city,
  body,
  time,
  replyCount = 0,
  likeCount = 0,
  threadHref,
  compact,
  isReply,
  liked,
  onLike,
  onReplyClick,
}: ThreadsPostRowProps) {
  const { t } = useI18n();
  const f = t.parent.forum;
  const timeLabel = formatThreadTime(time);

  const content = (
    <article
      className={`flex gap-3 px-4 py-3 ${compact ? "py-2.5" : ""} ${!isReply ? "border-b border-black/[0.06]" : ""}`}
    >
      <div className="relative flex shrink-0 flex-col items-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-neutral-800 to-neutral-600 text-xs font-bold text-white">
          {parentInitials(author)}
        </div>
        {isReply && (
          <span className="absolute top-10 h-[calc(100%+12px)] w-px bg-black/10" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex-1 pb-1">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-[15px] font-semibold leading-tight">{author}</span>
          <span className="text-[14px] text-[var(--ptm-muted)]">
            @{handle}
            {city ? ` · ${city}` : ""}
          </span>
          <span className="text-[var(--ptm-muted)]">·</span>
          <span className="text-[14px] text-[var(--ptm-muted)]">{timeLabel}</span>
        </div>

        <p className="mt-1.5 whitespace-pre-wrap text-[15px] leading-snug text-[var(--ptm-text)]">
          {body}
        </p>

        <div className="mt-3 flex items-center gap-5 text-[var(--ptm-muted)]">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLike?.();
            }}
            className={`inline-flex items-center gap-1.5 transition ${liked ? "text-rose-500" : "hover:text-rose-500"}`}
            aria-label={f.actionLike}
          >
            <Heart className={`h-[18px] w-[18px] ${liked ? "fill-current" : ""}`} strokeWidth={1.75} />
            {likeCount > 0 && <span className="text-xs">{likeCount}</span>}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReplyClick?.();
            }}
            className="inline-flex items-center gap-1.5 hover:text-[var(--ptm-accent)]"
            aria-label={f.actionReply}
          >
            <MessageCircle className="h-[18px] w-[18px]" strokeWidth={1.75} />
            {replyCount > 0 && <span className="text-xs">{replyCount}</span>}
          </button>
          <span className="inline-flex items-center gap-1.5 opacity-60" aria-hidden>
            <Repeat2 className="h-[18px] w-[18px]" strokeWidth={1.75} />
          </span>
          <span className="inline-flex items-center gap-1.5 opacity-60" aria-hidden>
            <Send className="h-[17px] w-[17px]" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </article>
  );

  if (threadHref) {
    return (
      <Link href={threadHref} className="block transition hover:bg-black/[0.02]">
        {content}
      </Link>
    );
  }

  return content;
}
