import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ResultsSummaryProps {
  wpm: number;
  accuracy: number;
  className?: string;
}

export const ResultsSummary = React.memo(function ResultsSummary({
  wpm,
  accuracy,
  className,
}: ResultsSummaryProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-around p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20",
        className
      )}
    >
      <div className="flex flex-col items-center justify-center p-4">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
          WPM
        </span>
        <span className="text-6xl md:text-8xl font-black text-foreground drop-shadow-sm">
          {wpm}
        </span>
      </div>
      
      <div className="h-px w-full sm:w-px sm:h-24 bg-border/50 my-6 sm:my-0" />
      
      <div className="flex flex-col items-center justify-center p-4">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">
          Accuracy
        </span>
        <span className="text-6xl md:text-8xl font-black text-foreground drop-shadow-sm">
          {accuracy}<span className="text-4xl md:text-5xl text-muted-foreground">%</span>
        </span>
      </div>
    </div>
  );
});
