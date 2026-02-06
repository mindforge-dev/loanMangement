import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { LoanStatus, LoanType } from "./loan.entity";

extendZodWithOpenApi(z);

export const CreateLoanSchema = z.object({
  body: z
    .object({
      borrower_id: z.string().uuid().openapi({ example: "borrower-uuid" }),
      interest_rate_id: z
        .string()
        .uuid()
        .openapi({ example: "interest-rate-uuid" }),
      principal_amount: z.number().positive().openapi({ example: 10000.0 }),
      loan_type: z.nativeEnum(LoanType).openapi({ example: LoanType.PERSONAL }),
      start_date: z.string().openapi({ example: "2024-01-01" }),
      end_date: z.string().openapi({ example: "2025-01-01" }),
      term_months: z.number().int().positive().openapi({ example: 12 }),
      interest_rate_snapshot: z.number().openapi({ example: 12.5 }),
    })
    .openapi("CreateLoanRequest"),
});

export const UpdateLoanSchema = z.object({
  body: z
    .object({
      status: z
        .nativeEnum(LoanStatus)
        .optional()
        .openapi({ example: LoanStatus.ACTIVE }),
      current_balance: z.number().optional().openapi({ example: 9500.0 }),
    })
    .openapi("UpdateLoanRequest"),
});
