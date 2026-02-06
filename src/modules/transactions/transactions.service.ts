import { ICrudService } from "../../common/base/interfaces/service";
import { Transaction } from "./transactions.entity";
import { TransactionRepository } from "./transactions.repository";
export class TransactionService implements ICrudService<Transaction> {
    private transactionRepo: TransactionRepository;

    constructor() {
        this.transactionRepo = new TransactionRepository();
    }

    async create(data: Partial<Transaction>): Promise<Transaction> {
        return this.transactionRepo.create(data);
    }

    async findAll(): Promise<Transaction[]> {
        return this.transactionRepo.findAll();
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

}