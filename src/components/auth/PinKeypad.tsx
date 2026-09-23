"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PIN_LEN = 4;

export function PinKeypad({
  onComplete,
  onDigitChange,
  error,
  shakeKey,
}: {
  onComplete: (pin: string) => void | Promise<void>;
  onDigitChange?: () => void;
  error?: string | null;
  shakeKey?: number;
}) {
  const [digits, setDigits] = useState("");
  const lastSubmitted = useRef<string | null>(null);

  useEffect(() => {
    setDigits("");
    lastSubmitted.current = null;
  }, [shakeKey]);

  useEffect(() => {
    if (digits.length !== PIN_LEN) {
      lastSubmitted.current = null;
      return;
    }
    if (lastSubmitted.current === digits) return;
    lastSubmitted.current = digits;

    const pin = digits;
    queueMicrotask(() => {
      void Promise.resolve(onComplete(pin));
    });
  }, [digits, onComplete]);

  const push = useCallback(
    (key: string) => {
      if (key === "back") {
        setDigits((d) => d.slice(0, -1));
        onDigitChange?.();
        return;
      }
      setDigits((d) => {
        if (d.length >= PIN_LEN) return d;
        return d + key;
      });
      onDigitChange?.();
    },
    [onDigitChange],
  );

  return (
    <div>
      <div
        className={cn(
          "flex justify-center gap-4 py-6",
          shakeKey ? "animate-[shake_0.45s_ease]" : "",
        )}
        key={shakeKey}
      >
        {Array.from({ length: PIN_LEN }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-4 w-4 rounded-full border-2 transition-colors",
              i < digits.length
                ? "border-[var(--ptm-accent,#2F6BFF)] bg-[var(--ptm-accent,#2F6BFF)]"
                : "border-[#c5cdd8] bg-transparent",
            )}
          />
        ))}
      </div>
      {error ? <p className="mb-2 min-h-5 text-center text-sm text-destructive">{error}</p> : null}
      <div className="mx-auto grid max-w-[280px] grid-cols-3 gap-2.5">
        {"123456789".split("").map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => push(k)}
            className="rounded-xl bg-[var(--ptm-card,#fff)] py-4 text-xl font-semibold shadow-sm transition active:bg-[#e8ecf4]"
          >
            {k}
          </button>
        ))}
        <span aria-hidden />
        <button
          type="button"
          onClick={() => push("0")}
          className="rounded-xl bg-[var(--ptm-card,#fff)] py-4 text-xl font-semibold shadow-sm active:bg-[#e8ecf4]"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => push("back")}
          className="rounded-xl bg-[var(--ptm-card,#fff)] py-4 text-sm font-medium text-[var(--ptm-muted)] shadow-sm active:bg-[#e8ecf4]"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
