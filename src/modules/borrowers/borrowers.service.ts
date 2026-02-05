import { borrowerRepository, BorrowerRepository } from "./borrowers.repository";
import { Borrower } from "./borrower.entity";
import { ICrudService } from "../../common/base/interfaces/service";

export class BorrowerService implements ICrudService<Borrower> {
  private borrowerRepo: BorrowerRepository;

  constructor() {
    this.borrowerRepo = borrowerRepository;
  }

  async create(data: Partial<Borrower>): Promise<Borrower> {
    return this.borrowerRepo.create(data);
  }

  async findAll(): Promise<Borrower[]> {
    return this.borrowerRepo.findAll();
  }

  async findById(id: string): Promise<Borrower | null> {
    return this.borrowerRepo.findById(id);
  }

  async update(id: string, data: Partial<Borrower>): Promise<Borrower | null> {
    return this.borrowerRepo.update(id, data as any);
  }

  async delete(id: string): Promise<void> {
    return this.borrowerRepo.delete(id);
  }
}

export const borrowerService = new BorrowerService();
