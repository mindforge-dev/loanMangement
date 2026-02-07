import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { UserRole } from './user.entity';

extendZodWithOpenApi(z);

export const CreateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2).openapi({ example: 'Jane Doe' }),
        email: z.string().email().openapi({ example: 'jane@example.com' }),
        password: z.string().min(6).openapi({ example: 'securepass' }),
        role: z.nativeEnum(UserRole).optional().openapi({ example: UserRole.LOAN_OFFICER }),
    }).openapi('CreateUserRequest'),
});

export const LoginSchema = z.object({
    body: z.object({
        email: z.string().email().openapi({ example: 'jane@example.com' }),
        password: z.string().openapi({ example: 'securepass' }),
    }),
});
