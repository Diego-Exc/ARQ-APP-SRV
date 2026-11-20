import { ListAvailableTechniciansByTrade } from "../../../profiles/application/use-cases/ListAvailableTechniciansByTrade";
import { AvailableTechnician, TechnicianDirectoryPort } from "../../application/ports/TechnicianDirectoryPort";

// Adapta el caso de uso público de Profiles a lo que Matching necesita,
// respetando el límite de bounded context del ADR-0002.
export class ProfilesTechnicianDirectory implements TechnicianDirectoryPort {
  constructor(private readonly listAvailable: ListAvailableTechniciansByTrade) {}

  async listAvailableByTrade(tradeId: string): Promise<AvailableTechnician[]> {
    const profiles = await this.listAvailable.execute(tradeId);
    return profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      location: profile.location,
      rating: profile.rating,
      reviews: profile.reviews,
    }));
  }
}
