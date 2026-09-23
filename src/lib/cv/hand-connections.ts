export const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [0, 9], [9, 10], [10, 11], [11, 12],
  [0, 13], [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
];

export const FINGER_TIPS = [4, 8, 12, 16, 20] as const;

export const FINGER_COLORS = {
  thumb: "#fbbf24",
  index: "#38bdf8",
  middle: "#4ade80",
  ring: "#fb923c",
  pinky: "#f472b6",
  joint: "#ffffff",
  line: "#a78bfa",
} as const;

export const FINGER_TIP_INDEX: Record<number, keyof typeof FINGER_COLORS> = {
  4: "thumb",
  8: "index",
  12: "middle",
  16: "ring",
  20: "pinky",
};
