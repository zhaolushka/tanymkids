"use client";

import { Suspense } from "react";
import { RoleModeScreen } from "@/components/auth/RoleModeScreen";

export default function LoginModePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB] text-sm text-muted-foreground">
          …
        </div>
      }
    >
      <RoleModeScreen />
    </Suspense>
  );
}
