import { api } from "../lib/axios";

export interface DashboardStats {
  totalLoans: number;
  activeUsers: number;
  pendingPayments: number;
  totalRevenue: number;
}

export interface RecentLoan {
  id: string;
  borrowerName: string;
  amount: number;
  status: string;
}

export interface UpcomingPayment {
  id: string;
  paymentNumber: number;
  borrowerName: string;
  amount: number;
  dueDays: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  recentLoans: RecentLoan[];
  upcomingPayments: UpcomingPayment[];
}

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await api.get<{ data: DashboardSummary }>("/dashboard");
  return response.data.data;
};
