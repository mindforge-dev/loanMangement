import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { interestRateController } from "./interest-rates.controller";
import {
  CreateInterestRateSchema,
  UpdateInterestRateSchema,
} from "./interest-rates.validators";
import { ModulePermission } from "../rbac/enums/permissions";

const router = Router();

router.post(
  "/",
  authenticate,
  checkPermissions(ModulePermission.INTEREST_RATES_CREATE),
  validate(CreateInterestRateSchema),
  interestRateController.create,
);
router.get(
  "/",
  authenticate,
  checkPermissions(ModulePermission.INTEREST_RATES_VIEW),
  interestRateController.findAll,
);
router.get(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.INTEREST_RATES_VIEW),
  interestRateController.findById,
);
router.put(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.INTEREST_RATES_EDIT),
  validate(UpdateInterestRateSchema),
  interestRateController.update,
);
router.delete(
  "/:id",
  authenticate,
  checkPermissions(ModulePermission.INTEREST_RATES_DELETE),
  interestRateController.delete,
);

export default router;
