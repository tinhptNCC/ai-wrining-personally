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

  OPENAI: {
    API_KEY: process.env.OPENAI_API_KEY,
  },
};
