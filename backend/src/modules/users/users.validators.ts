import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const ManageUserRolesSchema = z.object({
    body: z.object({
        roles: z.array(z.string()).openapi({ example: ['loan-officer', 'admin'] }),
    }).openapi('ManageUserRolesRequest'),
});

export const ManageUserPermissionsSchema = z.object({
    body: z.object({
        permissions: z.array(z.string()).openapi({ example: ['loans:view', 'loans:create'] }),
    }).openapi('ManageUserPermissionsRequest'),
});
