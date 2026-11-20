import { User } from "../entities/User";

export interface UserRepository {
  findByEmail(email: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
