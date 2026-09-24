export function formatThreadTime(isoDate: string): string {
  const d = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T12:00:00`);
  const diff = Date.now() - d.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "now";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
