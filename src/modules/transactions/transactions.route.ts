import { Router } from "express";
import { transactionController } from "./transactions.controller";

const router = Router();

router.get("/", transactionController.findAll);
router.get("/:id", transactionController.findById);
router.post("/", transactionController.create);
router.put("/:id", transactionController.update);
router.delete("/:id", transactionController.delete);

export default router;