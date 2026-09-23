"use client";

import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useI18n } from "@/i18n/LocaleProvider";
import "@/components/parent/telemed-theme.css";

export function AuthPageShell({
  children,
  showMascot = true,
  hideBackLink = false,
}: {
  children: React.ReactNode;
  showMascot?: boolean;
  hideBackLink?: boolean;
}) {
  const { t } = useI18n();
  return (
    <div className="parent-telemed flex min-h-screen flex-col bg-[var(--ptm-bg)] text-[var(--ptm-text)]">
      <SiteHeader loginHref="/login/mode" />
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-6 py-8 sm:py-10">
        {showMascot && (
          <p className="mb-2 text-center text-5xl sm:text-6xl" aria-hidden>
            🐻
          </p>
        )}
        {children}
        {!hideBackLink && (
          <p className="mt-auto pt-8 text-center">
            <Link href="/" className="text-sm font-semibold text-[var(--ptm-accent)] hover:underline">
              {t.auth.backHome}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
