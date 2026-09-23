interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-white/60 shadow-inner">
      <div
        className="h-full rounded-full bg-gradient-to-r from-kid-green to-emerald-400 transition-all duration-200"
        style={{ width: `${Math.min(100, progress)}%` }}
      />
    </div>
  );
}
