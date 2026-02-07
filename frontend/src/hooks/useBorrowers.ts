import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
    getBorrowers,
    getBorrower,
    createBorrower,
    updateBorrower,
    deleteBorrower,
} from '../services/borrowerService'
import type { Borrower, CreateBorrowerDto, UpdateBorrowerDto } from '../services/borrowerService'

// Query keys
export const borrowerKeys = {
    all: ['borrowers'] as const,
    lists: () => [...borrowerKeys.all, 'list'] as const,
    list: (filters: string) => [...borrowerKeys.lists(), { filters }] as const,
    details: () => [...borrowerKeys.all, 'detail'] as const,
    detail: (id: string) => [...borrowerKeys.details(), id] as const,
}

// Get all borrowers
export const useBorrowers = (): UseQueryResult<Borrower[], Error> => {
    return useQuery({
        queryKey: borrowerKeys.lists(),
        queryFn: getBorrowers,
    })
}

// Get single borrower
export const useBorrower = (id: string): UseQueryResult<Borrower, Error> => {
    return useQuery({
        queryKey: borrowerKeys.detail(id),
        queryFn: () => getBorrower(id),
        enabled: !!id,
    })
}

// Create borrower mutation
export const useCreateBorrower = (): UseMutationResult<Borrower, Error, CreateBorrowerDto> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createBorrower,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: borrowerKeys.lists() })
        },
    })
}

// Update borrower mutation
export const useUpdateBorrower = (): UseMutationResult<
    Borrower,
    Error,
    { id: string; data: UpdateBorrowerDto }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateBorrower(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: borrowerKeys.lists() })
            queryClient.invalidateQueries({ queryKey: borrowerKeys.detail(data.id) })
        },
    })
}

// Delete borrower mutation
export const useDeleteBorrower = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteBorrower,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: borrowerKeys.lists() })
        },
    })
}
