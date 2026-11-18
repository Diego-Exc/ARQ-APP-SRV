import { test } from "node:test";
import assert from "node:assert/strict";
import { DamageClassifier } from "../domain/services/DamageClassifier";

const trades = [
  { id: "plumbing", name: "Plomería", keywords: ["fuga", "gotea"] },
  { id: "electrical", name: "Electricidad", keywords: ["luz", "corto"] },
];

test("clasifica el oficio por palabras clave", () => {
  const classifier = new DamageClassifier(trades);
  const result = classifier.classify("hay una fuga debajo del lavaplatos");
  assert.equal(result.tradeId, "plumbing");
});

test("se degrada a selección manual cuando no reconoce el daño (escenario R1)", () => {
  const classifier = new DamageClassifier(trades);
  const result = classifier.classify("algo raro pasó en mi casa");
  assert.equal(result.tradeId, null);
});

test("marca urgencia cuando detecta palabras de riesgo inmediato", () => {
  const classifier = new DamageClassifier(trades);
  const result = classifier.classify("hay una fuga de agua urgente");
  assert.equal(result.urgency, "URGENTE");
});
