"use client";

import React, { memo } from "react";
import type { ExamProfile, ExamProgress } from "../types";
import { ORGANIZATION_LABELS } from "../constants";
import { cn } from "@/lib/utils";

interface ExamHeaderProps {
  profile: ExamProfile;
  progress?: ExamProgress | null;
  className?: string;
}

/**
 * Full-width header banner for the currently active exam.
 * Shows org, exam name, post, progress bar and typing test status.
 */
export const ExamHeader = memo(function ExamHeader({
  profile,
  progress,
  className,
}: ExamHeaderProps) {
  // Progress toward best WPM vs qualifying speed (capped 0–100%)
  const wpmProgress = progress
    ? Math.min(100, Math.round((progress.bestWPM / profile.qualifyingSpeed) * 100))
    : 0;

  return (
    <header
      role="banner"
      aria-label={`Active exam: ${profile.exam}`}
      className={cn(
        "w-full rounded-2xl border border-border/50 bg-card p-6 flex flex-col gap-4",
        className
      )}
    >
      {/* Top row: Org + typing test badge */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-1">
            {ORGANIZATION_LABELS[profile.organization]}
          </p>
          <h1 className="text-xl font-bold text-foreground leading-tight">
            {profile.exam}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{profile.post}</p>
        </div>

        <span
          className={cn(
            "shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
            profile.typingTestRequired
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-muted text-muted-foreground"
          )}
        >
          {profile.typingTestRequired ? "Typing Test Required" : "Test Optional"}
        </span>
      </div>

      {/* Progress toward qualifying WPM */}
      {progress && progress.attempts > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              Best:{" "}
              <span className="font-semibold text-foreground">
                {progress.bestWPM} WPM
              </span>
            </span>
            <span>
              Target:{" "}
              <span className="font-semibold text-foreground">
                {profile.qualifyingSpeed} WPM
              </span>
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={wpmProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${wpmProgress}% toward qualifying speed`}
            className="w-full h-2 rounded-full bg-muted overflow-hidden"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                wpmProgress >= 100
                  ? "bg-green-500"
                  : wpmProgress >= 70
                  ? "bg-amber-500"
                  : "bg-primary"
              )}
              style={{ width: `${wpmProgress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {profile.duration} min · {progress.attempts} attempt
            {progress.attempts !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </header>
  );
});
