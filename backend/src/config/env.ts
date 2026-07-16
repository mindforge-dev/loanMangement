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
    DB_SSL: z.enum(["true", "false"]).default("false"),
    DB_SSL_CERT: z.string().optional(), // path to CA cert, defaults to global-bundle.pem
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_ACCESS_EXPIRES_IN: z.string().default('30m'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    // MinIO / S3 — use AWS standard names so the same config works on real AWS in production
    AWS_REGION: z.string().default('us-east-1'),
    AWS_ACCESS_KEY_ID: z.string().default('minioadmin'),
    AWS_SECRET_ACCESS_KEY: z.string().default('minioadmin'),
    AWS_S3_BUCKET: z.string().default('loan-contracts'),
    // Override endpoint for local MinIO. Leave unset in production to use real AWS.
    AWS_S3_ENDPOINT: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('INVALID ENVIRONMENT VARIABLES:', _env.error.format());
    process.exit(1);
}

export const env = _env.data;
