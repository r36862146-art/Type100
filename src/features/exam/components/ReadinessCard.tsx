"use client";

import React, { memo } from "react";
import type { ReadinessReport } from "../types";
import { READINESS_LABELS } from "../constants";
import { cn } from "@/lib/utils";

interface ReadinessCardProps {
  report: ReadinessReport;
  className?: string;
}

function StatRow({
  label,
  current,
  target,
  gap,
  unit,
}: {
  label: string;
  current: number;
  target: number;
  gap: number;
  unit: string;
}) {
  const met = gap >= 0;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span
          className={cn(
            "font-semibold tabular-nums",
            met ? "text-green-500" : "text-amber-500"
          )}
        >
          {met ? "▲" : "▼"} {Math.abs(gap).toFixed(1)}
          {unit} {met ? "above" : "below"} target
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            met ? "bg-green-500" : gap >= -10 ? "bg-amber-500" : "bg-destructive/70"
          )}
          style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-foreground font-semibold">
          {current.toFixed(unit === "%" ? 1 : 0)}
          {unit}
        </span>
        <span className="text-muted-foreground">
          Target: {target}
          {unit}
        </span>
      </div>
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  ready: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  almost_ready: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  needs_practice: "bg-muted text-muted-foreground border-border/50",
};

/**
 * Displays current WPM and accuracy vs qualifying target with a visual gap indicator.
 */
export const ReadinessCard = memo(function ReadinessCard({
  report,
  className,
}: ReadinessCardProps) {
  const statusStyle =
    STATUS_STYLES[report.overallReadiness] ?? STATUS_STYLES.needs_practice;

  return (
    <section
      aria-label="Readiness overview"
      className={cn(
        "w-full rounded-xl border border-border/50 bg-card p-5 flex flex-col gap-5",
        className
      )}
    >
      {/* Header + status badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
          Your Readiness
        </h2>
        <span
          className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border",
            statusStyle
          )}
          aria-label={`Overall readiness: ${READINESS_LABELS[report.overallReadiness]}`}
        >
          {READINESS_LABELS[report.overallReadiness]}
        </span>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-4">
        <StatRow
          label="Typing Speed"
          current={report.currentWPM}
          target={report.requiredWPM}
          gap={report.wpmGap}
          unit=" WPM"
        />
        <StatRow
          label="Accuracy"
          current={report.currentAccuracy}
          target={report.requiredAccuracy}
          gap={report.accuracyGap}
          unit="%"
        />
      </div>

      {/* Qualification probability */}
      <div className="pt-2 border-t border-border/30">
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-muted-foreground">Estimated qualification chance</span>
          <span className="font-semibold text-foreground">
            {report.estimatedQualification}%
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              report.estimatedQualification >= 100
                ? "bg-green-500"
                : report.estimatedQualification >= 70
                ? "bg-amber-500"
                : "bg-primary"
            )}
            style={{ width: `${report.estimatedQualification}%` }}
          />
        </div>
      </div>

      {/* Areas to improve */}
      {report.areasToImprove.length > 0 && (
        <ul
          aria-label="Areas to improve"
          className="flex flex-col gap-1.5"
        >
          {report.areasToImprove.map((area, i) => (
            <li key={i} className="text-xs text-muted-foreground flex gap-2">
              <span className="text-primary shrink-0">→</span>
              {area}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
});
