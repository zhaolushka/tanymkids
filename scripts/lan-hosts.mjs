import os from "os";

const VIRTUAL_NAME =
  /virtualbox|vmware|hyper-v|vethernet|wsl|docker|loopback|npcap|bluetooth/i;

/** VirtualBox Host-Only and similar — телефон по Wi‑Fi сюда не достучится */
function isLikelyVirtualIp(ip, ifaceName) {
  if (VIRTUAL_NAME.test(ifaceName)) return true;
  if (ip.startsWith("192.168.56.")) return true;
  if (ip.startsWith("169.254.")) return true;
  return false;
}

function ifaceScore(name) {
  if (/wi-?fi|wlan|wireless|беспровод/i.test(name)) return 100;
  if (/ethernet|eth|локаль|local area/i.test(name)) return 80;
  if (/hotspot|mobile|phone|iphone|android/i.test(name)) return 90;
  if (VIRTUAL_NAME.test(name)) return 0;
  return 40;
}

/**
 * @returns {{ recommended: { ip: string, name: string }[], all: { ip: string, name: string, virtual: boolean }[] }}
 */
export function getLanHosts() {
  const nets = os.networkInterfaces();
  const all = [];

  for (const [name, entries] of Object.entries(nets)) {
    if (!entries) continue;
    for (const net of entries) {
      if (net.family !== "IPv4" || net.internal) continue;
      const virtual = isLikelyVirtualIp(net.address, name);
      all.push({ ip: net.address, name, virtual });
    }
  }

  const recommended = all
    .filter((h) => !h.virtual)
    .sort((a, b) => ifaceScore(b.name) - ifaceScore(a.name));

  return { recommended, all };
}
