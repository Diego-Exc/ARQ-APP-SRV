import { ServiceLifecycleRecord } from "../../domain/entities/ServiceStateMachine";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

export class InMemoryServiceLifecycleRepository implements ServiceLifecycleRepository {
  private readonly records = new Map<string, ServiceLifecycleRecord>();

  get(requestId: string): ServiceLifecycleRecord | undefined {
    return this.records.get(requestId);
  }

  save(record: ServiceLifecycleRecord): void {
    this.records.set(record.requestId, record);
  }
}
