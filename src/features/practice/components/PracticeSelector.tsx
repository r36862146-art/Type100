import React from "react";
import { PracticeMode } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PracticeSelectorProps {
  currentMode: PracticeMode;
  availableModes: PracticeMode[];
  onModeChange: (mode: PracticeMode) => void;
  className?: string;
}

export const PracticeSelector = React.memo(function PracticeSelector({
  currentMode,
  availableModes,
  onModeChange,
  className,
}: PracticeSelectorProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-2 bg-muted/30 p-1.5 rounded-xl border border-border/40",
        className
      )}
      role="radiogroup"
      aria-label="Practice Mode Selection"
    >
      {availableModes.map((mode) => (
        <button
          key={mode}
          type="button"
          role="radio"
          aria-checked={currentMode === mode}
          onClick={() => onModeChange(mode)}
          className={cn(
            "px-4 py-2 min-h-[44px] md:min-h-0 md:py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            currentMode === mode
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      ))}
    </div>
  );
});
