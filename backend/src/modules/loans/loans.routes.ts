import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { loanController } from "./loans.controller";
import {
  CreateLoanSchema,
  UpdateLoanSchema,
  UpdateLoanStatusSchema,
} from "./loans.validators";
import { UserRole } from "../users/user.entity";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(CreateLoanSchema),
  loanController.create,
);
router.get("/", authenticate, loanController.findAll);
router.get("/:id", authenticate, loanController.findById);
router.get("/borrower/:borrowerName", authenticate, loanController.getByBorrower);
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(UpdateLoanSchema),
  loanController.update,
);
router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(UpdateLoanStatusSchema),
  loanController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  loanController.delete,
);

export default router;
