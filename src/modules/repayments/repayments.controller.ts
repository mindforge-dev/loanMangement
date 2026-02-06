import { RepaymentService, repaymentService } from "./repayments.service";
import { BaseController } from "../../common/base/baseController";
import { Repayment } from "./repayment.entity";
import { Request, Response, NextFunction } from "express";

export class RepaymentController extends BaseController<Repayment> {
    constructor() {
        super(repaymentService);
    }

    getByLoan = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { loanId } = req.params;
            const repayments = await (this.service as RepaymentService).findByLoan(loanId);
            res.json({ data: repayments });
        } catch (error) {
            next(error);
        }
    };
}

export const repaymentController = new RepaymentController();
