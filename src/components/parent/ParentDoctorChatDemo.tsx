"use client";

import { useCallback, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { parentInitials } from "@/components/parent/parent-telemed-ui";
import { SelectablePlainLanguageText } from "@/components/parent/SelectablePlainLanguageText";
import { useI18n } from "@/i18n/LocaleProvider";
import { getDoctorByHandle } from "@/lib/doctors/catalog";

type ChatItem =
  | { id: string; role: "doctor"; text: string; explainable?: boolean }
  | { id: string; role: "parent"; text: string };

type Props = {
  onOpenAi?: () => void;
};

export function ParentDoctorChatDemo({ onOpenAi }: Props) {
  const { locale, t } = useI18n();
  const d = t.parent.doctorChatDemo;
  const doctor = getDoctorByHandle("ainur_lfk");
  const name = doctor?.fullName ?? d.doctorFallback;

  const doctorBody = locale === "ru" ? d.doctorMessageRu : d.doctorMessageKk;
  const parentBody = locale === "ru" ? d.parentMessageRu : d.parentMessageKk;

  const [items, setItems] = useState<ChatItem[]>([
    { id: "d1", role: "doctor", text: doctorBody, explainable: true },
    { id: "p1", role: "parent", text: parentBody },
  ]);
  const [draft, setDraft] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const replyScheduled = useRef(false);

  const scrollDown = useCallback(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    });
  }, []);

  const send = useCallback(() => {
    const text = draft.trim();
    if (!text) return;

    setDraft("");
    setItems((prev) => [...prev, { id: `p-${Date.now()}`, role: "parent", text }]);
    setToast(d.sentDemo);
    scrollDown();

    if (!replyScheduled.current) {
      replyScheduled.current = true;
      window.setTimeout(() => {
        setItems((prev) => [
          ...prev,
          { id: `d-${Date.now()}`, role: "doctor", text: d.doctorAutoReply },
        ]);
        scrollDown();
      }, 1200);
    }

    window.setTimeout(() => setToast(null), 3500);
  }, [d.doctorAutoReply, d.sentDemo, draft, scrollDown]);

  return (
    <div className="flex flex-col">
      <p className="rounded-xl bg-[var(--ptm-accent)]/10 px-3 py-2 text-xs font-semibold text-[var(--ptm-accent)]">
        {d.demoBadge}
      </p>

      <div className="mt-4 flex items-center gap-3 border-b border-black/5 pb-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ptm-accent)]/15 text-sm font-bold text-[var(--ptm-accent)]">
          {parentInitials(name)}
        </div>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-xs text-[var(--ptm-muted)]">{d.onlineHint}</p>
        </div>
      </div>

      <ul
        ref={listRef}
        className="mt-4 max-h-[min(46vh,380px)] space-y-4 overflow-y-auto pb-2"
      >
        {items.map((item) =>
          item.role === "doctor" ? (
            <li key={item.id} className="flex justify-start">
              <div className="max-w-[92%] rounded-2xl rounded-tl-md bg-[var(--ptm-bg)] px-4 py-3 text-sm">
                {item.explainable ? (
                  <SelectablePlainLanguageText locale={locale} hint={d.selectHint}>
                    {item.text}
                  </SelectablePlainLanguageText>
                ) : (
                  <p className="leading-relaxed">{item.text}</p>
                )}
              </div>
            </li>
          ) : (
            <li key={item.id} className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-[var(--ptm-accent)] px-4 py-3 text-sm leading-relaxed text-white">
                {item.text}
              </div>
            </li>
          ),
        )}
      </ul>

      {toast && (
        <p className="mt-2 rounded-xl bg-[var(--ptm-bg)] px-3 py-2 text-center text-xs font-medium text-[var(--ptm-muted)]">
          {toast}
        </p>
      )}

      <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
        {onOpenAi && (
          <button
            type="button"
            onClick={onOpenAi}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--ptm-accent)]/25 py-2.5 text-sm font-bold text-[var(--ptm-accent)]"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {d.aiHelpButton}
          </button>
        )}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={d.inputPlaceholder}
            rows={2}
            className="min-h-[44px] min-w-0 flex-1 resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-[var(--ptm-accent)]"
            maxLength={2000}
            aria-label={d.inputPlaceholder}
          />
          <button
            type="submit"
            disabled={!draft.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-xl bg-[var(--ptm-accent)] text-white disabled:opacity-40"
            aria-label={d.send}
          >
            <Send className="h-4 w-4" aria-hidden />
          </button>
        </form>
        {onOpenAi && (
          <button
            type="button"
            onClick={onOpenAi}
            className="w-full text-center text-xs font-semibold text-[var(--ptm-muted)] hover:text-[var(--ptm-accent)]"
          >
            {d.askAiMore}
          </button>
        )}
      </div>
    </div>
  );
}
