import { useEffect } from "react";
import { useTypingStore } from "../store";
import { isValidKey } from "../engine/validator";

/**
 * Hook to attach global keyboard event listeners for the typing engine.
 * It intercepts valid keystrokes and forwards them to the state machine,
 * while preventing default browser behaviors (like scrolling with Space)
 * during an active typing session.
 */
export function useTypingInput(isActive: boolean = true) {
  const handleKeystroke = useTypingStore((state) => state.handleKeystroke);
  const status = useTypingStore((state) => state.status);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey, metaKey, altKey } = event;

      // Ensure we don't process input if the test is finished
      if (status === "finished") return;

      if (isValidKey(key, ctrlKey, metaKey, altKey)) {
        // Prevent default actions for valid typing keys.
        // e.g., Spacebar scrolling down the page, Backspace going back in history.
        // Single quote triggering quick find in Firefox, etc.
        event.preventDefault();
        
        handleKeystroke(key);
      }
    };

    // Prevent pasting completely to ensure typing metrics remain accurate
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("paste", handlePaste);
    };
  }, [isActive, status, handleKeystroke]);
}
