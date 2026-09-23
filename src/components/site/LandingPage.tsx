"use client";

import Link from "next/link";
import { Activity, Shield, Stethoscope, Users } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useI18n } from "@/i18n/LocaleProvider";
import "@/components/parent/telemed-theme.css";

export function LandingPage() {
  const { t } = useI18n();
  const L = t.landing;

  const news = [
    { title: L.news1Title, body: L.news1Body, tag: L.newsTag },
    { title: L.news2Title, body: L.news2Body, tag: L.newsTag },
    { title: L.news3Title, body: L.news3Body, tag: L.newsTag },
  ];

  const features = [
    { icon: Activity, title: L.featureLfkTitle, desc: L.featureLfkDesc },
    { icon: Users, title: L.featureParentTitle, desc: L.featureParentDesc },
    { icon: Stethoscope, title: L.featureDoctorTitle, desc: L.featureDoctorDesc },
    { icon: Shield, title: L.featureSafeTitle, desc: L.featureSafeDesc },
  ];

  return (
    <div className="parent-telemed min-h-screen bg-[var(--ptm-bg)] text-[var(--ptm-text)]">
      <SiteHeader />

      <main>
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="inline-block rounded-full bg-[var(--ptm-accent)]/10 px-3 py-1 text-xs font-bold text-[var(--ptm-accent)]">
                {L.heroBadge}
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">{L.heroTitle}</h1>
              <p className="mt-4 text-lg leading-relaxed text-[var(--ptm-muted)]">{L.tagline}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login/mode"
                  className="rounded-2xl bg-[var(--ptm-accent)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(47,107,255,0.35)]"
                >
                  {L.registerCta}
                </Link>
                <a
                  href="#about"
                  className="rounded-2xl border border-[var(--ptm-accent)]/25 bg-[var(--ptm-card)] px-6 py-3.5 text-sm font-bold text-[var(--ptm-accent)]"
                >
                  {L.navAbout}
                </a>
              </div>
            </div>
            <div className="rounded-[var(--ptm-radius-lg)] bg-gradient-to-br from-[var(--ptm-accent)] to-[var(--ptm-accent-dark)] p-8 text-white shadow-[var(--ptm-shadow)]">
              <p className="text-6xl" aria-hidden>
                🐻
              </p>
              <p className="mt-4 text-xl font-bold">{L.heroCardTitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{L.heroCardDesc}</p>
              <ul className="mt-6 space-y-2 text-sm font-medium">
                <li>✓ {L.heroPoint1}</li>
                <li>✓ {L.heroPoint2}</li>
                <li>✓ {L.heroPoint3}</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="news" className="border-t border-black/[0.04] bg-[var(--ptm-card)] py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-extrabold">{L.newsTitle}</h2>
            <p className="mt-1 text-sm text-[var(--ptm-muted)]">{L.newsSubtitle}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {news.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[var(--ptm-radius-md)] border border-black/[0.04] bg-[var(--ptm-bg)] p-5 shadow-[var(--ptm-shadow-sm)]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--ptm-accent)]">
                    {item.tag}
                  </span>
                  <h3 className="mt-2 font-bold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--ptm-muted)]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-12 sm:py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="text-2xl font-extrabold">{L.aboutTitle}</h2>
            <p className="mt-1 max-w-2xl text-sm text-[var(--ptm-muted)]">{L.aboutSubtitle}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 rounded-[var(--ptm-radius-md)] bg-[var(--ptm-card)] p-5 shadow-[var(--ptm-shadow-sm)]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--ptm-accent)]/10 text-[var(--ptm-accent)]">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <div>
                    <h3 className="font-bold">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--ptm-muted)]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-[var(--ptm-radius-lg)] bg-[var(--ptm-card)] p-6 text-center shadow-[var(--ptm-shadow)] sm:p-8">
              <p className="text-lg font-bold">{L.ctaBlockTitle}</p>
              <p className="mt-2 text-sm text-[var(--ptm-muted)]">{L.ctaBlockDesc}</p>
              <Link
                href="/login/mode"
                className="mt-6 inline-block rounded-2xl bg-[var(--ptm-accent)] px-8 py-3.5 text-sm font-bold text-white"
              >
                {L.registerCta}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/[0.04] py-8 text-center text-xs text-[var(--ptm-muted)]">
        TanymKids · {L.footer}
      </footer>
    </div>
  );
}
