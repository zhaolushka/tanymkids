"use client";

import { notFound, useParams } from "next/navigation";
import { DoctorProfileScreen } from "@/components/parent/DoctorProfileScreen";
import { useI18n } from "@/i18n/LocaleProvider";
import { getDoctorByHandle } from "@/lib/doctors/catalog";
import { localizeDoctor } from "@/lib/doctors/i18n";

export default function DoctorProfilePage() {
  const params = useParams<{ handle: string }>();
  const { locale } = useI18n();
  const raw = getDoctorByHandle(params.handle);
  if (!raw) notFound();
  const doctor = localizeDoctor(raw, locale);

  return <DoctorProfileScreen doctor={doctor} />;
}
