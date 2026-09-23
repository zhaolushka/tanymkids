"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface BigButtonProps {
  href: string;
  emoji: string;
  label: string;
  color?: string;
}

export function BigButton({ href, emoji, label, color = "bg-kid-blue" }: BigButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex min-h-[140px] min-w-[160px] flex-col items-center justify-center gap-3 rounded-3xl p-6 text-white shadow-xl transition-transform hover:scale-105 active:scale-95",
        color,
      )}
    >
      <span className="text-6xl" role="img" aria-hidden>
        {emoji}
      </span>
      <span className="text-xl font-bold text-center">{label}</span>
    </Link>
  );
}
