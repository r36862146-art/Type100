export function normalizeCustomText(text: string): string {
  if (!text) return "";

  // 1. Normalize line endings to standard \n
  let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // 2. Trim leading and trailing whitespace of the entire string
  normalized = normalized.trim();

  // 3. Remove excessive consecutive blank lines (more than two \n)
  normalized = normalized.replace(/\n\s*\n\s*\n+/g, '\n\n');

  // 4. Preserve Unicode and punctuation inherently by not stripping them.
  // 5. Preserve intended formatting (e.g., indents) by not removing leading whitespace on individual lines,
  // except we might want to trim trailing whitespace on lines.
  normalized = normalized.replace(/[ \t]+$/gm, '');

  return normalized;
}
