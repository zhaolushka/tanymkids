import Link from "next/link";
import { PhoneAccessHint } from "@/components/dev/PhoneAccessHint";
import { BigButton } from "@/components/kid/BigButton";
import { Mascot } from "@/components/kid/Mascot";
import { kk } from "@/i18n/kk";

export default function KidMenuPage() {
  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <PhoneAccessHint />
      <Mascot message={kk.kid.menu} mood="happy" />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <BigButton href="/kid/lfk" emoji="🤸" label={kk.kid.lfk} color="bg-kid-green" />
        <BigButton href="/kid/hands" emoji="🖐️" label={kk.kid.hands} color="bg-kid-blue" />
        <BigButton href="/kid/rewards" emoji="⭐" label={kk.kid.rewards} color="bg-kid-orange" />
      </div>

      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        {kk.kid.backHome}
      </Link>
    </div>
  );
}
