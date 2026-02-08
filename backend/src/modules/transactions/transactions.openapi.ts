import { registry } from '../../config/openapi';
import { z } from 'zod';
import { CreateTransactionSchema, UpdateTransactionSchema } from './transactions.validators';

const TransactionResponseSchema = z.object({
    id: z.string().uuid(),
    loan_id: z.string().uuid(),
    borrower_id: z.string().uuid().nullable().optional(),
    payment_date: z.string(),
    type: z.string(),
    amount_paid: z.number(),
    remaining_balance: z.number(),
    payment_term_months: z.number(),
    method: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    created_at: z.string(),
});

const PaginationMetaSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
});

export const registerTransactionDocs = () => {
    registry.registerPath({
        method: 'get',
        path: '/dashboard/transactions',
        tags: ['Transactions'],
        summary: 'Get transactions (paginated)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: 'page',
                in: 'query',
                required: false,
                schema: { type: 'integer', minimum: 1, default: 1 },
            },
            {
                name: 'limit',
                in: 'query',
                required: false,
                schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
            },
        ],
        responses: {
            200: {
                description: 'Paginated list of transactions',
                content: {
                    'application/json': {
                        schema: z.object({
                            success: z.boolean(),
                            statusCode: z.number(),
                            message: z.string(),
                            data: z.array(TransactionResponseSchema),
                            meta: PaginationMetaSchema,
                            timestamp: z.string(),
                        }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'get',
        path: '/dashboard/transactions/{id}',
        tags: ['Transactions'],
        summary: 'Get transaction by ID',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: {
            200: {
                description: 'Transaction details',
                content: {
                    'application/json': {
                        schema: z.object({ data: TransactionResponseSchema }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'post',
        path: '/dashboard/transactions',
        tags: ['Transactions'],
        summary: 'Create a new transaction',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: CreateTransactionSchema.shape.body,
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Transaction created',
                content: {
                    'application/json': {
                        schema: z.object({ data: TransactionResponseSchema }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'put',
        path: '/dashboard/transactions/{id}',
        tags: ['Transactions'],
        summary: 'Update a transaction',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
            body: {
                content: {
                    'application/json': {
                        schema: UpdateTransactionSchema.shape.body,
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Transaction updated',
                content: {
                    'application/json': {
                        schema: z.object({ data: TransactionResponseSchema }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: 'delete',
        path: '/dashboard/transactions/{id}',
        tags: ['Transactions'],
        summary: 'Delete a transaction',
        security: [{ bearerAuth: [] }],
        request: {
            params: z.object({ id: z.string().uuid() }),
        },
        responses: {
            200: {
                description: 'Transaction deleted',
                content: {
                    'application/json': {
                        schema: z.object({ message: z.string() }),
                    },
                },
            },
        },
    });
};
