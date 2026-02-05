import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CreateBorrowerSchema = z.object({
  body: z
    .object({
      full_name: z.string().min(2).openapi({ example: "John Doe" }),
      phone: z.string().min(5).openapi({ example: "+1234567890" }),
      email: z.string().email().openapi({ example: "john@example.com" }),
      address: z
        .string()
        .min(5)
        .openapi({ example: "123 Main St, City, Country" }),
      nrc: z.string().min(5).openapi({ example: "12/ABC(N)123456" }),
    })
    .openapi("CreateBorrowerRequest"),
});

export const UpdateBorrowerSchema = z.object({
  body: z
    .object({
      full_name: z.string().min(2).optional().openapi({ example: "John Doe" }),
      phone: z.string().min(5).optional().openapi({ example: "+1234567890" }),
      email: z
        .string()
        .email()
        .optional()
        .openapi({ example: "john@example.com" }),
      address: z
        .string()
        .min(5)
        .optional()
        .openapi({ example: "123 Main St, City, Country" }),
      nrc: z.string().min(5).optional().openapi({ example: "12/ABC(N)123456" }),
    })
    .openapi("UpdateBorrowerRequest"),
});
