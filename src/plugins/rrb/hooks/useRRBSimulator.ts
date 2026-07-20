"use client";

// ============================================================
// useRRBSimulator HOOK — Phase 8.3
// State machine for the RRB simulator:
//   idle → instructions → countdown → active → submitted → results
// Manages timer, auto-submit, live stats, and passage loading.
// No hardcoded exam logic — driven entirely by RRBRules.
// ============================================================

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { ExamId, ExamLanguage } from "@/features/exam/types";
import type { RRBRules } from "../services/rrbRules";
import type { RRBPassage } from "../services/passageLoader";
import type { RRBScoreResult } from "../services/scoring";
import { getRandomPassage } from "../services/passageLoader";
import { validateInput } from "../services/validation";
import { computeRRBScore, getErrorBreakdown } from "../services/scoring";
import type { RRBErrorBreakdown } from "../services/scoring";

// ----------------------------------------------------------------
// State machine phases
// ----------------------------------------------------------------

export type RRBSimulatorPhase =
  | "idle"
  | "instructions"
  | "countdown"
  | "active"
  | "submitted"
  | "results";

// ----------------------------------------------------------------
// Live stats shape returned to consumers
// ----------------------------------------------------------------

export interface RRBLiveStats {
  typed: number;
  correct: number;
  incorrect: number;
  accuracy: number;
  grossChars: number;
  elapsed: number;
  progress: number;
}

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

/**
 * useRRBSimulator — drives the full RRB typing test lifecycle.
 *
 * @param examId   - The exam to load passages for.
 * @param language - The language for the passage.
 * @param rules    - The RRBRules configuration (fully drives behaviour).
 */
export function useRRBSimulator(
  examId: ExamId,
  language: ExamLanguage,
  rules: RRBRules
) {
  // ── Core state ──
  const [phase, setPhase] = useState<RRBSimulatorPhase>("idle");
  const [passage, setPassage] = useState<RRBPassage | null>(null);
  const [typed, setTyped] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(rules.duration * 60);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState<RRBScoreResult | null>(null);
  const [errorBreakdown, setErrorBreakdown] =
    useState<RRBErrorBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // ── Refs ──
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const accumulatedPauseRef = useRef<number>(0);

  // ── Load passage on mount / examId change ──
  useEffect(() => {
    let isActive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);
    getRandomPassage(examId, language)
      .then((p) => {
        if (!isActive) return;
        setPassage(p);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isActive) return;
        setError("Failed to load passage. Please try again.");
        setIsLoading(false);
        console.error("[useRRBSimulator] Passage load failed:", err);
      });
      
    return () => { isActive = false; };
  }, [examId, language]);

  // ── Clear timers on unmount ──
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── Live statistics (memoized) ──
  const liveStats = useMemo((): RRBLiveStats | null => {
    if (!passage || !typed) return null;
    const elapsed = (rules.duration * 60) - timeRemaining;
    const validation = validateInput(typed, passage.text);
    const progress = Math.min(
      100,
      Math.round((typed.length / passage.text.length) * 100)
    );
    return {
      typed: typed.length,
      correct: validation.correctChars,
      incorrect: validation.incorrectChars,
      accuracy: validation.accuracy,
      grossChars: typed.length,
      elapsed,
      progress,
    };
  }, [typed, passage, rules.duration, timeRemaining]);

  // ── Submit (called manually or by auto-submit) ──
  const submitSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!passage || !startTimeRef.current) {
      setPhase("results");
      return;
    }

    const elapsedSeconds =
      (Date.now() -
        startTimeRef.current -
        accumulatedPauseRef.current) /
      1000;

    const validation = validateInput(typed, passage.text);
    const result = computeRRBScore({
      grossCharacters: typed.length,
      errors: validation.incorrectChars,
      elapsedSeconds,
      targetWpm: rules.targetWpm,
      targetAccuracy: rules.targetAccuracy,
    });

    const breakdown = getErrorBreakdown(typed, passage.text);

    setScore(result);
    setErrorBreakdown(breakdown);
    setPhase("results");
  }, [typed, passage, rules]);

  // ── Actions ──

  const showInstructions = useCallback(() => {
    setPhase("instructions");
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    setPhase("countdown");

    let remaining = 3;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current);

        // Start the actual test
        setTyped("");
        setTimeRemaining(rules.duration * 60);
        accumulatedPauseRef.current = 0;
        startTimeRef.current = Date.now();
        setPhase("active");

        // Start countdown timer
        let timeLeft = rules.duration * 60;
        timerRef.current = setInterval(() => {
          timeLeft -= 1;
          setTimeRemaining(timeLeft);
          if (timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (rules.autoSubmit) {
              submitSession();
            } else {
              setPhase("submitted");
            }
          }
        }, 1000);
      }
    }, 1000);
  }, [rules, submitSession]);

  const handleTyping = useCallback(
    (value: string) => {
      if (phase !== "active" || isPaused) return;
      setTyped(value);
    },
    [phase, isPaused]
  );

  const pause = useCallback(() => {
    if (!rules.allowPause || phase !== "active" || isPaused) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    pausedAtRef.current = Date.now();
    setIsPaused(true);
  }, [rules.allowPause, phase, isPaused]);

  const resume = useCallback(() => {
    if (!isPaused || phase !== "active") return;
    if (pausedAtRef.current) {
      accumulatedPauseRef.current +=
        Date.now() - pausedAtRef.current;
      pausedAtRef.current = null;
    }
    setIsPaused(false);

    // Restart timer from current timeRemaining
    let timeLeft = timeRemaining;
    timerRef.current = setInterval(() => {
      timeLeft -= 1;
      setTimeRemaining(timeLeft);
      if (timeLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (rules.autoSubmit) {
          submitSession();
        } else {
          setPhase("submitted");
        }
      }
    }, 1000);
  }, [isPaused, phase, timeRemaining, rules.autoSubmit, submitSession]);

  const restart = useCallback(() => {
    if (!rules.allowRestart) return;
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    startTimeRef.current = null;
    accumulatedPauseRef.current = 0;
    pausedAtRef.current = null;
    setTyped("");
    setScore(null);
    setErrorBreakdown(null);
    setTimeRemaining(rules.duration * 60);
    setIsPaused(false);
    setPhase("instructions");
  }, [rules.allowRestart, rules.duration]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    startTimeRef.current = null;
    accumulatedPauseRef.current = 0;
    pausedAtRef.current = null;
    setTyped("");
    setScore(null);
    setErrorBreakdown(null);
    setTimeRemaining(rules.duration * 60);
    setIsPaused(false);
    setPhase("idle");
  }, [rules.duration]);

  return {
    // State
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

    // Actions
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
