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
console.log("\n  Если «не открывается»: Windows может блокировать порт — один раз от админа:");
console.log('  netsh advfirewall firewall add rule name="TanymKids dev 3000" dir=in action=allow protocol=TCP localport=3000\n');
