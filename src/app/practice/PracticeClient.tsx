"use client";

import { useEffect, useCallback } from "react";
import { PracticeLayout } from "@/features/practice/components/PracticeLayout";
import { TypingArea } from "@/features/typing/components/TypingArea";
import { useTypingStore, useTypingWords, useTypingStatus, useTypingStats, useTypingActions } from "@/features/typing/store";
import { ResultsCard } from "@/features/results/components/ResultsCard";
import { parseTextToModel } from "@/features/typing/parser";
import { FinishTestButton } from "@/features/practice/components/FinishTestButton";

export function PracticeClient({ initialConfig }: { initialConfig?: any }) {
  const { initSession, resetSession, finishSession } = useTypingActions();
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

        return <PracticeSession content={content} words={words} status={status} stats={stats} initSession={initSession} finishSession={finishSession} onRestart={handleRestart} config={config} />;
      }}
    </PracticeLayout>
  );
}

function PracticeSession({ content, words, status, stats, initSession, finishSession, onRestart, config }: any) {
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

  // Save session to IDB when finished
  useEffect(() => {
    if (status === "finished") {
      import("@/lib/local-db/db").then(({ localDb }) => {
        localDb.saveSession({
          id: crypto.randomUUID(),
          user_id: "guest",
          wpm: stats.wpm,
          accuracy: stats.accuracy,
          duration: Math.floor(stats.elapsedTime / 1000),
          mode: config.mode || "practice",
          timestamp: new Date().toISOString()
        }).catch(console.error);
      });
    }
  }, [status, stats.wpm, stats.accuracy, stats.elapsedTime, config.mode]);

  if (status === "finished") {
    let wrongWordsCount: number | undefined = undefined;
    
    if (config.difficulty === "medium" || config.difficulty === "hard") {
      wrongWordsCount = words.reduce((acc: number, word: any) => {
        if (stats.wordsCompleted > word.wordIndex) {
          const hasError = word.characters.some((c: any) => c.state === "incorrect" || c.state === "missed" || c.state === "extra");
          if (hasError) return acc + 1;
        }
        return acc;
      }, 0);
    }

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
            totalCharacters: stats.correct + stats.incorrect + stats.extra + stats.missed,
            backspaces: stats.backspaces,
            wrongWords: wrongWordsCount
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

  return (
    <div className="relative w-full">
      <TypingArea words={words} />
      
      {/* Finish Test Button for timed tests */}
      {(config.mode === "practice" || config.mode === "learning" || config.mode === "exam") && config.length && (
        <>
          <div className="absolute -top-14 right-0 hidden sm:block">
            <FinishTestButton onFinish={finishSession} mode="practice" />
          </div>
          <div className="fixed bottom-6 left-0 right-0 flex justify-center sm:hidden z-50 animate-in slide-in-from-bottom-5">
            <FinishTestButton onFinish={finishSession} mode="practice" className="shadow-2xl px-6 py-3 rounded-full" />
          </div>
        </>
      )}
    </div>
  );
}
