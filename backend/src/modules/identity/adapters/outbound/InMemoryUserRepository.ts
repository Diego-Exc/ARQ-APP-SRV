import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/ports/UserRepository";

// Usado por tests unitarios; el backend real usa PgUserRepository.
export class InMemoryUserRepository implements UserRepository {
  private readonly byId = new Map<string, User>();
  private readonly byEmail = new Map<string, User>();

  async findByEmail(email: string): Promise<User | undefined> {
    return this.byEmail.get(email.toLowerCase());
  }

  async findById(id: string): Promise<User | undefined> {
    return this.byId.get(id);
  }

  async save(user: User): Promise<void> {
    this.byId.set(user.id, user);
    this.byEmail.set(user.email.toLowerCase(), user);
  }
}
