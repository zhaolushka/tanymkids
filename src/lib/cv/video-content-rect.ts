import type { Landmark } from "@/types/exercise";

export interface ContentRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Letterbox rect for video with object-contain inside a container. */
export function getVideoContentRect(
  containerWidth: number,
  containerHeight: number,
  videoWidth: number,
  videoHeight: number,
): ContentRect {
  if (containerWidth <= 0 || containerHeight <= 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  if (!videoWidth || !videoHeight) {
    return { x: 0, y: 0, width: containerWidth, height: containerHeight };
  }

  const scale = Math.min(containerWidth / videoWidth, containerHeight / videoHeight);
  const width = videoWidth * scale;
  const height = videoHeight * scale;

  return {
    x: (containerWidth - width) / 2,
    y: (containerHeight - height) / 2,
    width,
    height,
  };
}

export function readVideoDimensions(video: HTMLVideoElement | null): {
  width: number;
  height: number;
} {
  if (!video) return { width: 0, height: 0 };
  const width = video.videoWidth || video.clientWidth;
  const height = video.videoHeight || video.clientHeight;
  return { width, height };
}

export function landmarkToCanvas(
  point: Landmark,
  rect: ContentRect,
  mirrored: boolean,
): { x: number; y: number } {
  return {
    x: rect.x + (mirrored ? 1 - point.x : point.x) * rect.width,
    y: rect.y + point.y * rect.height,
  };
}
