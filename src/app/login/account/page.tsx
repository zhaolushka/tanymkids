"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LoginScreen } from "@/components/auth/LoginScreen";

function AccountEntry() {
  const params = useSearchParams();
  const router = useRouter();
  const role = params.get("role");

  useEffect(() => {
    if (role !== "parent" && role !== "doctor") {
      router.replace("/login/mode");
    }
  }, [role, router]);

  if (role !== "parent" && role !== "doctor") return null;
  return <LoginScreen />;
}

export default function LoginAccountPage() {
  return (
    <Suspense fallback={null}>
      <AccountEntry />
    </Suspense>
  );
}
