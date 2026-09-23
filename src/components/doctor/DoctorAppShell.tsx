"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Stethoscope, User } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";
import { parentInitials } from "@/components/parent/parent-telemed-ui";
import "@/components/parent/telemed-theme.css";

function navActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DoctorAppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();
  const auth = t.auth;
  const { displayName } = useAuth();
  const name = displayName || auth.doctorDemoName;

  return (
    <div className="parent-telemed min-h-screen bg-[var(--ptm-bg)] text-[var(--ptm-text)]">
      <div className="border-b border-black/[0.04] bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2 sm:px-6">
          <Link href="/doctor/home" className="flex items-center gap-2 text-base font-extrabold text-[var(--ptm-accent)] sm:text-lg">
            <span aria-hidden>🩺</span>
            {auth.doctorBrand}
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher compact telemed />
            <Link href="/login/mode" className="text-xs font-semibold text-[var(--ptm-muted)] hover:text-[var(--ptm-accent)]">
              {auth.signOutEntry}
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ptm-accent)] to-[var(--ptm-accent-dark)] text-sm font-bold text-white">
              {parentInitials(name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--ptm-muted)]">{auth.doctorWelcome}</p>
              <p className="truncate text-base font-bold sm:text-lg">{name}</p>
            </div>
          </div>
          <Link
            href="/doctor/profile"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
            aria-label={auth.doctorNavProfile}
          >
            <User className="h-5 w-5" strokeWidth={2} />
          </Link>
        </header>

        <div className="mt-6 lg:flex lg:gap-8">
          <aside className="mb-6 hidden shrink-0 lg:block lg:w-52">
            <nav className="space-y-1 rounded-[var(--ptm-radius-md)] bg-[var(--ptm-card)] p-2 shadow-[var(--ptm-shadow-sm)]">
              <SideLink href="/doctor/home" icon={Home} label={auth.doctorNavHome} active={navActive(pathname, "/doctor/home")} />
              <SideLink
                href="/doctor/patients"
                icon={Stethoscope}
                label={auth.doctorNavPatients}
                active={navActive(pathname, "/doctor/patients")}
              />
              <SideLink
                href="/doctor/messages"
                icon={MessageCircle}
                label={auth.doctorNavMessages}
                active={navActive(pathname, "/doctor/messages")}
              />
              <SideLink
                href="/doctor/profile"
                icon={User}
                label={auth.doctorNavProfile}
                active={navActive(pathname, "/doctor/profile")}
              />
            </nav>
          </aside>

          <main className="min-w-0 flex-1 pb-24 lg:max-w-2xl lg:pb-6">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 pt-2 lg:hidden">
        <div className="mx-auto flex max-w-lg justify-between rounded-[28px] bg-[var(--ptm-card)] px-2 py-2 shadow-[var(--ptm-shadow)]">
          <MobileNav href="/doctor/home" icon={Home} label={auth.doctorNavHome} active={navActive(pathname, "/doctor/home")} />
          <MobileNav
            href="/doctor/patients"
            icon={Stethoscope}
            label={auth.doctorNavPatients}
            active={navActive(pathname, "/doctor/patients")}
          />
          <MobileNav
            href="/doctor/messages"
            icon={MessageCircle}
            label={auth.doctorNavMessages}
            active={navActive(pathname, "/doctor/messages")}
          />
          <MobileNav
            href="/doctor/profile"
            icon={User}
            label={auth.doctorNavProfile}
            active={navActive(pathname, "/doctor/profile")}
          />
        </div>
      </nav>
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
