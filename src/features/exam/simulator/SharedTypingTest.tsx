"use client";

import React, { memo, useEffect, useRef } from "react";
import type { SimulatorLiveStats } from "./useOfficialSimulator";
import { cn } from "@/lib/utils";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export interface SharedTypingTestProps {
  passage: { text: string; id: string; title: string };
  typed: string;
  timeRemaining: number;
  liveStats: SimulatorLiveStats | null;
  showLiveStats: boolean;
  isPaused: boolean;
  onTyping: (value: string) => void;
  onPause?: () => void;
  onResume?: () => void;
  className?: string;
}

export const SharedTypingTest = memo(function SharedTypingTest({
  passage,
  typed,
  timeRemaining,
  liveStats,
  showLiveStats,
  isPaused,
  onTyping,
  onPause,
  onResume,
  className,
}: SharedTypingTestProps) {
  // Input ref to keep focus when typing
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input on mount and unpause
  useEffect(() => {
    if (!isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPaused]);

  // Keep focus on clicking anywhere in the container
  const handleContainerClick = () => {
    if (!isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      onClick={handleContainerClick}
      className={cn("w-full max-w-4xl mx-auto flex flex-col gap-6", className)}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card shadow-sm sticky top-4 z-10">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Time Remaining
            </span>
            <span
              className={cn(
                "text-2xl font-black tabular-nums transition-colors",
                timeRemaining <= 60 && timeRemaining > 15 && "text-amber-500",
                timeRemaining <= 15 && "text-destructive animate-pulse"
              )}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>

          {showLiveStats && liveStats && (
            <>
              <div className="w-px h-8 bg-border/50" />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Live WPM
                </span>
                <span className="text-xl font-bold tabular-nums">
                  {liveStats.elapsed > 0
                    ? Math.round((liveStats.correct / 5) / (liveStats.elapsed / 60))
                    : 0}
                </span>
              </div>
              <div className="w-px h-8 bg-border/50 hidden sm:block" />
              <div className="flex-col hidden sm:flex">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Progress
                </span>
                <span className="text-xl font-bold tabular-nums">
                  {liveStats.progress}%
                </span>
              </div>
            </>
          )}
        </div>

        {/* Pause controls */}
        {onPause && onResume && (
          <div>
            {isPaused ? (
              <button
                onClick={(e) => { e.stopPropagation(); onResume(); }}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
                aria-label="Resume test"
              >
                Resume
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); onPause(); }}
                className="px-4 py-2 rounded-lg bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
                aria-label="Pause test"
              >
                Pause
              </button>
            )}
          </div>
        )}
      </div>

      {/* Typing Interface */}
      <div className={cn("relative transition-opacity", isPaused ? "opacity-50 pointer-events-none blur-sm" : "opacity-100")}>
        {/* Hidden input to capture typing */}
        <input
          ref={inputRef}
          type="text"
          value={typed}
          onChange={(e) => onTyping(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-0"
          aria-label="Type the passage here"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          disabled={isPaused}
        />
        
        {/* Visual text renderer */}
        <div className="pointer-events-none relative z-10 bg-card border border-border/30 rounded-2xl p-6 shadow-sm min-h-[300px]">
          <div className="text-2xl leading-relaxed font-typing tracking-wide w-full text-left break-words select-none">
            {passage.text.split("").map((char, index) => {
              let stateClass = "text-muted-foreground";
              let isCurrent = false;

              if (index < typed.length) {
                stateClass = typed[index] === char ? "text-foreground" : "text-destructive bg-destructive/20";
              } else if (index === typed.length) {
                stateClass = "text-muted-foreground";
                isCurrent = true;
              }

              return (
                <span 
                  key={index} 
                  className={cn(
                    stateClass,
                    isCurrent && "bg-primary/20 rounded-sm outline-1 outline outline-primary"
                  )}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="bg-card p-8 rounded-2xl border border-border/50 shadow-xl flex flex-col items-center gap-4 text-center max-w-sm mx-4">
            <h3 className="text-2xl font-bold">Test Paused</h3>
            <p className="text-muted-foreground text-sm">
              Your timer is frozen. Click resume when you are ready to continue.
            </p>
            {onResume && (
              <button
                onClick={onResume}
                className="mt-2 w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                Resume Typing
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
});
