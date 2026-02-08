import { ICrudService } from "../../common/base/interfaces/service";
import { Transaction, TransactionType } from "./transactions.entity";
import { transactionRepository, TransactionRepository } from "./transactions.repository";
import { AppDataSource } from "../../config/datasource";
import { Loan, LoanStatus } from "../loans/loan.entity";
import {
    PaginatedResult,
    PaginationParams,
} from "../../common/pagination/pagination.core";

export class TransactionService implements ICrudService<Transaction> {
    private transactionRepo: TransactionRepository;

    constructor() {
        this.transactionRepo = transactionRepository;
    }

    async create(data: Partial<Transaction>): Promise<Transaction> {
        return AppDataSource.transaction(async (transactionalEntityManager) => {
            if (!data.loan_id) {
                throw new Error("Loan ID is required");
            }

            const loan = await transactionalEntityManager.findOne(Loan, {
                where: { id: data.loan_id }
            });

            if (!loan) {
                throw new Error("Loan not found");
            }

            const amountPaid = Number(data.amount_paid) || 0;
            const currentBalance = Number(loan.current_balance);
            let newBalance = currentBalance;

            if (data.type === TransactionType.REPAYMENT || data.type === TransactionType.OTHER || !data.type) {
                newBalance = currentBalance - amountPaid;
                if (newBalance < 0) newBalance = 0;
            } else if (data.type === TransactionType.LATE_FEE || data.type === TransactionType.PENALTY) {
                newBalance = currentBalance + amountPaid;
            }

            loan.current_balance = newBalance;

            if (newBalance === 0 && (data.type === TransactionType.REPAYMENT || !data.type)) {
                loan.status = LoanStatus.COMPLETED;
            }

            await transactionalEntityManager.save(Loan, loan);

            const transaction = transactionalEntityManager.create(Transaction, {
                ...data,
                borrower_id: loan.borrower_id,
                remaining_balance: newBalance
            });

            return transactionalEntityManager.save(Transaction, transaction);
        });
    }

    async findAll(): Promise<Transaction[]> {
        return this.transactionRepo.findAllPaginated({ page: 1, limit: 1000 }).then(result => result.data);
    }

    async findAllPaginated(
        pagination: PaginationParams,
    ): Promise<PaginatedResult<Transaction>> {
        return this.transactionRepo.findAllPaginated(pagination);
    }

    async findById(id: string): Promise<Transaction | null> {
        return this.transactionRepo.findById(id);
    }

    async update(id: string, data: Partial<Transaction>): Promise<Transaction | null> {
        return this.transactionRepo.update(id, data as any);
    }

    async delete(id: string): Promise<void> {
        return this.transactionRepo.delete(id);
    }

    async findByLoan(loanId: string): Promise<Transaction[]> {
        return this.transactionRepo.findByLoanId(loanId);
    }
}

export const transactionService = new TransactionService();
