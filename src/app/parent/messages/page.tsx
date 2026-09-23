"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PtmCard, PtmPageTitle } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentMessagesPage() {
  const { t } = useI18n();

  return (
    <div>
      <PtmPageTitle title={t.parent.messagesTitle} subtitle={t.parent.messagesDesc} />
      <PtmCard className="flex flex-col items-center gap-3 p-10 text-center">
        <MessageCircle className="h-14 w-14 text-[var(--ptm-muted)]/70" strokeWidth={1.25} aria-hidden />
        <p className="font-semibold">{t.parent.messagesEmpty}</p>
        <p className="max-w-sm text-sm text-[var(--ptm-muted)]">{t.parent.messagesEmptyHint}</p>
        <Link href="/parent/network" className="text-sm font-bold text-[var(--ptm-accent)] hover:underline">
          {t.parent.messagesFindDoctor}
        </Link>
      </PtmCard>
    </div>
  );
}
