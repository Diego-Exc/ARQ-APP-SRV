export interface TechnicianOffer {
  requestId: string;
  tradeId: string;
  distanceKm: number;
  score: number;
  offeredAt: string;
}

export interface OfferRepository {
  recordOffers(
    tradeId: string,
    requestId: string,
    offers: { technicianId: string; distanceKm: number; score: number }[],
  ): Promise<void>;
  listForTechnician(technicianId: string): Promise<TechnicianOffer[]>;
  clearRequest(requestId: string): Promise<void>;
}
