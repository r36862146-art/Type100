import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
      <StatBox label="Correct" value={correct} total={total} colorClass="text-green-500 dark:text-green-400" />
      <StatBox label="Incorrect" value={incorrect} total={total} colorClass="text-red-500 dark:text-red-400" />
      <StatBox label="Extra" value={extra} total={total} colorClass="text-orange-500 dark:text-orange-400" />
      <StatBox label="Missed" value={missed} total={total} colorClass="text-muted-foreground" />
    </div>
  );
});

interface StatBoxProps {
  label: string;
  value: number;
  total: number;
  colorClass: string;
}

function StatBox({ label, value, total, colorClass }: StatBoxProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  
  return (
    <div className="flex flex-col p-4 rounded-xl bg-card border border-border/40 text-card-foreground">
      <span className="text-sm font-medium text-muted-foreground mb-2">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className={cn("text-2xl font-bold", colorClass)}>{value}</span>
        {total > 0 && (
          <span className="text-xs text-muted-foreground">({percentage}%)</span>
        )}
      </div>
    </div>
  );
}
