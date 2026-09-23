"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Calendar,
  Hand,
  Home,
  MessageCircle,
  Plus,
  Search,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { parentInitials } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";
import "./telemed-theme.css";

function navActive(pathname: string, href: string): boolean {
  if (href === "/parent/home") {
    return pathname === "/parent/home" || pathname === "/parent";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function ParentAppShell({
  children,
  doctorMode,
}: {
  children: React.ReactNode;
  doctorMode?: boolean;
}) {
  const pathname = usePathname();
  const { t } = useI18n();
  const tm = t.telemed;

  const isDoctorDetail = /^\/parent\/doctors\/[^/]+$/.test(pathname);
  const isFamilyAccess = pathname === "/parent/family-access";
  const isFocusPage = isDoctorDetail || isFamilyAccess;
  const hideWelcome = isFocusPage;
  const hideSearch = pathname.startsWith("/parent/settings") || isFocusPage;
  const hideMobileNav = isDoctorDetail;

  return (
    <div className="parent-telemed min-h-screen bg-[var(--ptm-bg)] text-[var(--ptm-text)]">
      <div className="border-b border-black/[0.04] bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <Link href="/parent/home" className="text-base font-extrabold text-[var(--ptm-accent)] sm:text-lg">
            {t.parent.brand}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact telemed />
            <Link
              href="/"
              className="hidden text-xs font-semibold text-[var(--ptm-muted)] hover:text-[var(--ptm-accent)] sm:inline"
            >
              {t.landing.navAbout}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
        {!hideWelcome && (
          <header className="flex items-center justify-between gap-3">
            <Link href="/parent/profile" className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ptm-accent)] to-[var(--ptm-accent-dark)] text-sm font-bold text-white">
                {parentInitials(tm.userName)}
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[var(--ptm-muted)]">{tm.welcomeBack}</p>
                <p className="flex items-center gap-1.5 truncate text-base font-bold sm:text-lg">
                  {tm.userName}
                  <Hand className="h-4 w-4 shrink-0 text-[var(--ptm-accent)]" aria-hidden />
                </p>
              </div>
            </Link>
            <Link
              href="/parent/settings"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
              aria-label={tm.notifications}
            >
              <Bell className="h-5 w-5" strokeWidth={2} />
            </Link>
          </header>
        )}

        {!hideSearch && (
          <div className="mt-5 flex gap-2.5">
            <label className="flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl bg-[var(--ptm-card)] px-4 py-3.5 shadow-[var(--ptm-shadow-sm)]">
              <Search className="h-5 w-5 shrink-0 text-[var(--ptm-muted)]" strokeWidth={2} />
              <span className="sr-only">{tm.search}</span>
              <input
                type="search"
                placeholder={t.parent.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--ptm-muted)]"
              />
            </label>
            <Link
              href="/parent/network"
              className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
              aria-label={tm.filters}
            >
              <SlidersHorizontal className="h-5 w-5" strokeWidth={2} />
            </Link>
          </div>
        )}

        <div className={`lg:flex lg:gap-8 ${isFocusPage ? "mt-0" : "mt-6"}`}>
          <aside className="mb-6 hidden shrink-0 lg:block lg:w-52">
            <nav className="space-y-1 rounded-[var(--ptm-radius-md)] bg-[var(--ptm-card)] p-2 shadow-[var(--ptm-shadow-sm)]">
              <SideLink href="/parent/home" icon={Home} label={tm.navHome} active={navActive(pathname, "/parent/home")} />
              <SideLink
                href="/parent/messages"
                icon={MessageCircle}
                label={tm.navMessage}
                active={navActive(pathname, "/parent/messages")}
              />
              <SideLink
                href="/parent/network"
                icon={Plus}
                label={tm.navNew}
                active={navActive(pathname, "/parent/network")}
              />
              <SideLink
                href="/parent/dashboard"
                icon={Calendar}
                label={tm.navBooking}
                active={navActive(pathname, "/parent/dashboard")}
              />
              <SideLink
                href="/parent/profile"
                icon={User}
                label={tm.navProfile}
                active={
                  navActive(pathname, "/parent/profile") ||
                  navActive(pathname, "/parent/settings") ||
                  pathname.startsWith("/parent/doctors")
                }
              />
            </nav>
          </aside>

          <main
            className={`min-w-0 flex-1 lg:max-w-2xl ${isFocusPage ? "pb-4 lg:pb-6" : "pb-24 lg:pb-6"}`}
          >
            {children}
          </main>
        </div>
      </div>

      {!hideMobileNav && (
      <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2 lg:hidden">
        <div className="mx-auto flex max-w-lg items-end justify-between rounded-[28px] bg-[var(--ptm-card)] px-2 py-2 shadow-[var(--ptm-shadow)]">
          <MobileNav href="/parent/home" icon={Home} label={tm.navHome} active={navActive(pathname, "/parent/home")} />
          <MobileNav
            href="/parent/messages"
            icon={MessageCircle}
            label={tm.navMessage}
            active={navActive(pathname, "/parent/messages")}
          />
          <Link
            href="/parent/network"
            className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ptm-accent)] to-[var(--ptm-accent-dark)] text-white shadow-[0_8px_24px_rgba(47,107,255,0.45)]"
            aria-label={tm.navNew}
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </Link>
          <MobileNav
            href="/parent/dashboard"
            icon={Calendar}
            label={tm.navBooking}
            active={navActive(pathname, "/parent/dashboard")}
          />
          <MobileNav
            href="/parent/profile"
            icon={User}
            label={tm.navProfile}
            active={navActive(pathname, "/parent/profile") || pathname.startsWith("/parent/doctors")}
          />
        </div>
      </nav>
      )}
    </div>
  );
}

function SideLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: typeof Home;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
        active
          ? "bg-[var(--ptm-accent)]/10 text-[var(--ptm-accent)]"
          : "text-[var(--ptm-text)] hover:bg-[var(--ptm-bg)]"
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  );
}

function MobileNav({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: typeof Home;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-1 flex-col items-center gap-0.5 py-1 text-[10px] font-semibold ${
        active ? "text-[var(--ptm-accent)]" : "text-[var(--ptm-muted)]"
      }`}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
      {label}
    </Link>
  );
}
