import { loanRepository, LoanRepository } from "./loans.repository";
import { Loan } from "./loan.entity";
import { ICrudService } from "../../common/base/interfaces/service";
import { interestRateRepository } from "../interest-rates/interest-rates.repository";
import {
  PaginatedResult,
  PaginationParams,
} from "../../common/pagination/pagination.core";

export class LoanService implements ICrudService<Loan> {
  private loanRepo: LoanRepository;

  constructor() {
    this.loanRepo = loanRepository;
  }

  async create(data: Partial<Loan>): Promise<Loan> {
    // If interest rate is provided, calculate interest
    if (data.interest_rate_id) {
      const rate = await interestRateRepository.findById(data.interest_rate_id);
      if (rate) {
        data.interest_rate_snapshot = rate.rate_percent;

        if (data.principal_amount && data.term_months) {
          const principal = Number(data.principal_amount);
          const termYears = Number(data.term_months) / 12;
          const interest = principal * (Number(rate.rate_percent) / 100) * termYears;

          data.current_balance = principal + interest;
        }
      }
    }

    // Fallback: Initialize current_balance with principal_amount if still not set
    if (data.principal_amount && !data.current_balance) {
      data.current_balance = data.principal_amount;
    }

    return this.loanRepo.create(data);
  }

  async findAll(): Promise<Loan[]> {
    return this.loanRepo.findAll();
  }

  async findAllPaginated(
    pagination: PaginationParams,
  ): Promise<PaginatedResult<Loan>> {
    return this.loanRepo.findAllPaginated(pagination);
  }

  async findById(id: string): Promise<Loan | null> {
    return this.loanRepo.findByIdWithRelations(id);
  }

  async update(id: string, data: Partial<Loan>): Promise<Loan | null> {
    const shouldRecalculate =
      data.interest_rate_id !== undefined ||
      data.principal_amount !== undefined ||
      data.term_months !== undefined;

    let existingLoan: Loan | null = null;
    if (shouldRecalculate) {
      existingLoan = await this.loanRepo.findById(id);
    }

    if (data.interest_rate_id) {
      const rate = await interestRateRepository.findById(data.interest_rate_id);
      if (rate) {
        data.interest_rate_snapshot = rate.rate_percent;
      }
    }

    if (
      shouldRecalculate &&
      data.current_balance === undefined
    ) {
      const principalValue =
        data.principal_amount !== undefined
          ? data.principal_amount
          : existingLoan?.principal_amount;
      const termMonthsValue =
        data.term_months !== undefined
          ? data.term_months
          : existingLoan?.term_months;

      if (principalValue === undefined || termMonthsValue === undefined) {
        return this.loanRepo.update(id, data as any);
      }

      const principal = Number(principalValue);
      const termYears = Number(termMonthsValue) / 12;
      const ratePercent =
        data.interest_rate_snapshot !== undefined
          ? Number(data.interest_rate_snapshot)
          : existingLoan?.interest_rate_snapshot !== undefined
            ? Number(existingLoan.interest_rate_snapshot)
            : undefined;

      if (ratePercent !== undefined) {
        const interest = principal * (ratePercent / 100) * termYears;
        data.current_balance = principal + interest;
      } else {
        data.current_balance = principal;
      }
    }

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
