import { BaseRepository } from "../../common/base/baseRepository";
import { Transaction } from "./transactions.entity";
import { AppDataSource } from "../../config/datasource";

export class TransactionRepository extends BaseRepository<Transaction> {
    constructor() {
        super(AppDataSource.getRepository(Transaction));
    }

}