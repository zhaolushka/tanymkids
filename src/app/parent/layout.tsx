import Link from "next/link";
import { kk } from "@/i18n/kk";

export default function ParentLayout({ children }: LayoutProps<"/parent">) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/parent/dashboard" className="text-xl font-bold text-primary">
            {kk.parent.cabinet}
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link href="/parent/dashboard" className="hover:underline">
              {kk.parent.overview}
            </Link>
            <Link href="/" className="text-muted-foreground hover:underline">
              {kk.parent.home}
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
