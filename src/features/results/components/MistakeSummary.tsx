import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Info } from "lucide-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MistakeSummaryProps {
  correct: number;
  incorrect: number;
  extra: number;
  missed: number;
  className?: string;
}

export const MistakeSummary = React.memo(function MistakeSummary({
  correct,
  incorrect,
  extra,
  missed,
  className,
}: MistakeSummaryProps) {
  const total = correct + incorrect + extra + missed;
  
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4",
        className
      )}
      aria-label="Character statistics breakdown"
    >
      <StatBox label="Correct" value={correct} total={total} colorClass="text-green-500 dark:text-green-400" tooltip="Characters typed perfectly" />
      <StatBox label="Incorrect" value={incorrect} total={total} colorClass="text-red-500 dark:text-red-400" tooltip="Characters typed incorrectly" />
      <StatBox label="Extra" value={extra} total={total} colorClass="text-orange-500 dark:text-orange-400" tooltip="Characters typed that were not expected" />
      <StatBox label="Missed" value={missed} total={total} colorClass="text-muted-foreground" tooltip="Characters skipped from the text" />
    </div>
  );
});

interface StatBoxProps {
  label: string;
  value: number;
  total: number;
  colorClass: string;
  tooltip?: string;
}

function StatBox({ label, value, total, colorClass, tooltip }: StatBoxProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="relative flex flex-col p-4 rounded-xl bg-card border border-border/40 text-card-foreground group">
      <div className="flex items-center gap-1.5 mb-2 cursor-help">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {tooltip && (
          <>
            <Info className="w-3.5 h-3.5 text-muted-foreground/60 transition-colors group-hover:text-primary" />
            <div className="absolute z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-xl border text-center pointer-events-none">
              {tooltip}
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover border-b border-r transform rotate-45"></div>
            </div>
          </>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-bold", colorClass)}>{value}</span>
        {total > 0 && (
          <span className="text-xs text-muted-foreground">({percentage}%)</span>
        )}
      </div>
    </div>
  );
}
