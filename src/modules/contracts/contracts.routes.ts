import { Router } from "express";
import multer from "multer";
import path from "path";
import { contractController } from "./contracts.controller";
import { validate } from "../../common/middleware/validate.middleware";
import { CreateContractSchema } from "./contracts.validators";
import { authenticate } from "../../common/middleware/auth.middleware";

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
    upload.single("file"),
    validate(CreateContractSchema),
    contractController.createWithFile
);

router.get("/loan/:loanId", contractController.getByLoan);

router.get("/:id/download", contractController.download);

export default router;
