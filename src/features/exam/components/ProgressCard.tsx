"use client";

import React, { memo } from "react";
import type { ExamProgress, ExamProfile } from "../types";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  progress: ExamProgress;
  profile: ExamProfile;
  className?: string;
}

function StatTile({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string | number;
  sub?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-muted/30 p-3">
      <span
        className={cn(
          "text-2xl font-bold tabular-nums",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
      {sub && <span className="text-xs text-muted-foreground/60">{sub}</span>}
    </div>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "Never";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Displays a candidate's progress summary for a specific exam:
 * attempts, best WPM, average WPM, average accuracy, and last practiced date.
 */
export const ProgressCard = memo(function ProgressCard({
  progress,
  profile,
  className,
}: ProgressCardProps) {
  const bestIsQualifying = progress.bestWPM >= profile.qualifyingSpeed;

  return (
    <section
      aria-label="Practice progress"
      className={cn(
        "w-full rounded-xl border border-border/50 bg-card p-5 flex flex-col gap-4",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Your Progress
        </h2>
        <span className="text-xs text-muted-foreground">
          Last practiced: {formatDate(progress.lastPracticed)}
        </span>
      </div>

      {progress.attempts === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          No practice sessions recorded yet. Start your first session!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              label="Sessions"
              value={progress.attempts}
            />
            <StatTile
              label="Best Speed"
              value={`${progress.bestWPM} WPM`}
              sub={bestIsQualifying ? "✓ Qualifying" : undefined}
              highlight={bestIsQualifying}
            />
            <StatTile
              label="Avg Speed"
              value={`${progress.averageWPM} WPM`}
            />
            <StatTile
              label="Avg Accuracy"
              value={`${progress.averageAccuracy}%`}
              highlight={progress.averageAccuracy >= profile.qualifyingAccuracy}
            />
          </div>

          {progress.completedPassages > 0 && (
            <p className="text-xs text-muted-foreground">
              Passages completed: {progress.completedPassages}
            </p>
          )}
        </>
      )}
    </section>
  );
});
