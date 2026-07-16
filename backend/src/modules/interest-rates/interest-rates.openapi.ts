import { registry } from "../../config/openapi";
import { z } from "zod";

const InterestRateResponseSchema = z.object({
  id: z.string().uuid(),
  rate_percent: z.number(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

const PaginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const registerInterestRateDocs = () => {
  registry.registerPath({
    method: "post",
    path: "/dashboard/interest-rates",
    tags: ["Interest Rates"],
    summary: "Create a new interest rate (Admin only)",
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: z.object({
              rate_percent: z.number(),
              is_active: z.boolean().optional(),
            }),
          },
        },
      },
    },
    responses: {
      201: {
        description: "Interest rate created",
        content: {
          "application/json": {
            schema: z.object({ data: InterestRateResponseSchema }),
          },
        },
      },
    },
  });

  registry.registerPath({
    method: "get",
    path: "/dashboard/interest-rates",
    tags: ["Interest Rates"],
    summary: "Get interest rates (paginated)",
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
        description: "Paginated list of interest rates",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              statusCode: z.number(),
              message: z.string(),
              data: z.array(InterestRateResponseSchema),
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
    path: "/dashboard/interest-rates/{id}",
    tags: ["Interest Rates"],
    summary: "Get interest rate by ID",
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
        description: "Interest rate detail",
        content: {
          "application/json": {
            schema: z.object({ data: InterestRateResponseSchema }),
          },
        },
      },
      404: { description: "Interest rate not found" },
    },
  });

  registry.registerPath({
    method: "put",
    path: "/dashboard/interest-rates/{id}",
    tags: ["Interest Rates"],
    summary: "Update interest rate (Admin only)",
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
              rate_percent: z.number().optional(),
              is_active: z.boolean().optional(),
            }),
          },
        },
      },
    },
    responses: {
      200: {
        description: "Interest rate updated",
        content: {
          "application/json": {
            schema: z.object({ data: InterestRateResponseSchema }),
          },
        },
      },
      404: { description: "Interest rate not found" },
    },
  });

  registry.registerPath({
    method: "delete",
    path: "/dashboard/interest-rates/{id}",
    tags: ["Interest Rates"],
    summary: "Delete interest rate (Admin only)",
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
      204: { description: "Interest rate deleted" },
      403: { description: "Forbidden" },
      404: { description: "Interest rate not found" },
    },
  });
};
