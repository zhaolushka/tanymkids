"use client";

import { useEffect, useState } from "react";

/**
 * Только development: как открыть с телефона и почему камера не работает по http.
 */
export function PhoneAccessHint() {
  const [secure, setSecure] = useState(true);
  const [host, setHost] = useState("");

  useEffect(() => {
    setSecure(window.isSecureContext);
    setHost(window.location.host);
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="mx-auto max-w-lg rounded-2xl border border-amber-300/80 bg-amber-50 px-4 py-3 text-left text-sm text-amber-950">
      <p className="font-bold">📱 Телефон</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-xs sm:text-sm">
        <li>
          В терминале после <code className="rounded bg-white/80 px-1">npm run dev</code> смотри блок
          «Телефон» — нужен IP <strong>Wi‑Fi</strong>, не 192.168.56.1 (часто VirtualBox).
        </li>
        <li>ПК и телефон в одной сети (один Wi‑Fi или раздача интернета с телефона).</li>
        <li>
          <strong>Камера:</strong> на телефоне только{" "}
          <code className="rounded bg-white/80 px-1">npm run dev:phone</code> (HTTPS), в браузере прими
          «ненадёжный сертификат».
        </li>
        {!secure && host && !host.startsWith("localhost") && (
          <li className="font-semibold text-red-700">
            Сейчас {host} без HTTPS — камера не включится. Запусти dev:phone.
          </li>
        )}
      </ul>
    </div>
  );
}
