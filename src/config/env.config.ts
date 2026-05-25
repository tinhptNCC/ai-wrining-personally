import { config } from 'dotenv';

config();

export const ENV = {
  APP_PORT: process.env.APP_PORT ?? 3000,

  DATABASE: {
    HOST: process.env.DB_HOST,
    PORT: Number(process.env.DB_PORT),
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    DATABASE: process.env.DB_DATABASE,
  },

  COOKIE: {
    ACCESS_TOKEN_TIME: process.env.COOKIE_ACCESS_TOKEN_EXPIRATION_TIME,
    ACCESS_TOKEN_NAME: process.env.COOKIE_ACCESS_TOKEN_NAME,
  },

  JWT: {
    SECRET: process.env.JWT_SECRET,
    EXPIRES: process.env.JWT_EXPIRATION_TIME || '3600',
    COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'token',
  },

  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY || '',
    MODEL: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
    TEMPERATURE: Number(process.env.GEMINI_TEMPERATURE) || 0.4,
    MAX_TOKENS: Number(process.env.GEMINI_MAX_TOKENS) || 1300,
    DAILY_TOKEN_LIMIT: Number(process.env.DAILY_TOKEN_LIMIT) || 50000,
    TOKEN_BUFFER_PERCENT: Number(process.env.TOKEN_BUFFER_PERCENT) || 0.1,
  },

  OPENAI: {
    API_KEY: process.env.GEMINI_API_KEY || '',
    MODEL: process.env.GEMINI_MODEL || 'gpt-3.5-turbo',
    TEMPERATURE: Number(process.env.GEMINI_TEMPERATURE) || 0.4,
    MAX_TOKENS: Number(process.env.GEMINI_MAX_TOKENS) || 1300,
  },
};
