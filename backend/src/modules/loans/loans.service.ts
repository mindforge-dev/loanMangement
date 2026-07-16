import { loanRepository, LoanRepository } from "./loans.repository";
import { Loan } from "./loan.entity";
import { ICrudService } from "../../common/base/interfaces/service";
import { interestRateRepository } from "../interest-rates/interest-rates.repository";
import {
  PaginatedResult,
  PaginationCore,
  PaginationParams,
} from "../../common/pagination/pagination.core";
import {
  filteringCore,
  FilteringCore,
} from "../../common/filtering/filtering.core";
import { FilterDefinitions } from "../../common/types/filteringCore";
import { AppDataSource } from "../../config/datasource";

export class LoanService implements ICrudService<Loan> {
  private loanRepo: LoanRepository;
  private readonly filterCore: FilteringCore;
  private readonly loanFilters: FilterDefinitions<
    | "status"
    | "loan_type"
    | "borrower_full_name"
    | "interest_rate_id"
    | "principal_amount"
    | "current_balance"
    | "term_months"
    | "start_date"
    | "end_date"
  > = {
      status: { column: "status", type: "string", operators: ["eq", "in"] },
      loan_type: { column: "loan_type", type: "string", operators: ["eq", "in"] },
      borrower_full_name: {
        column: "borrower.full_name",
        type: "string",
        operators: ["eq"],
        matchMode: "contains",
      },
      interest_rate_id: {
        column: "interest_rate_id",
        type: "string",
        operators: ["eq"],
      },
      principal_amount: {
        column: "principal_amount",
        type: "number",
        operators: ["eq", "gte", "lte"],
      },
      current_balance: {
        column: "current_balance",
        type: "number",
        operators: ["eq", "gte", "lte"],
      },
      term_months: {
        column: "term_months",
        type: "number",
        operators: ["eq", "gte", "lte"],
      },
      start_date: {
        column: "start_date",
        type: "date",
        operators: ["eq", "gte", "lte"],
      },
      end_date: {
        column: "end_date",
        type: "date",
        operators: ["eq", "gte", "lte"],
      },
    };

  constructor(
    loanRepo: LoanRepository = loanRepository,
    filterCore: FilteringCore = filteringCore,
  ) {
    this.loanRepo = loanRepo;
    this.filterCore = filterCore;
  }
  async findAllPaginated(
    pagination: PaginationParams,
    rawFilters: Record<string, unknown> = {},
  ): Promise<PaginatedResult<Loan>> {
    const parsedFilters = this.filterCore.parse(rawFilters, this.loanFilters);
    if (parsedFilters.conditions.length === 0) {
      return this.loanRepo.findAllPaginated(pagination);
    }

    const { page, limit } = pagination;
    const queryBuilder = AppDataSource.getRepository(Loan)
      .createQueryBuilder("loan")
      .leftJoinAndSelect("loan.borrower", "borrower")
      .leftJoinAndSelect("loan.interest_rate", "interest_rate");

    this.filterCore.applyToQueryBuilder(
      queryBuilder,
      "loan",
      parsedFilters,
      this.loanFilters,
    );

    let [data, total] = await queryBuilder
      .orderBy("loan.created_at", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    const effectivePage = PaginationCore.clampPage(page, total, limit);

    if (effectivePage !== page) {
      [data, total] = await queryBuilder
        .orderBy("loan.created_at", "DESC")
        .skip((effectivePage - 1) * limit)
        .take(limit)
        .getManyAndCount();
    }

    return {
      data,
      meta: PaginationCore.buildMeta(total, effectivePage, limit),
    };
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
          const interest =
            principal * (Number(rate.rate_percent) / 100) * termYears;

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

    if (shouldRecalculate && data.current_balance === undefined) {
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

  async findByBorrowerName(borrowerName: string): Promise<Loan[]> {
    return this.loanRepo.findByBorrowerName(borrowerName);
  }

  async findByBorrowerId(borrowerId: string): Promise<Loan[]> {
    return this.loanRepo.findByBorrowerId(borrowerId);
  }
}

export const loanService = new LoanService();
