import { DoctorAppShell } from "@/components/doctor/DoctorAppShell";

export default function DoctorLayout({ children }: LayoutProps<"/doctor">) {
  return <DoctorAppShell>{children}</DoctorAppShell>;
}
