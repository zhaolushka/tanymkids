import type { Locale } from "@/i18n/types";
import type { DoctorProfile } from "@/types/doctor";

const bios: Record<string, Record<Locale, string>> = {
  "dr-ainur-lfk": {
    kk: "Балалар ЛФК — үйде қимыл, дене қалыпы, жеңіл жаттығулар.",
    ru: "Детская ЛФК — движение дома, осанка, простые упражнения.",
  },
  "dr-marat-logoped": {
    kk: "Логопед: дыбыс, сөйлеу, саусақ жаттығуларымен байланыс.",
    ru: "Логопед: звуки, речь, связь с пальчиковой гимнастикой.",
  },
  "dr-dana-neuro": {
    kk: "Нейропсихолог: назар, моторика, познавательное даму.",
    ru: "Нейропсихолог: внимание, моторика, познавательное развитие.",
  },
  "dr-erlan-ped": {
    kk: "Педиатр: даму мониторингі, ата-аналарға кеңес.",
    ru: "Педиатр: мониторинг развития, консультации для родителей.",
  },
};

const qualTitles: Record<string, Record<string, Record<Locale, string>>> = {
  "dr-ainur-lfk": {
    q1: { kk: "ЛФК маманы", ru: "Специалист по ЛФК" },
    q2: { kk: "Балаларды оңалту курсы", ru: "Курс детской реабилитации" },
  },
  "dr-marat-logoped": {
    q1: { kk: "Логопед-дефектолог", ru: "Логопед-дефектолог" },
    q2: { kk: "AR-терапия сертификаты", ru: "Сертификат AR-терапии" },
  },
  "dr-dana-neuro": {
    q1: { kk: "Нейропсихолог", ru: "Нейропсихолог" },
    q2: { kk: "Сенсорлық интеграция", ru: "Сенсорная интеграция" },
  },
  "dr-erlan-ped": {
    q1: { kk: "Педиатр", ru: "Педиатр" },
    q2: { kk: "Даму скринингі", ru: "Скрининг развития" },
  },
};

export type LocalizedDoctor = DoctorProfile & { bioShort: string };

export function localizeDoctor(doctor: DoctorProfile, locale: Locale): LocalizedDoctor {
  const bioShort = bios[doctor.id]?.[locale] ?? doctor.bioShort;
  const qMap = qualTitles[doctor.id];
  const qualifications = doctor.qualifications.map((q) => ({
    ...q,
    title: qMap?.[q.id]?.[locale] ?? q.title,
  }));
  return { ...doctor, bioShort, qualifications };
}
