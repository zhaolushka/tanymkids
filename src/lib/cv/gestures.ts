import type { Landmark } from "@/types/exercise";
import { distance } from "./angles";
import { fingerStretchRatio } from "./hand-landmarks";

/** «Ешki»: көрсеткіш пен orta bukilgen, saqina men shoshqa köterilgen */
export function isGoatGesture(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;

  const ringRatio = fingerStretchRatio(landmarks, 16, 14, 13);
  const pinkyRatio = fingerStretchRatio(landmarks, 20, 18, 17);
  const indexRatio = fingerStretchRatio(landmarks, 8, 6, 5);
  const middleRatio = fingerStretchRatio(landmarks, 12, 10, 9);

  const ringUp = ringRatio >= 1.06;
  const pinkyUp = pinkyRatio >= 1.04;
  const indexDown = indexRatio < 1.18;
  const middleDown = middleRatio < 1.18;

  if (ringUp && pinkyUp && indexDown && middleDown) return true;

  const hornsUp = ringRatio >= 1.04 && pinkyRatio >= 1.03;
  const foldedMore =
    indexRatio <= ringRatio + 0.1 && middleRatio <= pinkyRatio + 0.1;
  const hornsHigher = ringRatio + pinkyRatio >= indexRatio + middleRatio + 0.04;

  return hornsUp && foldedMore && hornsHigher;
}

export function isRingGesture(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const ringDist = distance(landmarks[4], landmarks[8]);
  return ringDist < 0.14;
}

export function isOpenPalm(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const fingers = [8, 12, 16, 20];
  const extended = fingers.filter((tip, i) => {
    const pip = [6, 10, 14, 18][i];
    const mcp = [5, 9, 13, 17][i];
    return fingerStretchRatio(landmarks, tip, pip, mcp) > 1.02;
  });
  return extended.length >= 3;
}

export function isFist(landmarks: Landmark[]): boolean {
  if (landmarks.length < 21) return false;
  const fingers = [8, 12, 16, 20];
  const folded = fingers.filter((tip, i) => {
    const pip = [6, 10, 14, 18][i];
    const mcp = [5, 9, 13, 17][i];
    return fingerStretchRatio(landmarks, tip, pip, mcp) < 1.15;
  });
  return folded.length >= 3;
}
