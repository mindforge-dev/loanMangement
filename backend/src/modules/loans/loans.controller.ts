import { LoanService, loanService } from "./loans.service";
import { BaseController } from "../../common/base/baseController";
import { Loan } from "./loan.entity";
import { Request, Response, NextFunction } from "express";
import { PaginationCore } from "../../common/pagination/pagination.core";
import { ApiResponseTransformer } from "../../common/transformers/api-response.transformer";

export class LoanController extends BaseController<Loan> {
  constructor() {
    super(loanService);
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, limit } = PaginationCore.parse(
        req.query?.page,
        req.query?.limit,
      );
      const result = await (this.service as LoanService).findAllPaginated(
        { page, limit },
        req.query as Record<string, unknown>,
      );

      res.json(
        ApiResponseTransformer.paginated(
          result.data,
          result.meta,
          "Fetched successfully",
        ),
      );
    } catch (error) {
      next(error);
    }
  };

  getByBorrower = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { borrowerName } = req.params;
      const loans = await (this.service as LoanService).findByBorrowerName(
        borrowerName,
      );
      res.json({ data: loans });
    } catch (error) {
      next(error);
    }
  };
}

export const loanController = new LoanController();
