import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';
import { logger } from '../utils/logger';

// Load .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  CLIENT_URL: z.string().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters long'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_SECRET: z.string().min(8).default('kalptaru_dev_jwt_refresh_secret_key_minimum_32_characters_random'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),
  SUPABASE_URL: z.string().min(1, 'SUPABASE_URL is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_STORAGE_BUCKET: z.string().default('kalptaru-media'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  logger.error('Invalid environment variables detected:');
  parsedEnv.error.issues.forEach((issue) => {
    logger.error(`  - [${issue.path.join('.')}] ${issue.message}`);
  });
  process.exit(1);
}

export const env = parsedEnv.data;
export type EnvConfig = z.infer<typeof envSchema>;
