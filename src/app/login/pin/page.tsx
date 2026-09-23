"use client";

import { Suspense } from "react";
import { PinGateScreen } from "@/components/auth/PinGateScreen";

export default function PinLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-muted-foreground">…</div>}>
      <PinGateScreen />
    </Suspense>
  );
}
