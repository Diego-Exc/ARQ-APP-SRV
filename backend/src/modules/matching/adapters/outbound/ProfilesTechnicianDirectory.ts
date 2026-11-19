import { ListAvailableTechniciansByTrade } from "../../../profiles/application/use-cases/ListAvailableTechniciansByTrade";
import { AvailableTechnician, TechnicianDirectoryPort } from "../../application/ports/TechnicianDirectoryPort";

// Adapta el caso de uso público de Profiles a lo que Matching necesita,
// respetando el límite de bounded context del ADR-0002.
export class ProfilesTechnicianDirectory implements TechnicianDirectoryPort {
  constructor(private readonly listAvailable: ListAvailableTechniciansByTrade) {}

  listAvailableByTrade(tradeId: string): AvailableTechnician[] {
    return this.listAvailable.execute(tradeId).map((profile) => ({
      id: profile.id,
      name: profile.name,
      location: profile.location,
      rating: profile.rating,
      reviews: profile.reviews,
    }));
  }
}
