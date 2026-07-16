import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import {
    getUsers,
    getUser,
    deleteUser,
    assignRoles,
    syncPermissions,
    getRoles,
    getPermissions,
    createRole,
    createPermission,
} from '../services/userService'
import type { User, Role, Permission } from '../services/userService'

// Query keys
export const userKeys = {
    all: ['users'] as const,
    lists: () => [...userKeys.all, 'list'] as const,
    details: () => [...userKeys.all, 'detail'] as const,
    detail: (id: string) => [...userKeys.details(), id] as const,
    roles: () => [...userKeys.all, 'roles'] as const,
    permissions: () => [...userKeys.all, 'permissions'] as const,
}

// RBAC catalog
export const useRoles = (): UseQueryResult<Role[], Error> => {
    return useQuery({ queryKey: userKeys.roles(), queryFn: getRoles })
}

export const usePermissions = (): UseQueryResult<Permission[], Error> => {
    return useQuery({ queryKey: userKeys.permissions(), queryFn: getPermissions })
}

// Get all users
export const useUsers = (): UseQueryResult<User[], Error> => {
    return useQuery({
        queryKey: userKeys.lists(),
        queryFn: getUsers,
    })
}

// Get single user
export const useUser = (id: string): UseQueryResult<User, Error> => {
    return useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => getUser(id),
        enabled: !!id,
    })
}

// Delete user mutation
export const useDeleteUser = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
        },
    })
}

// Assign (sync) roles
export const useAssignRoles = (): UseMutationResult<
    User,
    Error,
    { id: string; roles: string[] }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, roles }) => assignRoles(id, roles),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
        },
    })
}

// Sync direct permissions
export const useSyncPermissions = (): UseMutationResult<
    User,
    Error,
    { id: string; permissions: string[] }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, permissions }) => syncPermissions(id, permissions),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: userKeys.lists() })
            queryClient.invalidateQueries({ queryKey: userKeys.detail(data.id) })
        },
    })
}

// Create a new role
export const useCreateRole = (): UseMutationResult<
    Role,
    Error,
    { name: string; permissions?: string[] }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ name, permissions }) => createRole(name, permissions),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.roles() })
        },
    })
}

// Create a new permission
export const useCreatePermission = (): UseMutationResult<
    Permission,
    Error,
    { name: string }
> => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ name }) => createPermission(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.permissions() })
        },
    })
}
