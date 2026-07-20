import React from "react";
import { RotateCcw, ChevronRight } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SessionActionsProps {
  onRepeatTest?: () => void;
  onNextTest?: () => void;
  className?: string;
}

export const SessionActions = React.memo(function SessionActions({
  onRepeatTest,
  onNextTest,
  className,
}: SessionActionsProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center justify-center gap-4", className)}
      role="group"
      aria-label="Session actions"
    >
      {onNextTest && (
        <button
          onClick={onNextTest}
          className="flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
          autoFocus
        >
          <span>Next Test</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
      {onRepeatTest && (
        <button
          onClick={onRepeatTest}
          className="flex items-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground font-semibold rounded-xl shadow-sm hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Repeat Test</span>
        </button>
      )}
    </div>
  );
});
