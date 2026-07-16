import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('3000'),
    DB_HOST: z.string(),
    DB_PORT: z.string().default('5432'),
    DB_USER: z.string(),
    DB_PASS: z.string(),
    DB_NAME: z.string(),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string().default('30m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    JWT_EXPIRES_IN: z.string().default('1d'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('INVALID ENVIRONMENT VARIABLES:', _env.error.format());
    process.exit(1);
}

export const env = _env.data;
