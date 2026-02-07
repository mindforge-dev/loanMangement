import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { login, register, logout, getCurrentUser, isAuthenticated } from '../services/authService'
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

// Get current authenticated user
export const useCurrentUser = () => {
    const [user, setUser] = useState(() => getCurrentUser())
    const [authenticated, setAuthenticated] = useState(() => isAuthenticated())

    useEffect(() => {
        // Update user state when component mounts or storage changes
        const handleStorageChange = () => {
            setUser(getCurrentUser())
            setAuthenticated(isAuthenticated())
        }

        // Listen for storage changes (e.g., login/logout in another tab)
        window.addEventListener('storage', handleStorageChange)

        return () => {
            window.removeEventListener('storage', handleStorageChange)
        }
    }, [])

    return {
        user,
        isAuthenticated: authenticated,
        isLoading: false, // Could be true if fetching from API
    }
}
