export type ExerciseModule = "lfk" | "hands";

export interface Exercise {
  id: string;
  module: ExerciseModule;
  title: string;
  instruction: string;
  emoji: string;
  holdDurationMs: number;
  difficulty: 1 | 2 | 3;
  steps: string[];
  /** Путь к видео в public, например /demos/arms_up.mp4 */
  demoVideo?: string;
  demoPoster?: string;
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface EvaluationResult {
  success: boolean;
  accuracy: number;
  hint?: string;
  /** Одна рука уже правильно — нужна вторая */
  partial?: boolean;
}

export interface ExerciseEvaluator {
  evaluate(landmarks: Landmark[]): EvaluationResult;
}
