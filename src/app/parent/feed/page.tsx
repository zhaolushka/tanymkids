import { redirect } from "next/navigation";

export default function ParentFeedRedirect() {
  redirect("/parent/network");
}
