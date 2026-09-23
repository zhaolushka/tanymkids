"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ParentAiAssistantChat } from "@/components/parent/ParentAiAssistantChat";

function AssistantInner() {
  const params = useSearchParams();
  const doctor = params.get("doctor") ?? undefined;

  return <ParentAiAssistantChat doctorHandle={doctor} />;
}

export default function ParentAssistantPage() {
  return (
    <Suspense fallback={null}>
      <AssistantInner />
    </Suspense>
  );
}
