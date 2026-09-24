import fs from "fs";

const path = "src/i18n/kk.ts";
const lines = fs.readFileSync(path, "utf8").split(/\r?\n/);

let start = lines.findIndex((l) => l.includes("doctorChatDemo:"));
if (start < 0) {
  console.error("doctorChatDemo not found");
  process.exit(1);
}

let end = start + 1;
while (end < lines.length && !lines[end].trim().startsWith("},")) end++;
// end points to `    },` closing doctorChatDemo

const block = lines.slice(start, end + 1).join("\n");
if (block.includes("sentDemo:")) {
  console.log("already patched");
  process.exit(0);
}

const insertLines = [
  '      inputPlaceholder: "Mamanga jazy\u0144yz\u2026",',
  '      send: "Jiberu",',
  '      sentDemo: "Habarlandy (demo). Mamandan keyin jauap keledi.",',
  "      doctorAutoReply:",
  '        "Rahmet! TanymKids sabaktaryn qarap, kun ishinde tolyq jauap beremin.",',
  '      aiHelpButton: "Matinge k\u04e9mek (AI)",',
];

lines.splice(end, 0, ...insertLines);
fs.writeFileSync(path, lines.join("\n"), "utf8");
console.log("inserted at line", end);
