import { AppDataSource } from "../config/datasource";
import { User, UserRole } from "../modules/users/user.entity";
import { Borrower } from "../modules/borrowers/borrower.entity";
import { InterestRate } from "../modules/interest-rates/interest-rate.entity";
import { Loan, LoanStatus, LoanType } from "../modules/loans/loan.entity";
import { Transaction, TransactionType } from "../modules/transactions/transactions.entity";
import bcrypt from "bcryptjs";

async function seed() {
  try {
    console.log("Initializing data source...");
    AppDataSource.setOptions({ synchronize: false, dropSchema: false, logging: ["error"] });
    console.log(`Connecting to DB: Host=${process.env.DB_HOST}, Name=${process.env.DB_NAME}, Type=${AppDataSource.options.type}`);
    await AppDataSource.initialize();
    console.log("Data source initialized.");

    const userRepository = AppDataSource.getRepository(User);
    const borrowerRepository = AppDataSource.getRepository(Borrower);
    const interestRateRepository = AppDataSource.getRepository(InterestRate);

    // Seed Users
    console.log("Seeding users...");
    const adminEmail = "admin@mindforge.com";

    console.log("Checking for existing admin...");
    const existingAdmin = await userRepository.findOneBy({ email: adminEmail });
    console.log("Admin check result:", existingAdmin ? "Found" : "Not Found");

    if (!existingAdmin) {
      console.log("Hashing password...");
      const adminPassword = await bcrypt.hash("admin123", 10);
      console.log("Password hashed.");

      await userRepository.save({
        name: "System Admin",
        email: adminEmail,
        passwordHash: adminPassword,
        role: UserRole.ADMIN,
      });
      console.log("Admin user created.");
    } else {
      console.log("Admin user already exists.");
    }

    const officerEmail = "officer@mindforge.com";
    const existingOfficer = await userRepository.findOneBy({
      email: officerEmail,
    });

    if (!existingOfficer) {
      const officerPassword = await bcrypt.hash("officer123", 10);
      await userRepository.save({
        name: "Loan Officer One",
        email: officerEmail,
        passwordHash: officerPassword,
        role: UserRole.LOAN_OFFICER,
      });
      console.log("Loan Officer user created.");
    } else {
      console.log("Loan Officer user already exists.");
    }

    // Seed Borrowers
    console.log("Seeding borrowers...");
    const borrowersData = [
      {
        full_name: "John Doe",
        phone: "09123456789",
        email: "john.doe@example.com",
        address: "No. 123, Main Street, Yangon",
        nrc: "12/YAKANA(N)123456",
      },
      {
        full_name: "Jane Smith",
        phone: "09987654321",
        email: "jane.smith@example.com",
        address: "No. 456, Garden Road, Mandalay",
        nrc: "9/MAKANA(N)654321",
      },
      {
        full_name: "U Ba",
        phone: "09555443322",
        email: "u.ba@example.com",
        address: "No. 78, Market Road, Naypyidaw",
        nrc: "7/PAMANA(N)112233",
      },
    ];

    // Extra borrowers for pagination testing
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
      const existingBorrower = await borrowerRepository.findOneBy({
        email: borrower.email,
      });
      if (!existingBorrower) {
        await borrowerRepository.save(borrower);
        console.log(`Borrower ${borrower.full_name} created.`);
      } else {
        console.log(`Borrower ${borrower.full_name} already exists.`);
      }
    }

    // Seed Interest Rates
    console.log("Seeding interest rates...");
    const interestRatesData = [
      { rate_percent: 5, is_active: true },
      { rate_percent: 10, is_active: true },
      { rate_percent: 12, is_active: true },
      { rate_percent: 15, is_active: true },
      { rate_percent: 20, is_active: false },
    ];

    for (const rate of interestRatesData) {
      const existingRate = await interestRateRepository.findOneBy({
        rate_percent: rate.rate_percent,
      });
      if (!existingRate) {
        await interestRateRepository.save(rate);
        console.log(`Interest rate ${rate.rate_percent}% created.`);
      } else {
        console.log(`Interest rate ${rate.rate_percent}% already exists.`);
      }
    }

    // Seed Loans
    console.log("Seeding loans...");
    const loanRepository = AppDataSource.getRepository(Loan);
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const borrowers = await borrowerRepository.find();
    const activeInterestRates = await interestRateRepository.findBy({ is_active: true });

    if (borrowers.length > 0 && activeInterestRates.length > 0) {
      let seededLoanCount = 0;
      let firstLoan: Loan | null = null;

      for (let i = 0; i < borrowers.length; i++) {
        const borrower = borrowers[i];
        const existingLoan = await loanRepository.findOneBy({ borrower_id: borrower.id });

        if (existingLoan) {
          if (!firstLoan) {
            firstLoan = existingLoan;
          }
          continue;
        }

        const rate = activeInterestRates[i % activeInterestRates.length];
        const principalAmount = 1000000 + i * 150000;
        const termMonths = [6, 12, 18, 24][i % 4];
        const termYears = termMonths / 12;
        const interest = principalAmount * (Number(rate.rate_percent) / 100) * termYears;
        const currentBalance = principalAmount + interest;

        const loan = await loanRepository.save({
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

        if (!firstLoan) {
          firstLoan = loan;
        }
        seededLoanCount++;
      }

      console.log(`${seededLoanCount} loan(s) created for pagination testing.`);

      // Seed Transactions
      console.log("Seeding transactions...");
      if (!firstLoan) {
        console.log("Skipping transaction seeding: no loans available.");
        console.log("Seeding completed successfully.");
        process.exit(0);
      }

      const existingTransactions = await transactionRepository.findBy({ loan_id: firstLoan.id });

      if (existingTransactions.length === 0) {
        await transactionRepository.save([
          {
            loan_id: firstLoan.id,
            borrower_id: firstLoan.borrower_id,
            payment_date: new Date("2024-02-01"),
            amount_paid: 250000,
            remaining_balance: 4750000,
            payment_term_months: 1,
            type: TransactionType.REPAYMENT,
            method: "Bank Transfer",
            note: "First Installment"
          },
          {
            loan_id: firstLoan.id,
            borrower_id: firstLoan.borrower_id,
            payment_date: new Date("2024-03-01"),
            amount_paid: 250000,
            remaining_balance: 4500000,
            payment_term_months: 2,
            type: TransactionType.REPAYMENT,
            method: "Cash",
            note: "Second Installment"
          }
        ]);
        console.log(`Transactions for loan ${firstLoan.id} created.`);
      } else {
        console.log(`Transactions for loan ${firstLoan.id} already exist.`);
      }

    } else {
      console.log("Skipping loan seeding: No borrowers or interest rates found.");
    }

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
