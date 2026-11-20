import { Pool } from "pg";
import { Payment, PaymentStatus } from "../../domain/entities/Payment";
import { PaymentRepository } from "../../domain/ports/PaymentRepository";

interface PaymentRow {
  idempotency_key: string;
  id: string;
  request_id: string;
  amount: number;
  currency: string;
  method: string;
  status: PaymentStatus;
  captured_at: string;
}

function toPayment(row: PaymentRow): Payment {
  return {
    id: row.id,
    requestId: row.request_id,
    idempotencyKey: row.idempotency_key,
    amount: { amount: row.amount, currency: row.currency },
    method: row.method,
    status: row.status,
    capturedAt: new Date(row.captured_at).toISOString(),
  };
}

export class PgPaymentRepository implements PaymentRepository {
  constructor(private readonly pool: Pool) {}

  async findByIdempotencyKey(key: string): Promise<Payment | undefined> {
    const result = await this.pool.query<PaymentRow>("SELECT * FROM payments WHERE idempotency_key = $1", [key]);
    return result.rows[0] ? toPayment(result.rows[0]) : undefined;
  }

  async save(payment: Payment): Promise<void> {
    await this.pool.query(
      `INSERT INTO payments (idempotency_key, id, request_id, amount, currency, method, status, captured_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (idempotency_key) DO NOTHING`,
      [
        payment.idempotencyKey,
        payment.id,
        payment.requestId,
        payment.amount.amount,
        payment.amount.currency,
        payment.method,
        payment.status,
        payment.capturedAt,
      ],
    );
  }
}
