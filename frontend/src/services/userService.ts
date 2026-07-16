import { api } from "../lib/axios";

export interface User {
    id: string;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
    createdAt?: string;
}

export interface Role {
    id: number;
    name: string;
}

export interface Permission {
    id: number;
    name: string;
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<{ data: User[] }>("/dashboard/users");
    return response.data.data;
};

// Get single user
export const getUser = async (id: string): Promise<User> => {
    const response = await api.get<{ data: User }>(`/dashboard/users/${id}`);
    return response.data.data;
};

// RBAC catalog (for the access-management UI)
export const getRoles = async (): Promise<Role[]> => {
    const response = await api.get<{ data: Role[] }>("/dashboard/users/roles");
    return response.data.data;
};

export const getPermissions = async (): Promise<Permission[]> => {
    const response = await api.get<{ data: Permission[] }>(
        "/dashboard/users/permissions",
    );
    return response.data.data;
};

// Sync a user's roles (RBAC management)
export const assignRoles = async (id: string, roles: string[]): Promise<User> => {
    const response = await api.put<{ data: User }>(`/dashboard/users/${id}/roles`, { roles });
    return response.data.data;
};

// Sync a user's direct permissions (RBAC management)
export const syncPermissions = async (
    id: string,
    permissions: string[],
): Promise<User> => {
    const response = await api.put<{ data: User }>(`/dashboard/users/${id}/permissions`, {
        permissions,
    });
    return response.data.data;
};

// Delete user
export const deleteUser = async (id: string): Promise<void> => {
    await api.delete(`/dashboard/users/${id}`);
};
