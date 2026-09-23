import { ParentAppShell } from "@/components/parent/ParentAppShell";

export default function ParentLayout({ children }: LayoutProps<"/parent">) {
  return <ParentAppShell>{children}</ParentAppShell>;
}
