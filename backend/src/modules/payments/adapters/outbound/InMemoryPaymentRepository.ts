import { Payment } from "../../domain/entities/Payment";
import { PaymentRepository } from "../../domain/ports/PaymentRepository";

export class InMemoryPaymentRepository implements PaymentRepository {
  private readonly byIdempotencyKey = new Map<string, Payment>();

  findByIdempotencyKey(key: string): Payment | undefined {
    return this.byIdempotencyKey.get(key);
  }

  save(payment: Payment): void {
    this.byIdempotencyKey.set(payment.idempotencyKey, payment);
  }
}
