import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/ports/UserRepository";

export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, User>();
  private readonly byEmail = new Map<string, User>();

  findByEmail(email: string): User | undefined {
    return this.byEmail.get(email.toLowerCase());
  }

  findById(id: string): User | undefined {
    return this.byId.get(id);
  }

  save(user: User): void {
    this.byId.set(user.id, user);
    this.byEmail.set(user.email.toLowerCase(), user);
  }
}
