import { api } from '../lib/axios'

export interface LoginCredentials {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: {
        id: number
        name: string
        email: string
        role: string
    }
}

export interface RegisterData {
    name: string
    email: string
    password: string
}


export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials)

    // Store token in localStorage
    console.log()
    if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response.data
}


export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data)

    // Store token in localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
    }

    return response.data
}


export const logout = (): void => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
}


export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
}

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token')
}
