"use client";

/** Озвучка временно отключена */
export const SPEECH_ENABLED = false;

let speaking = false;

export function speak(_text: string, _lang = "kk-KZ"): void {
  if (!SPEECH_ENABLED) return;
}

export function stopSpeaking(): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  speaking = false;
}

export function isSpeaking(): boolean {
  return speaking;
}
