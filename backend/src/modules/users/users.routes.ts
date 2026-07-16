import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { userController } from "./users.controller";
import { ModulePermission } from "../rbac/enums/permissions";
import {
    ManageUserRolesSchema,
    ManageUserPermissionsSchema,
    CreateRoleSchema,
    CreatePermissionSchema,
    CreateUserSchema,
} from "./users.validators";

const router = Router();

// Self
router.get("/me", authenticate, userController.getMe);
router.get("/me/permissions", authenticate, userController.mePermissions);

// Catalog (for role/permission management UI)
router.get(
    "/roles",
    authenticate,
    checkPermissions(ModulePermission.USERS_VIEW),
    userController.listRoles,
);
router.post(
    "/roles",
    authenticate,
    checkPermissions(ModulePermission.USERS_MANAGE),
    validate(CreateRoleSchema),
    userController.createRole,
);
router.get(
    "/permissions",
    authenticate,
    checkPermissions(ModulePermission.USERS_VIEW),
    userController.listPermissions,
);
router.post(
    "/permissions",
    authenticate,
    checkPermissions(ModulePermission.USERS_MANAGE),
    validate(CreatePermissionSchema),
    userController.createPermission,
);

// User management
router.get(
    "/",
    authenticate,
    checkPermissions(ModulePermission.USERS_VIEW),
    userController.getAll,
);
router.post(
    "/",
    authenticate,
    checkPermissions(ModulePermission.USERS_MANAGE),
    validate(CreateUserSchema),
    userController.createManual,
);

// Role / permission assignment (sync semantics — overwrites the set)
router.put(
    "/:id/roles",
    authenticate,
    checkPermissions(ModulePermission.USERS_MANAGE),
    validate(ManageUserRolesSchema),
    userController.assignRoles,
);
router.put(
    "/:id/permissions",
    authenticate,
    checkPermissions(ModulePermission.USERS_MANAGE),
    validate(ManageUserPermissionsSchema),
    userController.syncPermissions,
);

export default router;
