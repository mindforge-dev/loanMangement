import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const CreateContractSchema = z.object({
    body: z.object({
        loan_id: z.string().uuid().openapi({ example: "loan-uuid" }),
        signing_date: z.string().openapi({ example: "2024-02-06" }),
    }),
});
