interface MascotProps {
  message?: string;
  mood?: "happy" | "thinking" | "celebrate";
}

export function Mascot({ message, mood = "happy" }: MascotProps) {
  const emoji = mood === "celebrate" ? "🎉" : mood === "thinking" ? "🤔" : "🐻";

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-kid-yellow text-5xl shadow-lg">
        {emoji}
      </div>
      {message && (
        <div className="max-w-xs rounded-2xl bg-white px-4 py-3 text-lg font-medium text-kid-purple shadow-md">
          {message}
        </div>
      )}
    </div>
  );
}
