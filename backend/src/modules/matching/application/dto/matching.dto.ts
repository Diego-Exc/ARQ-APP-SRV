export interface FindCandidatesInput {
  requestId: string;
  tradeId: string;
  clientLocation: { lat: number; lng: number };
}

export interface CandidateResult {
  technicianId: string;
  name: string;
  distanceKm: number;
  rating: number;
  score: number;
}

export interface FindCandidatesResult {
  candidates: CandidateResult[];
  radiusUsedKm: number;
}
