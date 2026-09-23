import type { Landmark } from "@/types/exercise";

function pt(x: number, y: number, z = 0): Landmark {
  return { x, y, z };
}

/** Базовая стойка: лицом к камере, нормализованные координаты. */
function baseStandingPose(): Landmark[] {
  const landmarks: Landmark[] = Array.from({ length: 33 }, () => pt(0.5, 0.5));
  landmarks[0] = pt(0.5, 0.18);
  landmarks[11] = pt(0.42, 0.32);
  landmarks[12] = pt(0.58, 0.32);
  landmarks[13] = pt(0.38, 0.42);
  landmarks[14] = pt(0.62, 0.42);
  landmarks[15] = pt(0.36, 0.52);
  landmarks[16] = pt(0.64, 0.52);
  landmarks[23] = pt(0.44, 0.52);
  landmarks[24] = pt(0.56, 0.52);
  landmarks[25] = pt(0.43, 0.68);
  landmarks[26] = pt(0.57, 0.68);
  landmarks[27] = pt(0.42, 0.88);
  landmarks[28] = pt(0.58, 0.88);
  return landmarks;
}

function clonePose(landmarks: Landmark[]): Landmark[] {
  return landmarks.map((p) => ({ ...p }));
}

function applyArmsUp(pose: Landmark[]) {
  pose[13] = pt(0.32, 0.22);
  pose[14] = pt(0.68, 0.22);
  pose[15] = pt(0.3, 0.12);
  pose[16] = pt(0.7, 0.12);
}

function applySideBend(pose: Landmark[]) {
  pose[11] = pt(0.4, 0.34);
  pose[12] = pt(0.58, 0.3);
  pose[23] = pt(0.42, 0.54);
  pose[24] = pt(0.56, 0.5);
  pose[15] = pt(0.34, 0.5);
  pose[16] = pt(0.66, 0.48);
}

function applySquat(pose: Landmark[]) {
  pose[23] = pt(0.44, 0.58);
  pose[24] = pt(0.56, 0.58);
  pose[25] = pt(0.4, 0.72);
  pose[26] = pt(0.6, 0.72);
  pose[27] = pt(0.38, 0.82);
  pose[28] = pt(0.62, 0.82);
  pose[15] = pt(0.38, 0.48);
  pose[16] = pt(0.62, 0.48);
}

function applyOneLegBalance(pose: Landmark[]) {
  pose[27] = pt(0.42, 0.88);
  pose[28] = pt(0.58, 0.72);
  pose[26] = pt(0.57, 0.62);
  pose[15] = pt(0.4, 0.46);
  pose[16] = pt(0.6, 0.44);
}

function applyForwardBend(pose: Landmark[]) {
  pose[0] = pt(0.5, 0.38);
  pose[11] = pt(0.44, 0.42);
  pose[12] = pt(0.56, 0.42);
  pose[23] = pt(0.46, 0.56);
  pose[24] = pt(0.54, 0.56);
  pose[15] = pt(0.4, 0.58);
  pose[16] = pt(0.6, 0.58);
}

function applyArmsSide(pose: Landmark[]) {
  pose[13] = pt(0.28, 0.36);
  pose[14] = pt(0.72, 0.36);
  pose[15] = pt(0.18, 0.36);
  pose[16] = pt(0.82, 0.36);
}

export function getGhostPoseForExercise(exerciseId: string): Landmark[] | null {
  const pose = clonePose(baseStandingPose());
  switch (exerciseId) {
    case "grow_up":
    case "arms_up":
      applyArmsUp(pose);
      return pose;
    case "wings":
    case "arms_side":
      applyArmsSide(pose);
      return pose;
    case "airplane":
    case "side_bend":
      applySideBend(pose);
      return pose;
    case "bow_forward":
    case "forward_bend":
      applyForwardBend(pose);
      return pose;
    case "small_big":
    case "squat":
      applySquat(pose);
      return pose;
    case "one_leg_balance":
      applyOneLegBalance(pose);
      return pose;
    default:
      return pose;
  }
}
