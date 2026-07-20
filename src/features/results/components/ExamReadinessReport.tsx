import React from "react";
import { ResultsSnapshot } from "../types";
import { examProfiles, ExamDetail } from "@/data/examProfiles";
import { CheckCircle2, AlertTriangle, Target, Activity, Clock, ShieldAlert, Award } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ExamReadinessReportProps {
  snapshot: ResultsSnapshot;
  examId: string;
}

export const ExamReadinessReport: React.FC<ExamReadinessReportProps> = ({ snapshot, examId }) => {
  const exam = examProfiles.find((e: ExamDetail) => e.id === examId);
  
  if (!exam) return null;

  // 1. Core Calculations
  const userWPM = snapshot.wpm;
  const requiredWPM = exam.speedRequirement;
  const userAccuracy = snapshot.accuracy;
  const errorRate = Math.max(0, 100 - userAccuracy);
  const permissibleErrors = exam.permissibleErrors;
  const officialDurationMs = exam.duration * 60 * 1000;

  // 2. Status Computations
  const speedMeets = userWPM >= requiredWPM;
  const accuracyMeets = errorRate <= permissibleErrors;
  
  let timeStatus = "Finished exactly on time";
  let timeScore = 10;
  if (snapshot.progress >= 100 && snapshot.elapsedTime < officialDurationMs - 1000) {
    timeStatus = "Completed early";
    timeScore = 10;
  } else if (snapshot.progress < 100 && snapshot.elapsedTime >= officialDurationMs - 1000) {
    timeStatus = "Time expired before completion";
    timeScore = 4; // Penalty for not finishing the passage
  }

  // 3. Weighted Score (0-100)
  // Speed (40%)
  const speedScore = Math.min(40, (userWPM / requiredWPM) * 40);
  
  // Accuracy (35%)
  const accuracyScore = Math.min(35, (userAccuracy / 100) * 35);
  
  // Error Rate (10%)
  const errorScore = errorRate <= permissibleErrors ? 10 : Math.max(0, 10 - ((errorRate - permissibleErrors) * 2));
  
  // Consistency (5%)
  const consistencyScore = (snapshot.missedCharacters === 0 && snapshot.extraCharacters === 0) ? 5 : 0;

  const totalScore = Math.round(speedScore + accuracyScore + errorScore + timeScore + consistencyScore);

  // 4. Readiness Level mapping
  let levelTheme = "";
  let levelText = "";
  if (totalScore >= 95) {
    levelText = "Exam Ready";
    levelTheme = "bg-green-500/10 text-green-500 border-green-500/20";
  } else if (totalScore >= 85) {
    levelText = "Ready for Official Mock Test";
    levelTheme = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  } else if (totalScore >= 70) {
    levelText = "Almost Ready";
    levelTheme = "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
  } else if (totalScore >= 50) {
    levelText = "Needs More Practice";
    levelTheme = "bg-orange-500/10 text-orange-500 border-orange-500/20";
  } else {
    levelText = "Beginner";
    levelTheme = "bg-red-500/10 text-red-500 border-red-500/20";
  }

  // 5. Accuracy Rating
  let accuracyRating = "Needs Improvement";
  if (userAccuracy >= 98) accuracyRating = "Excellent";
  else if (userAccuracy >= 95) accuracyRating = "Very Good";
  else if (userAccuracy >= 90) accuracyRating = "Good";

  let errorRating = errorRate <= permissibleErrors ? "Acceptable" : "High Penalty Risk";

  // 6. Dynamic Recommendations
  const recommendations: string[] = [];
  if (!speedMeets) {
    recommendations.push(`Increase typing speed by ${Math.ceil(requiredWPM - userWPM)} WPM to meet the official threshold.`);
  }
  if (!accuracyMeets) {
    recommendations.push(`Reduce typing mistakes. Official requirement allows only ${permissibleErrors}% errors.`);
  }
  if (consistencyScore === 0) {
    recommendations.push("Avoid skipping words (missed characters) as it severely impacts official scoring.");
  }
  if (timeScore < 10) {
    recommendations.push("Practice time management to complete the entire passage before time expires.");
  }
  if (recommendations.length === 0) {
    recommendations.push("Maintain accuracy above 97%.");
    recommendations.push("Practice exam simulations regularly to maintain peak performance.");
  }

  return (
    <div className="w-full bg-card border-2 border-primary/20 rounded-xl overflow-hidden shadow-sm mb-4">
      {/* Header */}
      <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold flex items-center gap-2 text-foreground">
            <Award className="w-6 h-6 text-primary" />
            Exam Readiness Report
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Targeting: <span className="font-semibold text-foreground">{exam.name}</span>
          </p>
        </div>
        <div className={cn("px-4 py-2 rounded-lg border flex flex-col items-center justify-center min-w-[140px]", levelTheme)}>
          <span className="text-2xl font-black">{totalScore}/100</span>
          <span className="text-xs font-bold uppercase tracking-wider">{levelText}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        
        {/* Speed */}
        <div className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Typing Speed</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold">{userWPM}</span>
            <span className="text-sm text-muted-foreground">WPM</span>
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            Required: {requiredWPM} WPM
          </div>
          <div className="mt-auto">
            {speedMeets ? (
              <span className="inline-flex items-center text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-md">
                <CheckCircle2 className="w-3 h-3 mr-1" /> Meets Requirement
              </span>
            ) : (
              <span className="inline-flex items-center text-xs font-medium text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                <AlertTriangle className="w-3 h-3 mr-1" /> Below Requirement
              </span>
            )}
          </div>
        </div>

        {/* Accuracy */}
        <div className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-muted-foreground">
            <Target className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Accuracy</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold">{userAccuracy.toFixed(1)}%</span>
          </div>
          <div className="mt-auto pt-4">
            <span className="text-sm font-medium text-foreground">{accuracyRating}</span>
          </div>
        </div>

        {/* Error Rate */}
        <div className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-muted-foreground">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Error Rate</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold">{errorRate.toFixed(1)}%</span>
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            Permissible: {permissibleErrors}%
          </div>
          <div className="mt-auto">
            <span className={cn(
              "text-sm font-medium",
              errorRate <= permissibleErrors ? "text-green-500" : "text-red-500"
            )}>
              {errorRating}
            </span>
          </div>
        </div>

        {/* Time Management */}
        <div className="p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold uppercase tracking-wider">Time</span>
          </div>
          <div className="flex-1 flex items-center">
            <span className="text-sm font-medium text-foreground leading-snug">
              {timeStatus}
            </span>
          </div>
        </div>

      </div>

      {/* Recommendations */}
      <div className="bg-muted/30 px-6 py-5 border-t border-border">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Personalized Recommendations</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
          {recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
              <span className="text-primary font-bold">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
