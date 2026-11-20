import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { ServiceLifecycleRecord } from "../../../service_lifecycle/domain/entities/ServiceStateMachine";
import { OfferRepository } from "../../domain/ports/OfferRepository";

// Al aceptarse el servicio, deja de ofrecerse a los demás técnicos
// candidatos (efecto secundario desacoplado vía evento, ADR-0003).
export function registerOfferCleanupListener(offers: OfferRepository): void {
  eventBus.on<ServiceLifecycleRecord>(DomainEvents.ServiceAccepted, (record) => {
    offers.clearRequest(record.requestId).catch((error) => {
      console.error("[matching] no se pudo limpiar ofertas de la solicitud", error);
    });
  });
}
