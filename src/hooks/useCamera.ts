"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Ref } from "react";
import { kk } from "@/i18n/kk";

interface UseCameraOptions {
  facingMode?: "user" | "environment";
  enabled?: boolean;
  autoStart?: boolean;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCameraErrorMessage(error: unknown): string {
  if (error instanceof DOMException || error instanceof Error) {
    switch (error.name) {
      case "NotAllowedError":
      case "PermissionDeniedError":
        return kk.camera.denied;
      case "NotFoundError":
      case "DevicesNotFoundError":
        return kk.camera.notFound;
      case "NotReadableError":
      case "TrackStartError":
        return kk.camera.busy;
      case "OverconstrainedError":
        return kk.camera.constrained;
      case "SecurityError":
      case "NotSupportedError":
        return kk.camera.security;
      default:
        break;
    }
  }

  if (error instanceof Error && error.message === "Video element not mounted") {
    return kk.camera.notMounted;
  }

  return kk.camera.default;
}

function isRetryableCameraError(error: unknown): boolean {
  if (!(error instanceof DOMException)) return false;
  return error.name === "NotReadableError" || error.name === "TrackStartError";
}

async function waitForVideoElement(
  getVideo: () => HTMLVideoElement | null,
  maxMs = 8000,
): Promise<HTMLVideoElement | null> {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    const video = getVideo();
    if (video) return video;
    await sleep(32);
  }
  return getVideo();
}

async function requestVideoStream(facingMode: "user" | "environment"): Promise<MediaStream> {
  const attempts: MediaStreamConstraints[] = [
    {
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        aspectRatio: { ideal: 4 / 3 },
        facingMode: { ideal: facingMode },
      },
      audio: false,
    },
    { video: true, audio: false },
    { video: { facingMode: { ideal: facingMode } }, audio: false },
  ];

  let lastError: unknown;

  for (const constraints of attempts) {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      lastError = error;
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        throw error;
      }
    }
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    for (const device of devices.filter((d) => d.kind === "videoinput")) {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId },
          audio: false,
        });
      } catch (error) {
        lastError = error;
      }
    }
  } catch {
    // enumerateDevices may fail before permission
  }

  throw lastError ?? new DOMException("Camera unavailable", "NotReadableError");
}

function stopTracks(stream: MediaStream | null): void {
  stream?.getTracks().forEach((track) => track.stop());
}

function clearVideoElement(video: HTMLVideoElement | null): void {
  if (!video) return;
  video.pause();
  video.srcObject = null;
}

export function useCamera({
  facingMode = "user",
  enabled = true,
  autoStart = true,
}: UseCameraOptions = {}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef(0);
  const [videoMounted, setVideoMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const playVideo = useCallback(async (video: HTMLVideoElement, session: number) => {
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise<void>((resolve, reject) => {
        const onReady = () => {
          cleanup();
          resolve();
        };
        const onFail = () => {
          cleanup();
          reject(new Error("Video failed to load"));
        };
        const cleanup = () => {
          video.removeEventListener("loadedmetadata", onReady);
          video.removeEventListener("error", onFail);
        };
        video.addEventListener("loadedmetadata", onReady);
        video.addEventListener("error", onFail);
      });
    }

    if (session !== sessionRef.current) return false;

    try {
      await video.play();
    } catch {
      await sleep(200);
      await video.play();
    }

    return session === sessionRef.current;
  }, []);

  const attachStream = useCallback(
    async (session: number) => {
      const video = videoRef.current;
      const stream = streamRef.current;
      if (!video || !stream || session !== sessionRef.current) return false;

      if (video.srcObject !== stream) {
        video.srcObject = stream;
      }

      const ok = await playVideo(video, session);
      if (!ok || session !== sessionRef.current) return false;

      setReady(true);
      setError(null);
      return true;
    },
    [playVideo],
  );

  const attachStreamRef = useRef(attachStream);
  attachStreamRef.current = attachStream;

  const reattachToVideo = useCallback(() => {
    if (!videoRef.current || !streamRef.current) return;
    const session = ++sessionRef.current;
    setLoading(true);
    void attachStreamRef.current(session).finally(() => {
      if (session === sessionRef.current) setLoading(false);
    });
  }, []);

  const assignVideoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoRef.current = node;
      if (!node) {
        setVideoMounted(false);
        setReady(false);
        return;
      }
      setVideoMounted(true);
      if (streamRef.current) {
        reattachToVideo();
      }
    },
    [reattachToVideo],
  );

  const stop = useCallback(() => {
    stopTracks(streamRef.current);
    streamRef.current = null;
    clearVideoElement(videoRef.current);
    setReady(false);
  }, []);

  const openCamera = useCallback(
    async (options?: { manualRetry?: boolean }): Promise<boolean> => {
      const session = ++sessionRef.current;
      setLoading(true);
      setError(null);

      try {
        if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
          throw new DOMException("Unsupported", "NotSupportedError");
        }

        if (options?.manualRetry) {
          stopTracks(streamRef.current);
          streamRef.current = null;
          clearVideoElement(videoRef.current);
          setReady(false);
          await sleep(500);
          if (session !== sessionRef.current) return false;
        }

        const existing = streamRef.current;
        const tracksLive =
          existing?.getVideoTracks().some((track) => track.readyState === "live") ?? false;

        if (!tracksLive) {
          stopTracks(streamRef.current);
          streamRef.current = null;

          let stream: MediaStream | null = null;
          let lastErr: unknown;
          for (let attempt = 0; attempt < 3; attempt++) {
            if (session !== sessionRef.current) return false;
            try {
              stream = await requestVideoStream(facingMode);
              break;
            } catch (err) {
              lastErr = err;
              if (!isRetryableCameraError(err) || attempt >= 2) throw err;
              await sleep(350 * (attempt + 1));
            }
          }
          if (!stream) throw lastErr ?? new DOMException("Camera unavailable", "NotReadableError");

          if (session !== sessionRef.current) {
            stopTracks(stream);
            return false;
          }
          streamRef.current = stream;
        }

        const video = await waitForVideoElement(() => videoRef.current);
        if (!video || session !== sessionRef.current) {
          throw new Error("Video element not mounted");
        }

        const attached = await attachStream(session);
        if (!attached && session === sessionRef.current) {
          throw new Error("Video element not mounted");
        }
        return attached;
      } catch (err) {
        if (session !== sessionRef.current) return false;
        console.error("Camera error:", err);
        setError(getCameraErrorMessage(err));
        setReady(false);
        stopTracks(streamRef.current);
        streamRef.current = null;
        clearVideoElement(videoRef.current);
        return false;
      } finally {
        if (session === sessionRef.current) {
          setLoading(false);
        }
      }
    },
    [attachStream, facingMode],
  );

  const openCameraRef = useRef(openCamera);
  openCameraRef.current = openCamera;

  const requestFromUserGesture = useCallback(
    () => openCameraRef.current(),
    [],
  );

  const retry = useCallback(() => {
    setError(null);
    void openCameraRef.current({ manualRetry: true });
  }, []);

  useEffect(() => {
    if (!autoStart || !enabled) return;
    void openCameraRef.current();
  }, [autoStart, enabled, videoMounted]);

  useEffect(() => {
    if (autoStart && !enabled) {
      sessionRef.current += 1;
      stop();
    }
  }, [autoStart, enabled, stop]);

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      stop();
    };
  }, [stop]);

  return {
    videoRef,
    connectVideoRef: assignVideoRef as Ref<HTMLVideoElement | null>,
    ready,
    loading,
    error,
    retry,
    stop,
    requestFromUserGesture,
  };
}
