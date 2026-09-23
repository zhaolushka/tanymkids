/**
 * Нарезка «Комплекс ЛФК… Занятие 1» — только блоки упражнений (без заставок).
 * Использование:
 *   node scripts/trim-lfk-zanyatie-1.mjs "E:\Downloads\Комплекс_ЛФК....mp4"
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const out = path.join(root, "public", "demos", "lfk-zanyatie-1.mp4");
const tmp = path.join(root, "public", "demos", "_lfk_parts");

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
  console.error("Укажите путь к исходному MP4");
  process.exit(1);
}

/** секунды в исходнике — подстройте при необходимости */
const cuts = [
  [20, 42],
  [53, 72],
  [79, 94],
  /** 4-й блок: без вступления (говорит в начале) — сразу движение */
  [132, 152],
  [167, 192],
];

fs.mkdirSync(tmp, { recursive: true });
cuts.forEach(([from, to], i) => {
  execSync(
    `ffmpeg -y -hide_banner -loglevel error -ss ${from} -to ${to} -i "${src}" -an -c:v libx264 -preset fast -crf 23 -movflags +faststart "${path.join(tmp, `p${i}.mp4`)}"`,
    { stdio: "inherit" },
  );
});

const list = path.join(tmp, "list.txt");
fs.writeFileSync(
  list,
  cuts.map((_, i) => `file 'p${i}.mp4'`).join("\n"),
);
execSync(
  `ffmpeg -y -hide_banner -loglevel error -f concat -safe 0 -i "${list}" -c copy "${out}"`,
  { stdio: "inherit" },
);

console.log("Готово:", out);
