import {
  interestRateRepository,
  InterestRateRepository,
} from "./interest-rates.repository";
import { InterestRate } from "./interest-rate.entity";
import { ICrudService } from "../../common/base/interfaces/service";
import {
  PaginatedResult,
  PaginationParams,
} from "../../common/pagination/pagination.core";

export class InterestRateService implements ICrudService<InterestRate> {
  private interestRateRepo: InterestRateRepository;

  constructor() {
    this.interestRateRepo = interestRateRepository;
  }

  async create(data: Partial<InterestRate>): Promise<InterestRate> {
    return this.interestRateRepo.create(data);
  }

  async findAll(): Promise<InterestRate[]> {
    return this.interestRateRepo.findAll();
  }

  async findAllPaginated(
    pagination: PaginationParams,
  ): Promise<PaginatedResult<InterestRate>> {
    return this.interestRateRepo.findAllPaginated(pagination);
  }

  async findById(id: string): Promise<InterestRate | null> {
    return this.interestRateRepo.findById(id);
  }

  async update(
    id: string,
    data: Partial<InterestRate>,
  ): Promise<InterestRate | null> {
    return this.interestRateRepo.update(id, data as any);
  }

  async delete(id: string): Promise<void> {
    return this.interestRateRepo.delete(id);
  }
}

export const interestRateService = new InterestRateService();
