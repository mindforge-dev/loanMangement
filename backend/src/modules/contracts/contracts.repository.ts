import { BaseRepository } from "../../common/base/baseRepository";
import { Contract } from "./contract.entity";
import { AppDataSource } from "../../config/datasource";

export class ContractRepository extends BaseRepository<Contract> {
    constructor() {
        super(AppDataSource.getRepository(Contract));
    }

    async findByLoanId(loanId: string): Promise<Contract[]> {
        return this.repo.find({
            where: { loan_id: loanId } as any,
            order: { created_at: "DESC" },
        });
    }
}

export const contractRepository = new ContractRepository();
