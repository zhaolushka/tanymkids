"use client";

import { useState } from "react";
import Link from "next/link";
import { ParentAiAssistantChat } from "@/components/parent/ParentAiAssistantChat";
import { ParentDoctorChatDemo } from "@/components/parent/ParentDoctorChatDemo";
import { PtmCard, PtmPageTitle } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";

export default function ParentMessagesPage() {
  const { t } = useI18n();
  const ai = t.parent.aiAssistant;
  const [tab, setTab] = useState<"ai" | "chat">("chat");

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
        <PtmCard className="p-4 sm:p-5">
          <ParentDoctorChatDemo onOpenAi={() => setTab("ai")} />
        </PtmCard>
      )}
    </div>
  );
}
