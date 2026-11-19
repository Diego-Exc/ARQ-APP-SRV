import { User } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): User | undefined;
  findById(id: string): User | undefined;
  save(user: User): void;
}
