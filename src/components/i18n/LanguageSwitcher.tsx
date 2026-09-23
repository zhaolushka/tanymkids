"use client";

import { localeLabels, type Locale } from "@/i18n/types";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
  telemed?: boolean;
};

export function LanguageSwitcher({ className, compact, telemed }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  const buttonClass = (active: boolean) =>
    cn(
      "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
      telemed
        ? active
          ? "bg-[#2f6bff] text-white"
          : "text-[#8b93a7] hover:bg-[#f4f6fb]"
        : active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/60",
    );

  const set = (next: Locale) => () => setLocale(next);

  if (compact) {
    return (
      <div
        className={cn(
          "flex items-center gap-1 rounded-lg border p-0.5",
          telemed ? "border-black/5 bg-white shadow-sm" : "border-border bg-background",
          className,
        )}
      >
        {(Object.keys(localeLabels) as Locale[]).map((code) => (
          <button key={code} type="button" className={buttonClass(locale === code)} onClick={set(code)}>
            {code === "kk" ? "ҚАЗ" : "РУС"}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn("flex gap-2", telemed && "rounded-lg border border-black/5 bg-white p-1 shadow-sm")}>
        {(Object.keys(localeLabels) as Locale[]).map((code) => (
          <button key={code} type="button" className={buttonClass(locale === code)} onClick={set(code)}>
            {localeLabels[code]}
          </button>
        ))}
      </div>
    </div>
  );
}
