import type { Locale } from "@/i18n/types";
import { doctorProfiles } from "@/lib/doctors/catalog";
import { getDoctorDetails } from "@/lib/doctors/doctor-details";
import { getDoctorByHandle } from "@/lib/doctors/catalog";
import { getSpecialtyLabel } from "@/lib/doctors/specialties";

const TERMS: Record<string, Record<Locale, string>> = {
  зпр: {
    ru: "ЗПР (задержка психического развития) — ребёнок осваивает навыки (речь, моторика, общение) медленнее сверстников. Это не «лень» и не приговор: важны регулярные занятия, ЛФК, иногда логопед и наблюдение специалистов. TanymKids помогает с домашней частью — упражнения с камерой.",
    kk: "ДПД (дəрумен психикалық даму кешігуі) — бала қабатестеріне қарағанда дағдыларды (сөйлеу, моторика) баяу меңгереді. Бұл «бейбастық» емес: үй жаттығулары, ЛФК, кейде логoped маңызды. TanymKids үйдегі сабақтарға көмектеседі.",
  },
  лфк: {
    ru: "ЛФК — лечебная физкультура. Упражнения подбирают под ребёнка: осанка, баланс, крупная моторика. В TanymKids ЛФК — это короткие уроки с камерой, которые проверяют, правильно ли ребёнок повторяет движение.",
    kk: "ЛФК — емдеулік дене шынықтыру. Баланың қажеттілігіне қарай жаттығулар: қимыл, тепе-теңге, posture. TanymKids-те камерамен қысқа сабақтар — дұрыс қайталайтынын көресіз.",
  },
  логопед: {
    ru: "Логопед занимается звуками, речью и иногда связью с мелкой моторикой (пальчики помогают речи). Если ребёнок плохо выговаривает или мало говорит — можно написать логопеду из сети TanymKids.",
    kk: "Логoped дыбыстар мен сөйлеумен айналысады, саусақ жаттығуларымен байланысты жұмыс та болады. Егер бala аз сөйлесе — желідегі логoped-ке хабарласа аласыз.",
  },
  нейропсихолог: {
    ru: "Нейропсихолог смотрит на внимание, память, координацию, поведение в играх и занятиях. Часто идёт вместе с ЛФК и логопедом, если ребёнку трудно сосредоточиться или освоить новое.",
    kk: "Нейропсихolog назар, есте сақтау, координациямен жұмыс істейді. Кейде ЛФК және логoped-пен бірге кешенді жоспар қажет.",
  },
};

