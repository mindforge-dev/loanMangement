import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../config/datasource";
import { Loan, LoanStatus } from "../loans/loan.entity";
import { Borrower } from "../borrowers/borrower.entity";
import { User } from "../users/user.entity";
import { Transaction, TransactionType } from "../transactions/transactions.entity";

export const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loanRepo = AppDataSource.getRepository(Loan);
    const borrowerRepo = AppDataSource.getRepository(Borrower);
    const userRepo = AppDataSource.getRepository(User);
    const transactionRepo = AppDataSource.getRepository(Transaction);

    // 1. Calculate Stats
    const totalLoansCount = await loanRepo.count();
    const activeUsersCount = await borrowerRepo.count();

    const activeLoans = await loanRepo.find({ where: { status: LoanStatus.ACTIVE } });
    const pendingPaymentsSum = activeLoans.reduce((acc, l) => acc + Number(l.current_balance), 0);

    const repayments = await transactionRepo.find({ where: { type: TransactionType.REPAYMENT } });
    const totalRevenueSum = repayments.reduce((acc, t) => acc + Number(t.amount_paid), 0);

    // 2. Fetch Recent Loans
    const recentLoans = await loanRepo.find({
      relations: ["borrower"],
      order: { created_at: "DESC" },
      take: 3,
    });

    // 3. Fetch Upcoming Payments
    const upcomingLoans = await loanRepo.find({
      where: { status: LoanStatus.ACTIVE },
      relations: ["borrower"],
      order: { end_date: "ASC" },
      take: 3,
    });

    res.json({
      data: {
        stats: {
          totalLoans: totalLoansCount,
          activeUsers: activeUsersCount,
          pendingPayments: pendingPaymentsSum,
          totalRevenue: totalRevenueSum,
        },
        recentLoans: recentLoans.map((l) => ({
          id: l.id,
          borrowerName: l.borrower?.full_name || "Unknown",
          amount: Number(l.principal_amount),
          status: l.status,
        })),
        upcomingPayments: upcomingLoans.map((l, index) => {
          const monthlyEstimate = l.term_months > 0 ? Number(l.current_balance) / l.term_months : Number(l.current_balance);
          const daysRemaining = Math.max(1, Math.ceil((new Date(l.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
          return {
            id: l.id,
            paymentNumber: 2000 + index + 1,
            borrowerName: l.borrower?.full_name || "Unknown",
            amount: Number(monthlyEstimate.toFixed(2)),
            dueDays: daysRemaining > 30 ? (daysRemaining % 30) + 1 : daysRemaining,
          };
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};
