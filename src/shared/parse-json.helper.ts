export function extractJson(text: string): string {
  return extractJsonValue(text, ['{']);
}

export function extractJsonArray(text: string): string {
  return extractJsonValue(text, ['[']);
}

export function extractJsonValue(
  text: string,
  allowedStarts: Array<'{' | '['> = ['{', '['],
): string {
  if (!text) {
    throw new Error('Empty response');
  }

  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  const startIndex = findFirstJsonStart(cleaned, allowedStarts);

  if (startIndex === -1) {
    throw new Error('No JSON value found');
  }

  const openingChar = cleaned[startIndex] as '{' | '[';
  const closingChar = openingChar === '{' ? '}' : ']';
  let depth = 0;
  let endIndex = -1;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = inString;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === openingChar) {
      depth++;
    }

    if (char === closingChar) {
      depth--;

      if (depth === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    throw new Error('Incomplete JSON value');
  }

  return cleaned.slice(startIndex, endIndex + 1);
}

function findFirstJsonStart(
  text: string,
  allowedStarts: Array<'{' | '['>,
): number {
  const indexes = allowedStarts
    .map((char) => text.indexOf(char))
    .filter((index) => index >= 0);

  return indexes.length > 0 ? Math.min(...indexes) : -1;
}
