"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

export function OpenKidLessonLink({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
  childId?: string;
}) {
  return (
    <Link href="/login/who" className="flex items-center gap-3 px-4 py-3.5 text-sm font-medium">
      <Icon className="h-5 w-5 text-[var(--ptm-accent)]" aria-hidden />
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-[var(--ptm-muted)]" aria-hidden />
    </Link>
  );
}
