import { api } from '../lib/axios'

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: {
        id: string
        name: string
        email: string
        role: string
        createdAt?: string
    }
}


// Backend response wrapper
interface BackendAuthResponse {
    data: AuthResponse
}

export interface RegisterData {
    name: string
    email: string
    password: string
}


export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/login', credentials)
    return response.data.data
}


export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/register', data)
    return response.data.data
}


export const logout = async (): Promise<void> => {
    // Optional: Call backend logout endpoint if exists
    // await api.post('/auth/logout')
}
