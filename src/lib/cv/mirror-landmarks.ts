import type { Landmark } from "@/types/exercise";

/** Приводит координаты к тому, что ребёнок видит в зеркальной камере */
export function mirrorLandmarks(landmarks: Landmark[]): Landmark[] {
  return landmarks.map((point) => ({ ...point, x: 1 - point.x }));
}

export function mirrorHands(hands: Landmark[][]): Landmark[][] {
  return hands.map(mirrorLandmarks);
}
