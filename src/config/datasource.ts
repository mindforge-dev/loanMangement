import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../modules/users/user.entity";
import { Borrower } from "../modules/borrowers/borrower.entity";
import { InterestRate } from "../modules/interest-rates/interest-rate.entity";
import { Loan } from "../modules/loans/loan.entity";

export const AppDataSource = new DataSource(
  env.NODE_ENV === "test"
    ? {
        type: "sqlite",
        database: ":memory:",
        synchronize: true,
        dropSchema: true,
        entities: [User, Borrower, InterestRate, Loan],
        logging: false,
      }
    : {
        type: "mysql",
        host: env.DB_HOST,
        port: parseInt(env.DB_PORT, 10),
        username: env.DB_USER,
        password: env.DB_PASS,
        database: env.DB_NAME,
        synchronize: env.NODE_ENV === "development",
        logging: env.NODE_ENV === "development",
        entities: [User, Borrower, InterestRate, Loan],
        migrations: [],
        subscribers: [],
      },
);
