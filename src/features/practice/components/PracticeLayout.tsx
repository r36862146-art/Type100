"use client";

import React, { useEffect, useState, ReactNode, useCallback } from "react";
import { PracticeConfig, PracticeContent, PracticeMode } from "../types";
import { practiceRegistry } from "../registry";
import { PracticeSelector } from "./PracticeSelector";
import { PracticeToolbar } from "./PracticeToolbar";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePracticeSettings } from "../hooks/usePracticeSettings";
import { usePracticeAnalytics } from "../hooks/usePracticeAnalytics";
import { CustomTextEditor } from "../custom/components/CustomTextEditor";
import { LearningIntroCard } from "./LearningIntroCard";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PracticeLayoutProps {
  initialConfig?: Partial<PracticeConfig>;
  children: (content: PracticeContent | null, isLoading: boolean, error: Error | null, config: PracticeConfig) => ReactNode;
  className?: string;
}

export function PracticeLayout({
  initialConfig,
  children,
  className,
}: PracticeLayoutProps) {
  const { config, setConfig, isReady } = usePracticeSettings(initialConfig);
  const { trackEvent, trackModeChange } = usePracticeAnalytics();

  const [content, setContent] = useState<PracticeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // To allow manual retries
  const [retryCount, setRetryCount] = useState(0);

  const availableModes = practiceRegistry.getRegisteredModes().filter(m => m !== "exam");

  useEffect(() => {
    if (!isReady) return; // Wait until hydration & local storage load

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    if (config.mode === "custom" && !config.customText) {
      setContent(null);
      setIsLoading(false);
      return;
    }

    practiceRegistry.generateContent(config)
      .then((c) => {
        if (isMounted) {
          setContent(c);
          setIsLoading(false);
          trackEvent("practice_started", { mode: config.mode, language: config.language });
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(e as Error);
          setIsLoading(false);
          console.error("Failed to generate practice content:", e);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [config, isReady, retryCount, trackEvent]);

  const handleModeChange = useCallback((mode: PracticeMode) => {
    trackModeChange(mode);
    setConfig({ mode });
  }, [setConfig, trackModeChange]);

  const handleConfigChange = useCallback((newConfig: Partial<PracticeConfig>) => {
    if (newConfig.language && newConfig.language !== config.language) {
      trackEvent("language_changed", { from: config.language, to: newConfig.language });
    } else {
      trackEvent("settings_changed", newConfig);
    }
    setConfig(newConfig);
  }, [config.language, setConfig, trackEvent]);

  const handleRetry = () => {
    setRetryCount(c => c + 1);
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-5xl mx-auto px-4 md:px-6", className)}>
      <div className="flex flex-col gap-4 items-center justify-center pt-8">
        {config.mode === "learning" && <LearningIntroCard />}
        
        {config.mode === "exam" ? (
          <div className="bg-primary/10 text-primary border border-primary/20 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
            <span>Official Exam Simulation</span>
          </div>
        ) : (
          <>
            <PracticeSelector
              currentMode={config.mode}
              availableModes={availableModes}
              onModeChange={handleModeChange}
            />
            <PracticeToolbar
              config={config}
              onConfigChange={handleConfigChange}
            />
          </>
        )}
      </div>

      <div className="flex-1 w-full relative min-h-[300px]">
        {config.mode === "custom" && !config.customText ? (
          <CustomTextEditor 
            language={config.language} 
            onStartSession={(c) => setConfig({ customText: c.customText })} 
          />
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center text-muted-foreground animate-in fade-in zoom-in duration-300">
            <p className="text-destructive font-medium">Failed to load practice content.</p>
            <p className="text-sm max-w-md">{error.message}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 mt-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 min-h-[44px] transition-colors"
            >
              Retry
            </button>
          </div>
        ) : isLoading || !isReady ? (
          <div className="w-full h-full flex flex-col gap-3 animate-pulse opacity-60">
            <div className="h-6 bg-muted rounded w-3/4 mx-auto" />
            <div className="h-6 bg-muted rounded w-full mx-auto" />
            <div className="h-6 bg-muted rounded w-5/6 mx-auto" />
          </div>
        ) : (
          children(content, isLoading, error, config)
        )}
      </div>
    </div>
  );
}
