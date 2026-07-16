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

export const CreateRoleSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Role name is required').openapi({ example: 'manager' }),
        permissions: z.array(z.string()).optional().openapi({ example: ['loans:view', 'loans:edit'] }),
    }).openapi('CreateRoleRequest'),
});

export const CreatePermissionSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Permission name is required').openapi({ example: 'loans:close' }),
    }).openapi('CreatePermissionRequest'),
});
