import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import {
  FilterCondition,
  FilterFieldType,
  FilterDefinitions,
  ParsedFilters,
  FilterPrimitive,
  FilterOperator,
} from "../types/filteringCore";

const FILTER_SUFFIX_REGEX = /_(gte|lte|in)$/;

export class FilteringCore {
  parse<TField extends string>(
    rawQuery: Record<string, unknown>,
    definitions: FilterDefinitions<TField>,
  ): ParsedFilters<TField> {
    const conditions: Array<FilterCondition<TField>> = [];

    for (const [rawKey, rawValue] of Object.entries(rawQuery)) {
      const [fieldName, operator] = this.parseKey(rawKey);
      const field = fieldName as TField;
      const definition = definitions[field];
      if (!definition) {
        continue;
      }

      const allowedOperators = definition.operators ?? ["eq"];
      if (!allowedOperators.includes(operator)) {
        continue;
      }

      if (operator === "in") {
        const values = this.extractRawValues(rawValue)
          .flatMap((value) => value.split(","))
          .map((value) => value.trim())
          .filter((value) => value.length > 0)
          .map((value) => this.coerceValue(value, definition.type))
          .filter((value): value is FilterPrimitive => value !== undefined);

        if (values.length === 0) {
          continue;
        }

        conditions.push({ field, operator, value: values });
        continue;
      }

      const [firstValue] = this.extractRawValues(rawValue);
      if (!firstValue) {
        continue;
      }

      const coercedValue = this.coerceValue(firstValue, definition.type);
      if (coercedValue === undefined) {
        continue;
      }

      conditions.push({ field, operator, value: coercedValue });
    }

    return { conditions };
  }

  applyToQueryBuilder<T extends ObjectLiteral, TField extends string>(
    queryBuilder: SelectQueryBuilder<T>,
    alias: string,
    parsedFilters: ParsedFilters<TField>,
    definitions: FilterDefinitions<TField>,
  ): void {
    parsedFilters.conditions.forEach((condition, index) => {
      const definition = definitions[condition.field];
      if (!definition) {
        return;
      }

      const column = this.resolveColumn(alias, definition.column);
      const paramKey = `filter_${String(condition.field)}_${index}`;

      switch (condition.operator) {
        case "eq":
          if (
            definition.type === "string" &&
            definition.matchMode === "contains"
          ) {
            queryBuilder.andWhere(`LOWER(${column}) LIKE LOWER(:${paramKey})`, {
              [paramKey]: `%${String(condition.value)}%`,
            });
          } else {
            queryBuilder.andWhere(`${column} = :${paramKey}`, {
              [paramKey]: condition.value,
            });
          }
          break;
        case "in":
          queryBuilder.andWhere(`${column} IN (:...${paramKey})`, {
            [paramKey]: condition.value,
          });
          break;
        case "gte":
          queryBuilder.andWhere(`${column} >= :${paramKey}`, {
            [paramKey]: condition.value,
          });
          break;
        case "lte":
          queryBuilder.andWhere(`${column} <= :${paramKey}`, {
            [paramKey]: condition.value,
          });
          break;
      }
    });
  }

  private parseKey(rawKey: string): [string, FilterOperator] {
    const matchedSuffix = rawKey.match(FILTER_SUFFIX_REGEX);
    if (!matchedSuffix) {
      return [rawKey, "eq"];
    }

    const operator = matchedSuffix[1] as FilterOperator;
    const fieldName = rawKey.slice(0, rawKey.length - matchedSuffix[0].length);
    return [fieldName, operator];
  }

  private extractRawValues(value: unknown): string[] {
    if (Array.isArray(value)) {
      return value.flatMap((item) => this.extractRawValues(item));
    }

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return [String(value)];
    }

    return [];
  }

  private coerceValue(
    rawValue: string,
    type: FilterFieldType,
  ): FilterPrimitive | undefined {
    switch (type) {
      case "string":
        return rawValue;
      case "number": {
        const numberValue = Number(rawValue);
        return Number.isFinite(numberValue) ? numberValue : undefined;
      }
      case "boolean": {
        const normalized = rawValue.toLowerCase();
        if (normalized === "true" || normalized === "1") {
          return true;
        }
        if (normalized === "false" || normalized === "0") {
          return false;
        }
        return undefined;
      }
      case "date": {
        const dateValue = new Date(rawValue);
        return Number.isNaN(dateValue.getTime()) ? undefined : dateValue;
      }
      default:
        return undefined;
    }
  }

  private resolveColumn(alias: string, column: string): string {
    return column.includes(".") ? column : `${alias}.${column}`;
  }
}

export const filteringCore = new FilteringCore();
