import {
  BarChart3,
  Home,
  MessageCircle,
  Settings,
  Stethoscope,
  User,
  type LucideIcon,
} from "lucide-react";
import type { Messages } from "@/i18n/types";

export type ParentNavItem = {
  href: string;
  label: string;
  Icon: LucideIcon;
};

export function getParentMainNav(t: Messages): ParentNavItem[] {
  return [
    { href: "/parent/home", label: t.parent.navHome, Icon: Home },
    { href: "/parent/network", label: t.parent.navDoctors, Icon: Stethoscope },
    { href: "/parent/messages", label: t.parent.navMessages, Icon: MessageCircle },
    { href: "/parent/profile", label: t.parent.navProfile, Icon: User },
    { href: "/parent/settings", label: t.parent.navSettings, Icon: Settings },
  ];
}

export function getParentHomeShortcuts(t: Messages): ParentNavItem[] {
  return [
    { href: "/parent/network", label: t.parent.navDoctors, Icon: Stethoscope },
    { href: "/parent/messages", label: t.parent.navMessages, Icon: MessageCircle },
    { href: "/parent/dashboard", label: t.parent.childStats, Icon: BarChart3 },
    { href: "/parent/settings", label: t.parent.navSettings, Icon: Settings },
  ];
}

export function parentHomeShortcutDesc(t: Messages, href: string): string {
  const map: Record<string, string> = {
    "/parent/network": t.parent.homeDoctorsDesc,
    "/parent/messages": t.parent.homeMessagesDesc,
    "/parent/dashboard": t.parent.homeStatsDesc,
    "/parent/settings": t.parent.homeSettingsDesc,
  };
  return map[href] ?? "";
}
