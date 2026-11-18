import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { Payment } from "../../../payments/domain/entities/Payment";
import { OpenRatingWindow } from "../../application/use-cases/OpenRatingWindow";

export function registerPaymentCapturedListener(openRatingWindow: OpenRatingWindow): void {
  eventBus.on<Payment>(DomainEvents.PaymentCaptured, (payment) => {
    openRatingWindow.execute(payment.requestId);
  });
}
