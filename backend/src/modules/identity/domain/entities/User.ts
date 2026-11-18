import { Role } from "../../../../shared/auth";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
}
