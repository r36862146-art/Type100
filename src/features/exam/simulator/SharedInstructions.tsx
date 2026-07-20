"use client";

import React, { memo } from "react";
import type { ExamProfile } from "../types";
import { cn } from "@/lib/utils";
import { ExamOrganization } from "../types";

const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  hi: "Hindi"
};

export interface SharedInstructionsProps {
  profile: ExamProfile;
  duration: number; // minutes
  targetWpm: number;
  targetAccuracy: number;
  autoSubmit: boolean;
  showLiveStats: boolean;
  allowPause: boolean;
  allowRestart: boolean;
  isOfficialSimulation: boolean;
  instructions: string[];
  onStart: () => void;
  onBack: () => void;
  className?: string;
  themeColorClass?: string; // e.g. "bg-teal-600", "bg-blue-600"
}

function RuleRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-border/20 last:border-0 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function getOrgColor(org: ExamOrganization): string {
  switch(org) {
    case "SSC": return "bg-blue-600 hover:bg-blue-700";
    case "RRB": return "bg-rose-600 hover:bg-rose-700";
    case "Andaman": return "bg-teal-600 hover:bg-teal-700";
    default: return "bg-primary hover:bg-primary/90";
  }
}

function getOrgBadgeColor(org: ExamOrganization): string {
  switch(org) {
    case "SSC": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
    case "RRB": return "bg-rose-500/10 text-rose-600 dark:text-rose-400";
    case "Andaman": return "bg-teal-500/10 text-teal-600 dark:text-teal-400";
    default: return "bg-primary/10 text-primary";
  }
}

export const SharedInstructions = memo(function SharedInstructions({
  profile,
  duration,
  targetWpm,
  targetAccuracy,
  autoSubmit,
  showLiveStats,
  allowPause,
  allowRestart,
  isOfficialSimulation,
  instructions,
  onStart,
  onBack,
  className,
}: SharedInstructionsProps) {
  const isPracticeOnly = !profile.typingTestRequired;
  const orgColor = getOrgColor(profile.organization);
  const badgeColor = getOrgBadgeColor(profile.organization);

  return (
    <div
      role="dialog"
      aria-labelledby="exam-instructions-heading"
      aria-modal="true"
      className={cn(
        "w-full max-w-2xl mx-auto flex flex-col gap-6 rounded-2xl border border-border/50 bg-card p-8",
        className
      )}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold", badgeColor)}>
            {profile.organization}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
            {isOfficialSimulation ? "Official Simulation" : "Practice Mode"}
          </span>
          {isPracticeOnly && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              Preparatory Only
            </span>
          )}
        </div>
        <h2
          id="exam-instructions-heading"
          className="text-xl font-bold text-foreground"
        >
          {profile.exam}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{profile.post}</p>
        <p className="text-xs text-muted-foreground mt-2 italic leading-relaxed">
          {profile.description}
        </p>
      </div>

      {/* Exam specs */}
      <section aria-label="Exam specifications">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Exam Specifications
        </h3>
        <div className="rounded-xl bg-muted/20 border border-border/30 px-4 py-1">
          <RuleRow label="Duration" value={`${duration} minute${duration !== 1 ? "s" : ""}`} />
          <RuleRow label="Language" value={LANGUAGE_LABELS[profile.language] || profile.language} />
          <RuleRow label="Required Speed" value={`${targetWpm} WPM`} />
          {targetAccuracy > 0 && <RuleRow label="Required Accuracy" value={`${targetAccuracy}%`} />}
          <RuleRow label="Auto Submit" value={autoSubmit ? "Yes — at timer expiry" : "No"} />
          <RuleRow label="Live Statistics" value={showLiveStats ? "Enabled" : "Disabled"} />
          {allowPause && <RuleRow label="Pause" value="Allowed (practice mode)" />}
          {allowRestart && <RuleRow label="Restart" value="Allowed (practice mode)" />}
        </div>
      </section>

      {/* Official rules */}
      {instructions && instructions.length > 0 && (
        <section aria-label="Exam rules">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
            Rules
          </h3>
          <ul className="flex flex-col gap-2" role="list">
            {instructions.map((rule, i) => (
              <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                <span className="font-bold shrink-0 text-foreground">{i + 1}.</span>
                {rule}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onStart}
          autoFocus
          className={cn(
            "flex-1 px-6 py-3 min-h-[44px] rounded-xl text-white font-semibold text-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
            orgColor
          )}
          aria-label="Start typing test"
        >
          I Understand — Start Test →
        </button>
        <button
          onClick={onBack}
          className={cn(
            "px-5 py-3 min-h-[44px] rounded-xl border border-border/50 text-sm text-muted-foreground",
            "hover:bg-muted transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          )}
          aria-label="Go back"
        >
          Back
        </button>
      </div>
    </div>
  );
});
