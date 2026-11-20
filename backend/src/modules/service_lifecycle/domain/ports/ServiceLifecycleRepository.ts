import { ServiceLifecycleRecord } from "../entities/ServiceStateMachine";

export interface ServiceLifecycleRepository {
  get(requestId: string): Promise<ServiceLifecycleRecord | undefined>;
  save(record: ServiceLifecycleRecord): Promise<void>;
}
