import { Money } from "../../../../shared/money";

export type PaymentStatus = "CAPTURED";

export interface Payment {
  id: string;
  requestId: string;
  idempotencyKey: string;
  amount: Money;
  method: string;
  status: PaymentStatus;
  capturedAt: string;
}
