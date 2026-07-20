"use client";

import React, { memo } from "react";
import type { ExamProfile } from "../types";
import { ORGANIZATION_ABBREVIATIONS, LANGUAGE_LABELS } from "../constants";
import { cn } from "@/lib/utils";

interface ExamCardProps {
  profile: ExamProfile;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Compact summary card for a single ExamProfile.
 * Used in grid/list views of available exams.
 */
export const ExamCard = memo(function ExamCard({
  profile,
  isSelected = false,
  onClick,
  className,
}: ExamCardProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-4 transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "min-h-[44px] hover:border-primary/50 hover:bg-muted/30",
        isSelected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border/50 bg-card",
        className
      )}
    >
      {/* Org badge + Language */}
      <div className="flex items-center justify-between mb-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
          {ORGANIZATION_ABBREVIATIONS[profile.organization]}
        </span>
        <span className="text-xs text-muted-foreground">
          {LANGUAGE_LABELS[profile.language]}
        </span>
      </div>

      {/* Exam name */}
      <p className="font-semibold text-sm text-foreground leading-snug mb-1 line-clamp-2">
        {profile.exam}
      </p>

      {/* Post name */}
      <p className="text-xs text-muted-foreground line-clamp-1 mb-3">
        {profile.post}
      </p>

      {/* Speed target */}
      <div className="flex items-center gap-3 text-xs">
        <span className="font-medium text-foreground">
          {profile.qualifyingSpeed} <span className="text-muted-foreground font-normal">WPM</span>
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="font-medium text-foreground">
          {profile.qualifyingAccuracy}
          <span className="text-muted-foreground font-normal">% accuracy</span>
        </span>
        {!profile.typingTestRequired && (
          <>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground italic">Optional</span>
          </>
        )}
      </div>
    </button>
  );
});
