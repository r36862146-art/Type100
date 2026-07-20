import { useEffect, useRef } from 'react';
import { useTypingEngine } from '../typing/TypingEngine';
import { AudioManager } from '../audio/AudioManager';

export interface KeyboardConfig {
  onValidChar?: (char: string) => void;
  onInvalidChar?: (char: string) => void;
  onBackspace?: () => void;
  onSpace?: () => void;
  onEscape?: () => void;
  active?: boolean;
}

export function useKeyboard(config: KeyboardConfig = { active: true }) {
  const registerKeystroke = useTypingEngine(state => state.registerKeystroke);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const cfg = configRef.current;
      if (!cfg.active) return;

      // Ignore shortcuts (Ctrl+C, Cmd+R, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === "Escape") {
        cfg.onEscape?.();
        return;
      }

      if (e.key === "Backspace") {
        cfg.onBackspace?.();
        return;
      }

      if (e.key === " ") {
        e.preventDefault(); // Prevent scrolling
        cfg.onSpace?.();
        return;
      }

      // Ignore non-printable keys
      if (e.key.length !== 1) return;

      const char = e.key.toLowerCase();
      
      // In a real game, validity is determined by the game logic
      // So we delegate the check to the game, but provide a way to register it
      
      // For now, if the game provides onValidChar, it handles its own logic and calls registerKeystroke itself
      // We just pass the raw character event
      if (cfg.onValidChar) {
        cfg.onValidChar(char);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
