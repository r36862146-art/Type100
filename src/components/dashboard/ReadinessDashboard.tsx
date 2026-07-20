"use client";

import React, { useEffect } from "react";
import { analytics } from "@/features/analytics/events";
import { pluginManager } from "@/plugins";
import { RecommendationEngine } from "@/core/recommendations/RecommendationEngine";
import type { ExamProgress } from "@/features/exam/types";
import { cn } from "@/lib/utils";
import { SettingsPanel } from "@/features/settings/components/SettingsPanel";
import { useAchievementStore } from "@/core/achievements/AchievementStore";
import { achievementRegistry } from "@/core/achievements/AchievementRegistry";
import { Activity, Target, Zap, TrendingUp, Settings2, Award } from "lucide-react";

// In a real app, this would come from a global progress store or backend.
// For this Phase, we'll mock some realistic progress for the UI.
const mockProgress: Record<string, ExamProgress> = {
  "ssc_cgl": {
    examId: "ssc_cgl",
    attempts: 14,
    averageWPM: 32.5,
    bestWPM: 36,
    averageAccuracy: 91.2,
    completedPassages: 14,
    lastPracticed: new Date().toISOString(),
    history: [
      { timestamp: "", wpm: 30, accuracy: 88, durationSeconds: 600, qualified: false },
      { timestamp: "", wpm: 32, accuracy: 90, durationSeconds: 600, qualified: false },
      { timestamp: "", wpm: 33, accuracy: 91, durationSeconds: 600, qualified: false },
      { timestamp: "", wpm: 31, accuracy: 93, durationSeconds: 600, qualified: false },
      { timestamp: "", wpm: 36, accuracy: 94, durationSeconds: 600, qualified: true },
    ]
  },
  "rrb_ntpc": {
    examId: "rrb_ntpc",
    attempts: 3,
    averageWPM: 28,
    bestWPM: 29,
    averageAccuracy: 89,
    completedPassages: 3,
    lastPracticed: new Date(Date.now() - 86400000).toISOString(),
    history: [
      { timestamp: "", wpm: 27, accuracy: 88, durationSeconds: 600, qualified: false },
      { timestamp: "", wpm: 28, accuracy: 89, durationSeconds: 600, qualified: false },
      { timestamp: "", wpm: 29, accuracy: 90, durationSeconds: 600, qualified: false },
    ]
  }
};

export function ReadinessDashboard({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = React.useState<"overview" | "achievements" | "settings">("overview");
  const { unlockedIds, points } = useAchievementStore();

  useEffect(() => {
    analytics.trackDashboardViewed();
  }, []);

  const renderOverview = () => {
    // Generate a unified recommendation list
    const sscProfile = pluginManager.getProfile("ssc_cgl");
    const rrbProfile = pluginManager.getProfile("rrb_ntpc");

    let recommendations: any[] = [];
    if (sscProfile && mockProgress["ssc_cgl"]) {
      recommendations.push(...RecommendationEngine.generate(mockProgress["ssc_cgl"], sscProfile.qualifyingSpeed, sscProfile.qualifyingAccuracy).map(r => ({ ...r, exam: "SSC CGL" })));
    }
    if (rrbProfile && mockProgress["rrb_ntpc"]) {
      recommendations.push(...RecommendationEngine.generate(mockProgress["rrb_ntpc"], rrbProfile.qualifyingSpeed, rrbProfile.qualifyingAccuracy).map(r => ({ ...r, exam: "RRB NTPC" })));
    }

    return (
      <div className="space-y-8">
        {/* Readiness Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["SSC CGL", "RRB NTPC", "Andaman LDC"].map((examName, idx) => {
            const isReady = idx === 0; // Fake state for UI
            const isPracticing = idx === 1;
            const notStarted = idx === 2;

            return (
              <div key={examName} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold">{examName}</h3>
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-semibold rounded-full",
                      isReady ? "bg-green-500/10 text-green-600" :
                      isPracticing ? "bg-amber-500/10 text-amber-600" :
                      "bg-muted text-muted-foreground"
                    )}>
                      {isReady ? "Exam Ready" : isPracticing ? "Needs Practice" : "Not Started"}
                    </span>
                  </div>
                  {notStarted ? (
                    <p className="text-sm text-muted-foreground">Take a diagnostic test to gauge your readiness.</p>
                  ) : (
                    <div className="flex gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase">Best WPM</span>
                        <span className="text-xl font-bold">{idx === 0 ? "36" : "29"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase">Accuracy</span>
                        <span className="text-xl font-bold">{idx === 0 ? "94%" : "90%"}</span>
                      </div>
                    </div>
                  )}
                </div>
                <button className="mt-6 w-full px-4 py-2 bg-muted hover:bg-muted/80 rounded-xl text-sm font-semibold transition-colors">
                  {notStarted ? "Start Diagnostic" : "Practice Now"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Smart Recommendations */}
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Smart Recommendations
          </h3>
          <div className="flex flex-col gap-3">
            {recommendations.slice(0, 3).map((rec, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 border border-border/50 bg-card rounded-2xl">
                <div className={cn(
                  "p-2 rounded-lg",
                  rec.priority === "high" ? "bg-destructive/10 text-destructive" :
                  rec.priority === "medium" ? "bg-amber-500/10 text-amber-600" :
                  "bg-blue-500/10 text-blue-600"
                )}>
                  {rec.type === "speed" ? <Zap className="w-5 h-5" /> :
                   rec.type === "accuracy" ? <Target className="w-5 h-5" /> :
                   <TrendingUp className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">
                    {rec.title} <span className="text-muted-foreground text-xs font-normal">({rec.exam})</span>
                  </h4>
                  <p className="text-sm text-muted-foreground mt-0.5">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    const all = achievementRegistry.getAll();
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Achievements</h2>
          <div className="px-4 py-2 bg-amber-500/10 text-amber-600 rounded-full font-bold text-sm border border-amber-500/20">
            {points} Points Total
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {all.map(ach => {
            const unlocked = unlockedIds.includes(ach.id);
            return (
              <div key={ach.id} className={cn("p-4 border rounded-2xl flex gap-4 transition-all", unlocked ? "border-amber-500/50 bg-amber-500/5" : "border-border/50 bg-card opacity-50 grayscale")}>
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", unlocked ? "bg-amber-500/20 text-amber-600" : "bg-muted text-muted-foreground")}>
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{ach.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ach.description}</p>
                  <p className="text-xs font-semibold mt-2 text-amber-600">+{ach.points} pts</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={cn("w-full max-w-5xl mx-auto py-8", className)}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Track your readiness across all government typing exams.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border/50 pb-2">
        <button
          onClick={() => setActiveTab("overview")}
          className={cn("px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors", activeTab === "overview" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}
        >
          <Activity className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={cn("px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors", activeTab === "achievements" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}
        >
          <Award className="w-4 h-4" />
          Achievements
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={cn("px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors", activeTab === "settings" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted")}
        >
          <Settings2 className="w-4 h-4" />
          Settings
        </button>
      </div>

      {activeTab === "overview" && renderOverview()}
      {activeTab === "achievements" && renderAchievements()}
      {activeTab === "settings" && <SettingsPanel />}
    </div>
  );
}
