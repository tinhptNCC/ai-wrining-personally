import { AiErrorDetails } from '../types/ai.types';
export enum AiErrorCode {
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  RATE_LIMITED = 'RATE_LIMITED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class AiError extends Error {
  constructor(
    public code: string,
    message: string,
    public retryable: boolean = false,
    public retryAfter?: number,
    public statusCode?: number,
  ) {
    super(message);
    this.name = 'AiError';
  }
}

export class AiErrorHandler {
  static handle(error: any): AiErrorDetails {
    // Handle Gemini SDK errors
    if (error.message) {
      // Rate limit error
      if (
        error.message.includes('RESOURCE_EXHAUSTED') ||
        error.message.includes('429') ||
        error.message.includes('quota')
      ) {
        return {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Gemini API rate limit exceeded. Please try again later.',
          retryable: true,
          retryAfter: 60,
          statusCode: 429,
        };
      }

      // Auth error
      if (
        error.message.includes('UNAUTHENTICATED') ||
        error.message.includes('401') ||
        error.message.includes('API key')
      ) {
        return {
          code: 'AUTH_ERROR',
          message: 'Invalid Gemini API key or authentication failed.',
          retryable: false,
          statusCode: 401,
        };
      }

      // Permission error
      if (error.message.includes('PERMISSION_DENIED')) {
        return {
          code: 'PERMISSION_ERROR',
          message: 'Permission denied. Check API key and project permissions.',
          retryable: false,
          statusCode: 403,
        };
      }

      // Server error
      if (
        error.message.includes('INTERNAL') ||
        error.message.includes('500') ||
        error.message.includes('503')
      ) {
        return {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Gemini API service is temporarily unavailable.',
          retryable: true,
          retryAfter: 30,
          statusCode: 503,
        };
      }

      // Bad request
      if (
        error.message.includes('INVALID_ARGUMENT') ||
        error.message.includes('400')
      ) {
        return {
          code: 'INVALID_REQUEST',
          message: 'Invalid request. Check prompt and parameters.',
          retryable: false,
          statusCode: 400,
        };
      }

      // Content policy error
      if (
        error.message.includes('BLOCKED') ||
        error.message.includes('policy')
      ) {
        return {
          code: 'CONTENT_BLOCKED',
          message:
            'Request blocked by safety policies. Try with different content.',
          retryable: false,
          statusCode: 400,
        };
      }
    }

    // Handle network errors
    if (
      error.code === 'ECONNREFUSED' ||
      error.code === 'ENOTFOUND' ||
      error.message?.includes('ECONNREFUSED')
    ) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to Gemini API. Please try again.',
        retryable: true,
        retryAfter: 10,
        statusCode: 503,
      };
    }

    // Handle timeout errors
    if (error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      return {
        code: 'TIMEOUT_ERROR',
        message: 'Request to Gemini API timed out. Please try again.',
        retryable: true,
        retryAfter: 15,
        statusCode: 504,
      };
    }

    // Default error
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred.',
      retryable: false,
      statusCode: 500,
    };
  }

  static isRetryable(error: AiErrorDetails): boolean {
    return error.retryable;
  }

  static getRetryAfter(error: AiErrorDetails): number {
    return error.retryAfter || 60;
  }
}
