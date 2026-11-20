import { Payment } from "../entities/Payment";

export interface PaymentRepository {
  findByIdempotencyKey(key: string): Promise<Payment | undefined>;
  save(payment: Payment): Promise<void>;
}
