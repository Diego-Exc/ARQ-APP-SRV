import { Errors } from "../../../../shared/http-error";
import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { assertTransition, ServiceLifecycleRecord } from "../../domain/entities/ServiceStateMachine";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

export class AcceptService {
  constructor(private readonly lifecycles: ServiceLifecycleRepository) {}

  async execute(requestId: string, technicianId: string): Promise<ServiceLifecycleRecord> {
    const current = await this.lifecycles.get(requestId);
    if (!current) throw Errors.notFound("El servicio no tiene un ciclo de vida iniciado");
    if (current.assignedTechnicianId && current.assignedTechnicianId !== technicianId) {
      // Nunca quedan dos técnicos asignados al mismo servicio (escenario R2).
      throw Errors.conflict("El servicio ya fue asignado a otro técnico");
    }

    assertTransition(current.state, "ASSIGNED");

    const updated = {
      ...current,
      state: "ASSIGNED" as const,
      assignedTechnicianId: technicianId,
      updatedAt: new Date().toISOString(),
    };
    await this.lifecycles.save(updated);
    eventBus.emit(DomainEvents.ServiceAccepted, updated);
    eventBus.emit(DomainEvents.ServiceStateChanged, updated);
    return updated;
  }
}
