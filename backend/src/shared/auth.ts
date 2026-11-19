export type Role = "CLIENT" | "PRO" | "ADMIN";

export interface AuthUser {
  userId: string;
  role: Role;
}
