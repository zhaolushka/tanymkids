import type { NextConfig } from "next";
import os from "os";

/** IP этого ПК в LAN — для dev с телефона (Origin / Referer) */
function collectLanHostnames(): string[] {
  const hosts = new Set<string>();

  const nets = os.networkInterfaces();
  for (const entries of Object.values(nets)) {
    if (!entries) continue;
    for (const net of entries) {
      if (net.family === "IPv4" && !net.internal) {
        hosts.add(net.address);
      }
    }
  }

  return [...hosts];
}

/** Любой домашний Wi‑Fi / hotspot — dev с телефона по IP */
const privateLanPatterns = [
  "192.168.**",
  "10.**",
  "172.16.**",
  "172.17.**",
  "172.18.**",
  "172.19.**",
  "172.20.**",
  "172.21.**",
  "172.22.**",
  "172.23.**",
  "172.24.**",
  "172.25.**",
  "172.26.**",
  "172.27.**",
  "172.28.**",
  "172.29.**",
  "172.30.**",
  "172.31.**",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: [...collectLanHostnames(), ...privateLanPatterns],
};

export default nextConfig;
