"use client";

import { useCallback } from "react";

export function useHintSpeech() {
  const sayHint = useCallback((_text: string, _force = false) => {}, []);
  const sayWrong = useCallback((_hint: string) => {}, []);

  return { sayHint, sayWrong };
}
