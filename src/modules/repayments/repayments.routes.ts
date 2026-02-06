import { Router } from "express";
import { repaymentController } from "./repayments.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { CreateRepaymentSchema, UpdateRepaymentSchema } from "./repayments.validators";

const router = Router();

router.post(
    "/",
    validate(CreateRepaymentSchema),
    repaymentController.create
);

router.get("/loan/:loanId", repaymentController.getByLoan);

router.get("/:id", repaymentController.findById);

router.put(
    "/:id",
    validate(UpdateRepaymentSchema),
    repaymentController.update
);

router.delete("/:id", repaymentController.delete);

export default router;
