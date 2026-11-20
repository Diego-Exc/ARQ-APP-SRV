import { Pool } from "pg";
import { ServiceRequest, RequestStatus } from "../../domain/entities/ServiceRequest";
import { ServiceRequestRepository } from "../../domain/ports/ServiceRequestRepository";

interface RequestRow {
  id: string;
  client_id: string;
  description: string;
  photos: string[];
  lat: number;
  lng: number;
  trade_id: string | null;
  urgency: string;
  confidence: number;
  status: RequestStatus;
  created_at: string;
}

function toRequest(row: RequestRow): ServiceRequest {
  return {
    id: row.id,
    clientId: row.client_id,
    description: row.description,
    photos: row.photos,
    location: { lat: row.lat, lng: row.lng },
    tradeId: row.trade_id,
    urgency: row.urgency,
    confidence: row.confidence,
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export class PgServiceRequestRepository implements ServiceRequestRepository {
  constructor(private readonly pool: Pool) {}

  async save(request: ServiceRequest): Promise<void> {
    await this.pool.query(
      `INSERT INTO service_requests (id, client_id, description, photos, lat, lng, trade_id, urgency, confidence, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO UPDATE SET
         description = $3, photos = $4, lat = $5, lng = $6, trade_id = $7,
         urgency = $8, confidence = $9, status = $10`,
      [
        request.id,
        request.clientId,
        request.description,
        request.photos,
        request.location.lat,
        request.location.lng,
        request.tradeId,
        request.urgency,
        request.confidence,
        request.status,
        request.createdAt,
      ],
    );
  }

  async findById(id: string): Promise<ServiceRequest | undefined> {
    const result = await this.pool.query<RequestRow>("SELECT * FROM service_requests WHERE id = $1", [id]);
    return result.rows[0] ? toRequest(result.rows[0]) : undefined;
  }

  async findByClientId(clientId: string): Promise<ServiceRequest[]> {
    const result = await this.pool.query<RequestRow>(
      "SELECT * FROM service_requests WHERE client_id = $1 ORDER BY created_at DESC",
      [clientId],
    );
    return result.rows.map(toRequest);
  }
}
