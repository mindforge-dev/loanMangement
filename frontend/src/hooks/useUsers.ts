import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
} from '../services/userService'
import type { User, CreateUserDto, UpdateUserDto } from '../services/userService'

// Query keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    list: (filters: string) => [...userKeys.lists(), { filters }] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: number) => [...userKeys.details(), id] as const,
}

// Get all users
export const useUsers = (): UseQueryResult<User[], Error> => {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: getUsers,
    })
}

// Get single user
export const useUser = (id: number): UseQueryResult<User, Error> => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => getUser(id),
        enabled: !!id,
    })
}

// Create user mutation
export const useCreateUser = (): UseMutationResult<User, Error, CreateUserDto> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
        },
    })
}

// Update user mutation
export const useUpdateUser = (): UseMutationResult<
    User,
    Error,
    { id: number; data: UpdateUserDto }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }) => updateUser(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
        },
    })
}

// Delete user mutation
export const useDeleteUser = (): UseMutationResult<void, Error, number> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
        },
    })
}
