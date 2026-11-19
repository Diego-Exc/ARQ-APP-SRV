import { Role } from "../../../../shared/auth";

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  userId: string;
  role: Role;
  name: string;
}
