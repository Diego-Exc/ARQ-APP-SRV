import { GeoPoint } from "../../../../shared/geo";

export interface MatchCandidateInput {
  technicianId: string;
  name: string;
  distanceKm: number;
  rating: number;
}

export interface RankedCandidate extends MatchCandidateInput {
  score: number;
}

const MAX_RATING = 5;
const MAX_DISTANCE_FOR_SCORE_KM = 10;
const PROXIMITY_WEIGHT = 0.6;
const RATING_WEIGHT = 0.4;
const MAX_CANDIDATES = 5;

// Parámetros del matching híbrido definidos en la decisión de cierre del MVP
// (docs/01-investigacion-inicial.md, sección 10, punto 3) y formalizados en
// docs/adr/0004-modelo-matching.md: radio inicial 3 km, expansión en
// incrementos de 2 km hasta un máximo de 10 km; score 60% cercanía / 40%
// calificación; hasta 5 candidatos.
export const MATCHING_PARAMS = {
  initialRadiusKm: 3,
  radiusStepKm: 2,
  maxRadiusKm: MAX_DISTANCE_FOR_SCORE_KM,
  maxCandidates: MAX_CANDIDATES,
};

export function rankCandidates(candidates: MatchCandidateInput[]): RankedCandidate[] {
  return candidates
    .map((candidate) => {
      const proximityScore = 1 - Math.min(candidate.distanceKm, MAX_DISTANCE_FOR_SCORE_KM) / MAX_DISTANCE_FOR_SCORE_KM;
      const ratingScore = candidate.rating / MAX_RATING;
      const score = PROXIMITY_WEIGHT * proximityScore + RATING_WEIGHT * ratingScore;
      return { ...candidate, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CANDIDATES);
}

export function withinRadius<T extends { distanceKm: number }>(items: T[], radiusKm: number): T[] {
  return items.filter((item) => item.distanceKm <= radiusKm);
}

export type { GeoPoint };
