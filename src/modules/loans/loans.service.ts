import { loanRepository, LoanRepository } from "./loans.repository";
import { Loan, LoanStatus } from "./loan.entity";
import { ICrudService } from "../../common/base/interfaces/service";

export class LoanService implements ICrudService<Loan> {
  private loanRepo: LoanRepository;

  constructor() {
    this.loanRepo = loanRepository;
  }

  async create(data: Partial<Loan>): Promise<Loan> {
    // Initialize current_balance with principal_amount if not provided
    if (data.principal_amount && !data.current_balance) {
      data.current_balance = data.principal_amount;
    }
    return this.loanRepo.create(data);
  }

  async findAll(): Promise<Loan[]> {
    return this.loanRepo.findAll();
  }

  async findById(id: string): Promise<Loan | null> {
    return this.loanRepo.findByIdWithRelations(id);
  }

  async update(id: string, data: Partial<Loan>): Promise<Loan | null> {
    return this.loanRepo.update(id, data as any);
  }

  async delete(id: string): Promise<void> {
    return this.loanRepo.delete(id);
  }

  async findByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.loanRepo.findByBorrower(borrowerId);
  }
}

export const loanService = new LoanService();
