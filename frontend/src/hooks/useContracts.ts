import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import {
  getContractsByLoan,
  uploadContract,
  downloadContract,
} from "../services/contractService";
import type { Contract } from "../services/contractService";

export const contractKeys = {
  all: ["contracts"] as const,
  byLoan: (loanId: string) => [...contractKeys.all, "loan", loanId] as const,
};

export const useContractsByLoan = (
  loanId: string,
): UseQueryResult<Contract[], Error> => {
  return useQuery({
    queryKey: contractKeys.byLoan(loanId),
    queryFn: () => getContractsByLoan(loanId),
    enabled: !!loanId,
  });
};

export const useUploadContract = (): UseMutationResult<
  Contract,
  Error,
  { loanId: string; file: File; signingDate: string }
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ loanId, file, signingDate }) =>
      uploadContract(loanId, file, signingDate),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: contractKeys.byLoan(data.loan_id),
      });
    },
  });
};

export const useDownloadContract = (): UseMutationResult<
  void,
  Error,
  { contractId: string; filename: string }
> => {
  return useMutation({
    mutationFn: ({ contractId, filename }) =>
      downloadContract(contractId, filename),
  });
};
