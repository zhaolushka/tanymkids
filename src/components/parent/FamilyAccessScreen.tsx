"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Clock,
  HelpCircle,
  Lock,
  Plus,
  Shield,
  UserRound,
} from "lucide-react";
import { parentInitials, PtmCard } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";
import type { Locale } from "@/i18n/types";

type AccessLevel = "full" | "temporary" | "view";

const people: {
  id: string;
  name: Record<Locale, string>;
  role: Record<Locale, string>;
  level: AccessLevel;
  isYou?: boolean;
}[] = [
  {
    id: "p1",
    name: { kk: "Айгерім", ru: "Айгерим" },
    role: { kk: "Ата-ана", ru: "Родитель" },
    level: "full",
    isYou: true,
  },
  {
    id: "p2",
    name: { kk: "Ерлан", ru: "Ерлан" },
    role: { kk: "Қамқоршы", ru: "Опекун" },
    level: "full",
  },
];

const doctorsAccess: {
  id: string;
  name: Record<Locale, string>;
  statusActive: Record<Locale, string>;
  statusEnded: Record<Locale, string>;
  defaultOn: boolean;
}[] = [
  {
    id: "dr-ainur-lfk",
    name: { kk: "Айнур Қасымова", ru: "Айнур Касымова" },
    statusActive: { kk: "Емдеу кезінде белсенді", ru: "Активен во время лечения" },
    statusEnded: { kk: "Доступ аяқталды", ru: "Доступ завершён" },
    defaultOn: true,
  },
  {
    id: "dr-marat-logoped",
    name: { kk: "Марат Бекенов", ru: "Марат Бекенов" },
    statusActive: { kk: "Емдеу кезінде белсенді", ru: "Активен во время лечения" },
    statusEnded: { kk: "Доступ аяқталды", ru: "Доступ завершён" },
    defaultOn: false,
  },
];

const logEntries: { id: string; text: Record<Locale, string> }[] = [
  {
    id: "l1",
    text: {
      kk: "Айнур Қасымова медициналық тарихты қарады — 2 күн бұрын",
      ru: "Айнур Касымова просмотрела медицинскую историю — 2 дня назад",
    },
  },
  {
    id: "l2",
    text: {
      kk: "Айгерім сабақ статистикасын ашты — 5 күн бұрын",
      ru: "Айгерим открыла статистику занятий — 5 дней назад",
    },
  },
];

function AccessBadge({ level, labels }: { level: AccessLevel; labels: Record<AccessLevel, string> }) {
  const styles: Record<AccessLevel, string> = {
    full: "bg-[var(--ptm-accent)]/10 text-[var(--ptm-accent)]",
    temporary: "bg-amber-100 text-amber-800",
    view: "bg-[var(--ptm-bg)] text-[var(--ptm-muted)]",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[level]}`}>
      {labels[level]}
    </span>
  );
}

function IosToggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-[var(--ptm-accent)]" : "bg-[var(--ptm-muted)]/30"}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? "left-[22px]" : "left-0.5"}`}
      />
    </button>
  );
}

