"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { BadgeCheck } from "lucide-react";
import { DoctorAvatar } from "@/components/parent/DoctorAvatar";
import { useI18n } from "@/i18n/LocaleProvider";
import { getDoctorByHandle } from "@/lib/doctors/catalog";
import { localizeDoctor } from "@/lib/doctors/i18n";
import { getSpecialtyLabel } from "@/lib/doctors/specialties";

export default function DoctorProfilePage() {
  const params = useParams<{ handle: string }>();
  const { t, locale } = useI18n();
  const raw = getDoctorByHandle(params.handle);
  if (!raw) notFound();
  const doctor = localizeDoctor(raw, locale);

  return (
    <div className="flex flex-col gap-6 pb-10">
      <Link href="/parent/network" className="text-sm text-primary hover:underline">
        ← {t.parent.backToNetwork}
      </Link>

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="rounded-full bg-gradient-to-tr from-kid-orange via-kid-pink to-primary p-1">
          <DoctorAvatar
            fullName={doctor.fullName}
            className="h-24 w-24 border-4 border-card bg-card text-2xl"
          />
        </div>
        <div>
          <h1 className="flex items-center justify-center gap-1.5 text-xl font-bold">
            {doctor.fullName}
            {doctor.verified && (
              <BadgeCheck className="h-5 w-5 shrink-0 text-primary" aria-label={t.parent.verified} />
            )}
          </h1>
          <p className="text-sm text-muted-foreground">
            @{doctor.handle} · {getSpecialtyLabel(doctor.specialtyId, locale)}
          </p>
          <p className="text-sm text-muted-foreground">{doctor.city}</p>
        </div>
      </div>

      <p className="text-sm leading-relaxed">{doctor.bioShort}</p>

      <div>
        <h2 className="mb-2 text-sm font-bold">{t.parent.qualifications}</h2>
        <ul className="space-y-2">
          {doctor.qualifications.map((q) => (
            <li
              key={q.id}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm"
            >
              {q.title}
              {q.year ? <span className="text-muted-foreground"> — {q.year}</span> : null}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">{t.parent.diplomaLater}</p>
      </div>
    </div>
  );
}
