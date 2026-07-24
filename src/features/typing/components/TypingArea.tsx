import React, { useRef, useEffect } from "react";
import { Word as WordType } from "../types";
import { TypingText } from "./TypingText";
import { cn } from "@/lib/utils";
import { useTypingInput } from "../hooks/useTypingInput";
import { useTypingTimer } from "../hooks/useTypingTimer";
import { LiveTimer } from "./LiveTimer";

interface TypingAreaProps {
  words: WordType[];
  className?: string;
}

export const TypingArea = React.memo(({ words, className }: TypingAreaProps) => {
  const activeWordText = React.useMemo(() => {
    const activeWord = words.find((w) => w.characters.some((c) => c.state === "current"));
    return activeWord ? activeWord.characters.map((c) => c.value).join("") : "";
  }, [words]);

  // Attach global keyboard listener for the typing engine
  useTypingInput(true);
  
  // Start the timer to track session elapsed time
  useTypingTimer();

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the hidden input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className={cn("relative w-full max-w-5xl mx-auto p-4 pt-12 md:p-8 md:pt-16 outline-none cursor-text touch-manipulation", className)}
      onClick={handleClick}
    >
      {/* 
        Hidden input forces mobile keyboards to appear and ensures desktop focus
      */}
      <input
        ref={inputRef}
        type="text"
        className="fixed -top-20 -left-20 opacity-0 pointer-events-none"
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />

      {/* 
        Visually hidden live region for screen readers. 
        Announces the current word so visually impaired users can hear what to type next.
      */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {activeWordText ? `Type word: ${activeWordText}` : ""}
      </div>

      <LiveTimer />
      <TypingText words={words} />
    </div>
  );
});
TypingArea.displayName = "TypingArea";
