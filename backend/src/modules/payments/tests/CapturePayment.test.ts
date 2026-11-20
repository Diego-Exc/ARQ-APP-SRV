import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemoryPaymentRepository } from "../adapters/outbound/InMemoryPaymentRepository";
import { CapturePayment } from "../application/use-cases/CapturePayment";

test("es idempotente: reintentar con la misma clave nunca genera doble cobro", async () => {
  const capturePayment = new CapturePayment(new InMemoryPaymentRepository());
  const input = { requestId: "req-1", idempotencyKey: "idem-1", amount: 76500, method: "Nequi" };

  const first = await capturePayment.execute(input);
  const second = await capturePayment.execute(input);

  assert.equal(first.id, second.id);
});

test("genera pagos distintos para claves de idempotencia distintas", async () => {
  const capturePayment = new CapturePayment(new InMemoryPaymentRepository());

  const a = await capturePayment.execute({ requestId: "req-1", idempotencyKey: "idem-a", amount: 50000, method: "Nequi" });
  const b = await capturePayment.execute({ requestId: "req-1", idempotencyKey: "idem-b", amount: 50000, method: "Nequi" });

  assert.notEqual(a.id, b.id);
});
