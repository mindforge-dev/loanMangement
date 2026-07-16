import { z } from 'zod';
import { ManageUserRolesSchema, ManageUserPermissionsSchema } from './users.validators';

export type ManageUserRolesDTO = z.infer<typeof ManageUserRolesSchema>['body'];
export type ManageUserPermissionsDTO = z.infer<typeof ManageUserPermissionsSchema>['body'];
