import { api } from "../lib/axios";

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
}

export interface CreateUserDto {
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive";
}

export type UpdateUserDto = Partial<CreateUserDto>;

// Get all users
export const getUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>("/dashboard/users");
    return response.data;
};

// Get single user
export const getUser = async (id: number): Promise<User> => {
    const response = await api.get<User>(`/dashboard/users/${id}`);
    return response.data;
};

// Create user
export const createUser = async (data: CreateUserDto): Promise<User> => {
    const response = await api.post<User>("/dashboard/users", data);
    return response.data;
};

// Update user
export const updateUser = async (
    id: number,
    data: UpdateUserDto,
): Promise<User> => {
    const response = await api.patch<User>(`/dashboard/users/${id}`, data);
    return response.data;
};

// Delete user
export const deleteUser = async (id: number): Promise<void> => {
    await api.delete(`/dashboard/users/${id}`);
};
