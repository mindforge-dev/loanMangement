import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import { login, register, logout as logoutApi } from '../services/authService'
import type { LoginCredentials, AuthResponse, RegisterData } from '../services/authService'
import { useAuthStore } from '../stores/authStore'

// Login mutation
export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
    const loginStore = useAuthStore((state) => state.login)

    return useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            loginStore(data.user, data.token)
            window.location.href = '/'
        },
    })
}

// Register mutation
export const useRegister = (): UseMutationResult<AuthResponse, Error, RegisterData> => {
    const loginStore = useAuthStore((state) => state.login)

    return useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            loginStore(data.user, data.token)
            window.location.href = '/'
        },
    })
}

// Logout mutation
export const useLogout = () => {
    const logoutStore = useAuthStore((state) => state.logout)

    return useMutation({
        mutationFn: async () => {
            await logoutApi()
        },
        onSuccess: () => {
            logoutStore()
            window.location.href = '/login'
        },
    })
}

// Get current auth state
export const useAuth = () => {
    const { user, isAuthenticated, logout } = useAuthStore()

    return {
        user,
        isAuthenticated,
        logout,
        isLoading: false,
    }
}
