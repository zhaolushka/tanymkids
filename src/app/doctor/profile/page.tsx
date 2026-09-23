"use client";

import { LogOut } from "lucide-react";
import { PtmCard, PtmPageTitle, parentInitials } from "@/components/parent/parent-telemed-ui";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import { useI18n } from "@/i18n/LocaleProvider";

export default function DoctorProfilePage() {
  const { t } = useI18n();
  const auth = t.auth;
  const { displayName, signOut } = useAuth();
  const name = displayName || auth.doctorDemoName;

  return (
    <div className="space-y-4">
      <PtmPageTitle title={auth.doctorNavProfile} />
      <PtmCard className="p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ptm-accent)]/15 text-lg font-bold text-[var(--ptm-accent)]">
            {parentInitials(name)}
          </div>
          <div>
            <p className="text-lg font-bold">{name}</p>
            <p className="text-sm text-[var(--ptm-muted)]">{auth.tabDoctor}</p>
          </div>
        </div>
      </PtmCard>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={async () => {
          await signOut();
          window.location.href = "/";
        }}
      >
        <LogOut className="mr-2 h-4 w-4" />
        {auth.signOut}
      </Button>
    </div>
  );
}
