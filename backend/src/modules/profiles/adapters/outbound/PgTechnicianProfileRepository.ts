import { Pool } from "pg";
import { TechnicianProfile } from "../../domain/entities/TechnicianProfile";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";

interface ProfileRow {
  id: string;
  user_id: string;
  name: string;
  trades: string[];
  lat: number;
  lng: number;
  rating: number;
  reviews: number;
  verified: boolean;
  online: boolean;
}

function toProfile(row: ProfileRow): TechnicianProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    trades: row.trades,
    location: { lat: row.lat, lng: row.lng },
    rating: row.rating,
    reviews: row.reviews,
    verified: row.verified,
    online: row.online,
  };
}

export class PgTechnicianProfileRepository implements TechnicianProfileRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<TechnicianProfile[]> {
    const result = await this.pool.query<ProfileRow>("SELECT * FROM technician_profiles ORDER BY name");
    return result.rows.map(toProfile);
  }

  async findById(id: string): Promise<TechnicianProfile | undefined> {
    const result = await this.pool.query<ProfileRow>("SELECT * FROM technician_profiles WHERE id = $1", [id]);
    return result.rows[0] ? toProfile(result.rows[0]) : undefined;
  }

  async findByUserId(userId: string): Promise<TechnicianProfile | undefined> {
    const result = await this.pool.query<ProfileRow>("SELECT * FROM technician_profiles WHERE user_id = $1", [userId]);
    return result.rows[0] ? toProfile(result.rows[0]) : undefined;
  }

  async findAvailableByTrade(tradeId: string): Promise<TechnicianProfile[]> {
    const result = await this.pool.query<ProfileRow>(
      "SELECT * FROM technician_profiles WHERE online = TRUE AND verified = TRUE AND $1 = ANY(trades)",
      [tradeId],
    );
    return result.rows.map(toProfile);
  }

  async save(profile: TechnicianProfile): Promise<void> {
    await this.pool.query(
      `INSERT INTO technician_profiles (id, user_id, name, trades, lat, lng, rating, reviews, verified, online)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         user_id = $2, name = $3, trades = $4, lat = $5, lng = $6,
         rating = $7, reviews = $8, verified = $9, online = $10`,
      [
        profile.id,
        profile.userId,
        profile.name,
        profile.trades,
        profile.location.lat,
        profile.location.lng,
        profile.rating,
        profile.reviews,
        profile.verified,
        profile.online,
      ],
    );
  }
}
