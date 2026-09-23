import { redirect } from "next/navigation";

/** Тот же кабинет, полноэкранный сайт в telemed-стиле */
export default function TelemedPage() {
  redirect("/parent/home");
}
