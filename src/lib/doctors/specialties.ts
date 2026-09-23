import type { Locale } from "@/i18n/types";
import type { DoctorSpecialtyId } from "@/types/doctor";

const labelsKk: Record<DoctorSpecialtyId, string> = {
  lfk: "ЛФК / физиотерапия",
  speech: "Логопед",
  neuro: "Нейропсихолог",
  pediatric: "Педиатр",
  psychology: "Психолог",
  nutrition: "Диетолог",
};

const labelsRu: Record<DoctorSpecialtyId, string> = {
  lfk: "ЛФК / физиотерапия",
  speech: "Логопед",
  neuro: "Нейропсихолог",
  pediatric: "Педиатр",
  psychology: "Психолог",
  nutrition: "Диетолог",
};

export function getSpecialtyLabel(id: DoctorSpecialtyId, locale: Locale = "kk"): string {
  const map = locale === "ru" ? labelsRu : labelsKk;
  return map[id] ?? id;
}
