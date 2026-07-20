export const MIN_LENGTH = 10;
export const MAX_LENGTH = 5000;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCustomText(text: string): ValidationResult {
  const errors: string[] = [];

  if (!text || text.trim().length === 0) {
    errors.push("Text cannot be empty.");
    return { isValid: false, errors }; // Early return for empty text
  }

  if (text.length < MIN_LENGTH) {
    errors.push(`Text must be at least ${MIN_LENGTH} characters long.`);
  }

  if (text.length > MAX_LENGTH) {
    errors.push(`Text cannot exceed ${MAX_LENGTH} characters.`);
  }

  // Check for invalid control characters (excluding \n, \r, \t)
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)) {
    errors.push("Text contains invalid control characters.");
  }

  // Check for excessive whitespace
  if (/[ \t]{10,}/.test(text)) {
    errors.push("Text contains excessive consecutive spaces or tabs.");
  }

  // Check for consecutive blank lines (more than 2)
  if (/\n\s*\n\s*\n/.test(text)) {
    errors.push("Text contains too many consecutive blank lines.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
