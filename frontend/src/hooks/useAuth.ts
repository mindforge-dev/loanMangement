import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import { login, register, logout } from '../services/authService'
import type { LoginCredentials, AuthResponse, RegisterData } from '../services/authService'

// Login mutation
export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            // Use window.location for hard redirect to ensure auth state is fresh
            window.location.href = '/'
        },
    })
}

// Register mutation
export const useRegister = (): UseMutationResult<AuthResponse, Error, RegisterData> => {
    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            // Use window.location for hard redirect to ensure auth state is fresh
            window.location.href = '/'
        },
    })
}

// Logout mutation
export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            logout()
        },
        onSuccess: () => {
            window.location.href = '/login'
        },
    })
}
