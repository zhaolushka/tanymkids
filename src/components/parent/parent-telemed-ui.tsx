import Link from "next/link";
import { MoreHorizontal, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function PtmPageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-bold text-[var(--ptm-text)] sm:text-xl">{title}</h1>
      {subtitle ? <p className="mt-1 text-sm text-[var(--ptm-muted)]">{subtitle}</p> : null}
    </div>
  );
}

export function PtmSectionTitle({ title, moreLabel }: { title: string; moreLabel: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-base font-bold text-[var(--ptm-text)]">{title}</h2>
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center text-[var(--ptm-muted)]"
        aria-label={moreLabel}
      >
        <MoreHorizontal className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}

export function PtmCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[var(--ptm-radius-md)] bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PtmDoctorRow({
  href,
  name,
  role,
  initials,
  rating,
  reviews,
  reviewsLabel,
}: {
  href: string;
  name: string;
  role: string;
  initials: string;
  rating: number;
  reviews: number;
  reviewsLabel: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[var(--ptm-radius-md)] bg-[var(--ptm-card)] p-3.5 shadow-[var(--ptm-shadow-sm)] transition-shadow hover:shadow-[var(--ptm-shadow)] sm:p-4"
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--ptm-bg)] text-sm font-bold text-[var(--ptm-accent)]">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-[var(--ptm-text)]">{name}</p>
        <p className="truncate text-xs text-[var(--ptm-muted)] sm:text-sm">{role}</p>
        <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-[var(--ptm-text)]">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
          {rating.toFixed(1)}
          <span className="font-normal text-[var(--ptm-muted)]">
            ({reviews} {reviewsLabel})
          </span>
        </p>
      </div>
    </Link>
  );
}

export function parentInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function parentDoctorRating(verified: boolean | undefined, qualCount: number): number {
  return 4.7 + (verified ? 0.2 : 0) + qualCount * 0.02;
}

export function parentDoctorReviews(qualCount: number): number {
  return 70 + qualCount * 28;
}
