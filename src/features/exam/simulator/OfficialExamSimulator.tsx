"use client";

import React from "react";
import type { ExamProfile } from "../types";
import { useOfficialSimulator } from "./useOfficialSimulator";
import type { SimulatorAdapter } from "./useOfficialSimulator";
import { SharedInstructions } from "./SharedInstructions";
import { SharedTypingTest } from "./SharedTypingTest";
import { SharedCompletion } from "./SharedCompletion";
import { cn } from "@/lib/utils";

export interface OfficialExamSimulatorProps<TPassage, TRules, TScore, TErrorBreakdown> {
  profile: ExamProfile;
  adapter: SimulatorAdapter<TPassage, TRules, TScore, TErrorBreakdown>;
  
  // A mapping function to translate custom score types to generic props for SharedCompletion
  mapScoreToCompletionProps: (score: TScore, breakdown: TErrorBreakdown | null, rules: TRules) => Omit<React.ComponentProps<typeof SharedCompletion>, "onRestart" | "onExit" | "allowRestart" | "targetWpm" | "targetAccuracy" | "postName">;
  
  // Custom renderer for the active typing test phase, if the exam requires something non-standard (e.g. DEST mode)
  renderActive?: (props: {
    passage: TPassage;
    typed: string;
    onTyping: (value: string) => void;
    timeRemaining: number;
    liveStats: any;
    isPaused: boolean;
    onPause: () => void;
    onResume: () => void;
    onSubmit: () => void;
  }) => React.ReactNode;
  
  className?: string;
}

function CountdownOverlay({ count }: { count: number }) {
  return (
    <div
      role="status"
      aria-live="assertive"
      aria-label={`Starting in ${count}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div className="text-center flex flex-col items-center gap-4">
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">
          Get Ready
        </p>
        <span className="text-8xl font-black text-primary tabular-nums animate-pulse">
          {count}
        </span>
        <p className="text-xs text-muted-foreground">
          Position your fingers on the home row
        </p>
      </div>
    </div>
  );
}

export function OfficialExamSimulator<TPassage extends { text: string; id: string; title: string; characterCount: number }, TRules, TScore, TErrorBreakdown>({
  profile,
  adapter,
  mapScoreToCompletionProps,
  renderActive,
  className
}: OfficialExamSimulatorProps<TPassage, TRules, TScore, TErrorBreakdown>) {
  const sim = useOfficialSimulator<TPassage, TRules, TScore, TErrorBreakdown>(profile, adapter);

  const handleRestart = React.useCallback(() => {
    if (adapter.canRestart(adapter.rules)) {
      if (window.confirm("Are you sure you want to restart? Your current progress will be lost.")) {
        sim.restart();
      }
    }
  }, [adapter, sim]);

  if (sim.isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground animate-pulse" aria-busy="true">
        Loading passage…
      </div>
    );
  }

  if (sim.error) {
    return (
      <div role="alert" className="flex flex-col items-center justify-center gap-4 h-48 text-center">
        <p className="text-destructive font-medium">Failed to load exam passage.</p>
        <p className="text-sm text-muted-foreground">{sim.error}</p>
      </div>
    );
  }

  if (sim.phase === "idle") {
    return (
      <div className={cn("w-full flex flex-col items-center gap-6", className)}>
        <div className="text-center">
          <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
            {profile.organization} — {profile.exam}
          </div>
          <h2 className="text-lg font-bold text-foreground">{profile.post}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {adapter.getDuration(adapter.rules)} min typing test
          </p>
        </div>
        <button
          onClick={sim.showInstructions}
          className={cn(
            "px-8 py-4 min-h-[52px] rounded-xl bg-primary text-primary-foreground font-semibold",
            "hover:bg-primary/90 transition-colors text-sm",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
        >
          Begin Typing Skill Test →
        </button>
      </div>
    );
  }

  if (sim.phase === "instructions") {
    // Determine props dynamically from TRules via adapter type assumptions (safely extracting properties)
    const ruleObj = adapter.rules as any;
    
    return (
      <div className={cn("w-full", className)}>
        <SharedInstructions
          profile={profile}
          duration={adapter.getDuration(adapter.rules)}
          targetWpm={ruleObj.targetWpm || ruleObj.targetSpeed || 0}
          targetAccuracy={ruleObj.targetAccuracy || 0}
          autoSubmit={adapter.isAutoSubmit(adapter.rules)}
          showLiveStats={!adapter.isOfficialSimulation(adapter.rules)} // Official hide stats
          allowPause={adapter.canPause(adapter.rules)}
          allowRestart={adapter.canRestart(adapter.rules)}
          isOfficialSimulation={adapter.isOfficialSimulation(adapter.rules)}
          instructions={ruleObj.instructions || []}
          onStart={sim.startCountdown}
          onBack={sim.reset}
        />
      </div>
    );
  }

  if (sim.phase === "countdown") {
    return <CountdownOverlay count={sim.countdown} />;
  }

  if (sim.phase === "active" && sim.passage) {
    const isOfficial = adapter.isOfficialSimulation(adapter.rules);
    
    return (
      <div className={cn("w-full flex flex-col gap-4", className)}>
        {renderActive ? renderActive({
          passage: sim.passage,
          typed: sim.typed,
          onTyping: sim.handleTyping,
          timeRemaining: sim.timeRemaining,
          liveStats: sim.liveStats,
          isPaused: sim.isPaused,
          onPause: sim.pause,
          onResume: sim.resume,
          onSubmit: sim.submitSession
        }) : (
          <SharedTypingTest
            passage={sim.passage}
            typed={sim.typed}
            timeRemaining={sim.timeRemaining}
            liveStats={sim.liveStats}
            showLiveStats={!isOfficial}
            isPaused={sim.isPaused}
            onTyping={sim.handleTyping}
            onPause={adapter.canPause(adapter.rules) ? sim.pause : undefined}
            onResume={adapter.canPause(adapter.rules) ? sim.resume : undefined}
          />
        )}

        {!adapter.isAutoSubmit(adapter.rules) && (
          <div className="flex justify-end pt-2">
            <button
              onClick={sim.submitSession}
              className={cn(
                "px-6 py-2.5 min-h-[44px] rounded-xl bg-primary text-primary-foreground font-semibold text-sm",
                "hover:bg-primary/90 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
            >
              Submit Test
            </button>
          </div>
        )}
      </div>
    );
  }

  if ((sim.phase === "results" || sim.phase === "submitted") && sim.score) {
    const completionProps = mapScoreToCompletionProps(sim.score, sim.errorBreakdown, adapter.rules);
    const ruleObj = adapter.rules as any;

    return (
      <div className={cn("w-full", className)}>
        <SharedCompletion
          {...completionProps}
          postName={profile.post}
          targetWpm={ruleObj.targetWpm || ruleObj.targetSpeed || 0}
          targetAccuracy={ruleObj.targetAccuracy || 0}
          allowRestart={adapter.canRestart(adapter.rules)}
          onRestart={handleRestart}
          onExit={sim.reset}
        />
      </div>
    );
  }

  return null;
}
