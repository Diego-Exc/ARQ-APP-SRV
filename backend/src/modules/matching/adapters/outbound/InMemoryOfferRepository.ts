import { OfferRepository, TechnicianOffer } from "../../domain/ports/OfferRepository";

// Registro simple de "ofertas" de matching por técnico, para que la app Pro
// pueda listar las solicitudes que le fueron ofrecidas (ventana de ~45 s de
// la decisión de cierre del MVP). No reemplaza la máquina de estados de
// Service Lifecycle, que sigue siendo la fuente de verdad del servicio.
export class InMemoryOfferRepository implements OfferRepository {
  private readonly offersByTechnician = new Map<string, TechnicianOffer[]>();

  recordOffers(
    tradeId: string,
    requestId: string,
    offers: { technicianId: string; distanceKm: number; score: number }[],
  ): void {
    const offeredAt = new Date().toISOString();
    for (const offer of offers) {
      const existing = this.offersByTechnician.get(offer.technicianId) ?? [];
      const withoutDuplicate = existing.filter((o) => o.requestId !== requestId);
      withoutDuplicate.push({ requestId, tradeId, distanceKm: offer.distanceKm, score: offer.score, offeredAt });
      this.offersByTechnician.set(offer.technicianId, withoutDuplicate);
    }
  }

  listForTechnician(technicianId: string): TechnicianOffer[] {
    return this.offersByTechnician.get(technicianId) ?? [];
  }

  clearRequest(requestId: string): void {
    for (const [technicianId, offers] of this.offersByTechnician) {
      this.offersByTechnician.set(technicianId, offers.filter((o) => o.requestId !== requestId));
    }
  }
}
