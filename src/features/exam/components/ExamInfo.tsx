"use client";

import React, { memo } from "react";
import type { ExamProfile } from "../types";
import { ORGANIZATION_LABELS, LANGUAGE_LABELS } from "../constants";
import { cn } from "@/lib/utils";

interface ExamInfoProps {
  profile: ExamProfile;
  className?: string;
}

function InfoRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border/30 last:border-0">
      <dt className="text-sm text-muted-foreground shrink-0">{label}</dt>
      <dd
        className={cn(
          "text-sm font-medium text-right",
          highlight ? "text-primary" : "text-foreground"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

/**
 * Detailed information panel that renders all fields from an ExamProfile.
 * Data flows entirely from the registry — no hardcoded values.
 */
export const ExamInfo = memo(function ExamInfo({
  profile,
  className,
}: ExamInfoProps) {
  return (
    <section
      aria-label={`Exam details for ${profile.exam}`}
      className={cn(
        "w-full rounded-xl border border-border/50 bg-card p-5",
        className
      )}
    >
      <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">
        Exam Details
      </h2>

      <dl>
        <InfoRow
          label="Organization"
          value={ORGANIZATION_LABELS[profile.organization]}
        />
        <InfoRow label="Exam" value={profile.exam} />
        <InfoRow label="Post" value={profile.post} />
        <InfoRow
          label="Language"
          value={LANGUAGE_LABELS[profile.language]}
        />
        <InfoRow
          label="Required Speed"
          value={`${profile.qualifyingSpeed} WPM`}
          highlight
        />
        <InfoRow
          label="Required Accuracy"
          value={`${profile.qualifyingAccuracy}%`}
          highlight
        />
        <InfoRow
          label="Time Limit"
          value={`${profile.duration} minutes`}
        />
        <InfoRow
          label="Typing Test"
          value={profile.typingTestRequired ? "Required" : "Optional"}
        />
        <InfoRow
          label="Timer"
          value={profile.timerEnabled ? "Enabled" : "Disabled"}
        />
        {profile.passageCategories.length > 0 && (
          <InfoRow
            label="Passage Topics"
            value={profile.passageCategories
              .map((c) => c.replace("_", " "))
              .join(", ")}
          />
        )}
      </dl>

      {profile.description && (
        <p className="mt-4 text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
          {profile.description}
        </p>
      )}
    </section>
  );
});
