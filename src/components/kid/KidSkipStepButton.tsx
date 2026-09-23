"use client";

import { Button } from "@/components/ui/button";
import { lessonsKk } from "@/i18n/lessons";

interface KidSkipStepButtonProps {
  onSkip: () => void;
  disabled?: boolean;
}

/** Крупная кнопка «к следующему шагу» — удобно на телефоне */
export function KidSkipStepButton({ onSkip, disabled }: KidSkipStepButtonProps) {
  return (
    <Button
      type="button"
      variant="kid"
      size="lg"
      disabled={disabled}
      onClick={onSkip}
      className="min-h-14 w-full max-w-sm touch-manipulation text-lg font-extrabold"
    >
      ⏭️ {lessonsKk.skipShort}
    </Button>
  );
}
