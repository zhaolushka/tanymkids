import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { kk } from "@/i18n/kk";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16">
      <div className="text-center">
        <p className="text-6xl mb-4">🐻</p>
        <h1 className="text-5xl font-extrabold text-kid-purple">TanymKids</h1>
        <p className="mt-4 max-w-xl text-xl text-muted-foreground">{kk.landing.tagline}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 max-w-2xl w-full">
        <Card className="flex flex-col items-center gap-4 text-center">
          <CardTitle>{kk.landing.forChild}</CardTitle>
          <p className="text-muted-foreground">{kk.landing.forChildDesc}</p>
          <Link href="/kid">
            <Button variant="kid" size="lg">
              {kk.landing.startLesson}
            </Button>
          </Link>
        </Card>

        <Card className="flex flex-col items-center gap-4 text-center">
          <CardTitle>{kk.landing.forParent}</CardTitle>
          <p className="text-muted-foreground">{kk.landing.forParentDesc}</p>
          <Link href="/parent/dashboard">
            <Button variant="default" size="lg">
              {kk.landing.parentCabinet}
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
