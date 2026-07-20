import React from "react";
import { PracticeConfig, PracticeLanguage } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PracticeToolbarProps {
  config: PracticeConfig;
  onConfigChange: (newConfig: Partial<PracticeConfig>) => void;
  className?: string;
}

export const PracticeToolbar = React.memo(function PracticeToolbar({
  config,
  onConfigChange,
  className,
}: PracticeToolbarProps) {
  const languageOptions: { label: string; value: PracticeLanguage }[] = [
    { label: "English", value: "en" },
    { label: "हिंदी", value: "hi" },
  ];

  const timerOptions = [15, 30, 60, 90, 120];

  const learningTopics = [
    "General",
    "Indian Geography",
    "World Geography",
    "Indian History",
    "Indian Polity",
    "Indian Economy",
    "Science",
    "Environment",
    "Computer Awareness",
    "Technology",
    "Artificial Intelligence",
    "Literature",
    "Space",
    "Sports",
    "General Knowledge"
  ];

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground",
        className
      )}
    >
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Language selection">
        <span className="font-medium mr-1" aria-hidden="true">Language:</span>
        {languageOptions.map((opt) => (
          <button
            key={opt.value}
            role="radio"
            aria-checked={config.language === opt.value}
            onClick={() => onConfigChange({ language: opt.value })}
            className={cn(
              "px-3 py-2 min-h-[44px] hover:text-foreground transition-colors focus-visible:outline-none focus-visible:underline rounded-md",
              config.language === opt.value && "text-primary font-bold underline underline-offset-4"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      
      <div className="w-px h-4 bg-border/50 hidden sm:block" />

      {config.mode === "learning" && (
        <>
          <div className="flex items-center gap-2">
            <span className="font-medium">Topic:</span>
            <select
              value={config.learningTopic || "General"}
              onChange={(e) => onConfigChange({ learningTopic: e.target.value })}
              className="bg-transparent border border-border rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              {learningTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </div>
          <div className="w-px h-4 bg-border/50 hidden sm:block" />
        </>
      )}

      {(config.mode === "learning" || config.mode === "practice") && (
        <>
          <div className="flex items-center gap-1" role="radiogroup">
            <span className="font-medium mr-1">Difficulty:</span>
            {["easy", "medium", "hard"].map((diff) => (
              <button
                key={diff}
                role="radio"
                aria-checked={(config.difficulty || "medium") === diff}
                onClick={() => onConfigChange({ difficulty: diff as any })}
                className={cn(
                  "px-3 py-2 min-h-[44px] hover:text-foreground transition-colors rounded-md capitalize",
                  (config.difficulty || "medium") === diff && "text-primary font-bold underline underline-offset-4"
                )}
              >
                {diff}
              </button>
            ))}
          </div>

          <div className="w-px h-4 bg-border/50 hidden sm:block" />

          <div className="flex items-center gap-1" role="radiogroup">
            <span className="font-medium mr-1">Timer (s):</span>
            {timerOptions.map((len) => (
              <button
                key={len}
                role="radio"
                aria-checked={config.length === len}
                onClick={() => onConfigChange({ length: len })}
                className={cn(
                  "px-3 py-2 min-h-[44px] hover:text-foreground transition-colors rounded-md",
                  config.length === len && "text-primary font-bold underline underline-offset-4"
                )}
              >
                {len}
              </button>
            ))}
          </div>
        </>
      )}

      {config.mode === "custom" && config.customText && (
        <button
          onClick={() => onConfigChange({ customText: undefined })}
          className="px-3 py-2 min-h-[44px] text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:underline rounded-md font-medium"
        >
          Edit Text
        </button>
      )}
    </div>
  );
});
