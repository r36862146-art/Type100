"use client";

import React, { memo } from "react";
import type { QualificationResult } from "../types";
import {
  QUALIFICATION_STATUS_LABELS,
  QUALIFICATION_STATUS_DESCRIPTIONS,
} from "../constants";
import { cn } from "@/lib/utils";

interface QualificationStatusProps {
  result: QualificationResult;
  className?: string;
}

const STATUS_STYLES = {
  qualified: {
    badge: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    icon: "✓",
    iconBg: "bg-green-500/10 text-green-600 dark:text-green-400",
  },
  nearly_ready: {
    badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: "◎",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  needs_improvement: {
    badge: "bg-muted text-muted-foreground border-border/50",
    icon: "↑",
    iconBg: "bg-muted text-muted-foreground",
  },
};

function CriterionBadge({
  label,
  met,
  shortfall,
  unit,
}: {
  label: string;
  met: boolean;
  shortfall: number;
  unit: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg p-3 border text-center",
        met
          ? "border-green-500/20 bg-green-500/5"
          : "border-amber-500/20 bg-amber-500/5"
      )}
    >
      <span
        className={cn(
          "text-lg font-bold",
          met ? "text-green-500" : "text-amber-500"
        )}
      >
        {met ? "✓" : `+${shortfall.toFixed(1)}${unit}`}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * Displays the candidate's current qualification status with a clear
 * next goal and improvement guidance.
 */
export const QualificationStatus = memo(function QualificationStatus({
  result,
  className,
}: QualificationStatusProps) {
  const styles = STATUS_STYLES[result.status];

  return (
    <section
      aria-label="Qualification status"
      className={cn(
        "w-full rounded-xl border border-border/50 bg-card p-5 flex flex-col gap-4",
        className
      )}
    >
      {/* Status header */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0",
            styles.iconBg
          )}
          aria-hidden="true"
        >
          {styles.icon}
        </span>
        <div>
          <div
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-0.5",
              styles.badge
            )}
          >
            {QUALIFICATION_STATUS_LABELS[result.status]}
          </div>
          <p className="text-xs text-muted-foreground">
            {QUALIFICATION_STATUS_DESCRIPTIONS[result.status]}
          </p>
        </div>
      </div>

      {/* Criterion breakdown */}
      <div className="grid grid-cols-2 gap-3">
        <CriterionBadge
          label="Speed"
          met={result.speedQualified}
          shortfall={result.details.wpmShortfall}
          unit=" WPM"
        />
        <CriterionBadge
          label="Accuracy"
          met={result.accuracyQualified}
          shortfall={result.details.accuracyShortfall}
          unit="%"
        />
      </div>

      {/* Next goal */}
      <div className="rounded-lg bg-muted/40 p-3 flex flex-col gap-1">
        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">
          Next Goal
        </p>
        <p className="text-sm text-foreground">{result.nextGoal}</p>
      </div>

      {/* Required improvement */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        {result.requiredImprovement}
      </p>
    </section>
  );
});
