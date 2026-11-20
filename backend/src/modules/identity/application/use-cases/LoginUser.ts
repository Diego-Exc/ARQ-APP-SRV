import bcrypt from "bcryptjs";
import { Errors } from "../../../../shared/http-error";
import { UserRepository } from "../../domain/ports/UserRepository";
import { TokenSigner } from "../ports/TokenSigner";
import { LoginInput, AuthResult } from "../dto/auth.dto";

export class LoginUser {
  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenSigner,
  ) {}

  async execute(input: LoginInput): Promise<AuthResult> {
    const user = await this.users.findByEmail(input.email);
    if (!user || !bcrypt.compareSync(input.password, user.passwordHash)) {
      throw Errors.unauthorized("Correo o contraseña incorrectos");
    }

    const token = this.tokens.sign({ userId: user.id, role: user.role });
    return { token, userId: user.id, role: user.role, name: user.name };
  }
}
