"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { analytics } from "../../analytics/events";
import type { ExamProfile } from "../types";

export type SimulatorPhase = "idle" | "instructions" | "countdown" | "active" | "submitted" | "results";

export interface SimulatorLiveStats {
  typed: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  grossChars: number;
  elapsed: number;
  progress: number;
}

export interface SimulatorAdapter<TPassage, TRules, TScore, TErrorBreakdown> {
  rules: TRules;
  loadPassage: () => Promise<TPassage>;
  validateInput: (typed: string, target: string) => { correctChars: number; incorrectChars: number; accuracy: number };
  computeScore: (input: { grossCharacters: number; errors: number; elapsedSeconds: number; rules: TRules }) => TScore;
  getErrorBreakdown: (typed: string, target: string) => TErrorBreakdown;
  getDuration: (rules: TRules) => number; // in minutes
  isAutoSubmit: (rules: TRules) => boolean;
  canPause: (rules: TRules) => boolean;
  canRestart: (rules: TRules) => boolean;
  isOfficialSimulation: (rules: TRules) => boolean;
}

export function useOfficialSimulator<TPassage extends { text: string, characterCount: number }, TRules, TScore, TErrorBreakdown>(
  profile: ExamProfile,
  adapter: SimulatorAdapter<TPassage, TRules, TScore, TErrorBreakdown>
) {
  const [phase, setPhase] = useState<SimulatorPhase>("idle");
  const [passage, setPassage] = useState<TPassage | null>(null);
  const [typed, setTyped] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(adapter.getDuration(adapter.rules) * 60);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState<TScore | null>(null);
  const [errorBreakdown, setErrorBreakdown] = useState<TErrorBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const accumulatedPauseRef = useRef<number>(0);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    adapter.loadPassage()
      .then((p) => {
        setPassage(p);
        setIsLoading(false);
      })
      .catch((err) => {
        setError("Failed to load passage. Please try again.");
        setIsLoading(false);
        console.error("[useOfficialSimulator] Passage load failed:", err);
      });
  }, []); // Reload only when adapter logic triggers it externally (handled by parent key)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const liveStats = useMemo((): SimulatorLiveStats | null => {
    if (!passage || !typed) return null;
    const elapsed = (adapter.getDuration(adapter.rules) * 60) - timeRemaining;
    const validation = adapter.validateInput(typed, passage.text);
    const progress = Math.min(100, Math.round((typed.length / passage.text.length) * 100));
    return {
      typed: typed.length,
      correct: validation.correctChars,
      incorrect: validation.incorrectChars,
      accuracy: validation.accuracy,
      grossChars: typed.length,
      elapsed,
      progress,
    };
  }, [typed, passage, adapter, timeRemaining]);

  const submitSession = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (!passage || !startTimeRef.current) { setPhase("results"); return; }

    const elapsedSeconds = (Date.now() - startTimeRef.current - accumulatedPauseRef.current) / 1000;
    const validation = adapter.validateInput(typed, passage.text);
    
    const computedScore = adapter.computeScore({
      grossCharacters: typed.length,
      errors: validation.incorrectChars,
      elapsedSeconds,
      rules: adapter.rules
    });

    const breakdown = adapter.getErrorBreakdown(typed, passage.text);

    setScore(computedScore);
    setErrorBreakdown(breakdown);
    setPhase("results");

    analytics.trackExamCompleted({
      examId: profile.id,
      organization: profile.organization,
      wpm: (computedScore as any).netWPM || (computedScore as any).grossWPM || 0,
      accuracy: (computedScore as any).accuracy || 0,
      qualifies: (computedScore as any).qualifies || false,
    });
  }, [typed, passage, adapter, profile]);

  const showInstructions = useCallback(() => setPhase("instructions"), []);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    setPhase("countdown");

    let remaining = 3;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);
        
        analytics.trackSimulationStarted({
          examId: profile.id,
          organization: profile.organization,
          isOfficial: adapter.isOfficialSimulation(adapter.rules),
          mode: "typing_test"
        });

        setTyped("");
        setTimeRemaining(adapter.getDuration(adapter.rules) * 60);
        accumulatedPauseRef.current = 0;
        startTimeRef.current = Date.now();
        setPhase("active");

        let timeLeft = adapter.getDuration(adapter.rules) * 60;
        timerRef.current = setInterval(() => {
          timeLeft -= 1;
          setTimeRemaining(timeLeft);
          if (timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (adapter.isAutoSubmit(adapter.rules)) {
              submitSession();
            } else {
              setPhase("submitted");
            }
          }
        }, 1000);
      }
    }, 1000);
  }, [adapter, submitSession, profile]);

  const handleTyping = useCallback((value: string) => {
    if (phase !== "active" || isPaused) return;
    setTyped(value);
  }, [phase, isPaused]);

  const pause = useCallback(() => {
    if (!adapter.canPause(adapter.rules) || phase !== "active" || isPaused) return;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    pausedAtRef.current = Date.now();
    setIsPaused(true);
  }, [adapter, phase, isPaused]);

  const resume = useCallback(() => {
    if (!isPaused || phase !== "active") return;
    if (pausedAtRef.current) {
      accumulatedPauseRef.current += Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    setIsPaused(false);

    let timeLeft = timeRemaining;
    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      setTimeRemaining(timeLeft);
      if (timeLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (adapter.isAutoSubmit(adapter.rules)) {
          submitSession();
        } else {
          setPhase("submitted");
        }
      }
    }, 1000);
  }, [isPaused, phase, timeRemaining, adapter, submitSession]);

  const restart = useCallback(() => {
    if (!adapter.canRestart(adapter.rules)) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    startTimeRef.current = null;
    accumulatedPauseRef.current = 0;
    pausedAtRef.current = null;
    setTyped("");
    setScore(null);
    setErrorBreakdown(null);
    setTimeRemaining(adapter.getDuration(adapter.rules) * 60);
    setIsPaused(false);
    setPhase("instructions");
  }, [adapter]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    startTimeRef.current = null;
    accumulatedPauseRef.current = 0;
    pausedAtRef.current = null;
    setTyped("");
    setScore(null);
    setErrorBreakdown(null);
    setTimeRemaining(adapter.getDuration(adapter.rules) * 60);
    setIsPaused(false);
    setPhase("idle");
  }, [adapter]);

  return {
    phase,
    passage,
    typed,
    timeRemaining,
    countdown,
    score,
    errorBreakdown,
    isLoading,
    error,
    liveStats,
    isPaused,
    showInstructions,
    startCountdown,
    handleTyping,
    submitSession,
    pause,
    resume,
    restart,
    reset,
  };
}
