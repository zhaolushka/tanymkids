import { notFound } from "next/navigation";
import { LfkLessonSession } from "@/components/exercises/LfkLessonSession";
import { getLfkLesson } from "@/lib/lessons/lfk-catalog";

export default async function LfkLessonPage({
  params,
}: PageProps<"/kid/lfk/lesson/[id]">) {
  const { id } = await params;
  const lesson = getLfkLesson(id);
  if (!lesson) notFound();

  return (
    <div className="py-4">
      <LfkLessonSession lesson={lesson} />
    </div>
  );
}
