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
import contractRoutes from "./modules/contracts/contracts.routes";

export const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://www.zcoder.space",
    "https://zcoder.space",
    "http://localhost:5174"
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard/users", userRoutes);
app.use("/api/dashboard/borrowers", borrowerRoutes);
app.use("/api/dashboard/interest-rates", interestRateRoutes);
app.use("/api/dashboard/loans", loanRoutes);
app.use("/api/dashboard/transactions", transactionRoutes);
app.use("/api/dashboard/contracts", contractRoutes);

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
import { registerContractDocs } from "./modules/contracts/contracts.openapi";

// Register paths
registerAuthDocs();
registerUserDocs();
registerBorrowerDocs();
registerInterestRateDocs();
registerLoanDocs();
registerTransactionDocs();
registerContractDocs();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(generateOpenApiSpec()));

// Error Handler
app.use(errorHandler);
