import { getLanHosts } from "./lan-hosts.mjs";

const port = process.env.PORT || 3000;

const { recommended, all } = getLanHosts();

console.log("\n📱 Телефон — открой в браузере (тот же Wi‑Fi, что и ПК):\n");

if (recommended.length === 0) {
  console.log("  ⚠ Не нашли подходящий Wi‑Fi IP. Проверь, что ПК в сети Wi‑Fi (не только VPN/VirtualBox).\n");
  for (const h of all) {
    console.log(`  (?) http://${h.ip}:${port}/  — ${h.name}${h.virtual ? " [виртуальный, с телефона часто не работает]" : ""}`);
  }
} else {
  const best = recommended[0];
  console.log(`  ★ Сначала попробуй: http://${best.ip}:${port}/`);
  console.log(`    (интерфейс: ${best.name})\n`);

  if (recommended.length > 1) {
    console.log("  Другие адреса, если первый не открывается:");
    for (const h of recommended.slice(1)) {
      console.log(`    http://${h.ip}:${port}/  — ${h.name}`);
    }
    console.log("");
  }

  const virtual = all.filter((h) => h.virtual);
  if (virtual.length > 0) {
    console.log("  ✗ Не используй с телефона (VirtualBox/VPN и т.п.):");
    for (const h of virtual) {
      console.log(`    http://${h.ip}:${port}/  — ${h.name}`);
    }
    console.log("");
  }
}

console.log("  ЛФК с камерой на телефоне: npm run dev:phone → https://<IP>:3000/kid");
console.log("  На ПК: http://localhost:" + port + "/kid");
console.log("\n  ⚠ Не открывается с телефона? Частые причины:");
console.log("  1) Телефон не в том же Wi‑Fi (не мобильный интернет!)");
console.log("  2) Брандмауэр Windows — один раз от АДМИНА PowerShell:");
console.log("     .\\scripts\\allow-dev-port.ps1");
console.log("  3) localtunnel: только npm run dev:tunnel (порт " + port + ", не 8000!)");
console.log("     На loca.lt введи пароль = твой внешний IP: https://ifconfig.me\n");
