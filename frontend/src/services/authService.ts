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


    const authData = response.data.data


    if (authData.token) {
        localStorage.setItem('token', authData.token)
        localStorage.setItem('user', JSON.stringify(authData.user))
    }

    return authData
}


export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/register', data)

    // Extract data from nested response
    const authData = response.data.data

    // Store token in localStorage
    if (authData.token) {
        localStorage.setItem('token', authData.token)
        localStorage.setItem('user', JSON.stringify(authData.user))
    }

    return authData
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
