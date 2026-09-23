import type { Locale } from "@/i18n/types";

export type DoctorReview = {
  id: string;
  authorName: string;
  rating: number;
  text: Record<Locale, string>;
  date: string;
};

export type DoctorScheduleDay = {
  dayKey: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  hours: string;
};

export type DoctorExtendedDetails = {
  patientCount: number;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  licenseMasked: string;
  licenseIssued: string;
  about: Record<Locale, string>;
  schedule: DoctorScheduleDay[];
  reviews: DoctorReview[];
};

const details: Record<string, DoctorExtendedDetails> = {
  "dr-ainur-lfk": {
    patientCount: 840,
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 128,
    licenseMasked: "MD-••••-4521",
    licenseIssued: "2018-03-15",
    about: {
      kk: "Балалар ЛФК және үйде оңалту. ДЗР бар балаларға қимыл жаттығулары, posture және моторика. TanymKids сабақтарымен байланысты жоспар.",
      ru: "Детская ЛФК и домашняя реабилитация. Упражнения для детей с ОВЗ, осанка и моторика. План занятий связан с уроками TanymKids.",
    },
    schedule: [
      { dayKey: "mon", hours: "09:00 – 17:00" },
      { dayKey: "tue", hours: "09:00 – 17:00" },
      { dayKey: "wed", hours: "10:00 – 18:00" },
      { dayKey: "thu", hours: "09:00 – 17:00" },
      { dayKey: "fri", hours: "09:00 – 15:00" },
      { dayKey: "sat", hours: "10:00 – 14:00" },
      { dayKey: "sun", hours: "—" },
    ],
    reviews: [
      {
        id: "r1",
        authorName: "Алия К.",
        rating: 5,
        date: "2026-02-10",
        text: {
          kk: "Бalaмыз TanymKids-пен бірге жаттығады — Айнур маманы өте түсінікті түсіндіреді.",
          ru: "Ребёнок занимается с TanymKids — доктор Айнур всё объясняет очень понятно.",
        },
      },
      {
        id: "r2",
        authorName: "Serik M.",
        rating: 5,
        date: "2026-01-22",
        text: {
          kk: "Онлайн консультация ыңғайлы, жаттығулар нақты.",
          ru: "Онлайн-консультация удобная, упражнения конкретные.",
        },
      },
    ],
  },
  "dr-marat-logoped": {
    patientCount: 620,
    experienceYears: 10,
    rating: 4.8,
    reviewCount: 96,
    licenseMasked: "MD-••••-3310",
    licenseIssued: "2016-06-01",
    about: {
      kk: "Логopedия, дыбыс және сөйлеу. Саусақ гимнастикасымен кешенді жұмыс.",
      ru: "Логопедия, звуки и речь. Комплексная работа с пальчиковой гимнастикой.",
    },
    schedule: [
      { dayKey: "mon", hours: "10:00 – 18:00" },
      { dayKey: "tue", hours: "10:00 – 18:00" },
      { dayKey: "wed", hours: "—" },
      { dayKey: "thu", hours: "10:00 – 18:00" },
      { dayKey: "fri", hours: "10:00 – 16:00" },
      { dayKey: "sat", hours: "11:00 – 14:00" },
      { dayKey: "sun", hours: "—" },
    ],
    reviews: [
      {
        id: "r1",
        authorName: "Dana T.",
        rating: 5,
        date: "2026-02-01",
        text: { kk: "Керемет маман!", ru: "Отличный специалист!" },
      },
    ],
  },
  "dr-dana-neuro": {
    patientCount: 410,
    experienceYears: 7,
    rating: 4.7,
    reviewCount: 74,
    licenseMasked: "MD-••••-2890",
    licenseIssued: "2019-09-12",
    about: {
      kk: "Нейропсихология, назар және кognitiv даму.",
      ru: "Нейропсихология, внимание и познавательное развитие.",
    },
    schedule: [
      { dayKey: "mon", hours: "11:00 – 19:00" },
      { dayKey: "tue", hours: "11:00 – 19:00" },
      { dayKey: "wed", hours: "11:00 – 19:00" },
      { dayKey: "thu", hours: "—" },
      { dayKey: "fri", hours: "11:00 – 17:00" },
      { dayKey: "sat", hours: "—" },
      { dayKey: "sun", hours: "—" },
    ],
    reviews: [],
  },
  "dr-erlan-ped": {
    patientCount: 1200,
    experienceYears: 12,
    rating: 4.9,
    reviewCount: 210,
    licenseMasked: "MD-••••-1102",
    licenseIssued: "2014-01-20",
    about: {
      kk: "Педиатрия, даму мониторингі, ата-аналарға кеңес.",
      ru: "Педиатрия, мониторинг развития, консультации для родителей.",
    },
    schedule: [
      { dayKey: "mon", hours: "08:00 – 16:00" },
      { dayKey: "tue", hours: "08:00 – 16:00" },
      { dayKey: "wed", hours: "08:00 – 16:00" },
      { dayKey: "thu", hours: "08:00 – 16:00" },
      { dayKey: "fri", hours: "08:00 – 14:00" },
      { dayKey: "sat", hours: "—" },
      { dayKey: "sun", hours: "—" },
    ],
    reviews: [
      {
        id: "r1",
        authorName: "Gulnar A.",
        rating: 5,
        date: "2026-01-15",
        text: { kk: "Сенімді маман.", ru: "Надёжный врач." },
      },
    ],
  },
};

export function getDoctorDetails(doctorId: string): DoctorExtendedDetails {
  return (
    details[doctorId] ?? {
      patientCount: 200,
      experienceYears: 5,
      rating: 4.5,
      reviewCount: 20,
      licenseMasked: "MD-••••-0000",
      licenseIssued: "2020-01-01",
      about: { kk: "—", ru: "—" },
      schedule: [],
      reviews: [],
    }
  );
}
