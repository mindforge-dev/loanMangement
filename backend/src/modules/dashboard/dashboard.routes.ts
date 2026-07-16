import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { ModulePermission } from "../rbac/enums/permissions";
import { getSummary } from "./dashboard.controller";

const router = Router();

router.get(
  "/",
  authenticate,
  checkPermissions(ModulePermission.DASHBOARD_VIEW),
  getSummary
);

export default router;
