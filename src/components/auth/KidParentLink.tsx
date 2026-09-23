"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/LocaleProvider";

/** Parent cabinet from kid UI — middleware sends to PIN if kid mode is active. */
export function KidParentLink() {
  const { t } = useI18n();
  return (
    <Link
      href="/login/pin?next=/parent/home&from=kid"
      className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-kid-purple shadow-sm"
    >
      {t.auth.kidParentLink}
    </Link>
  );
}
