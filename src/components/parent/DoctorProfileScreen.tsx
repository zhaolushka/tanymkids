"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";
import { parentInitials, PtmCard } from "@/components/parent/parent-telemed-ui";
import { useI18n } from "@/i18n/LocaleProvider";
import { getDoctorDetails, type DoctorScheduleDay } from "@/lib/doctors/doctor-details";
import { addDoctorPost, getDoctorPosts } from "@/lib/doctors/doctor-posts-store";
import type { LocalizedDoctor } from "@/lib/doctors/i18n";
import { getSpecialtyLabel } from "@/lib/doctors/specialties";
import type { DoctorPost } from "@/types/doctor";

type DoctorProfileScreenProps = {
  doctor: LocalizedDoctor;
};

export function DoctorProfileScreen({ doctor }: DoctorProfileScreenProps) {
  const { t, locale } = useI18n();
  const dp = t.doctorProfile;
  const details = getDoctorDetails(doctor.id);

  const [favorite, setFavorite] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [posts, setPosts] = useState<DoctorPost[]>([]);
  const [draft, setDraft] = useState("");
  const [postError, setPostError] = useState<string | null>(null);

  const refreshPosts = useCallback(() => {
    setPosts(getDoctorPosts(doctor.id));
  }, [doctor.id]);

  useEffect(() => {
    refreshPosts();
  }, [refreshPosts]);

  const aboutText = details.about[locale] ?? details.about.kk;
  const aboutPreview =
    aboutText.length > 120 && !aboutExpanded ? `${aboutText.slice(0, 120)}…` : aboutText;

  const dayLabels = useMemo(
    (): Record<DoctorScheduleDay["dayKey"], string> => ({
      mon: dp.dayMon,
      tue: dp.dayTue,
      wed: dp.dayWed,
      thu: dp.dayThu,
      fri: dp.dayFri,
      sat: dp.daySat,
      sun: dp.daySun,
    }),
    [dp],
  );

  const handlePublish = () => {
    try {
      addDoctorPost(doctor.id, draft);
      setDraft("");
      setPostError(null);
      refreshPosts();
    } catch {
      setPostError(locale === "ru" ? "Введите текст" : "Мәтін жазыңыз");
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      await navigator.share({ title: doctor.fullName, url });
    } else if (url) {
      await navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-md pb-28">
      <header className="mb-4 flex items-center justify-between gap-2">
        <Link
          href="/parent/network"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
          aria-label={t.parent.backToNetwork}
        >
          <ArrowLeft className="h-5 w-5 text-[var(--ptm-text)]" />
        </Link>
        <h1 className="flex-1 text-center text-sm font-bold text-[var(--ptm-text)] sm:text-base">
          {dp.title}
        </h1>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setFavorite((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
            aria-label={dp.favorite}
          >
            <Star
              className={`h-5 w-5 ${favorite ? "fill-amber-400 text-amber-400" : "text-[var(--ptm-muted)]"}`}
            />
          </button>
          <button
            type="button"
            onClick={() => void handleShare()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ptm-card)] shadow-[var(--ptm-shadow-sm)]"
            aria-label={dp.share}
          >
            <Share2 className="h-5 w-5 text-[var(--ptm-text)]" />
          </button>
        </div>
      </header>

      <PtmCard className="flex flex-col items-center px-4 pb-5 pt-6 text-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[var(--ptm-accent)] to-[var(--ptm-accent-dark)] text-3xl font-bold text-white shadow-[var(--ptm-shadow)]">
          {parentInitials(doctor.fullName)}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <h2 className="text-xl font-bold text-[var(--ptm-text)]">{doctor.fullName}</h2>
          {doctor.verified && (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-[var(--ptm-accent)]/10 px-2 py-0.5 text-xs font-semibold text-[var(--ptm-accent)]"
              title={dp.verifiedTooltip}
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
              {dp.verifiedDoctor}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-[var(--ptm-muted)]">
          {getSpecialtyLabel(doctor.specialtyId, locale)} · {doctor.city}
        </p>
        <p className="mt-2 flex items-center justify-center gap-1 text-sm font-semibold">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
          {details.rating.toFixed(1)}
          <span className="font-normal text-[var(--ptm-muted)]">
            ({details.reviewCount} {t.telemed.reviews})
          </span>
        </p>
        <div className="mt-5 grid w-full grid-cols-3 gap-2">
          <StatMini label={dp.patients} value={String(details.patientCount)} />
          <StatMini label={dp.experience} value={`${details.experienceYears} ${dp.years}`} />
          <StatMini label={dp.ratingLabel} value={details.rating.toFixed(1)} />
        </div>
      </PtmCard>

      {doctor.verified && (
        <PtmCard className="mt-4 border border-[var(--ptm-accent)]/20 bg-[var(--ptm-accent)]/[0.04] p-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--ptm-accent)]/15 text-[var(--ptm-accent)]">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--ptm-accent)]">{dp.verification}</p>
              <p className="mt-1 text-sm font-semibold text-[var(--ptm-text)]">{dp.licenseVerified}</p>
              <p className="font-mono text-sm text-[var(--ptm-muted)]">{details.licenseMasked}</p>
              <p className="mt-1 text-xs text-[var(--ptm-muted)]">
                {dp.licenseIssued}: {details.licenseIssued}
              </p>
              <button
                type="button"
                className="mt-3 rounded-xl bg-[var(--ptm-card)] px-3 py-2 text-xs font-bold text-[var(--ptm-accent)] shadow-[var(--ptm-shadow-sm)]"
                onClick={() => alert(dp.certificatePreview)}
              >
                {dp.viewCertificate}
              </button>
            </div>
          </div>
        </PtmCard>
      )}

      <section className="mt-4">
        <SectionHead title={dp.about} />
        <PtmCard className="p-4">
          <p className="text-sm leading-relaxed text-[var(--ptm-text)]">{aboutPreview}</p>
          {aboutText.length > 120 && (
            <button
              type="button"
              className="mt-2 text-sm font-bold text-[var(--ptm-accent)]"
              onClick={() => setAboutExpanded((v) => !v)}
            >
              {aboutExpanded ? dp.readLess : dp.readMore}
            </button>
          )}
        </PtmCard>
      </section>

      <section className="mt-4">
        <SectionHead title={dp.posts} />
        <PtmCard className="mb-3 p-4">
          <p className="mb-2 text-xs font-bold text-[var(--ptm-muted)]">{dp.newPost}</p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={dp.postPlaceholder}
            rows={3}
            className="w-full resize-none rounded-xl border-0 bg-[var(--ptm-bg)] px-3 py-2 text-sm outline-none ring-1 ring-black/5 focus:ring-[var(--ptm-accent)]"
          />
          {postError && <p className="mt-1 text-xs text-red-500">{postError}</p>}
          <button
            type="button"
            onClick={handlePublish}
            className="mt-3 w-full rounded-xl bg-[var(--ptm-accent)] py-2.5 text-sm font-bold text-white"
          >
            {dp.publish}
          </button>
        </PtmCard>
        <ul className="space-y-3">
          {posts.map((post) => (
            <li key={post.id}>
              <PtmCard className="p-4">
                <p className="text-sm text-[var(--ptm-text)]">{post.caption}</p>
                <p className="mt-2 text-xs text-[var(--ptm-muted)]">
                  {new Date(post.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : "kk-KZ")}
                </p>
              </PtmCard>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4">
        <SectionHead title={dp.workingTime} />
        <PtmCard className="divide-y divide-[var(--ptm-bg)] p-0">
          {details.schedule.map((row) => (
            <div key={row.dayKey} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="font-medium text-[var(--ptm-text)]">{dayLabels[row.dayKey]}</span>
              <span className="text-[var(--ptm-muted)]">{row.hours}</span>
            </div>
          ))}
        </PtmCard>
      </section>

      <section className="mt-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--ptm-text)]">{dp.reviews}</h3>
          <button type="button" className="flex items-center gap-0.5 text-sm font-semibold text-[var(--ptm-accent)]">
            {dp.seeAll}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <ul className="space-y-3">
          {details.reviews.slice(0, 2).map((review) => (
            <li key={review.id}>
              <PtmCard className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--ptm-bg)] text-xs font-bold text-[var(--ptm-accent)]">
                    {parentInitials(review.authorName)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{review.authorName}</p>
                    <p className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden />
                      ))}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-[var(--ptm-text)]">
                  {review.text[locale] ?? review.text.kk}
                </p>
              </PtmCard>
            </li>
          ))}
          {details.reviews.length === 0 && (
            <p className="text-center text-sm text-[var(--ptm-muted)]">{t.parent.soon}</p>
          )}
        </ul>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-black/5 bg-[var(--ptm-card)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-md flex-col gap-2 px-4 py-4">
          <Link
            href={`/parent/assistant?doctor=${doctor.handle}`}
            className="flex w-full items-center justify-center rounded-2xl border border-[var(--ptm-accent)]/30 bg-[var(--ptm-bg)] py-3 text-sm font-bold text-[var(--ptm-accent)]"
          >
            {t.parent.aiAssistant.askBeforeBook}
          </Link>
          <Link
            href="/parent/messages"
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-[var(--ptm-accent)] to-[var(--ptm-accent-dark)] py-3.5 text-base font-bold text-white shadow-[0_8px_24px_rgba(47,107,255,0.35)]"
          >
            {dp.bookAppointment}
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--ptm-bg)] px-2 py-2.5">
      <p className="text-base font-bold text-[var(--ptm-text)]">{value}</p>
      <p className="text-[10px] font-medium text-[var(--ptm-muted)]">{label}</p>
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return <h3 className="mb-2 text-base font-bold text-[var(--ptm-text)]">{title}</h3>;
}
