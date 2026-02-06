import { Repayment } from "./repayment.entity";
import { AppDataSource } from "../../config/datasource";
import { BaseRepository } from "../../common/base/baseRepository";

export class RepaymentRepository extends BaseRepository<Repayment> {
    constructor() {
        super(AppDataSource.getRepository(Repayment));
    }

    async findByLoanId(loanId: string): Promise<Repayment[]> {
        return this.repo.find({
            where: { loan_id: loanId } as any,
            order: { payment_date: "DESC" },
        });
    }
}

export const repaymentRepository = new RepaymentRepository();
