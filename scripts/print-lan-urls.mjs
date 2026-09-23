import os from "os";

const port = process.env.PORT || 3000;
const nets = os.networkInterfaces();
const hosts = [];

for (const entries of Object.values(nets)) {
  if (!entries) continue;
  for (const net of entries) {
    if (net.family !== "IPv4" || net.internal) continue;
    hosts.push(net.address);
  }
}

console.log("\n📱 Телефон (та же Wi‑Fi / раздача с телефона):");
if (hosts.length === 0) {
  console.log("  (нет внешних IPv4 — проверь Wi‑Fi)\n");
} else {
  for (const host of hosts) {
    console.log(`  http://${host}:${port}/kid`);
    console.log(`  https://${host}:${port}/kid  ← камера: npm run dev:phone\n`);
  }
}

console.log("💻 Камера на этом ПК: http://localhost:" + port + "/kid\n");