export function FamilyAccessScreen() {
  const { t, locale } = useI18n();
  const fa = t.familyAccess;
  const [showInvite, setShowInvite] = useState(false);
  const [inviteValue, setInviteValue] = useState("");
  const [doctorAccess, setDoctorAccess] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(doctorsAccess.map((d) => [d.id, d.defaultOn])),
  );

  const badgeLabels: Record<AccessLevel, string> = {
    full: fa.badgeFull,
    temporary: fa.badgeTemporary,
    view: fa.badgeViewOnly,
  };

  const childName = fa.childName;

  return (
    <div className="mx-auto w-full max-w-md space-y-5 pb-8">
      <header className="flex items-center justify-between gap-2">
        <Link
          href="/parent/profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
          aria-label={fa.back}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="flex-1 text-center text-sm font-bold sm:text-base">{fa.title}</h1>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
          aria-label={fa.helpHint}
          title={fa.helpHint}
        >
          <HelpCircle className="h-5 w-5 text-[var(--ptm-muted)]" />
        </button>
      </header>

      <PtmCard className="flex items-center gap-3 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ptm-accent)]/80 to-[var(--ptm-accent-dark)] text-sm font-bold text-white">
          {parentInitials(childName)}
        </div>
        <div>
          <p className="font-bold text-[var(--ptm-text)]">
            {childName}
            {fa.profileAccessTitle}
          </p>
          <p className="text-xs text-[var(--ptm-muted)]">{fa.profileAccessSubtitle}</p>
        </div>
      </PtmCard>

      <section>
        <h2 className="mb-2 px-1 text-sm font-bold text-[var(--ptm-text)]">{fa.peopleWithAccess}</h2>
        <ul className="space-y-2">
          {people.map((person) => (
            <li key={person.id}>
              <PtmCard className="flex items-center gap-3 p-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ptm-bg)] text-[var(--ptm-accent)]">
                  <UserRound className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 font-semibold text-sm">
                    {person.name[locale]}
                    {person.isYou && (
                      <span className="rounded-full bg-[var(--ptm-accent)] px-2 py-0.5 text-[10px] font-bold text-white">
                        {fa.youBadge}
                      </span>
                    )}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-[var(--ptm-muted)]">
                    {person.role[locale]} · {badgeLabels[person.level]}
                    <Lock className="h-3 w-3 shrink-0" aria-hidden />
                  </p>
                </div>
                <AccessBadge level={person.level} labels={badgeLabels} />
              </PtmCard>
            </li>
          ))}
        </ul>
      </section>

      <section>
        {!showInvite ? (
          <button
            type="button"
            onClick={() => setShowInvite(true)}
            className="flex w-full items-center justify-center gap-2 rounded-[var(--ptm-radius-md)] border-2 border-dashed border-[var(--ptm-accent)]/40 bg-[var(--ptm-card)] py-3.5 text-sm font-bold text-[var(--ptm-accent)] shadow-[var(--ptm-shadow-sm)]"
          >
            <Plus className="h-5 w-5" aria-hidden />
            {fa.inviteMember}
          </button>
        ) : (
          <PtmCard className="p-4">
            <p className="text-sm font-bold">{fa.inviteMember}</p>
            <p className="mt-1 text-xs text-[var(--ptm-muted)]">{fa.inviteHint}</p>
            <input
              type="email"
              value={inviteValue}
              onChange={(e) => setInviteValue(e.target.value)}
              placeholder={fa.invitePlaceholder}
              className="mt-3 w-full rounded-xl bg-[var(--ptm-bg)] px-3 py-2.5 text-sm outline-none ring-1 ring-black/5 focus:ring-[var(--ptm-accent)]"
            />
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-xl bg-[var(--ptm-accent)] py-2.5 text-sm font-bold text-white"
                onClick={() => {
                  setInviteValue("");
                  setShowInvite(false);
                }}
              >
                {fa.sendInvite}
              </button>
              <button
                type="button"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--ptm-muted)]"
                onClick={() => setShowInvite(false)}
              >
                {fa.cancel}
              </button>
            </div>
          </PtmCard>
        )}
      </section>

      <section>
        <h2 className="mb-2 px-1 text-sm font-bold">{fa.doctorAccess}</h2>
        <ul className="space-y-2">
          {doctorsAccess.map((doc) => {
            const on = doctorAccess[doc.id] ?? false;
            return (
              <li key={doc.id}>
                <PtmCard className="flex items-center gap-3 p-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--ptm-bg)] text-xs font-bold text-[var(--ptm-accent)]">
                    {parentInitials(doc.name[locale])}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{doc.name[locale]}</p>
                    <p className="text-xs text-[var(--ptm-muted)]">
                      {on ? doc.statusActive[locale] : doc.statusEnded[locale]}
                    </p>
                    <AccessBadge level={on ? "temporary" : "view"} labels={badgeLabels} />
                  </div>
                  <IosToggle
                    checked={on}
                    onChange={(v) => setDoctorAccess((s) => ({ ...s, [doc.id]: v }))}
                    label={doc.name[locale]}
                  />
                </PtmCard>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <h2 className="mb-2 px-1 text-sm font-bold">{fa.accessLog}</h2>
        <PtmCard className="divide-y divide-[var(--ptm-bg)] p-0">
          {logEntries.map((entry) => (
            <div key={entry.id} className="flex gap-2 px-4 py-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--ptm-muted)]" aria-hidden />
              <p className="text-xs leading-relaxed text-[var(--ptm-muted)]">{entry.text[locale]}</p>
            </div>
          ))}
        </PtmCard>
      </section>

      <PtmCard className="flex gap-3 p-4">
        <Shield className="h-6 w-6 shrink-0 text-[var(--ptm-accent)]" aria-hidden />
        <div>
          <p className="text-sm leading-relaxed text-[var(--ptm-text)]">{fa.privacyNote}</p>
          <Link href="/parent/settings" className="mt-2 inline-block text-sm font-bold text-[var(--ptm-accent)]">
            {fa.privacyPolicy}
          </Link>
        </div>
      </PtmCard>
    </div>
  );
}
