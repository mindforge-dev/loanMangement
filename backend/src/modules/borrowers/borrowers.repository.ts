import { Borrower } from "./borrower.entity";
import { AppDataSource } from "../../config/datasource";
import { BaseRepository } from "../../common/base/baseRepository";

export class BorrowerRepository extends BaseRepository<Borrower> {
  constructor() {
    super(AppDataSource.getRepository(Borrower));
  }

  async findByEmail(email: string): Promise<Borrower | null> {
    return this.repo.findOne({ where: { email } });
  }
}

export const borrowerRepository = new BorrowerRepository();
