import { mirrorLandmarks } from "@/lib/cv/mirror-landmarks";
import type { Landmark } from "@/types/exercise";

export interface ScreenHands {
  screenLeft?: Landmark[];
  screenRight?: Landmark[];
}

/** Разделяет руки по положению запястья на зеркальном экране */
export function assignHandsByScreenPosition(hands: Landmark[][]): ScreenHands {
  if (hands.length === 0) return {};

  const mirrored = hands.map((hand) => mirrorLandmarks(hand));
  const sorted = mirrored
    .map((landmarks) => ({ landmarks, wristX: landmarks[0]?.x ?? 0.5 }))
    .sort((a, b) => a.wristX - b.wristX);

  if (sorted.length === 1) {
    const { landmarks, wristX } = sorted[0];
    if (wristX < 0.5) return { screenLeft: landmarks };
    return { screenRight: landmarks };
  }

  return {
    screenLeft: sorted[0].landmarks,
    screenRight: sorted[sorted.length - 1].landmarks,
  };
}
