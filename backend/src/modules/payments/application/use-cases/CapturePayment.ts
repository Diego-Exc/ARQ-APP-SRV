import { newId } from "../../../../shared/ids";
import { eventBus, DomainEvents } from "../../../../shared/event-bus";
import { Payment } from "../../domain/entities/Payment";
import { PaymentRepository } from "../../domain/ports/PaymentRepository";
import { CapturePaymentInput } from "../dto/payments.dto";

export class CapturePayment {
  constructor(private readonly payments: PaymentRepository) {}

  async execute(input: CapturePaymentInput): Promise<Payment> {
    // Idempotencia obligatoria (escenario de calidad S2): un reintento con la
    // misma clave nunca genera un doble cobro.
    const existing = await this.payments.findByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing;

    const payment: Payment = {
      id: newId("pay"),
      requestId: input.requestId,
      idempotencyKey: input.idempotencyKey,
      amount: { amount: input.amount, currency: input.currency ?? "COP" },
      method: input.method,
      status: "CAPTURED",
      capturedAt: new Date().toISOString(),
    };
    await this.payments.save(payment);
    eventBus.emit(DomainEvents.PaymentCaptured, payment);
    return payment;
  }
}
