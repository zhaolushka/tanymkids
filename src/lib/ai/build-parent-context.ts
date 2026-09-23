import { doctorProfiles } from "@/lib/doctors/catalog";
import { getDoctorDetails } from "@/lib/doctors/doctor-details";
import { getSpecialtyLabel } from "@/lib/doctors/specialties";
import type { Locale } from "@/i18n/types";

/** Сжатый каталог для промпта ИИ: только то, что уже есть в приложении (профили + отзывы). */
export function buildParentAssistantKnowledge(locale: Locale): string {
  const lines: string[] = [
    "TanymKids: домашние ЛФК и пальчиковая гимнастика с камерой для детей 2–7 лет; кабинет родителя — врачи, сообщения, статистика.",
    "ИИ не ставит диагноз и не заменяет врача. Рекомендации — по открытым профилям и отзывам в приложении.",
    "",
    "Специалисты в каталоге:",
  ];

  for (const doc of doctorProfiles) {
    const details = getDoctorDetails(doc.id);
    const spec = getSpecialtyLabel(doc.specialtyId, locale);
    const about = details.about[locale] ?? details.about.kk;
    lines.push(
      `- id=${doc.id}, handle=${doc.handle}, имя=${doc.fullName}, город=${doc.city}, специальность=${spec}, verified=${doc.verified}, рейтинг=${details.rating}, отзывов=${details.reviewCount}.`,
    );
    lines.push(`  О себе: ${about}`);
    if (details.reviews.length > 0) {
      lines.push("  Отзывы родителей:");
      for (const r of details.reviews.slice(0, 4)) {
        const text = r.text[locale] ?? r.text.kk;
        lines.push(`    • ${r.rating}/5 (${r.date}): «${text}»`);
      }
    }
    lines.push(`  Ссылка в приложении: /parent/doctors/${doc.handle}`);
  }

  lines.push("");
  lines.push(
    "Типичные запросы: подобрать врача по жалобе (ЛФК, речь, невро, педиатр); объяснить мед. термин простым языком; помочь составить первое сообщение врачу (вежливо, факты: возраст ребёнка, что делаете в TanymKids, вопрос).",
  );

  return lines.join("\n");
}
