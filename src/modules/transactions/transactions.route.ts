import { Router } from "express";
import { transactionController } from "./transactions.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { CreateTransactionSchema, UpdateTransactionSchema, DeleteTransactionSchema } from "./transactions.validators";

const router = Router();

router.use(authenticate);

router.get("/", transactionController.findAll);
router.get("/:id", transactionController.findById);
router.post("/", validate(CreateTransactionSchema), transactionController.create);
router.put("/:id", validate(UpdateTransactionSchema), transactionController.update);
router.delete("/:id", validate(DeleteTransactionSchema), transactionController.delete);

export default router;