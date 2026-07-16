import { z } from 'zod';
import { CreateUserSchema, LoginSchema } from './users.validators';

export type CreateUserDTO = z.infer<typeof CreateUserSchema>['body'];
export type LoginDTO = z.infer<typeof LoginSchema>['body'];
