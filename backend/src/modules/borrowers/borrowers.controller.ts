import { BorrowerService, borrowerService } from "./borrowers.service";
import { BaseController } from "../../common/base/baseController";
import { Borrower } from "./borrower.entity";

export class BorrowerController extends BaseController<Borrower> {
  constructor() {
    super(borrowerService);
  }
}

export const borrowerController = new BorrowerController();
