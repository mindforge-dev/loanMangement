import { useMutation } from '@tanstack/react-query'
import type { UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { login, register, logout } from '../services/authService'
import type { LoginCredentials, AuthResponse, RegisterData } from '../services/authService'

// Login mutation
export const useLogin = (): UseMutationResult<AuthResponse, Error, LoginCredentials> => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            navigate('/')
        },
    })
}

// Register mutation
export const useRegister = (): UseMutationResult<AuthResponse, Error, RegisterData> => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: register,
        onSuccess: () => {
            navigate('/')
        },
    })
}

// Logout mutation
export const useLogout = () => {
    const navigate = useNavigate()

    return useMutation({
        mutationFn: async () => {
            logout()
        },
        onSuccess: () => {
            navigate('/login')
        },
    })
}
