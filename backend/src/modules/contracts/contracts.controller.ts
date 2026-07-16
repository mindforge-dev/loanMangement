import { BaseController } from "../../common/base/baseController";
import { Contract } from "./contract.entity";
import { ContractService, contractService } from "./contracts.service";
import { Request, Response, NextFunction } from "express";
import { uploadFile, getPresignedUrl } from "../../common/services/storage.service";

class ContractController extends BaseController<Contract> {
    constructor() {
        super(contractService);
    }

    createWithFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;
            if (!file) {
                res.status(400).json({ message: "No file uploaded" });
                return;
            }

            const { loan_id, signing_date } = req.body;

            const uploaded = await uploadFile(
                file.buffer,
                file.originalname,
                file.mimetype,
            );

            const contract = await (this.service as ContractService).create({
                loan_id,
                signing_date: new Date(signing_date),
                object_key: uploaded.objectKey,
                original_file_name: uploaded.originalFileName,
                mime_type: uploaded.mimeType,
                size: uploaded.size,
            });

            res.status(201).json({ data: contract });
        } catch (error) {
            next(error);
        }
    };

    getByLoan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { loanId } = req.params;
            const contracts = await (this.service as ContractService).findByLoan(loanId);
            res.json({ data: contracts });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Returns a short-lived (5 min) pre-signed URL + filename.
     * The frontend fetches the presigned URL as a blob in the background
     * and triggers a save-dialog — the browser never navigates to MinIO.
     */
    download = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const contract = await (this.service as ContractService).findById(id);

            if (!contract?.object_key) {
                res.status(404).json({ message: "Contract not found" });
                return;
            }

            const url = await getPresignedUrl(contract.object_key, 300);
            res.json({ url, filename: contract.original_file_name });
        } catch (error) {
            next(error);
        }
    };
}

export const contractController = new ContractController();
