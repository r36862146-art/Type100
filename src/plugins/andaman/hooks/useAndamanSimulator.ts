"use client";

// ============================================================
// useAndamanSimulator HOOK — Phase 8.4
// State machine: idle → instructions → countdown → active → results
// Driven entirely by AndamanRules — no hardcoded exam logic.
// ============================================================

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { ExamId, ExamLanguage } from "@/features/exam/types";
import type { AndamanRules } from "../services/andamanRules";
import type { AndamanPassage } from "../services/passageLoader";
import type { AndamanScoreResult, AndamanErrorBreakdown } from "../services/scoring";
import { getRandomPassage } from "../services/passageLoader";
import { validateInput } from "../services/validation";
import { computeAndamanScore, getErrorBreakdown } from "../services/scoring";

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

export type AndamanSimulatorPhase =
  | "idle"
  | "instructions"
  | "countdown"
  | "active"
  | "submitted"
  | "results";

export interface AndamanLiveStats {
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

export function useAndamanSimulator(
  examId: ExamId,
  language: ExamLanguage,
  rules: AndamanRules
) {
  // ── State ──
  const [phase, setPhase] = useState<AndamanSimulatorPhase>("idle");
  const [passage, setPassage] = useState<AndamanPassage | null>(null);
  const [typed, setTyped] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(rules.duration * 60);
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState<AndamanScoreResult | null>(null);
  const [errorBreakdown, setErrorBreakdown] = useState<AndamanErrorBreakdown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // ── Refs ──
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const accumulatedPauseRef = useRef<number>(0);

  // ── Load passage ──
  useEffect(() => {
    let isActive = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);
    getRandomPassage(examId, language)
      .then((p) => { if (isActive) { setPassage(p); setIsLoading(false); } })
      .catch((err) => {
        if (!isActive) return;
        setError("Failed to load passage. Please try again.");
        setIsLoading(false);
        console.error("[useAndamanSimulator]", err);
      });
      
    return () => { isActive = false; };
  }, [examId, language]);

  // ── Cleanup timers ──
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  // ── Live stats ──
  const liveStats = useMemo((): AndamanLiveStats | null => {
    if (!passage || !typed) return null;
    const elapsed = (rules.duration * 60) - timeRemaining;
    const v = validateInput(typed, passage.text);
    return {
      typed: typed.length,
      correct: v.correctChars,
      incorrect: v.incorrectChars,
      accuracy: v.accuracy,
      grossChars: typed.length,
      elapsed,
      progress: Math.min(100, Math.round((typed.length / passage.text.length) * 100)),
    };
  }, [typed, passage, rules.duration, timeRemaining]);

  // ── Submit ──
  const submitSession = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (!passage || !startTimeRef.current) { setPhase("results"); return; }

    const elapsedSeconds =
      (Date.now() - startTimeRef.current - accumulatedPauseRef.current) / 1000;
    const v = validateInput(typed, passage.text);
    const result = computeAndamanScore({
      grossCharacters: typed.length,
      errors: v.incorrectChars,
      elapsedSeconds,
      targetWpm: rules.targetWpm,
      targetAccuracy: rules.targetAccuracy,
    });
    setScore(result);
    setErrorBreakdown(getErrorBreakdown(typed, passage.text));
    setPhase("results");
  }, [typed, passage, rules]);

  // ── Actions ──
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
        setTyped("");
        setTimeRemaining(rules.duration * 60);
        accumulatedPauseRef.current = 0;
        startTimeRef.current = Date.now();
        setPhase("active");
        let timeLeft = rules.duration * 60;
        timerRef.current = setInterval(() => {
          timeLeft -= 1;
          setTimeRemaining(timeLeft);
          if (timeLeft <= 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            if (rules.autoSubmit) submitSession();
            else setPhase("submitted");
          }
        }, 1000);
      }
    }, 1000);
  }, [rules, submitSession]);

  const handleTyping = useCallback(
    (value: string) => { if (phase === "active" && !isPaused) setTyped(value); },
    [phase, isPaused]
  );

  const pause = useCallback(() => {
    if (!rules.allowPause || phase !== "active" || isPaused) return;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    pausedAtRef.current = Date.now();
    setIsPaused(true);
  }, [rules.allowPause, phase, isPaused]);

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
        if (rules.autoSubmit) submitSession();
        else setPhase("submitted");
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
    setTyped(""); setScore(null); setErrorBreakdown(null);
    setTimeRemaining(rules.duration * 60); setIsPaused(false);
    setPhase("instructions");
  }, [rules.allowRestart, rules.duration]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    startTimeRef.current = null;
    accumulatedPauseRef.current = 0;
    pausedAtRef.current = null;
    setTyped(""); setScore(null); setErrorBreakdown(null);
    setTimeRemaining(rules.duration * 60); setIsPaused(false);
    setPhase("idle");
  }, [rules.duration]);

  return {
    phase, passage, typed, timeRemaining, countdown,
    score, errorBreakdown, isLoading, error, liveStats, isPaused,
    showInstructions, startCountdown, handleTyping, submitSession,
    pause, resume, restart, reset,
  };
}
