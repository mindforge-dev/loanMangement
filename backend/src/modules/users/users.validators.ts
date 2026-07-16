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

export const CreateUserSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters').openapi({ example: 'Jane Doe' }),
        email: z.string().email('Invalid email address').openapi({ example: 'jane@example.com' }),
        password: z.string().min(6, 'Password must be at least 6 characters').optional().openapi({ example: 'Secr3tP@ss' }),
        roles: z.array(z.string()).optional().openapi({ example: ['loan-officer'] }),
    }).openapi('CreateUserRequest'),
});
