import { AuthUser } from "../../../../shared/auth";

export interface TokenSigner {
  sign(user: AuthUser): string;
  verify(token: string): AuthUser;
}
