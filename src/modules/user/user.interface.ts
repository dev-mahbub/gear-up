export interface IUserRegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role?: "ADMIN" | "CUSTOMER" | "PROVIDER";
  status?: "ACTIVE" | "BLOCKED";
}
