import { AppDataSource } from "../config/datasource";
import { User } from "../modules/users/user.entity";
import { Role } from "../modules/rbac/entities/role.entity";
import { Permission } from "../modules/rbac/entities/permission.entity";
import { ModulePermission, SUPER_ADMIN_ROLE } from "../modules/rbac/enums/permissions";
import { Borrower } from "../modules/borrowers/borrower.entity";
import { InterestRate } from "../modules/interest-rates/interest-rate.entity";
import { Loan, LoanStatus, LoanType } from "../modules/loans/loan.entity";
import { Transaction, TransactionType } from "../modules/transactions/transactions.entity";
import { authService } from "../modules/auth/auth.service";
import bcrypt from "bcryptjs";

const ALL_PERMISSIONS = Object.values(ModulePermission);

// Role -> permissions mapping (super-admin bypasses everything, so no perms needed)
const ROLE_PERMISSIONS: Record<string, ModulePermission[]> = {
  admin: ALL_PERMISSIONS,
  "loan-officer": [
    ModulePermission.DASHBOARD_VIEW,
    ModulePermission.PROFILE_VIEW,
    ModulePermission.BORROWERS_VIEW,
    ModulePermission.BORROWERS_CREATE,
    ModulePermission.BORROWERS_EDIT,
    ModulePermission.LOANS_VIEW,
    ModulePermission.LOANS_CREATE,
    ModulePermission.LOANS_EDIT,
    ModulePermission.LOANS_UPDATE_STATUS,
    ModulePermission.TRANSACTIONS_VIEW,
    ModulePermission.TRANSACTIONS_CREATE,
    ModulePermission.TRANSACTIONS_EDIT,
    ModulePermission.CONTRACTS_VIEW,
    ModulePermission.CONTRACTS_CREATE,
    ModulePermission.CONTRACTS_DOWNLOAD,
    ModulePermission.INTEREST_RATES_VIEW,
  ],
};

const SEED_USERS = [
  { name: "Super Admin", email: "superadmin@mindforge.com", password: "superadmin123", roles: [SUPER_ADMIN_ROLE] },
  { name: "System Admin", email: "admin@mindforge.com", password: "admin123", roles: ["admin"] },
  { name: "Loan Officer", email: "officer@mindforge.com", password: "officer123", roles: ["loan-officer"] },
];

