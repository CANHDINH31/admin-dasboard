import { axiosInstance } from "../axios";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  permissions: string[];
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  id?: string;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "user";
  permissions: string[];
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  password?: string;
  role?: "admin" | "user";
  permissions?: string[];
}

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const usersApi = {
  // Get all users with pagination and search
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    axiosInstance.get<UsersResponse>("/users", { params }),

  // Get user by ID
  getUserById: (id: string) => axiosInstance.get<User>(`/users/${id}`),

  // Create new user
  createUser: (data: CreateUserRequest) =>
    axiosInstance.post<User>("/users", data),

  // Update user
  updateUser: (id: string, data: UpdateUserRequest) =>
    axiosInstance.put<User>(`/users/${id}`, data),

  // Delete user
  deleteUser: (id: string) => axiosInstance.delete<User>(`/users/${id}`),
};
