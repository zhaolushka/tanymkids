"use client";

import Link from "next/link";
import { useState } from "react";
import { CameraView } from "@/components/cv/CameraView";
import { HandOverlay } from "@/components/cv/HandOverlay";
import { Mascot } from "@/components/kid/Mascot";
import { Button } from "@/components/ui/button";
import { useCamera } from "@/hooks/useCamera";
import { useHandTracking } from "@/hooks/useHandTracking";
import { kk } from "@/i18n/kk";

export default function FingerTrackPage() {
  const [started, setStarted] = useState(false);
  const { videoRef, connectVideoRef, ready, loading, error, retry, requestFromUserGesture } =
    useCamera({
      enabled: true,
      autoStart: false,
    });
  const { hands, detected, loading: modelLoading } = useHandTracking(
    videoRef,
    started && ready,
  );

  const beginTrack = () => {
    void requestFromUserGesture().then((ok) => {
      if (ok) setStarted(true);
    });
  };

  const cameraShellClass = started
    ? "relative"
    : "pointer-events-none fixed left-0 top-0 -z-10 h-[480px] w-[640px] overflow-hidden opacity-0";

  return (
    <div className="flex flex-col gap-6 py-4">
      {!started ? (
        <div className="flex flex-col items-center gap-8 text-center">
          <Mascot message={kk.hands.trackIntro} />
          <Button variant="kid" size="xl" onClick={beginTrack}>
            {kk.hands.trackStart}
          </Button>
          <Link href="/kid/hands" className="text-sm text-muted-foreground hover:underline">
            {kk.hands.trackBack}
          </Link>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Mascot message={error} mood="thinking" />
          <Button variant="kid" onClick={retry}>
            {kk.camera.retry}
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-kid-purple">{kk.hands.trackTitle}</h1>
            <Link href="/kid/hands" className="text-sm text-muted-foreground hover:underline">
              {kk.hands.trackBack}
            </Link>
          </div>

          <p className="text-center text-lg font-medium text-kid-purple">
            {detected ? kk.hands.trackSeen : kk.hands.trackCloser}
          </p>
        </>
      )}

      <div className={cameraShellClass}>
        <CameraView
          videoRef={connectVideoRef}
          loading={started && (loading || modelLoading || !ready)}
          className={started ? "aspect-[4/3] w-full max-h-[60vh]" : "h-full w-full object-cover"}
        />
        {started && ready && <HandOverlay hands={hands} mirrored videoRef={videoRef} />}
      </div>
    </div>
  );
}
