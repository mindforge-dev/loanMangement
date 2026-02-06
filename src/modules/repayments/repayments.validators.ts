import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CreateRepaymentSchema = z.object({
    body: z
        .object({
            loan_id: z.string().uuid().openapi({ example: "loan-uuid" }),
            payment_date: z.string().openapi({ example: "2024-02-01" }),
            amount_paid: z.number().positive().openapi({ example: 500.0 }),
            remaining_balance: z.number().openapi({ example: 9500.0 }),
            payment_term_months: z.number().int().positive().openapi({ example: 1 }),
            method: z.string().optional().openapi({ example: "Bank Transfer" }),
            note: z.string().optional().openapi({ example: "Monthly Installment" }),
        })
        .openapi("CreateRepaymentRequest"),
});

export const UpdateRepaymentSchema = z.object({
    body: z
        .object({
            payment_date: z.string().optional().openapi({ example: "2024-02-01" }),
            amount_paid: z.number().positive().optional().openapi({ example: 500.0 }),
            remaining_balance: z.number().optional().openapi({ example: 9500.0 }),
            payment_term_months: z.number().int().positive().optional().openapi({ example: 1 }),
            method: z.string().optional().openapi({ example: "Bank Transfer" }),
            note: z.string().optional().openapi({ example: "Monthly Installment" }),
        })
        .openapi("UpdateRepaymentRequest"),
});
