"use client";

// ============================================================
// useSSCSimulator HOOK — Phase 8.2
// State machine for the SSC simulator:
// idle → instructions → countdown → active → submitted → results
// Manages timer, auto-submit, live stats, and passage loading.
// ============================================================

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { ExamId, ExamLanguage } from "@/features/exam/types";
import type { SSCRules } from "../services/sscRules";
import type { SSCPassage } from "../services/passageLoader";
import type { SSCScoreResult } from "../services/scoring";
import { getRandomPassage } from "../services/passageLoader";
import { validateInput } from "../services/validation";
import { computeSSCScore } from "../services/scoring";

// ----------------------------------------------------------------
// State machine
// ----------------------------------------------------------------

export type SimulatorPhase =
  | "idle"
  | "instructions"
  | "countdown"
  | "active"
  | "submitted"
  | "results";

export interface SimulatorState {
  phase: SimulatorPhase;
  passage: SSCPassage | null;
  typed: string;
  timeRemainingSeconds: number;
  countdownSeconds: number;
  score: SSCScoreResult | null;
  isLoading: boolean;
  error: string | null;
}

// ----------------------------------------------------------------
// Hook
// ----------------------------------------------------------------

export function useSSCSimulator(
  examId: ExamId,
  language: ExamLanguage,
  rules: SSCRules
) {
  const [phase, setPhase] = useState<SimulatorPhase>("idle");
  const [passage, setPassage] = useState<SSCPassage | null>(null);
  const [typed, setTyped] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(rules.duration * 60);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState<SSCScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // -----------------------------------------------
  // Load passage on mount / examId change
  // -----------------------------------------------
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
        console.error("[useSSCSimulator] Passage load failed:", err);
      });
      
    return () => { isActive = false; };
  }, [examId, language]);

  // -----------------------------------------------
  // Clear timers on unmount
  // -----------------------------------------------
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // -----------------------------------------------
  // Live statistics (memoized)
  // -----------------------------------------------
  const liveStats = useMemo(() => {
    if (!passage || !typed) return null;
    const elapsed = (rules.duration * 60) - timeRemaining;
    const validation = validateInput(typed, passage.text);
    return {
      typed: typed.length,
      correct: validation.correctChars,
      incorrect: validation.incorrectChars,
      accuracy: validation.accuracy,
      grossChars: typed.length,
      errors: validation.incorrectChars,
      elapsed,
    };
  }, [typed, passage, rules.duration, timeRemaining]);

  // -----------------------------------------------
  // Submit (called manually or by auto-submit)
  // -----------------------------------------------
  const submitSession = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!passage || !startTimeRef.current) {
      setPhase("results");
      return;
    }

    const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
    const validation = validateInput(typed, passage.text);
    const result = computeSSCScore(
      {
        grossCharacters: typed.length,
        errors: validation.incorrectChars,
        elapsedSeconds,
        qualifyingType: rules.qualifyingType,
      },
      rules.targetSpeed,
      rules.targetKPH
    );

    setScore(result);
    setPhase("results");
  }, [typed, passage, rules]);

  // -----------------------------------------------
  // Actions
  // -----------------------------------------------

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
        startTimeRef.current = Date.now();
        setPhase("active");

        // Start countdown timer
        let timeLeft = rules.duration * 60;
        timerRef.current = setInterval(() => {
          timeLeft -= 1;
          setTimeRemaining(timeLeft);
          if (timeLeft <= 0) {
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

  const handleTyping = useCallback((value: string) => {
    if (phase !== "active") return;
    setTyped(value);
  }, [phase]);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    startTimeRef.current = null;
    setTyped("");
    setScore(null);
    setTimeRemaining(rules.duration * 60);
    setPhase("instructions");
  }, [rules.duration]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    startTimeRef.current = null;
    setTyped("");
    setScore(null);
    setTimeRemaining(rules.duration * 60);
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
    isLoading,
    error,
    liveStats,

    // Actions
    showInstructions,
    startCountdown,
    handleTyping,
    submitSession,
    restart,
    reset,
  };
}
