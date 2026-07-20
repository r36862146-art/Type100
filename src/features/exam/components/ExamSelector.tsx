"use client";

import React, { memo, useCallback } from "react";
import type { ExamOrganization, ExamId, ExamLanguage, ExamProfile } from "../types";
import {
  ORGANIZATION_LABELS,
  LANGUAGE_LABELS,
} from "../constants";
import { ExamCard } from "./ExamCard";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

interface ExamSelectorProps {
  /** List of organizations from registry */
  availableOrganizations: ExamOrganization[];
  /** Distinct exam names for the selected org */
  availableExams: string[];
  /** All profiles (posts) for the selected exam */
  availablePosts: ExamProfile[];

  /** Current selection state */
  selectedOrg: ExamOrganization | null;
  selectedExamId: ExamId | null;
  selectedLanguage: ExamLanguage;

  /** Active profile (fully resolved) */
  activeProfile: ExamProfile | undefined;

  /** Callbacks */
  onOrganizationSelect: (org: ExamOrganization) => void;
  onExamSelect: (examId: ExamId) => void;
  onLanguageSelect: (lang: ExamLanguage) => void;
  onStart: () => void;
  onClear: () => void;

  className?: string;
}

// ----------------------------------------------------------------
// Step indicator
// ----------------------------------------------------------------

function Step({
  number,
  label,
  active,
  done,
}: {
  number: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
          done
            ? "bg-primary text-primary-foreground"
            : active
            ? "bg-primary/20 text-primary border border-primary/40"
            : "bg-muted text-muted-foreground"
        )}
        aria-current={active ? "step" : undefined}
      >
        {done ? "✓" : number}
      </span>
      <span
        className={cn(
          "text-sm font-medium",
          active ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}

// ----------------------------------------------------------------
// Section wrapper
// ----------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
      {children}
    </h3>
  );
}

// ----------------------------------------------------------------
// Main component
// ----------------------------------------------------------------

/**
 * Hierarchical exam selector:
 * Organization → Exam → Post → Language → Start
 *
 * Fully driven by registry data. No exam logic in UI.
 */
export const ExamSelector = memo(function ExamSelector({
  availableOrganizations,
  availableExams,
  availablePosts,
  selectedOrg,
  selectedExamId,
  selectedLanguage,
  activeProfile,
  onOrganizationSelect,
  onExamSelect,
  onLanguageSelect,
  onStart,
  onClear,
  className,
}: ExamSelectorProps) {
  const step =
    !selectedOrg ? 1 :
    !selectedExamId ? 2 :
    !activeProfile ? 3 : 4;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, cb: () => void) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        cb();
      }
    },
    []
  );

  return (
    <div
      role="navigation"
      aria-label="Government exam selector"
      className={cn("w-full max-w-2xl mx-auto flex flex-col gap-6", className)}
    >
      {/* ── Step tracker ── */}
      <div className="flex items-center gap-4 flex-wrap">
        <Step number={1} label="Organization" active={step === 1} done={step > 1} />
        <div className="w-6 h-px bg-border shrink-0" aria-hidden />
        <Step number={2} label="Exam" active={step === 2} done={step > 2} />
        <div className="w-6 h-px bg-border shrink-0" aria-hidden />
        <Step number={3} label="Post & Language" active={step === 3} done={step > 3} />
        <div className="w-6 h-px bg-border shrink-0" aria-hidden />
        <Step number={4} label="Start" active={step === 4} done={false} />
      </div>

      {/* ── Step 1: Organization ── */}
      <div>
        <SectionHeading>Select Organization</SectionHeading>
        <div
          role="radiogroup"
          aria-label="Select an organization"
          className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
        >
          {availableOrganizations.map((org) => (
            <button
              key={org}
              role="radio"
              aria-checked={selectedOrg === org}
              onClick={() => onOrganizationSelect(org)}
              onKeyDown={(e) => handleKeyDown(e, () => onOrganizationSelect(org))}
              className={cn(
                "flex-1 sm:flex-none px-5 py-3 min-h-[44px] rounded-xl border text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                selectedOrg === org
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              {ORGANIZATION_LABELS[org]}
            </button>
          ))}
        </div>
      </div>

      {/* ── Step 2: Exam ── */}
      {selectedOrg && availableExams.length > 0 && (
        <div>
          <SectionHeading>Select Exam</SectionHeading>
          <div
            role="radiogroup"
            aria-label="Select an exam"
            className="flex flex-col gap-2"
          >
            {availableExams.map((examName) => {
              const postsForExam = availablePosts.filter(
                (p) => p.exam === examName
              );
              const firstPost = postsForExam[0];
              const isSelected = !!firstPost && selectedExamId === firstPost.id;
              return (
                <button
                  key={examName}
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => firstPost && onExamSelect(firstPost.id)}
                  onKeyDown={(e) =>
                    handleKeyDown(e, () => firstPost && onExamSelect(firstPost.id))
                  }
                  className={cn(
                    "w-full text-left px-4 py-3 min-h-[44px] rounded-xl border text-sm transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary bg-primary/5 font-semibold"
                      : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  {examName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Step 3: Post card + Language ── */}
      {selectedExamId && activeProfile && (
        <div className="flex flex-col gap-4">
          <div>
            <SectionHeading>Post</SectionHeading>
            <ExamCard profile={activeProfile} isSelected />
          </div>

          <div>
            <SectionHeading>Language</SectionHeading>
            <div
              role="radiogroup"
              aria-label="Select typing language"
              className="flex gap-2"
            >
              {(["en", "hi"] as ExamLanguage[]).map((lang) => (
                <button
                  key={lang}
                  role="radio"
                  aria-checked={selectedLanguage === lang}
                  onClick={() => onLanguageSelect(lang)}
                  onKeyDown={(e) => handleKeyDown(e, () => onLanguageSelect(lang))}
                  className={cn(
                    "px-5 py-2.5 min-h-[44px] rounded-xl border text-sm font-medium transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    selectedLanguage === lang
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/50 hover:border-primary/40 hover:bg-muted/30"
                  )}
                >
                  {LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Step 4: CTA ── */}
      {activeProfile && (
        <div className="flex gap-3 pt-2">
          <button
            onClick={onStart}
            className={cn(
              "flex-1 px-6 py-3 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-semibold text-sm",
              "hover:bg-primary/90 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Start Practice →
          </button>
          <button
            onClick={onClear}
            aria-label="Clear exam selection"
            className={cn(
              "px-4 py-3 min-h-[44px] rounded-xl border border-border/50 text-sm text-muted-foreground",
              "hover:border-destructive/40 hover:text-destructive transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
});
