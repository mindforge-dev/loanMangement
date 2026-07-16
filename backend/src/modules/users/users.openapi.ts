import { registry } from '../../config/openapi';
import { z } from 'zod';

const UserResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    roles: z.array(z.string()),
    permissions: z.array(z.string()),
});

export const registerUserDocs = () => {
    registry.registerPath({
        method: 'get',
        path: '/dashboard/users/me',
        tags: ['Users'],
        summary: 'Get current user profile (with roles & permissions)',
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
        path: '/dashboard/users/me/permissions',
        tags: ['Users'],
        summary: 'Get current user roles & permissions',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Roles & permissions',
                content: {
                    'application/json': {
                        schema: z.object({
                            data: z.object({
                                roles: z.array(z.string()),
                                permissions: z.array(z.string()),
                            }),
                        }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/dashboard/users',
        tags: ['Users'],
        summary: 'Get all users (users:view)',
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
            403: { description: 'Forbidden' },
        },
    });

    registry.registerPath({
        method: 'put',
        path: '/dashboard/users/{id}/roles',
        tags: ['Users'],
        summary: "Sync a user's roles (users:manage)",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: {
                content: {
                    'application/json': {
                        schema: z.object({ roles: z.array(z.string()) }),
                    },
                },
            },
        },
        responses: {
            200: { description: 'Roles updated', content: { 'application/json': { schema: z.object({ data: UserResponseSchema }) } } },
            403: { description: 'Forbidden' },
        },
    });

    registry.registerPath({
        method: 'put',
        path: '/dashboard/users/{id}/permissions',
        tags: ['Users'],
        summary: "Sync a user's direct permissions (users:manage)",
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: {
                content: {
                    'application/json': {
                        schema: z.object({ permissions: z.array(z.string()) }),
                    },
                },
            },
        },
        responses: {
            200: { description: 'Permissions updated', content: { 'application/json': { schema: z.object({ data: UserResponseSchema }) } } },
            403: { description: 'Forbidden' },
        },
    });
};
