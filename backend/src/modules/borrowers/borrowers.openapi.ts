import { registry } from "../../config/openapi";
import { z } from "zod";

const BorrowerResponseSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string(),
  phone: z.string(),
  email: z.string().email(),
  address: z.string(),
  nrc: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const registerBorrowerDocs = () => {
  registry.registerPath({
    method: "post",
    path: "/dashboard/borrowers",
    tags: ["Borrowers"],
    summary: "Create a new borrower",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              full_name: z.string(),
              phone: z.string(),
              email: z.string(),
              address: z.string(),
              nrc: z.string(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: "Borrower created",
        content: {
          "application/json": {
            schema: z.object({ data: BorrowerResponseSchema }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/dashboard/borrowers",
    tags: ["Borrowers"],
    summary: "Get borrowers (paginated)",
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
    ],
    responses: {
      200: {
        description: "Paginated list of borrowers",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              statusCode: z.number(),
              message: z.string(),
              data: z.array(BorrowerResponseSchema),
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
    path: "/dashboard/borrowers/{id}",
    tags: ["Borrowers"],
    summary: "Get borrower by ID",
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
        description: "Borrower detail",
        content: {
          "application/json": {
            schema: z.object({ data: BorrowerResponseSchema }),
          },
        },
      },
      404: { description: "Borrower not found" },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/dashboard/borrowers/{id}",
    tags: ["Borrowers"],
    summary: "Update borrower",
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
              full_name: z.string().optional(),
              phone: z.string().optional(),
              email: z.string().optional(),
              address: z.string().optional(),
              nrc: z.string().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Borrower updated",
        content: {
          "application/json": {
            schema: z.object({ data: BorrowerResponseSchema }),
          },
        },
      },
      404: { description: "Borrower not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/dashboard/borrowers/{id}",
    tags: ["Borrowers"],
    summary: "Delete borrower (Admin only)",
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
      204: { description: "Borrower deleted" },
      403: { description: "Forbidden" },
      404: { description: "Borrower not found" },
    },
  });
};
