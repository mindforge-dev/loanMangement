import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import {
  getBorrowers,
  getBorrower,
  createBorrower,
  updateBorrower,
  deleteBorrower,
} from "../services/borrowerService";
import type {
  Borrower,
  CreateBorrowerDto,
  UpdateBorrowerDto,
  PaginatedResponse,
  PaginationParams,
} from "../services/borrowerService";

export const borrowerKeys = {
  all: ["borrowers"] as const,
  lists: () => [...borrowerKeys.all, "list"] as const,
  list: (params?: PaginationParams) =>
    [...borrowerKeys.lists(), params] as const,
  details: () => [...borrowerKeys.all, "detail"] as const,
  detail: (id: string) => [...borrowerKeys.details(), id] as const,
};

export const useBorrowers = (
  params?: PaginationParams,
): UseQueryResult<PaginatedResponse<Borrower>, Error> => {
  return useQuery({
    queryKey: borrowerKeys.list(params),
    queryFn: () => getBorrowers(params),
  });
};

export const useBorrower = (id: string): UseQueryResult<Borrower, Error> => {
  return useQuery({
    queryKey: borrowerKeys.detail(id),
    queryFn: () => getBorrower(id),
    enabled: !!id,
  });
};

export const useCreateBorrower = (): UseMutationResult<
  Borrower,
  Error,
  CreateBorrowerDto
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBorrower,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: borrowerKeys.lists() });
    },
  });
};

export const useUpdateBorrower = (): UseMutationResult<
  Borrower,
  Error,
  { id: string; data: UpdateBorrowerDto }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBorrower(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: borrowerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: borrowerKeys.detail(data.id) });
    },
  });
};

export const useDeleteBorrower = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBorrower,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: borrowerKeys.lists() });
    },
  });
};
