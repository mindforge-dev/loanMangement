import { registry } from "../../config/openapi";
import { z } from "zod";

const ContractResponseSchema = z.object({
    id: z.string().uuid(),
    loan_id: z.string().uuid(),
    file_path: z.string(),
    original_file_name: z.string(),
    mime_type: z.string(),
    size: z.number(),
    signing_date: z.string(),
    created_at: z.string(),
});

export const registerContractDocs = () => {
    registry.registerPath({
        method: "post",
        path: "/dashboard/contracts",
        tags: ["Contracts"],
        summary: "Upload a contract",
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                content: {
                    "multipart/form-data": {
                        schema: z.object({
                            loan_id: z.string().uuid(),
                            signing_date: z.string(),
                            file: z.instanceof(File).openapi({ type: "string", format: "binary" }),
                        }),
                    },
                },
            },
        },
        responses: {
            201: {
                description: "Contract uploaded",
                content: {
                    "application/json": {
                        schema: z.object({ data: ContractResponseSchema }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: "get",
        path: "/dashboard/contracts/loan/{loanId}",
        tags: ["Contracts"],
        summary: "Get contracts by Loan ID",
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
                description: "List of contracts",
                content: {
                    "application/json": {
                        schema: z.object({ data: z.array(ContractResponseSchema) }),
                    },
                },
            },
        },
    });

    registry.registerPath({
        method: "get",
        path: "/dashboard/contracts/{id}/download",
        tags: ["Contracts"],
        summary: "Download contract file",
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
                description: "File stream",
                content: {
                    "application/octet-stream": {
                        schema: { type: "string", format: "binary" },
                    },
                },
            },
            404: { description: "File not found" },
        },
    });
};
