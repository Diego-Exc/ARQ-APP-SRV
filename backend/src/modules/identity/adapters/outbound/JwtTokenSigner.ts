import jwt from "jsonwebtoken";
import { AuthUser } from "../../../../shared/auth";
import { Errors } from "../../../../shared/http-error";
import { TokenSigner } from "../../application/ports/TokenSigner";

export class JwtTokenSigner implements TokenSigner {
  constructor(private readonly secret: string) {}

  sign(user: AuthUser): string {
    return jwt.sign(user, this.secret, { expiresIn: "12h" });
  }

  verify(token: string): AuthUser {
    try {
      return jwt.verify(token, this.secret) as AuthUser;
    } catch {
      throw Errors.unauthorized("Token inválido o expirado");
    }
  }
}
