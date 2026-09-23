export type HandGesture =
  | "palm"
  | "fist"
  | "ring"
  | "goat"
  | "peace"
  | "index_up";

export type LessonTaskMode = "both_same" | "both_different" | "solo_practice";

export interface LessonTask {
  id: string;
  title: string;
  instruction: string;
  emoji: string;
  /** Сколько миллисекунд удерживать правильный жест, чтобы перейти дальше */
  holdDurationMs: number;
  mode: LessonTaskMode;
  gesture?: HandGesture;
  leftGesture?: HandGesture;
  rightGesture?: HandGesture;
  /** Тек өзі қайталайтын қимылдар (solo_practice) */
  soloGestures?: HandGesture[];
  steps: string[];
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
