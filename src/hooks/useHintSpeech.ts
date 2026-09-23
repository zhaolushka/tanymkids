"use client";

import { useCallback } from "react";

/** Озвучка временно отключена */
export function useHintSpeech() {
  const sayHint = useCallback((_text: string, _force = false) => {}, []);
  const sayWrong = useCallback((_hint: string) => {}, []);

  return { sayHint, sayWrong };
}
