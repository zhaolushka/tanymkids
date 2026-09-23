import type { DoctorProfile } from "@/types/doctor";

const specGroups: Record<string, DoctorProfile["specialtyId"][]> = {
  general: ["lfk", "speech", "pediatric"],
  neuro: ["neuro", "psychology"],
  radio: ["nutrition"],
};

export function filterDoctorsBySpecParam(
  doctors: DoctorProfile[],
  spec: string | null,
): DoctorProfile[] {
  if (!spec || spec === "all") return doctors;
  const ids = specGroups[spec];
  if (!ids) return doctors;
  return doctors.filter((d) => ids.includes(d.specialtyId));
}
