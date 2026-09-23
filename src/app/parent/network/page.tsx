"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  PtmDoctorRow,
  PtmPageTitle,
  parentDoctorRating,
  parentDoctorReviews,
  parentInitials,
} from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";
import { doctorProfiles } from "@/lib/doctors/catalog";
import { filterDoctorsBySpecParam } from "@/lib/doctors/filter-by-spec";
import { localizeDoctor } from "@/lib/doctors/i18n";
import { getSpecialtyLabel } from "@/lib/doctors/specialties";

function NetworkList() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();
  const spec = searchParams.get("spec");

  const doctors = useMemo(() => {
    const filtered = filterDoctorsBySpecParam(doctorProfiles, spec);
    return filtered.map((d) => {
      const doc = localizeDoctor(d, locale);
      return {
        href: `/parent/doctors/${doc.handle}`,
        name: doc.fullName,
        role: getSpecialtyLabel(doc.specialtyId, locale),
        initials: parentInitials(doc.fullName),
        rating: parentDoctorRating(doc.verified, doc.qualifications.length),
        reviews: parentDoctorReviews(doc.qualifications.length),
      };
    });
  }, [locale, spec]);

  return (
    <>
      <PtmPageTitle title={t.parent.networkTitle} subtitle={t.parent.networkDesc} />
      <ul className="space-y-3">
        {doctors.map((doc) => (
          <li key={doc.href}>
            <PtmDoctorRow {...doc} reviewsLabel={t.telemed.reviews} />
          </li>
        ))}
      </ul>
      {doctors.length === 0 && (
        <p className="py-8 text-center text-sm text-[var(--ptm-muted)]">{t.parent.soon}</p>
      )}
    </>
  );
}

export default function ParentNetworkPage() {
  return (
    <Suspense fallback={<div className="h-24 animate-pulse rounded-2xl bg-[var(--ptm-card)]" />}>
      <NetworkList />
    </Suspense>
  );
}
