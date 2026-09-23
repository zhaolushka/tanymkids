import { notFound } from "next/navigation";
import { HandLessonSession } from "@/components/exercises/HandLessonSession";
import { getHandLesson } from "@/lib/lessons/catalog";

export default async function HandLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getHandLesson(id);
  if (!lesson) notFound();

  return <HandLessonSession lesson={lesson} />;
}
