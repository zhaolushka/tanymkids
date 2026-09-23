import type { Metadata } from "next";
import "@/components/parent/telemed-theme.css";

export const metadata: Metadata = {
  title: "TanymKids — кіру",
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return <div className="parent-telemed min-h-screen bg-[var(--ptm-bg)]">{children}</div>;
}
