import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
    id: string
    name: string
    email: string
    roles: string[]
    permissions: string[]
    createdAt?: string
}

interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    login: (user: User, accessToken: string, refreshToken: string) => void
    setTokens: (accessToken: string, refreshToken: string) => void
    logout: () => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            login: (user, accessToken, refreshToken) =>
                set({ user, accessToken, refreshToken, isAuthenticated: true }),
            setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
            logout: () =>
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
        }),
        {
            name: 'auth-storage',
            version: 2, // bumped: shape changed (token -> accessToken/refreshToken, role -> roles[])
            storage: createJSONStorage(() => localStorage),
            // Discard any persisted state from an older (incompatible) version.
            migrate: () => ({
                user: null,
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false,
            }),
        },
    ),
)
