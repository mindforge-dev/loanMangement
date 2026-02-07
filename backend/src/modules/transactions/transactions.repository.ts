import { BaseRepository } from "../../common/base/baseRepository";
import { Transaction } from "./transactions.entity";
import { AppDataSource } from "../../config/datasource";

export class TransactionRepository extends BaseRepository<Transaction> {
    constructor() {
        super(AppDataSource.getRepository(Transaction));
    }

    async findByLoanId(loanId: string): Promise<Transaction[]> {
        return this.repo.find({
            where: { loan_id: loanId } as any,
            order: { payment_date: "DESC" },
        });
    }
}

export const transactionRepository = new TransactionRepository();