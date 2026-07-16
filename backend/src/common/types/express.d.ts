import type { UserWithPermissions } from '../../modules/rbac/rbac.types';

declare module 'express-serve-static-core' {
    interface Request {
        user?: UserWithPermissions;
    }
}
