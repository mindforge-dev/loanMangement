import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { loanController } from "./loans.controller";
import {
  CreateLoanSchema,
  UpdateLoanSchema,
  UpdateLoanStatusSchema,
} from "./loans.validators";
import { ModulePermission } from "../rbac/enums/permissions";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermissions(ModulePermission.LOANS_CREATE),
  validate(CreateLoanSchema),
  loanController.create,
);
router.get(
  "/",
  authenticate,
  checkPermissions(ModulePermission.LOANS_VIEW),
  loanController.findAll,
);
router.get(
  "/borrower/:borrowerName",
  authenticate,
  checkPermissions(ModulePermission.LOANS_VIEW),
  loanController.getByBorrower,
);
router.get(
  "/borrower/id/:borrowerId",
  authenticate,
  checkPermissions(ModulePermission.LOANS_VIEW),
  loanController.getByBorrowerId,
);
router.get(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.LOANS_VIEW),
  loanController.findById,
);
router.put(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.LOANS_EDIT),
  validate(UpdateLoanSchema),
  loanController.update,
);
router.patch(
  "/:id/status",
  authenticate,
  checkPermissions(ModulePermission.LOANS_UPDATE_STATUS),
  validate(UpdateLoanStatusSchema),
  loanController.update,
);
router.delete(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.LOANS_DELETE),
  loanController.delete,
);

export default router;
