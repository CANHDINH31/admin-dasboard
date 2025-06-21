import { axiosInstance } from "../axios";

export interface Account {
  _id: string;
  marketplace: string;
  accName: string;
  profileName: string;
  sheetID: string;
  accountInfo: string;
  proxy: string;
  clientID: string;
  clientSecret: string;
  telegramId: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastSync: string;
}

export interface CreateAccountRequest {
  marketplace: string;
  accName: string;
  profileName: string;
  sheetID?: string;
  accountInfo?: string;
  proxy?: string;
  clientID?: string;
  clientSecret?: string;
  telegramId?: string;
  status?: "active" | "inactive" | "suspended";
}

export interface UpdateAccountRequest extends Partial<CreateAccountRequest> {}

export interface AccountsResponse {
  data: Account[];
  meta: {
    total: number;
    limit: number;
    page: number;
    totalPages: number;
  };
}

export const accountsApi = {
  getAccounts: (params?: { page?: number; limit?: number; search?: string }) =>
    axiosInstance.get<AccountsResponse>("/accounts", { params }),

  getAccountById: (id: string) => axiosInstance.get<Account>(`/accounts/${id}`),

  createAccount: (data: CreateAccountRequest) =>
    axiosInstance.post<Account>("/accounts", data),

  updateAccount: (id: string, data: UpdateAccountRequest) =>
    axiosInstance.put<Account>(`/accounts/${id}`, data),
  deleteAccount: (id: string) => axiosInstance.delete(`/accounts/${id}`),
};
