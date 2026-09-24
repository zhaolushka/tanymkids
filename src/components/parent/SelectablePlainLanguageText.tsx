"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, X } from "lucide-react";
import { explainPlainLanguage, fallbackPlainLanguage } from "@/lib/ai/plain-language-glossary";
import type { Locale } from "@/i18n/types";

type Popover = {
  word: string;
  title: string;
  body: string;
  x: number;
  y: number;
};

type Props = {
  locale: Locale;
  children: string;
  className?: string;
  hint?: string;
};

export function SelectablePlainLanguageText({ locale, children, className, hint }: Props) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const [popover, setPopover] = useState<Popover | null>(null);

  const close = useCallback(() => setPopover(null), []);

  const explainSelection = useCallback(() => {
    const sel = window.getSelection();
    const text = sel?.toString().trim();
    if (!text || text.length > 80 || !rootRef.current) return;

    const anchor = sel?.anchorNode;
    if (!anchor || !rootRef.current.contains(anchor)) return;

    let rect: DOMRect | undefined;
    try {
      rect = sel!.getRangeAt(0).getBoundingClientRect();
    } catch {
      return;
    }
    if (!rect || (rect.width === 0 && rect.height === 0)) return;

    const found = explainPlainLanguage(locale, text) ?? fallbackPlainLanguage(locale, text);
    setPopover({
      word: text,
      title: found.title,
      body: found.body,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  }, [locale]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (popover && !document.getElementById("plain-lang-popover")?.contains(target)) {
        close();
      }
    };
    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("touchstart", onDocDown);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("touchstart", onDocDown);
    };
  }, [close, popover]);

  return (
    <>
      <p
        ref={rootRef}
        className={`select-text leading-relaxed ${className ?? ""}`}
        onMouseUp={explainSelection}
        onTouchEnd={() => {
          window.setTimeout(explainSelection, 80);
        }}
      >
        {children}
      </p>
      {hint && <p className="mt-2 text-xs text-[var(--ptm-muted)]">{hint}</p>}

      {popover && (
        <div
          id="plain-lang-popover"
          role="dialog"
          aria-label={popover.title}
          className="fixed z-[100] w-[min(calc(100vw-2rem),320px)] -translate-x-1/2 rounded-2xl border border-[var(--ptm-accent)]/20 bg-[var(--ptm-card)] p-4 shadow-[var(--ptm-shadow)]"
          style={{
            left: popover.x,
            top: Math.max(12, popover.y - 8),
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-[var(--ptm-accent)]">
              <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
              <p className="text-sm font-extrabold">{popover.title}</p>
            </div>
            <button
              type="button"
              onClick={close}
              className="rounded-lg p-1 text-[var(--ptm-muted)] hover:bg-black/5"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-sm leading-relaxed text-[var(--ptm-text)]">{popover.body}</p>
        </div>
      )}
    </>
  );
}
