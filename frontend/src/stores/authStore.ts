import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
    id: string
    name: string
    email: string
    role: string
    createdAt?: string
}

interface AuthState {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: (userData: User, token: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user, token) => set({ user, token, isAuthenticated: true }),
            logout: () => set({ user: null, token: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage', // name of item in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
)
