import { notFound, redirect } from "next/navigation";
import { LfkSession } from "@/components/exercises/LfkSession";
import { getLfkExercise, resolveLfkExerciseId } from "@/lib/exercises/catalog";

export default async function LfkExercisePage({
  params,
}: PageProps<"/kid/lfk/[id]">) {
  const { id } = await params;
  const resolved = resolveLfkExerciseId(id);
  if (resolved !== id) {
    redirect(`/kid/lfk/${resolved}`);
  }
  const exercise = getLfkExercise(id);
  if (!exercise) notFound();

  return (
    <div className="py-4">
      <LfkSession exercise={exercise} />
    </div>
  );
}
