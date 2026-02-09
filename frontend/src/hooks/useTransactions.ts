import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query'
import { createTransaction, getTransactions } from '../services/transactionService'
import type {
    CreateTransactionDto,
    Transaction,
    PaginatedResponse,
    PaginationParams,
} from '../services/transactionService'

export const transactionKeys = {
    all: ['transactions'] as const,
    lists: () => [...transactionKeys.all, 'list'] as const,
    list: (params?: PaginationParams) => [...transactionKeys.lists(), params] as const,
}

export const useTransactions = (
    params?: PaginationParams,
): UseQueryResult<PaginatedResponse<Transaction>, Error> => {
    return useQuery({
        queryKey: transactionKeys.list(params),
        queryFn: () => getTransactions(params),
    })
}

export const useCreateTransaction = (): UseMutationResult<
    Transaction,
    Error,
    CreateTransactionDto
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createTransaction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: transactionKeys.lists() })
        },
    })
}
