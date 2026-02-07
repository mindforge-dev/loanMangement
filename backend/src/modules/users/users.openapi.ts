import { registry } from '../../config/openapi';
import { z } from 'zod';

const UserResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: z.string(),
    createdAt: z.string(),
});

export const registerUserDocs = () => {
    registry.registerPath({
        method: 'get',
        path: '/dashboard/users/me',
        tags: ['Users'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'User profile',
                content: {
                    'application/json': {
                        schema: z.object({ data: UserResponseSchema }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/dashboard/users',
        tags: ['Users'],
        summary: 'Get all users (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'List of users',
                content: {
                    'application/json': {
                        schema: z.object({ data: z.array(UserResponseSchema) }),
                    },
                },
            },
            403: {
                description: 'Forbidden',
            },
        },
    });
};
