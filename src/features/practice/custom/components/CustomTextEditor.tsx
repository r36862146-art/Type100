import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ValidationMessage } from "./ValidationMessage";
import { CharacterCounter } from "./CharacterCounter";
import { ImportActions } from "./ImportActions";
import { RecentTexts } from "./RecentTexts";
import { validateCustomText, MAX_LENGTH } from "../services/validator";
import { normalizeCustomText } from "../services/normalizer";
import { PracticeConfig, PracticeMode } from "../../types";

interface CustomTextEditorProps {
  onStartSession: (config: PracticeConfig) => void;
  language: string;
}

export function CustomTextEditor({ onStartSession, language }: CustomTextEditorProps) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  // Debounced validation
  useEffect(() => {
    const handler = setTimeout(() => {
      if (text) {
        const normalized = normalizeCustomText(text);
        const result = validateCustomText(normalized);
        setErrors(result.errors);
      } else {
        setErrors([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(handler);
  }, [text]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleStart = () => {
    const normalized = normalizeCustomText(text);
    const result = validateCustomText(normalized);
    
    if (result.isValid) {
      onStartSession({
        mode: "custom" as PracticeMode,
        language: language as any,
        customText: normalized,
      });
    } else {
      setErrors(result.errors);
    }
  };

  const handleRecentSelect = useCallback((recentText: string) => {
    setText(recentText);
    const normalized = normalizeCustomText(recentText);
    const result = validateCustomText(normalized);
    setErrors(result.errors);
    
    if (result.isValid) {
      onStartSession({
        mode: "custom" as PracticeMode,
        language: language as any,
        customText: normalized,
      });
    }
  }, [onStartSession, language]);

  const handleClear = () => {
    if (text.trim() === "") return;
    if (window.confirm("Are you sure you want to clear the current text?")) {
      setText("");
      setErrors([]);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Custom Practice</h2>
        <ImportActions 
          onClearClick={handleClear}
          disabled={!text}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Textarea
          placeholder="Paste or type your custom text here..."
          value={text}
          onChange={handleChange}
          className="min-h-[200px] resize-y font-mono text-base"
          aria-label="Custom text input"
          aria-invalid={errors.length > 0}
        />
        <CharacterCounter current={text.length} max={MAX_LENGTH} />
        <ValidationMessage errors={errors} />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleStart} 
          disabled={!text || errors.length > 0}
          size="lg"
        >
          Start Practice
        </Button>
      </div>

      <RecentTexts onSelect={handleRecentSelect} />
    </div>
  );
}
