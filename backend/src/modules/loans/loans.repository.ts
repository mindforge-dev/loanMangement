import { Loan } from "./loan.entity";
import { AppDataSource } from "../../config/datasource";
import { BaseRepository } from "../../common/base/baseRepository";

export class LoanRepository extends BaseRepository<Loan> {
  constructor() {
    super(AppDataSource.getRepository(Loan));
  }

  async findByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.repo.find({
      where: { borrower_id: borrowerId },
      relations: ["borrower", "interest_rate"],
    });
  }

  async findByIdWithRelations(id: string): Promise<Loan | null> {
    return this.repo.findOne({
      where: { id } as any,
      relations: ["borrower", "interest_rate"],
    });
  }
}

export const loanRepository = new LoanRepository();
