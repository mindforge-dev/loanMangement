import { registry } from '../../config/openapi';
import { RegisterSchema, LoginSchema, RefreshSchema } from './auth.validators';

export const registerAuthDocs = () => {
    registry.registerPath({
        method: 'post',
        path: '/auth/register',
        tags: ['Auth'],
        summary: 'Register a new user',
        description:
            'Creates a user and assigns the default `loan-officer` role. ' +
            'The role cannot be set by the client. Returns access + refresh tokens.',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: RegisterSchema.shape.body,
                    },
                },
            },
        },
        responses: {
            201: { description: 'User created successfully' },
            400: { description: 'Validation error or user already exists' },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/auth/login',
        tags: ['Auth'],
        summary: 'Login user',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: LoginSchema.shape.body,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Login successful',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                data: {
                                    type: 'object',
                                    properties: {
                                        user: { type: 'object' },
                                        accessToken: { type: 'string' },
                                        refreshToken: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
            401: { description: 'Invalid credentials' },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/auth/refresh',
        tags: ['Auth'],
        summary: 'Refresh access token',
        description:
            'Exchange a valid refresh token for a new access/refresh token pair. ' +
            'The old refresh token is invalidated (rotation). Reuse of a revoked ' +
            'token revokes all of the user’s tokens.',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: RefreshSchema.shape.body,
                    },
                },
            },
        },
        responses: {
            200: { description: 'New token pair issued' },
            401: { description: 'Invalid, expired, or revoked refresh token' },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/auth/logout',
        tags: ['Auth'],
        summary: 'Logout (revoke refresh token)',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: RefreshSchema.shape.body,
                    },
                },
            },
        },
        responses: {
            204: { description: 'Successfully logged out' },
        },
    });
};
