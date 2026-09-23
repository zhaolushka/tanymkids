"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/** Старые ссылки /login → главная точка входа `/` */
function LoginRedirectInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const q = params.toString();
    router.replace(q ? `/login/mode?${q}` : "/login/mode");
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F6FB] text-sm text-muted-foreground">
      …
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginRedirectInner />
    </Suspense>
  );
}
