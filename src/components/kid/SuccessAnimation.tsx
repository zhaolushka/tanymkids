import { kk } from "@/i18n/kk";

interface SuccessAnimationProps {
  stars: number;
}

export function SuccessAnimation({ stars }: SuccessAnimationProps) {
  return (
    <div className="flex flex-col items-center gap-4 animate-bounce">
      <span className="text-7xl">⭐</span>
      <p className="text-3xl font-bold text-kid-purple">
        {stars > 0
          ? `${kk.success.great} +${stars} ${stars === 1 ? kk.rewards.star : kk.rewards.stars}!`
          : kk.success.tryMore}
      </p>
    </div>
  );
}
