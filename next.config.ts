import type { NextConfig } from "next";
import os from "os";

/** IP этого ПК в LAN — для dev с телефона (Origin / Referer) */
function collectLanHostnames(): string[] {
  const hosts = new Set<string>([
    "192.168.56.1",
    "192.168.1.1",
    "192.168.0.1",
    "172.20.10.4",
    "172.28.16.1",
  ]);

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

const nextConfig: NextConfig = {
  allowedDevOrigins: collectLanHostnames(),
};

export default nextConfig;
