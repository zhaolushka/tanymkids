import profilesData from "@/data/doctors/profiles.json";
import type { DoctorProfile } from "@/types/doctor";

export const doctorProfiles = profilesData as DoctorProfile[];

export function getDoctorProfile(id: string): DoctorProfile | undefined {
  return doctorProfiles.find((d) => d.id === id);
}

export function getDoctorByHandle(handle: string): DoctorProfile | undefined {
  return doctorProfiles.find((d) => d.handle === handle);
}
