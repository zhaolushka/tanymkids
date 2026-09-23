import Link from "next/link";
import { DoctorAvatar } from "@/components/parent/DoctorAvatar";
import type { DoctorProfile } from "@/types/doctor";

interface DoctorStoryRingProps {
  doctor: DoctorProfile;
  hasStory?: boolean;
}

export function DoctorStoryRing({ doctor, hasStory = true }: DoctorStoryRingProps) {
  return (
    <Link
      href={`/parent/doctors/${doctor.handle}`}
      className="flex w-[4.5rem] shrink-0 flex-col items-center gap-1"
    >
      <div
        className={
          hasStory
            ? "rounded-full bg-gradient-to-tr from-kid-orange via-kid-pink to-primary p-[2px]"
            : "rounded-full p-[2px]"
        }
      >
        <div className="rounded-full border-2 border-card bg-card">
          <DoctorAvatar fullName={doctor.fullName} className="h-14 w-14 text-base" />
        </div>
      </div>
      <span className="max-w-[4.5rem] truncate text-center text-[10px] font-semibold text-foreground">
        {doctor.fullName.split(" ")[0]}
      </span>
    </Link>
  );
}
