import { BaseController } from "../../common/base/baseController";
import { Transaction } from "./transactions.entity";
import { TransactionService, transactionService } from "./transactions.service";
import { Request, Response, NextFunction } from "express";

class TransactionController extends BaseController<Transaction> {
    constructor() {
        super(transactionService);
    }

    getByLoan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { loanId } = req.params;
            const transactions = await (this.service as TransactionService).findByLoan(loanId);
            res.json({ data: transactions });
        } catch (error) {
            next(error);
        }
    };
}

export const transactionController = new TransactionController();