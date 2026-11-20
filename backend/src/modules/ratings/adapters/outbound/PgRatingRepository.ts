import { Pool } from "pg";
import { Rating } from "../../domain/entities/Rating";
import { RatingRepository } from "../../domain/ports/RatingRepository";

interface RatingRow {
  request_id: string;
  id: string;
  technician_id: string;
  stars: number;
  comment: string | null;
  created_at: string;
}

function toRating(row: RatingRow): Rating {
  return {
    id: row.id,
    requestId: row.request_id,
    technicianId: row.technician_id,
    stars: row.stars,
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export class PgRatingRepository implements RatingRepository {
  constructor(private readonly pool: Pool) {}

  async save(rating: Rating): Promise<void> {
    await this.pool.query(
      `INSERT INTO ratings (request_id, id, technician_id, stars, comment, created_at)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (request_id) DO UPDATE SET id = $2, technician_id = $3, stars = $4, comment = $5, created_at = $6`,
      [rating.requestId, rating.id, rating.technicianId, rating.stars, rating.comment, rating.createdAt],
    );
  }

  async findByRequestId(requestId: string): Promise<Rating | undefined> {
    const result = await this.pool.query<RatingRow>("SELECT * FROM ratings WHERE request_id = $1", [requestId]);
    return result.rows[0] ? toRating(result.rows[0]) : undefined;
  }

  async openWindow(requestId: string): Promise<void> {
    await this.pool.query("INSERT INTO rating_windows (request_id) VALUES ($1) ON CONFLICT (request_id) DO NOTHING", [requestId]);
  }

  async isWindowOpen(requestId: string): Promise<boolean> {
    const result = await this.pool.query("SELECT 1 FROM rating_windows WHERE request_id = $1", [requestId]);
    return (result.rowCount ?? 0) > 0;
  }
}
