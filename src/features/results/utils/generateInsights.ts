import { ResultsSnapshot } from "../types";

export function generateInsights(snapshot: ResultsSnapshot): { title: string; message: string; type: "success" | "warning" | "info" } {
  const { wpm, accuracy, backspaces, wrongWords } = snapshot;

  if (accuracy < 85) {
    return {
      title: "Low Accuracy",
      message: "Slow down slightly and focus on typing correctly before increasing your speed. Precision is key to fast typing.",
      type: "warning"
    };
  }

  if (wrongWords && wrongWords > 3) {
    return {
      title: "Watch Your Words",
      message: "You had a few incorrect words. In strict typing modes, skipping or mistyping words can hurt your final score.",
      type: "warning"
    };
  }

  if (backspaces > (snapshot.totalCharacters * 0.1)) {
    return {
      title: "Many Backspaces",
      message: "You corrected yourself frequently. Try improving your confidence and finger placement to reduce reliance on the backspace key.",
      type: "info"
    };
  }

  if (wpm >= 60 && accuracy >= 95) {
    return {
      title: "High Speed & Accuracy",
      message: "Excellent typing speed and precision! You're typing like a pro. Keep pushing your limits.",
      type: "success"
    };
  }

  if (accuracy >= 98) {
    return {
      title: "High Accuracy",
      message: "Great accuracy! Try gradually increasing your typing speed while keeping mistakes this low.",
      type: "success"
    };
  }

  if (wpm >= 50) {
    return {
      title: "High Speed",
      message: "Excellent typing speed! Focus on maintaining your accuracy for even better results.",
      type: "success"
    };
  }

  return {
    title: "Good Effort",
    message: "Keep practicing daily! Consistency is the secret to improving your typing speed and accuracy.",
    type: "info"
  };
}
