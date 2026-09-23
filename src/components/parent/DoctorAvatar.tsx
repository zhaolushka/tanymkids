import { cn } from "@/lib/utils";

function initialsFromName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[1]![0]!).toUpperCase();
  }
  return fullName.slice(0, 2).toUpperCase();
}

type DoctorAvatarProps = {
  fullName: string;
  className?: string;
  textClassName?: string;
};

export function DoctorAvatar({ fullName, className, textClassName }: DoctorAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary/10 font-bold text-primary",
        className,
      )}
    >
      <span className={cn("select-none", textClassName)}>{initialsFromName(fullName)}</span>
    </div>
  );
}
