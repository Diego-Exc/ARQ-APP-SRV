export interface CapturePaymentInput {
  requestId: string;
  idempotencyKey: string;
  amount: number;
  currency?: string;
  method: string;
}
