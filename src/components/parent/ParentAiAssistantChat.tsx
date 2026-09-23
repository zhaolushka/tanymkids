"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import type { ParentAssistantChatMessage } from "@/app/api/ai/parent-assistant/route";
import { PtmCard } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";
import { getDoctorByHandle } from "@/lib/doctors/catalog";

type Props = {
  doctorHandle?: string;
  compact?: boolean;
};

export function ParentAiAssistantChat({ doctorHandle, compact }: Props) {
  const { locale, t } = useI18n();
  const ai = t.parent.aiAssistant;
  const [messages, setMessages] = useState<ParentAssistantChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"demo" | "cloud" | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const doctor = doctorHandle ? getDoctorByHandle(doctorHandle) : undefined;

  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: doctor
          ? ai.welcomeWithDoctor.replace("{name}", doctor.fullName)
          : ai.welcome,
      },
    ]);
  }, [ai.welcome, ai.welcomeWithDoctor, doctor]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const nextMessages: ParentAssistantChatMessage[] = [
        ...messages,
        { role: "user", content: trimmed },
      ];
      setMessages(nextMessages);
      setInput("");
      setLoading(true);

      try {
        const res = await fetch("/api/ai/parent-assistant", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            locale,
            doctorHandle: doctor?.handle,
            messages: nextMessages,
          }),
        });

        if (!res.ok) {
          throw new Error("request_failed");
        }

        const data = (await res.json()) as { reply: string; mode: "demo" | "cloud" };
        setMode(data.mode);
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: ai.errorReply },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [ai.errorReply, doctor?.handle, loading, locale, messages],
  );

  const chips = doctor
    ? [ai.chipExplainTerms, ai.chipWriteDoctor, ai.chipAboutDoctor]
    : [ai.chipPickDoctor, ai.chipExplainTerms, ai.chipWriteDoctor];

  return (
    <div className={compact ? "" : "space-y-4"}>
      {!compact && (
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--ptm-accent)]/15 text-[var(--ptm-accent)]">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-lg font-extrabold">{ai.title}</h2>
            <p className="text-sm text-[var(--ptm-muted)]">{ai.subtitle}</p>
            {mode === "demo" && (
              <p className="mt-1 text-xs text-[var(--ptm-muted)]">{ai.demoBadge}</p>
            )}
          </div>
        </div>
      )}

      <PtmCard className={`flex flex-col overflow-hidden ${compact ? "p-0" : "p-0"}`}>
        <div
          ref={listRef}
          className={`max-h-[min(52vh,420px)] space-y-3 overflow-y-auto px-4 py-4 ${compact ? "max-h-80" : ""}`}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <Bot className="mt-1 h-4 w-4 shrink-0 text-[var(--ptm-accent)]" aria-hidden />
              )}
              <div
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-[var(--ptm-accent)] text-white"
                    : "bg-[var(--ptm-bg)] text-[var(--ptm-text)]"
                }`}
              >
                {m.content.split(/(\/parent\/doctors\/[\w]+)/g).map((part, j) =>
                  part.startsWith("/parent/doctors/") ? (
                    <Link key={j} href={part} className="font-bold underline">
                      {ai.openProfile}
                    </Link>
                  ) : (
                    <span key={j}>{part}</span>
                  ),
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-sm text-[var(--ptm-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {ai.thinking}
            </div>
          )}
        </div>

        <div className="border-t border-black/5 px-3 py-3">
          <div className="mb-2 flex flex-wrap gap-2">
            {chips.map((label) => (
              <button
                key={label}
                type="button"
                disabled={loading}
                onClick={() => send(label)}
                className="rounded-full border border-[var(--ptm-accent)]/20 bg-[var(--ptm-bg)] px-3 py-1 text-xs font-semibold text-[var(--ptm-accent)] hover:bg-[var(--ptm-accent)]/10 disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={ai.inputPlaceholder}
              className="min-w-0 flex-1 rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--ptm-accent)]"
              maxLength={2000}
              aria-label={ai.inputPlaceholder}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--ptm-accent)] text-white disabled:opacity-40"
              aria-label={ai.send}
            >
              <Send className="h-4 w-4" aria-hidden />
            </button>
          </form>
          <p className="mt-2 text-[10px] leading-snug text-[var(--ptm-muted)]">{ai.disclaimer}</p>
        </div>
      </PtmCard>
    </div>
  );
}
