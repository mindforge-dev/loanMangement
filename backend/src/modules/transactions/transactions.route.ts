import { Router } from "express";
import { transactionController } from "./transactions.controller";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { ModulePermission } from "../rbac/enums/permissions";
import { CreateTransactionSchema, UpdateTransactionSchema, DeleteTransactionSchema } from "./transactions.validators";

const router = Router();

router.use(authenticate);

router.get("/", checkPermissions(ModulePermission.TRANSACTIONS_VIEW), transactionController.findAll);
router.get("/loan/:loanId", checkPermissions(ModulePermission.TRANSACTIONS_VIEW), transactionController.getByLoan);
router.get("/:id", checkPermissions(ModulePermission.TRANSACTIONS_VIEW), transactionController.findById);
router.post("/", checkPermissions(ModulePermission.TRANSACTIONS_CREATE), validate(CreateTransactionSchema), transactionController.create);
router.put("/:id", checkPermissions(ModulePermission.TRANSACTIONS_EDIT), validate(UpdateTransactionSchema), transactionController.update);
router.delete("/:id", checkPermissions(ModulePermission.TRANSACTIONS_DELETE), validate(DeleteTransactionSchema), transactionController.delete);

export default router;
