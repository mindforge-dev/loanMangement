import { api } from '../lib/axios'
import type { User } from '../stores/authStore'

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
}

export interface AuthResponse {
    accessToken: string
    refreshToken: string
    user: User
}

// Backend response wrapper
interface BackendAuthResponse {
    data: AuthResponse
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/login', credentials)
    return response.data.data
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<BackendAuthResponse>('/auth/register', data)
    return response.data.data
}

/**
 * Exchange a refresh token for a new access/refresh token pair.
 * Uses a plain fetch to avoid the axios response interceptor (which would
 * otherwise treat a failed refresh as a normal 401 and recurse).
 */
export const refreshAccessToken = async (refreshToken: string): Promise<AuthResponse> => {
    const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
        /\/$/,
        '',
    )
    const res = await fetch(`${baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
    })
    if (!res.ok) {
        throw new Error('Refresh failed')
    }
    const body = (await res.json()) as BackendAuthResponse
    return body.data
}

export const logout = async (refreshToken: string | null): Promise<void> => {
    if (!refreshToken) return
    try {
        await api.post('/auth/logout', { refreshToken })
    } catch {
        // Best-effort: ignore network/server errors so the client still clears state.
    }
}
