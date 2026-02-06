import { registry } from "../../config/openapi";
import { z } from "zod";

const RepaymentResponseSchema = z.object({
    id: z.string().uuid(),
    loan_id: z.string().uuid(),
    payment_date: z.string(),
    amount_paid: z.number(),
    remaining_balance: z.number(),
    payment_term_months: z.number(),
    method: z.string().optional(),
    note: z.string().optional(),
    created_at: z.string(),
});

export const registerRepaymentDocs = () => {
    registry.registerPath({
        method: "post",
        path: "/dashboard/repayments",
        tags: ["Repayments"],
        summary: "Create a new repayment",
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: z.object({
                            loan_id: z.string().uuid(),
                            payment_date: z.string(),
                            amount_paid: z.number(),
                            remaining_balance: z.number(),
                            payment_term_months: z.number(),
                            method: z.string().optional(),
                            note: z.string().optional(),
                        }),
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Repayment created",
                content: {
                    "application/json": {
                        schema: z.object({ data: RepaymentResponseSchema }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: "get",
        path: "/dashboard/repayments/loan/{loanId}",
        tags: ["Repayments"],
        summary: "Get repayments by Loan ID",
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: "loanId",
                in: "path",
                required: true,
                schema: { type: "string", format: "uuid" },
            },
        ],
        responses: {
            200: {
                description: "List of repayments",
                content: {
                    "application/json": {
                        schema: z.object({ data: z.array(RepaymentResponseSchema) }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: "get",
        path: "/dashboard/repayments/{id}",
        tags: ["Repayments"],
        summary: "Get repayment by ID",
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: "id",
                in: "path",
                required: true,
                schema: { type: "string", format: "uuid" },
            },
        ],
        responses: {
            200: {
                description: "Repayment detail",
                content: {
                    "application/json": {
                        schema: z.object({ data: RepaymentResponseSchema }),
                    },
                },
            },
            404: { description: "Repayment not found" },
        },
    });
};
