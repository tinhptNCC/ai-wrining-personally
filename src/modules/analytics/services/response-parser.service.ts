import { Injectable, Logger } from '@nestjs/common';

import { z } from 'zod';
import {
  PartialWritingAnalyticsSchema,
  ResponseParserResult,
  WritingAnalytics,
  WritingAnalyticsSchema,
} from '../../ai/schemas/analysis-response.schema';

@Injectable()
export class ResponseParserService {
  private readonly logger = new Logger(ResponseParserService.name);

  /**
   * Parse and validate OpenAI response
   * Handles JSON extraction from markdown code blocks and text
   */
  parseAndValidate(content: string): ResponseParserResult {
    try {
      // Step 1: Extract JSON from content
      const jsonContent = this.extractJson(content);
      if (!jsonContent) {
        this.logger.warn('No valid JSON found in response');
        return {
          valid: false,
          errors: ['No valid JSON found in response'],
          rawContent: content,
        };
      }

      // Step 2: Parse JSON
      let parsedData: any;
      try {
        parsedData = JSON.parse(jsonContent);
      } catch (error) {
        this.logger.error('Failed to parse JSON:', error);
        return {
          valid: false,
          errors: [`JSON parse error: ${error.message}`],
          rawContent: content,
        };
      }

      // Step 3: Normalize common model omissions before schema validation.
      // Some models return one valid item for summary arrays even when prompted
      // for 2-3 items. Preserve useful feedback and fill the minimum shape.
      const normalizedData = this.normalizeAnalyticsData(parsedData);

      // Step 4: Validate against schema
      const validationResult = WritingAnalyticsSchema.safeParse(normalizedData);

      if (validationResult.success) {
        this.logger.debug('Response validation successful');
        return {
          valid: true,
          data: validationResult.data,
          rawContent: content,
        };
      }

      // Step 5: Try partial validation as fallback
      const partialResult =
        PartialWritingAnalyticsSchema.safeParse(normalizedData);

      if (partialResult.success && this.hasMinimalData(partialResult.data)) {
        this.logger.warn('Partial response validation successful (fallback)');
        return {
          valid: true,
          data: this.fillPartialData(partialResult.data) as WritingAnalytics,
          errors: this.formatZodErrors(validationResult.error),
          rawContent: content,
        };
      }

      // Full validation failed
      this.logger.error('Response validation failed:', validationResult.error);
      return {
        valid: false,
        errors: this.formatZodErrors(validationResult.error),
        rawContent: content,
      };
    } catch (error) {
      this.logger.error('Unexpected error during parsing:', error);
      return {
        valid: false,
        errors: [`Unexpected parsing error: ${error.message}`],
        rawContent: content,
      };
    }
  }

  /**
   * Extract JSON from various formats
   * Handles: raw JSON, markdown code blocks, nested objects
   */
  private extractJson(content: string): string | null {
    if (!content || typeof content !== 'string') {
      return null;
    }

    // Try to extract from markdown code block (```json ... ```)
    const jsonCodeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonCodeBlockMatch?.[1]) {
      return jsonCodeBlockMatch[1].trim();
    }

    // Try to robustly extract the first balanced JSON object from the text.
    // This handles nested objects, strings with escaped quotes, and ignores
    // braces that appear inside string literals.
    const firstBraceIndex = content.indexOf('{');
    if (firstBraceIndex === -1) return null;

    for (
      let start = firstBraceIndex;
      start < content.length;
      start = content.indexOf('{', start + 1)
    ) {
      if (start === -1) break;
      let depth = 0;
      let inString = false;
      let escape = false;
      for (let i = start; i < content.length; i++) {
        const ch = content[i];

        if (escape) {
          escape = false;
          continue;
        }

        if (ch === '\\') {
          escape = true;
          continue;
        }

        if (ch === '"') {
          inString = !inString;
          continue;
        }

        if (inString) continue;

        if (ch === '{') depth++;
        else if (ch === '}') depth--;

        if (depth === 0) {
          const candidate = content.slice(start, i + 1).trim();
          // quick sanity: must start with { and end with }
          if (candidate.startsWith('{') && candidate.endsWith('}'))
            return candidate;
          break;
        }
      }

      // move to next opening brace if any
      if (start + 1 >= content.length) break;
    }

