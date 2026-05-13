import { UserRole } from "./union.types";
import { User } from "./user-auth.types";

export type APIResponse<ReceivedData = unknown, ExtraPayload = unknown> = {
  success: boolean;
  data?: ReceivedData;
  message?: string;
  error?: string;
  extraPayload?: ExtraPayload;
};

export type PaginatedResponse<T> = APIResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}>;

export type AuthResponse = APIResponse<{
  user: User;
  role: UserRole;
  redirectTo: string;
}>;

export type LoginPayload = {
  user: any; // Supabase User object
  role: "admin" | "seller" | "customer";
  redirectTo: string;
};

export type APIResponse<T = any> = {
  success: boolean;
  message?: string;
  error?: string;
  extraPayload?: T;
};
