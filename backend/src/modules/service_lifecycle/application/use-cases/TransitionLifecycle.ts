import { Errors } from "../../../../shared/http-error";
import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { assertTransition, ServiceLifecycleRecord, ServiceState } from "../../domain/entities/ServiceStateMachine";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

export class TransitionLifecycle {
  constructor(private readonly lifecycles: ServiceLifecycleRepository) {}

  async execute(requestId: string, to: ServiceState): Promise<ServiceLifecycleRecord> {
    const current = await this.lifecycles.get(requestId);
    if (!current) throw Errors.notFound("El servicio no tiene un ciclo de vida iniciado");

    // Escenario de calidad R2: la transición se valida y aplica de forma
    // atómica; nunca queda un estado intermedio inconsistente.
    assertTransition(current.state, to);

    const updated = { ...current, state: to, updatedAt: new Date().toISOString() };
    await this.lifecycles.save(updated);
    eventBus.emit(DomainEvents.ServiceStateChanged, updated);
    return updated;
  }
}
