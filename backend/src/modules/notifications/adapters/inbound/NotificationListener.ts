import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { ServiceLifecycleRecord } from "../../../service_lifecycle/domain/entities/ServiceStateMachine";
import { Payment } from "../../../payments/domain/entities/Payment";

// Notifications no contiene reglas de negocio (ADR-0003): solo reacciona a
// eventos ya decididos por otros módulos. Push/SMS/correo real están fuera
// del alcance académico; aquí se simulan con un registro estructurado.
export function registerNotificationListeners(): void {
  eventBus.on<ServiceLifecycleRecord>(DomainEvents.ServiceStateChanged, (record) => {
    console.log(
      `[notifications] push simulado → solicitud ${record.requestId}: estado ${record.state}`,
    );
  });

  eventBus.on<Payment>(DomainEvents.PaymentCaptured, (payment) => {
    console.log(
      `[notifications] push simulado → pago confirmado para solicitud ${payment.requestId}`,
    );
  });
}
