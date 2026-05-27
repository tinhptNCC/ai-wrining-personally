import { ENV } from 'src/config/env.config';

export const BASE_URL_AI = 'https://openrouter.ai/api/v1';

export const CORS_OPTIONS = {
  origin: ENV.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
