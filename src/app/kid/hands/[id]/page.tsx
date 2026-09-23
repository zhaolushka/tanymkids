import { notFound } from "next/navigation";
import { HandSession } from "@/components/exercises/HandSession";
import { getHandExercise } from "@/lib/exercises/catalog";

export default async function HandExercisePage({
  params,
}: PageProps<"/kid/hands/[id]">) {
  const { id } = await params;
  const exercise = getHandExercise(id);
  if (!exercise) notFound();

  return (
    <div className="py-4">
      <HandSession exercise={exercise} />
    </div>
  );
}