function pickDoctorRecommendation(locale: Locale, text: string): string {
  const lower = text.toLowerCase();
  let specialty: string | null = null;
  if (/логопед|speech|сөйле|дыбыс|articul/.test(lower)) specialty = "speech";
  else if (/нейро|назар|attention|кognit/.test(lower)) specialty = "neuro";
  else if (/педиатр|pediatric|болит|температ/.test(lower)) specialty = "pediatric";
  else if (/лфк|lfk|осанк|движен|қимыл|жатты/.test(lower)) specialty = "lfk";

  const pool = specialty
    ? doctorProfiles.filter((d) => d.specialtyId === specialty)
    : [...doctorProfiles];

  const ranked = pool
    .map((d) => {
      const det = getDoctorDetails(d.id);
      const topReview = det.reviews[0];
      const reviewText = topReview
        ? (topReview.text[locale] ?? topReview.text.kk)
        : "";
      return { d, det, reviewText };
    })
    .sort((a, b) => b.det.rating - a.det.rating);

  const top = ranked[0];
  if (!top) {
    return locale === "ru"
      ? "Откройте раздел «Специалисты» — там все профили. Напишите, что беспокоит (движение, речь, внимание), и я подскажу точнее."
      : "«Мамандар» бөлімін ашыңыз. Бalaда не қиын (қимыл, сөйлеу, назар) — жазыңыз, нақтырақ ұсынам.";
  }

  const spec = getSpecialtyLabel(top.d.specialtyId, locale);
  if (locale === "ru") {
    return [
      `По отзывам и профилю в приложении хорошо подходит **${top.d.fullName}** (${spec}, ${top.d.city}), рейтинг ${top.det.rating}.`,
      top.reviewText ? `Из отзыва: «${top.reviewText}»` : "",
      `Профиль: /parent/doctors/${top.d.handle}. Можете нажать «Записаться» и написать врачу — я помогу с текстом, если нужно.`,
      ranked[1]
        ? `Ещё вариант: ${ranked[1].d.fullName} (${getSpecialtyLabel(ranked[1].d.specialtyId, locale)}).`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  return [
    `Қолданбадағы профиль мен пікірлер бойынша **${top.d.fullName}** (${spec}, ${top.d.city}) — рейтинг ${top.det.rating}.`,
    top.reviewText ? `Пікірден: «${top.reviewText}»` : "",
    `Профиль: /parent/doctors/${top.d.handle}. Хабарлама мәтінін де көмектесем.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function draftDoctorMessage(
  locale: Locale,
  doctorHandle: string | undefined,
  userText: string,
): string {
  const doc = doctorHandle ? getDoctorByHandle(doctorHandle) : doctorProfiles[0];
  const name = doc?.fullName ?? (locale === "ru" ? "доктор" : "доктор");
  const childAge = locale === "ru" ? "4 года" : "4 жаста";
  const draftRu = `Здравствуйте, ${name}!

Меня зовут …, я родитель ребёнка (${childAge}). Мы занимаемся дома в приложении TanymKids (ЛФК / упражнения с камерой).

Хотел(а) бы уточнить: …

${userText.trim() ? `Кратко о ситуации: ${userText.trim()}` : "Подскажите, пожалуйста, нужна ли очная консультация или достаточно онлайн."}

Спасибо!`;

  const draftKk = `Сәлеметсіз бе, ${name}!

Мен …, ${childAge} balamyn ата-анасымын. Үйде TanymKids-пен жаттығамыз.

Сұрағым: …

${userText.trim() ? userText.trim() : "Онлайн кеңес жеткілікті ме, жеке қабылдау керек пе?"}

Рахмет!`;

  const body = locale === "ru" ? draftRu : draftKk;
  return locale === "ru"
    ? `Черновик сообщения (отредактируйте перед отправкой):\n\n---\n${body}\n---\n\nСовет: укажите возраст, что делаете в TanymKids, один главный вопрос. Не отправляйте мед. документы без необходимости.`
    : `Хабарлама нобайы (жібермес бұрын өзгертіңіз):\n\n---\n${body}\n---\n\nКеңес: бala жасы, TanymKids-тегі сабақтар, бір нақты сұрақ жазыңыз.`;
}

function explainTerm(locale: Locale, text: string): string | null {
  const lower = text.toLowerCase();
  for (const [key, expl] of Object.entries(TERMS)) {
    if (lower.includes(key)) return expl[locale];
  }
  const quoted = text.match(/[«"']([^»"']{2,40})[»"']/);
  if (quoted) {
    const word = quoted[1].toLowerCase();
    for (const [key, expl] of Object.entries(TERMS)) {
      if (word.includes(key)) return expl[locale];
    }
    return locale === "ru"
      ? `«${quoted[1]}» — уточните, где вы это услышали (у врача, в статье). Я объясню простыми словами. Пока могу подсказать по частым темам: ЗПР, ЛФК, логопед, нейропсихолог.`
      : `«${quoted[1]}» — қайда естідіңіз (доктор, мақала)? Қарапайым тілмен түсіндірем. Көп кездескен: ДПД, ЛФК, логoped.`;
  }
  if (/объясни|түсіндір|простым|қарапайым|что такое|не понимаю|түсінбей/.test(lower)) {
    return locale === "ru"
      ? "Напишите слово или фразу, которую не поняли — объясню без сложных терминов. Например: «объясни ЗПР» или «что такое ЛФК»."
      : "Түсінбеген сөзді жазыңыз — қарапайым тілмен түсіндірем. Мысалы: «ДПД деген не?»";
  }
  return null;
}

/** Локальный ответ без облака — для демо и когда нет API-ключа. */
export function demoParentAssistantReply(
  locale: Locale,
  userMessage: string,
  doctorHandle?: string,
): string {
  const text = userMessage.trim();
  const term = explainTerm(locale, text);
  if (term) return term;

  if (/написать|сообщени|жаз|хабарла|письм|draft|черновик|doctor message/.test(text.toLowerCase())) {
    return draftDoctorMessage(locale, doctorHandle, text);
  }

  if (
    /врач|доктор|маман|специалист|кого выбра|кого посовет|рекоменд|пікір|отзыв|choose doctor/.test(
      text.toLowerCase(),
    )
  ) {
    return pickDoctorRecommendation(locale, text);
  }

  if (locale === "ru") {
    return [
      "Я помощник TanymKids для родителей (демо-режим без облачного ИИ). Могу:",
      "• подсказать врача из каталога по отзывам;",
      "• объяснить термины (ЗПР, ЛФК, логопед…);",
      "• помочь составить сообщение врачу.",
      "",
      "Напишите, например: «Кого выбрать для ЛФК?» или «Помоги написать логопеду».",
    ].join("\n");
  }

  return [
    "Мен TanymKids ата-ана көмекшісімін (демо, bulutсыз).",
    "• пікірлер бойынша маман ұсына аламын;",
    "• терминдерді түсіндірем;",
    "• дәрігерге хабарлама нобайын жазамын.",
    "",
    "Мысалы: «ЛФК үшін кого таңдау керек?»",
  ].join("\n");
}
