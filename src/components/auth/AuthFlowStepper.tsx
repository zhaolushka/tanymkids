"use client";

import { cn } from "@/lib/utils";

export type AuthFlowStep = 1 | 2 | 3 | 4;

export function AuthFlowStepper({
  current,
  labels,
}: {
  current: AuthFlowStep;
  labels: readonly string[];
}) {
  return (
    <nav aria-label="Progress" className="mb-6">
      <ol className="flex items-center justify-between gap-1 text-[10px] font-bold sm:text-xs">
        {labels.map((label, i) => {
          const step = (i + 1) as AuthFlowStep;
          const done = step < current;
          const active = step === current;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-1">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full border-2 text-[11px] sm:h-8 sm:w-8",
                  done && "border-[var(--ptm-accent,#2F6BFF)] bg-[var(--ptm-accent,#2F6BFF)] text-white",
                  active &&
                    "border-[var(--ptm-accent,#2F6BFF)] bg-white text-[var(--ptm-accent,#2F6BFF)]",
                  !done &&
                    !active &&
                    "border-[#d1d5db] bg-white text-[var(--ptm-muted)]",
                )}
              >
                {done ? "✓" : step}
              </span>
              <span
                className={cn(
                  "max-w-[4.5rem] text-center leading-tight",
                  active ? "text-[var(--ptm-text)]" : "text-[var(--ptm-muted)]",
                )}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
