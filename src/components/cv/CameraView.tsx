"use client";

import type { Ref } from "react";
import { kk } from "@/i18n/kk";

interface CameraViewProps {
  videoRef: Ref<HTMLVideoElement | null>;
  mirrored?: boolean;
  loading?: boolean;
  /** contain = full frame for CV overlays; cover = fill crop */
  fit?: "contain" | "cover";
  className?: string;
}

export function CameraView({
  videoRef,
  mirrored = true,
  loading = false,
  fit = "contain",
  className,
}: CameraViewProps) {
  const objectClass = fit === "cover" ? "object-cover" : "object-contain";

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-black ${className ?? ""}`}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        disablePictureInPicture
        className={`h-full w-full ${objectClass} ${mirrored ? "-scale-x-100" : ""}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white">
          <p className="text-lg font-semibold">{kk.camera.loading}</p>
        </div>
      )}
    </div>
  );
}
