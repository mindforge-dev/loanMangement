import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const CreateTransactionSchema = z.object({
    body: z.object({
        loan_id: z.string().uuid().openapi({ example: '123e4567-e89b-12d3-a456-426614174000' }),
        payment_date: z.string().datetime().or(z.date()).transform((val) => new Date(val)).openapi({ example: '2023-10-27T00:00:00Z' }),
        amount_paid: z.number().positive().openapi({ example: 500.00 }),
        remaining_balance: z.number().nonnegative().openapi({ example: 1000.00 }),
        payment_term_months: z.number().int().positive().openapi({ example: 12 }),
        method: z.string().optional().openapi({ example: 'Bank Transfer' }),
        note: z.string().optional().openapi({ example: 'Monthly installment' }),
    }).openapi('CreateTransactionRequest'),
});

export const UpdateTransactionSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
    body: z.object({
        payment_date: z.string().datetime().or(z.date()).optional().transform((val) => val ? new Date(val) : undefined).openapi({ example: '2023-10-27T00:00:00Z' }),
        amount_paid: z.number().positive().optional().openapi({ example: 500.00 }),
        remaining_balance: z.number().nonnegative().optional().openapi({ example: 1000.00 }),
        payment_term_months: z.number().int().positive().optional().openapi({ example: 12 }),
        method: z.string().optional().openapi({ example: 'Bank Transfer' }),
        note: z.string().optional().openapi({ example: 'Monthly installment' }),
    }).openapi('UpdateTransactionRequest'),
});

export const DeleteTransactionSchema = z.object({
    params: z.object({
        id: z.string().uuid(),
    }),
});