async function seed() {
  try {
    console.log("Initializing data source...");
    AppDataSource.setOptions({ synchronize: true, dropSchema: false, logging: ["error"] });
    await AppDataSource.initialize();
    console.log("Data source initialized.");

    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);
    const permRepo = AppDataSource.getRepository(Permission);
    const borrowerRepo = AppDataSource.getRepository(Borrower);
    const interestRateRepo = AppDataSource.getRepository(InterestRate);
    const loanRepo = AppDataSource.getRepository(Loan);
    const transactionRepo = AppDataSource.getRepository(Transaction);

    // ── Permissions ──
    console.log("Seeding permissions...");
    for (const name of ALL_PERMISSIONS) {
      const existing = await permRepo.findOneBy({ name });
      if (!existing) {
        await permRepo.save({ name });
        console.log(`Permission '${name}' created.`);
      }
    }

    // ── Roles + role permissions ──
    console.log("Seeding roles...");
    const roleNames = [SUPER_ADMIN_ROLE, ...Object.keys(ROLE_PERMISSIONS)];
    for (const name of roleNames) {
      let role = await roleRepo.findOne({ where: { name }, relations: ["permissions"] });
      if (!role) {
        role = roleRepo.create({ name });
        role = await roleRepo.save(role);
        console.log(`Role '${name}' created.`);
      }

      // super-admin gets no permissions (bypasses all checks)
      const perms = name === SUPER_ADMIN_ROLE ? [] : ROLE_PERMISSIONS[name] ?? [];
      const permEntities =
        perms.length > 0 ? await permRepo.find({ where: perms.map((p) => ({ name: p })) }) : [];
      role.permissions = permEntities;
      await roleRepo.save(role);
    }

    // ── Users ──
    console.log("Seeding users...");
    for (const u of SEED_USERS) {
      let user = await userRepo.findOneBy({ email: u.email });
      if (!user) {
        const passwordHash = await bcrypt.hash(u.password, 10);
        user = await userRepo.save({ name: u.name, email: u.email, passwordHash });
        console.log(`User '${u.email}' created.`);
      }
      // Ensure the user has the intended roles (sync)
      await authService.assignRoles(user.id, u.roles);
    }

    // ── Borrowers ──
    console.log("Seeding borrowers...");
    const borrowersData = [
      { full_name: "John Doe", phone: "09123456789", email: "john.doe@example.com", address: "No. 123, Main Street, Yangon", nrc: "12/YAKANA(N)123456" },
      { full_name: "Jane Smith", phone: "09987654321", email: "jane.smith@example.com", address: "No. 456, Garden Road, Mandalay", nrc: "9/MAKANA(N)654321" },
      { full_name: "U Ba", phone: "09555443322", email: "u.ba@example.com", address: "No. 78, Market Road, Naypyidaw", nrc: "7/PAMANA(N)112233" },
    ];
    for (let i = 1; i <= 30; i++) {
      borrowersData.push({
        full_name: `Pagination Borrower ${i}`,
        phone: `09111${String(i).padStart(5, "0")}`,
        email: `pagination.borrower${i}@example.com`,
        address: `No. ${100 + i}, Pagination Street, Yangon`,
        nrc: `12/PAGINA(N)${String(i).padStart(6, "0")}`,
      });
    }
    for (const borrower of borrowersData) {
      const existingBorrower = await borrowerRepo.findOneBy({ email: borrower.email });
      if (!existingBorrower) {
        await borrowerRepo.save(borrower);
      }
    }
    console.log(`${borrowersData.length} borrowers ensured.`);

    // ── Interest rates ──
    console.log("Seeding interest rates...");
    const interestRatesData = [
      { rate_percent: 5, is_active: true },
      { rate_percent: 10, is_active: true },
      { rate_percent: 12, is_active: true },
      { rate_percent: 15, is_active: true },
      { rate_percent: 20, is_active: false },
    ];
    for (const rate of interestRatesData) {
      const existingRate = await interestRateRepo.findOneBy({ rate_percent: rate.rate_percent });
      if (!existingRate) {
        await interestRateRepo.save(rate);
      }
    }
    console.log(`${interestRatesData.length} interest rates ensured.`);

    // ── Loans ──
    console.log("Seeding loans...");
    const borrowers = await borrowerRepo.find();
    const activeInterestRates = await interestRateRepo.findBy({ is_active: true });

    let firstLoan: Loan | null = null;
    if (borrowers.length > 0 && activeInterestRates.length > 0) {
      let seededLoanCount = 0;
      for (let i = 0; i < borrowers.length; i++) {
        const borrower = borrowers[i];
        const existingLoan = await loanRepo.findOneBy({ borrower_id: borrower.id });
        if (existingLoan) {
          if (!firstLoan) firstLoan = existingLoan;
          continue;
        }
        const rate = activeInterestRates[i % activeInterestRates.length];
        const principalAmount = 1000000 + i * 150000;
        const termMonths = [6, 12, 18, 24][i % 4];
        const termYears = termMonths / 12;
        const interest = principalAmount * (Number(rate.rate_percent) / 100) * termYears;
        const currentBalance = principalAmount + interest;

        const loan = await loanRepo.save({
          borrower_id: borrower.id,
          interest_rate_id: rate.id,
          principal_amount: principalAmount,
          loan_type: Object.values(LoanType)[i % Object.values(LoanType).length],
          start_date: new Date(`2024-${String((i % 12) + 1).padStart(2, "0")}-01`),
          end_date: new Date(`2025-${String((i % 12) + 1).padStart(2, "0")}-01`),
          term_months: termMonths,
          interest_rate_snapshot: rate.rate_percent,
          current_balance: currentBalance,
          status: i % 5 === 0 ? LoanStatus.PENDING : LoanStatus.ACTIVE,
        });
        if (!firstLoan) firstLoan = loan;
        seededLoanCount++;
      }
      console.log(`${seededLoanCount} loan(s) created.`);

      // ── Transactions ──
      if (firstLoan) {
        const existingTransactions = await transactionRepo.findBy({ loan_id: firstLoan.id });
        if (existingTransactions.length === 0) {
          await transactionRepo.save([
            { loan_id: firstLoan.id, borrower_id: firstLoan.borrower_id, payment_date: new Date("2024-02-01"), amount_paid: 250000, remaining_balance: 4750000, payment_term_months: 1, type: TransactionType.REPAYMENT, method: "Bank Transfer", note: "First Installment" },
            { loan_id: firstLoan.id, borrower_id: firstLoan.borrower_id, payment_date: new Date("2024-03-01"), amount_paid: 250000, remaining_balance: 4500000, payment_term_months: 2, type: TransactionType.REPAYMENT, method: "Cash", note: "Second Installment" },
          ]);
          console.log(`Transactions for loan ${firstLoan.id} created.`);
        }
      }
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
