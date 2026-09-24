import fs from "fs";

const insertAfterBrand = [
  '      tabForYou: "TAB",',
  '      composePlaceholder: "COMPOSE",',
  '      publishThread: "PUBLISH",',
  '      cancel: "CANCEL",',
  '      actionLike: "LIKE",',
  '      actionReply: "REPLY",',
];

const ru = {
  TAB: "Для вас",
  COMPOSE: "Начните тред…",
  PUBLISH: "Опубликовать",
  CANCEL: "Отмена",
  LIKE: "Нравится",
  REPLY: "Ответить",
};

const kk = {
  TAB: "Sizge",
  COMPOSE: "Tred bastanyz…",
  PUBLISH: "Zhabu",
  CANCEL: "Boldyrmau",
  LIKE: "Unaidy",
  REPLY: "Zhauap",
};

function patch(path, map) {
  if (fs.readFileSync(path, "utf8").includes("tabForYou:")) {
    console.log(path, "ok");
    return;
  }
  const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);
  const idx = lines.findIndex((l) => l.includes("threadsBrand:"));
  if (idx < 0) {
    console.error("threadsBrand not found", path);
    process.exit(1);
  }
  const toInsert = insertAfterBrand.map((t) => {
    let line = t;
    for (const [k, v] of Object.entries(map)) {
      line = line.replace(k, v);
    }
    return line;
  });
  lines.splice(idx + 1, 0, ...toInsert);
  fs.writeFileSync(path, lines.join("\n"), "utf8");
  console.log("patched", path);
}

patch("src/i18n/ru.ts", ru);
patch("src/i18n/kk.ts", kk);
