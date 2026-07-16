import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getDashboardSummary, type DashboardSummary } from "../services/dashboardService";

export const useDashboardSummary = (): UseQueryResult<DashboardSummary, Error> => {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });
};
