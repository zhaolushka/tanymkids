"use client";

export function vibrateShort(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(40);
  }
}

/** Следующее упражнение */
export function vibrateNextExercise(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate([120, 60, 120]);
  }
}

export function vibrateSuccess(): void {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(50);
  }
}
