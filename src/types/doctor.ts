/** Маман бағыты — кейін толықтырамыз */
export type DoctorSpecialtyId =
  | "lfk"
  | "speech"
  | "neuro"
  | "pediatric"
  | "psychology"
  | "nutrition";

export interface DoctorQualification {
  id: string;
  title: string;
  year?: number;
}

export interface DoctorProfile {
  id: string;
  handle: string;
  fullName: string;
  specialtyId: DoctorSpecialtyId;
  emoji: string;
  city: string;
  bioShort: string;
  bio?: string;
  qualifications: DoctorQualification[];
  /** Кейін: /public/doctors/...jpg */
  avatarUrl?: string;
  verified?: boolean;
}

/** Кейінгі қадам: посттар */
export interface DoctorPost {
  id: string;
  doctorId: string;
  caption: string;
  imageUrl?: string;
  createdAt: string;
}

/** Кейінгі қадам: сторис */
export interface DoctorStory {
  id: string;
  doctorId: string;
  label: string;
  imageUrl?: string;
  expiresAt?: string;
}
