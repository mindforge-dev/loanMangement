import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { borrowerController } from "./borrowers.controller";
import {
  CreateBorrowerSchema,
  UpdateBorrowerSchema,
} from "./borrowers.validators";
import { ModulePermission } from "../rbac/enums/permissions";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermissions(ModulePermission.BORROWERS_CREATE),
  validate(CreateBorrowerSchema),
  borrowerController.create,
);
router.get(
  "/",
  authenticate,
  checkPermissions(ModulePermission.BORROWERS_VIEW),
  borrowerController.findAll,
);
router.get(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.BORROWERS_VIEW),
  borrowerController.findById,
);
router.put(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.BORROWERS_EDIT),
  validate(UpdateBorrowerSchema),
  borrowerController.update,
);
router.delete(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.BORROWERS_DELETE),
  borrowerController.delete,
);

export default router;
