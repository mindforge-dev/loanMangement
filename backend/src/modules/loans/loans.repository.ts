import { Loan } from "./loan.entity";
import { AppDataSource } from "../../config/datasource";
import { BaseRepository } from "../../common/base/baseRepository";

export class LoanRepository extends BaseRepository<Loan> {
  constructor() {
    super(AppDataSource.getRepository(Loan));
  }

  async findByBorrowerName(borrowerName: string): Promise<Loan[]> {
    return this.repo
      .createQueryBuilder("loan")
      .leftJoinAndSelect("loan.borrower", "borrower")
      .leftJoinAndSelect("loan.interest_rate", "interest_rate")
      .where("LOWER(borrower.full_name) LIKE LOWER(:borrowerName)", {
        borrowerName: `%${borrowerName}%`,
      })
      .orderBy("loan.created_at", "DESC")
      .getMany();
  }

  async findByIdWithRelations(id: string): Promise<Loan | null> {
    return this.repo.findOne({
      where: { id } as any,
      relations: ["borrower", "interest_rate"],
    });
  }
}

export const loanRepository = new LoanRepository();
