import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

export class InitializeLifecycle {
  constructor(private readonly lifecycles: ServiceLifecycleRepository) {}

  async execute(requestId: string): Promise<void> {
    const record = {
      requestId,
      state: "SUBMITTED" as const,
      assignedTechnicianId: null,
      updatedAt: new Date().toISOString(),
    };
    await this.lifecycles.save(record);
    eventBus.emit(DomainEvents.ServiceStateChanged, record);
  }
}
