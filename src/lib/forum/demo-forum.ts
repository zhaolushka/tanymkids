import type { Locale } from "@/i18n/types";

export type ForumCategory = "all" | "lfk" | "home" | "speech" | "general";

export type ForumThread = {
  id: string;
  category: Exclude<ForumCategory, "all">;
  title: Record<Locale, string>;
  preview: Record<Locale, string>;
  author: string;
  city: string;
  replyCount: number;
  likeCount: number;
  updatedAt: string;
};

export type ForumFeedItem = {
  threadId: string;
  postId: string;
  category: Exclude<ForumCategory, "all">;
  author: string;
  handle: string;
  city: string;
  body: string;
  replyCount: number;
  likeCount: number;
  updatedAt: string;
};

export type ForumPost = {
  id: string;
  threadId: string;
  author: string;
  body: Record<Locale, string>;
  createdAt: string;
};

const threads: ForumThread[] = [
  {
    id: "lfk-schedule",
    category: "lfk",
    title: {
      ru: "ЛФК дома — сколько раз в неделю у вас получается?",
      kk: "Yide LFK — aptasyna neshe ret shyga alasyz?",
    },
    preview: {
      ru: "Мы с TanymKids 3 раза, но ребёнок устаёт к вечеру…",
      kk: "TanymKids pen 3 ret, biraq kez keshke sharchaydy…",
    },
    author: "Алия К.",
    city: "Алматы",
    replyCount: 12,
    likeCount: 34,
    updatedAt: "2026-03-22",
  },
  {
    id: "camera-phone",
    category: "home",
    title: {
      ru: "Камера на телефоне — HTTPS и советы",
      kk: "Telefonda kamera — HTTPS kenestery",
    },
    preview: {
      ru: "У нас заработало через dev:phone в одной Wi‑Fi…",
      kk: "Bizde dev:phone bir Wi‑Fi-da isledi…",
    },
    author: "Serik M.",
    city: "Астана",
    replyCount: 8,
    likeCount: 21,
    updatedAt: "2026-03-21",
  },
  {
    id: "speech-hands",
    category: "speech",
    title: {
      ru: "Саусақ сабақтары + логопед — заметили эффект?",
      kk: "Sausaq sabak + logoped — nátije korildime?",
    },
    preview: {
      ru: "После месяца пальчиковых уроков стало больше звуков…",
      kk: "Bir ay sausaq sabaktan keyin dbyis kobeydi…",
    },
    author: "Dana O.",
    city: "Шымкент",
    replyCount: 5,
    likeCount: 15,
    updatedAt: "2026-03-20",
  },
  {
    id: "you-are-not-alone",
    category: "general",
    title: {
      ru: "ЗПР — вы не одни (поддержка родителей)",
      kk: "DPD — siz jalgysyz emessiz",
    },
    preview: {
      ru: "Иногда кажется, что прогресса нет. Делюсь, что помогло нам…",
      kk: "Keide progress joq siyaqty. Bizge nene komekteskenin jazam…",
    },
    author: "Мадина Т.",
    city: "Қарағанды",
    replyCount: 24,
    likeCount: 89,
    updatedAt: "2026-03-19",
  },
];

