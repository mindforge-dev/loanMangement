import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const RegisterSchema = z.object({
    body: z.object({
        name: z.string().min(2).openapi({ example: 'John Doe' }),
        email: z.string().email().openapi({ example: 'john@example.com' }),
        password: z.string().min(6).openapi({ example: 'password123' }),
    }).openapi('RegisterUserRequest'),
});

export const LoginSchema = z.object({
    body: z.object({
        email: z.string().email().openapi({ example: 'admin@mindforge.com' }),
        password: z.string().openapi({ example: 'admin123' }),
    }).openapi('LoginRequest'),
});

export const RefreshSchema = z.object({
    body: z.object({
        refreshToken: z.string().openapi({ example: 'eyJhbGciOiJIUzI1NiIs...' }),
    }).openapi('RefreshTokenRequest'),
});
