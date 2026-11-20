import { Payment } from "../../domain/entities/Payment";
import { PaymentRepository } from "../../domain/ports/PaymentRepository";

// Usado por tests unitarios; el backend real usa PgPaymentRepository.
export class InMemoryPaymentRepository implements PaymentRepository {
  private readonly byIdempotencyKey = new Map<string, Payment>();

  async findByIdempotencyKey(key: string): Promise<Payment | undefined> {
    return this.byIdempotencyKey.get(key);
  }

  async save(payment: Payment): Promise<void> {
    this.byIdempotencyKey.set(payment.idempotencyKey, payment);
  }
}
