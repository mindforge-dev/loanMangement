import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
    getInterestRates,
    getInterestRate,
    createInterestRate,
    updateInterestRate,
    deleteInterestRate,
} from '../services/interestRateService'
import type { InterestRate, CreateInterestRateDto, UpdateInterestRateDto } from '../services/interestRateService'

// Query keys
export const interestRateKeys = {
    all: ['interestRates'] as const,
    lists: () => [...interestRateKeys.all, 'list'] as const,
    list: (filters: string) => [...interestRateKeys.lists(), { filters }] as const,
    details: () => [...interestRateKeys.all, 'detail'] as const,
    detail: (id: string) => [...interestRateKeys.details(), id] as const,
}

// Get all interest rates
export const useInterestRates = (): UseQueryResult<InterestRate[], Error> => {
    return useQuery({
        queryKey: interestRateKeys.lists(),
        queryFn: getInterestRates,
    })
}

// Get single interest rate
export const useInterestRate = (id: string): UseQueryResult<InterestRate, Error> => {
    return useQuery({
        queryKey: interestRateKeys.detail(id),
        queryFn: () => getInterestRate(id),
        enabled: !!id,
    })
}

// Create interest rate mutation
export const useCreateInterestRate = (): UseMutationResult<InterestRate, Error, CreateInterestRateDto> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createInterestRate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: interestRateKeys.lists() })
        },
    })
}

// Update interest rate mutation
export const useUpdateInterestRate = (): UseMutationResult<
    InterestRate,
    Error,
    { id: string; data: UpdateInterestRateDto }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateInterestRate(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: interestRateKeys.lists() })
            queryClient.invalidateQueries({ queryKey: interestRateKeys.detail(data.id) })
        },
    })
}

// Delete interest rate mutation
export const useDeleteInterestRate = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteInterestRate,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: interestRateKeys.lists() })
        },
    })
}
