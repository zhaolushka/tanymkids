"use client";

import { DoctorFeedCard } from "@/components/parent/feed/DoctorFeedCard";
import { useI18n } from "@/i18n/LocaleProvider";
import { doctorProfiles } from "@/lib/doctors/catalog";
import { localizeDoctor } from "@/lib/doctors/i18n";

export default function ParentNetworkPage() {
  const { t, locale } = useI18n();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t.parent.networkTitle}</h1>
        <p className="text-sm text-muted-foreground">{t.parent.networkDesc}</p>
      </div>
      <section className="flex flex-col gap-4">
        {doctorProfiles.map((doctor) => (
          <DoctorFeedCard key={doctor.id} doctor={localizeDoctor(doctor, locale)} locale={locale} />
        ))}
      </section>
    </div>
  );
}
