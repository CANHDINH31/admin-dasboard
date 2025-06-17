import { axiosInstance } from "../axios";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  _doc: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance.post<LoginResponse>("/auth/login", data),
};
