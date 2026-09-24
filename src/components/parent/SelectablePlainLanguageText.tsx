"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { BookOpen, X } from "lucide-react";
import { explainPlainLanguage, fallbackPlainLanguage } from "@/lib/ai/plain-language-glossary";
import type { Locale } from "@/i18n/types";

type PopoverContent = {
  word: string;
  title: string;
  body: string;
  anchorX: number;
  anchorY: number;
  anchorBottom: number;
};

type PopoverLayout = {
  left: number;
  top: number;
  maxHeight: number;
};

const PAD = 12;
const GAP = 10;
const MAX_W = 320;

type Props = {
  locale: Locale;
  children: string;
  className?: string;
  hint?: string;
};

export function SelectablePlainLanguageText({ locale, children, className, hint }: Props) {
  const rootRef = useRef<HTMLParagraphElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popover, setPopover] = useState<PopoverContent | null>(null);
  const [layout, setLayout] = useState<PopoverLayout | null>(null);

  const close = useCallback(() => {
    setPopover(null);
    setLayout(null);
  }, []);

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
      anchorX: rect.left + rect.width / 2,
      anchorY: rect.top,
      anchorBottom: rect.bottom,
    });
    setLayout(null);
  }, [locale]);

  useLayoutEffect(() => {
    if (!popover || !popoverRef.current) return;

    const el = popoverRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(MAX_W, vw - PAD * 2);
    const height = el.offsetHeight;

    let left = popover.anchorX - width / 2;
    left = Math.max(PAD, Math.min(left, vw - width - PAD));

    const spaceAbove = popover.anchorY - PAD;
    const spaceBelow = vh - popover.anchorBottom - PAD;
    const preferBelow = spaceAbove < height + GAP && spaceBelow >= spaceAbove;

    let top: number;
    let maxHeight: number;

    if (preferBelow) {
      top = popover.anchorBottom + GAP;
      maxHeight = Math.min(240, vh - top - PAD);
    } else {
      top = Math.max(PAD, popover.anchorY - GAP - height);
      if (top < PAD) {
        top = popover.anchorBottom + GAP;
        maxHeight = Math.min(240, vh - top - PAD);
      } else {
        maxHeight = Math.min(240, popover.anchorY - GAP - PAD);
      }
    }

    setLayout({ left, top, maxHeight });
  }, [popover]);

  useEffect(() => {
    if (!popover) return;
    const onScroll = () => close();
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [close, popover]);

  useEffect(() => {
    const onDocDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (popover && !popoverRef.current?.contains(target)) {
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

  const popoverNode =
    popover ? (
      <div
        ref={popoverRef}
        id="plain-lang-popover"
        role="dialog"
        aria-label={popover.title}
        className="fixed z-[200] rounded-2xl border border-[var(--ptm-accent)]/20 bg-[var(--ptm-card)] p-4 shadow-[var(--ptm-shadow)]"
        style={{
          left: layout?.left ?? Math.max(PAD, popover.anchorX - MAX_W / 2),
          top: layout?.top ?? popover.anchorBottom + GAP,
          width: `min(calc(100vw - ${PAD * 2}px), ${MAX_W}px)`,
          visibility: layout ? "visible" : "hidden",
          maxHeight: layout ? layout.maxHeight + 56 : undefined,
        }}
      >
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2 text-[var(--ptm-accent)]">
            <BookOpen className="h-4 w-4 shrink-0" aria-hidden />
            <p className="truncate text-sm font-extrabold">{popover.title}</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="shrink-0 rounded-lg p-1 text-[var(--ptm-muted)] hover:bg-black/5"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p
          className="overflow-y-auto text-sm leading-relaxed text-[var(--ptm-text)]"
          style={{ maxHeight: layout?.maxHeight ?? 200 }}
        >
          {popover.body}
        </p>
      </div>
    ) : null;

  return (
    <>
      <p
        ref={rootRef}
        className={`select-text leading-relaxed ${className ?? ""}`}
        onMouseUp={explainSelection}
        onTouchEnd={() => {
          window.setTimeout(explainSelection, 120);
        }}
      >
        {children}
      </p>
      {hint && <p className="mt-2 text-xs text-[var(--ptm-muted)]">{hint}</p>}
      {popoverNode ? createPortal(popoverNode, document.body) : null}
    </>
  );
}
