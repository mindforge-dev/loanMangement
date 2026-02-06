import { repaymentRepository, RepaymentRepository } from "./repayments.repository";
import { Repayment } from "./repayment.entity";
import { ICrudService } from "../../common/base/interfaces/service";

export class RepaymentService implements ICrudService<Repayment> {
    private repaymentRepo: RepaymentRepository;

    constructor() {
        this.repaymentRepo = repaymentRepository;
    }

    async create(data: Partial<Repayment>): Promise<Repayment> {
        return this.repaymentRepo.create(data);
    }

    async findAll(): Promise<Repayment[]> {
        return this.repaymentRepo.findAll();
    }

    async findById(id: string): Promise<Repayment | null> {
        return this.repaymentRepo.findById(id);
    }

    async update(id: string, data: Partial<Repayment>): Promise<Repayment | null> {
        return this.repaymentRepo.update(id, data as any);
    }

    async delete(id: string): Promise<void> {
        return this.repaymentRepo.delete(id);
    }

    async findByLoan(loanId: string): Promise<Repayment[]> {
        return this.repaymentRepo.findByLoanId(loanId);
    }
}

export const repaymentService = new RepaymentService();
