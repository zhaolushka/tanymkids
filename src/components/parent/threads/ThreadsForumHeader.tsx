"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";

type Props = {
  backHref?: string;
  title?: string;
};

export function ThreadsForumHeader({ backHref, title }: Props) {
  const { t } = useI18n();
  const f = t.parent.forum;
  const heading = title ?? f.threadsBrand;

  return (
    <header className="sticky top-0 z-20 border-b border-black/[0.06] bg-[var(--ptm-card)]/95 backdrop-blur-md">
      <div className="relative flex h-12 items-center justify-center px-4">
        {backHref && (
          <Link
            href={backHref}
            className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full hover:bg-black/5"
            aria-label={f.back}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2} />
          </Link>
        )}
        <span className="text-[15px] font-bold tracking-tight">{heading}</span>
      </div>
    </header>
  );
}
