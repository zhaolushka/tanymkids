import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { lfkExercises } from "@/lib/exercises/catalog";
import { kk } from "@/i18n/kk";

export default function LfkListPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-kid-purple">{kk.lfk.listTitle}</h1>
        <Link href="/kid" className="text-sm text-muted-foreground hover:underline">
          {kk.kid.backMenu}
        </Link>
      </div>
      <p className="text-lg text-muted-foreground">{kk.lfk.listDesc}</p>
      <Link href="/kid/lfk/lesson">
        <Card className="flex items-center gap-4 border-2 border-kid-purple bg-kid-purple/10 transition-transform hover:scale-[1.02] cursor-pointer">
          <span className="text-5xl">📺</span>
          <div>
            <CardTitle>{kk.lfk.lessonStart}</CardTitle>
            <p className="text-muted-foreground">{kk.lfk.lessonListTitle}</p>
          </div>
        </Card>
      </Link>
      <Link href="/kid/lfk/workout">
        <Card className="flex items-center gap-4 border-2 border-kid-green bg-kid-green/10 transition-transform hover:scale-[1.02] cursor-pointer">
          <span className="text-5xl">▶️</span>
          <div>
            <CardTitle>{kk.lfk.workoutTitle}</CardTitle>
            <p className="text-muted-foreground">{kk.lfk.workoutDesc}</p>
          </div>
        </Card>
      </Link>
      <div className="grid gap-4">
        {lfkExercises.map((exercise) => (
          <Link key={exercise.id} href={`/kid/lfk/${exercise.id}`}>
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
