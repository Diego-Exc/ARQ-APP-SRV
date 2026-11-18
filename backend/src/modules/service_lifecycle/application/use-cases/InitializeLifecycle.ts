import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

export class InitializeLifecycle {
  constructor(private readonly lifecycles: ServiceLifecycleRepository) {}

  execute(requestId: string): void {
    const record = {
      requestId,
      state: "SUBMITTED" as const,
      assignedTechnicianId: null,
      updatedAt: new Date().toISOString(),
    };
    this.lifecycles.save(record);
    eventBus.emit(DomainEvents.ServiceStateChanged, record);
  }
}
