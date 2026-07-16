import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CreateInterestRateSchema = z.object({
  body: z
    .object({
      rate_percent: z.number().min(0).max(100).openapi({ example: 12 }),
      is_active: z
        .boolean()
        .optional()
        .default(true)
        .openapi({ example: true }),
    })
    .openapi("CreateInterestRateRequest"),
});

export const UpdateInterestRateSchema = z.object({
  body: z
    .object({
      rate_percent: z
        .number()
        .min(0)
        .max(100)
        .optional()
        .openapi({ example: 15 }),
      is_active: z.boolean().optional().openapi({ example: false }),
    })
    .openapi("UpdateInterestRateRequest"),
});
