/** MediaPipe VIDEO: timestamp только растёт; храним на globalThis (переживает HMR). */

type MpGlobal = typeof globalThis & {
  __tanymMpClocks?: Record<string, number>;
  __tanymMpOrigin?: number;
};

function clockStore(): Record<string, number> {
  const g = globalThis as MpGlobal;
  if (!g.__tanymMpClocks) {
    g.__tanymMpClocks = {};
  }
  return g.__tanymMpClocks;
}

function monotonicNowMs(): number {
  const g = globalThis as MpGlobal;
  if (g.__tanymMpOrigin == null) {
    g.__tanymMpOrigin = performance.now();
  }
  return Math.floor(performance.now() - g.__tanymMpOrigin);
}

export function resetMediaPipeVideoClock(streamId: string): void {
  const g = globalThis as MpGlobal;
  g.__tanymMpOrigin = performance.now();
  clockStore()[streamId] = 0;
}

export function nextMediaPipeVideoTimestampMs(streamId: string, stepMs = 33): number {
  const store = clockStore();
  const wall = monotonicNowMs();
  const next = Math.max((store[streamId] ?? 0) + stepMs, wall);
  store[streamId] = next;
  return next;
}

export function bumpMediaPipeVideoTimestampMs(streamId: string, extraMs: number): void {
  const store = clockStore();
  store[streamId] = Math.max((store[streamId] ?? 0) + extraMs, monotonicNowMs());
}
