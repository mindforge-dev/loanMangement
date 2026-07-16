import { Router } from "express";
import multer from "multer";
import path from "path";
import { contractController } from "./contracts.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { CreateContractSchema } from "./contracts.validators";
import { authenticate } from "../../common/middleware/auth.middleware";
import { checkPermissions } from "../../common/middleware/rbac.middleware";
import { ModulePermission } from "../rbac/enums/permissions";

const router = Router();

router.use(authenticate);

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ideally use absolute path or resolve relative to root
        cb(null, path.join(process.cwd(), "uploads/contracts"));
    },
    filename: (req, file, cb) => {
        // Unique filename: loanId-timestamp-origName
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.post(
    "/",
    checkPermissions(ModulePermission.CONTRACTS_CREATE),
    upload.single("file"),
    validate(CreateContractSchema),
    contractController.createWithFile
);

router.get("/loan/:loanId", checkPermissions(ModulePermission.CONTRACTS_VIEW), contractController.getByLoan);

router.get("/:id/download", checkPermissions(ModulePermission.CONTRACTS_DOWNLOAD), contractController.download);

export default router;
