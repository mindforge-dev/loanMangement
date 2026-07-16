import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/http-errors';
import { ModulePermission, SUPER_ADMIN_ROLE } from '../../modules/rbac/enums/permissions';

/**
 * Permission-based authorization middleware (Spatie-style).
 *
 * - Super-admin role bypasses all checks.
 * - If no permissions are required, any authenticated user is allowed
 *   (authentication is still enforced by the `authenticate` middleware).
 * - Otherwise the user must hold at least ONE of the required permissions.
 *   Effective permissions = union of role-permissions + direct user-permissions.
 */
export const checkPermissions =
    (...requiredPermissions: ModulePermission[]) =>
    (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return next(new ForbiddenError('User not found in request'));
        }

        if (user.roles.includes(SUPER_ADMIN_ROLE)) {
            return next();
        }

        if (requiredPermissions.length === 0) {
            return next();
        }

        const hasPermission = requiredPermissions.some((permission) =>
            user.permissions.includes(permission),
        );

        if (!hasPermission) {
            return next(
                new ForbiddenError(
                    `Required permissions: ${requiredPermissions.join(', ')}. ` +
                        `User has: ${
                            user.permissions.length > 0
                                ? user.permissions.join(', ')
                                : 'none'
                        }.`,
                ),
            );
        }

        next();
    };
