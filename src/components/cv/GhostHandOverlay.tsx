"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import { HAND_CONNECTIONS } from "@/lib/cv/hand-connections";
import { buildGhostPair } from "@/lib/cv/gesture-templates";
import { fingerKk } from "@/lib/lessons/finger-labels";
import {
  getVideoContentRect,
  landmarkToCanvas,
  readVideoDimensions,
} from "@/lib/cv/video-content-rect";
import type { HandGesture } from "@/types/lesson";
import type { Landmark } from "@/types/exercise";

interface GhostHandOverlayProps {
  leftGesture?: HandGesture | null;
  rightGesture?: HandGesture | null;
  opacity?: number;
  mirrored?: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
}

export function GhostHandOverlay({
  leftGesture,
  rightGesture,
  opacity = 0.42,
  mirrored = true,
  videoRef,
}: GhostHandOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLayoutTick, setVideoLayoutTick] = useState(0);

  useEffect(() => {
    const video = videoRef?.current;
    if (!video) return;
    const bump = () => setVideoLayoutTick((value) => value + 1);
    video.addEventListener("loadedmetadata", bump);
    return () => video.removeEventListener("loadedmetadata", bump);
  }, [videoRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { width: vw, height: vh } = readVideoDimensions(videoRef?.current ?? null);
    const rect = getVideoContentRect(canvas.width, canvas.height, vw, vh);

    const { left, right } = buildGhostPair(leftGesture ?? null, rightGesture ?? null);
    if (left && leftGesture) drawGhostHand(ctx, left, leftGesture, rect, mirrored, opacity);
    if (right && rightGesture) drawGhostHand(ctx, right, rightGesture, rect, mirrored, opacity);
  }, [leftGesture, rightGesture, mirrored, opacity, videoRef, videoLayoutTick]);

  if (!leftGesture && !rightGesture) return null;

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 z-[5]">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function tipLabelsForGesture(gesture: HandGesture): { tipIndex: number; text: string }[] {
  switch (gesture) {
    case "index_up":
      return [{ tipIndex: 8, text: fingerKk.index }];
    case "peace":
      return [
        { tipIndex: 8, text: fingerKk.index },
        { tipIndex: 12, text: fingerKk.middle },
      ];
    case "ring":
      return [{ tipIndex: 16, text: fingerKk.ring }];
    case "goat":
      return [
        { tipIndex: 16, text: fingerKk.ring },
        { tipIndex: 20, text: fingerKk.pinky },
      ];
    default:
      return [];
  }
}

function drawGhostHand(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  gesture: HandGesture,
  contentRect: { x: number; y: number; width: number; height: number },
  mirrored: boolean,
  opacity: number,
) {
  if (landmarks.length < 21) return;

  const toCanvas = (point: Landmark) => landmarkToCanvas(point, contentRect, mirrored);

  const points = landmarks.map(toCanvas);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const [from, to] of HAND_CONNECTIONS) {
    const start = points[from];
    const end = points[to];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.strokeStyle = "rgba(124, 58, 237, 0.85)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  const activeTips = new Set(tipLabelsForGesture(gesture).map((item) => item.tipIndex));

  points.forEach((point, index) => {
    const isTip = [4, 8, 12, 16, 20].includes(index);
    ctx.beginPath();
    ctx.arc(point.x, point.y, isTip ? 9 : 5, 0, Math.PI * 2);
    if (activeTips.has(index)) {
      ctx.fillStyle = "rgba(251, 191, 36, 0.95)";
    } else {
      ctx.fillStyle = isTip ? "rgba(255, 255, 255, 0.55)" : "rgba(255, 255, 255, 0.85)";
    }
    ctx.fill();
  });

  ctx.font = "bold 12px system-ui, sans-serif";
  ctx.textBaseline = "bottom";
  for (const { tipIndex, text } of tipLabelsForGesture(gesture)) {
    const point = points[tipIndex];
    if (!point) continue;
    const x = point.x + 8;
    const y = point.y - 6;
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(88, 28, 135, 0.95)";
    ctx.strokeText(text, x, y);
    ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
    ctx.fillText(text, x, y);
  }

  ctx.restore();
}
