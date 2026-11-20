import { OfferRepository, TechnicianOffer } from "../../domain/ports/OfferRepository";

// Registro simple de "ofertas" de matching por técnico, para que la app Pro
// pueda listar las solicitudes que le fueron ofrecidas. Usado por tests
// unitarios; el backend real usa PgOfferRepository.
export class InMemoryOfferRepository implements OfferRepository {
  private readonly offersByTechnician = new Map<string, TechnicianOffer[]>();

  async recordOffers(
    tradeId: string,
    requestId: string,
    offers: { technicianId: string; distanceKm: number; score: number }[],
  ): Promise<void> {
    const offeredAt = new Date().toISOString();
    for (const offer of offers) {
      const existing = this.offersByTechnician.get(offer.technicianId) ?? [];
      const withoutDuplicate = existing.filter((o) => o.requestId !== requestId);
      withoutDuplicate.push({ requestId, tradeId, distanceKm: offer.distanceKm, score: offer.score, offeredAt });
      this.offersByTechnician.set(offer.technicianId, withoutDuplicate);
    }
  }

  async listForTechnician(technicianId: string): Promise<TechnicianOffer[]> {
    return this.offersByTechnician.get(technicianId) ?? [];
  }

  async clearRequest(requestId: string): Promise<void> {
    for (const [technicianId, offers] of this.offersByTechnician) {
      this.offersByTechnician.set(technicianId, offers.filter((o) => o.requestId !== requestId));
    }
  }
}
