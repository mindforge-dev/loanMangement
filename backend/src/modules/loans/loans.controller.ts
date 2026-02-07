import { LoanService, loanService } from "./loans.service";
import { BaseController } from "../../common/base/baseController";
import { Loan } from "./loan.entity";
import { Request, Response, NextFunction } from "express";

export class LoanController extends BaseController<Loan> {
  constructor() {
    super(loanService);
  }

  getByBorrower = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { borrowerId } = req.params;
      const loans = await (this.service as LoanService).findByBorrower(
        borrowerId,
      );
      res.json({ data: loans });
    } catch (error) {
      next(error);
    }
  };
}

export const loanController = new LoanController();
