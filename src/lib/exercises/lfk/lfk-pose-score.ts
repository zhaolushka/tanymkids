import { angleBetween } from "@/lib/cv/angles";
import type { Landmark } from "@/types/exercise";

/** Жұмсақ порог — балалар ЛФК (видео «Занятие 1») */
export const LFK_PASS_SCORE = 42;

const PASS_BY_EXERCISE: Record<string, number> = {
  neck_turn: 40,
  neck_tilt: 40,
  forearms_up: 42,
  grow_up: 44,
  stand_calm: 38,
  wings: 44,
  airplane: 42,
  bow_forward: 42,
  small_big: 42,
};

export function passScoreForLfkExercise(exerciseId: string): number {
  return PASS_BY_EXERCISE[exerciseId] ?? LFK_PASS_SCORE;
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(100, v));
}

function dist(a: Landmark, b: Landmark): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/** Камера алдында: белде қол (локть снаружи, кисть у пояса) */
export function scoreHandsOnHips(pose: Landmark[]): number {
  let total = 0;
  const pairs: [number, number, number, number][] = [
    [11, 13, 15, 23],
    [12, 14, 16, 24],
  ];
  for (const [shoulder, elbow, wrist, hip] of pairs) {
    const elbowOut = clamp01(((Math.abs(pose[elbow].x - pose[shoulder].x) - 0.03) / 0.14) * 100);
    const wristBelowElbow = clamp01(((pose[wrist].y - pose[elbow].y + 0.01) / 0.1) * 100);
    const nearHip = clamp01((0.22 - dist(pose[wrist], pose[hip])) / 0.18 * 100);
    total += (elbowOut * 0.45 + wristBelowElbow * 0.35 + nearHip * 0.2) / 100;
  }
  return clamp01((total / 2) * 100);
}

/** Видео 1: бас оңға-солға (белде қол) */
export function scoreNeckTurn(pose: Landmark[]): number {
  const hips = scoreHandsOnHips(pose);
  const midSx = (pose[11].x + pose[12].x) / 2;
  const turn = Math.abs(pose[0].x - midSx);
  const headScore = clamp01((turn / 0.05) * 100);
  const combined = hips * 0.25 + headScore * 0.75;
  if (headScore >= 55) return clamp01(Math.max(combined, headScore * 0.88));
  return clamp01(combined);
}

/** Видео 2: бас иыққа еңкейту */
export function scoreNeckTilt(pose: Landmark[]): number {
  const hips = scoreHandsOnHips(pose);
  const earDiff = Math.abs(pose[3].y - pose[4].y);
  const noseOff =
    Math.abs(pose[0].x - (pose[11].x + pose[12].x) / 2) +
    Math.abs(pose[0].y - (pose[11].y + pose[12].y) / 2) * 0.5;
  const tiltScore = clamp01((earDiff / 0.028) * 70 + (noseOff / 0.06) * 30);
  const combined = hips * 0.22 + tiltScore * 0.78;
  if (tiltScore >= 50) return clamp01(Math.max(combined, tiltScore * 0.85));
  return clamp01(combined);
}

/** Видео 3: билек — шынтақ вертикаль, кулаки у груди */
export function scoreForearmsUp(pose: Landmark[]): number {
  const leftAngle = angleBetween(pose[11], pose[13], pose[15]);
  const rightAngle = angleBetween(pose[12], pose[14], pose[16]);
  const bendL = clamp01(1 - Math.abs(leftAngle - 85) / 55);
  const bendR = clamp01(1 - Math.abs(rightAngle - 85) / 55);
  const wristUpL = clamp01((pose[13].y - pose[15].y + 0.04) / 0.14);
  const wristUpR = clamp01((pose[14].y - pose[16].y + 0.04) / 0.14);
  const closeL = clamp01((0.2 - Math.abs(pose[15].x - pose[11].x)) / 0.14);
  const closeR = clamp01((0.2 - Math.abs(pose[16].x - pose[12].x)) / 0.14);
  const raw =
    (bendL + bendR) * 22 +
    (wristUpL + wristUpR) * 28 +
    (closeL + closeR) * 14;
  return clamp01(raw);
}

/** «Үлкен бол» — қол тік жоғары */
export function scoreGrowUp(pose: Landmark[]): number {
  const left = pose[11].y - pose[15].y;
  const right = pose[12].y - pose[16].y;
  const up = clamp01(((left / 0.07 + right / 0.07) / 2) * 100);
  const aboveHead =
    pose[15].y < pose[0].y + 0.06 && pose[16].y < pose[0].y + 0.06 ? 18 : 0;
  const spreadOk =
    Math.abs(pose[15].x - pose[16].x) > 0.08 && Math.abs(pose[15].x - pose[16].x) < 0.55
      ? 8
      : 0;
  return clamp01(up + aboveHead + spreadOk);
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

/** «Ұшақ» — бүйірге еңкей */
export function scoreAirplane(pose: Landmark[]): number {
  const shoulderTilt = Math.abs(pose[11].y - pose[12].y);
  const hipTilt = Math.abs(pose[23].y - pose[24].y);
  const wristTilt = Math.abs(pose[15].y - pose[16].y);
  const tilt = Math.max(shoulderTilt, hipTilt * 0.8, wristTilt * 0.6);
  return clamp01((tilt / 0.045) * 100);
}

/** «Кішкентай» — otыр */
export function scoreSmallBig(pose: Landmark[]): number {
  const left = angleBetween(pose[23], pose[25], pose[27]);
  const right = angleBetween(pose[24], pose[26], pose[28]);
  const avg = (left + right) / 2;
  const squatScore = clamp01(((155 - avg) / 55) * 100);
  const hipDrop = pose[23].y + pose[24].y;
  return clamp01(Math.max(squatScore, (hipDrop - 1.0) * 200));
}

/** «Иіл» — алға иілу */
export function scoreBowForward(pose: Landmark[]): number {
  const shoulderY = (pose[11].y + pose[12].y) / 2;
  const hipY = (pose[23].y + pose[24].y) / 2;
  const wristY = (pose[15].y + pose[16].y) / 2;
  const torso = clamp01(((0.2 - (hipY - shoulderY)) / 0.14) * 100);
  const handsLow = clamp01(((wristY - shoulderY) / 0.2) * 100);
  const nose = clamp01(((pose[0].y - shoulderY) / 0.12) * 60);
  return clamp01(Math.max(torso * 0.5 + handsLow * 0.4, nose));
}

/** Видео 5: тік тұру, қол төмен */
export function scoreStandCalm(pose: Landmark[]): number {
  const armsDown =
    pose[15].y > pose[11].y - 0.01 && pose[16].y > pose[12].y - 0.01 ? 55 : 0;
  const notUp = pose[15].y > pose[0].y && pose[16].y > pose[0].y ? 25 : 0;
  const upright = clamp01((0.28 - Math.abs(pose[23].y - pose[11].y - 0.2)) / 0.12 * 20);
  const visibleLegs = pose[27].y > pose[25].y && pose[28].y > pose[26].y ? 20 : 10;
  return clamp01(armsDown + notUp + upright + visibleLegs);
}

export function scoreForLfkExercise(exerciseId: string, pose: Landmark[]): number {
  switch (exerciseId) {
    case "neck_turn":
      return scoreNeckTurn(pose);
    case "neck_tilt":
      return scoreNeckTilt(pose);
    case "forearms_up":
      return scoreForearmsUp(pose);
    case "stand_calm":
      return scoreStandCalm(pose);
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
