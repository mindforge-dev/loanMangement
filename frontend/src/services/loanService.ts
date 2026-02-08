import { api } from '../lib/axios'

export interface Loan {
    id: string
    borrower_id: string
    interest_rate_id: string
    principal_amount: string
    loan_type: 'PERSONAL' | 'HOME' | 'AUTO' | 'BUSINESS' | 'EDUCATION' | 'OTHER'
    start_date: string
    end_date: string
    term_months: number
    interest_rate_snapshot: string
    current_balance: string
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DEFAULTED' | 'REJECTED'
    created_at: string
    updated_at: string
}

export interface PaginationMeta {
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface PaginatedResponse<T> {
    success: boolean
    statusCode: number
    message: string
    data: T[]
    meta: PaginationMeta
    timestamp: string
}

export interface PaginationParams {
    page?: number
    limit?: number
}

export interface CreateLoanDto {
    borrower_id: string
    interest_rate_id: string
    principal_amount: number
    loan_type: 'PERSONAL' | 'HOME' | 'AUTO' | 'BUSINESS' | 'EDUCATION' | 'OTHER'
    start_date: string
    end_date: string
    term_months: number
}

export type UpdateLoanDto = Partial<CreateLoanDto>

// Get all loans with pagination
export const getLoans = async (params?: PaginationParams): Promise<PaginatedResponse<Loan>> => {
    const response = await api.get<PaginatedResponse<Loan>>('/dashboard/loans', {
        params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
        }
    })
    return response.data
}

// Get single loan
export const getLoan = async (id: string): Promise<Loan> => {
    const response = await api.get<{ data: Loan }>(`/dashboard/loans/${id}`)
    return response.data.data
}

// Create loan
export const createLoan = async (data: CreateLoanDto): Promise<Loan> => {
    const response = await api.post<{ data: Loan }>('/dashboard/loans', data)
    return response.data.data
}

// Update loan
export const updateLoan = async (id: string, data: UpdateLoanDto): Promise<Loan> => {
    const response = await api.patch<{ data: Loan }>(`/dashboard/loans/${id}`, data)
    return response.data.data
}

// Delete loan
export const deleteLoan = async (id: string): Promise<void> => {
    await api.delete(`/dashboard/loans/${id}`)
}
