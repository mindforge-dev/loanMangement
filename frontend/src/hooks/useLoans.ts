import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import {
  getLoans,
  getLoan,
  createLoan,
  updateLoan,
  updateLoanStatus,
  deleteLoan,
  getLoansByBorrower,
} from "../services/loanService";
import type {
  Loan,
  CreateLoanDto,
  UpdateLoanDto,
  PaginatedResponse,
  PaginationParams,
} from "../services/loanService";

// Query keys
export const loanKeys = {
  all: ["loans"] as const,
  lists: () => [...loanKeys.all, "list"] as const,
  list: (params?: PaginationParams) => [...loanKeys.lists(), params] as const,
  details: () => [...loanKeys.all, "detail"] as const,
  detail: (id: string) => [...loanKeys.details(), id] as const,
  byBorrower: (borrowerId: string) =>
    [...loanKeys.all, "borrower", borrowerId] as const,
};

// Get all loans with pagination
export const useLoans = (
  params?: PaginationParams,
): UseQueryResult<PaginatedResponse<Loan>, Error> => {
  return useQuery({
    queryKey: loanKeys.list(params),
    queryFn: () => getLoans(params),
    staleTime: 0,
  });
};

// Get loans by borrower
export const useLoansByBorrower = (
  borrowerId: string,
): UseQueryResult<{ data: Loan[] }, Error> => {
  return useQuery({
    queryKey: loanKeys.byBorrower(borrowerId),
    queryFn: () => getLoansByBorrower(borrowerId),
    enabled: !!borrowerId,
  });
};

// Get single loan
export const useLoan = (id: string): UseQueryResult<Loan, Error> => {
  return useQuery({
    queryKey: loanKeys.detail(id),
    queryFn: () => getLoan(id),
    enabled: !!id,
  });
};

// Create loan mutation
export const useCreateLoan = (): UseMutationResult<
  Loan,
  Error,
  CreateLoanDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLoan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: loanKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: loanKeys.byBorrower(data.borrower_id),
      });
    },
  });
};

// Update loan mutation
export const useUpdateLoan = (): UseMutationResult<
  Loan,
  Error,
  { id: string; data: UpdateLoanDto }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateLoan(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: loanKeys.byBorrower(data.borrower_id),
      });
    },
  });
};

// Update loan status mutation
export const useUpdateLoanStatus = (): UseMutationResult<
  Loan,
  Error,
  { id: string; status: Loan["status"] }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateLoanStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      queryClient.invalidateQueries({ queryKey: loanKeys.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: loanKeys.byBorrower(data.borrower_id),
      });
    },
  });
};

// Delete loan mutation
export const useDeleteLoan = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLoan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: loanKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...loanKeys.all, "borrower"],
      });
    },
  });
};
