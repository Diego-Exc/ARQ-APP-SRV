import { test } from "node:test";
import assert from "node:assert/strict";
import { assertTransition } from "../domain/entities/ServiceStateMachine";

test("permite una transición válida", () => {
  assert.doesNotThrow(() => assertTransition("MATCHING", "ASSIGNED"));
});

test("rechaza una transición inválida (sin doble asignación ni saltos de estado)", () => {
  assert.throws(() => assertTransition("SUBMITTED", "COMPLETED"));
  assert.throws(() => assertTransition("RATED", "ASSIGNED"));
});
