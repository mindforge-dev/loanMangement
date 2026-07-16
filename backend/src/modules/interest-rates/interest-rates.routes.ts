import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { interestRateController } from "./interest-rates.controller";
import {
  CreateInterestRateSchema,
  UpdateInterestRateSchema,
} from "./interest-rates.validators";
import { UserRole } from "../users/user.entity";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(CreateInterestRateSchema),
  interestRateController.create,
);
router.get("/", authenticate, interestRateController.findAll);
router.get("/:id", authenticate, interestRateController.findById);
router.put(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  validate(UpdateInterestRateSchema),
  interestRateController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  interestRateController.delete,
);

export default router;
