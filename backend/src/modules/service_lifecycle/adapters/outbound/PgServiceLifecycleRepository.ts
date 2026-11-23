import { Pool } from "pg";
import { ServiceLifecycleRecord, ServiceState } from "../../domain/entities/ServiceStateMachine";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

interface LifecycleRow {
  request_id: string;
  state: ServiceState;
  assigned_technician_id: string | null;
  security_code: string | null;
  updated_at: string;
}

function toRecord(row: LifecycleRow): ServiceLifecycleRecord {
  return {
    requestId: row.request_id,
    state: row.state,
    assignedTechnicianId: row.assigned_technician_id,
    securityCode: row.security_code,
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

export class PgServiceLifecycleRepository implements ServiceLifecycleRepository {
  constructor(private readonly pool: Pool) {}

  async get(requestId: string): Promise<ServiceLifecycleRecord | undefined> {
    const result = await this.pool.query<LifecycleRow>("SELECT * FROM service_lifecycle WHERE request_id = $1", [requestId]);
    return result.rows[0] ? toRecord(result.rows[0]) : undefined;
  }

  async save(record: ServiceLifecycleRecord): Promise<void> {
    await this.pool.query(
      `INSERT INTO service_lifecycle (request_id, state, assigned_technician_id, security_code, updated_at)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (request_id) DO UPDATE SET state = $2, assigned_technician_id = $3, security_code = $4, updated_at = $5`,
      [record.requestId, record.state, record.assignedTechnicianId, record.securityCode, record.updatedAt],
    );
  }
}
