import { ServiceLifecycleRecord } from "../entities/ServiceStateMachine";

export interface ServiceLifecycleRepository {
  get(requestId: string): ServiceLifecycleRecord | undefined;
  save(record: ServiceLifecycleRecord): void;
}
