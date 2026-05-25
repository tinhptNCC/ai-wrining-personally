import { Injectable } from '@nestjs/common';
import { WritingType } from '../types/ai.types';
import { Writing } from 'src/entities';

@Injectable()
export class PromptTemplatesService {
  /**
   * Get specialized prompt based on writing type
   */
  getPrompt(writing: Writing, type: WritingType): string {
    switch (type) {
      case WritingType.JOURNAL_ENTRY:
        return this.getJournalEntryPrompt(writing);
      case WritingType.SOCIAL_ESSAY:
        return this.getSocialEssayPrompt(writing);
      case WritingType.REFLECTION_PIECE:
        return this.getReflectionPiecePrompt(writing);
      default:
        return this.getDefaultPrompt(writing);
    }
  }

  /**
   * Prompt for personal journal entries
   * Focus on: clarity, coherence, emotional expression, personal growth
   */
  private getJournalEntryPrompt(writing: Writing): string {
    return `
Analyze this Vietnamese journal entry and provide detailed feedback in the specified JSON format.

**Journal Entry:**
Title: ${writing.title}
Content:
${writing.content}

**Analysis Task:**
Evaluate this personal journal entry on these dimensions:

1. **Structure & Organization**: How well-organized are the thoughts? Do they flow logically?
2. **Clarity & Expression**: How clearly does the writer express emotions and ideas?
3. **Tone & Voice**: What is the emotional tone? Does it feel authentic?
4. **Coherence**: Do sentences connect well? Is the narrative easy to follow?

**Evaluation Criteria:**
- Score each dimension from 1-10
- Provide specific, actionable feedback
- Highlight strengths (what works well)
- Suggest 2-3 concrete improvements
- For personal writing, consider emotional authenticity and self-reflection quality

**Response Format:**
Return a JSON object with this exact structure:
{
  "structure": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "clarity": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "tone": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "coherence": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "overallFeedback": "<comprehensive 2-3 sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasForImprovement": ["<area 1>", "<area 2>", "<area 3>"],
  "actionItems": ["<action 1>", "<action 2>", "<action 3>"]
}

Be encouraging but honest. Focus on growth and development.
`;
  }

  /**
   * Prompt for social/academic essays
   * Focus on: argument structure, persuasiveness, evidence, clarity, vocabulary
   */
  private getSocialEssayPrompt(writing: Writing): string {
    return `
Analyze this Vietnamese essay and provide detailed feedback in the specified JSON format.

**Essay:**
Title: ${writing.title}
Content:
${writing.content}

**Analysis Task:**
Evaluate this essay on these dimensions:

1. **Structure & Organization**: Is there a clear introduction, body, and conclusion? Does the argument flow logically?
2. **Clarity & Expression**: How clear is the writing? Is vocabulary appropriate and diverse?
3. **Tone & Voice**: Does the tone match the topic? Is it appropriate for the intended audience?
4. **Coherence**: Do paragraphs connect well? Are transitions smooth?

**Evaluation Criteria:**
- Score each dimension from 1-10
- For academic/social writing, evaluate argument strength and evidence presentation
- Check for logical flow and persuasiveness
- Assess vocabulary and language sophistication

**Response Format:**
Return a JSON object with this exact structure:
{
  "structure": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "clarity": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "tone": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "coherence": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "overallFeedback": "<comprehensive 2-3 sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasForImprovement": ["<area 1>", "<area 2>", "<area 3>"],
  "actionItems": ["<action 1>", "<action 2>", "<action 3>"]
}

Focus on argumentation quality and communication effectiveness.
`;
  }

  /**
   * Prompt for reflection pieces
   * Focus on: introspection, depth, self-awareness, insights, growth
   */
  private getReflectionPiecePrompt(writing: Writing): string {
    return `
Analyze this Vietnamese reflection piece and provide detailed feedback in the specified JSON format.

**Reflection:**
Title: ${writing.title}
Content:
${writing.content}

**Analysis Task:**
Evaluate this reflective writing on these dimensions:

1. **Structure & Organization**: Does the reflection have a clear progression of thoughts? Is it well-organized?
2. **Clarity & Expression**: How clearly does the writer articulate insights and realizations?
3. **Tone & Voice**: Does the tone reflect genuine reflection? Is it authentic and thoughtful?
4. **Coherence**: Do thoughts connect logically? Is the reflection easy to follow?

**Evaluation Criteria:**
- Score each dimension from 1-10
- Look for depth of introspection and self-awareness
- Evaluate the quality of insights and learning
- Consider how well the writer connects observations to deeper understanding

**Response Format:**
Return a JSON object with this exact structure:
{
  "structure": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "clarity": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "tone": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "coherence": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "overallFeedback": "<comprehensive 2-3 sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasForImprovement": ["<area 1>", "<area 2>", "<area 3>"],
  "actionItems": ["<action 1>", "<action 2>", "<action 3>"]
}

Emphasize insight depth and personal growth. Be supportive of the reflective journey.
`;
  }

  /**
   * Default prompt for unknown types
   */
  private getDefaultPrompt(writing: Writing): string {
    return `
Analyze this Vietnamese writing and provide detailed feedback in the specified JSON format.

**Writing:**
Title: ${writing.title}
Type: ${writing.type}
Content:
${writing.content}

**Analysis Task:**
Provide comprehensive writing feedback evaluating:
1. Structure & Organization
2. Clarity & Expression
3. Tone & Voice
4. Overall Coherence

**Response Format:**
Return a JSON object with this exact structure:
{
  "structure": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "clarity": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "tone": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "coherence": {
    "score": <number 1-10>,
    "feedback": "<specific feedback>",
    "suggestions": ["<suggestion 1>", "<suggestion 2>"]
  },
  "overallFeedback": "<comprehensive 2-3 sentence summary>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "areasForImprovement": ["<area 1>", "<area 2>", "<area 3>"],
  "actionItems": ["<action 1>", "<action 2>", "<action 3>"]
}

Provide constructive, encouraging feedback focused on improvement.
`;
  }

  /**
   * Get all supported writing types
   */
  getSupportedTypes(): WritingType[] {
    return Object.values(WritingType);
  }

  /**
   * Check if type is supported
   */
  isTypeSupported(type: string): boolean {
    return Object.values(WritingType).includes(type as WritingType);
  }
}
