import { test } from "node:test";
import assert from "node:assert/strict";
import { rankCandidates } from "../domain/services/MatchingScorer";

test("ordena por score 60% cercanía / 40% calificación, el más cercano y mejor calificado primero", () => {
  const ranked = rankCandidates([
    { technicianId: "far-but-top-rated", name: "A", distanceKm: 9, rating: 5 },
    { technicianId: "close-and-rated", name: "B", distanceKm: 1, rating: 4.9 },
    { technicianId: "close-low-rated", name: "C", distanceKm: 1, rating: 3 },
  ]);

  assert.equal(ranked[0].technicianId, "close-and-rated");
  assert.ok(ranked[0].score > ranked[1].score);
});

test("limita el resultado a 5 candidatos", () => {
  const candidates = Array.from({ length: 8 }, (_, i) => ({
    technicianId: `t-${i}`,
    name: `T${i}`,
    distanceKm: i,
    rating: 4.5,
  }));

  assert.equal(rankCandidates(candidates).length, 5);
});
