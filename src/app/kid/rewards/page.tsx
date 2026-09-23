import Link from "next/link";
import { DailyStreak } from "@/components/gamification/DailyStreak";
import { PetWidget } from "@/components/gamification/PetWidget";
import { StarCounter } from "@/components/gamification/StarCounter";
import { kk } from "@/i18n/kk";

export default function RewardsPage() {
  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <h1 className="text-3xl font-bold text-kid-purple">{kk.rewards.title}</h1>
      <StarCounter />
      <DailyStreak />
      <PetWidget />
      <Link href="/kid" className="text-sm text-muted-foreground hover:underline">
        {kk.kid.backMenu}
      </Link>
    </div>
  );
}
