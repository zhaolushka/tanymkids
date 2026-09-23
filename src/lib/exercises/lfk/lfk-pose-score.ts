import { angleBetween } from "@/lib/cv/angles";
import type { Landmark } from "@/types/exercise";

/** Жұмсақ порог — балалар ЛФК */
export const LFK_PASS_SCORE = 38;

function clamp01(v: number): number {
  return Math.max(0, Math.min(100, v));
}

function scoreWristsAboveShoulders(pose: Landmark[]): number {
  const left = pose[11].y - pose[15].y;
  const right = pose[12].y - pose[16].y;
  return clamp01(((left / 0.07 + right / 0.07) / 2) * 100);
}

/** «Үлкен бол» — қол жоғары */
export function scoreGrowUp(pose: Landmark[]): number {
  return scoreWristsAboveShoulders(pose);
}

/** «Қанат» — қол жағаға (T) */
export function scoreWings(pose: Landmark[]): number {
  const leftSpread = Math.abs(pose[15].x - pose[11].x);
  const rightSpread = Math.abs(pose[16].x - pose[12].x);
  const leftLevel = 1 - Math.min(1, Math.abs(pose[15].y - pose[11].y) / 0.12);
  const rightLevel = 1 - Math.min(1, Math.abs(pose[16].y - pose[12].y) / 0.12);
  const spread = clamp01(((leftSpread + rightSpread) / 0.2) * 50);
  const level = clamp01((leftLevel + rightLevel) * 50);
  const notUp = pose[15].y > pose[11].y - 0.02 || pose[16].y > pose[12].y - 0.02 ? 15 : 0;
  return clamp01(spread + level * 0.5 + notUp);
}

/** «Ұшақ» — бетке бұk (иық немесе бел) */
export function scoreAirplane(pose: Landmark[]): number {
  const shoulderTilt = Math.abs(pose[11].y - pose[12].y);
  const hipTilt = Math.abs(pose[23].y - pose[24].y);
  const wristTilt = Math.abs(pose[15].y - pose[16].y);
  const tilt = Math.max(shoulderTilt, hipTilt * 0.8, wristTilt * 0.6);
  return clamp01((tilt / 0.045) * 100);
}

/** «Кішкентай-үлкен» — орташа otыр */
export function scoreSmallBig(pose: Landmark[]): number {
  const left = angleBetween(pose[23], pose[25], pose[27]);
  const right = angleBetween(pose[24], pose[26], pose[28]);
  const avg = (left + right) / 2;
  const squatScore = clamp01(((155 - avg) / 55) * 100);
  const hipDrop = pose[23].y + pose[24].y;
  return clamp01(Math.max(squatScore, (hipDrop - 1.0) * 200));
}

/** «Иіл» — алға иілу, қол тізеге */
export function scoreBowForward(pose: Landmark[]): number {
  const shoulderY = (pose[11].y + pose[12].y) / 2;
  const hipY = (pose[23].y + pose[24].y) / 2;
  const wristY = (pose[15].y + pose[16].y) / 2;
  const torso = clamp01(((0.2 - (hipY - shoulderY)) / 0.14) * 100);
  const handsLow = clamp01(((wristY - shoulderY) / 0.2) * 100);
  const nose = clamp01(((pose[0].y - shoulderY) / 0.12) * 60);
  return clamp01(Math.max(torso * 0.5 + handsLow * 0.4, nose));
}

export function scoreForLfkExercise(exerciseId: string, pose: Landmark[]): number {
  switch (exerciseId) {
    case "grow_up":
      return scoreGrowUp(pose);
    case "wings":
      return scoreWings(pose);
    case "airplane":
      return scoreAirplane(pose);
    case "small_big":
      return scoreSmallBig(pose);
    case "bow_forward":
      return scoreBowForward(pose);
    default:
      return 0;
  }
}
