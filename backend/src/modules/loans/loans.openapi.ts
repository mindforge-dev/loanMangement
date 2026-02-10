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

const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
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
    summary: "Get loans (paginated + filterable)",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "page",
        in: "query",
        required: false,
        schema: { type: "integer", minimum: 1, default: 1 },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
      },
      {
        name: "status",
        in: "query",
        required: false,
        schema: { type: "string", enum: Object.values(LoanStatus) },
      },
      {
        name: "status_in",
        in: "query",
        required: false,
        description: "Comma-separated statuses (e.g. ACTIVE,COMPLETED)",
        schema: { type: "string" },
      },
      {
        name: "loan_type",
        in: "query",
        required: false,
        schema: { type: "string", enum: Object.values(LoanType) },
      },
      {
        name: "loan_type_in",
        in: "query",
        required: false,
        description: "Comma-separated loan types (e.g. PERSONAL,HOME)",
        schema: { type: "string" },
      },
      {
        name: "borrower_full_name",
        in: "query",
        required: false,
        description: "Partial match on borrower full name",
        schema: { type: "string" },
      },
      {
        name: "interest_rate_id",
        in: "query",
        required: false,
        schema: { type: "string", format: "uuid" },
      },
      {
        name: "principal_amount_gte",
        in: "query",
        required: false,
        schema: { type: "number" },
      },
      {
        name: "principal_amount_lte",
        in: "query",
        required: false,
        schema: { type: "number" },
      },
      {
        name: "current_balance_gte",
        in: "query",
        required: false,
        schema: { type: "number" },
      },
      {
        name: "current_balance_lte",
        in: "query",
        required: false,
        schema: { type: "number" },
      },
      {
        name: "term_months_gte",
        in: "query",
        required: false,
        schema: { type: "integer" },
      },
      {
        name: "term_months_lte",
        in: "query",
        required: false,
        schema: { type: "integer" },
      },
      {
        name: "start_date_gte",
        in: "query",
        required: false,
        schema: { type: "string", format: "date" },
      },
      {
        name: "start_date_lte",
        in: "query",
        required: false,
        schema: { type: "string", format: "date" },
      },
      {
        name: "end_date_gte",
        in: "query",
        required: false,
        schema: { type: "string", format: "date" },
      },
      {
        name: "end_date_lte",
        in: "query",
        required: false,
        schema: { type: "string", format: "date" },
      },
    ],
    responses: {
      200: {
        description: "Paginated list of loans",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              statusCode: z.number(),
              message: z.string(),
              data: z.array(LoanResponseSchema),
              meta: PaginationMetaSchema,
              timestamp: z.string(),
            }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/dashboard/loans/borrower/{borrowerName}",
    tags: ["Loans"],
    summary: "Get loans by borrower name",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "borrowerName",
        in: "path",
        required: true,
        schema: { type: "string" },
      },
    ],
    responses: {
      200: {
        description: "Loan list filtered by borrower name",
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

  registry.registerPath({
    method: "put",
    path: "/dashboard/loans/{id}",
    tags: ["Loans"],
    summary: "Update loan (Admin only)",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              interest_rate_id: z.string().uuid().optional(),
              principal_amount: z.number().optional(),
              loan_type: z.string().optional(),
              start_date: z.string().optional(),
              end_date: z.string().optional(),
              term_months: z.number().optional(),
              status: z.nativeEnum(LoanStatus).optional(),
              current_balance: z.number().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Loan updated",
        content: {
          "application/json": {
            schema: z.object({ data: LoanResponseSchema }),
          },
        },
      },
      404: { description: "Loan not found" },
    },
  });

  registry.registerPath({
    method: "patch",
    path: "/dashboard/loans/{id}/status",
    tags: ["Loans"],
    summary: "Update loan status (Admin only)",
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
      },
    ],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              status: z.nativeEnum(LoanStatus),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Loan status updated",
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
