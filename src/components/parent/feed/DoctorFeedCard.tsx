"use client";

import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { DoctorAvatar } from "@/components/parent/DoctorAvatar";
import type { Locale } from "@/i18n/types";
import { getSpecialtyLabel } from "@/lib/doctors/specialties";
import type { LocalizedDoctor } from "@/lib/doctors/i18n";
import { useI18n } from "@/i18n/LocaleProvider";

interface DoctorFeedCardProps {
  doctor: LocalizedDoctor;
  locale: Locale;
}

export function DoctorFeedCard({ doctor, locale }: DoctorFeedCardProps) {
  const { t } = useI18n();

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <header className="flex items-center gap-3 px-3 py-2.5">
        <DoctorAvatar fullName={doctor.fullName} className="h-10 w-10 text-sm" />
        <div className="min-w-0 flex-1">
          <Link
            href={`/parent/doctors/${doctor.handle}`}
            className="flex items-center gap-1 text-sm font-bold text-foreground hover:underline"
          >
            {doctor.fullName}
            {doctor.verified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-primary"
                aria-label={t.parent.verified}
              />
            )}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {getSpecialtyLabel(doctor.specialtyId, locale)} · {doctor.city}
          </p>
        </div>
      </header>

      <Link href={`/parent/doctors/${doctor.handle}`} className="block">
        <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary/15 via-kid-blue/20 to-kid-pink/15 px-6 text-center">
          <p className="text-sm font-medium text-foreground/90">{doctor.bioShort}</p>
        </div>
      </Link>

      <div className="space-y-2 px-3 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-bold text-foreground">@{doctor.handle}</span> {doctor.bioShort}
        </p>
        {doctor.qualifications.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {doctor.qualifications.map((q) => (
              <span
                key={q.id}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary"
              >
                {q.title}
                {q.year ? ` · ${q.year}` : ""}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
