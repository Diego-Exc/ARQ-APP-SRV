import { Payment } from "../entities/Payment";

export interface PaymentRepository {
  findByIdempotencyKey(key: string): Payment | undefined;
  save(payment: Payment): void;
}
