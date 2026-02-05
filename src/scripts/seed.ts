import { AppDataSource } from "../config/datasource";
import { User, UserRole } from "../modules/users/user.entity";
import { Borrower } from "../modules/borrowers/borrower.entity";
import { InterestRate } from "../modules/interest-rates/interest-rate.entity";
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

    console.log("Seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
