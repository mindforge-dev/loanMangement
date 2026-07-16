import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import fs from "fs";
import path from "path";
import { User } from "../modules/users/user.entity";
import { Borrower } from "../modules/borrowers/borrower.entity";
import { InterestRate } from "../modules/interest-rates/interest-rate.entity";
import { Loan } from "../modules/loans/loan.entity";
import { Transaction } from "../modules/transactions/transactions.entity";
import { Contract } from "../modules/contracts/contract.entity";
import { Role } from "../modules/rbac/entities/role.entity";
import { Permission } from "../modules/rbac/entities/permission.entity";
import { RefreshToken } from "../modules/rbac/entities/refresh-token.entity";

const entities = [
  User,
  Borrower,
  InterestRate,
  Loan,
  Transaction,
  Contract,
  Role,
  Permission,
  RefreshToken,
];

export const AppDataSource = new DataSource(
  env.NODE_ENV === "test"
    ? {
      type: "sqlite",
      database: ":memory:",
      synchronize: true,
      dropSchema: true,
      entities,
      logging: false,
    }
    : {
      type: "postgres",
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT, 10),
      username: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      synchronize: env.NODE_ENV === "development",
      logging: env.NODE_ENV === "development",
      entities,
      migrations: [],
      subscribers: [],
      // Enable SSL when DB_SSL=true (required for AWS RDS)
      ...(env.DB_SSL === "true" && {
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync(
            path.resolve(process.cwd(), env.DB_SSL_CERT ?? "global-bundle.pem"),
          ),
        },
      }),
    },
);
