import { registry } from '../../config/openapi';
import { RegisterSchema, LoginSchema } from './auth.validators';

export const registerAuthDocs = () => {
    registry.registerPath({
        method: 'post',
        path: '/auth/register',
        tags: ['Auth'],
        summary: 'Register a new user',
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
            201: {
                description: 'User created successfully',
            },
            400: {
                description: 'Validation error or User exists',
            },
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
                                        token: { type: 'string' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
};
