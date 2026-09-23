"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BarChart3, Settings } from "lucide-react";
import { useI18n } from "@/i18n/LocaleProvider";
import { getParentMainNav } from "@/components/parent/parent-nav-icons";

function isActive(pathname: string, href: string): boolean {
  if (href === "/parent/home") return pathname === "/parent/home";
  return pathname === href || pathname.startsWith(`${href}/`);
}

const navIconClass = "h-5 w-5 shrink-0";

export function ParentAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const mainNav = useMemo(() => getParentMainNav(t), [t]);

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <header className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 sm:gap-4">
          <Link href="/parent/home" className="shrink-0 text-lg font-extrabold text-primary sm:text-xl">
            {t.parent.brand}
          </Link>
          <div className="hidden min-w-0 flex-1 sm:block">
            <div className="mx-auto max-w-md rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground">
              {t.parent.searchPlaceholder}
            </div>
          </div>
          <nav className="ml-auto flex items-center gap-1 sm:gap-2">
            {mainNav.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`hidden rounded-lg px-2 py-2 text-xs font-semibold sm:flex sm:flex-col sm:items-center sm:px-3 ${
                  isActive(pathname, item.href)
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <item.Icon className={navIconClass} aria-hidden />
                <span className="mt-0.5 hidden md:inline">{item.label}</span>
              </Link>
            ))}
            <Link
              href="/parent/settings"
              className={`rounded-lg px-2 py-2 sm:px-3 ${
                isActive(pathname, "/parent/settings")
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-muted/60"
              }`}
              aria-label={t.parent.navSettings}
            >
              <Settings className={navIconClass} aria-hidden />
            </Link>
            <Link
              href="/"
              className="rounded-lg px-2 py-2 text-xs font-medium text-muted-foreground hover:bg-muted/60"
            >
              {t.parent.exitKid}
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-6 px-4 py-4">
        <aside className="hidden w-52 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1 rounded-xl border border-border bg-card p-2 shadow-sm">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive(pathname, item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                <item.Icon className={navIconClass} aria-hidden />
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-border" />
            <Link
              href="/parent/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                pathname === "/parent/dashboard"
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted/50"
              }`}
            >
              <BarChart3 className={navIconClass} aria-hidden />
              {t.parent.childStats}
            </Link>
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-20 lg:max-w-2xl lg:pb-4">{children}</main>

        <aside className="hidden w-64 shrink-0 xl:block">
          <div className="sticky top-20 space-y-3">
            <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
                {t.parent.tipTitle}
              </p>
              <p className="mt-2 text-sm text-foreground">{t.parent.tipBody}</p>
            </div>
          </div>
        </aside>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card lg:hidden">
        <div className="mx-auto flex max-w-lg justify-around px-2 py-2">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold ${
                isActive(pathname, item.href) ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.Icon className="h-6 w-6" aria-hidden />
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
