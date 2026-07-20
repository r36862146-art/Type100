export function isValidKey(key: string, ctrlKey: boolean, metaKey: boolean, altKey: boolean): boolean {
  // Ignore modifiers and shortcuts (e.g., Ctrl+C)
  if (ctrlKey || metaKey || altKey) {
    return false;
  }

  // Allow backspace
  if (key === "Backspace") {
    return true;
  }

  // Ignore structural/function keys that are 2+ chars long except Backspace
  // (e.g. Tab, Escape, Enter, Shift, ArrowUp, F1)
  if (key.length > 1) {
    return false;
  }

  return true;
}
