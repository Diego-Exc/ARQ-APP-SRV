import { distanceKm } from "../../../../shared/geo";
import { Errors } from "../../../../shared/http-error";
import { MATCHING_PARAMS, rankCandidates, withinRadius } from "../../domain/services/MatchingScorer";
import { TechnicianDirectoryPort } from "../ports/TechnicianDirectoryPort";
import { LifecycleTransitionPort } from "../ports/LifecycleTransitionPort";
import { OfferRepository } from "../../domain/ports/OfferRepository";
import { FindCandidatesInput, FindCandidatesResult } from "../dto/matching.dto";

export class FindCandidates {
  constructor(
    private readonly directory: TechnicianDirectoryPort,
    private readonly lifecycle: LifecycleTransitionPort,
    private readonly offers: OfferRepository,
  ) {}

  async execute(input: FindCandidatesInput): Promise<FindCandidatesResult> {
    await this.lifecycle.markMatching(input.requestId);

    const available = await this.directory.listAvailableByTrade(input.tradeId);
    if (available.length === 0) {
      throw Errors.notFound("No hay técnicos disponibles para este oficio en este momento");
    }

    const withDistance = available.map((technician) => ({
      technicianId: technician.id,
      name: technician.name,
      distanceKm: distanceKm(input.clientLocation, technician.location),
      rating: technician.rating,
    }));

    let radius = MATCHING_PARAMS.initialRadiusKm;
    let inRange = withinRadius(withDistance, radius);
    while (inRange.length === 0 && radius < MATCHING_PARAMS.maxRadiusKm) {
      radius = Math.min(radius + MATCHING_PARAMS.radiusStepKm, MATCHING_PARAMS.maxRadiusKm);
      inRange = withinRadius(withDistance, radius);
    }

    if (inRange.length === 0) {
      throw Errors.notFound("No hay técnicos disponibles dentro del radio máximo de búsqueda");
    }

    const ranked = rankCandidates(inRange);
    await this.offers.recordOffers(
      input.tradeId,
      input.requestId,
      ranked.map((c) => ({ technicianId: c.technicianId, distanceKm: c.distanceKm, score: c.score })),
    );

    return {
      candidates: ranked.map((candidate) => ({
        technicianId: candidate.technicianId,
        name: candidate.name,
        distanceKm: Number(candidate.distanceKm.toFixed(2)),
        rating: candidate.rating,
        score: Number(candidate.score.toFixed(4)),
      })),
      radiusUsedKm: radius,
    };
  }
}
