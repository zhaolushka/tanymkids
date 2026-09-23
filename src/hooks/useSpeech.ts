"use client";

import { useCallback } from "react";

export function useSpeech() {
  const say = useCallback((_text: string) => {}, []);
  const stop = useCallback(() => {}, []);

  return { say, stop };
}
