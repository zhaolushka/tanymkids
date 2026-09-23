export type HandGesture =
  | "palm"
  | "fist"
  | "ring"
  | "goat"
  | "peace"
  | "index_up";

export type LessonTaskMode = "both_same" | "both_different" | "solo_practice" | "lfk_pose";

export interface LessonTask {
  id: string;
  title: string;
  instruction: string;
  emoji: string;
  /** Сколько миллисекунд удерживать правильный жест, чтобы перейти дальше */
  holdDurationMs: number;
  /** Сколько раз повторить удержание за один круг видео */
  repeatCount?: number;
  /** Сколько раз пройти тот же фрагмент видео (круги) */
  demoRounds?: number;
  mode: LessonTaskMode;
  gesture?: HandGesture;
  leftGesture?: HandGesture;
  rightGesture?: HandGesture;
  /** Тек өзі қайталайтын қимылдар (solo_practice) */
  soloGestures?: HandGesture[];
  steps: string[];
  /** ЛФК: id жаттығы (grow_up, wings, …) */
  lfkExerciseId?: string;
  /** Кадр видео: секунды (нарезанный ролик) */
  demoStartSec?: number;
  demoEndSec?: number;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  description: string;
  emoji: string;
  durationMin: number;
  tasks: LessonTask[];
  /** Видео-инструктор в углу */
  demoVideo?: string;
}
