import { api } from '../lib/axios'

export interface User {
    id: number
    name: string
    email: string
    role: string
    status: 'Active' | 'Inactive'
}

export interface CreateUserDto {
    name: string
    email: string
    role: string
    status: 'Active' | 'Inactive'
}

export interface UpdateUserDto extends Partial<CreateUserDto> { }

// Get all users
export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users')
    return response.data
}

// Get single user
export const getUser = async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
}

// Create user
export const createUser = async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>('/users', data)
    return response.data
}

// Update user
export const updateUser = async (id: number, data: UpdateUserDto): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}`, data)
    return response.data
}

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`)
}
