import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { ServiceLifecycleRecord } from "../../../service_lifecycle/domain/entities/ServiceStateMachine";
import { InMemoryOfferRepository } from "../outbound/InMemoryOfferRepository";

// Al aceptarse el servicio, deja de ofrecerse a los demás técnicos
// candidatos (efecto secundario desacoplado vía evento, ADR-0003).
export function registerOfferCleanupListener(offers: InMemoryOfferRepository): void {
  eventBus.on<ServiceLifecycleRecord>(DomainEvents.ServiceAccepted, (record) => {
    offers.clearRequest(record.requestId);
  });
}
