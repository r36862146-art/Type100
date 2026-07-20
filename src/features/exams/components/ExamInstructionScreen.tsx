"use client";

import React, { useState, useEffect } from "react";
import { ExamDetail } from "@/data/examProfiles";
import { 
  CheckCircle2, 
  XCircle, 
  Monitor, 
  Keyboard, 
  Maximize, 
  ShieldAlert,
  AlertTriangle,
  Play
} from "lucide-react";

interface ReadyChecks {
  keyboard: boolean;
  browser: boolean;
  screenWidth: boolean;
  focus: boolean;
}

export interface ExamInstructionScreenProps {
  exam: ExamDetail;
  onStart: () => void;
}

export function ExamInstructionScreen({ exam, onStart }: ExamInstructionScreenProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [readyChecks, setReadyChecks] = useState<ReadyChecks>({
    keyboard: false,
    browser: true, // Assuming true if JS is running in a modern browser context
    screenWidth: false,
    focus: true,
  });

  useEffect(() => {
    const updateChecks = () => {
      // 1. Check Screen Width (Assuming desktop size for real exam)
      const isWideEnough = window.innerWidth >= 768;
      
      // 2. Check Keyboard (Mobile devices usually don't have physical keyboards attached)
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // 3. Check Focus
      const hasFocus = document.hasFocus();

      setReadyChecks(prev => ({
        ...prev,
        screenWidth: isWideEnough,
        keyboard: !isMobile, // Strict check: Mobile browsers fail this check
        focus: hasFocus
      }));
    };

    updateChecks();

    window.addEventListener("resize", updateChecks);
    window.addEventListener("focus", updateChecks);
    window.addEventListener("blur", updateChecks);

    return () => {
      window.removeEventListener("resize", updateChecks);
      window.removeEventListener("focus", updateChecks);
      window.removeEventListener("blur", updateChecks);
    };
  }, []);

  const allReady = Object.values(readyChecks).every(Boolean);

  const handleStartClick = () => {
    if (!allReady) return;
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onStart();
    }
  }, [countdown, onStart]);

  if (countdown !== null) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="text-center animate-in zoom-in duration-300">
          <div className="text-9xl font-black text-primary mb-4 tabular-nums animate-pulse">
            {countdown > 0 ? countdown : "GO!"}
          </div>
          <p className="text-xl text-muted-foreground font-medium uppercase tracking-widest">
            {countdown > 0 ? "Prepare to type" : "Good luck"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        
        {/* Header */}
        <div className="bg-secondary px-6 py-6 border-b border-border text-center">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider rounded-full mb-3">
            {exam.organization}
          </div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight mb-2 uppercase">
            {exam.name} - MOCK EXAMINATION
          </h1>
          <p className="text-sm text-muted-foreground">Please read the following instructions carefully before proceeding.</p>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Summary Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-muted/50 p-4 rounded-lg text-center">
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Duration</p>
              <p className="font-bold">{exam.duration} Min</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Target Speed</p>
              <p className="font-bold">{exam.speedRequirement} WPM</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Min. Accuracy</p>
              <p className="font-bold">{exam.minimumAccuracy}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Language</p>
              <p className="font-bold">{exam.language}</p>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-3 border-b border-border pb-2">
                <ShieldAlert className="w-5 h-5 text-primary" /> General Instructions
              </h2>
              <ul className="space-y-3">
                {exam.instructions.map((inst, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                    <span>{inst}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-3 border-b border-border pb-2">
                <Keyboard className="w-5 h-5 text-primary" /> Typing Rules
              </h2>
              <ul className="space-y-3">
                {exam.typingRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs font-bold mt-0.5">{idx + 1}</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2 mb-3 border-b border-border pb-2">
                <AlertTriangle className="w-5 h-5 text-primary" /> Evaluation Criteria
              </h2>
              <p className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg border border-border/50">
                {exam.passingCriteria}
              </p>
            </div>
          </div>
        </div>

        {/* Ready Check Section */}
        <div className="bg-secondary/50 p-6 md:p-8 border-t border-border">
          <h3 className="font-bold mb-4 text-center">System Readiness Check</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex flex-col items-center justify-center text-center p-3 bg-card border border-border rounded-lg shadow-sm">
              <Keyboard className="w-6 h-6 mb-2 text-muted-foreground" />
              <span className="text-xs font-medium mb-2">Physical Keyboard</span>
              {readyChecks.keyboard ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            
            <div className="flex flex-col items-center justify-center text-center p-3 bg-card border border-border rounded-lg shadow-sm">
              <Monitor className="w-6 h-6 mb-2 text-muted-foreground" />
              <span className="text-xs font-medium mb-2">Browser Support</span>
              {readyChecks.browser ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
            </div>
            
            <div className="flex flex-col items-center justify-center text-center p-3 bg-card border border-border rounded-lg shadow-sm">
              <Maximize className="w-6 h-6 mb-2 text-muted-foreground" />
              <span className="text-xs font-medium mb-2">Screen Resolution</span>
              {readyChecks.screenWidth ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
            </div>

            <div className="flex flex-col items-center justify-center text-center p-3 bg-card border border-border rounded-lg shadow-sm">
              <ShieldAlert className="w-6 h-6 mb-2 text-muted-foreground" />
              <span className="text-xs font-medium mb-2">Window Focus</span>
              {readyChecks.focus ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
            </div>
          </div>

          {!allReady && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500 text-center flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> 
              Please resolve the failed readiness checks before starting the exam.
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={handleStartClick}
              disabled={!allReady}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed py-4 px-12 rounded-xl font-bold text-lg transition-all shadow-md active:scale-95"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              I am ready to begin
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
