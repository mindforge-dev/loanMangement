import { z } from 'zod';
import { UserRole } from '../users/user.entity';

export const RegisterSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.nativeEnum(UserRole).optional(),
    }),
});

export const LoginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});
