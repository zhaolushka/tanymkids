import type { Locale } from "@/i18n/types";

type Entry = Record<Locale, { title: string; body: string }>;

const GLOSSARY: Record<string, Entry> = {
  "зпр": {
    ru: {
      title: "ЗПР",
      body: "Задержка психического развития — ребёнок осваивает навыки медленнее сверстников.",
    },
    kk: {
      title: "ДПД",
      body: "Дүрумен психикалық даму кешігуі.",
    },
  },
  "лфк": {
    ru: {
      title: "ЛФК",
      body: "Лечебная физкультура — упражнения для здоровья и развития.",
    },
    kk: {
      title: "ЛФК",
      body: "Емдеулік дене шынықтыру.",
    },
  },
  "гипотонус": {
    ru: {
      title: "Гипотонус",
      body: "Пониженный тонус мышц — ребёнку труднее держать осанку.",
    },
    kk: {
      title: "Гипотонус",
      body: "Бұлшықет тонусы төмен.",
    },
  },
  "осанка": {
    ru: {
      title: "Осанка",
      body: "Как ребёнок держит спину, плечи, голову.",
    },
    kk: {
      title: "Осанка",
      body: "Дененің тұруы.",
    },
  },
  "координация": {
    ru: {
      title: "Координация",
      body: "Согласованность движений — руки, ноги и тело вместе.",
    },
    kk: {
      title: "Координация",
      body: "Қол, аяқ және дене бірге жәміс істейді.",
    },
  },
  "баланс": {
    ru: {
      title: "Баланс",
      body: "Равновесие — стоять на одной ноге.",
    },
    kk: {
      title: "Тепе-теңдік",
      body: "Бір аяқта тұру.",
    },
  },
  "моторика": {
    ru: {
      title: "Моторика",
      body: "Движения тела. Крупная — ЛФК, мелкая — пальцы.",
    },
    kk: {
      title: "Моторика",
      body: "Дене қимылдары.",
    },
  },
  "крупная моторика": {
    ru: {
      title: "Крупная моторика",
      body: "Бег, прыжки, руки вверх — то, что тренирует TanymKids ЛФК.",
    },
    kk: {
      title: "Ірі моторика",
      body: "Улкен қимылдар TanymKids ЛФК арқылы.",
    },
  },
  "сенсорная интеграция": {
    ru: {
      title: "Сенсорная интеграция",
      body: "Как мозг понимает ощущения тела и движения.",
    },
    kk: {
      title: "Сенсорлық интеграция",
      body: "Ми сезімдерді біріктіреді.",
    },
  },
  "нейропсихолог": {
    ru: {
      title: "Нейропсихолог",
      body: "Специалист по вниманию, памяти и обучению.",
    },
    kk: {
      title: "Нейропсихолог",
      body: "Назар, жад және оқу дәгдылары мен жәміс істейтін маман.",
    },
  },
};

function normalize(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[«»"'.,!?;:()—–-]/g, "")
    .replace(/\s+/g, " ");
}

export function explainPlainLanguage(
  locale: Locale,
  selected: string,
): { title: string; body: string } | null {
  const q = normalize(selected);
  if (q.length < 2) return null;

  const keys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const nk = normalize(key);
    if (q === nk || q.includes(nk) || nk.includes(q)) {
      return GLOSSARY[key]![locale];
    }
  }

  return null;
}

export function fallbackPlainLanguage(locale: Locale, word: string): { title: string; body: string } {
  return locale === "ru"
    ? {
        title: word,
        body: "«" + word + "» — специальный термин. Спросите ИИ-помощника в соседней вкладке.",
      }
    : {
        title: word,
        body: "«" + word + "» — арнайы термин. «AI көмек» вкладкасынан сұраңыз.",
      };
}
