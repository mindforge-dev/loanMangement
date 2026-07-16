import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/http-errors";
import {
  ModulePermission,
  SUPER_ADMIN_ROLE,
} from "../../modules/rbac/enums/permissions";

export const checkPermissions =
  (...requiredPermissions: ModulePermission[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return next(new ForbiddenError("User not found in request"));
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
          `Required permissions: ${requiredPermissions.join(", ")}. ` +
            `User has: ${
              user.permissions.length > 0 ? user.permissions.join(", ") : "none"
            }.`,
        ),
      );
    }

    next();
  };
