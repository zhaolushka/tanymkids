import handsData from "@/data/exercises/hands.json";
import lfkData from "@/data/exercises/lfk.json";
import type { Exercise } from "@/types/exercise";

export const lfkExercises = lfkData as Exercise[];
export const handExercises = handsData as Exercise[];

/** Еski ссылкалар → жаңа ЛФК id */
const LFK_ID_ALIASES: Record<string, string> = {
  arms_up: "grow_up",
  arms_side: "wings",
  side_bend: "airplane",
  forward_bend: "bow_forward",
  squat: "small_big",
  one_leg_balance: "small_big",
};

export function resolveLfkExerciseId(id: string): string {
  return LFK_ID_ALIASES[id] ?? id;
}

export function getLfkExercise(id: string): Exercise | undefined {
  const resolved = resolveLfkExerciseId(id);
  return lfkExercises.find((e) => e.id === resolved);
}

export function getHandExercise(id: string): Exercise | undefined {
  return handExercises.find((e) => e.id === id);
}
