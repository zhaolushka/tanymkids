import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { handExercises } from "@/lib/exercises/catalog";
import { kk } from "@/i18n/kk";

export default function HandsListPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-kid-purple">{kk.hands.listTitle}</h1>
        <Link href="/kid" className="text-sm text-muted-foreground hover:underline">
          {kk.kid.backMenu}
        </Link>
      </div>
      <p className="text-lg text-muted-foreground">{kk.hands.listDesc}</p>
      <Link
        href="/kid/hands/lesson"
        className="lesson-card block p-6 text-center transition hover:-translate-y-0.5"
      >
        <p className="text-2xl font-extrabold text-kid-purple">{kk.hands.tryTrack}</p>
        <p className="mt-1 text-sm text-muted-foreground">{kk.lessons.subtitle}</p>
      </Link>
      <div className="grid gap-4">
        {handExercises.map((exercise) => (
          <Link key={exercise.id} href={`/kid/hands/${exercise.id}`}>
            <Card className="flex items-center gap-4 transition-transform hover:scale-[1.02] cursor-pointer">
              <span className="text-5xl">{exercise.emoji}</span>
              <div>
                <CardTitle>{exercise.title}</CardTitle>
                <p className="text-muted-foreground">{exercise.instruction}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
