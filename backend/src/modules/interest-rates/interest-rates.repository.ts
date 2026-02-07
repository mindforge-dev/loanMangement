import { InterestRate } from "./interest-rate.entity";
import { AppDataSource } from "../../config/datasource";
import { BaseRepository } from "../../common/base/baseRepository";

export class InterestRateRepository extends BaseRepository<InterestRate> {
  constructor() {
    super(AppDataSource.getRepository(InterestRate));
  }
}

export const interestRateRepository = new InterestRateRepository();