const posts: ForumPost[] = [
  {
    id: "p1",
    threadId: "lfk-schedule",
    author: "Алия К.",
    createdAt: "2026-03-22T10:00:00",
    body: {
      ru: "Здравствуйте! Дочке 4 года, занимаемся в TanymKids. Планируем ЛФК 3 раза в неделю, но к вечеру часто нет сил. Как у вас — утро или после садика?",
      kk: "Salem! Qyzym 4 jasta, TanymKids pen jattygamyz. LFK 3 ret josparlaymyz, biraq kez sharchaydy. Sizde taebele me, bakyshadan keyin be?",
    },
  },
  {
    id: "p2",
    threadId: "lfk-schedule",
    author: "Ерлан С.",
    createdAt: "2026-03-22T11:20:00",
    body: {
      ru: "У нас лучше утром, 15–20 минут. Если пропустили — не ругаем себя, переносим на следующий день.",
      kk: "Bizde taebele zhaksy, 15–20 min. Otkizip alsak — kelese kunge suryp zhatamyz.",
    },
  },
  {
    id: "p3",
    threadId: "lfk-schedule",
    author: "Айгуль Н.",
    createdAt: "2026-03-22T14:05:00",
    body: {
      ru: "+1 к коротким сессиям. Врач сказала: регулярность важнее длинных марафонов.",
      kk: "Kysqa sessiya zhaksy. Dariyer: tuymastyq uzak marafondan mańyzdy dedi.",
    },
  },
  {
    id: "p4",
    threadId: "camera-phone",
    author: "Serik M.",
    createdAt: "2026-03-21T09:00:00",
    body: {
      ru: "На iPhone не открывалась камера по HTTP. Помогло npm run dev:phone и один Wi‑Fi с ноутбуком.",
      kk: "iPhone HTTP-te kamerany ashyp zhatt. dev:phone zhane bir Wi‑Fi komektesedi.",
    },
  },
  {
    id: "p5",
    threadId: "camera-phone",
    author: "Алия К.",
    createdAt: "2026-03-21T10:30:00",
    body: {
      ru: "Спасибо! Ещё включили «локальную сеть» в Windows — см. scripts в проекте.",
      kk: "Rahmet! Windows jergilikti jelini qosyp kordik.",
    },
  },
  {
    id: "p6",
    threadId: "speech-hands",
    author: "Dana O.",
    createdAt: "2026-03-20T16:00:00",
    body: {
      ru: "Сыну 5 лет. Саусақ уроки + логопед раз в неделю — через 3 недели стало больше слогов дома.",
      kk: "Ul 5 jasta. Sausaq + aptasyna bir logoped — 3 aptadan keyin buin kobeydi.",
    },
  },
  {
    id: "p7",
    threadId: "you-are-not-alone",
    author: "Мадина Т.",
    createdAt: "2026-03-19T08:00:00",
    body: {
      ru: "Хочу поддержать: прогресс не всегда виден по дням. Мы ведём звёзды в TanymKids — так легче видеть маленькие победы.",
      kk: "Koldau usynam: progress kun sayin korinbeui mumkin. Juldystardy kozde tutamyz.",
    },
  },
  {
    id: "p8",
    threadId: "you-are-not-alone",
    author: "Нурлан Б.",
    createdAt: "2026-03-19T12:00:00",
    body: {
      ru: "Спасибо за тему. Нам помогло общение с другими родителями на занятиях — здесь тоже хорошо иметь такое место.",
      kk: "Rahmet. Basqa ata-analar menen soileu komektesedi — osy forum jaqsy.",
    },
  },
];

export function authorHandle(author: string): string {
  return author
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^\w\u0400-\u04FF_]/g, "")
    .replace(/_+/g, "_");
}

export function getForumFeed(
  locale: Locale,
  category: ForumCategory = "all",
): ForumFeedItem[] {
  const list = getForumThreads(category);
  return list.map((th) => {
    const first = getForumPosts(th.id)[0];
    const body = first
      ? (first.body[locale] ?? first.body.kk)
      : (th.preview[locale] ?? th.preview.kk);
    return {
      threadId: th.id,
      postId: first?.id ?? th.id,
      category: th.category,
      author: th.author,
      handle: authorHandle(th.author),
      city: th.city,
      body,
      replyCount: th.replyCount,
      likeCount: th.likeCount,
      updatedAt: th.updatedAt,
    };
  });
}

export function getForumThreads(category: ForumCategory = "all"): ForumThread[] {
  const list = category === "all" ? threads : threads.filter((t) => t.category === category);
  return [...list].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getForumThread(id: string): ForumThread | undefined {
  return threads.find((t) => t.id === id);
}

export function getForumPosts(threadId: string): ForumPost[] {
  return posts
    .filter((p) => p.threadId === threadId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
