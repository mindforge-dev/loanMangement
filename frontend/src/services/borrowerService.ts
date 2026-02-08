import { api } from '../lib/axios'

export interface Borrower {
    id: string
    full_name: string
    phone: string
    email: string
    address: string
    nrc: string
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

export interface CreateBorrowerDto {
    full_name: string
    phone: string
    email: string
    address: string
    nrc: string
}

export type UpdateBorrowerDto = Partial<CreateBorrowerDto>

// Get all borrowers with pagination
export const getBorrowers = async (params?: PaginationParams): Promise<PaginatedResponse<Borrower>> => {
    const response = await api.get<PaginatedResponse<Borrower>>('/dashboard/borrowers', {
        params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
        }
    })
    return response.data
}

// Get single borrower
export const getBorrower = async (id: string): Promise<Borrower> => {
    const response = await api.get<{ data: Borrower }>(`/dashboard/borrowers/${id}`)
    return response.data.data
}

// Create borrower
export const createBorrower = async (data: CreateBorrowerDto): Promise<Borrower> => {
    const response = await api.post<{ data: Borrower }>('/dashboard/borrowers', data)
    return response.data.data
}

// Update borrower
export const updateBorrower = async (id: string, data: UpdateBorrowerDto): Promise<Borrower> => {
    const response = await api.patch<{ data: Borrower }>(`/dashboard/borrowers/${id}`, data)
    return response.data.data
}

// Delete borrower
export const deleteBorrower = async (id: string): Promise<void> => {
    await api.delete(`/dashboard/borrowers/${id}`)
}
