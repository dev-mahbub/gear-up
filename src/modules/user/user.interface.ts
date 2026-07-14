export interface IUserRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: "ADMIN" | "CUSTOMER" | "PROVIDER";
  active_status?: "ACTIVE" | "BLOCKED";
}

export interface IUpdateProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
}
