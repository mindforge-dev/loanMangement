import { BaseController } from "../../common/base/baseController";
import { Contract } from "./contract.entity";
import { ContractService, contractService } from "./contracts.service";
import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";

class ContractController extends BaseController<Contract> {
    constructor() {
        super(contractService);
    }

    createWithFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;
            if (!file) {
                throw new Error("No file uploaded");
            }

            const { loan_id, signing_date } = req.body;

            // Ensure duplicates are handled or allowed; for now assuming naive append
            const contract = await (this.service as ContractService).create({
                loan_id,
                signing_date: new Date(signing_date),
                file_path: file.path,
                original_file_name: file.originalname,
                mime_type: file.mimetype,
                size: file.size,
            });

            res.status(201).json({ data: contract });
        } catch (error) {
            // Clean up file if db save fails
            if (req.file && req.file.path) {
                fs.unlink(req.file.path, () => { });
            }
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

    download = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const contract = await (this.service as ContractService).findById(id);

            if (!contract || !contract.file_path || !fs.existsSync(contract.file_path)) {
                res.status(404).json({ message: "File not found" });
                return;
            }

            res.download(contract.file_path, contract.original_file_name);
        } catch (error) {
            next(error);
        }
    };
}

export const contractController = new ContractController();
