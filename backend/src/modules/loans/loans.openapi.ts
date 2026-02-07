import { registry } from "../../config/openapi";
import { z } from "zod";

import { LoanStatus, LoanType } from "./loan.entity";

const LoanResponseSchema = z.object({
  id: z.string().uuid(),
  borrower_id: z.string().uuid(),
  interest_rate_id: z.string().uuid(),
  principal_amount: z.number(),
  loan_type: z.nativeEnum(LoanType),
  start_date: z.string(),
  end_date: z.string(),
  term_months: z.number(),
  interest_rate_snapshot: z.number(),
  current_balance: z.number(),
  status: z.nativeEnum(LoanStatus),
  created_at: z.string(),
  updated_at: z.string(),
});

export const registerLoanDocs = () => {
  registry.registerPath({
    method: "post",
    path: "/dashboard/loans",
    tags: ["Loans"],
    summary: "Create a new loan",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              borrower_id: z.string().uuid(),
              interest_rate_id: z.string().uuid(),
              principal_amount: z.number(),
              loan_type: z.string(),
              start_date: z.string(),
              end_date: z.string(),
              term_months: z.number(),
              interest_rate_snapshot: z.number(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: "Loan created",
        content: {
          "application/json": {
            schema: z.object({ data: LoanResponseSchema }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/dashboard/loans",
    tags: ["Loans"],
    summary: "Get all loans",
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "List of loans",
        content: {
          "application/json": {
            schema: z.object({ data: z.array(LoanResponseSchema) }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/dashboard/loans/{id}",
    tags: ["Loans"],
    summary: "Get loan by ID",
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
        description: "Loan detail",
        content: {
          "application/json": {
            schema: z.object({ data: LoanResponseSchema }),
          },
        },
      },
      404: { description: "Loan not found" },
    },
  });
};
