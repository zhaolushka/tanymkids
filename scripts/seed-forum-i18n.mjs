import fs from "fs";

const forumBlock = `    forum: {
      title: "FORUM_TITLE",
      subtitle: "FORUM_SUBTITLE",
      demoBadge: "FORUM_DEMO",
      demoBadgeShort: "FORUM_DEMO_SHORT",
      catAll: "FORUM_CAT_ALL",
      catLfk: "FORUM_CAT_LFK",
      catHome: "FORUM_CAT_HOME",
      catSpeech: "FORUM_CAT_SPEECH",
      catGeneral: "FORUM_CAT_GENERAL",
      newTopic: "FORUM_NEW",
      newTitlePlaceholder: "FORUM_TITLE_PH",
      newBodyPlaceholder: "FORUM_BODY_PH",
      publish: "FORUM_PUBLISH",
      replies: "FORUM_REPLIES",
      empty: "FORUM_EMPTY",
      back: "FORUM_BACK",
      notFound: "FORUM_NOT_FOUND",
      replyPlaceholder: "FORUM_REPLY_PH",
      send: "FORUM_SEND",
      youLabel: "FORUM_YOU",
      youCity: "FORUM_CITY",
      homeCardTitle: "FORUM_HOME_TITLE",
      homeCardDesc: "FORUM_HOME_DESC",
      homeCardCta: "FORUM_HOME_CTA",
    },
`;

const ruValues = {
  FORUM_TITLE: "Форум родителей",
  FORUM_SUBTITLE: "Обмен опытом: ЛФК, TanymKids, речь, поддержка — без медицинских диагнозов от незнакомцев.",
  FORUM_DEMO: "Демо-сообщество · посты на этом устройстве, без публикации в интернет",
  FORUM_DEMO_SHORT: "демо",
  FORUM_CAT_ALL: "Все",
  FORUM_CAT_LFK: "ЛФК",
  FORUM_CAT_HOME: "Дома / приложение",
  FORUM_CAT_SPEECH: "Речь",
  FORUM_CAT_GENERAL: "Поддержка",
  FORUM_NEW: "Новая тема",
  FORUM_TITLE_PH: "Заголовок темы…",
  FORUM_BODY_PH: "Расскажите коротко — другие родители ответят…",
  FORUM_PUBLISH: "Опубликовать (демо)",
  FORUM_REPLIES: "ответов",
  FORUM_EMPTY: "Пока нет тем в этой категории.",
  FORUM_BACK: "К форуму",
  FORUM_NOT_FOUND: "Тема не найдена.",
  FORUM_REPLY_PH: "Ваш ответ другим родителям…",
  FORUM_SEND: "Отправить",
  FORUM_YOU: "Вы",
  FORUM_CITY: "Казахстан",
  FORUM_HOME_TITLE: "Форум родителей",
  FORUM_HOME_DESC: "Советы, поддержка и опыт — как у чата с другими мамами и папами.",
  FORUM_HOME_CTA: "Открыть",
};

const kkValues = {
  FORUM_TITLE: "Ata-analar forumy",
  FORUM_SUBTITLE: "Tajiribe almasu: LFK, TanymKids, soileu, kolдаu.",
  FORUM_DEMO: "Demo — posttar osy qurylgyda, internetke shygarmaydy",
  FORUM_DEMO_SHORT: "demo",
  FORUM_CAT_ALL: "Barlygy",
  FORUM_CAT_LFK: "LFK",
  FORUM_CAT_HOME: "Uide / qosymsha",
  FORUM_CAT_SPEECH: "Soileu",
  FORUM_CAT_GENERAL: "Koldau",
  FORUM_NEW: "Zhanа tema",
  FORUM_TITLE_PH: "Tema atawy…",
  FORUM_BODY_PH: "Kyskasha jazynyz — basqa ata-analar zhauap beredi…",
  FORUM_PUBLISH: "Zhabu (demo)",
  FORUM_REPLIES: "zhauap",
  FORUM_EMPTY: "Bul sanatta tema zhok.",
  FORUM_BACK: "Forumga",
  FORUM_NOT_FOUND: "Tema tabylmady.",
  FORUM_REPLY_PH: "Basqa ata-analarga zhauabyńyz…",
  FORUM_SEND: "Jiberu",
  FORUM_YOU: "Siz",
  FORUM_CITY: "Qazaqstan",
  FORUM_HOME_TITLE: "Ata-analar forumy",
  FORUM_HOME_DESC: "Keńes, kolдаu, tajiribe — basqa ata-analar menen chat siyaqty.",
  FORUM_HOME_CTA: "Ashu",
};

function fill(block, values) {
  let s = block;
  for (const [k, v] of Object.entries(values)) {
    s = s.replace(k, v);
  }
  return s;
}

function patchFile(path, values) {
  let s = fs.readFileSync(path, "utf8");
  if (s.includes("forum:")) {
    console.log(path, "already has forum");
    return;
  }
  const block = fill(forumBlock, values);
  const next = s.replace(/(\s+aiAssistant:\s*\{)/, `\n${block}$1`);
  if (next === s) {
    console.error("insert point not found in", path);
    process.exit(1);
  }
  fs.writeFileSync(path, next, "utf8");
  console.log("patched", path);
}

patchFile("src/i18n/ru.ts", ruValues);
patchFile("src/i18n/kk.ts", kkValues);

const telemedNav = `    navForum: "FORUM_NAV",`;
function patchTelemed(path, label) {
  let s = fs.readFileSync(path, "utf8");
  if (s.includes("navForum:")) return;
  s = s.replace(/(\s+navMessage:[^\n]+\n)/, `$1${telemedNav.replace("FORUM_NAV", label)}\n`);
  fs.writeFileSync(path, s, "utf8");
  console.log("navForum", path);
}

patchTelemed("src/i18n/ru.ts", "Форум");
patchTelemed("src/i18n/kk.ts", "Forum");
