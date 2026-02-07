import { Router } from "express";
import { authenticate } from "../../common/middleware/auth.middleware";
import { authorize } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { borrowerController } from "./borrowers.controller";
import {
  CreateBorrowerSchema,
  UpdateBorrowerSchema,
} from "./borrowers.validators";
import { UserRole } from "../users/user.entity";

const router = Router();

router.post(
  "/",
  authenticate,
  validate(CreateBorrowerSchema),
  borrowerController.create,
);
router.get("/", authenticate, borrowerController.findAll);
router.get("/:id", authenticate, borrowerController.findById);
router.put(
  "/:id",
  authenticate,
  validate(UpdateBorrowerSchema),
  borrowerController.update,
);
router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  borrowerController.delete,
);

export default router;
