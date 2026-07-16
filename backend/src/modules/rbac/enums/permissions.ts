export enum ModulePermission {
  // Users
  USERS_VIEW = "users:view",
  USERS_MANAGE = "users:manage",

  // Borrowers
  BORROWERS_VIEW = "borrowers:view",
  BORROWERS_CREATE = "borrowers:create",
  BORROWERS_EDIT = "borrowers:edit",
  BORROWERS_DELETE = "borrowers:delete",

  // Loans
  LOANS_VIEW = "loans:view",
  LOANS_CREATE = "loans:create",
  LOANS_EDIT = "loans:edit",
  LOANS_DELETE = "loans:delete",
  LOANS_UPDATE_STATUS = "loans:update-status",

  // Transactions
  TRANSACTIONS_VIEW = "transactions:view",
  TRANSACTIONS_CREATE = "transactions:create",
  TRANSACTIONS_EDIT = "transactions:edit",
  TRANSACTIONS_DELETE = "transactions:delete",

  // Interest rates
  INTEREST_RATES_VIEW = "interest-rates:view",
  INTEREST_RATES_CREATE = "interest-rates:create",
  INTEREST_RATES_EDIT = "interest-rates:edit",
  INTEREST_RATES_DELETE = "interest-rates:delete",

  // Contracts
  CONTRACTS_VIEW = "contracts:view",
  CONTRACTS_CREATE = "contracts:create",
  CONTRACTS_DOWNLOAD = "contracts:download",

  // Profile & Dashboard
  PROFILE_VIEW = "profile:view",
  DASHBOARD_VIEW = "dashboard:view",
}

export const SUPER_ADMIN_ROLE = "super-admin";

export const ALL_PERMISSIONS = Object.values(ModulePermission) as string[];
