"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Brain,
  LayoutGrid,
  ScanLine,
  Stethoscope,
  Video,
  type LucideIcon,
} from "lucide-react";
import {
  PtmDoctorRow,
  PtmSectionTitle,
  parentDoctorRating,
  parentDoctorReviews,
  parentInitials,
} from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";
import { doctorProfiles } from "@/lib/doctors/catalog";
import { localizeDoctor } from "@/lib/doctors/i18n";
import { getSpecialtyLabel } from "@/lib/doctors/specialties";

export function ParentHomeTelemed() {
  const { t, locale } = useI18n();
  const tm = t.telemed;
  const [slideIndex, setSlideIndex] = useState(0);

  const featured = localizeDoctor(doctorProfiles[0]!, locale);

  const specialties = useMemo(
    (): { label: string; Icon: LucideIcon; href: string }[] => [
      { label: tm.specAll, Icon: LayoutGrid, href: "/parent/network" },
      { label: tm.specGeneral, Icon: Stethoscope, href: "/parent/network?spec=general" },
      { label: tm.specNeuro, Icon: Brain, href: "/parent/network?spec=neuro" },
      { label: tm.specRadio, Icon: ScanLine, href: "/parent/network?spec=radio" },
    ],
    [tm],
  );

  const recommended = useMemo(
    () =>
      doctorProfiles.slice(0, 3).map((d) => {
        const doc = localizeDoctor(d, locale);
        return {
          href: `/parent/doctors/${doc.handle}`,
          name: doc.fullName,
          role: getSpecialtyLabel(doc.specialtyId, locale),
          initials: parentInitials(doc.fullName),
          rating: parentDoctorRating(doc.verified, doc.qualifications.length),
          reviews: parentDoctorReviews(doc.qualifications.length),
        };
      }),
    [locale],
  );

  return (
    <div className="flex flex-col gap-7">
      <section>
        <div className="parent-telemed__featured overflow-hidden rounded-[var(--ptm-radius-lg)] p-4 text-white shadow-[var(--ptm-shadow)] sm:p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-white/80">{tm.featured}</p>
          <div className="mt-3 flex gap-3 sm:gap-4">
            <Link
              href={`/parent/doctors/${featured.handle}`}
              className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold backdrop-blur-sm sm:h-20 sm:w-20"
            >
              {parentInitials(featured.fullName)}
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/parent/doctors/${featured.handle}`} className="block">
                <h2 className="text-lg font-bold leading-tight sm:text-xl">{featured.fullName}</h2>
              </Link>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90">
                <Stethoscope className="h-4 w-4 shrink-0" aria-hidden />
                {getSpecialtyLabel(featured.specialtyId, locale)} · {featured.city}
              </p>
              <p className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold">
                {tm.startsIn}
              </p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/20 pt-4">
            <p className="text-sm font-semibold">
              <span className="text-2xl font-bold">{tm.price}</span>
              <span className="text-white/80">{tm.perSession}</span>
            </p>
            <Link
              href="/parent/messages"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[var(--ptm-accent)] shadow-sm"
            >
              <Video className="h-4 w-4" aria-hidden />
              {tm.joinCall}
            </Link>
          </div>
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              aria-label={`${tm.slide} ${i + 1}`}
              onClick={() => setSlideIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                slideIndex === i ? "w-6 bg-[var(--ptm-accent)]" : "w-1.5 bg-[var(--ptm-muted)]/40"
              }`}
            />
          ))}
        </div>
      </section>

      <section>
        <PtmSectionTitle title={tm.specialityTitle} moreLabel={tm.more} />
        <div className="parent-telemed__chips-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {specialties.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--ptm-card)] px-4 py-2.5 text-sm font-semibold text-[var(--ptm-text)] shadow-[var(--ptm-shadow-sm)]"
            >
              <s.Icon className="h-4 w-4 shrink-0 text-[var(--ptm-accent)]" aria-hidden />
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <PtmSectionTitle title={tm.recommendTitle} moreLabel={tm.more} />
        <ul className="space-y-3">
          {recommended.map((doc) => (
            <li key={doc.href}>
              <PtmDoctorRow {...doc} reviewsLabel={tm.reviews} />
            </li>
          ))}
        </ul>
        <Link
          href="/parent/network"
          className="mt-4 block text-center text-sm font-bold text-[var(--ptm-accent)] hover:underline"
        >
          {t.parent.messagesFindDoctor}
        </Link>
      </section>
    </div>
  );
}
