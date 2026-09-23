import Link from "next/link";
import { KidParentLink } from "@/components/auth/KidParentLink";
import { StarCounter } from "@/components/gamification/StarCounter";

export default function KidLayout({ children }: LayoutProps<"/kid">) {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#e0f2fe_0%,_#f8f4ff_45%,_#fce7f3_100%)]">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/kid" className="text-2xl font-extrabold text-kid-purple">
            🐻 TanymKids
          </Link>
          <div className="flex items-center gap-3">
            <KidParentLink />
            <StarCounter />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 pb-12">{children}</main>
    </div>
  );
}
