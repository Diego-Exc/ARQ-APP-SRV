import bcrypt from "bcryptjs";
import { newId } from "../../../../shared/ids";
import { Errors } from "../../../../shared/http-error";
import { UserRepository } from "../../domain/ports/UserRepository";
import { TokenSigner } from "../ports/TokenSigner";
import { RegisterInput, AuthResult } from "../dto/auth.dto";

export class RegisterUser {
  constructor(
    private readonly users: UserRepository,
    private readonly tokens: TokenSigner,
  ) {}

  execute(input: RegisterInput): AuthResult {
    if (this.users.findByEmail(input.email)) {
      throw Errors.conflict("Ya existe una cuenta con ese correo");
    }

    const user = {
      id: newId("user"),
      email: input.email,
      passwordHash: bcrypt.hashSync(input.password, 10),
      name: input.name,
      role: input.role,
    };
    this.users.save(user);

    const token = this.tokens.sign({ userId: user.id, role: user.role });
    return { token, userId: user.id, role: user.role, name: user.name };
  }
}
