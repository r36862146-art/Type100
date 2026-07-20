"use client";

import React, { memo } from "react";
import { cn } from "@/lib/utils";

export interface SharedCompletionProps {
  score: {
    netWPM?: number;
    grossWPM?: number;
    accuracy: number;
    errors: number;
    qualifies: boolean;
    // Any extra stats to show in the detailed breakdown
    extraStats?: { label: string; value: string | number }[];
  };
  targetWpm: number;
  targetAccuracy: number;
  postName: string;
  isKPH?: boolean;
  onRestart: () => void;
  onExit: () => void;
  allowRestart: boolean;
  analysis?: {
    strongest: string;
    weakest: string;
  };
  className?: string;
}

export const SharedCompletion = memo(function SharedCompletion({
  score,
  targetWpm,
  targetAccuracy,
  postName,
  isKPH,
  onRestart,
  onExit,
  allowRestart,
  analysis,
  className,
}: SharedCompletionProps) {
  const achievedLabel = isKPH
    ? `${(score.netWPM || 0).toLocaleString()} KPH` // Assuming netWPM holds KPH if isKPH
    : `${score.netWPM || score.grossWPM || 0} WPM`;
    
  const targetLabel = isKPH
    ? `${targetWpm.toLocaleString()} KPH`
    : `${targetWpm} WPM`;

  return (
    <section
      aria-label="Exam results"
      className={cn(
        "w-full max-w-2xl mx-auto flex flex-col gap-5 rounded-2xl border border-border/50 bg-card p-7 shadow-sm",
        className
      )}
    >
      <div className="text-center flex flex-col items-center gap-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          {postName}
        </h2>
        <span
          className={cn(
            "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold border",
            score.qualifies
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          )}
        >
          {score.qualifies ? "✓ Qualifying Score" : "✗ Not Yet Qualifying"}
        </span>
        <p className="text-xs text-muted-foreground">
          {score.qualifies
            ? "Great work! You meet the qualifying standard."
            : "Keep practicing — you're on your way!"}
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Achieved Speed", value: achievedLabel, highlight: score.qualifies },
          { label: "Target Speed", value: targetLabel },
          { label: "Accuracy", value: `${score.accuracy.toFixed(1)}%`, highlight: score.accuracy >= targetAccuracy },
          { label: "Total Errors", value: score.errors.toString() },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="flex flex-col gap-1 rounded-xl bg-muted/30 p-3">
            <span className={cn("text-xl font-bold tabular-nums", highlight ? "text-green-500" : "text-foreground")}>
              {value}
            </span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Extra Breakdown Stats */}
      {score.extraStats && score.extraStats.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {score.extraStats.map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm py-1.5 border-b border-border/20">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted/20 border border-border/30 p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Strongest Area</p>
            <p className="text-sm font-semibold text-foreground">{analysis.strongest}</p>
          </div>
          <div className="rounded-xl bg-muted/20 border border-border/30 p-3">
            <p className="text-xs text-muted-foreground mb-0.5">Needs Work</p>
            <p className="text-sm font-semibold text-foreground">{analysis.weakest}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-3">
        {allowRestart && (
          <button
            onClick={onRestart}
            className={cn(
              "flex-1 px-6 py-3 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-semibold text-sm",
              "hover:bg-primary/90 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Try Again
          </button>
        )}
        <button
          onClick={onExit}
          className={cn(
            "flex-1 px-6 py-3 min-h-[44px] rounded-xl border border-border/50 text-sm",
            "hover:border-primary/40 transition-colors bg-card",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          Exit to Dashboard
        </button>
      </div>
    </section>
  );
});
