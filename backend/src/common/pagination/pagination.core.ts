import { PaginationMeta } from "../types/api-response";

export type PaginationParams = {
  page: number;
  limit: number;
};

export type PaginatedResult<T> = {
  data: T[];
  meta: PaginationMeta;
};

export class PaginationCore {
  static readonly DEFAULT_PAGE = 1;
  static readonly DEFAULT_LIMIT = 10;
  static readonly MAX_LIMIT = 100;

  static parse(rawPage: unknown, rawLimit: unknown): PaginationParams {
    const page = this.toPositiveInteger(rawPage, this.DEFAULT_PAGE);
    const limit = this.toPositiveInteger(rawLimit, this.DEFAULT_LIMIT);

    return {
      page,
      limit: Math.min(limit, this.MAX_LIMIT),
    };
  }

  static buildMeta(total: number, page: number, limit: number): PaginationMeta {
    return {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  private static toPositiveInteger(value: unknown, fallback: number): number {
    const numberValue = Number(value);

    if (!Number.isInteger(numberValue) || numberValue <= 0) {
      return fallback;
    }

    return numberValue;
  }
}
