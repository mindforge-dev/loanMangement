import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { userController } from "./users.controller";
import { ModulePermission } from "../rbac/enums/permissions";
import {
    ManageUserRolesSchema,
    ManageUserPermissionsSchema,
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
router.get(
    "/permissions",
    authenticate,
    checkPermissions(ModulePermission.USERS_VIEW),
    userController.listPermissions,
);

// User management
router.get(
    "/",
    authenticate,
    checkPermissions(ModulePermission.USERS_VIEW),
    userController.getAll,
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
