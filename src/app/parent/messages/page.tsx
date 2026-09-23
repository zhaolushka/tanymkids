"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ParentAiAssistantChat } from "@/components/parent/ParentAiAssistantChat";
import { PtmCard, PtmPageTitle } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentMessagesPage() {
  const { t } = useI18n();
  const ai = t.parent.aiAssistant;
  const [tab, setTab] = useState<"ai" | "chat">("ai");

  return (
    <div className="space-y-4">
      <PtmPageTitle title={t.parent.messagesTitle} subtitle={t.parent.messagesDesc} />

      <div className="flex gap-2 rounded-2xl bg-[var(--ptm-bg)] p-1">
        <button
          type="button"
          onClick={() => setTab("ai")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
            tab === "ai"
              ? "bg-[var(--ptm-card)] text-[var(--ptm-accent)] shadow-sm"
              : "text-[var(--ptm-muted)]"
          }`}
        >
          {ai.messagesTabAi}
        </button>
        <button
          type="button"
          onClick={() => setTab("chat")}
          className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition ${
            tab === "chat"
              ? "bg-[var(--ptm-card)] text-[var(--ptm-accent)] shadow-sm"
              : "text-[var(--ptm-muted)]"
          }`}
        >
          {ai.messagesTabChat}
        </button>
      </div>

      {tab === "ai" ? (
        <ParentAiAssistantChat compact />
      ) : (
        <PtmCard className="flex flex-col items-center gap-3 p-10 text-center">
          <MessageCircle className="h-14 w-14 text-[var(--ptm-muted)]/70" strokeWidth={1.25} aria-hidden />
          <p className="font-semibold">{t.parent.messagesEmpty}</p>
          <p className="max-w-sm text-sm text-[var(--ptm-muted)]">{t.parent.messagesEmptyHint}</p>
          <Link href="/parent/network" className="text-sm font-bold text-[var(--ptm-accent)] hover:underline">
            {t.parent.messagesFindDoctor}
          </Link>
          <Link
            href="/parent/assistant"
            className="mt-2 text-sm font-bold text-[var(--ptm-accent)] hover:underline"
          >
            {ai.title} →
          </Link>
        </PtmCard>
      )}
    </div>
  );
}
