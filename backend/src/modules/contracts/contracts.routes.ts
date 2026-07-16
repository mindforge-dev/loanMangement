import { Router } from "express";
import multer from "multer";
import { contractController } from "./contracts.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { CreateContractSchema } from "./contracts.validators";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { ModulePermission } from "../rbac/enums/permissions";

const router = Router();

router.use(authenticate);

// Use memory storage — files are uploaded directly to MinIO, no disk writes
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

router.post(
    "/",
    checkPermissions(ModulePermission.CONTRACTS_CREATE),
    upload.single("file"),
    validate(CreateContractSchema),
    contractController.createWithFile,
);

router.get(
    "/loan/:loanId",
    checkPermissions(ModulePermission.CONTRACTS_VIEW),
    contractController.getByLoan,
);

router.get(
    "/:id/download",
    checkPermissions(ModulePermission.CONTRACTS_DOWNLOAD),
    contractController.download,
);

export default router;
