import { Pool } from "pg";
import { OfferRepository, TechnicianOffer } from "../../domain/ports/OfferRepository";

interface OfferRow {
  request_id: string;
  trade_id: string;
  distance_km: number;
  score: number;
  offered_at: string;
}

function toOffer(row: OfferRow): TechnicianOffer {
  return {
    requestId: row.request_id,
    tradeId: row.trade_id,
    distanceKm: row.distance_km,
    score: row.score,
    offeredAt: new Date(row.offered_at).toISOString(),
  };
}

export class PgOfferRepository implements OfferRepository {
  constructor(private readonly pool: Pool) {}

  async recordOffers(
    tradeId: string,
    requestId: string,
    offers: { technicianId: string; distanceKm: number; score: number }[],
  ): Promise<void> {
    for (const offer of offers) {
      await this.pool.query(
        `INSERT INTO offers (request_id, technician_id, trade_id, distance_km, score, offered_at)
         VALUES ($1,$2,$3,$4,$5, now())
         ON CONFLICT (request_id, technician_id) DO UPDATE SET trade_id = $3, distance_km = $4, score = $5, offered_at = now()`,
        [requestId, offer.technicianId, tradeId, offer.distanceKm, offer.score],
      );
    }
  }

  async listForTechnician(technicianId: string): Promise<TechnicianOffer[]> {
    const result = await this.pool.query<OfferRow>(
      "SELECT * FROM offers WHERE technician_id = $1 ORDER BY offered_at DESC",
      [technicianId],
    );
    return result.rows.map(toOffer);
  }

  async clearRequest(requestId: string): Promise<void> {
    await this.pool.query("DELETE FROM offers WHERE request_id = $1", [requestId]);
  }
}
