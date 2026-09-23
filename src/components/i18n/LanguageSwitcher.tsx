"use client";

import { localeLabels, type Locale } from "@/i18n/types";
import { useI18n } from "@/i18n/LocaleProvider";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export function LanguageSwitcher({ className, compact }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();

  const buttonClass = (active: boolean) =>
    cn(
      "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
      active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted/60",
    );

  const set = (next: Locale) => () => setLocale(next);

  if (compact) {
    return (
      <div className={cn("flex items-center gap-1 rounded-lg border border-border bg-background p-0.5", className)}>
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
      <div className="flex gap-2">
        {(Object.keys(localeLabels) as Locale[]).map((code) => (
          <button key={code} type="button" className={buttonClass(locale === code)} onClick={set(code)}>
            {localeLabels[code]}
          </button>
        ))}
      </div>
    </div>
  );
}