    return null;
  }

  /**
   * Check if partial data has minimum required fields
   */
  private hasMinimalData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      (data.structure ||
        data.clarity ||
        data.tone ||
        data.coherence ||
        data.overallFeedback)
    );
  }

  /**
   * Fill partial data with defaults
   */
  private fillPartialData(partial: any): Partial<WritingAnalytics> {
    const defaultFeedback = {
      score: 5,
      feedback: 'Analytics in progress',
      suggestions: ['Please review the feedback provided'],
    };

    return {
      structure: partial.structure || defaultFeedback,
      clarity: partial.clarity || defaultFeedback,
      tone: partial.tone || defaultFeedback,
      coherence: partial.coherence || defaultFeedback,
      overallFeedback:
        partial.overallFeedback ||
        'Overall analysis: The writing shows potential for improvement across multiple dimensions.',
      strengths: partial.strengths || [
        'Clear intent',
        'Authentic voice',
        'Engaging content',
      ],
      areasForImprovement: partial.areasForImprovement || [
        'Structure clarity',
        'Coherence and flow',
        'Supporting examples',
      ],
      actionItems: partial.actionItems || [
        'Review feedback carefully',
        'Practice writing regularly',
        'Seek peer feedback',
      ],
    };
  }

  private normalizeAnalyticsData(data: any): any {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const normalized = { ...data };

    normalized.structure = this.normalizeFeedbackItem(
      normalized.structure,
      'Structure feedback is still being refined.',
    );
    normalized.clarity = this.normalizeFeedbackItem(
      normalized.clarity,
      'Clarity feedback is still being refined.',
    );
    normalized.tone = this.normalizeFeedbackItem(
      normalized.tone,
      'Tone feedback is still being refined.',
    );
    normalized.coherence = this.normalizeFeedbackItem(
      normalized.coherence,
      'Coherence feedback is still being refined.',
    );

    normalized.overallFeedback =
      typeof normalized.overallFeedback === 'string' &&
      normalized.overallFeedback.trim().length >= 20
        ? normalized.overallFeedback.trim().slice(0, 500)
        : 'The writing has useful ideas and can improve with clearer structure, stronger transitions, and more specific supporting details.';

    normalized.strengths = this.normalizeStringList(normalized.strengths, [
      'Clear writing intent',
      'Authentic voice',
    ]);
    normalized.areasForImprovement = this.normalizeStringList(
      normalized.areasForImprovement,
      ['Structure clarity', 'Coherence and flow'],
    );
    normalized.actionItems = this.normalizeStringList(normalized.actionItems, [
      'Review the feedback carefully',
      'Revise one section at a time',
    ]);

    return normalized;
  }

  private normalizeFeedbackItem(item: any, fallbackFeedback: string) {
    const score =
      typeof item?.score === 'number'
        ? Math.max(1, Math.min(10, Math.round(item.score)))
        : 5;

    const feedback =
      typeof item?.feedback === 'string' && item.feedback.trim().length >= 10
        ? item.feedback.trim().slice(0, 1000)
        : fallbackFeedback;

    const suggestions = this.normalizeStringList(item?.suggestions, [
      'Revise this area with one specific improvement',
    ]).slice(0, 5);

    return {
      score,
      feedback,
      suggestions,
    };
  }

  private normalizeStringList(value: any, defaults: string[]): string[] {
    const items = (Array.isArray(value) ? value : [])
      .filter((item) => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length >= 5)
      .map((item) => item.slice(0, 150));

    for (const fallback of defaults) {
      if (items.length >= 2) {
        break;
      }

      if (!items.includes(fallback)) {
        items.push(fallback);
      }
    }

    return items.slice(0, 5);
  }

  /**
   * Format Zod validation errors for logging
   */
  private formatZodErrors(error: z.ZodError): string[] {
    return error.errors.map((err) => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    });
  }

  /**
   * Validate data structure without full parsing
   */
  validateStructure(data: any): boolean {
    const result = WritingAnalyticsSchema.safeParse(data);
    return result.success;
  }

  /**
   * Get schema for documentation
   */
  getSchema() {
    return WritingAnalyticsSchema;
  }
}
