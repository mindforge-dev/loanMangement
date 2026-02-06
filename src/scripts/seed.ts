import { AppDataSource } from "../config/datasource";
import { User, UserRole } from "../modules/users/user.entity";
import { Borrower } from "../modules/borrowers/borrower.entity";
import { InterestRate } from "../modules/interest-rates/interest-rate.entity";
import { Loan, LoanStatus, LoanType } from "../modules/loans/loan.entity";
import { Transaction } from "../modules/transactions/transactions.entity";
import bcrypt from "bcrypt";

async function seed() {
  try {
    console.log("Initializing data source...");
    await AppDataSource.initialize();
    console.log("Data source initialized.");

    const userRepository = AppDataSource.getRepository(User);
    const borrowerRepository = AppDataSource.getRepository(Borrower);
    const interestRateRepository = AppDataSource.getRepository(InterestRate);

    // Seed Users
    console.log("Seeding users...");
    const adminEmail = "admin@mindforge.com";
    const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash("admin123", 10);
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
    const interestRate = await interestRateRepository.findOneBy({ rate_percent: 10 });

    if (borrowers.length > 0 && interestRate) {
      const borrower = borrowers[0];

      const existingLoan = await loanRepository.findOneBy({ borrower_id: borrower.id });

      let loan: Loan;

      if (!existingLoan) {
        loan = await loanRepository.save({
          borrower_id: borrower.id,
          interest_rate_id: interestRate.id,
          principal_amount: 5000000,
          loan_type: LoanType.PERSONAL,
          start_date: new Date("2024-01-01"),
          end_date: new Date("2025-01-01"),
          term_months: 12,
          interest_rate_snapshot: interestRate.rate_percent,
          current_balance: 4500000,
          status: LoanStatus.ACTIVE
        });
        console.log(`Loan for ${borrower.full_name} created.`);
      } else {
        loan = existingLoan;
        console.log(`Loan for ${borrower.full_name} already exists.`);
      }

      // Seed Transactions
      console.log("Seeding transactions...");
      const existingTransactions = await transactionRepository.findBy({ loan_id: loan.id });

      if (existingTransactions.length === 0) {
        await transactionRepository.save([
          {
            loan_id: loan.id,
            payment_date: new Date("2024-02-01"),
            amount_paid: 250000,
            remaining_balance: 4750000,
            payment_term_months: 1,
            method: "Bank Transfer",
            note: "First Installment"
          },
          {
            loan_id: loan.id,
            payment_date: new Date("2024-03-01"),
            amount_paid: 250000,
            remaining_balance: 4500000,
            payment_term_months: 2,
            method: "Cash",
            note: "Second Installment"
          }
        ]);
        console.log(`Transactions for loan ${loan.id} created.`);
      } else {
        console.log(`Transactions for loan ${loan.id} already exist.`);
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
