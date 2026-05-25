export function extractJson(text: string): string {
  if (!text) {
    throw new Error('Empty response');
  }

  // Remove markdown fences
  const cleaned = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();

  // Find first opening brace
  const firstBrace = cleaned.indexOf('{');

  if (firstBrace === -1) {
    throw new Error('No JSON object found');
  }

  // Try to balance braces
  let braceCount = 0;
  let endIndex = -1;

  for (let i = firstBrace; i < cleaned.length; i++) {
    const char = cleaned[i];

    if (char === '{') {
      braceCount++;
    }

    if (char === '}') {
      braceCount--;

      if (braceCount === 0) {
        endIndex = i;
        break;
      }
    }
  }

  if (endIndex === -1) {
    throw new Error('Incomplete JSON object');
  }

  return cleaned.slice(firstBrace, endIndex + 1);
}
