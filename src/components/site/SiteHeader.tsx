"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/i18n/LocaleProvider";

export function SiteHeader({ loginHref = "/login/mode" }: { loginHref?: string }) {
  const { t } = useI18n();
  const L = t.landing;

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.04] bg-[var(--ptm-card)]/95 shadow-[var(--ptm-shadow-sm)] backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-[var(--ptm-accent)]">
          <span className="text-xl" aria-hidden>
            🐻
          </span>
          <span>TanymKids</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--ptm-muted)] sm:flex">
          <a href="/#about" className="hover:text-[var(--ptm-accent)]">
            {L.navAbout}
          </a>
          <a href="/#news" className="hover:text-[var(--ptm-accent)]">
            {L.navNews}
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact telemed />
          <Link
            href={loginHref}
            className="rounded-xl bg-[var(--ptm-accent)] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_16px_rgba(47,107,255,0.35)] hover:bg-[var(--ptm-accent-dark)]"
          >
            {L.navLogin}
          </Link>
        </div>
      </div>
    </header>
  );
}
