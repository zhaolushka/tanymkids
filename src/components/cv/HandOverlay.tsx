"use client";

import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";
import {
  FINGER_COLORS,
  FINGER_TIP_INDEX,
  FINGER_TIPS,
  HAND_CONNECTIONS,
} from "@/lib/cv/hand-connections";
import { getExtendedFingers } from "@/lib/cv/hand-landmarks";
import {
  getVideoContentRect,
  landmarkToCanvas,
  readVideoDimensions,
} from "@/lib/cv/video-content-rect";
import type { Landmark } from "@/types/exercise";

interface HandOverlayProps {
  hands: Landmark[][];
  mirrored?: boolean;
  videoRef?: RefObject<HTMLVideoElement | null>;
}

export function HandOverlay({ hands, mirrored = true, videoRef }: HandOverlayProps) {
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

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { width: vw, height: vh } = readVideoDimensions(videoRef?.current ?? null);
    const rect = getVideoContentRect(canvas.width, canvas.height, vw, vh);

    for (const hand of hands) {
      drawHand(ctx, hand, rect, mirrored);
    }
  }, [hands, mirrored, videoRef, videoLayoutTick]);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

function drawHand(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  contentRect: { x: number; y: number; width: number; height: number },
  mirrored: boolean,
) {
  if (landmarks.length < 21) return;

  const toCanvas = (point: Landmark) => landmarkToCanvas(point, contentRect, mirrored);

  const points = landmarks.map(toCanvas);
  const extended = getExtendedFingers(landmarks);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const [from, to] of HAND_CONNECTIONS) {
    const start = points[from];
    const end = points[to];
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = FINGER_COLORS.line;
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  points.forEach((point, index) => {
    const tipIndex = (FINGER_TIPS as readonly number[]).indexOf(index);
    const isTip = tipIndex >= 0;
    const fingerKey = FINGER_TIP_INDEX[index];
    const isExtendedTip = isTip && extended[tipIndex];

    ctx.beginPath();
    ctx.arc(point.x, point.y, isTip ? 10 : 5, 0, Math.PI * 2);
    ctx.fillStyle = isTip && fingerKey ? FINGER_COLORS[fingerKey] : FINGER_COLORS.joint;
    ctx.fill();

    if (isExtendedTip) {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 16, 0, Math.PI * 2);
      ctx.strokeStyle = FINGER_COLORS[fingerKey ?? "line"];
      ctx.lineWidth = 3;
      ctx.stroke();
    }
  });
}
