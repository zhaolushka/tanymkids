export interface ExerciseResultRecord {
  exerciseId: string;
  accuracy: number;
  starsEarned: number;
  completedAt: string;
}

export interface SessionRecord {
  id: string;
  childId: string;
  module: "lfk" | "hands";
  durationSec: number;
  avgAccuracy: number;
  starsEarned: number;
  exercises: ExerciseResultRecord[];
  startedAt: string;
  endedAt: string;
}
