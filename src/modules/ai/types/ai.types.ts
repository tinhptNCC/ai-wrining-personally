export enum WritingType {
  JOURNAL_ENTRY = 'journal_entry',
  SOCIAL_ESSAY = 'social_essay',
  REFLECTION_PIECE = 'reflection_piece',
}

export interface OpenAiResponse {
  content: string;
  tokensUsed: number;
  model: string;
  promptTokens: number;
  completionTokens: number;
}

export interface TokenUsageInfo {
  used: number;
  remaining: number;
  limit: number;
  percentage: number;
}

export interface AiAnalysisResult {
  success: boolean;
  data?: Record<string, any>;
  tokensUsed?: number;
  error?: AiErrorDetails;
}

export interface AiErrorDetails {
  code: string;
  message: string;
  retryable: boolean;
  retryAfter?: number;
  statusCode?: number;
}
