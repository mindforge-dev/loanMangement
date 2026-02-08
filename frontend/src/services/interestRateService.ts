import { api } from '../lib/axios'

export interface InterestRate {
    id: string
    rate_type: string
    rate_value: string
    effective_date: string
    created_at: string
    updated_at: string
}

export interface CreateInterestRateDto {
    rate_type: string
    rate_value: string
    effective_date: string
}

export type UpdateInterestRateDto = Partial<CreateInterestRateDto>

// Get all interest rates
export const getInterestRates = async (): Promise<InterestRate[]> => {
    const response = await api.get<{ data: InterestRate[] }>('/dashboard/interest-rates')
    return response.data.data
}

// Get single interest rate
export const getInterestRate = async (id: string): Promise<InterestRate> => {
    const response = await api.get<{ data: InterestRate }>(`/dashboard/interest-rates/${id}`)
    return response.data.data
}

// Create interest rate
export const createInterestRate = async (data: CreateInterestRateDto): Promise<InterestRate> => {
    const response = await api.post<{ data: InterestRate }>('/dashboard/interest-rates', data)
    return response.data.data
}

// Update interest rate
export const updateInterestRate = async (id: string, data: UpdateInterestRateDto): Promise<InterestRate> => {
    const response = await api.patch<{ data: InterestRate }>(`/dashboard/interest-rates/${id}`, data)
    return response.data.data
}

// Delete interest rate
export const deleteInterestRate = async (id: string): Promise<void> => {
    await api.delete(`/dashboard/interest-rates/${id}`)
}
