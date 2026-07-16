import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { UserRole } from '../users/user.entity';

extendZodWithOpenApi(z);

export const RegisterSchema = z.object({
    body: z.object({
        name: z.string().min(2).openapi({ example: 'John Doe' }),
        email: z.string().email().openapi({ example: 'john@example.com' }),
        password: z.string().min(6).openapi({ example: 'password123' }),
        role: z.nativeEnum(UserRole).optional().openapi({ example: UserRole.LOAN_OFFICER }),
    }).openapi('RegisterUserRequest'),
});

export const LoginSchema = z.object({
    body: z.object({
        email: z.string().email().openapi({ example: 'admin@mindforge.com' }),
        password: z.string().openapi({ example: 'admin123' }),
    }).openapi('LoginRequest'),
});
