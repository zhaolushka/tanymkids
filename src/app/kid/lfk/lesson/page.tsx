import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { lfkLessons } from "@/lib/lessons/lfk-catalog";
import { kk } from "@/i18n/kk";

export default function LfkLessonListPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-kid-purple">{kk.lfk.lessonListTitle}</h1>
        <Link href="/kid/lfk" className="text-sm text-muted-foreground hover:underline">
          {kk.kid.backMenu}
        </Link>
      </div>
      <div className="grid gap-4">
        {lfkLessons.map((lesson) => (
          <Link key={lesson.id} href={`/kid/lfk/lesson/${lesson.id}`}>
            <Card className="flex items-center gap-4 transition-transform hover:scale-[1.02] cursor-pointer">
              <span className="text-5xl">{lesson.emoji}</span>
              <div>
                <CardTitle>{lesson.title}</CardTitle>
                <p className="text-muted-foreground">{lesson.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
