import { ServiceLifecycleRecord } from "../../domain/entities/ServiceStateMachine";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

// Usado por tests unitarios; el backend real usa PgServiceLifecycleRepository.
export class InMemoryServiceLifecycleRepository implements ServiceLifecycleRepository {
  private readonly records = new Map<string, ServiceLifecycleRecord>();

  async get(requestId: string): Promise<ServiceLifecycleRecord | undefined> {
    return this.records.get(requestId);
  }

  async save(record: ServiceLifecycleRecord): Promise<void> {
    this.records.set(record.requestId, record);
  }
}
