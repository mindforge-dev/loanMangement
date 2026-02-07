import { z } from 'zod';
import { RegisterSchema, LoginSchema } from './auth.validators';

export type RegisterDTO = z.infer<typeof RegisterSchema>['body'];
export type LoginDTO = z.infer<typeof LoginSchema>['body'];
