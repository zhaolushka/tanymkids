"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useI18n } from "@/i18n/LocaleProvider";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <LanguageSwitcher compact />
      </div>

      <div className="text-center">
        <p className="mb-4 text-6xl">🐻</p>
        <h1 className="text-5xl font-extrabold text-kid-purple">TanymKids</h1>
        <p className="mt-4 max-w-xl text-xl text-muted-foreground">{t.landing.tagline}</p>
      </div>

      <div className="grid w-full max-w-2xl gap-6 sm:grid-cols-2">
        <Card className="flex flex-col items-center gap-4 text-center">
          <CardTitle>{t.landing.forChild}</CardTitle>
          <p className="text-muted-foreground">{t.landing.forChildDesc}</p>
          <Link href="/kid">
            <Button variant="kid" size="lg">
              {t.landing.startLesson}
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col items-center gap-4 text-center">
          <CardTitle>{t.landing.forParent}</CardTitle>
          <p className="text-muted-foreground">{t.landing.forParentDesc}</p>
          <Link href="/parent/home">
            <Button variant="default" size="lg">
              {t.landing.parentCabinet}
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
