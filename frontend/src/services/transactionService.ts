import { api } from '../lib/axios'

export interface Transaction {
    id: string
    loan_id: string
    borrower_id: string
    payment_date: string
    type: 'REPAYMENT' | 'DISBURSEMENT' | 'FEE' | 'PENALTY' | string
    amount_paid: string
    remaining_balance: string
    payment_term_months: number
    method: string
    note: string | null
    created_at: string
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

export interface CreateTransactionDto {
    loan_id: string
    payment_date: string
    borrower_id: string
    type: 'REPAYMENT' | 'DISBURSEMENT' | 'FEE' | 'PENALTY'
    amount_paid: number
    remaining_balance: number
    payment_term_months: number
    method: string
    note?: string
}

export const getTransactions = async (
    params?: PaginationParams,
): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<PaginatedResponse<Transaction>>('/dashboard/transactions', {
        params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
        },
    })

    return response.data
}

export const createTransaction = async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post<{ data: Transaction }>('/dashboard/transactions', data)
    return response.data.data
}
