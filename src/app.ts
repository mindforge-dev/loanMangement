import express from "express";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./common/middleware/error-handler";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import borrowerRoutes from "./modules/borrowers/borrowers.routes";
import interestRateRoutes from "./modules/interest-rates/interest-rates.routes";
import loanRoutes from "./modules/loans/loans.routes";
import transactionRoutes from "./modules/transactions/transactions.route";

export const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/dashboard/users", userRoutes);
app.use("/dashboard/borrowers", borrowerRoutes);
app.use("/dashboard/interest-rates", interestRateRoutes);
app.use("/dashboard/loans", loanRoutes);
app.use("/dashboard/transactions", transactionRoutes);

// Root Endpoint
app.get("/", (req, res) => {
  res.json({ message: "Loan Management API is running" });
});

// Swagger UI
import swaggerUi from "swagger-ui-express";
import { generateOpenApiSpec } from "./config/openapi";
import { registerAuthDocs } from "./modules/auth/auth.openapi";
import { registerUserDocs } from "./modules/users/users.openapi";
import { registerBorrowerDocs } from "./modules/borrowers/borrowers.openapi";
import { registerInterestRateDocs } from "./modules/interest-rates/interest-rates.openapi";
import { registerLoanDocs } from "./modules/loans/loans.openapi";
import { registerTransactionDocs } from "./modules/transactions/transactions.openapi";

// Register paths
registerAuthDocs();
registerUserDocs();
registerBorrowerDocs();
registerInterestRateDocs();
registerLoanDocs();
registerTransactionDocs();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(generateOpenApiSpec()));

// Error Handler
app.use(errorHandler);
