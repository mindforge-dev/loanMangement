import { BaseController } from "../../common/base/baseController";
import { Transaction } from "./transactions.entity";
import { TransactionService } from "./transactions.service";

class TransactionController extends BaseController<Transaction> {
    constructor() {
        super(new TransactionService());
    }
}

export const transactionController = new TransactionController();