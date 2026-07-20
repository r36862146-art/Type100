"use client";

import { useEffect, useCallback } from "react";
import { PracticeLayout } from "@/features/practice/components/PracticeLayout";
import { TypingArea } from "@/features/typing/components/TypingArea";
import { useTypingStore, useTypingWords, useTypingStatus, useTypingStats, useTypingActions } from "@/features/typing/store";
import { ResultsCard } from "@/features/results/components/ResultsCard";
import { parseTextToModel } from "@/features/typing/parser";

export function PracticeClient({ initialConfig }: { initialConfig?: any }) {
  const { initSession, resetSession } = useTypingActions();
  const words = useTypingWords();
  const status = useTypingStatus();
  const stats = useTypingStats();

  const handleRestart = useCallback(() => {
    resetSession();
  }, [resetSession]);

  return (
    <PracticeLayout initialConfig={initialConfig}>
      {(content, isLoading, error, config) => {
        if (!content || isLoading || error) return null;

        // Effect to initialize session when content changes
        // Using a tiny component or direct effect here is fine, but since we are in the render prop,
        // we should initialize when content text changes.
        return <PracticeSession content={content} words={words} status={status} stats={stats} initSession={initSession} onRestart={handleRestart} config={config} />;
      }}
    </PracticeLayout>
  );
}

function PracticeSession({ content, words, status, stats, initSession, onRestart, config }: any) {
  useEffect(() => {
    if (content?.text) {
      const isTimeMode = config.mode === "learning" || config.mode === "practice" || config.mode === "exam";
      
      // If it's an exam mode, try to extract duration from the metadata source (e.g. "Target: 30 WPM | Duration: 10 Min")
      let timeLimit = config.length;
      if (config.mode === "exam" && content.metadata?.source) {
        const match = content.metadata.source.match(/Duration: (\d+) Min/);
        if (match) {
          timeLimit = parseInt(match[1]) * 60; // Convert minutes to seconds
        }
      }

      const typingConfig = {
        mode: isTimeMode ? "time" : "words",
        timeLimit: isTimeMode ? timeLimit : undefined,
        wordLimit: !isTimeMode ? config.length : undefined
      };
      initSession(content.text, typingConfig);
    }
  }, [content?.text, initSession, config, content?.metadata?.source]);

  if (status === "finished") {
    return (
      <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-300">
        <ResultsCard 
          snapshot={{
            wpm: stats.wpm,
            rawWpm: stats.rawWpm,
            accuracy: stats.accuracy,
            cpm: stats.cpm,
            elapsedTime: stats.elapsedTime,
            progress: stats.progress,
            correctCharacters: stats.correct,
            incorrectCharacters: stats.incorrect,
            extraCharacters: stats.extra,
            missedCharacters: stats.missed,
            wordsCompleted: stats.wordsCompleted,
            totalCharacters: stats.correct + stats.incorrect + stats.extra + stats.missed // Approximate
          }}
          examId={config.mode === "exam" && config.examType === "mock" ? config.examId : undefined}
          onRepeatTest={onRestart}
          onNextTest={() => window.location.reload()} // For now, just reload to fetch new content
        />
      </div>
    );
  }

  // If there are no words yet (e.g. initSession hasn't processed), we wait.
  // Actually, wait, parseTextToModel can render it immediately while store syncs.
  // The store words might be empty for one frame.
  if (!words || words.length === 0) {
    const tempWords = parseTextToModel(content.text);
    return <TypingArea words={tempWords} />;
  }

  return <TypingArea words={words} />;
}
