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

export interface CreateBorrowerDto {
    full_name: string
    phone: string
    email: string
    address: string
    nrc: string
}

export type UpdateBorrowerDto = Partial<CreateBorrowerDto>

// Get all borrowers
export const getBorrowers = async (): Promise<Borrower[]> => {
    const response = await api.get<{ data: Borrower[] }>('/dashboard/borrowers')
    return response.data.data
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
