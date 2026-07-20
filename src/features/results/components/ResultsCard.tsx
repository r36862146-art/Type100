import React from "react";
import { ResultsSnapshot } from "../types";
import { ResultsSummary } from "./ResultsSummary";
import { MistakeSummary } from "./MistakeSummary";
import { MetricCard } from "./MetricCard";
import { SessionActions, type SessionActionsProps } from "./SessionActions";
import { ExamReadinessReport } from "./ExamReadinessReport";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ResultsCardProps extends SessionActionsProps {
  snapshot: ResultsSnapshot;
  examId?: string;
  className?: string;
}

export const ResultsCard = React.memo(function ResultsCard({
  snapshot,
  onRepeatTest,
  onNextTest,
  examId,
  className,
}: ResultsCardProps) {
  // Format elapsed time (e.g., "1:15" for 75000ms)
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-8 w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500",
        className
      )}
      aria-label="Typing test results"
    >
      {examId && (
        <ExamReadinessReport snapshot={snapshot} examId={examId} />
      )}

      <ResultsSummary
        wpm={snapshot.wpm}
        accuracy={snapshot.accuracy}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Raw WPM"
          value={snapshot.rawWpm}
          tooltip="Words per minute including mistakes"
        />
        <MetricCard
          label="CPM"
          value={snapshot.cpm}
          tooltip="Characters per minute"
        />
        <MetricCard
          label="Time"
          value={formatTime(snapshot.elapsedTime)}
          tooltip="Total elapsed time"
        />
        <MetricCard
          label="Progress"
          value={`${snapshot.progress}%`}
          tooltip="Percentage of the test completed"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-foreground/80 pl-1">Characters</h3>
        <MistakeSummary
          correct={snapshot.correctCharacters}
          incorrect={snapshot.incorrectCharacters}
          extra={snapshot.extraCharacters}
          missed={snapshot.missedCharacters}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-foreground/80 pl-1">Words Completed</h3>
        <MetricCard
          label="Total Words"
          value={snapshot.wordsCompleted}
          className="md:w-1/4 sm:w-1/2"
        />
      </div>

      <div className="mt-8 border-t border-border/50 pt-8">
        <SessionActions
          onRepeatTest={onRepeatTest}
          onNextTest={onNextTest}
        />
      </div>
    </div>
  );
});
