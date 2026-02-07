import { api } from '../lib/axios'

export interface Loan {
    id: string
    borrower_id: string
    interest_rate_id: string
    principal_amount: string
    loan_type: 'PERSONAL' | 'BUSINESS' | 'MORTGAGE' | 'AUTO'
    start_date: string
    end_date: string
    term_months: number
    interest_rate_snapshot: string
    current_balance: string
    status: 'ACTIVE' | 'PENDING' | 'CLOSED' | 'DEFAULTED'
    created_at: string
    updated_at: string
}

export interface CreateLoanDto {
    borrower_id: string
    interest_rate_id: string
    principal_amount: string
    loan_type: 'PERSONAL' | 'BUSINESS' | 'MORTGAGE' | 'AUTO'
    start_date: string
    end_date: string
    term_months: number
}

export type UpdateLoanDto = Partial<CreateLoanDto>

// Get all loans
export const getLoans = async (): Promise<Loan[]> => {
    const response = await api.get<{ data: Loan[] }>('/dashboard/loans')
    return response.data.data
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
