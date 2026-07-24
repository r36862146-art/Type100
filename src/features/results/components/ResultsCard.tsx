import React from "react";
import { ResultsSnapshot } from "../types";
import { ResultsSummary } from "./ResultsSummary";
import { MistakeSummary } from "./MistakeSummary";
import { MetricCard } from "./MetricCard";
import { SessionActions, type SessionActionsProps } from "./SessionActions";
import { ExamReadinessReport } from "./ExamReadinessReport";
import { generateInsights } from "../utils/generateInsights";
import { ResultsExplanation } from "./ResultsExplanation";
import { ShareButton } from "./ShareButton";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertCircle, CheckCircle2, TrendingUp } from "lucide-react";

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

      {(() => {
        const insight = generateInsights(snapshot);
        return (
          <div className={cn(
            "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-xl border shadow-premium-sm backdrop-blur-sm transition-all duration-300 hover:shadow-premium",
            insight.type === "success" && "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400",
            insight.type === "warning" && "bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-400",
            insight.type === "info" && "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400"
          )}>
            <div className="p-2 rounded-full bg-background/50 shrink-0">
              {insight.type === "success" && <CheckCircle2 className="w-6 h-6" />}
              {insight.type === "warning" && <AlertCircle className="w-6 h-6" />}
              {insight.type === "info" && <TrendingUp className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-lg mb-0.5">{insight.title}</h4>
              <p className="text-sm opacity-90 leading-relaxed">{insight.message}</p>
            </div>
          </div>
        );
      })()}

      <ResultsSummary
        wpm={snapshot.wpm}
        accuracy={snapshot.accuracy}
      />
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Raw WPM"
          value={snapshot.rawWpm}
          tooltip="Words per minute including mistakes."
        />
        <MetricCard
          label="CPM"
          value={snapshot.cpm}
          tooltip="Characters per minute correctly typed."
        />
        <MetricCard
          label="Time"
          value={formatTime(snapshot.elapsedTime)}
          tooltip="Total duration of the typing session."
        />
        <MetricCard
          label="Progress"
          value={`${snapshot.progress}%`}
          tooltip="Percentage of the test completed."
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
        <h3 className="text-lg font-semibold text-foreground/80 pl-1">Performance Details</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            label="Total Words"
            value={snapshot.wordsCompleted}
            tooltip="Number of words fully completed."
          />
          <MetricCard
            label="Backspaces"
            value={snapshot.backspaces}
            tooltip="Number of times Backspace was pressed."
          />
          {snapshot.wrongWords !== undefined && (
            <MetricCard
              label="Wrong Words"
              value={snapshot.wrongWords}
              tooltip="Words containing mistakes when you moved past them."
            />
          )}
        </div>
      </div>

      <ResultsExplanation />

      <div className="mt-8 border-t border-border/50 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <SessionActions
          onRepeatTest={onRepeatTest}
          onNextTest={onNextTest}
        />
        <ShareButton snapshot={snapshot} />
      </div>
    </div>
  );
});
