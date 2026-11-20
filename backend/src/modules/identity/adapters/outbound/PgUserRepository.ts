import { Pool } from "pg";
import { User } from "../../domain/entities/User";
import { UserRepository } from "../../domain/ports/UserRepository";
import { Role } from "../../../../shared/auth";

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: Role;
}

function toUser(row: UserRow): User {
  return { id: row.id, email: row.email, passwordHash: row.password_hash, name: row.name, role: row.role };
}

export class PgUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    return result.rows[0] ? toUser(result.rows[0]) : undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    const result = await this.pool.query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0] ? toUser(result.rows[0]) : undefined;
  }

  async save(user: User): Promise<void> {
    await this.pool.query(
      `INSERT INTO users (id, email, password_hash, name, role) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET email = $2, password_hash = $3, name = $4, role = $5`,
      [user.id, user.email.toLowerCase(), user.passwordHash, user.name, user.role],
    );
  }
}
