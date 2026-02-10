export type FilterOperator = "eq" | "in" | "gte" | "lte";
export type FilterFieldType = "string" | "number" | "boolean" | "date";
export type FilterPrimitive = string | number | boolean | Date;

export type FilterFieldDefinition = {
  column: string;
  type: FilterFieldType;
  operators?: FilterOperator[];
  matchMode?: "exact" | "contains";
};

export type FilterDefinitions<TField extends string = string> = Record<
  TField,
  FilterFieldDefinition
>;

export type FilterCondition<TField extends string = string> = {
  field: TField;
  operator: FilterOperator;
  value: FilterPrimitive | FilterPrimitive[];
};

export type ParsedFilters<TField extends string = string> = {
  conditions: Array<FilterCondition<TField>>;
};
